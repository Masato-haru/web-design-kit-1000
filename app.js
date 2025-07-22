class WebDesignKitApp {
    constructor() {
        this.kitData = [];
        this.filteredData = [];
        this.currentPage = 1;
        this.itemsPerPage = 24;
        this.currentSiteType = 'corporate';
        
        this.initializeApp();
    }

    async initializeApp() {
        try {
            console.log('アプリケーション初期化開始...');
            
            // ローディング要素が存在するかチェック
            const loadingElement = document.getElementById('loading');
            if (!loadingElement) {
                console.error('ローディング要素が見つかりません');
                return;
            }
            
            await this.loadData();
            console.log('データ読み込み完了:', this.kitData.length, '件');
            
            // 人気フォントの優先表示設定
            this.setupPopularFonts();
            
            // サイトタイプ設定
            this.setupSiteTypes();
            
            // 人気度スコア計算後に再ソート
            this.sortByPopularity();
            
            this.setupEventListeners();
            console.log('イベントリスナー設定完了');
            
            this.populateIndustryFilter();
            console.log('フィルター設定完了');
            
            // サイトタイプの初期表示を更新
            this.updateSiteTypeDescription();
            
            await this.renderKits();
            console.log('初期表示完了');
            
            this.hideLoading();
            console.log('ローディング非表示完了');
            
        } catch (error) {
            console.error('アプリの初期化に失敗しました:', error);
            this.showError('データの読み込みに失敗しました。詳細: ' + error.message);
        }
    }

    setupPopularFonts() {
        // 人気フォントの定義
        this.popularFonts = {
            heading: [
                'Noto Sans JP',
                'Noto Serif JP', 
                'M PLUS 1p',
                'Hiragino Sans',
                'Yu Gothic',
                'Zen Kaku Gothic New'
            ],
            body: [
                'Noto Sans JP',
                'Noto Serif JP',
                'M PLUS 1p', 
                'Hiragino Sans',
                'Yu Gothic',
                'Source Han Sans'
            ]
        };

        // 各KITに人気度スコアを追加
        this.kitData.forEach(kit => {
            kit.popularityScore = this.calculatePopularityScore(kit);
        });
    }

    calculatePopularityScore(kit) {
        let score = 0;
        
        // フォントの人気度チェック
        if (this.popularFonts.heading.includes(kit.fonts.heading)) {
            score += this.popularFonts.heading.indexOf(kit.fonts.heading) === 0 ? 100 : 50; // Noto Sans JPは最高点
        }
        if (this.popularFonts.body.includes(kit.fonts.body)) {
            score += this.popularFonts.body.indexOf(kit.fonts.body) === 0 ? 100 : 50;
        }
        
        // 同じフォントの組み合わせ（Noto Sans JP）にボーナス
        if (kit.fonts.heading === 'Noto Sans JP' && kit.fonts.body === 'Noto Sans JP') {
            score += 200; // 特別ボーナス
        }
        
        // 一般的な組み合わせにボーナス
        const popularCombinations = [
            { heading: 'Noto Serif JP', body: 'Noto Sans JP' },
            { heading: 'M PLUS 1p', body: 'M PLUS 1p' },
            { heading: 'Hiragino Sans', body: 'Hiragino Sans' }
        ];
        
        const hasPopularCombo = popularCombinations.some(combo => 
            combo.heading === kit.fonts.heading && combo.body === kit.fonts.body
        );
        
        if (hasPopularCombo) {
            score += 75;
        }
        
        return score;
    }

    setupSiteTypes() {
        // サイトタイプ別の説明とプロンプト修正
        this.siteTypes = {
            corporate: {
                name: 'コーポレートサイト',
                description: 'プロフェッショナルで信頼感のあるデザインが重要なビジネスサイト',
                promptModifier: '企業の信頼性と専門性を表現する、プロフェッショナルで清潔感のあるコーポレートサイトのデザインで、'
            },
            lp: {
                name: 'ランディングページ',
                description: 'コンバージョンを重視した訴求力の高いシングルページサイト',
                promptModifier: `売上を最大化するLP黄金構成（9ステップ）とPASBONA（パソナ）の法則に基づいたランディングページを作成してください。

【必須構成要素（上から順番に配置）】

1. **ファーストビュー**
   - キャッチコピー: ターゲットの悩みに「これは私のことだ！」と刺さり、ベネフィット（商品から得られる未来）を簡潔に表現
   - メインビジュアル: 商品・サービス利用後の理想の未来をイメージできる画像
   - 権威付け/実績: 「顧客満足度98%」「〇〇受賞」「利用者数No.1」など信頼性を示す情報
   - CTAボタン: 「今すぐ試す」「無料で資料請求」など最初の行動喚起

2. **共感・問題提起**
   - 「こんなお悩みありませんか？」でターゲットの具体的な悩み・不満を箇条書きリスト化
   - 自分事化させ、続きを読む動機を創出

3. **解決策の提示とベネフィット**
   - 「その悩み、この商品が解決します！」と宣言
   - 商品の特徴ではなく、それによって得られるベネフィットを強く訴求

4. **お客様の声・導入事例**
   - 購入検討者に近い属性の顧客の声（写真付き、手書き、具体的エピソード）
   - BtoBの場合は具体的な導入事例と担当者コメント

5. **商品の詳細説明**
   - ベネフィットの根拠となる商品特徴、成分、他社比較（優位性）
   - 図や表を用いた分かりやすい解説
   - 専門家推薦やメディア掲載実績

6. **開発ストーリー・想い**
   - 「なぜこの商品を開発したのか」の背景と開発者の苦労
   - 商品に込めた想いで感情的共感と安心感を醸成

7. **よくある質問（FAQ）**
   - 価格、配送、解約方法、使い方など購入前の疑問をQ&A形式で解消
   - 購入ハードルを下げる先回り対応

8. **オファー（特典・保証）**
   - 価格提示とその正当性
   - 「初回限定50%OFF」「今なら〇〇プレゼント」「30日間全額返金保証」など
   - 行動リスクを限りなくゼロに近づける魅力的提案

9. **クロージング（最後のCTA）**
   - 商品ベネフィットの要約と購入促進
   - 目立つCTAボタンを複数配置、申し込みフォームと一体化

【PASBONAの法則を適用】
Problem（問題提起）→ Agitation（煽り・共感）→ Solution（解決策）→ Benefit（利益）→ Offer（提案）→ Narrow down（絞り込み・限定性）→ Action（行動喚起）

【デザイン要件】
- 縦長の一枚完結型レイアウト
- インパクトのあるビジュアルデザイン
- 行動を促すコンバージョン最適化デザイン
- 読み進めやすいストーリー性のある構成

この構成に基づいて、`
            },
            ecommerce: {
                name: 'ECサイト',
                description: '商品の魅力を伝え、購買意欲を高めるオンラインショップ',
                promptModifier: '商品の魅力を最大限に伝え、購買体験を向上させるECサイトのデザインで、'
            },
            portfolio: {
                name: 'ポートフォリオ',
                description: 'クリエイティブな作品や実績を効果的に見せるサイト',
                promptModifier: 'クリエイティブな作品を魅力的に見せる、洗練されたポートフォリオサイトのデザインで、'
            },
            blog: {
                name: 'ブログ',
                description: '読みやすく継続的なコンテンツ発信に適したサイト',
                promptModifier: '読みやすさと継続的な更新に配慮した、親しみやすいブログサイトのデザインで、'
            },
            restaurant: {
                name: 'レストラン',
                description: '料理の美味しさと店舗の雰囲気を伝える飲食店サイト',
                promptModifier: '料理の美味しさと店舗の温かい雰囲気を伝える、食欲をそそるレストランサイトのデザインで、'
            },
            clinic: {
                name: 'クリニック',
                description: '安心感と清潔感を重視した医療機関のサイト',
                promptModifier: '患者の安心感を第一に、清潔で信頼できる医療機関のサイトデザインで、'
            },
            salon: {
                name: 'サロン',
                description: '美しさとリラックス感を演出する美容・癒し系サイト',
                promptModifier: '美しさとリラクゼーションを演出する、上質で落ち着いたサロンサイトのデザインで、'
            }
        };
    }

    sortByPopularity() {
        // 人気度順でソート（高い順）
        this.filteredData.sort((a, b) => {
            return (b.popularityScore || 0) - (a.popularityScore || 0);
        });
        
        console.log('人気度ソート完了。上位5件:', 
            this.filteredData.slice(0, 5).map(kit => ({
                id: kit.id,
                heading: kit.fonts.heading,
                body: kit.fonts.body,
                score: kit.popularityScore
            }))
        );
    }

    async loadData() {
        try {
            console.log('JSONファイルの読み込み開始...');
            const response = await fetch('web_design_kit_1000.json');
            
            console.log('Response:', response);
            console.log('Response status:', response.status);
            console.log('Response ok:', response.ok);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
            }
            
            console.log('JSONパース開始...');
            const data = await response.json();
            console.log('JSONパース完了:', data);
            
            this.kitData = data.kit_data || [];
            
            // 初期状態では人気順でソート
            this.filteredData = [...this.kitData].sort((a, b) => {
                // 人気度スコアがまだ計算されていない場合は後で計算される
                return (b.popularityScore || 0) - (a.popularityScore || 0);
            });
            
            console.log('データ設定完了:', this.kitData.length, '件');
            
        } catch (error) {
            console.error('JSONデータの読み込みエラー:', error);
            console.error('エラーの詳細:', {
                name: error.name,
                message: error.message,
                stack: error.stack
            });
            
            // CORS/ネットワークエラーの場合は詳細な説明を提供
            if (error.name === 'TypeError' || error.message.includes('Failed to fetch')) {
                throw new Error('ローカルファイルの読み込みに失敗しました。HTTPサーバーを起動してください。\n\n解決方法:\n1. ターミナルでプロジェクトフォルダに移動\n2. "python3 -m http.server 8080" を実行\n3. ブラウザで "http://localhost:8080" にアクセス\n\n現在のURL: ' + window.location.href);
            }
            
            throw error;
        }
    }

    setupEventListeners() {
        // 検索入力
        const searchInput = document.getElementById('searchInput');
        if (!searchInput) {
            console.error('searchInput要素が見つかりません');
            return;
        }
        searchInput.addEventListener('input', this.debounce((e) => {
            this.filterData();
        }, 300));

        // 業種フィルター
        const industryFilter = document.getElementById('industryFilter');
        if (!industryFilter) {
            console.error('industryFilter要素が見つかりません');
            return;
        }
        industryFilter.addEventListener('change', () => {
            this.filterData();
        });

        // サイトタイプセレクター
        const siteTypeSelector = document.getElementById('siteTypeSelector');
        if (!siteTypeSelector) {
            console.error('siteTypeSelector要素が見つかりません');
            return;
        }
        siteTypeSelector.addEventListener('change', (e) => {
            this.currentSiteType = e.target.value;
            this.updateSiteTypeDescription();
            this.updatePromptsForSiteType();
        });

        // カラーフィルター
        const colorCheckboxes = document.querySelectorAll('.color-checkbox input[type="checkbox"]');
        colorCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.filterData();
            });
        });

        // ソート条件チェックボックス
        const sortCheckboxes = document.querySelectorAll('.sort-checkbox input[type="checkbox"]');
        sortCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', async () => {
                this.sortData();
                this.updateSortInfo();
                await this.renderKits();
            });
        });

        // ソートクリアボタン
        const clearSortBtn = document.getElementById('clearSortBtn');
        if (!clearSortBtn) {
            console.error('clearSortBtn要素が見つかりません');
            return;
        }
        clearSortBtn.addEventListener('click', () => {
            this.clearAllSorts();
        });

        // モーダル
        const modal = document.getElementById('modal');
        const closeModal = document.getElementById('closeModal');
        
        if (!modal || !closeModal) {
            console.error('modal または closeModal要素が見つかりません');
            return;
        }
        
        closeModal.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });

        // ESCキーでモーダル・サイドバーを閉じる
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                modal.style.display = 'none';
                // サイドバーも閉じる
                const sidebar = document.getElementById('sidebar');
                const sidebarOverlay = document.getElementById('sidebarOverlay');
                if (sidebar.classList.contains('open')) {
                    sidebar.classList.remove('open');
                    sidebarOverlay.classList.remove('show');
                    document.body.style.overflow = '';
                }
            }
        });

        // サイドバー制御
        this.setupSidebarControls();
    }

    setupSidebarControls() {
        const mobileFilterToggle = document.getElementById('mobileFilterToggle');
        const sidebar = document.getElementById('sidebar');
        const sidebarClose = document.getElementById('sidebarClose');
        const sidebarOverlay = document.getElementById('sidebarOverlay');

        if (!mobileFilterToggle || !sidebar || !sidebarClose || !sidebarOverlay) {
            console.error('サイドバー関連の要素が見つかりません');
            return;
        }

        // サイドバーを開く関数
        const openSidebar = () => {
            sidebar.classList.add('open');
            sidebarOverlay.classList.add('show');
            document.body.style.overflow = 'hidden';
        };

        // サイドバーを閉じる関数
        const closeSidebar = () => {
            sidebar.classList.remove('open');
            sidebarOverlay.classList.remove('show');
            document.body.style.overflow = '';
        };

        // モバイルフィルターボタン
        mobileFilterToggle.addEventListener('click', () => {
            if (sidebar.classList.contains('open')) {
                closeSidebar();
            } else {
                openSidebar();
            }
        });

        // サイドバー閉じるボタン
        sidebarClose.addEventListener('click', closeSidebar);

        // オーバーレイクリックで閉じる
        sidebarOverlay.addEventListener('click', closeSidebar);

        // リサイズ時の処理
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                closeSidebar();
            }
        });
    }

    populateIndustryFilter() {
        const industryFilter = document.getElementById('industryFilter');
        const industries = [...new Set(this.kitData.map(kit => kit.industry))].sort();
        
        industries.forEach(industry => {
            const option = document.createElement('option');
            option.value = industry;
            option.textContent = industry;
            industryFilter.appendChild(option);
        });
    }

    updateSiteTypeDescription() {
        const descriptionElement = document.getElementById('siteTypeDescription');
        if (descriptionElement) {
            const description = siteTypePrompts.getSiteTypeDescription(this.currentSiteType);
            descriptionElement.innerHTML = `<p>${description}</p>`;
        }
    }

    updatePromptsForSiteType() {
        // 表示中のKITカードのプロンプトを更新
        const kitCards = document.querySelectorAll('.kit-card');
        kitCards.forEach(card => {
            const kitId = parseInt(card.dataset.kitId);
            const kit = this.kitData.find(k => k.id === kitId);
            if (kit) {
                const promptElement = card.querySelector('.prompt-text');
                if (promptElement) {
                    promptElement.textContent = this.getModifiedPrompt(kit);
                }
            }
        });
    }

    getModifiedPrompt(kit) {
        // サイトタイプ別プロンプト機能を使用
        return siteTypePrompts.getPrompt(this.currentSiteType, kit);
    }

    async filterData() {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
        const selectedIndustry = document.getElementById('industryFilter').value;
        
        // 選択されたカラーフィルターを取得
        const selectedColors = Array.from(document.querySelectorAll('.color-checkbox input[type="checkbox"]:checked'))
            .map(checkbox => checkbox.value);

        this.filteredData = this.kitData.filter(kit => {
            // 検索条件のチェック
            let matchesSearch = true;
            if (searchTerm) {
                // 数値のみの場合は、KIT IDの完全一致と部分一致を優先
                if (/^\d+$/.test(searchTerm)) {
                    const searchNum = parseInt(searchTerm);
                    matchesSearch = kit.id === searchNum || kit.id.toString().includes(searchTerm);
                } else {
                    // その他のキーワード検索
                    matchesSearch = 
                        kit.industry.toLowerCase().includes(searchTerm) ||
                        kit.fonts.heading.toLowerCase().includes(searchTerm) ||
                        kit.fonts.body.toLowerCase().includes(searchTerm) ||
                        kit.vibe_coding_prompt.toLowerCase().includes(searchTerm) ||
                        kit.id.toString().includes(searchTerm) ||
                        `kit${kit.id}`.toLowerCase().includes(searchTerm) ||
                        `kit #${kit.id}`.toLowerCase().includes(searchTerm) ||
                        `#${kit.id}`.includes(searchTerm);
                }
            }

            const matchesIndustry = !selectedIndustry || kit.industry === selectedIndustry;

            // カラーフィルターのマッチング
            const matchesColor = selectedColors.length === 0 || 
                kit.color_palette.some(color => {
                    const colorCategory = this.getColorCategory(color);
                    return selectedColors.includes(colorCategory);
                });

            return matchesSearch && matchesIndustry && matchesColor;
        });

        this.currentPage = 1;
        await this.renderKits();
        this.updateResultsCount();
    }

    // カラー分析ユーティリティ
    hexToHsl(hex) {
        // HEXをRGBに変換
        const r = parseInt(hex.slice(1, 3), 16) / 255;
        const g = parseInt(hex.slice(3, 5), 16) / 255;
        const b = parseInt(hex.slice(5, 7), 16) / 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l;

        l = (max + min) / 2;

        if (max === min) {
            h = s = 0; // achromatic
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }

        return {
            h: Math.round(h * 360),
            s: Math.round(s * 100),
            l: Math.round(l * 100)
        };
    }

    // 明度計算（人間の視覚特性を考慮）
    getBrightness(hex) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        // YIQ式（人間の目の感度を考慮）
        return (r * 299 + g * 587 + b * 114) / 1000;
    }

    // 暖色・寒色判定
    getWarmth(hex) {
        const hsl = this.hexToHsl(hex);
        const hue = hsl.h;
        // 0-60度（赤〜黄）と300-360度（マゼンタ〜赤）を暖色とする
        if ((hue >= 0 && hue <= 60) || (hue >= 300 && hue <= 360)) {
            return 1; // 暖色
        } else if (hue >= 180 && hue <= 240) {
            return -1; // 寒色（青系）
        } else {
            return 0; // 中間色
        }
    }

    // 色系統の判定
    getColorCategory(hex) {
        const hsl = this.hexToHsl(hex);
        const hue = hsl.h;
        const saturation = hsl.s;
        const lightness = hsl.l;

        // グレー系の判定（彩度が低い、または明度が極端）
        if (saturation < 15 || lightness < 15 || lightness > 85) {
            return 'gray';
        }

        // 色相による分類
        if (hue >= 345 || hue < 15) return 'red';      // 345-15度: 赤
        if (hue >= 15 && hue < 45) return 'orange';    // 15-45度: 橙
        if (hue >= 45 && hue < 75) return 'yellow';    // 45-75度: 黄
        if (hue >= 75 && hue < 165) return 'green';    // 75-165度: 緑
        if (hue >= 165 && hue < 255) return 'blue';    // 165-255度: 青
        if (hue >= 255 && hue < 345) return 'purple';  // 255-345度: 紫

        return 'gray'; // デフォルト
    }

    // パレットの代表色を計算
    getPaletteMetrics(palette) {
        const primaryColor = palette[0]; // メインカラーで判定
        const hsl = this.hexToHsl(primaryColor);
        
        return {
            brightness: this.getBrightness(primaryColor),
            hue: hsl.h,
            saturation: hsl.s,
            warmth: this.getWarmth(primaryColor),
            primary: primaryColor
        };
    }

    sortData() {
        // 選択されたソート条件を取得
        const selectedSorts = Array.from(document.querySelectorAll('.sort-checkbox input[type="checkbox"]:checked'))
            .map(checkbox => checkbox.value);

        if (selectedSorts.length === 0) {
            // ソート条件がない場合はID順
            this.filteredData.sort((a, b) => a.id - b.id);
            return;
        }

        // 複数条件ソート
        this.filteredData.sort((a, b) => {
            return this.compareMultipleCriteria(a, b, selectedSorts);
        });
    }

    compareMultipleCriteria(a, b, criteria) {
        for (const criterion of criteria) {
            const comparison = this.compareSingleCriterion(a, b, criterion);
            if (comparison !== 0) {
                return comparison; // 最初に差が出た条件で決定
            }
        }
        return a.id - b.id; // 最後の手段としてID順
    }

    compareSingleCriterion(a, b, criterion) {
        switch (criterion) {
            case 'popularity':
                return (b.popularityScore || 0) - (a.popularityScore || 0);
            
            case 'industry':
                return a.industry.localeCompare(b.industry, 'ja');
            
            case 'brightness':
                const brightnessA = this.getPaletteMetrics(a.color_palette).brightness;
                const brightnessB = this.getPaletteMetrics(b.color_palette).brightness;
                return brightnessB - brightnessA;
            
            case 'hue':
                const hueA = this.getPaletteMetrics(a.color_palette).hue;
                const hueB = this.getPaletteMetrics(b.color_palette).hue;
                return hueA - hueB;
            
            case 'saturation':
                const satA = this.getPaletteMetrics(a.color_palette).saturation;
                const satB = this.getPaletteMetrics(b.color_palette).saturation;
                return satB - satA;
            
            case 'warmth':
                const warmthA = this.getPaletteMetrics(a.color_palette).warmth;
                const warmthB = this.getPaletteMetrics(b.color_palette).warmth;
                return warmthB - warmthA;
            
            // 印象ソート
            case 'cool':
                const coolA = this.calculateImpressionScores(a).cool;
                const coolB = this.calculateImpressionScores(b).cool;
                return coolB - coolA;
            
            case 'cute':
                const cuteA = this.calculateImpressionScores(a).cute;
                const cuteB = this.calculateImpressionScores(b).cute;
                return cuteB - cuteA;
            
            case 'stylish':
                const stylishA = this.calculateImpressionScores(a).stylish;
                const stylishB = this.calculateImpressionScores(b).stylish;
                return stylishB - stylishA;
            
            case 'elegant':
                const elegantA = this.calculateImpressionScores(a).elegant;
                const elegantB = this.calculateImpressionScores(b).elegant;
                return elegantB - elegantA;
            
            case 'friendly':
                const friendlyA = this.calculateImpressionScores(a).friendly;
                const friendlyB = this.calculateImpressionScores(b).friendly;
                return friendlyB - friendlyA;
            
            case 'professional':
                const professionalA = this.calculateImpressionScores(a).professional;
                const professionalB = this.calculateImpressionScores(b).professional;
                return professionalB - professionalA;
            
            case 'luxurious':
                const luxuriousA = this.calculateImpressionScores(a).luxurious;
                const luxuriousB = this.calculateImpressionScores(b).luxurious;
                return luxuriousB - luxuriousA;
            
            case 'playful':
                const playfulA = this.calculateImpressionScores(a).playful;
                const playfulB = this.calculateImpressionScores(b).playful;
                return playfulB - playfulA;
            
            case 'id':
            default:
                return a.id - b.id;
        }
    }

    updateSortInfo() {
        const selectedSorts = Array.from(document.querySelectorAll('.sort-checkbox input[type="checkbox"]:checked'))
            .map(checkbox => {
                const label = checkbox.closest('label').textContent.trim();
                return label;
            });

        const sortInfo = document.getElementById('sortInfo');
        if (selectedSorts.length > 0) {
            sortInfo.textContent = `ソート: ${selectedSorts.join(' → ')}`;
        } else {
            sortInfo.textContent = '';
        }
    }

    clearAllSorts() {
        // すべてのソートチェックボックスを解除
        const sortCheckboxes = document.querySelectorAll('.sort-checkbox input[type="checkbox"]');
        sortCheckboxes.forEach(checkbox => {
            checkbox.checked = false;
        });

        // ソート情報をクリア
        this.updateSortInfo();
        
        // データを再ソート・再描画
        this.sortData();
        this.renderKits();
    }

    async renderKits() {
        const kitGrid = document.getElementById('kitGrid');
        const noResults = document.getElementById('noResults');

        if (this.filteredData.length === 0) {
            kitGrid.innerHTML = '';
            noResults.style.display = 'block';
            return;
        }

        noResults.style.display = 'none';
        
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const currentItems = this.filteredData.slice(startIndex, endIndex);

        // 即座にカードを表示（フォント読み込みを待たない）
        kitGrid.innerHTML = currentItems.map(kit => this.createKitCard(kit)).join('');

        // カードのクリックイベントを追加
        kitGrid.querySelectorAll('.kit-card').forEach((card, index) => {
            card.addEventListener('click', async (e) => {
                // コピーボタンがクリックされた場合はモーダルを開かない
                if (e.target.classList.contains('copy-kit-button')) {
                    return;
                }
                const kit = currentItems[index];
                await this.showKitDetails(kit);
            });
        });

        // コピーボタンのイベントリスナーを追加
        kitGrid.querySelectorAll('.copy-kit-button').forEach((button) => {
            button.addEventListener('click', async (e) => {
                e.stopPropagation(); // カードクリックイベントを防ぐ
                
                const kitId = button.dataset.kitId;
                const kit = currentItems.find(k => k.id.toString() === kitId);
                
                if (kit) {
                    const prompt = this.generateClaudeCodePrompt(kit);
                    await this.copyPromptToClipboard(button, prompt);
                }
            });
        });

        // バックグラウンドでフォントを読み込み（非同期、優先度を下げる）
        setTimeout(() => {
            this.preloadFontsInBackground(currentItems);
        }, 100);

        this.updateResultsCount();
    }

    // バックグラウンドでフォントを読み込む
    preloadFontsInBackground(items) {
        items.forEach(kit => {
            // 非同期でフォントを読み込み、エラーは無視
            fontManager.ensureFontLoaded(kit.fonts.heading).catch(() => {});
            fontManager.ensureFontLoaded(kit.fonts.body).catch(() => {});
        });
    }

    createKitCard(kit) {
        const colorSwatches = kit.color_palette.map(color => `
            <div class="color-swatch" style="background-color: ${color}">
                <span class="color-code">${color}</span>
            </div>
        `).join('');

        // フォントプレビューサンプルテキスト
        const headingText = this.getFontSampleText(kit.fonts.heading, 'heading');
        const bodyText = this.getFontSampleText(kit.fonts.body, 'body');

        // 人気度バッジを決定
        const popularityBadge = this.getPopularityBadge(kit);

        return `
            <div class="kit-card" data-id="${kit.id}" data-kit-id="${kit.id}">
                <div class="card-header">
                    <div class="card-id">KIT #${kit.id}</div>
                    <div class="card-industry">${kit.industry}</div>
                    ${popularityBadge}
                    <button class="copy-kit-button" data-kit-id="${kit.id}" title="プロンプトをコピー">
                        📋
                    </button>
                </div>
                <div class="color-palette">
                    ${colorSwatches}
                </div>
                <div class="font-info">
                    <div class="font-pair">
                        <div class="font-item">
                            <span class="font-label">見出し</span>
                            <div class="font-preview" style="font-family: ${fontManager.getFontFamily(kit.fonts.heading)}; font-size: 1.1rem; font-weight: 600; line-height: 1.3;">
                                ${headingText}
                            </div>
                            <span class="font-name">${kit.fonts.heading}</span>
                        </div>
                        <div class="font-item">
                            <span class="font-label">本文</span>
                            <div class="font-preview" style="font-family: ${fontManager.getFontFamily(kit.fonts.body)}; font-size: 0.9rem; line-height: 1.5;">
                                ${bodyText}
                            </div>
                            <span class="font-name">${kit.fonts.body}</span>
                        </div>
                    </div>
                </div>
                <div class="prompt-preview">
                    <div class="prompt-text">${this.getModifiedPrompt(kit)}</div>
                </div>
            </div>
        `;
    }

    getPopularityBadge(kit) {
        const score = kit.popularityScore || 0;
        
        if (score >= 200) {
            return '<div class="popularity-badge popular">人気</div>';
        } else if (score >= 100) {
            return '<div class="popularity-badge general">一般</div>';
        }
        
        return '';
    }

    async waitForFontsReady(fontNames) {
        if (!('fonts' in document)) {
            // document.fontsが使えない古いブラウザ
            return new Promise(resolve => setTimeout(resolve, 2000));
        }

        const loadPromises = fontNames.map(async (fontName) => {
            // 複数のウェイトでフォント読み込みを確認
            const weights = [400, 500, 600, 700];
            const loadPromises = weights.map(weight => 
                document.fonts.load(`${weight} 16px "${fontName}"`).catch(() => null)
            );
            
            try {
                await Promise.race([
                    Promise.all(loadPromises),
                    new Promise(resolve => setTimeout(resolve, 1500)) // タイムアウト
                ]);
                console.log(`Font ready confirmed: ${fontName}`);
            } catch (error) {
                console.warn(`Font load verification failed for ${fontName}:`, error);
            }
        });

        await Promise.all(loadPromises);
        
        // 最終確認として少し待機
        return new Promise(resolve => setTimeout(resolve, 100));
    }

    getFontSampleText(fontName, type) {
        // フォント種類別のサンプルテキスト
        const sampleTexts = {
            heading: {
                'default': 'Webデザイン',
                'serif': '美しいタイポグラフィ',
                'rounded': 'やさしいデザイン',
                'playful': 'たのしいWebサイト',
                'modern': 'モダンなスタイル',
                'classic': '上質なデザイン'
            },
            body: {
                'default': 'このフォントでWebサイトを制作します。',
                'serif': '読みやすく美しい文章を表現できます。',
                'rounded': '親しみやすい印象を与えます。',
                'playful': '楽しく親近感のある雰囲気です。',
                'modern': 'シンプルで洗練された印象です。',
                'classic': '信頼感のある安定したデザインです。'
            }
        };

        // フォント分類を取得
        const fontCategories = {
            serif: ['Noto Serif JP', 'Sawarabi Mincho', 'New Tegomin', 'BIZ UDPMincho', 
                   'Zen Old Mincho', 'Kaisei Tokumin', 'Kaisei Opti', 'Kaisei HarunoUmi', 
                   'Kaisei Decol', 'Shippori Mincho', 'Shippori Mincho B1', 'Shippori Antique', 
                   'Shippori Antique B1', 'Klee One', 'Hina Mincho'],
            rounded: ['M PLUS Rounded 1c', 'Kosugi Maru', 'Kiwi Maru'],
            playful: ['Hachi Maru Pop', 'Yusei Magic', 'Rampart One', 'Reggae One', 
                     'RocknRoll One', 'Mochiy Pop One', 'Mochiy Pop P One', 'Potta One', 
                     'Train One', 'Dela Gothic One', 'Yomogi'],
            modern: ['Noto Sans JP', 'M PLUS 1p', 'BIZ UDPGothic', 'Zen Kaku Gothic New', 
                    'Zen Kaku Gothic Antique', 'Zen Maru Gothic', 'Murecho'],
            classic: ['Sawarabi Gothic', 'Kosugi']
        };

        // フォントカテゴリーを判定
        let category = 'default';
        for (const [cat, fonts] of Object.entries(fontCategories)) {
            if (fonts.includes(fontName)) {
                category = cat;
                break;
            }
        }

        return sampleTexts[type][category] || sampleTexts[type]['default'];
    }

    async generateSampleSite(kit) {
        const colors = kit.color_palette;
        const headingFont = kit.fonts.heading;
        const bodyFont = kit.fonts.body;

        // フォントを事前読み込み（強化版）
        await Promise.all([
            fontManager.ensureFontLoaded(headingFont),
            fontManager.ensureFontLoaded(bodyFont)
        ]);
        
        // 追加で明示的に読み込み確認
        await this.waitForFontsReady([headingFont, bodyFont]);
        
        const industry = kit.industry;

        // 業種別のサンプルコンテンツ
        const industryContent = {
            "コーポレート": {
                title: "株式会社サンプル",
                subtitle: "信頼と革新で未来を創る",
                description: "私たちは、お客様のビジネス成長をサポートする総合コンサルティング企業です。豊富な経験と最新の技術で、最適なソリューションを提供いたします。",
                cta: "お問い合わせ"
            },
            "テック・IT": {
                title: "テックイノベート株式会社",
                subtitle: "次世代のテクノロジーソリューション",
                description: "AI・機械学習・クラウドサービスを活用した革新的なソフトウェア開発。デジタルトランスフォーメーションを加速させるパートナーです。",
                cta: "無料相談"
            },
            "クリエイティブ": {
                title: "クリエイティブスタジオ",
                subtitle: "想像を現実に変えるデザイン",
                description: "ブランディング、Webデザイン、グラフィックデザインまで。クリエイティブな視点で、あなたの想いを形にします。",
                cta: "ポートフォリオ"
            },
            "ヘルスケア": {
                title: "健康クリニック",
                subtitle: "あなたの健康を全力でサポート",
                description: "最新の医療技術と温かい心で、患者様一人ひとりに寄り添った医療サービスを提供いたします。",
                cta: "診察予約"
            },
            "ファッション": {
                title: "ファッションブティック",
                subtitle: "スタイルを見つける場所",
                description: "最新トレンドから定番アイテムまで、あなただけの特別なスタイルを見つけられるセレクトショップです。",
                cta: "新作を見る"
            },
            "食品・飲食": {
                title: "ビストロ・メゾン",
                subtitle: "心を込めた料理でおもてなし",
                description: "新鮮な食材と伝統的な調理法で作る、心温まる料理の数々。特別な時間をお過ごしください。",
                cta: "メニューを見る"
            },
            "教育": {
                title: "学習アカデミー",
                subtitle: "未来への扉を開く学び",
                description: "一人ひとりの可能性を最大限に引き出す教育プログラム。楽しく学び、確実に成長できる環境を提供します。",
                cta: "体験授業"
            },
            "不動産": {
                title: "住まいの窓口",
                subtitle: "理想の住まいを一緒に見つけましょう",
                description: "豊富な物件情報と専門知識で、お客様のライフスタイルに最適な住まいをご提案いたします。",
                cta: "物件検索"
            },
            "エンターテイメント": {
                title: "エンターテイメントハブ",
                subtitle: "エキサイティングな体験をお届け",
                description: "音楽、映画、ゲーム、イベントまで。最高のエンターテイメント体験をあなたにお届けします。",
                cta: "今すぐ体験"
            },
            "金融": {
                title: "金融パートナーズ",
                subtitle: "安心の資産運用サポート",
                description: "お客様の大切な資産を守り、増やすための最適な金融サービスを提供いたします。信頼できるパートナーとして。",
                cta: "相談予約"
            }
        };

        const content = industryContent[industry] || industryContent["コーポレート"];

        // フォントファミリーを適切に設定
        const headingFontFamily = fontManager.getFontFamily(headingFont);
        const bodyFontFamily = fontManager.getFontFamily(bodyFont);

        // デバッグ情報をコンソールに出力
        console.log(`Sample site fonts: heading="${headingFont}" -> ${headingFontFamily}, body="${bodyFont}" -> ${bodyFontFamily}`);

        // フォント表示を強制するスタイルを追加
        const fontForceStyle = `
            <style>
                .sample-site * {
                    font-synthesis: none !important;
                    font-variant-ligatures: none !important;
                }
                .sample-site h1, .sample-site strong, .sample-site button {
                    font-family: ${headingFontFamily} !important;
                    font-weight: 600 !important;
                }
                .sample-site {
                    font-family: ${bodyFontFamily} !important;
                }
            </style>
        `;

        return fontForceStyle + `
            <div class="sample-site" style="
                font-family: ${bodyFontFamily};
                color: ${colors[3]};
                background: linear-gradient(135deg, ${colors[0]} 0%, ${colors[1]} 100%);
                margin: 0;
                padding: 0;
                min-height: 400px;
                border-radius: 8px;
                overflow: hidden;
                position: relative;
            ">
                <div style="
                    background: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(10px);
                    padding: 2rem;
                    height: 100%;
                    min-height: 400px;
                ">
                    <header style="text-align: center; margin-bottom: 2rem;">
                        <h1 style="
                            font-family: ${headingFontFamily};
                            color: ${colors[0]};
                            font-size: 2.5rem;
                            margin: 0 0 0.5rem 0;
                            font-weight: 700;
                        ">${content.title}</h1>
                        <p style="
                            color: ${colors[1]};
                            font-size: 1.2rem;
                            margin: 0;
                            font-weight: 500;
                        ">${content.subtitle}</p>
                    </header>

                    <main style="max-width: 600px; margin: 0 auto; text-align: center;">
                        <p style="
                            font-size: 1.1rem;
                            line-height: 1.6;
                            color: ${colors[3]};
                            margin-bottom: 2rem;
                        ">${content.description}</p>

                        <div style="
                            display: grid;
                            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
                            gap: 1rem;
                            margin-bottom: 2rem;
                        ">
                            <div style="
                                background: ${colors[2]};
                                color: white;
                                padding: 1rem;
                                border-radius: 8px;
                                text-align: center;
                            ">
                                <strong style="font-family: ${headingFontFamily};">特徴1</strong>
                                <p style="margin: 0.5rem 0 0 0; font-size: 0.9rem;">高品質</p>
                            </div>
                            <div style="
                                background: ${colors[1]};
                                color: white;
                                padding: 1rem;
                                border-radius: 8px;
                                text-align: center;
                            ">
                                <strong style="font-family: ${headingFontFamily};">特徴2</strong>
                                <p style="margin: 0.5rem 0 0 0; font-size: 0.9rem;">信頼性</p>
                            </div>
                            <div style="
                                background: ${colors[0]};
                                color: white;
                                padding: 1rem;
                                border-radius: 8px;
                                text-align: center;
                            ">
                                <strong style="font-family: ${headingFontFamily};">特徴3</strong>
                                <p style="margin: 0.5rem 0 0 0; font-size: 0.9rem;">革新性</p>
                            </div>
                        </div>

                        <button style="
                            background: ${colors[2]};
                            color: white;
                            border: none;
                            padding: 1rem 2rem;
                            font-size: 1.1rem;
                            font-weight: 600;
                            border-radius: 50px;
                            cursor: pointer;
                            font-family: ${headingFontFamily};
                            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                            transition: transform 0.3s ease;
                        " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">${content.cta}</button>
                    </main>

                    <footer style="
                        margin-top: 2rem;
                        padding-top: 1rem;
                        border-top: 2px solid ${colors[1]};
                        text-align: center;
                        font-size: 0.9rem;
                        color: ${colors[3]};
                    ">
                        <p style="margin: 0;">© 2025 ${content.title}. Sample design using KIT #${kit.id}</p>
                    </footer>
                </div>
            </div>
        `;
    }

    generateHTMLStyleGuide(kit) {
        const colors = kit.color_palette;
        const headingFont = kit.fonts.heading;
        const bodyFont = kit.fonts.body;
        
        // フォントファミリーを適切に設定
        const headingFontFamily = fontManager.getFontFamily(headingFont);
        const bodyFontFamily = fontManager.getFontFamily(bodyFont);

        return `
            <div class="style-guide-grid">
                <!-- 基本設定 -->
                <div class="style-item">
                    <h5>基本設定</h5>
                    <div class="style-code">
                        <pre><code>body {
    font-family: ${bodyFontFamily};
    font-size: 16px;
    line-height: 1.6;
    color: ${colors[3]};
    background-color: #ffffff;
}</code></pre>
                        <button class="copy-btn-small" onclick="navigator.clipboard.writeText('body {\\n    font-family: ${bodyFontFamily};\\n    font-size: 16px;\\n    line-height: 1.6;\\n    color: ${colors[3]};\\n    background-color: #ffffff;\\n}')">コピー</button>
                    </div>
                </div>

                <!-- 見出しスタイル -->
                <div class="style-item">
                    <h5>見出しスタイル</h5>
                    <div class="style-code">
                        <pre><code>h1, h2, h3, h4, h5, h6 {
    font-family: ${headingFontFamily};
    color: ${colors[0]};
    line-height: 1.2;
    margin: 0 0 1rem 0;
}

h1 { font-size: 2.5rem; font-weight: 700; }
h2 { font-size: 2rem; font-weight: 600; }
h3 { font-size: 1.5rem; font-weight: 600; }
h4 { font-size: 1.25rem; font-weight: 500; }</code></pre>
                        <button class="copy-btn-small" onclick="navigator.clipboard.writeText('h1, h2, h3, h4, h5, h6 {\\n    font-family: ${headingFontFamily};\\n    color: ${colors[0]};\\n    line-height: 1.2;\\n    margin: 0 0 1rem 0;\\n}\\n\\nh1 { font-size: 2.5rem; font-weight: 700; }\\nh2 { font-size: 2rem; font-weight: 600; }\\nh3 { font-size: 1.5rem; font-weight: 600; }\\nh4 { font-size: 1.25rem; font-weight: 500; }')">コピー</button>
                    </div>
                </div>

                <!-- ボタンスタイル -->
                <div class="style-item">
                    <h5>ボタンスタイル</h5>
                    <div class="style-code">
                        <pre><code>.btn-primary {
    background-color: ${colors[0]};
    color: #ffffff;
    border: none;
    padding: 12px 24px;
    border-radius: 6px;
    font-family: ${headingFontFamily};
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn-primary:hover {
    background-color: ${this.darkenColor(colors[0], 10)};
    transform: translateY(-2px);
}</code></pre>
                        <button class="copy-btn-small" onclick="navigator.clipboard.writeText('.btn-primary {\\n    background-color: ${colors[0]};\\n    color: #ffffff;\\n    border: none;\\n    padding: 12px 24px;\\n    border-radius: 6px;\\n    font-family: ${headingFontFamily};\\n    font-size: 1rem;\\n    font-weight: 600;\\n    cursor: pointer;\\n    transition: all 0.3s ease;\\n}\\n\\n.btn-primary:hover {\\n    background-color: ${this.darkenColor(colors[0], 10)};\\n    transform: translateY(-2px);\\n}')">コピー</button>
                    </div>
                </div>

                <!-- セカンダリボタン -->
                <div class="style-item">
                    <h5>セカンダリボタン</h5>
                    <div class="style-code">
                        <pre><code>.btn-secondary {
    background-color: transparent;
    color: ${colors[1]};
    border: 2px solid ${colors[1]};
    padding: 10px 22px;
    border-radius: 6px;
    font-family: ${headingFontFamily};
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn-secondary:hover {
    background-color: ${colors[1]};
    color: #ffffff;
}</code></pre>
                        <button class="copy-btn-small" onclick="navigator.clipboard.writeText('.btn-secondary {\\n    background-color: transparent;\\n    color: ${colors[1]};\\n    border: 2px solid ${colors[1]};\\n    padding: 10px 22px;\\n    border-radius: 6px;\\n    font-family: ${headingFontFamily};\\n    font-size: 1rem;\\n    font-weight: 500;\\n    cursor: pointer;\\n    transition: all 0.3s ease;\\n}\\n\\n.btn-secondary:hover {\\n    background-color: ${colors[1]};\\n    color: #ffffff;\\n}')">コピー</button>
                    </div>
                </div>

                <!-- リンクスタイル -->
                <div class="style-item">
                    <h5>リンクスタイル</h5>
                    <div class="style-code">
                        <pre><code>a {
    color: ${colors[2]};
    text-decoration: none;
    font-weight: 500;
    transition: color 0.3s ease;
}

a:hover {
    color: ${this.darkenColor(colors[2], 15)};
    text-decoration: underline;
}

a:focus {
    outline: 2px solid ${colors[2]};
    outline-offset: 2px;
}</code></pre>
                        <button class="copy-btn-small" onclick="navigator.clipboard.writeText('a {\\n    color: ${colors[2]};\\n    text-decoration: none;\\n    font-weight: 500;\\n    transition: color 0.3s ease;\\n}\\n\\na:hover {\\n    color: ${this.darkenColor(colors[2], 15)};\\n    text-decoration: underline;\\n}\\n\\na:focus {\\n    outline: 2px solid ${colors[2]};\\n    outline-offset: 2px;\\n}')">コピー</button>
                    </div>
                </div>

                <!-- カードスタイル -->
                <div class="style-item">
                    <h5>カード・コンテナ</h5>
                    <div class="style-code">
                        <pre><code>.card {
    background-color: #ffffff;
    border: 1px solid #e9ecef;
    border-radius: 8px;
    padding: 1.5rem;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    transition: box-shadow 0.3s ease;
}

.card:hover {
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.card-accent {
    border-left: 4px solid ${colors[2]};
}</code></pre>
                        <button class="copy-btn-small" onclick="navigator.clipboard.writeText('.card {\\n    background-color: #ffffff;\\n    border: 1px solid #e9ecef;\\n    border-radius: 8px;\\n    padding: 1.5rem;\\n    box-shadow: 0 2px 4px rgba(0,0,0,0.1);\\n    transition: box-shadow 0.3s ease;\\n}\\n\\n.card:hover {\\n    box-shadow: 0 4px 12px rgba(0,0,0,0.15);\\n}\\n\\n.card-accent {\\n    border-left: 4px solid ${colors[2]};\\n}')">コピー</button>
                    </div>
                </div>

                <!-- フォームスタイル -->
                <div class="style-item">
                    <h5>フォーム要素</h5>
                    <div class="style-code">
                        <pre><code>input, textarea, select {
    font-family: ${bodyFontFamily};
    font-size: 1rem;
    padding: 12px 16px;
    border: 2px solid #e9ecef;
    border-radius: 6px;
    transition: border-color 0.3s ease;
    width: 100%;
}

input:focus, textarea:focus, select:focus {
    outline: none;
    border-color: ${colors[1]};
    box-shadow: 0 0 0 3px ${this.addOpacity(colors[1], 0.1)};
}</code></pre>
                        <button class="copy-btn-small" onclick="navigator.clipboard.writeText('input, textarea, select {\\n    font-family: ${bodyFontFamily};\\n    font-size: 1rem;\\n    padding: 12px 16px;\\n    border: 2px solid #e9ecef;\\n    border-radius: 6px;\\n    transition: border-color 0.3s ease;\\n    width: 100%;\\n}\\n\\ninput:focus, textarea:focus, select:focus {\\n    outline: none;\\n    border-color: ${colors[1]};\\n    box-shadow: 0 0 0 3px ${this.addOpacity(colors[1], 0.1)};\\n}')">コピー</button>
                    </div>
                </div>

                <!-- 段落・テキスト -->
                <div class="style-item">
                    <h5>段落・テキスト</h5>
                    <div class="style-code">
                        <pre><code>p {
    margin: 0 0 1rem 0;
    line-height: 1.6;
    font-size: 1rem;
}

.text-large {
    font-size: 1.125rem;
    line-height: 1.7;
}

.text-small {
    font-size: 0.875rem;
    line-height: 1.5;
}

.text-accent {
    color: ${colors[2]};
    font-weight: 600;
}</code></pre>
                        <button class="copy-btn-small" onclick="navigator.clipboard.writeText('p {\\n    margin: 0 0 1rem 0;\\n    line-height: 1.6;\\n    font-size: 1rem;\\n}\\n\\n.text-large {\\n    font-size: 1.125rem;\\n    line-height: 1.7;\\n}\\n\\n.text-small {\\n    font-size: 0.875rem;\\n    line-height: 1.5;\\n}\\n\\n.text-accent {\\n    color: ${colors[2]};\\n    font-weight: 600;\\n}')">コピー</button>
                    </div>
                </div>
            </div>
        `;
    }

    // カラーユーティリティ関数
    darkenColor(hex, percent) {
        const num = parseInt(hex.replace("#", ""), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) - amt;
        const G = (num >> 8 & 0x00FF) - amt;
        const B = (num & 0x0000FF) - amt;
        return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
    }

    addOpacity(hex, opacity) {
        const num = parseInt(hex.replace("#", ""), 16);
        const R = (num >> 16) & 255;
        const G = (num >> 8) & 255;
        const B = num & 255;
        return `rgba(${R}, ${G}, ${B}, ${opacity})`;
    }

    // 抽象的な印象スコア算出システム
    calculateImpressionScores(kit) {
        const colors = kit.color_palette;
        const headingFont = kit.fonts.heading;
        const bodyFont = kit.fonts.body;
        
        // カラーメトリクス取得
        const colorAnalysis = this.analyzeColorPalette(colors);
        const fontAnalysis = this.analyzeFonts(headingFont, bodyFont);
        
        return {
            cool: this.calculateCoolScore(colorAnalysis, fontAnalysis),
            cute: this.calculateCuteScore(colorAnalysis, fontAnalysis),
            stylish: this.calculateStylishScore(colorAnalysis, fontAnalysis),
            elegant: this.calculateElegantScore(colorAnalysis, fontAnalysis),
            friendly: this.calculateFriendlyScore(colorAnalysis, fontAnalysis),
            professional: this.calculateProfessionalScore(colorAnalysis, fontAnalysis),
            luxurious: this.calculateLuxuriousScore(colorAnalysis, fontAnalysis),
            playful: this.calculatePlayfulScore(colorAnalysis, fontAnalysis)
        };
    }

    analyzeColorPalette(colors) {
        const metrics = colors.map(color => this.getPaletteMetrics([color]));
        const avgBrightness = metrics.reduce((sum, m) => sum + m.brightness, 0) / metrics.length;
        const avgSaturation = metrics.reduce((sum, m) => sum + m.saturation, 0) / metrics.length;
        
        // 色の多様性計算
        const hues = metrics.map(m => m.hue);
        const hueSpread = Math.max(...hues) - Math.min(...hues);
        
        // 暖色・寒色バランス
        const warmthValues = metrics.map(m => m.warmth);
        const warmthBalance = warmthValues.reduce((sum, w) => sum + w, 0) / warmthValues.length;
        
        // コントラスト分析
        const brightnesses = metrics.map(m => m.brightness);
        const contrast = Math.max(...brightnesses) - Math.min(...brightnesses);
        
        return {
            avgBrightness,
            avgSaturation,
            hueSpread,
            warmthBalance,
            contrast,
            hasDarkColors: metrics.some(m => m.brightness < 80),
            hasVibrantColors: metrics.some(m => m.saturation > 70),
            isMonochromatic: hueSpread < 30,
            primaryHue: metrics[0].hue
        };
    }

    analyzeFonts(headingFont, bodyFont) {
        const fontCategories = {
            // 明朝系（エレガント・フォーマル）
            serif: ['Noto Serif JP', 'Sawarabi Mincho', 'New Tegomin', 'BIZ UDPMincho', 
                   'Zen Old Mincho', 'Kaisei Tokumin', 'Kaisei Opti', 'Kaisei HarunoUmi', 
                   'Kaisei Decol', 'Shippori Mincho', 'Shippori Mincho B1', 'Shippori Antique', 
                   'Shippori Antique B1', 'Klee One', 'Hina Mincho'],
            
            // ゴシック系（モダン・クリーン）
            modern: ['Noto Sans JP', 'M PLUS 1p', 'BIZ UDPGothic', 'Zen Kaku Gothic New', 
                    'Zen Kaku Gothic Antique', 'Zen Maru Gothic', 'Murecho'],
            
            // 丸ゴシック系（親しみやすい・かわいい）
            rounded: ['M PLUS Rounded 1c', 'Kosugi Maru', 'Kiwi Maru'],
            
            // ポップ系（遊び心・楽しい）
            playful: ['Hachi Maru Pop', 'Yusei Magic', 'Rampart One', 'Reggae One', 
                     'RocknRoll One', 'Mochiy Pop One', 'Mochiy Pop P One', 'Potta One', 
                     'Train One', 'Dela Gothic One', 'Yomogi'],
            
            // 特殊系
            unique: ['Stick', 'DotGothic16'],
            
            // クラシック系
            classic: ['Sawarabi Gothic', 'Kosugi']
        };

        const getCategory = (font) => {
            for (const [category, fonts] of Object.entries(fontCategories)) {
                if (fonts.includes(font)) return category;
            }
            return 'modern'; // デフォルト
        };

        return {
            headingCategory: getCategory(headingFont),
            bodyCategory: getCategory(bodyFont),
            isSerifHeading: fontCategories.serif.includes(headingFont),
            isRoundedBody: fontCategories.rounded.includes(bodyFont),
            isPlayfulHeading: fontCategories.playful.includes(headingFont),
            isModernPair: getCategory(headingFont) === 'modern' && getCategory(bodyFont) === 'modern'
        };
    }

    // 各印象スコア計算関数
    calculateCoolScore(colorAnalysis, fontAnalysis) {
        let score = 0;
        
        // 寒色系・低彩度でクール
        if (colorAnalysis.warmthBalance < -0.3) score += 30;
        if (colorAnalysis.avgSaturation < 50) score += 20;
        if (colorAnalysis.hasDarkColors) score += 25;
        
        // 青系の色相でクール
        if (colorAnalysis.primaryHue >= 180 && colorAnalysis.primaryHue <= 260) score += 20;
        
        // モダンフォントでクール
        if (fontAnalysis.isModernPair) score += 15;
        if (fontAnalysis.headingCategory === 'modern') score += 10;
        
        return Math.min(score, 100);
    }

    calculateCuteScore(colorAnalysis, fontAnalysis) {
        let score = 0;
        
        // パステルカラー・高明度でかわいい
        if (colorAnalysis.avgBrightness > 180) score += 25;
        if (colorAnalysis.avgSaturation > 40 && colorAnalysis.avgSaturation < 80) score += 20;
        
        // ピンク・暖色系でかわいい
        if (colorAnalysis.warmthBalance > 0.3) score += 20;
        if (colorAnalysis.primaryHue >= 300 || colorAnalysis.primaryHue <= 60) score += 15;
        
        // 丸ゴシック・ポップフォントでかわいい
        if (fontAnalysis.isRoundedBody) score += 25;
        if (fontAnalysis.isPlayfulHeading) score += 20;
        if (fontAnalysis.headingCategory === 'rounded') score += 15;
        
        return Math.min(score, 100);
    }

    calculateStylishScore(colorAnalysis, fontAnalysis) {
        let score = 0;
        
        // 高コントラスト・モノクロマティックでスタイリッシュ
        if (colorAnalysis.contrast > 150) score += 25;
        if (colorAnalysis.isMonochromatic) score += 20;
        if (colorAnalysis.hasDarkColors && colorAnalysis.avgSaturation < 30) score += 25;
        
        // モダンフォント組み合わせでスタイリッシュ
        if (fontAnalysis.isModernPair) score += 20;
        if (fontAnalysis.headingCategory === 'modern') score += 10;
        
        return Math.min(score, 100);
    }

    calculateElegantScore(colorAnalysis, fontAnalysis) {
        let score = 0;
        
        // 落ち着いた色調・低彩度でエレガント
        if (colorAnalysis.avgSaturation < 40) score += 25;
        if (colorAnalysis.avgBrightness > 120 && colorAnalysis.avgBrightness < 200) score += 20;
        
        // 明朝系フォントでエレガント
        if (fontAnalysis.isSerifHeading) score += 30;
        if (fontAnalysis.headingCategory === 'serif' && fontAnalysis.bodyCategory === 'serif') score += 20;
        if (fontAnalysis.headingCategory === 'classic') score += 15;
        
        return Math.min(score, 100);
    }

    calculateFriendlyScore(colorAnalysis, fontAnalysis) {
        let score = 0;
        
        // 暖色・中程度の彩度で親しみやすい
        if (colorAnalysis.warmthBalance > 0) score += 20;
        if (colorAnalysis.avgSaturation > 30 && colorAnalysis.avgSaturation < 70) score += 25;
        if (colorAnalysis.avgBrightness > 150) score += 15;
        
        // 丸ゴシック・親しみやすいフォントで親しみやすい
        if (fontAnalysis.isRoundedBody) score += 25;
        if (fontAnalysis.headingCategory === 'rounded') score += 20;
        if (fontAnalysis.bodyCategory === 'classic') score += 10;
        
        return Math.min(score, 100);
    }

    calculateProfessionalScore(colorAnalysis, fontAnalysis) {
        let score = 0;
        
        // 低彩度・安定した色調でプロフェッショナル
        if (colorAnalysis.avgSaturation < 50) score += 25;
        if (colorAnalysis.contrast < 100) score += 15;
        if (colorAnalysis.hasDarkColors) score += 20;
        
        // 青系・グレー系でプロフェッショナル
        if (colorAnalysis.primaryHue >= 180 && colorAnalysis.primaryHue <= 260) score += 15;
        
        // クラシック・モダンフォントでプロフェッショナル
        if (fontAnalysis.isModernPair) score += 20;
        if (fontAnalysis.isSerifHeading && fontAnalysis.bodyCategory === 'modern') score += 15;
        
        return Math.min(score, 100);
    }

    calculateLuxuriousScore(colorAnalysis, fontAnalysis) {
        let score = 0;
        
        // 深い色・高コントラストで高級感
        if (colorAnalysis.hasDarkColors) score += 25;
        if (colorAnalysis.contrast > 120) score += 20;
        if (colorAnalysis.avgSaturation < 30 || colorAnalysis.avgSaturation > 80) score += 15;
        
        // 紫・金系の色相で高級感
        if (colorAnalysis.primaryHue >= 240 && colorAnalysis.primaryHue <= 300) score += 20;
        
        // 明朝系・クラシックフォントで高級感
        if (fontAnalysis.isSerifHeading) score += 25;
        if (fontAnalysis.headingCategory === 'classic') score += 15;
        
        return Math.min(score, 100);
    }

    calculatePlayfulScore(colorAnalysis, fontAnalysis) {
        let score = 0;
        
        // 鮮やかな色・多様性で遊び心
        if (colorAnalysis.hasVibrantColors) score += 25;
        if (colorAnalysis.hueSpread > 120) score += 20;
        if (colorAnalysis.avgSaturation > 60) score += 15;
        
        // 明るい色調で遊び心
        if (colorAnalysis.avgBrightness > 160) score += 15;
        
        // ポップ・丸ゴシックフォントで遊び心
        if (fontAnalysis.isPlayfulHeading) score += 30;
        if (fontAnalysis.isRoundedBody) score += 20;
        if (fontAnalysis.headingCategory === 'playful') score += 15;
        
        return Math.min(score, 100);
    }

    generateClaudeCodePrompt(kit) {
        // LP選択時は専用のプロンプトを生成
        if (this.currentSiteType === 'lp') {
            return this.generateLPPrompt(kit);
        }

        const industryDescriptions = {
            "コーポレート": "信頼感のあるコーポレート企業サイト",
            "テック・IT": "モダンでテック・ITらしい革新的なWebサイト",
            "クリエイティブ": "創造性豊かでクリエイティブな印象のWebサイト",
            "ヘルスケア": "安心感と信頼性のあるヘルスケアサイト",
            "ファッション": "スタイリッシュでファッショナブルなWebサイト",
            "食品・飲食": "美味しそうで食欲をそそる飲食店サイト",
            "教育": "学習意欲を高める教育機関サイト",
            "不動産": "信頼感と安定感のある不動産サイト",
            "エンターテイメント": "楽しく魅力的なエンターテイメントサイト",
            "金融": "堅実で信頼性の高い金融サービスサイト"
        };

        // 業種別の画像キーワードマッピング
        const imageKeywords = {
            "コーポレート": "business office corporate professional team meeting",
            "テック・IT": "technology computer coding programming innovation",
            "クリエイティブ": "creative design art studio portfolio gallery",
            "ヘルスケア": "healthcare medical doctor hospital wellness",
            "ファッション": "fashion clothing style boutique accessories",
            "食品・飲食": "food restaurant cooking culinary delicious",
            "教育": "education school learning students classroom",
            "不動産": "real estate property house apartment building",
            "エンターテイメント": "entertainment music concert gaming fun",
            "金融": "finance banking money investment financial"
        };

        const description = industryDescriptions[kit.industry] || "プロフェッショナルなWebサイト";
        const keywords = imageKeywords[kit.industry] || "business professional";
        
        return `${description}を作成してください。

# 基本フレームワーク
- **Tailwind CSS** をベースフレームワークとして使用
- モダンなユーティリティファーストアプローチ
- レスポンシブデザイン完全対応

# ファーストビューの要件
## 3パターンの質問スライダー
ファーストビューでは以下の3つの質問パターンをフル画面スライダーで表示：

### 質問パターン例（${kit.industry}業界向け）
1. **質問1**: 「${kit.industry}事業で一番大切にしていることは何ですか？」
2. **質問2**: 「お客様に提供したい価値やサービスの特徴は？」  
3. **質問3**: 「競合他社との違いや強みは何ですか？」

## フル画面スライダー仕様
- 画面全体（100vh）を使用したスライダー
- スムーズなトランジション効果
- 自動スライド（5秒間隔）+ 手動操作対応
- インジケーター表示
- モバイル対応のスワイプ操作

## 背景動画機能
- 各スライドに業界に適した背景動画を配置
- 動画はミュート・ループ再生
- モバイルでは静止画フォールバック
- 動画上にオーバーレイで質問テキスト表示

# デザイン指定

## カラーパレット（Tailwind CSS Custom Colors）
- プライマリカラー: ${kit.color_palette[0]}
- セカンダリカラー: ${kit.color_palette[1]}
- アクセントカラー: ${kit.color_palette[2]}
- テキストカラー: ${kit.color_palette[3]}

## フォント指定
- 見出し用フォント: ${kit.fonts.heading}
- 本文用フォント: ${kit.fonts.body}

## 無料画像の自動配置機能
以下のJavaScriptコードを追加して、Unsplash APIから無料画像を自動で取得・配置してください：

\`\`\`javascript
// 無料画像自動配置機能
class ImageLoader {
    constructor() {
        this.unsplashAccessKey = 'YOUR_UNSPLASH_ACCESS_KEY'; // 無料のUnsplash API Key
        this.imageKeywords = '${keywords}';
    }

    async loadImages() {
        try {
            // 画像プレースホルダーを全て取得
            const imagePlaceholders = document.querySelectorAll('[data-auto-image]');
            
            for (let i = 0; i < imagePlaceholders.length; i++) {
                const placeholder = imagePlaceholders[i];
                const customKeyword = placeholder.dataset.imageKeyword || this.imageKeywords;
                
                // Unsplash APIから画像を取得
                const imageUrl = await this.fetchUnsplashImage(customKeyword, i);
                
                if (imageUrl) {
                    placeholder.src = imageUrl;
                    placeholder.alt = \`\${customKeyword}の画像\`;
                    placeholder.style.opacity = '1';
                }
            }
        } catch (error) {
            console.log('画像の読み込みに失敗しました:', error);
            // フォールバック: プレースホルダー画像を使用
            this.usePlaceholderImages();
        }
    }

    async fetchUnsplashImage(keyword, index = 0) {
        try {
            const response = await fetch(\`https://api.unsplash.com/photos/random?query=\${encodeURIComponent(keyword)}&client_id=\${this.unsplashAccessKey}&orientation=landscape&per_page=1\`);
            const data = await response.json();
            return data.urls?.regular || null;
        } catch (error) {
            // API制限に達した場合やエラーの場合は、Lorem Picsumを使用
            return \`https://picsum.photos/800/600?random=\${index}\`;
        }
    }

    usePlaceholderImages() {
        const imagePlaceholders = document.querySelectorAll('[data-auto-image]');
        imagePlaceholders.forEach((img, index) => {
            img.src = \`https://picsum.photos/800/600?random=\${index}\`;
            img.alt = '画像';
            img.style.opacity = '1';
        });
    }
}

// ページ読み込み完了後に画像を自動読み込み
document.addEventListener('DOMContentLoaded', () => {
    const imageLoader = new ImageLoader();
    imageLoader.loadImages();
});
\`\`\`

## HTML構造での画像配置
HTMLで画像を配置する際は以下のような属性を使用してください：

\`\`\`html
<!-- メインビジュアル -->
<img data-auto-image data-image-keyword="${keywords}" src="" alt="Loading..." style="opacity: 0; transition: opacity 0.5s;">

<!-- セクション画像 -->
<img data-auto-image data-image-keyword="team collaboration" src="" alt="Loading..." style="opacity: 0; transition: opacity 0.5s;">

<!-- 背景画像として使用する場合 -->
<div class="hero-section" data-auto-bg-image data-image-keyword="${keywords}">
  <!-- コンテンツ -->
</div>
\`\`\`

## フル画面スライダーの実装
以下のJavaScriptとTailwind CSSでフル画面スライダーを実装：

\`\`\`javascript
// フル画面スライダー機能
class FullScreenSlider {
    constructor() {
        this.currentSlide = 0;
        this.slides = document.querySelectorAll('.hero-slide');
        this.totalSlides = this.slides.length;
        this.autoSlideInterval = null;
        this.init();
    }

    init() {
        this.setupIndicators();
        this.setupControls();
        this.startAutoSlide();
        this.setupTouchEvents();
    }

    setupIndicators() {
        const indicators = document.querySelector('.slide-indicators');
        for (let i = 0; i < this.totalSlides; i++) {
            const dot = document.createElement('button');
            dot.className = \`w-3 h-3 rounded-full transition-all duration-300 \${i === 0 ? 'bg-white' : 'bg-white/30'}\`;
            dot.addEventListener('click', () => this.goToSlide(i));
            indicators.appendChild(dot);
        }
    }

    goToSlide(index) {
        this.currentSlide = index;
        this.updateSlider();
        this.updateIndicators();
        this.resetAutoSlide();
    }

    nextSlide() {
        this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
        this.updateSlider();
        this.updateIndicators();
    }

    updateSlider() {
        this.slides.forEach((slide, index) => {
            slide.style.transform = \`translateX(\${(index - this.currentSlide) * 100}%)\`;
        });
    }

    startAutoSlide() {
        this.autoSlideInterval = setInterval(() => {
            this.nextSlide();
        }, 5000);
    }

    resetAutoSlide() {
        clearInterval(this.autoSlideInterval);
        this.startAutoSlide();
    }
}

// 背景動画管理
class VideoBackground {
    constructor() {
        this.videos = document.querySelectorAll('.bg-video');
        this.init();
    }

    init() {
        this.videos.forEach(video => {
            video.muted = true;
            video.loop = true;
            video.playsInline = true;
            
            // モバイルでは動画を無効化
            if (window.innerWidth < 768) {
                video.style.display = 'none';
            } else {
                video.play().catch(console.log);
            }
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new FullScreenSlider();
    new VideoBackground();
});
\`\`\`

## 背景動画の実装
業界別の背景動画を自動配置：

\`\`\`html
<!-- 各スライドの構造例 -->
<div class="hero-slide relative h-screen flex items-center justify-center overflow-hidden">
    <!-- 背景動画 -->
    <video class="bg-video absolute inset-0 w-full h-full object-cover" 
           autoplay muted loop playsinline>
        <source src="https://player.vimeo.com/external/xxx.mp4" type="video/mp4">
    </video>
    
    <!-- モバイル用背景画像 -->
    <div class="md:hidden absolute inset-0 bg-cover bg-center" 
         style="background-image: url('背景画像URL')"></div>
    
    <!-- オーバーレイ -->
    <div class="absolute inset-0 bg-black/40"></div>
    
    <!-- コンテンツ -->
    <div class="relative z-10 text-center text-white px-4">
        <h1 class="text-4xl md:text-6xl font-bold mb-6">質問テキスト</h1>
        <p class="text-lg md:text-xl mb-8">説明テキスト</p>
        <button class="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-full">
            回答する
        </button>
    </div>
</div>
\`\`\`

## 実装要件
- **Tailwind CSS** ベースの完全レスポンシブデザイン
- フル画面（100vh）ファーストビュースライダー
- 業界別3パターンの質問表示
- 背景動画 + モバイル静止画フォールバック
- 自動スライド（5秒）+ 手動操作
- スワイプ操作対応（モバイル）
- 指定カラーパレットのTailwind CSS統合
- 指定フォントでのタイポグラフィ
- ${kit.industry}業界特化のコンテンツ
- 無料画像・動画の自動配置機能

# 必要なファイル
- index.html（Tailwind CDN含む）
- script.js（スライダー + 画像/動画読み込み機能）
- tailwind.config.js（カスタムカラー設定）

# 実装例

## Tailwind Config（カスタムカラー設定）
\`\`\`javascript
// tailwind.config.js
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: '${kit.color_palette[0]}',
        secondary: '${kit.color_palette[1]}',
        accent: '${kit.color_palette[2]}',
        textcolor: '${kit.color_palette[3]}'
      },
      fontFamily: {
        heading: ['${kit.fonts.heading}', 'sans-serif'],
        body: ['${kit.fonts.body}', 'sans-serif']
      }
    }
  },
  plugins: []
}
\`\`\`

## HTMLテンプレート構造
\`\`\`html
<!DOCTYPE html>
<html lang="ja" prefix="og: http://ogp.me/ns#">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- SEO基本タグ -->
    <title>${kit.industry}のプロフェッショナルサービス | 信頼と実績の${kit.industry}専門企業</title>
    <meta name="description" content="${kit.industry}業界で最高品質のサービスを提供。お客様のニーズに合わせたソリューションで、ビジネスの成功をサポートします。無料相談受付中。">
    <meta name="keywords" content="${kit.industry}, サービス, 専門, 相談, ビジネス, ソリューション, 実績, 信頼">
    <meta name="author" content="${kit.industry}専門サービス">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="https://example.com/">
    
    <!-- OGP (Open Graph Protocol) -->
    <meta property="og:type" content="website">
    <meta property="og:title" content="${kit.industry}のプロフェッショナルサービス">
    <meta property="og:description" content="${kit.industry}業界で最高品質のサービスを提供。お客様のニーズに合わせたソリューションでビジネス成功をサポート。">
    <meta property="og:url" content="https://example.com/">
    <meta property="og:site_name" content="${kit.industry}専門サービス">
    <meta property="og:image" content="https://example.com/og-image.jpg">
    <meta property="og:image:alt" content="${kit.industry}サービスのイメージ">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:locale" content="ja_JP">
    
    <!-- Twitter Cards -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${kit.industry}のプロフェッショナルサービス">
    <meta name="twitter:description" content="${kit.industry}業界で最高品質のサービスを提供。無料相談受付中。">
    <meta name="twitter:image" content="https://example.com/twitter-image.jpg">
    <meta name="twitter:image:alt" content="${kit.industry}サービスのイメージ">
    <meta name="twitter:site" content="@your_twitter_handle">
    <meta name="twitter:creator" content="@your_twitter_handle">
    
    <!-- 追加SEOタグ -->
    <meta name="theme-color" content="${kit.color_palette[0]}">
    <meta name="msapplication-TileColor" content="${kit.color_palette[0]}">
    <meta name="application-name" content="${kit.industry}サービス">
    <meta name="apple-mobile-web-app-title" content="${kit.industry}サービス">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="default">
    
    <!-- Favicon -->
    <link rel="icon" type="image/x-icon" href="/favicon.ico">
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
    <link rel="manifest" href="/site.webmanifest">
    
    <!-- JSON-LD 構造化データ -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "${kit.industry}専門サービス",
        "url": "https://example.com",
        "logo": "https://example.com/logo.png",
        "description": "${kit.industry}業界で最高品質のサービスを提供する専門企業です。",
        "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+81-3-1234-5678",
            "contactType": "customer service",
            "availableLanguage": "Japanese"
        },
        "address": {
            "@type": "PostalAddress",
            "addressCountry": "JP",
            "addressRegion": "東京都",
            "addressLocality": "渋谷区"
        },
        "sameAs": [
            "https://www.facebook.com/yourpage",
            "https://twitter.com/yourhandle",
            "https://www.linkedin.com/company/yourcompany"
        ]
    }
    </script>
    
    <!-- パフォーマンス最適化 -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link rel="dns-prefetch" href="//api.unsplash.com">
    <link rel="dns-prefetch" href="//pixabay.com">
    
    <!-- Tailwind CSS CDN -->
    <script src="https://cdn.tailwindcss.com"></script>
    
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=${kit.fonts.heading.replace(/\s/g, '+')}:wght@400;600;700&family=${kit.fonts.body.replace(/\s/g, '+')}:wght@400;500&display=swap" rel="stylesheet">
    
    <!-- Tailwindカスタム設定 -->
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        primary: '${kit.color_palette[0]}',
                        secondary: '${kit.color_palette[1]}',
                        accent: '${kit.color_palette[2]}',
                        textcolor: '${kit.color_palette[3]}'
                    },
                    fontFamily: {
                        heading: ['${kit.fonts.heading}', 'sans-serif'],
                        body: ['${kit.fonts.body}', 'sans-serif']
                    }
                }
            }
        }
    </script>
</head>
<body class="font-body text-textcolor">
    <!-- フル画面スライダーセクション -->
    <section class="hero-slider relative h-screen overflow-hidden">
        
        <!-- スライド1 -->
        <div class="hero-slide absolute inset-0 flex items-center justify-center">
            <video class="bg-video absolute inset-0 w-full h-full object-cover" autoplay muted loop playsinline>
                <source data-auto-video data-video-keyword="${keywords} office" type="video/mp4">
            </video>
            <div class="md:hidden absolute inset-0 bg-cover bg-center" data-auto-bg-image data-image-keyword="${keywords}"></div>
            <div class="absolute inset-0 bg-black/40"></div>
            <div class="relative z-10 text-center text-white px-4 max-w-4xl">
                <h1 class="font-heading text-4xl md:text-6xl font-bold mb-6">
                    ${kit.industry}事業で一番大切にしていることは何ですか？
                </h1>
                <p class="text-lg md:text-xl mb-8 font-body">
                    あなたの事業の核となる価値観をお聞かせください
                </p>
                <button class="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-full font-semibold transition-all">
                    回答する
                </button>
            </div>
        </div>
        
        <!-- スライド2 -->
        <div class="hero-slide absolute inset-0 flex items-center justify-center">
            <video class="bg-video absolute inset-0 w-full h-full object-cover" autoplay muted loop playsinline>
                <source data-auto-video data-video-keyword="${keywords} team collaboration" type="video/mp4">
            </video>
            <div class="md:hidden absolute inset-0 bg-cover bg-center" data-auto-bg-image data-image-keyword="${keywords} team"></div>
            <div class="absolute inset-0 bg-black/40"></div>
            <div class="relative z-10 text-center text-white px-4 max-w-4xl">
                <h1 class="font-heading text-4xl md:text-6xl font-bold mb-6">
                    お客様に提供したい価値やサービスの特徴は？
                </h1>
                <p class="text-lg md:text-xl mb-8 font-body">
                    ${kit.industry}事業ならではの独自の価値をお聞かせください
                </p>
                <button class="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-full font-semibold transition-all">
                    回答する
                </button>
            </div>
        </div>
        
        <!-- スライド3 -->
        <div class="hero-slide absolute inset-0 flex items-center justify-center">
            <video class="bg-video absolute inset-0 w-full h-full object-cover" autoplay muted loop playsinline>
                <source data-auto-video data-video-keyword="${keywords} innovation success" type="video/mp4">
            </video>
            <div class="md:hidden absolute inset-0 bg-cover bg-center" data-auto-bg-image data-image-keyword="${keywords} success"></div>
            <div class="absolute inset-0 bg-black/40"></div>
            <div class="relative z-10 text-center text-white px-4 max-w-4xl">
                <h1 class="font-heading text-4xl md:text-6xl font-bold mb-6">
                    競合他社との違いや強みは何ですか？
                </h1>
                <p class="text-lg md:text-xl mb-8 font-body">
                    ${kit.industry}業界であなたが選ばれる理由をお聞かせください
                </p>
                <button class="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-full font-semibold transition-all">
                    回答する
                </button>
            </div>
        </div>
        
        <!-- スライダーコントロール -->
        <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
            <div class="slide-indicators flex space-x-3"></div>
        </div>
        
        <!-- ナビゲーション矢印 -->
        <button class="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 text-white/70 hover:text-white text-3xl">
            ←
        </button>
        <button class="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 text-white/70 hover:text-white text-3xl">
            →
        </button>
    </section>
    
    <!-- メインコンテンツ -->
    <main class="bg-white">
        <!-- セクション例 -->
        <section class="py-16 px-4">
            <div class="max-w-6xl mx-auto">
                <h2 class="font-heading text-3xl md:text-4xl font-bold text-center mb-12 text-primary">
                    ${kit.industry}のプロフェッショナルサービス
                </h2>
                <!-- コンテンツ -->
            </div>
        </section>
    </main>
</body>
</html>
\`\`\`

## 背景動画自動読み込み機能
\`\`\`javascript
// 背景動画の自動読み込み機能拡張
class VideoLoader extends ImageLoader {
    constructor() {
        super();
        this.videoKeywords = '${keywords}';
    }

    async loadVideos() {
        try {
            const videoElements = document.querySelectorAll('[data-auto-video]');
            
            for (let i = 0; i < videoElements.length; i++) {
                const videoElement = videoElements[i];
                const customKeyword = videoElement.dataset.videoKeyword || this.videoKeywords;
                
                // Pixabay/Pexels APIから動画を取得
                const videoUrl = await this.fetchFreeVideo(customKeyword, i);
                
                if (videoUrl) {
                    videoElement.src = videoUrl;
                    videoElement.load();
                }
            }
        } catch (error) {
            console.log('動画の読み込みに失敗しました:', error);
        }
    }

    async fetchFreeVideo(keyword, index = 0) {
        try {
            // Pixabay Video API (無料)
            const response = await fetch(\`https://pixabay.com/api/videos/?key=YOUR_PIXABAY_KEY&q=\${encodeURIComponent(keyword)}&category=business&per_page=3\`);
            const data = await response.json();
            return data.hits[index]?.videos?.medium?.url || null;
        } catch (error) {
            // フォールバック: 静止画を使用
            return null;
        }
    }
}
\`\`\`

## SEO最適化JavaScript
\`\`\`javascript
// SEO最適化クラス
class SEOOptimizer {
    constructor() {
        this.init();
    }

    init() {
        this.generateSitemap();
        this.addStructuredData();
        this.optimizeImages();
        this.setupAnalytics();
    }

    // 自動サイトマップ生成
    generateSitemap() {
        const sitemap = \`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <url>
        <loc>https://example.com/</loc>
        <lastmod>\${new Date().toISOString().split('T')[0]}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>1.0</priority>
    </url>
    <url>
        <loc>https://example.com/services/</loc>
        <lastmod>\${new Date().toISOString().split('T')[0]}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.8</priority>
    </url>
</urlset>\`;
        console.log('Sitemap generated:', sitemap);
    }

    // 追加構造化データ
    addStructuredData() {
        const serviceSchema = {
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "${kit.industry}専門サービス",
            "description": "${kit.industry}業界で最高品質のサービスを提供",
            "provider": {
                "@type": "Organization",
                "name": "${kit.industry}専門企業"
            },
            "serviceType": "${kit.industry}コンサルティング",
            "areaServed": "日本",
            "hasOfferCatalog": {
                "@type": "OfferCatalog",
                "name": "${kit.industry}サービス一覧",
                "itemListElement": [
                    {
                        "@type": "Offer",
                        "itemOffered": {
                            "@type": "Service",
                            "name": "${kit.industry}コンサルティング"
                        }
                    }
                ]
            }
        };

        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.text = JSON.stringify(serviceSchema);
        document.head.appendChild(script);
    }

    // 画像SEO最適化
    optimizeImages() {
        document.querySelectorAll('img').forEach(img => {
            // Lazy loading
            img.loading = 'lazy';
            
            // Alt属性の自動生成
            if (!img.alt) {
                img.alt = \`${kit.industry}関連の画像\`;
            }
        });
    }

    // Google Analytics設定
    setupAnalytics() {
        // Google Analytics 4
        const gaScript = document.createElement('script');
        gaScript.async = true;
        gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID';
        document.head.appendChild(gaScript);

        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'GA_MEASUREMENT_ID');
    }
}

// SEO最適化実行
document.addEventListener('DOMContentLoaded', () => {
    new SEOOptimizer();
});
\`\`\`

## robots.txt自動生成
\`\`\`txt
User-agent: *
Allow: /

Sitemap: https://example.com/sitemap.xml

# 重要ページの優先クロール
Crawl-delay: 1

# 除外ディレクトリ
Disallow: /admin/
Disallow: /private/
\`\`\`

## site.webmanifest設定
\`\`\`json
{
    "name": "${kit.industry}専門サービス",
    "short_name": "${kit.industry}サービス",
    "description": "${kit.industry}業界で最高品質のサービスを提供",
    "start_url": "/",
    "display": "standalone",
    "background_color": "${kit.color_palette[1]}",
    "theme_color": "${kit.color_palette[0]}",
    "icons": [
        {
            "src": "/android-chrome-192x192.png",
            "sizes": "192x192",
            "type": "image/png"
        },
        {
            "src": "/android-chrome-512x512.png",
            "sizes": "512x512",
            "type": "image/png"
        }
    ]
}
\`\`\`

## 使用手順
1. **API設定**:
   - Unsplash API: https://unsplash.com/developers 
   - Pixabay API: https://pixabay.com/api/docs/
   - Google Analytics: https://analytics.google.com/

2. **SEO設定**:
   - サイトマップ自動生成
   - robots.txt配置
   - site.webmanifest設定
   - 構造化データ実装

3. **ファイル配置**:
   - favicon.ico (ルート)
   - apple-touch-icon.png (180x180px)
   - android-chrome-192x192.png
   - android-chrome-512x512.png

## 完全なSEO機能
✅ **基本SEO**: title, description, keywords, robots
✅ **OGP完全対応**: Facebook, LINE共有最適化
✅ **Twitter Cards**: 大画像カード対応
✅ **JSON-LD構造化データ**: Organization, Service
✅ **PWA対応**: Manifest, Theme color
✅ **Favicon完全セット**: 全デバイス対応
✅ **パフォーマンス**: preconnect, dns-prefetch
✅ **Analytics**: Google Analytics 4対応
✅ **Sitemap**: 自動生成機能
✅ **画像SEO**: lazy loading, alt自動生成

完全にSEO最適化され、Tailwind CSSベースでフル画面スライダー・背景動画・3パターンの質問が実装されたモダンなWebサイトを作成してください。`;
    }

    generateLPPrompt(kit) {
        // LP専用のプロンプト生成
        const colors = kit.color_palette;
        const lpPrompt = this.siteTypes.lp.promptModifier;
        
        return `${lpPrompt}

# デザインキット情報
## カラーパレット
- プライマリカラー: ${colors[0]}
- セカンダリカラー: ${colors[1]}  
- アクセントカラー: ${colors[2]}
- テキストカラー: ${colors[3]}

## フォント指定
- 見出し用フォント: ${kit.fonts.heading}
- 本文用フォント: ${kit.fonts.body}

## 技術要件
- **フレームワーク**: HTML5, CSS3, JavaScript
- **レスポンシブ対応**: モバイルファーストデザイン
- **SEO最適化**: 構造化データ、OGPタグ完備
- **パフォーマンス**: Core Web Vitals対応

## ターゲット業界
${kit.industry}業界向けの専門的なランディングページとして設計してください。

## 重要なガイドライン
- 各セクションは明確に区切り、ユーザーの視線を自然に誘導
- CTAボタンは目立つ色（プライマリカラー）で統一
- 読み込み速度を重視した軽量な実装
- A/Bテストが可能な柔軟な構造
- コンバージョン率最適化を意識したUX設計

完全に機能するランディングページを作成してください。`;
    }

    async copyPromptToClipboard(button, prompt) {
        try {
            await navigator.clipboard.writeText(prompt);
            
            // 成功時のフィードバック
            const originalContent = button.innerHTML;
            const originalClass = button.className;
            
            button.innerHTML = '✅';
            button.classList.add('copied');
            
            // 2秒後に元に戻す
            setTimeout(() => {
                button.innerHTML = originalContent;
                button.className = originalClass;
            }, 2000);
            
            // 成功通知を表示
            this.showNotification('プロンプトをクリップボードにコピーしました！', 'success');
            
        } catch (err) {
            console.error('コピーに失敗しました:', err);
            
            // 失敗時のフィードバック
            const originalContent = button.innerHTML;
            const originalClass = button.className;
            
            button.innerHTML = '❌';
            button.style.background = '#dc3545';
            
            setTimeout(() => {
                button.innerHTML = originalContent;
                button.className = originalClass;
                button.style.background = '';
            }, 2000);
            
            // エラー通知を表示
            this.showNotification('コピーに失敗しました。ブラウザがクリップボードアクセスを許可していない可能性があります。', 'error');
        }
    }

    showNotification(message, type = 'success') {
        // 通知要素を作成
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#28a745' : '#dc3545'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            max-width: 300px;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // アニメーション表示
        requestAnimationFrame(() => {
            notification.style.transform = 'translateX(0)';
        });
        
        // 3秒後に削除
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    async showKitDetails(kit) {
        const modal = document.getElementById('modal');
        const modalBody = document.getElementById('modalBody');

        // モーダルを即座に表示
        modal.style.display = 'block';
        
        // フォント読み込みを待たずに即座にコンテンツを生成
        const colorPalette = kit.color_palette.map(color => `
            <div class="modal-color-item">
                <div class="modal-color-swatch" style="background-color: ${color}"></div>
                <div class="modal-color-info">
                    <strong>${color}</strong>
                    <button class="copy-btn" data-copy-text="${color}">コピー</button>
                </div>
            </div>
        `).join('');

        // 即座にモーダルコンテンツを表示
        modalBody.innerHTML = `
            <div class="modal-kit-details">
                <h2>KIT #${kit.id} - ${kit.industry}</h2>
                
                <div class="modal-section">
                    <h3>サンプルサイトプレビュー</h3>
                    <div class="sample-preview">
                        ${await this.generateSampleSite(kit)}
                    </div>
                </div>
                
                <div class="modal-section">
                    <h3>カラーパレット</h3>
                    <div class="modal-colors">
                        ${colorPalette}
                    </div>
                </div>

                <div class="modal-section">
                    <h3>フォント組み合わせ</h3>
                    <div class="modal-fonts">
                        <div class="modal-font-item">
                            <label>見出し用フォント:</label>
                            <span class="font-demo" style="font-family: ${fontManager.getFontFamily(kit.fonts.heading)}; font-size: 1.5rem; font-weight: bold;">
                                ${kit.fonts.heading}
                            </span>
                            <button class="copy-btn" data-copy-text="${kit.fonts.heading}">コピー</button>
                        </div>
                        <div class="modal-font-item">
                            <label>本文用フォント:</label>
                            <span class="font-demo" style="font-family: ${fontManager.getFontFamily(kit.fonts.body)};">
                                ${kit.fonts.body}
                            </span>
                            <button class="copy-btn" data-copy-text="${kit.fonts.body}">コピー</button>
                        </div>
                    </div>
                </div>

                <div class="modal-section">
                    <h3>CSS変数</h3>
                    <div class="css-variables">
                        <pre><code>:root {
  --primary-color: ${kit.color_palette[0]};
  --secondary-color: ${kit.color_palette[1]};
  --accent-color: ${kit.color_palette[2]};
  --neutral-color: ${kit.color_palette[3]};
  --heading-font: '${kit.fonts.heading}', sans-serif;
  --body-font: '${kit.fonts.body}', sans-serif;
}</code></pre>
                        <button class="copy-btn" data-copy-text=":root {
  --primary-color: ${kit.color_palette[0]};
  --secondary-color: ${kit.color_palette[1]};
  --accent-color: ${kit.color_palette[2]};
  --neutral-color: ${kit.color_palette[3]};
  --heading-font: '${kit.fonts.heading}', sans-serif;
  --body-font: '${kit.fonts.body}', sans-serif;
}">CSS変数をコピー</button>
                    </div>
                </div>

                <div class="modal-section">
                    <h3>Claude Code プロンプト</h3>
                    <div class="prompt-section">
                        <div class="prompt-display">
                            <pre><code>${this.generateClaudeCodePrompt(kit)}</code></pre>
                        </div>
                        <button class="copy-prompt copy-btn-large">📋 プロンプト全体をコピー</button>
                    </div>
                </div>
            </div>
        `;

        // バックグラウンドでフォントを読み込み（非同期）
        fontManager.ensureFontLoaded(kit.fonts.heading).catch(() => {});
        fontManager.ensureFontLoaded(kit.fonts.body).catch(() => {});

        // モーダル専用スタイルを追加
        if (!document.getElementById('modal-styles')) {
            const modalStyles = document.createElement('style');
            modalStyles.id = 'modal-styles';
            modalStyles.textContent = `
                .modal-kit-details h2 {
                    color: #667eea;
                    margin-bottom: 1.5rem;
                    padding-bottom: 0.5rem;
                    border-bottom: 2px solid #e9ecef;
                }
                
                .modal-section {
                    margin-bottom: 2rem;
                }
                
                .modal-section h3 {
                    color: #495057;
                    margin-bottom: 1rem;
                    font-size: 1.1rem;
                }
                
                .modal-colors {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 1rem;
                }
                
                .modal-color-item {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    padding: 1rem;
                    background: #f8f9fa;
                    border: 2px solid #dee2e6;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                
                .modal-color-info {
                    color: #212529;
                    font-weight: 600;
                }
                
                .modal-color-info strong {
                    display: block;
                    margin-bottom: 0.5rem;
                    font-size: 1rem;
                    color: #000000;
                    background: #f1f3f4;
                    padding: 0.5rem;
                    border-radius: 4px;
                    border: 1px solid #d1d5db;
                }
                
                .modal-color-swatch {
                    width: 50px;
                    height: 50px;
                    border-radius: 8px;
                    border: 2px solid #dee2e6;
                }
                
                .modal-font-item {
                    margin-bottom: 1rem;
                    padding: 1.5rem;
                    background: #000000;
                    border: 2px solid #333333;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                }
                
                .modal-font-item label {
                    display: block;
                    font-weight: 700;
                    margin-bottom: 0.75rem;
                    color: #ffffff;
                    font-size: 0.95rem;
                    background: #333333;
                    padding: 0.5rem 0.75rem;
                    border-radius: 4px;
                    margin: -0.5rem -0.5rem 0.75rem -0.5rem;
                }
                
                .font-demo {
                    display: block;
                    margin-bottom: 0.75rem;
                    color: #ffffff;
                    font-weight: 500;
                    background: #1a1a1a;
                    padding: 0.75rem;
                    border-radius: 4px;
                    border: 1px solid #444444;
                }
                
                .modal-prompt {
                    background: #f8f9fa;
                    border: 2px solid #dee2e6;
                    padding: 1.5rem;
                    border-radius: 8px;
                    line-height: 1.6;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                
                .modal-prompt p {
                    color: #212529;
                    font-weight: 500;
                    margin-bottom: 1rem;
                    background: #f1f3f4;
                    padding: 1rem;
                    border-radius: 6px;
                    border: 1px solid #d1d5db;
                }
                
                .css-variables {
                    background: #2d3748;
                    padding: 1rem;
                    border-radius: 8px;
                    color: #e2e8f0;
                    font-family: 'Courier New', monospace;
                }
                
                .css-variables pre {
                    margin: 0;
                    white-space: pre-wrap;
                }
                
                .copy-btn {
                    background: #198754;
                    color: #ffffff;
                    border: 2px solid #198754;
                    padding: 0.6rem 1rem;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 0.85rem;
                    font-weight: 600;
                    margin-left: 0.5rem;
                    transition: all 0.3s ease;
                    box-shadow: 0 2px 4px rgba(25, 135, 84, 0.2);
                }
                
                .copy-btn:hover {
                    background: #157347;
                    border-color: #157347;
                    transform: translateY(-1px);
                    box-shadow: 0 4px 8px rgba(25, 135, 84, 0.3);
                }
                
                .copy-btn:active {
                    transform: translateY(0);
                    box-shadow: 0 2px 4px rgba(25, 135, 84, 0.2);
                }
                
                .copy-prompt {
                    margin-top: 1rem;
                    display: block;
                    margin-left: 0;
                    background: #0d6efd;
                    border-color: #0d6efd;
                    font-size: 0.9rem;
                    padding: 0.75rem 1.25rem;
                }
                
                .copy-prompt:hover {
                    background: #0b5ed7;
                    border-color: #0b5ed7;
                }
                
                .html-style-guide {
                    background: #f8f9fa;
                    border: 1px solid #dee2e6;
                    border-radius: 8px;
                    padding: 1rem;
                }
                
                .style-guide-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 1rem;
                }
                
                .style-item {
                    background: white;
                    border: 1px solid #e9ecef;
                    border-radius: 6px;
                    padding: 1rem;
                }
                
                .style-item h5 {
                    margin: 0 0 0.75rem 0;
                    color: #495057;
                    font-size: 0.9rem;
                    font-weight: 600;
                }
                
                .style-code {
                    position: relative;
                }
                
                .style-code pre {
                    background: #2d3748;
                    color: #e2e8f0;
                    padding: 1rem;
                    border-radius: 4px;
                    font-size: 0.8rem;
                    line-height: 1.4;
                    margin: 0 0 0.5rem 0;
                    overflow-x: auto;
                }
                
                .copy-btn-small {
                    background: #6c757d;
                    color: white;
                    border: none;
                    padding: 0.25rem 0.5rem;
                    border-radius: 3px;
                    font-size: 0.75rem;
                    cursor: pointer;
                    transition: background-color 0.3s ease;
                }
                
                .copy-btn-small:hover {
                    background: #5a6268;
                }
                
                .prompt-preview {
                    background: #f8f9fa;
                    border: 1px solid #dee2e6;
                    border-radius: 8px;
                    padding: 1rem;
                    margin-bottom: 1rem;
                    max-height: 300px;
                    overflow-y: auto;
                }
                
                .prompt-text {
                    font-size: 0.85rem;
                    line-height: 1.5;
                    color: #495057;
                    margin: 0;
                    white-space: pre-wrap;
                    word-wrap: break-word;
                }
                
                .prompt-actions {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                    align-items: flex-start;
                }
                
                .copy-hint {
                    color: #6c757d;
                    font-size: 0.75rem;
                    font-style: italic;
                }
                
                .sample-preview {
                    border: 2px solid #dee2e6;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 6px 20px rgba(0,0,0,0.15);
                    margin-bottom: 1rem;
                    background: white;
                    min-height: 400px;
                    position: relative;
                }
                
                .sample-site {
                    width: 100%;
                    max-width: 100%;
                }
                
                @media (max-width: 768px) {
                    .sample-site header h1 {
                        font-size: 1.8rem !important;
                    }
                    
                    .sample-site main {
                        padding: 1rem !important;
                    }
                    
                    .sample-site div[style*="grid-template-columns"] {
                        grid-template-columns: 1fr !important;
                    }
                }
            `;
            document.head.appendChild(modalStyles);
        }

        modal.style.display = 'block';
        
        // プロンプトコピーボタンのイベントリスナーを設定
        const copyPromptBtn = modal.querySelector('.copy-prompt');
        if (copyPromptBtn) {
            copyPromptBtn.addEventListener('click', async () => {
                const prompt = this.generateClaudeCodePrompt(kit);
                await this.copyPromptToClipboard(copyPromptBtn, prompt);
            });
        }

        // モーダル内のコピーボタンのイベントリスナーを設定
        this.setupCopyHandlers(modal);
    }

    updateResultsCount() {
        const resultsCount = document.getElementById('resultsCount');
        resultsCount.textContent = this.filteredData.length;
    }

    hideLoading() {
        const loading = document.getElementById('loading');
        loading.style.display = 'none';
    }

    showError(message) {
        const loading = document.getElementById('loading');
        loading.innerHTML = `
            <div class="error-message">
                <p>❌ ${message.replace(/\n/g, '<br>')}</p>
                <button class="reload-btn">再読み込み</button>
            </div>
        `;
        
        // 再読み込みボタンにイベントリスナーを追加
        const reloadBtn = loading.querySelector('.reload-btn');
        if (reloadBtn) {
            reloadBtn.addEventListener('click', () => {
                location.reload();
            });
        }
    }

    // コピー機能のハンドラー
    setupCopyHandlers(container) {
        const copyButtons = container.querySelectorAll('.copy-btn, .copy-btn-small');
        copyButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const textToCopy = button.dataset.copyText;
                if (textToCopy) {
                    navigator.clipboard.writeText(textToCopy).then(() => {
                        // 一時的にボタンテキストを変更
                        const originalText = button.textContent;
                        button.textContent = 'コピー完了!';
                        setTimeout(() => {
                            button.textContent = originalText;
                        }, 1000);
                    }).catch(err => {
                        console.error('コピーに失敗しました:', err);
                        alert('クリップボードへのコピーに失敗しました');
                    });
                }
            });
        });
    }

    // ユーティリティ関数
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// アプリケーションの初期化
document.addEventListener('DOMContentLoaded', () => {
    window.app = new WebDesignKitApp();
});

