// データ管理クラス
class DataManager {
    constructor() {
        this.kitData = [];
        this.filteredData = [];
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
    }

    // データの読み込み
    async loadData() {
        try {
            const response = await fetch('data/webdesign_kits.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            this.kitData = data.webdesign_kits || [];
            this.filteredData = [...this.kitData];
            
            // 人気度スコアを計算
            this.calculatePopularityScores();
            
            return this.kitData;
        } catch (error) {
            console.error('データの読み込みに失敗:', error);
            throw error;
        }
    }

    // 人気度スコアの計算
    calculatePopularityScores() {
        this.kitData.forEach(kit => {
            kit.popularityScore = this.calculatePopularityScore(kit);
        });
    }

    // 個別の人気度スコア計算
    calculatePopularityScore(kit) {
        let score = 0;
        
        // フォントの人気度チェック
        if (this.popularFonts.heading.includes(kit.fonts.heading)) {
            score += this.popularFonts.heading.indexOf(kit.fonts.heading) === 0 ? 100 : 50;
        }
        if (this.popularFonts.body.includes(kit.fonts.body)) {
            score += this.popularFonts.body.indexOf(kit.fonts.body) === 0 ? 100 : 50;
        }
        
        // 同じフォントの組み合わせにボーナス
        if (kit.fonts.heading === 'Noto Sans JP' && kit.fonts.body === 'Noto Sans JP') {
            score += 200;
        }
        
        return score;
    }

    // データのフィルタリング
    filterData(searchTerm = '', industry = '', colors = [], siteType = '') {
        this.filteredData = this.kitData.filter(kit => {
            // 検索条件
            const matchesSearch = !searchTerm || 
                kit.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                kit.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
                kit.fonts.heading.toLowerCase().includes(searchTerm.toLowerCase()) ||
                kit.fonts.body.toLowerCase().includes(searchTerm.toLowerCase());

            // 業種フィルター
            const matchesIndustry = !industry || kit.industry === industry;

            // カラーフィルター
            const matchesColors = colors.length === 0 || 
                colors.some(color => kit.color_palette.includes(color));

            // サイトタイプフィルター
            const matchesSiteType = !siteType || kit.site_type === siteType;

            return matchesSearch && matchesIndustry && matchesColors && matchesSiteType;
        });

        return this.filteredData;
    }

    // データのソート
    sortData(criteria = []) {
        if (criteria.length === 0) {
            // デフォルトは人気度順
            this.filteredData.sort((a, b) => (b.popularityScore || 0) - (a.popularityScore || 0));
            return;
        }

        this.filteredData.sort((a, b) => {
            for (const criterion of criteria) {
                let comparison = 0;
                
                switch (criterion) {
                    case 'popularity':
                        comparison = (b.popularityScore || 0) - (a.popularityScore || 0);
                        break;
                    case 'alphabetical':
                        comparison = a.title.localeCompare(b.title);
                        break;
                    case 'industry':
                        comparison = a.industry.localeCompare(b.industry);
                        break;
                }
                
                if (comparison !== 0) return comparison;
            }
            return 0;
        });
    }

    // 業種一覧の取得
    getIndustries() {
        const industries = [...new Set(this.kitData.map(kit => kit.industry))];
        return industries.sort();
    }

    // カラーパレット一覧の取得
    getUniqueColors() {
        const colors = new Set();
        this.kitData.forEach(kit => {
            kit.color_palette.forEach(color => colors.add(color));
        });
        return Array.from(colors);
    }

    // サイトタイプ一覧の取得
    getSiteTypes() {
        const siteTypes = [...new Set(this.kitData.map(kit => kit.site_type))];
        return siteTypes.sort();
    }

    // ページネーション用のデータ取得
    getPaginatedData(page = 1, itemsPerPage = 24) {
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return this.filteredData.slice(startIndex, endIndex);
    }

    // 総ページ数の計算
    getTotalPages(itemsPerPage = 24) {
        return Math.ceil(this.filteredData.length / itemsPerPage);
    }

    // データの取得
    getKitData() {
        return this.kitData;
    }

    getFilteredData() {
        return this.filteredData;
    }
}

export default DataManager;