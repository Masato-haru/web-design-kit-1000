import Utils from './utils.js';
import PromptTemplates from './prompt-templates.js';

// カスタムKit管理クラス
class CustomKitManager {
    constructor() {
        this.customKits = this.loadCustomKits();
        this.currentEditingKit = null;
        this.promptTemplates = new PromptTemplates();
        this.predefinedColors = [
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
            '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
            '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D5A6BD'
        ];
        this.popularFonts = [
            'Noto Sans JP', 'Noto Serif JP', 'M PLUS 1p', 'Hiragino Sans',
            'Yu Gothic', 'Zen Kaku Gothic New', 'Source Han Sans', 'Meiryo',
            'MS Gothic', 'Helvetica', 'Arial', 'Georgia', 'Times New Roman'
        ];
    }

    // ローカルストレージからカスタムKitを読み込み
    loadCustomKits() {
        try {
            const saved = localStorage.getItem('customWebDesignKits');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('カスタムKitの読み込みに失敗:', error);
            return [];
        }
    }

    // ローカルストレージにカスタムKitを保存
    saveCustomKits() {
        try {
            localStorage.setItem('customWebDesignKits', JSON.stringify(this.customKits));
        } catch (error) {
            console.error('カスタムKitの保存に失敗:', error);
        }
    }

    // 新しいカスタムKitを作成
    createCustomKit(kitData) {
        const newKit = {
            id: 'custom-' + Date.now(),
            title: kitData.title,
            industry: kitData.industry,
            color_palette: kitData.colorPalette,
            fonts: {
                heading: kitData.headingFont,
                body: kitData.bodyFont
            },
            site_type: kitData.siteType || 'corporate',
            created_at: new Date().toISOString(),
            is_custom: true
        };

        this.customKits.push(newKit);
        this.saveCustomKits();
        return newKit;
    }

    // カスタムKitを更新
    updateCustomKit(kitId, kitData) {
        const index = this.customKits.findIndex(kit => kit.id === kitId);
        if (index === -1) return null;

        this.customKits[index] = {
            ...this.customKits[index],
            title: kitData.title,
            industry: kitData.industry,
            color_palette: kitData.colorPalette,
            fonts: {
                heading: kitData.headingFont,
                body: kitData.bodyFont
            },
            site_type: kitData.siteType,
            updated_at: new Date().toISOString()
        };

        this.saveCustomKits();
        return this.customKits[index];
    }

    // カスタムKitを削除
    deleteCustomKit(kitId) {
        const index = this.customKits.findIndex(kit => kit.id === kitId);
        if (index === -1) return false;

        this.customKits.splice(index, 1);
        this.saveCustomKits();
        return true;
    }

    // カスタムKit一覧を取得
    getCustomKits() {
        return this.customKits;
    }

    // IDでカスタムKitを取得
    getCustomKitById(kitId) {
        return this.customKits.find(kit => kit.id === kitId);
    }

