// サイトタイプ別プロンプトテンプレート管理クラス
class PromptTemplates {
    constructor() {
        this.templates = this.initializeTemplates();
    }

    initializeTemplates() {
        return {
            corporate: {
                name: "コーポレートサイト",
                description: "企業の信頼性とプロフェッショナリズムを重視したビジネスサイト",
                template: this.getCorporateTemplate()
            },
            lp: {
                name: "ランディングページ",
                description: "コンバージョンを最大化する1ページ完結型のLP",
                template: this.getLandingPageTemplate()
            },
            ecommerce: {
                name: "ECサイト",
                description: "商品の魅力を最大化し売上向上を目指すオンラインストア",
                template: this.getEcommerceTemplate()
            },
            blog: {
                name: "ブログサイト",
                description: "読みやすさとSEOを重視した情報発信サイト",
                template: this.getBlogTemplate()
            },
            portfolio: {
                name: "ポートフォリオサイト",
                description: "作品やスキルを美しく魅力的に見せるクリエイター向けサイト",
                template: this.getPortfolioTemplate()
            },
            restaurant: {
                name: "レストランサイト",
                description: "美味しさを伝える飲食店向けサイト",
                template: this.getRestaurantTemplate()
            },
            clinic: {
                name: "クリニックサイト",
                description: "信頼と安心感を重視した医療機関向けサイト",
                template: this.getClinicTemplate()
            },
            salon: {
                name: "サロンサイト",
                description: "美とリラクゼーションを表現するサロン向けサイト",
                template: this.getSalonTemplate()
            }
        };
    }

    // コーポレートサイト用プロンプト
    getCorporateTemplate() {
        return {
            basePrompt: (kit) => `${kit.industry}の企業サイトを作成してください。

# 基本フレームワーク
- **Tailwind CSS** をベースフレームワークとして使用
- モダンなユーティリティファーストアプローチ
- レスポンシブデザイン完全対応

# デザイン指定
## カラーパレット
- プライマリカラー: ${kit.color_palette[0]}
- セカンダリカラー: ${kit.color_palette[1] || kit.color_palette[0]}
- アクセントカラー: ${kit.color_palette[2] || kit.color_palette[1] || kit.color_palette[0]}
- テキストカラー: #2D3748

## フォント指定
- 見出し用フォント: ${kit.fonts.heading}
- 本文用フォント: ${kit.fonts.body}

# コーポレートサイト特化要件
## 必須コンテンツ
1. **ヘッダー**: ロゴ、グローバルナビゲーション、お問い合わせボタン
2. **メインビジュアル**: 企業の価値観を表現する印象的なヒーローセクション
3. **事業紹介**: サービス・事業内容を3-4つのセクションで紹介
4. **企業の強み**: 競合優位性や選ばれる理由を数値やグラフで表現
5. **会社概要**: 企業情報、沿革、アクセス
6. **お問い合わせ**: フォーム + 電話・メールでの連絡先
7. **フッター**: サイトマップ、SNSリンク、著作権表示

## 信頼性向上要素
- 実績・導入事例セクション
- 代表者・チームメンバー紹介
- 認証・資格・アワード表示
- お客様の声・推薦コメント
- セキュリティ対策・プライバシーポリシー

## 技術要件
- 企業らしい安定感のあるレイアウト
- 読みやすい階層構造
- CTAボタンの戦略的配置
- SEO最適化（meta tags, structured data）
- アクセシビリティ対応

# 業界特化ポイント（${kit.industry}）
- 業界の専門性をアピールする要素を含める
- ターゲット顧客が求める情報を優先表示
- 業界特有の信頼要素（認証、実績等）を強調

指定されたカラーパレットとフォントを効果的に使用し、${kit.industry}業界の企業として信頼される、プロフェッショナルなコーポレートサイトを作成してください。`,

            shortPrompt: (kit) => `${kit.industry}の企業サイトを${kit.title}のデザインで作成。信頼性重視のコーポレートデザイン。カラー: ${kit.color_palette.join(', ')}、フォント: ${kit.fonts.heading}/${kit.fonts.body}`,

            claudeCodePrompt: (kit) => `${kit.industry}の企業サイトを作成してください。

デザイン要件:
- 業種: ${kit.industry}
- デザインコンセプト: ${kit.title}
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

${kit.industry}業界の企業として信頼される、プロフェッショナルなコーポレートサイトを作成してください。`
        };
    }