// フォント管理システム
class FontManager {
    constructor() {
        this.loadedFonts = new Set();
        this.loadingPromises = new Map();
        this.fallbackFonts = {
            'Noto Sans JP': 'sans-serif',
            'Noto Serif JP': 'serif',
            'M PLUS 1p': 'sans-serif',
            'M PLUS Rounded 1c': 'sans-serif',
            'Sawarabi Gothic': 'sans-serif',
            'Sawarabi Mincho': 'serif',
            'Kosugi': 'sans-serif',
            'Kosugi Maru': 'sans-serif',
            'Kiwi Maru': 'sans-serif',
            'Hachi Maru Pop': 'sans-serif',
            'New Tegomin': 'serif',
            'Yusei Magic': 'sans-serif',
            'BIZ UDPGothic': 'sans-serif',
            'BIZ UDPMincho': 'serif',
            'Zen Kaku Gothic New': 'sans-serif',
            'Zen Kaku Gothic Antique': 'sans-serif',
            'Zen Maru Gothic': 'sans-serif',
            'Zen Old Mincho': 'serif',
            'Murecho': 'sans-serif',
            'Stick': 'sans-serif',
            'Rampart One': 'sans-serif',
            'Reggae One': 'sans-serif',
            'RocknRoll One': 'sans-serif',
            'Mochiy Pop One': 'sans-serif',
            'Mochiy Pop P One': 'sans-serif',
            'Kaisei Tokumin': 'serif',
            'Kaisei Opti': 'serif',
            'Kaisei HarunoUmi': 'serif',
            'Kaisei Decol': 'serif',
            'Shippori Mincho': 'serif',
            'Shippori Mincho B1': 'serif',
            'Shippori Antique': 'serif',
            'Shippori Antique B1': 'serif',
            'Potta One': 'sans-serif',
            'Train One': 'sans-serif',
            'DotGothic16': 'monospace',
            'Dela Gothic One': 'sans-serif',
            'Yomogi': 'sans-serif',
            'Klee One': 'serif',
            'Hina Mincho': 'serif'
        };
        
        // 事前読み込み
        this.preloadCommonFonts();
    }