    // カスタムKit作成フォームのHTML生成
    generateCustomKitForm(editKit = null) {
        const isEdit = editKit !== null;
        const kit = editKit || {
            title: '',
            industry: '',
            color_palette: ['#FF6B6B', '#4ECDC4', '#45B7D1'],
            fonts: { heading: 'Noto Sans JP', body: 'Noto Sans JP' },
            site_type: 'corporate'
        };

        return `
            <div class="custom-kit-form">
                <h3>${isEdit ? 'Kitを編集' : 'カスタムKitを作成'}</h3>
                
                <div class="form-group">
                    <label for="kitTitle">Kit名 *</label>
                    <input type="text" id="kitTitle" value="${kit.title}" 
                           placeholder="例: モダンコーポレートブルー" required>
                </div>

                <div class="form-group">
                    <label for="kitIndustry">業種 *</label>
                    <select id="kitIndustry" required>
                        <option value="">業種を選択</option>
                        <option value="IT・テクノロジー" ${kit.industry === 'IT・テクノロジー' ? 'selected' : ''}>IT・テクノロジー</option>
                        <option value="コンサルティング" ${kit.industry === 'コンサルティング' ? 'selected' : ''}>コンサルティング</option>
                        <option value="金融・保険" ${kit.industry === '金融・保険' ? 'selected' : ''}>金融・保険</option>
                        <option value="医療・ヘルスケア" ${kit.industry === '医療・ヘルスケア' ? 'selected' : ''}>医療・ヘルスケア</option>
                        <option value="教育・スクール" ${kit.industry === '教育・スクール' ? 'selected' : ''}>教育・スクール</option>
                        <option value="不動産・建設" ${kit.industry === '不動産・建設' ? 'selected' : ''}>不動産・建設</option>
                        <option value="飲食・レストラン" ${kit.industry === '飲食・レストラン' ? 'selected' : ''}>飲食・レストラン</option>
                        <option value="美容・ファッション" ${kit.industry === '美容・ファッション' ? 'selected' : ''}>美容・ファッション</option>
                        <option value="エンタメ・アート" ${kit.industry === 'エンタメ・アート' ? 'selected' : ''}>エンタメ・アート</option>
                        <option value="その他" ${kit.industry === 'その他' ? 'selected' : ''}>その他</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="kitSiteType">サイトタイプ</label>
                    <select id="kitSiteType">
                        <option value="corporate" ${kit.site_type === 'corporate' ? 'selected' : ''}>企業サイト</option>
                        <option value="ecommerce" ${kit.site_type === 'ecommerce' ? 'selected' : ''}>ECサイト</option>
                        <option value="blog" ${kit.site_type === 'blog' ? 'selected' : ''}>ブログ</option>
                        <option value="portfolio" ${kit.site_type === 'portfolio' ? 'selected' : ''}>ポートフォリオ</option>
                        <option value="landing" ${kit.site_type === 'landing' ? 'selected' : ''}>ランディングページ</option>
                    </select>
                </div>

                <div class="form-group">
                    <label>カラーパレット *</label>
                    <div class="color-palette-editor">
                        <div class="selected-colors" id="selectedColors">
                            ${this.generateSelectedColorsHTML(kit.color_palette)}
                        </div>
                        <div class="predefined-colors">
                            ${this.generatePredefinedColorsHTML()}
                        </div>
                        <div class="custom-color-input">
                            <input type="color" id="customColorPicker" value="#FF6B6B">
                            <button type="button" id="addCustomColor">カスタム色を追加</button>
                        </div>
                    </div>
                </div>

                <div class="form-group">
                    <label for="headingFont">見出しフォント *</label>
                    <select id="headingFont" required>
                        ${this.generateFontOptions(kit.fonts.heading)}
                    </select>
                </div>

                <div class="form-group">
                    <label for="bodyFont">本文フォント *</label>
                    <select id="bodyFont" required>
                        ${this.generateFontOptions(kit.fonts.body)}
                    </select>
                </div>

                <div class="form-preview" id="kitPreview">
                    ${this.generateKitPreview(kit)}
                </div>

                <div class="form-actions">
                    <button type="button" id="previewKit" class="btn-secondary">プレビュー更新</button>
                    <button type="button" id="saveKit" class="btn-primary">
                        ${isEdit ? '更新' : '保存'}
                    </button>
                    <button type="button" id="cancelKit" class="btn-secondary">キャンセル</button>
                    ${isEdit ? '<button type="button" id="deleteKit" class="btn-danger">削除</button>' : ''}
                </div>
            </div>
        `;
    }

    // 選択済みカラーのHTML生成
    generateSelectedColorsHTML(colors) {
        return colors.map((color, index) => `
            <div class="selected-color" data-index="${index}">
                <div class="color-swatch" style="background-color: ${color}"></div>
                <span class="color-code">${color}</span>
                <button type="button" class="remove-color" data-index="${index}">×</button>
            </div>
        `).join('');
    }

    // 定義済みカラーのHTML生成
    generatePredefinedColorsHTML() {
        return this.predefinedColors.map(color => `
            <div class="predefined-color" data-color="${color}" style="background-color: ${color}" 
                 title="${color}"></div>
        `).join('');
    }

    // フォントオプションのHTML生成
    generateFontOptions(selectedFont) {
        return this.popularFonts.map(font => `
            <option value="${font}" ${font === selectedFont ? 'selected' : ''}>${font}</option>
        `).join('');
    }

