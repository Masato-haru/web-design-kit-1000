class WebDesignKitApp {
    constructor() {
        this.kitData = [];
        this.filteredData = [];
        this.currentPage = 1;
        this.itemsPerPage = 24;
        
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
            
            this.setupEventListeners();
            console.log('イベントリスナー設定完了');
            
            this.populateIndustryFilter();
            console.log('フィルター設定完了');
            
            await this.renderKits();
            console.log('初期表示完了');
            
            this.hideLoading();
            console.log('ローディング非表示完了');
            
        } catch (error) {
            console.error('アプリの初期化に失敗しました:', error);
            this.showError('データの読み込みに失敗しました。詳細: ' + error.message);
        }
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
            this.filteredData = [...this.kitData];
            
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
        searchInput.addEventListener('input', this.debounce((e) => {
            this.filterData();
        }, 300));

        // 業種フィルター
        const industryFilter = document.getElementById('industryFilter');
        industryFilter.addEventListener('change', () => {
            this.filterData();
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
        clearSortBtn.addEventListener('click', () => {
            this.clearAllSorts();
        });

        // モーダル
        const modal = document.getElementById('modal');
        const closeModal = document.getElementById('closeModal');
        
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

    async filterData() {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        const selectedIndustry = document.getElementById('industryFilter').value;
        
        // 選択されたカラーフィルターを取得
        const selectedColors = Array.from(document.querySelectorAll('.color-checkbox input[type="checkbox"]:checked'))
            .map(checkbox => checkbox.value);

        this.filteredData = this.kitData.filter(kit => {
            const matchesSearch = !searchTerm || 
                kit.industry.toLowerCase().includes(searchTerm) ||
                kit.fonts.heading.toLowerCase().includes(searchTerm) ||
                kit.fonts.body.toLowerCase().includes(searchTerm) ||
                kit.vibe_coding_prompt.toLowerCase().includes(searchTerm);

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

        // 表示前にフォントを事前読み込み
        const fontLoadPromises = [];
        currentItems.forEach(kit => {
            fontLoadPromises.push(
                fontManager.ensureFontLoaded(kit.fonts.heading),
                fontManager.ensureFontLoaded(kit.fonts.body)
            );
        });

        // フォント読み込み完了を待ってから表示
        try {
            await Promise.all(fontLoadPromises);
        } catch (error) {
            console.warn('Some fonts failed to load:', error);
        }

        kitGrid.innerHTML = currentItems.map(kit => this.createKitCard(kit)).join('');

        // カードのクリックイベントを追加
        kitGrid.querySelectorAll('.kit-card').forEach((card, index) => {
            card.addEventListener('click', async () => {
                const kit = currentItems[index];
                await this.showKitDetails(kit);
            });
        });

        this.updateResultsCount();
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

        return `
            <div class="kit-card" data-id="${kit.id}">
                <div class="card-header">
                    <div class="card-id">KIT #${kit.id}</div>
                    <div class="card-industry">${kit.industry}</div>
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
                    <div class="prompt-text">${kit.vibe_coding_prompt}</div>
                </div>
            </div>
        `;
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
        const primaryMetrics = this.getPaletteMetrics(colors);
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

        const description = industryDescriptions[kit.industry] || "プロフェッショナルなWebサイト";
        
        return `${description}を作成してください。

# デザイン指定

## カラーパレット
- プライマリカラー: ${kit.color_palette[0]}
- セカンダリカラー: ${kit.color_palette[1]}
- アクセントカラー: ${kit.color_palette[2]}
- テキストカラー: ${kit.color_palette[3]}

## フォント指定
- 見出し用フォント: ${kit.fonts.heading}
- 本文用フォント: ${kit.fonts.body}

## 実装要件
- レスポンシブデザイン（モバイル・タブレット・デスクトップ対応）
- モダンなHTML5/CSS3を使用
- 指定されたカラーパレットを効果的に活用
- 指定されたフォントでタイポグラフィを美しく表現
- ${kit.industry}業界らしいコンテンツとレイアウト
- Google Fonts APIを使用してフォントを読み込み
- CSSカスタムプロパティ（CSS変数）を活用

# 必要なファイル
- index.html
- styles.css
- 必要に応じてJavaScript

# 実装例
## CSS変数の設定
\`\`\`css
:root {
  --primary-color: ${kit.color_palette[0]};
  --secondary-color: ${kit.color_palette[1]};
  --accent-color: ${kit.color_palette[2]};
  --text-color: ${kit.color_palette[3]};
  --heading-font: '${kit.fonts.heading}', sans-serif;
  --body-font: '${kit.fonts.body}', sans-serif;
}
\`\`\`

## Google Fonts読み込み
\`\`\`html
<link href="https://fonts.googleapis.com/css2?family=${kit.fonts.heading.replace(/\s/g, '+')}:wght@400;600;700&family=${kit.fonts.body.replace(/\s/g, '+')}:wght@400;500&display=swap" rel="stylesheet">
\`\`\`

完全に動作するWebサイトを作成してください。`;
    }

    copyPromptToClipboard(button, prompt) {
        navigator.clipboard.writeText(prompt).then(() => {
            const originalText = button.textContent;
            button.textContent = '✅ コピー完了!';
            button.style.background = '#28a745';
            
            setTimeout(() => {
                button.textContent = originalText;
                button.style.background = '';
            }, 2000);
        }).catch(err => {
            console.error('コピーに失敗しました:', err);
            button.textContent = '❌ コピー失敗';
            button.style.background = '#dc3545';
            
            setTimeout(() => {
                button.textContent = '📋 Claude Codeで使用';
                button.style.background = '';
            }, 2000);
        });
    }

    async showKitDetails(kit) {
        const modal = document.getElementById('modal');
        const modalBody = document.getElementById('modalBody');

        // フォントを事前読み込み（強化版）
        await Promise.all([
            fontManager.ensureFontLoaded(kit.fonts.heading),
            fontManager.ensureFontLoaded(kit.fonts.body)
        ]);
        
        // 追加で明示的に読み込み確認
        await this.waitForFontsReady([kit.fonts.heading, kit.fonts.body]);

        const colorPalette = kit.color_palette.map(color => `
            <div class="modal-color-item">
                <div class="modal-color-swatch" style="background-color: ${color}"></div>
                <div class="modal-color-info">
                    <strong>${color}</strong>
                    <button class="copy-btn" data-copy-text="${color}">コピー</button>
                </div>
            </div>
        `).join('');

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
                    <h3>Claude Code プロンプト</h3>
                    <div class="modal-prompt">
                        <div class="prompt-preview">
                            <pre class="prompt-text" style="font-family: ${fontManager.getFontFamily(kit.fonts.body)};">${this.generateClaudeCodePrompt(kit)}</pre>
                        </div>
                        <div class="prompt-actions">
                            <button class="copy-btn copy-prompt" data-prompt-id="${kit.id}">📋 Claude Codeで使用</button>
                            <small class="copy-hint">コピーしたプロンプトをClaude Codeに貼り付けて実行してください</small>
                        </div>
                    </div>
                </div>

                <div class="modal-section">
                    <h3>CSS変数として使用</h3>
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
                    <h3>HTMLスタイル指示</h3>
                    <div class="html-style-guide">
                        ${this.generateHTMLStyleGuide(kit)}
                    </div>
                </div>

            </div>
        `;

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
            copyPromptBtn.addEventListener('click', () => {
                const prompt = this.generateClaudeCodePrompt(kit);
                this.copyPromptToClipboard(copyPromptBtn, prompt);
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

        const loadingPromise = new Promise((resolve, reject) => {
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