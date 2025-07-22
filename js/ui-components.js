import Utils from './utils.js';
import PromptTemplates from './prompt-templates.js';
import SitemapGenerator from './sitemap-generator.js';

// UI コンポーネント管理クラス
class UIComponents {
    constructor() {
        this.modal = null;
        this.sidebar = null;
        this.promptTemplates = new PromptTemplates();
        this.sitemapGenerator = new SitemapGenerator();
        this.initializeComponents();
    }

    // コンポーネントの初期化
    initializeComponents() {
        this.modal = Utils.getElementById('modal');
        this.sidebar = Utils.getElementById('sidebar');
    }

    // キットカードの生成
    generateKitCard(kit) {
        const colorSwatches = kit.color_palette.map(color => 
            `<div class="color-swatch" style="background-color: ${color}"></div>`
        ).join('');

        const promptText = this.generatePromptForSiteType(kit, 'corporate');
        const isCustomKit = kit.is_custom || false;
        const customKitClass = isCustomKit ? ' custom-kit' : '';

        return `
            <div class="kit-card${customKitClass}" data-kit-id="${kit.id}">
                ${isCustomKit ? '<div class="custom-kit-indicator">カスタム</div>' : ''}
                <div class="kit-header">
                    <h3 class="kit-title">${kit.title}</h3>
                    <span class="kit-industry">${kit.industry}</span>
                </div>
                
                <div class="color-palette">
                    ${colorSwatches}
                </div>
                
                <div class="typography-info">
                    <div class="font-info">
                        <span class="font-label">見出し:</span>
                        <span class="font-name">${kit.fonts.heading}</span>
                    </div>
                    <div class="font-info">
                        <span class="font-label">本文:</span>
                        <span class="font-name">${kit.fonts.body}</span>
                    </div>
                </div>
                
                <div class="prompt-section">
                    <div class="prompt-text">${promptText}</div>
                </div>
                
                <div class="kit-actions">
                    <button class="copy-button" data-kit-id="${kit.id}">
                        <span class="copy-icon">📋</span>
                        <span class="copy-text">コピー</span>
                    </button>
                    ${isCustomKit ? `
                        <button class="twitter-proposal" data-kit-id="${kit.id}">
                            運営に提案
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
    }

    // サイトタイプ用のプロンプト生成（短縮版）
    generatePromptForSiteType(kit, siteType) {
        return this.promptTemplates.getPrompt(siteType, 'short', kit);
    }

    // 詳細プロンプトの生成
    generateDetailedPrompt(kit, siteType) {
        return this.promptTemplates.getPrompt(siteType, 'base', kit);
    }

    // Claude Code用のプロンプト生成
    generateClaudeCodePrompt(kit, siteType = 'corporate') {
        return this.promptTemplates.getPrompt(siteType, 'claude', kit);
    }

    // モーダルの表示
    showModal(kit, siteType = 'corporate') {
        if (!this.modal) return;

        const modalContent = this.modal.querySelector('.modal-content');
        if (!modalContent) return;

        const siteTypeName = this.promptTemplates.templates[siteType]?.name || 'Webサイト';
        const shortPrompt = this.generatePromptForSiteType(kit, siteType);
        const claudePrompt = this.generateClaudeCodePrompt(kit, siteType);
        const detailedPrompt = this.generateDetailedPrompt(kit, siteType);
        
        modalContent.innerHTML = `
            <div class="modal-header">
                <h2>${kit.title} - ${siteTypeName}プロンプト</h2>
                <span class="close" id="closeModal">&times;</span>
            </div>
            <div class="modal-body">
                <div class="prompt-tabs">
                    <button class="tab-button active" data-tab="claude">Claude Code用</button>
                    <button class="tab-button" data-tab="detailed">詳細版</button>
                    <button class="tab-button" data-tab="short">短縮版</button>
                    <button class="tab-button" data-tab="sitemap">サイトマップ</button>
                </div>
                
                <div class="prompt-content">
                    <div class="tab-panel active" id="claude-tab">
                        <div class="prompt-display">
                            <pre class="prompt-text">${claudePrompt}</pre>
                        </div>
                    </div>
                    <div class="tab-panel" id="detailed-tab">
                        <div class="prompt-display">
                            <pre class="prompt-text">${detailedPrompt}</pre>
                        </div>
                    </div>
                    <div class="tab-panel" id="short-tab">
                        <div class="prompt-display">
                            <pre class="prompt-text">${shortPrompt}</pre>
                        </div>
                    </div>
                    <div class="tab-panel" id="sitemap-tab">
                        ${this.generateSitemapTabContent(kit, siteType)}
                    </div>
                </div>
                
                <div class="modal-actions">
                    <button class="copy-prompt btn-primary">現在のプロンプトをコピー</button>
                    <button class="reload-prompt btn-secondary">プロンプトを再生成</button>
                </div>
            </div>
        `;

        this.modal.style.display = 'block';
        this.setupModalEventListeners(kit, siteType);
    }