    // ランディングページ用プロンプト
    getLandingPageTemplate() {
        return {
            basePrompt: (kit) => `${kit.industry}のランディングページ（LP）を作成してください。

# 基本フレームワーク
- **Tailwind CSS** をベースフレームワークとして使用
- コンバージョン最適化重視
- レスポンシブデザイン完全対応

# デザイン指定
## カラーパレット
- プライマリカラー: ${kit.color_palette[0]}
- セカンダリカラー: ${kit.color_palette[1] || kit.color_palette[0]}
- アクセントカラー: ${kit.color_palette[2] || kit.color_palette[1] || kit.color_palette[0]}
- CVボタンカラー: ${kit.color_palette[0]}

## フォント指定
- 見出し用フォント: ${kit.fonts.heading}
- 本文用フォント: ${kit.fonts.body}

# ランディングページ特化要件
## PASBONA構成に基づく必須セクション
1. **Problem（問題提起）**: ターゲットの悩み・問題を明確化
2. **Agitation（煽り・共感）**: 問題の深刻さを訴求
3. **Solution（解決策）**: あなたの商品・サービスが解決策
4. **Benefit（利益）**: 得られるメリット・ベネフィット
5. **Objection（反論処理）**: よくある疑問・不安を解消
6. **Narrowing（限定・緊急性）**: 今すぐ行動すべき理由
7. **Action（行動喚起）**: 明確なCTA

## 高コンバージョン要素
- インパクトのあるキャッチコピー
- 社会的証明（お客様の声、実績数値）
- 権威性（メディア掲載、著名人推薦）
- 希少性・限定性の訴求
- リスク排除（返金保証、お試し期間）
- 段階的CTA設計

## 技術要件
- ファーストビューでの価値訴求
- 読了率を高めるストーリー構成
- モバイル最適化
- 高速読み込み
- CTAボタンの効果的配置
- コンバージョン計測設定

# 業界特化ポイント（${kit.industry}）
- 業界特有の痛み・ニーズにフォーカス
- 専門用語を適切に使用
- 業界での実績・権威性を強調

指定されたカラーパレットとフォントを使用し、${kit.industry}業界でコンバージョンを最大化する効果的なランディングページを作成してください。`,

            shortPrompt: (kit) => `${kit.industry}のランディングページを${kit.title}で作成。コンバージョン最重視のLP設計。カラー: ${kit.color_palette.join(', ')}、フォント: ${kit.fonts.heading}/${kit.fonts.body}`,

            claudeCodePrompt: (kit) => `${kit.industry}のランディングページを作成してください。

デザイン要件:
- 業種: ${kit.industry}
- デザインコンセプト: ${kit.title}
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

${kit.industry}業界で結果を出すランディングページを作成してください。`
        };
    }