    // Kitプレビューの生成
    generateKitPreview(kit) {
        const colorSwatches = kit.color_palette.map(color => 
            `<div class="preview-color-swatch" style="background-color: ${color}"></div>`
        ).join('');

        return `
            <div class="kit-preview-card">
                <div class="preview-header">
                    <h4 style="font-family: '${kit.fonts.heading}', sans-serif">${kit.title || 'Kit名を入力してください'}</h4>
                    <span class="preview-industry">${kit.industry || '業種未選択'}</span>
                </div>
                <div class="preview-colors">
                    ${colorSwatches}
                </div>
                <div class="preview-fonts">
                    <div class="preview-font-info">
                        <span>見出し: </span>
                        <span style="font-family: '${kit.fonts.heading}', sans-serif">${kit.fonts.heading}</span>
                    </div>
                    <div class="preview-font-info">
                        <span>本文: </span>
                        <span style="font-family: '${kit.fonts.body}', sans-serif">${kit.fonts.body}</span>
                    </div>
                </div>
            </div>
        `;
    }

    // Twitter提案用のURL生成
    generateTwitterURL(kit) {
        const baseURL = window.location.origin + window.location.pathname;
        const kitData = encodeURIComponent(JSON.stringify({
            title: kit.title,
            industry: kit.industry,
            color_palette: kit.color_palette,
            fonts: kit.fonts,
            site_type: kit.site_type
        }));
        
        const shareURL = `${baseURL}?custom_kit=${kitData}`;
        const siteTypeName = this.promptTemplates.templates[kit.site_type]?.name || 'Webサイト';
        const shortPrompt = this.promptTemplates.getPrompt(kit.site_type, 'short', kit);
        
        const tweetText = `WebデザインKIT提案！💡

『${kit.title}』
📋 業種: ${kit.industry}
🎨 カラー: ${kit.color_palette.join(', ')}
✏️ フォント: ${kit.fonts.heading} / ${kit.fonts.body}
🌐 サイトタイプ: ${siteTypeName}

${shortPrompt}

@METANA_flow さん、このKitはいかがでしょうか？

${shareURL}

#WebデザインKIT #${kit.industry.replace(/・/g, '')} #デザイン`;
        
        return `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
    }

    // カスタムKitをURLパラメータから読み込み
    loadKitFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        const customKitData = urlParams.get('custom_kit');
        
        if (customKitData) {
            try {
                return JSON.parse(decodeURIComponent(customKitData));
            } catch (error) {
                console.error('URLからのKit読み込みに失敗:', error);
            }
        }
        return null;
    }

    // フォームデータの検証
    validateKitData(formData) {
        const errors = [];
        
        if (!formData.title || formData.title.trim().length < 2) {
            errors.push('Kit名は2文字以上で入力してください');
        }
        
        if (!formData.industry) {
            errors.push('業種を選択してください');
        }
        
        if (!formData.colorPalette || formData.colorPalette.length < 2) {
            errors.push('カラーパレットは2色以上選択してください');
        }
        
        if (!formData.headingFont) {
            errors.push('見出しフォントを選択してください');
        }
        
        if (!formData.bodyFont) {
            errors.push('本文フォントを選択してください');
        }
        
        return errors;
    }

    // フォームからデータを取得
    getFormData() {
        const selectedColors = Array.from(document.querySelectorAll('.selected-color')).map(el => 
            el.querySelector('.color-code').textContent
        );
        
        return {
            title: Utils.getElementById('kitTitle')?.value?.trim() || '',
            industry: Utils.getElementById('kitIndustry')?.value || '',
            siteType: Utils.getElementById('kitSiteType')?.value || 'corporate',
            colorPalette: selectedColors,
            headingFont: Utils.getElementById('headingFont')?.value || '',
            bodyFont: Utils.getElementById('bodyFont')?.value || ''
        };
    }

    // エクスポート用データの生成
    exportKit(kit) {
        return {
            title: kit.title,
            industry: kit.industry,
            color_palette: kit.color_palette,
            fonts: kit.fonts,
            site_type: kit.site_type,
            created_at: kit.created_at,
            export_version: '1.0'
        };
    }
}

export default CustomKitManager;