    async preloadCommonFonts() {
        const commonFonts = [
            'Noto Sans JP', 'Noto Serif JP', 'M PLUS 1p', 'Sawarabi Gothic', 
            'Kosugi', 'BIZ UDPGothic', 'Zen Kaku Gothic New', 'BIZ UDPMincho',
            'Kosugi Maru', 'Zen Old Mincho'
        ];
        
        await Promise.all(commonFonts.map(font => this.loadFont(font)));
    }

    async loadFont(fontName) {
        if (this.loadedFonts.has(fontName)) {
            return Promise.resolve();
        }

        if (this.loadingPromises.has(fontName)) {
            return this.loadingPromises.get(fontName);
        }

        const loadingPromise = new Promise((resolve) => {
            // Google Fonts API の URL を複数方式で試行
            const methods = [
                // 1. CSS @import
                () => {
                    const style = document.createElement('style');
                    style.textContent = `@import url('https://fonts.googleapis.com/css2?family=${encodeURIComponent(fontName)}:wght@300;400;500;600;700;900&display=swap');`;
                    document.head.appendChild(style);
                },
                // 2. Link tag 追加（Google Fonts最適化）
                () => {
                    const link = document.createElement('link');
                    // フォント名のスペースを+に置換（Google Fonts API仕様）
                    const encodedFontName = fontName.replace(/\s/g, '+');
                    link.href = `https://fonts.googleapis.com/css2?family=${encodedFontName}:wght@300;400;500;600;700;900&display=block`;
                    link.rel = 'stylesheet';
                    link.crossOrigin = 'anonymous';
                    document.head.appendChild(link);
                },
                // 3. FontFace API 直接
                () => {
                    if ('FontFace' in window) {
                        const fontFace = new FontFace(fontName, `url(https://fonts.gstatic.com/s/${fontName.toLowerCase().replace(/\s+/g, '')}/v1/${fontName.toLowerCase().replace(/\s+/g, '')}-regular.woff2)`);
                        fontFace.load().then(loadedFont => {
                            document.fonts.add(loadedFont);
                        }).catch(() => {
                            console.warn(`FontFace API failed for: ${fontName}`);
                        });
                    }
                }
            ];

            // 複数方式を同時実行
            methods.forEach(method => {
                try {
                    method();
                } catch (e) {
                    console.warn(`Font loading method failed for ${fontName}:`, e);
                }
            });

            // FontFace API で確認
            if ('fonts' in document) {
                // 複数のフォントウェイトで読み込みを試行
                const weights = [400, 500, 600, 700];
                const loadPromises = weights.map(weight => 
                    document.fonts.load(`${weight} 16px "${fontName}"`).catch(() => null)
                );

                Promise.all(loadPromises).then(() => {
                    this.loadedFonts.add(fontName);
                    console.log(`Successfully loaded font: ${fontName}`);
                    resolve();
                }).catch(() => {
                    console.warn(`Failed to load font: ${fontName}`);
                    // フォールバック処理でも解決
                    this.loadedFonts.add(fontName);
                    resolve();
                });
            } else {
                // 古いブラウザ対応
                setTimeout(() => {
                    this.loadedFonts.add(fontName);
                    resolve();
                }, 3000);
            }
        });

        this.loadingPromises.set(fontName, loadingPromise);
        return loadingPromise;
    }