    // ECサイト用プロンプト
    getEcommerceTemplate() {
        return {
            basePrompt: (kit) => `${kit.industry}のECサイトを作成してください。

# 基本フレームワーク
- **Tailwind CSS** をベースフレームワークとして使用
- ユーザビリティ最優先
- レスポンシブデザイン完全対応

# デザイン指定
## カラーパレット
- プライマリカラー: ${kit.color_palette[0]}
- セカンダリカラー: ${kit.color_palette[1] || kit.color_palette[0]}
- アクセントカラー: ${kit.color_palette[2] || kit.color_palette[1] || kit.color_palette[0]}
- 購入ボタンカラー: ${kit.color_palette[0]}

## フォント指定
- 見出し用フォント: ${kit.fonts.heading}
- 本文用フォント: ${kit.fonts.body}

# ECサイト特化要件
## 必須機能・ページ
1. **トップページ**: 商品カテゴリ、おすすめ商品、セール情報
2. **商品一覧**: カテゴリ別表示、フィルタリング、ソート機能
3. **商品詳細**: 高画質画像、詳細説明、レビュー、関連商品
4. **ショッピングカート**: 商品追加・削除、数量変更、合計金額
5. **決済フロー**: お客様情報入力、配送方法選択、決済方法選択
6. **ユーザーアカウント**: 会員登録、ログイン、注文履歴
7. **検索機能**: 商品検索、候補表示、検索結果表示

## 売上向上要素
- 商品の魅力的な見せ方（画像、説明文）
- 購入を促進するUI（限定性、人気商品）
- レコメンド機能（関連商品、よく一緒に購入）
- 社会的証明（レビュー、評価、購入者数）
- 安心・信頼要素（SSL、返品保証、配送情報）
- カート放棄対策（簡単決済、ゲスト購入）

## 技術要件
- 直感的なナビゲーション
- 高速な商品検索・フィルタリング
- モバイル最適化（タッチ操作対応）
- セキュアな決済システム対応
- 在庫管理システム連携想定
- SEO対策（商品ページ最適化）

# 業界特化ポイント（${kit.industry}）
- 業界特有の商品特性を活かした見せ方
- ターゲット顧客の購買行動に最適化
- 業界での競合優位性を表現

指定されたカラーパレットとフォントを使用し、${kit.industry}業界で売上を最大化するユーザーフレンドリーなECサイトを作成してください。`,

            shortPrompt: (kit) => `${kit.industry}のECサイトを${kit.title}で作成。商品の魅力を最大化する売上重視のデザイン。カラー: ${kit.color_palette.join(', ')}、フォント: ${kit.fonts.heading}/${kit.fonts.body}`,

            claudeCodePrompt: (kit) => `${kit.industry}のECサイトを作成してください。

デザイン要件:
- 業種: ${kit.industry}
- デザインコンセプト: ${kit.title}
- カラーパレット: ${kit.color_palette.join(', ')}
- 見出しフォント: ${kit.fonts.heading}
- 本文フォント: ${kit.fonts.body}

ECサイト必須要素:
- 商品一覧・検索機能
- 商品詳細ページ
- ショッピングカート
- 購入フロー
- ユーザーアカウント機能
- 決済システム対応

売上向上要素:
- 商品の魅力的な表示
- レコメンド機能
- レビュー・評価システム
- セール・キャンペーン表示

技術要件:
- HTML5, CSS3, JavaScript使用
- モバイル最適化
- 高速読み込み
- セキュリティ対応

${kit.industry}業界で売上を伸ばすECサイトを作成してください。`
        };
    }

    // ブログ用プロンプト
    getBlogTemplate() {
        return {
            basePrompt: (kit) => `${kit.industry}のブログサイトを作成してください。

# 基本フレームワーク
- **Tailwind CSS** をベースフレームワークとして使用
- 読みやすさとSEO最適化重視
- レスポンシブデザイン完全対応

# デザイン指定
## カラーパレット
- プライマリカラー: ${kit.color_palette[0]}
- セカンダリカラー: ${kit.color_palette[1] || kit.color_palette[0]}
- アクセントカラー: ${kit.color_palette[2] || kit.color_palette[1] || kit.color_palette[0]}
- テキストカラー: #2D3748

## フォント指定
- 見出し用フォント: ${kit.fonts.heading}
- 本文用フォント: ${kit.fonts.body}

# ブログサイト特化要件
## 必須ページ・機能
1. **トップページ**: 最新記事、人気記事、カテゴリ一覧
2. **記事一覧**: カテゴリ別、タグ別、日付別表示
3. **記事詳細**: 読みやすい本文レイアウト、関連記事、SNSシェア
4. **カテゴリページ**: カテゴリ別記事一覧
5. **タグページ**: タグ別記事一覧
6. **検索機能**: サイト内記事検索
7. **アーカイブ**: 月別・年別記事一覧
8. **プロフィール**: 運営者・ライター紹介

## 読者エンゲージメント要素
- 魅力的なアイキャッチ画像
- 読みやすいタイポグラフィ
- 適切な余白とレイアウト
- SNSシェアボタン
- コメント機能対応
- 関連記事の表示
- 人気記事ランキング
- メルマガ登録フォーム

## SEO対策要素
- 構造化データ（Article, BreadcrumbList）
- OGP対応（記事別設定）
- サイトマップ対応
- 内部リンク最適化
- パンくずナビ
- 高速読み込み対応
- モバイルファースト

# 業界特化ポイント（${kit.industry}）
- 業界専門情報を発信するブログとして
- ターゲット読者が求める情報構成
- 業界の権威性を示すコンテンツ配置

指定されたカラーパレットとフォントを使用し、${kit.industry}業界の専門性を活かした読みやすく、SEOに強いブログサイトを作成してください。`,

            shortPrompt: (kit) => `${kit.industry}のブログサイトを${kit.title}で作成。読みやすさとSEO重視の情報発信サイト。カラー: ${kit.color_palette.join(', ')}、フォント: ${kit.fonts.heading}/${kit.fonts.body}`,

            claudeCodePrompt: (kit) => `${kit.industry}のブログサイトを作成してください。

デザイン要件:
- 業種: ${kit.industry}
- デザインコンセプト: ${kit.title}
- カラーパレット: ${kit.color_palette.join(', ')}
- 見出しフォント: ${kit.fonts.heading}
- 本文フォント: ${kit.fonts.body}

ブログサイト必須要素:
- トップページ（最新・人気記事）
- 記事一覧・詳細ページ
- カテゴリ・タグ機能
- 検索機能
- アーカイブ機能
- プロフィールページ

読みやすさ重視要素:
- 適切なタイポグラフィ
- 見やすいレイアウト
- SNSシェア機能
- 関連記事表示

技術要件:
- HTML5, CSS3, JavaScript使用
- SEO最適化
- モバイル対応
- 高速読み込み

${kit.industry}業界の専門ブログサイトを作成してください。`
        };
    }