    // モーダルのイベントリスナー設定
    setupModalEventListeners(kit, siteType) {
        const closeModal = this.modal.querySelector('#closeModal');
        const copyPromptBtn = this.modal.querySelector('.copy-prompt');
        const reloadBtn = this.modal.querySelector('.reload-prompt');
        const tabButtons = this.modal.querySelectorAll('.tab-button');

        Utils.addEventListenerSafe(closeModal, 'click', () => {
            this.hideModal();
        });

        // タブ切り替え
        tabButtons.forEach(button => {
            Utils.addEventListenerSafe(button, 'click', () => {
                const tabId = button.dataset.tab;
                this.switchTab(tabId, kit, siteType);
            });
        });

        Utils.addEventListenerSafe(copyPromptBtn, 'click', async () => {
            const activeTab = this.modal.querySelector('.tab-panel.active');
            
            if (activeTab.id === 'sitemap-tab') {
                // サイトマップタブの場合
                const copySitemapBtn = activeTab.querySelector('.copy-sitemap');
                if (copySitemapBtn) {
                    copySitemapBtn.click();
                }
            } else {
                // プロンプトタブの場合 - サイトタイプに基づいて正しいプロンプトを生成
                let promptText;
                const activeTabId = activeTab.id;
                
                if (activeTabId === 'claude-tab') {
                    promptText = this.generateClaudeCodePrompt(kit, siteType);
                } else if (activeTabId === 'detailed-tab') {
                    promptText = this.generateDetailedPrompt(kit, siteType);
                } else if (activeTabId === 'short-tab') {
                    promptText = this.generatePromptForSiteType(kit, siteType);
                }
                
                const success = await Utils.copyToClipboard(promptText);
                if (success) {
                    copyPromptBtn.textContent = 'コピー完了!';
                    setTimeout(() => {
                        copyPromptBtn.textContent = '現在のプロンプトをコピー';
                    }, 2000);
                }
            }
        });

        Utils.addEventListenerSafe(reloadBtn, 'click', () => {
            this.showModal(kit, siteType);
        });

        // サイトマップ専用イベントリスナー
        this.setupSitemapEventListeners(siteType);
    }

    // タブ切り替え機能
    switchTab(tabId, kit, siteType) {
        // 全てのタブボタンとパネルを非アクティブに
        this.modal.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
        this.modal.querySelectorAll('.tab-panel').forEach(panel => panel.classList.remove('active'));
        
        // 選択されたタブをアクティブに
        this.modal.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
        this.modal.querySelector(`#${tabId}-tab`).classList.add('active');
        
        // プロンプトタブの場合、コンテンツを現在のサイトタイプで更新
        if (kit && siteType && tabId !== 'sitemap') {
            this.updatePromptTabContent(tabId, kit, siteType);
        }
    }
    
