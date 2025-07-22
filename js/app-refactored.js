import Utils from './utils.js';
import DataManager from './data-manager.js';
import UIComponents from './ui-components.js';
import EventManager from './event-manager.js';
import CustomKitManager from './custom-kit-manager.js';
import PromptTemplates from './prompt-templates.js';

// リファクタリングされたメインアプリケーションクラス
class WebDesignKitApp {
    constructor() {
        // 依存関係の初期化
        this.dataManager = new DataManager();
        this.uiComponents = new UIComponents();
        this.customKitManager = new CustomKitManager();
        this.promptTemplates = new PromptTemplates();
        this.eventManager = new EventManager(this);
        
        // 状態管理
        this.currentPage = 1;
        this.itemsPerPage = 24;
        this.currentSiteType = 'corporate';
        this.currentFilters = {
            search: '',
            industry: '',
            colors: [],
            siteType: ''
        };
        this.currentSort = [];

        this.initializeApp();
    }

    // アプリケーションの初期化
    async initializeApp() {
        try {
            console.log('アプリケーション初期化開始...');
            
            Utils.showLoading();
            
            await this.dataManager.loadData();
            console.log('データ読み込み完了:', this.dataManager.getKitData().length, '件');
            
            // カスタムKitを統合
            this.integrateCustomKits();
            
            // URLからのカスタムKit読み込み
            this.loadKitFromURL();
            
            this.setupInitialUI();
            this.eventManager.setupAllEventListeners();
            
            this.updateSiteTypeDescription();
            await this.renderKits();
            
            Utils.hideLoading();
            console.log('初期化完了');
            
        } catch (error) {
            console.error('アプリの初期化に失敗しました:', error);
            Utils.showError('データの読み込みに失敗しました。詳細: ' + error.message);
            Utils.hideLoading();
        }
    }

    // 初期UI設定
    setupInitialUI() {
        this.populateIndustryFilter();
        this.setupSiteTypes();
        this.setupColorFilters();
    }

    // 業種フィルターの設定
    populateIndustryFilter() {
        const industryFilter = Utils.getElementById('industryFilter');
        if (!industryFilter) return;

        const industries = this.dataManager.getIndustries();
        const options = this.uiComponents.generateIndustryOptions(industries);
        industryFilter.innerHTML = '<option value="">すべての業種</option>' + options;
    }

    // サイトタイプの設定
    setupSiteTypes() {
        const siteTypes = this.dataManager.getSiteTypes();
        const selector = Utils.getElementById('siteTypeSelector');
        if (selector && siteTypes.length > 0) {
            const options = siteTypes.map(type => 
                `<option value="${type}">${this.getSiteTypeLabel(type)}</option>`
            ).join('');
            selector.innerHTML = options;
        }
    }

    // カラーフィルターの設定
    setupColorFilters() {
        // カラーフィルターのUIを動的に生成
        const uniqueColors = this.dataManager.getUniqueColors();
        // 実装は省略（必要に応じて追加）
    }

    // サイトタイプのラベル取得
    getSiteTypeLabel(type) {
        const labels = {
            corporate: 'コーポレートサイト',
            lp: 'ランディングページ', 
            ecommerce: 'ECサイト',
            blog: 'ブログ',
            portfolio: 'ポートフォリオ',
            restaurant: 'レストラン',
            clinic: 'クリニック',
            salon: 'サロン'
        };
        return labels[type] || type;
    }

    // サイトタイプの説明を更新
    updateSiteTypeDescription() {
        const descriptionElement = Utils.getElementById('siteTypeDescription');
        if (!descriptionElement) return;

        const description = this.promptTemplates.getSiteTypeDescription(this.currentSiteType);
        descriptionElement.textContent = description;
    }

    // キットの描画
    async renderKits() {
        const container = Utils.getElementById('kitGrid');
        if (!container) {
            console.error('kitGridコンテナが見つかりません');
            return;
        }

        // フィルタリングとソート
        this.applyFiltersAndSort();

        // ページネーション
        const paginatedData = this.dataManager.getPaginatedData(this.currentPage, this.itemsPerPage);
        
        if (paginatedData.length === 0) {
            container.innerHTML = '<div class="no-results">条件に一致するキットが見つかりませんでした。</div>';
            return;
        }

        // キットカードの生成
        const cardsHtml = paginatedData.map(kit => 
            this.uiComponents.generateKitCard(kit)
        ).join('');

        container.innerHTML = cardsHtml;

        // ページネーションの描画
        this.renderPagination();

        // 結果数の表示
        const filteredCount = this.dataManager.getFilteredData().length;
        const totalCount = this.dataManager.getKitData().length;
        this.uiComponents.displayResultCount(filteredCount, totalCount);

        // フォントの読み込み
        await this.loadVisibleFonts(paginatedData);
    }

