# EIKEN Grade 1 Speaking — 300 Phrases / 900 Examples

英検1級のスピーキング対策用に作成した、**300表現 × 各3例 = 900例文**の非公式学習サイトです。

ブラウザだけで動作する静的サイトで、サーバーやビルド処理は不要です。GitHub Pages にそのまま公開できます。

## Features

- 300の再利用しやすい英語表現
- 各表現につき3つの例文、合計900例文
- 全例文に日本語訳
- 表現番号・英語・日本語による検索
- 30カテゴリーで絞り込み
- 優先30表現のみを表示
- 日本語訳の表示 / 非表示
- ランダム出題
- スマートフォン対応
- 印刷用レイアウト
- 外部ライブラリ・CDN不要

## Repository structure

```text
eiken-grade1-speaking/
├── index.html      # GitHub Pages で公開するサイト本体
├── README.md       # このファイル
├── .nojekyll       # Jekyll処理を無効化
└── .gitignore
```

## GitHub Pages で公開する方法

1. GitHub で新しいリポジトリを作成します。例：`eiken-grade1-speaking`
2. このフォルダ内のファイルを、リポジトリのルートにアップロードします。
3. GitHub のリポジトリ画面で `Settings` → `Pages` を開きます。
4. `Build and deployment` の Source で `Deploy from a branch` を選択します。
5. Branch を `main`、Folder を `/(root)` にして保存します。
6. デプロイ完了後、Pages のURLからアクセスできます。

通常、URLは次の形式になります。

```text
https://<GitHubユーザー名>.github.io/eiken-grade1-speaking/
```

## Local preview

`index.html` をブラウザで直接開くだけでも利用できます。

ローカルHTTPサーバーで確認したい場合は、リポジトリのディレクトリで次を実行できます。

```bash
python3 -m http.server 8000
```

その後、ブラウザで `http://localhost:8000` を開きます。

## Customization

サイト名や説明文は `index.html` 冒頭の `<title>` と `<meta name="description">` から変更できます。

色は CSS の以下の変数を変更するとまとめて調整できます。

```css
:root {
  --ink: #15283d;
  --muted: #647284;
  --accent: #16796b;
  --paper: #f5f6f8;
  --line: #e1e7ed;
}
```

## Content note

収録英文は学習用の作例です。公式の模範解答や、実在の事例・統計の引用ではありません。個人の経歴や経験を述べる例文は、実際のスピーキングでは自分自身の内容に置き換えてください。

このリポジトリは英検の**非公式学習教材**であり、実施団体との提携・承認関係はありません。

## License

現時点ではライセンスを指定していません。第三者による再利用を許可したい場合は、公開前に用途に合ったライセンスを追加してください。

## Optional workbook

`resources/eiken_grade1_300phrases_900examples.xlsx` には、同じ900例文を練習状況つきで管理できるExcel版を収録しています。Webサイトの動作には不要なので、不要なら `resources/` を削除しても問題ありません。
