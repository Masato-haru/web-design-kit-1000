# GitHub Pages デプロイ手順

## 1. GitHubリポジトリを作成

1. https://github.com にログイン
2. 「New repository」をクリック
3. リポジトリ名: `web-design-kit-1000` (お好みの名前)
4. 「Public」を選択
5. 「Create repository」をクリック

## 2. ローカルでGitを初期化

```bash
# プロジェクトディレクトリに移動
cd "/Users/kuritamasato/Downloads/Ai WebデザインKIT"

# Gitを初期化
git init

# すべてのファイルを追加
git add .

# 初回コミット
git commit -m "Initial commit: Web Design Kit 1000 - カラーパレット＆フォント組み合わせ"

# リモートリポジトリを追加（YOUR_USERNAMEを実際のユーザー名に変更）
git remote add origin https://github.com/YOUR_USERNAME/web-design-kit-1000.git

# mainブランチにプッシュ
git branch -M main
git push -u origin main
```

## 3. GitHub Pages を有効化

1. GitHubのリポジトリページに移動
2. 「Settings」タブをクリック
3. 左サイドバーの「Pages」をクリック
4. Source: 「Deploy from a branch」を選択
5. Branch: 「main」を選択
6. Folder: 「/ (root)」を選択
7. 「Save」をクリック

## 4. デプロイ完了

数分後、以下のURLでアクセス可能：
```
https://YOUR_USERNAME.github.io/web-design-kit-1000/
```

## 5. 更新方法

ファイルを修正した後：
```bash
git add .
git commit -m "Update: 説明"
git push
```

自動的にサイトが更新されます（1-2分後）。