    // フィルターとソートの適用
    applyFiltersAndSort() {
        // フィルタリング
        this.dataManager.filterData(
            this.currentFilters.search,
            this.currentFilters.industry,
            this.currentFilters.colors,
            this.currentFilters.siteType
        );

        // ソート
        this.dataManager.sortData(this.currentSort);
    }

    // ページネーションの描画
    renderPagination() {
        const container = Utils.getElementById('pagination-container');
        if (!container) return;

        const totalPages = this.dataManager.getTotalPages(this.itemsPerPage);
        const paginationHtml = this.uiComponents.generatePagination(this.currentPage, totalPages);
        container.innerHTML = paginationHtml;
    }

    // 表示中のフォントを読み込み
    async loadVisibleFonts(kits) {
        const fontPromises = [];
        const loadedFonts = new Set();

        kits.forEach(kit => {
            [kit.fonts.heading, kit.fonts.body].forEach(font => {
                if (!loadedFonts.has(font)) {
                    loadedFonts.add(font);
                    fontPromises.push(this.loadFont(font));
                }
            });
        });

        await Promise.all(fontPromises);
    }

    // フォントの読み込み
    async loadFont(fontName) {
        try {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontName)}:wght@300;400;500;600;700&display=swap`;
            document.head.appendChild(link);
        } catch (error) {
            console.warn(`フォントの読み込みに失敗: ${fontName}`, error);
        }
    }

    // イベントハンドラー
    async handleSearch() {
        const searchInput = Utils.getElementById('searchInput');
        this.currentFilters.search = searchInput ? searchInput.value : '';
        this.currentPage = 1;
        await this.renderKits();
    }

    async handleFilterChange() {
        this.updateCurrentFilters();
        this.currentPage = 1;
        await this.renderKits();
    }

    async handleSiteTypeChange(siteType) {
        this.currentSiteType = siteType;
        this.currentFilters.siteType = siteType;
        this.updateSiteTypeDescription();
        await this.updatePromptsForSiteType();
        await this.renderKits();
    }

    async handleSortChange() {
        this.updateCurrentSort();
        await this.renderKits();
    }

    handleClearSort() {
        this.currentSort = [];
        const sortCheckboxes = Utils.querySelectorAll('.sort-checkbox input[type="checkbox"]');
        sortCheckboxes.forEach(checkbox => checkbox.checked = false);
        this.renderKits();
    }

    async handlePageChange(page) {
        this.currentPage = page;
        await this.renderKits();
        window.scrollTo(0, 0);
    }

    async handleKitCardClick(kitId) {
        const kit = this.dataManager.getKitData().find(k => k.id === kitId);
        if (kit) {
            this.uiComponents.showModal(kit, this.currentSiteType);
        }
    }

    async handleCopyButtonClick(kitId) {
        const kit = this.dataManager.getKitData().find(k => k.id === kitId);
        if (!kit) return;

        const prompt = this.uiComponents.generatePromptForSiteType(kit, this.currentSiteType);
        const success = await Utils.copyToClipboard(prompt);
        
        if (success) {
            const button = document.querySelector(`[data-kit-id="${kitId}"] .copy-text`);
            if (button) {
                const originalText = button.textContent;
                button.textContent = 'コピー完了!';
                setTimeout(() => {
                    button.textContent = originalText;
                }, 2000);
            }
        }
    }

    async handleTwitterProposal(kitId) {
        const kit = this.dataManager.getKitData().find(k => k.id === kitId);
        if (kit && kit.is_custom) {
            this.showTwitterProposal(kit);
        }
    }

    // カスタムKit関連メソッド
    integrateCustomKits() {
        const customKits = this.customKitManager.getCustomKits();
        if (customKits.length > 0) {
            const allKits = [...this.dataManager.getKitData(), ...customKits];
            this.dataManager.kitData = allKits;
            this.dataManager.filteredData = [...allKits];
            console.log('カスタムKit統合完了:', customKits.length, '件');
        }
    }

    loadKitFromURL() {
        const urlKit = this.customKitManager.loadKitFromURL();
        if (urlKit) {
            this.showCustomKitModal(urlKit);
        }
    }

    showCustomKitModal(editKit = null) {
        const modal = Utils.getElementById('customKitModal');
        const modalBody = Utils.getElementById('customKitModalBody');
        
        if (!modal || !modalBody) return;
        
        modalBody.innerHTML = this.customKitManager.generateCustomKitForm(editKit);
        modal.style.display = 'block';
        
        this.setupCustomKitFormEvents(editKit);
    }

    hideCustomKitModal() {
        const modal = Utils.getElementById('customKitModal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    setupCustomKitFormEvents(editKit = null) {
        this.setupColorPaletteEvents();
        this.setupFormPreviewEvents();
        this.setupFormActionEvents(editKit);
        this.setupModalCloseEvents();
    }

    setupColorPaletteEvents() {
        // 定義済みカラーのクリック
        const predefinedColors = Utils.querySelectorAll('.predefined-color');
        predefinedColors.forEach(colorEl => {
            Utils.addEventListenerSafe(colorEl, 'click', () => {
                this.addColorToPalette(colorEl.dataset.color);
            });
        });

        // カスタムカラー追加
        const addCustomColorBtn = Utils.getElementById('addCustomColor');
        Utils.addEventListenerSafe(addCustomColorBtn, 'click', () => {
            const colorPicker = Utils.getElementById('customColorPicker');
            if (colorPicker) {
                this.addColorToPalette(colorPicker.value);
            }
        });

        // カラー削除
        this.setupColorRemovalEvents();
    }

    setupColorRemovalEvents() {
        const removeButtons = Utils.querySelectorAll('.remove-color');
        removeButtons.forEach(button => {
            Utils.addEventListenerSafe(button, 'click', () => {
                this.removeColorFromPalette(parseInt(button.dataset.index));
            });
        });
    }

    addColorToPalette(color) {
        const selectedColorsContainer = Utils.getElementById('selectedColors');
        if (!selectedColorsContainer) return;

        const existingColors = Array.from(Utils.querySelectorAll('.selected-color .color-code'))
            .map(el => el.textContent);

        if (existingColors.includes(color)) {
            alert('この色は既に選択されています');
            return;
        }

        if (existingColors.length >= 8) {
            alert('カラーパレットは最大8色まで選択できます');
            return;
        }

        const colorIndex = existingColors.length;
        const colorHTML = `
            <div class="selected-color" data-index="${colorIndex}">
                <div class="color-swatch" style="background-color: ${color}"></div>
                <span class="color-code">${color}</span>
                <button type="button" class="remove-color" data-index="${colorIndex}">×</button>
            </div>
        `;

        selectedColorsContainer.insertAdjacentHTML('beforeend', colorHTML);
        this.setupColorRemovalEvents();
        this.updatePreview();
    }

    removeColorFromPalette(index) {
        const colorElement = document.querySelector(`[data-index="${index}"]`);
        if (colorElement) {
            colorElement.remove();
            this.reindexColors();
            this.updatePreview();
        }
    }

    reindexColors() {
        const colorElements = Utils.querySelectorAll('.selected-color');
        colorElements.forEach((el, index) => {
            el.dataset.index = index;
            const removeBtn = el.querySelector('.remove-color');
            if (removeBtn) {
                removeBtn.dataset.index = index;
            }
        });
    }

    setupFormPreviewEvents() {
        const previewBtn = Utils.getElementById('previewKit');
        Utils.addEventListenerSafe(previewBtn, 'click', () => {
            this.updatePreview();
        });

        // フォーム要素の変更でプレビューを自動更新
        const formElements = ['kitTitle', 'kitIndustry', 'kitSiteType', 'headingFont', 'bodyFont'];
        formElements.forEach(elementId => {
            const element = Utils.getElementById(elementId);
            Utils.addEventListenerSafe(element, 'input', () => {
                this.updatePreview();
            });
            Utils.addEventListenerSafe(element, 'change', () => {
                this.updatePreview();
            });
        });
    }

    updatePreview() {
        const previewContainer = Utils.getElementById('kitPreview');
        if (!previewContainer) return;

        const formData = this.customKitManager.getFormData();
        const kit = {
            title: formData.title || 'Kit名を入力してください',
            industry: formData.industry || '業種未選択',
            color_palette: formData.colorPalette,
            fonts: {
                heading: formData.headingFont,
                body: formData.bodyFont
            },
            site_type: formData.siteType
        };

        previewContainer.innerHTML = this.customKitManager.generateKitPreview(kit);
    }

    setupFormActionEvents(editKit) {
        const saveBtn = Utils.getElementById('saveKit');
        const cancelBtn = Utils.getElementById('cancelKit');
        const deleteBtn = Utils.getElementById('deleteKit');

        Utils.addEventListenerSafe(saveBtn, 'click', () => {
            this.saveCustomKit(editKit);
        });

        Utils.addEventListenerSafe(cancelBtn, 'click', () => {
            this.hideCustomKitModal();
        });

        if (deleteBtn && editKit) {
            Utils.addEventListenerSafe(deleteBtn, 'click', () => {
                this.deleteCustomKit(editKit.id);
            });
        }
    }

    setupModalCloseEvents() {
        const closeBtn = Utils.getElementById('closeCustomKitModal');
        const modal = Utils.getElementById('customKitModal');

        Utils.addEventListenerSafe(closeBtn, 'click', () => {
            this.hideCustomKitModal();
        });

        Utils.addEventListenerSafe(window, 'click', (e) => {
            if (e.target === modal) {
                this.hideCustomKitModal();
            }
        });
    }

    saveCustomKit(editKit = null) {
        const formData = this.customKitManager.getFormData();
        const errors = this.customKitManager.validateKitData(formData);

        if (errors.length > 0) {
            alert('入力エラー:\n' + errors.join('\n'));
            return;
        }

        try {
            let savedKit;
            if (editKit) {
                savedKit = this.customKitManager.updateCustomKit(editKit.id, formData);
            } else {
                savedKit = this.customKitManager.createCustomKit(formData);
            }

            if (savedKit) {
                this.integrateCustomKits();
                this.hideCustomKitModal();
                this.renderKits();
                
                // Twitter提案ボタンを表示
                this.showTwitterProposal(savedKit);
            }
        } catch (error) {
            console.error('カスタムKitの保存に失敗:', error);
            alert('保存に失敗しました。もう一度お試しください。');
        }
    }

    deleteCustomKit(kitId) {
        if (confirm('このカスタムKitを削除しますか？')) {
            const success = this.customKitManager.deleteCustomKit(kitId);
            if (success) {
                this.integrateCustomKits();
                this.hideCustomKitModal();
                this.renderKits();
            }
        }
    }

    showTwitterProposal(kit) {
        const twitterURL = this.customKitManager.generateTwitterURL(kit);
        const confirmed = confirm(`カスタムKit「${kit.title}」を運営に提案しますか？\n\nTwitterで@METANA_flowにメンションを送信します。`);
        
        if (confirmed) {
            window.open(twitterURL, '_blank');
        }
    }

    // カスタムKit作成ボタンのイベントハンドラー
    handleCreateCustomKit() {
        this.showCustomKitModal();
    }

    // ヘルパーメソッド
    updateCurrentFilters() {
        const searchInput = Utils.getElementById('searchInput');
        const industryFilter = Utils.getElementById('industryFilter');
        const colorCheckboxes = Utils.querySelectorAll('.color-checkbox input[type="checkbox"]:checked');

        this.currentFilters = {
            search: searchInput ? searchInput.value : '',
            industry: industryFilter ? industryFilter.value : '',
            colors: Array.from(colorCheckboxes).map(cb => cb.value),
            siteType: this.currentSiteType
        };
    }

    updateCurrentSort() {
        const sortCheckboxes = Utils.querySelectorAll('.sort-checkbox input[type="checkbox"]:checked');
        this.currentSort = Array.from(sortCheckboxes).map(cb => cb.value);
    }

    async updatePromptsForSiteType() {
        const kitCards = Utils.querySelectorAll('.kit-card');
        kitCards.forEach(card => {
            const kitId = card.dataset.kitId;
            const kit = this.dataManager.getKitData().find(k => k.id === kitId);
            if (kit) {
                const promptElement = card.querySelector('.prompt-text');
                if (promptElement) {
                    promptElement.textContent = this.uiComponents.generatePromptForSiteType(kit, this.currentSiteType);
                }
            }
        });
    }
}

// アプリケーションの起動
document.addEventListener('DOMContentLoaded', () => {
    new WebDesignKitApp();
});

export default WebDesignKitApp;