    getFontFamily(fontName) {
        // Google Fontsの正確なfont-family名マッピング
        const googleFontMapping = {
            'Noto Sans JP': '"Noto Sans JP", sans-serif',
            'Noto Serif JP': '"Noto Serif JP", serif',
            'M PLUS 1p': '"M PLUS 1p", sans-serif',
            'M PLUS Rounded 1c': '"M PLUS Rounded 1c", sans-serif',
            'Sawarabi Gothic': '"Sawarabi Gothic", sans-serif',
            'Sawarabi Mincho': '"Sawarabi Mincho", serif',
            'Kosugi': '"Kosugi", sans-serif',
            'Kosugi Maru': '"Kosugi Maru", sans-serif',
            'Kiwi Maru': '"Kiwi Maru", sans-serif',
            'Hachi Maru Pop': '"Hachi Maru Pop", cursive',
            'New Tegomin': '"New Tegomin", serif',
            'Yusei Magic': '"Yusei Magic", sans-serif',
            'BIZ UDPGothic': '"BIZ UDPGothic", sans-serif',
            'BIZ UDPMincho': '"BIZ UDPMincho", serif',
            'Zen Kaku Gothic New': '"Zen Kaku Gothic New", sans-serif',
            'Zen Kaku Gothic Antique': '"Zen Kaku Gothic Antique", sans-serif',
            'Zen Maru Gothic': '"Zen Maru Gothic", sans-serif',
            'Zen Old Mincho': '"Zen Old Mincho", serif',
            'Murecho': '"Murecho", sans-serif',
            'Stick': '"Stick", sans-serif',
            'Rampart One': '"Rampart One", cursive',
            'Reggae One': '"Reggae One", cursive',
            'RocknRoll One': '"RocknRoll One", sans-serif',
            'Mochiy Pop One': '"Mochiy Pop One", sans-serif',
            'Mochiy Pop P One': '"Mochiy Pop P One", sans-serif',
            'Kaisei Tokumin': '"Kaisei Tokumin", serif',
            'Kaisei Opti': '"Kaisei Opti", serif',
            'Kaisei HarunoUmi': '"Kaisei HarunoUmi", serif',
            'Kaisei Decol': '"Kaisei Decol", serif',
            'Shippori Mincho': '"Shippori Mincho", serif',
            'Shippori Mincho B1': '"Shippori Mincho B1", serif',
            'Shippori Antique': '"Shippori Antique", serif',
            'Shippori Antique B1': '"Shippori Antique B1", serif',
            'Potta One': '"Potta One", cursive',
            'Train One': '"Train One", cursive',
            'DotGothic16': '"DotGothic16", monospace',
            'Dela Gothic One': '"Dela Gothic One", cursive',
            'Yomogi': '"Yomogi", cursive',
            'Klee One': '"Klee One", serif',
            'Hina Mincho': '"Hina Mincho", serif'
        };

        // マッピングテーブルから取得、なければフォールバック
        return googleFontMapping[fontName] || `"${fontName}", ${this.fallbackFonts[fontName] || 'sans-serif'}`;
    }