    // ポートフォリオ用プロンプト
    getPortfolioTemplate() {
        return {
            basePrompt: (kit) => `${kit.industry}のポートフォリオサイトを作成してください。

# 基本フレームワーク
- **Tailwind CSS** をベースフレームワークとして使用
- 視覚的インパクト重視
- レスポンシブデザイン完全対応

# デザイン指定
## カラーパレット
- プライマリカラー: ${kit.color_palette[0]}
- セカンダリカラー: ${kit.color_palette[1] || kit.color_palette[0]}
- アクセントカラー: ${kit.color_palette[2] || kit.color_palette[1] || kit.color_palette[0]}
- テキストカラー: #2D3748

## フォント指定
- 見出し用フォント: ${kit.fonts.heading}
- 本文用フォント: ${kit.fonts.body}

# ポートフォリオ特化要件
## 必須セクション
1. **ヒーロー**: インパクトのある自己紹介、専門分野アピール
2. **アバウト**: プロフィール、スキル、経歴
3. **ポートフォリオ**: 作品ギャラリー（カテゴリ別フィルタリング対応）
4. **サービス**: 提供できるサービス・料金
5. **スキル**: 技術スキル、使用ツールの視覚化
6. **経歴**: 職歴、学歴、受賞歴
7. **お客様の声**: 推薦コメント、評価
8. **コンタクト**: お問い合わせフォーム、SNSリンク

## 作品を魅力的に見せる要素
- 高品質な作品画像・動画
- ホバーエフェクト・アニメーション
- Lightbox機能（拡大表示）
- 作品詳細モーダル
- Before/After比較
- 制作プロセス紹介
- 使用技術・ツール表示
- 成果・効果の数値化

## 技術要件
- モダンでクリエイティブなデザイン
- 画像最適化・遅延読み込み
- スムーズなアニメーション
- 作品フィルタリング機能
- モバイル最適化
- 高速読み込み
- SEO対策（クリエイター名での検索対応）

# 業界特化ポイント（${kit.industry}）
- ${kit.industry}業界のクリエイターとしての専門性
- 業界特有の作品タイプに最適化
- ターゲットクライアントへの訴求

指定されたカラーパレットとフォントを使用し、${kit.industry}業界のクリエイターとして仕事を獲得できる魅力的なポートフォリオサイトを作成してください。`,

            shortPrompt: (kit) => `${kit.industry}のポートフォリオサイトを${kit.title}で作成。作品を美しく見せるクリエイター向けデザイン。カラー: ${kit.color_palette.join(', ')}、フォント: ${kit.fonts.heading}/${kit.fonts.body}`,

            claudeCodePrompt: (kit) => `${kit.industry}のポートフォリオサイトを作成してください。

デザイン要件:
- 業種: ${kit.industry}
- デザインコンセプト: ${kit.title}
- カラーパレット: ${kit.color_palette.join(', ')}
- 見出しフォント: ${kit.fonts.heading}
- 本文フォント: ${kit.fonts.body}

ポートフォリオサイト必須要素:
- 印象的なヒーローセクション
- プロフィール・スキル紹介
- 作品ギャラリー（フィルタリング機能付き）
- 提供サービス・料金
- お客様の声
- コンタクトフォーム

作品を魅力的に見せる要素:
- 高品質な作品表示
- ホバーエフェクト
- Lightbox機能
- Before/After比較

技術要件:
- HTML5, CSS3, JavaScript使用
- モダンでクリエイティブなデザイン
- 画像最適化
- モバイル対応

${kit.industry}業界で仕事を獲得できるポートフォリオサイトを作成してください。`
        };
    }