    // プロンプトタブコンテンツ更新
    updatePromptTabContent(tabId, kit, siteType) {
        let promptText;
        
        if (tabId === 'claude') {
            promptText = this.generateClaudeCodePrompt(kit, siteType);
        } else if (tabId === 'detailed') {
            promptText = this.generateDetailedPrompt(kit, siteType);
        } else if (tabId === 'short') {
            promptText = this.generatePromptForSiteType(kit, siteType);
        }
        
        if (promptText) {
            const tabPanel = this.modal.querySelector(`#${tabId}-tab`);
            const promptElement = tabPanel.querySelector('.prompt-text');
            if (promptElement) {
                promptElement.textContent = promptText;
            }
        }
    }

    // サイトマップタブコンテンツ生成
    generateSitemapTabContent(kit, siteType) {
        const seoAdvice = this.sitemapGenerator.generateSEOAdvice(siteType);
        
        return `
            <div class="sitemap-container">
                <div class="sitemap-controls">
                    <div class="sitemap-format-selector">
                        <label>表示形式:</label>
                        <select id="sitemapFormat" class="format-select">
                            <option value="visual">ビジュアル構造図</option>
                            <option value="xml">XML Sitemap</option>
                            <option value="list">テキストリスト</option>
                        </select>
                    </div>
                    <div class="sitemap-domain-input">
                        <label>ドメイン:</label>
                        <input type="text" id="sitemapDomain" value="https://example.com" class="domain-input">
                    </div>
                    <button id="generateSitemap" class="btn-secondary">サイトマップ生成</button>
                </div>
                
                <div class="sitemap-display" id="sitemapDisplay">
                    ${this.sitemapGenerator.generateSitemap(siteType, 'visual')}
                </div>
                
                <div class="seo-advice">
                    <h4>🚀 SEO最適化アドバイス</h4>
                    <ul class="advice-list">
                        ${seoAdvice.map(advice => `<li>${advice}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="sitemap-actions">
                    <button class="copy-sitemap btn-primary">サイトマップをコピー</button>
                    <button class="download-sitemap btn-secondary">XMLファイルをダウンロード</button>
                </div>
            </div>
        `;
    }

    // サイトマップ専用イベントリスナー設定
    setupSitemapEventListeners(siteType) {
        // サイトマップ生成ボタン
        const generateBtn = this.modal.querySelector('#generateSitemap');
        Utils.addEventListenerSafe(generateBtn, 'click', () => {
            this.regenerateSitemap(siteType);
        });

        // フォーマット変更
        const formatSelect = this.modal.querySelector('#sitemapFormat');
        Utils.addEventListenerSafe(formatSelect, 'change', () => {
            this.regenerateSitemap(siteType);
        });

        // サイトマップコピーボタン
        const copySitemapBtn = this.modal.querySelector('.copy-sitemap');
        Utils.addEventListenerSafe(copySitemapBtn, 'click', async () => {
            const format = formatSelect.value;
            const domain = this.modal.querySelector('#sitemapDomain').value;
            const sitemapContent = this.getSitemapContentForCopy(siteType, format, domain);
            
            const success = await Utils.copyToClipboard(sitemapContent);
            if (success) {
                copySitemapBtn.textContent = 'コピー完了!';
                setTimeout(() => {
                    copySitemapBtn.textContent = 'サイトマップをコピー';
                }, 2000);
            }
        });

        // XMLダウンロードボタン
        const downloadBtn = this.modal.querySelector('.download-sitemap');
        Utils.addEventListenerSafe(downloadBtn, 'click', () => {
            this.downloadXMLSitemap(siteType);
        });
    }

    // サイトマップ再生成
    regenerateSitemap(siteType) {
        const formatSelect = this.modal.querySelector('#sitemapFormat');
        const domainInput = this.modal.querySelector('#sitemapDomain');
        const displayDiv = this.modal.querySelector('#sitemapDisplay');
        
        const format = formatSelect.value;
        const domain = domainInput.value || 'https://example.com';
        
        const sitemapContent = this.sitemapGenerator.generateSitemap(siteType, format, domain);
        
        if (format === 'visual') {
            displayDiv.innerHTML = sitemapContent;
        } else {
            displayDiv.innerHTML = `<pre class="sitemap-text">${sitemapContent}</pre>`;
        }
    }

    // コピー用サイトマップコンテンツ取得
    getSitemapContentForCopy(siteType, format, domain) {
        if (format === 'visual') {
            // ビジュアル表示の場合はリスト形式でコピー
            return this.sitemapGenerator.generateSitemap(siteType, 'list', domain);
        } else {
            return this.sitemapGenerator.generateSitemap(siteType, format, domain);
        }
    }

    // XMLサイトマップダウンロード
    downloadXMLSitemap(siteType) {
        const domainInput = this.modal.querySelector('#sitemapDomain');
        const domain = domainInput.value || 'https://example.com';
        
        const xmlContent = this.sitemapGenerator.generateSitemap(siteType, 'xml', domain);
        
        // BlobとしてXMLを作成
        const blob = new Blob([xmlContent], { type: 'text/xml' });
        const url = URL.createObjectURL(blob);
        
        // ダウンロードリンクを作成
        const a = document.createElement('a');
        a.href = url;
        a.download = 'sitemap.xml';
        document.body.appendChild(a);
        a.click();
        
        // クリーンアップ
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // モーダルの非表示
    hideModal() {
        if (this.modal) {
            this.modal.style.display = 'none';
        }
    }

    // サイドバーの表示
    showSidebar() {
        if (!this.sidebar) return;
        
        this.sidebar.classList.add('open');
        const overlay = Utils.getElementById('sidebarOverlay');
        if (overlay) {
            overlay.classList.add('show');
        }
        document.body.style.overflow = 'hidden';
    }

    // サイドバーの非表示
    hideSidebar() {
        if (!this.sidebar) return;
        
        this.sidebar.classList.remove('open');
        const overlay = Utils.getElementById('sidebarOverlay');
        if (overlay) {
            overlay.classList.remove('show');
        }
        document.body.style.overflow = '';
    }

    // フィルターオプションの生成
    generateIndustryOptions(industries) {
        return industries.map(industry => 
            `<option value="${industry}">${industry}</option>`
        ).join('');
    }

    // ページネーション要素の生成
    generatePagination(currentPage, totalPages) {
        if (totalPages <= 1) return '';

        let pagination = '<div class="pagination">';
        
        // 前のページボタン
        if (currentPage > 1) {
            pagination += `<button class="page-btn" data-page="${currentPage - 1}">« 前</button>`;
        }
        
        // ページ番号
        const startPage = Math.max(1, currentPage - 2);
        const endPage = Math.min(totalPages, currentPage + 2);
        
        if (startPage > 1) {
            pagination += `<button class="page-btn" data-page="1">1</button>`;
            if (startPage > 2) {
                pagination += '<span class="pagination-ellipsis">...</span>';
            }
        }
        
        for (let i = startPage; i <= endPage; i++) {
            const isActive = i === currentPage ? ' active' : '';
            pagination += `<button class="page-btn${isActive}" data-page="${i}">${i}</button>`;
        }
        
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                pagination += '<span class="pagination-ellipsis">...</span>';
            }
            pagination += `<button class="page-btn" data-page="${totalPages}">${totalPages}</button>`;
        }
        
        // 次のページボタン
        if (currentPage < totalPages) {
            pagination += `<button class="page-btn" data-page="${currentPage + 1}">次 »</button>`;
        }
        
        pagination += '</div>';
        return pagination;
    }

    // 結果数の表示
    displayResultCount(filteredCount, totalCount) {
        const resultElement = Utils.getElementById('result-count');
        if (resultElement) {
            resultElement.textContent = `${filteredCount} / ${totalCount} 件`;
        }
    }
}

export default UIComponents;