    async ensureFontLoaded(fontName) {
        await this.loadFont(fontName);
        return this.getFontFamily(fontName);
    }
}

// グローバルフォントマネージャーのインスタンス
const fontManager = new FontManager();

// サイトタイプ別プロンプトテンプレート機能
class SiteTypePrompts {
    constructor() {
        this.templates = {
            corporate: {
                name: "コーポレートサイト",
                description: "企業の信頼性とプロフェッショナリズムを重視したビジネスサイト"
            },
            lp: {
                name: "ランディングページ", 
                description: "コンバージョンを最大化する1ページ完結型のLP"
            },
            ecommerce: {
                name: "ECサイト",
                description: "商品の魅力を最大化し売上向上を目指すオンラインストア"
            },
            blog: {
                name: "ブログサイト",
                description: "読みやすさとSEOを重視した情報発信サイト"
            },
            portfolio: {
                name: "ポートフォリオサイト",
                description: "作品やスキルを美しく魅力的に見せるクリエイター向けサイト"
            },
            restaurant: {
                name: "レストランサイト",
                description: "美味しさを伝える飲食店向けサイト"
            },
            clinic: {
                name: "クリニックサイト",
                description: "信頼と安心感を重視した医療機関向けサイト"
            },
            salon: {
                name: "サロンサイト",
                description: "美とリラクゼーションを表現するサロン向けサイト"
            }
        };
    }

