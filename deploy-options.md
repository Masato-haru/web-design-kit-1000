# デプロイオプション

## 🎯 GitHub Pages（推奨・無料）
- **URL**: `https://username.github.io/repo-name/`
- **利点**: 完全無料、簡単、自動更新
- **手順**: `deploy-github.md` を参照

## 🌐 Netlify（無料）
1. https://netlify.com にサインアップ
2. 「New site from Git」をクリック
3. GitHubリポジトリを選択
4. 「Deploy site」をクリック
5. カスタムドメインも設定可能

## ⚡ Vercel（無料）
1. https://vercel.com にサインアップ
2. 「New Project」をクリック
3. GitHubリポジトリをインポート
4. 「Deploy」をクリック
5. 高速CDN付き

## 💾 Firebase Hosting（無料）
```bash
# Firebase CLI をインストール
npm install -g firebase-tools

# ログイン
firebase login

# プロジェクト初期化
firebase init hosting

# デプロイ
firebase deploy
```

## 📦 その他のオプション

### Surge.sh（無料）
```bash
npm install -g surge
cd "/Users/kuritamasato/Downloads/Ai WebデザインKIT"
surge
```

### GitHub Codespaces（開発環境）
1. GitHubリポジトリで「Code」→「Codespaces」
2. 「Create codespace」
3. オンライン開発環境で編集可能

## 🎨 カスタムドメイン

### GitHub Pages
1. リポジトリの Settings → Pages
2. Custom domain に入力（例: `webdesignkit.com`）
3. DNS設定でCNAMEレコードを追加

### Netlify/Vercel
- 管理画面でカスタムドメインを追加
- 自動SSL証明書付き

## 🔄 CI/CD自動化

### GitHub Actions（自動デプロイ）
```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages
on:
  push:
    branches: [ main ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./
```

## 📊 アクセス解析

### Google Analytics
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## 🚀 パフォーマンス最適化

### 画像最適化
- PNGからWebPに変換
- 画像圧縮

### CDN活用
- CloudflareでCDN設定
- 静的アセットの高速配信

## 🔒 セキュリティ

### HTTPS
- GitHub Pages: 自動対応
- Netlify/Vercel: 自動SSL証明書

### Content Security Policy
```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;">
```