    // 指定されたサイトタイプのプロンプトを取得
    getPrompt(siteType, promptType, kit) {
        const template = this.templates[siteType];
        if (!template) {
            return this.getDefaultPrompt(kit);
        }

        switch (promptType) {
            case 'base':
                return template.template.basePrompt(kit);
            case 'short':
                return template.template.shortPrompt(kit);
            case 'claude':
            default:
                return template.template.claudeCodePrompt(kit);
        }
    }

    // デフォルトプロンプト（フォールバック）
    getDefaultPrompt(kit) {
        return `${kit.industry}のWebサイトを作成してください。

デザイン要件:
- 業種: ${kit.industry}
- デザインコンセプト: ${kit.title}
- カラーパレット: ${kit.color_palette.join(', ')}
- 見出しフォント: ${kit.fonts.heading}
- 本文フォント: ${kit.fonts.body}

技術要件:
- HTML5, CSS3, JavaScript使用
- レスポンシブデザイン対応
- モダンでユーザビリティの高いデザイン

上記の色とフォントを効果的に使用し、${kit.industry}業界に適した魅力的なWebサイトを作成してください。`;
    }

    // レストラン用プロンプト
    getRestaurantTemplate() {
        return {
            basePrompt: (kit) => `${kit.industry}のレストランサイトを作成してください。

# 基本フレームワーク
- **Tailwind CSS** をベースフレームワークとして使用
- 食欲をそそる美しいデザイン
- レスポンシブデザイン完全対応

# デザイン指定
## カラーパレット
- プライマリカラー: ${kit.color_palette[0]}
- セカンダリカラー: ${kit.color_palette[1] || kit.color_palette[0]}
- アクセントカラー: ${kit.color_palette[2] || kit.color_palette[1] || kit.color_palette[0]}

## フォント指定
- 見出し用フォント: ${kit.fonts.heading}
- 本文用フォント: ${kit.fonts.body}

# レストラン特化要件
## 必須コンテンツ
1. **ヘッダー**: ロゴ、メニュー、予約ボタン
2. **メインビジュアル**: 料理写真を活用した魅力的なヒーロー
3. **メニュー**: 分類別料理・ドリンクメニュー（価格表示）
4. **店舗情報**: アクセス、営業時間、席数
5. **予約フォーム**: オンライン予約システム
6. **お店の特徴**: シェフ紹介、こだわり、雰囲気

美味しさが伝わるレストランサイトを作成してください。`,

            shortPrompt: (kit) => `${kit.industry}のレストランサイトを${kit.title}で作成。美味しさをアピールする飲食店サイト。カラー: ${kit.color_palette.join(', ')}`,

            claudeCodePrompt: (kit) => `${kit.industry}のレストランサイトを作成してください。

デザイン要件:
- 業種: ${kit.industry}
- カラーパレット: ${kit.color_palette.join(', ')}
- 見出しフォント: ${kit.fonts.heading}
- 本文フォント: ${kit.fonts.body}

必須要素:
- 美味しそうな料理写真
- メニュー表示
- 予約システム
- 店舗情報・アクセス
- シェフ・お店の特徴

美味しさが伝わるレストランサイトを作成してください。`
        };
    }