    getPrompt(siteType, kit) {
        switch (siteType) {
            case 'corporate':
                return this.getCorporatePrompt(kit);
            case 'lp':
                return this.getLandingPagePrompt(kit);
            case 'ecommerce':
                return this.getEcommercePrompt(kit);
            case 'blog':
                return this.getBlogPrompt(kit);
            case 'portfolio':
                return this.getPortfolioPrompt(kit);
            case 'restaurant':
                return this.getRestaurantPrompt(kit);
            case 'clinic':
                return this.getClinicPrompt(kit);
            case 'salon':
                return this.getSalonPrompt(kit);
            default:
                return this.getDefaultPrompt(kit);
        }
    }

    getCorporatePrompt(kit) {
        return `${kit.industry}の企業サイトを作成してください。

デザイン要件:
- 業種: ${kit.industry}
- カラーパレット: ${kit.color_palette.join(', ')}
- 見出しフォント: ${kit.fonts.heading}
- 本文フォント: ${kit.fonts.body}

技術要件:
- HTML5, CSS3, JavaScript使用
- レスポンシブデザイン対応
- プロフェッショナルで信頼感のあるデザイン

コーポレートサイト必須要素:
- ヘッダー（ナビゲーション）
- メインビジュアル
- 事業・サービス紹介
- 企業の強み・実績
- 会社概要
- お問い合わせフォーム
- フッター

${kit.industry}業界の企業として信頼される、プロフェッショナルなコーポレートサイトを作成してください。`;
    }

