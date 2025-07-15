# Web制作KIT 1000選

業種別カラーパレット＆日本語フォント組み合わせとVibeCodingプロンプト集

## 🎨 機能

- **1000通りの組み合わせ**: 10業種 × 100パターンのカラーパレット＋フォント組み合わせ
- **業種別分類**: コーポレート、テック・IT、クリエイティブ、ヘルスケア、ファッション、食品・飲食、教育、不動産、エンターテイメント、金融
- **日本語フォント対応**: Google Fonts の日本語フォント80種類以上
- **VibeCoding対応**: 各組み合わせにVibeCoding用プロンプトを付属
- **リアルタイム検索**: 業種、フォント名、プロンプト内容で検索可能
- **レスポンシブ対応**: PC・タブレット・スマートフォンに対応
- **PWA対応**: オフラインでも使用可能

## 🚀 使い方

### ローカル環境での起動

1. ファイルをダウンロード
```bash
git clone [repository-url]
cd web-design-kit
```

2. ローカルサーバーを起動
```bash
# Python3がインストールされている場合
python3 -m http.server 8000

# Node.jsがインストールされている場合
npx serve .

# VS Code Live Server拡張機能を使用
# index.htmlを右クリック → "Open with Live Server"
```

3. ブラウザでアクセス
```
http://localhost:8000
```

### GitHub Pagesでのデプロイ

1. GitHubリポジトリを作成
2. ファイルをアップロード
3. Settings → Pages → Source を "Deploy from a branch" に設定
4. Branch を "main" に設定
5. デプロイ完了後、提供されるURLにアクセス

## 📁 ファイル構成

```
web-design-kit/
├── index.html              # メインHTMLファイル
├── styles.css              # スタイルシート
├── app.js                  # JavaScript（メイン機能）
├── web_design_kit_1000.json # 1000個のKITデータ
├── manifest.json           # PWA設定
├── sw.js                   # Service Worker
├── web_design_kit_generator.py # データ生成スクリプト
└── README.md               # このファイル
```

## 💡 VibeCodingでの使用方法

1. 気に入ったKITを選択
2. 詳細モーダルを開く
3. "VibeCoding プロンプト" をコピー
4. VibeCodingに貼り付けて実行

### プロンプト例
```
モダンでテック・ITらしい革新的なWebサイトを作成してください。
カラーパレット：#8B5CF6、#111827、#F9FAFB、#374151
フォント：見出し「Zen Old Mincho」本文「Rubik」
```

## 🎯 対象業種

| 業種 | 説明 | カラー特徴 |
|------|------|-----------|
| コーポレート | 企業・法人向け | 信頼感のあるブルー系 |
| テック・IT | IT・テクノロジー | モダンな寒色系 |
| クリエイティブ | デザイン・芸術 | 鮮やかで表現力豊か |
| ヘルスケア | 医療・健康 | 安心感のあるグリーン系 |
| ファッション | アパレル・美容 | トレンド感のある色彩 |
| 食品・飲食 | 飲食・グルメ | 食欲をそそる暖色系 |
| 教育 | 学校・教育機関 | 学習を促すブルー系 |
| 不動産 | 建築・住宅 | 安定感のあるアース系 |
| エンターテイメント | 娯楽・エンタメ | 楽しさを表現する多彩な色 |
| 金融 | 銀行・保険 | 堅実さを表す落ち着いた色 |

## 🔧 カスタマイズ

### 新しいKITの追加

`web_design_kit_generator.py` を編集して再生成：

```python
# 業種を追加
self.industry_color_schemes["新業種"] = [
    ["#色1", "#色2", "#色3", "#色4"],
    # 追加のカラーパレット...
]

# フォントを追加
self.japanese_fonts["見出し用"].append("新しいフォント")
```

### UIのカスタマイズ

`styles.css` を編集してデザインを変更：

```css
/* メインカラーの変更 */
:root {
    --primary-color: #667eea;
    --secondary-color: #764ba2;
}
```

## 🔧 トラブルシューティング

### 「データ読み込み中...」から進まない場合

1. **HTTPサーバーが起動されていない**
   - 上記の方法でHTTPサーバーを起動してください
   - file://プロトコルでは正常に動作しません

2. **ブラウザの開発者ツールを確認**
   - F12を押して開発者ツールを開く
   - Consoleタブでエラーメッセージを確認

3. **キャッシュのクリア**
   - Ctrl+F5（Windows）またはCmd+Shift+R（Mac）で強制リロード

### エラーメッセージの例と対処法

- **「Failed to fetch」**: HTTPサーバーが起動されていません
- **「404 Not Found」**: ファイルパスが正しくありません
- **「CORS error」**: file://プロトコルでアクセスしています

## 📱 PWA機能

- オフライン対応
- ホーム画面への追加
- アプリライクな動作
- キャッシュによる高速表示

## 🛠️ 技術仕様

- **フロントエンド**: Vanilla JavaScript (ES6+)
- **スタイル**: CSS3 (Grid, Flexbox)
- **データ**: JSON
- **PWA**: Service Worker + Web App Manifest
- **フォント**: Google Fonts API
- **レスポンシブ**: Mobile First

## 📊 パフォーマンス

- 初回読み込み: ~500KB
- キャッシュ後: ~50KB
- 検索レスポンス: <100ms
- モバイル対応: 100%

## 🤝 貢献

プルリクエストやイシューの報告をお待ちしています。

## 📄 ライセンス

MIT License

## 🔗 関連リンク

- [VibeCoding](https://vibecoding.com)
- [Google Fonts](https://fonts.google.com)
- [MDN PWA Guide](https://developer.mozilla.org/docs/Web/Progressive_web_apps)