    // クリニック用プロンプト
    getClinicTemplate() {
        return {
            basePrompt: (kit) => `${kit.industry}のクリニックサイトを作成してください。

# 基本フレームワーク
- **Tailwind CSS** をベースフレームワークとして使用
- 清潔感と信頼感のあるデザイン
- レスポンシブデザイン完全対応

# デザイン指定
## カラーパレット
- プライマリカラー: ${kit.color_palette[0]}
- セカンダリカラー: ${kit.color_palette[1] || kit.color_palette[0]}
- アクセントカラー: ${kit.color_palette[2] || kit.color_palette[1] || kit.color_palette[0]}

## フォント指定
- 見出し用フォント: ${kit.fonts.heading}
- 本文フォント: ${kit.fonts.body}

# クリニック特化要件
## 必須コンテンツ
1. **ヘッダー**: ロゴ、診療科目、予約ボタン
2. **メインビジュアル**: 安心感を与える院内・医師写真
3. **診療内容**: 専門分野・治療方法の詳細説明
4. **医師紹介**: 経歴、専門、メッセージ
5. **診療時間・アクセス**: わかりやすい情報表示
6. **オンライン予約**: 予約システム・問診票

患者に安心と信頼を与えるクリニックサイトを作成してください。`,

            shortPrompt: (kit) => `${kit.industry}のクリニックサイトを${kit.title}で作成。信頼感のある医療機関サイト。カラー: ${kit.color_palette.join(', ')}`,

            claudeCodePrompt: (kit) => `${kit.industry}のクリニックサイトを作成してください。

デザイン要件:
- 業種: ${kit.industry}
- カラーパレット: ${kit.color_palette.join(', ')}
- 見出しフォント: ${kit.fonts.heading}
- 本文フォント: ${kit.fonts.body}

必須要素:
- 清潔感のあるデザイン
- 診療内容・専門分野
- 医師紹介・経歴
- 診療時間・アクセス
- オンライン予約システム

患者に信頼されるクリニックサイトを作成してください。`
        };
    }

    // サロン用プロンプト
    getSalonTemplate() {
        return {
            basePrompt: (kit) => `${kit.industry}のサロンサイトを作成してください。

# 基本フレームワーク
- **Tailwind CSS** をベースフレームワークとして使用
- 上品で洗練されたデザイン
- レスポンシブデザイン完全対応

# デザイン指定
## カラーパレット
- プライマリカラー: ${kit.color_palette[0]}
- セカンダリカラー: ${kit.color_palette[1] || kit.color_palette[0]}
- アクセントカラー: ${kit.color_palette[2] || kit.color_palette[1] || kit.color_palette[0]}

## フォント指定
- 見出し用フォント: ${kit.fonts.heading}
- 本文フォント: ${kit.fonts.body}

# サロン特化要件
## 必須コンテンツ
1. **ヘッダー**: ロゴ、サービスメニュー、予約ボタン
2. **メインビジュアル**: 美しいサロン空間の写真
3. **サービスメニュー**: 施術内容・料金表
4. **スタッフ紹介**: 技術力・経験をアピール
5. **ビフォー・アフター**: 施術事例・お客様の変化
6. **予約システム**: オンライン予約・相談フォーム

美と癒しを提供するサロンサイトを作成してください。`,

            shortPrompt: (kit) => `${kit.industry}のサロンサイトを${kit.title}で作成。美と癒しを表現するサロンサイト。カラー: ${kit.color_palette.join(', ')}`,

            claudeCodePrompt: (kit) => `${kit.industry}のサロンサイトを作成してください。

デザイン要件:
- 業種: ${kit.industry}
- カラーパレット: ${kit.color_palette.join(', ')}
- 見出しフォント: ${kit.fonts.heading}
- 本文フォント: ${kit.fonts.body}

必須要素:
- 上品で洗練されたデザイン
- サービスメニュー・料金
- スタッフ紹介・技術力
- ビフォー・アフター事例
- オンライン予約システム

美と癒しを提供するサロンサイトを作成してください。`
        };
    }

    // サイトタイプ一覧を取得
    getSiteTypes() {
        return Object.keys(this.templates).map(key => ({
            key,
            name: this.templates[key].name,
            description: this.templates[key].description
        }));
    }

    // サイトタイプの説明を取得
    getSiteTypeDescription(siteType) {
        const template = this.templates[siteType];
        return template ? template.description : '';
    }
}

export default PromptTemplates;