    getLandingPagePrompt(kit) {
        return `${kit.industry}のランディングページを作成してください。

デザイン要件:
- 業種: ${kit.industry}
- カラーパレット: ${kit.color_palette.join(', ')}
- 見出しフォント: ${kit.fonts.heading}
- 本文フォント: ${kit.fonts.body}

ランディングページ構成（PASBONA）:
- Problem: ターゲットの問題提起
- Agitation: 問題の深刻化
- Solution: 解決策提示
- Benefit: 得られるメリット
- Objection: 反論処理
- Narrowing: 限定性・緊急性
- Action: 強力なCTA

技術要件:
- HTML5, CSS3, JavaScript使用
- コンバージョン最適化
- モバイルファースト
- 高速読み込み

${kit.industry}業界で結果を出すランディングページを作成してください。`;
    }

    getEcommercePrompt(kit) {
        return `${kit.industry}のECサイトを作成してください。

デザイン要件:
- 業種: ${kit.industry}
- カラーパレット: ${kit.color_palette.join(', ')}
- 見出しフォント: ${kit.fonts.heading}
- 本文フォント: ${kit.fonts.body}

ECサイト必須要素:
- 商品カタログ・検索機能
- ショッピングカート
- 決済システム
- 商品詳細ページ
- ユーザーレビュー機能
- マイアカウント

購買意欲を高める${kit.industry}のECサイトを作成してください。`;
    }

    getBlogPrompt(kit) {
        return `${kit.industry}のブログサイトを作成してください。

デザイン要件:
- 業種: ${kit.industry}
- カラーパレット: ${kit.color_palette.join(', ')}
- 見出しフォント: ${kit.fonts.heading}
- 本文フォント: ${kit.fonts.body}

ブログサイト必須要素:
- 記事一覧・詳細ページ
- カテゴリ・タグ機能
- 検索機能
- サイドバー
- コメント機能
- SEO最適化

読みやすく回遊性の高い${kit.industry}のブログサイトを作成してください。`;
    }

    getPortfolioPrompt(kit) {
        return `${kit.industry}のポートフォリオサイトを作成してください。

デザイン要件:
- 業種: ${kit.industry}
- カラーパレット: ${kit.color_palette.join(', ')}
- 見出しフォント: ${kit.fonts.heading}
- 本文フォント: ${kit.fonts.body}

ポートフォリオ必須要素:
- 作品ギャラリー
- プロフィール・経歴
- スキル・サービス紹介
- お客様の声
- お問い合わせフォーム

${kit.industry}分野での実績をアピールする魅力的なポートフォリオサイトを作成してください。`;
    }

    getRestaurantPrompt(kit) {
        return `${kit.industry}のレストランサイトを作成してください。

デザイン要件:
- 業種: ${kit.industry}
- カラーパレット: ${kit.color_palette.join(', ')}
- 見出しフォント: ${kit.fonts.heading}
- 本文フォント: ${kit.fonts.body}

レストラン必須要素:
- 美味しそうな料理写真
- メニュー表示
- 予約システム
- 店舗情報・アクセス
- シェフ・お店の特徴

美味しさが伝わるレストランサイトを作成してください。`;
    }

    getClinicPrompt(kit) {
        return `${kit.industry}のクリニックサイトを作成してください。

デザイン要件:
- 業種: ${kit.industry}
- カラーパレット: ${kit.color_palette.join(', ')}
- 見出しフォント: ${kit.fonts.heading}
- 本文フォント: ${kit.fonts.body}

クリニック必須要素:
- 清潔感のあるデザイン
- 診療内容・専門分野
- 医師紹介・経歴
- 診療時間・アクセス
- オンライン予約システム

患者に信頼されるクリニックサイトを作成してください。`;
    }

    getSalonPrompt(kit) {
        return `${kit.industry}のサロンサイトを作成してください。

デザイン要件:
- 業種: ${kit.industry}
- カラーパレット: ${kit.color_palette.join(', ')}
- 見出しフォント: ${kit.fonts.heading}
- 本文フォント: ${kit.fonts.body}

サロン必須要素:
- 上品で洗練されたデザイン
- サービスメニュー・料金
- スタッフ紹介・技術力
- ビフォー・アフター事例
- オンライン予約システム

美と癒しを提供するサロンサイトを作成してください。`;
    }

    getDefaultPrompt(kit) {
        return `${kit.industry}のWebサイトを作成してください。

デザイン要件:
- 業種: ${kit.industry}
- カラーパレット: ${kit.color_palette.join(', ')}
- 見出しフォント: ${kit.fonts.heading}
- 本文フォント: ${kit.fonts.body}

技術要件:
- HTML5, CSS3, JavaScript使用
- レスポンシブデザイン対応
- モダンでユーザビリティの高いデザイン

上記の色とフォントを効果的に使用し、${kit.industry}業界に適した魅力的なWebサイトを作成してください。`;
    }

    getSiteTypeDescription(siteType) {
        const template = this.templates[siteType];
        return template ? template.description : '';
    }
}

// グローバルサイトタイププロンプトインスタンス
const siteTypePrompts = new SiteTypePrompts();

// グローバルアプリインスタンス
let app;

// PWA対応（Service Worker）
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}