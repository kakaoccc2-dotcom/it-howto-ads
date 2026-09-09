# 手順ナビ（it-howto-ads）

Windows・スマホ・ネットワーク・周辺機器の **設定とトラブル手順** を日本語で出す、静的サイトです。本文は Markdown、ビルドは Astro（SSG）。あとから AdSense などの広告スクリプトを差し込めるよう、記事レイアウトに `AdSlot` の枠だけ置いてあります（**配信タグは未導入**）。

## ローカルで動かす

Node.js 22.x。

```bash
npm install
npm run dev
```

ブラウザで <http://localhost:4321> を開きます。

| コマンド | 用途 |
|---|---|
| `npm run dev` | 開発サーバー |
| `npm run build` | 静的書き出し（`dist/`） |
| `npm run preview` | ビルド結果の確認 |

本番 URL（canonical / sitemap / robots / OG）は `astro.config.mjs` の `site` です。任意の `PUBLIC_SITE_URL`（絶対 URL）があればそれを使い、無ければ Vercel のデプロイホスト、最後に `https://example.com` へフォールバックします。空文字や相対パスは無視するので、カスタムドメイン用の環境変数がなくても `astro build` は通ります。

Vercel へ出すときは、このリポジトリの `vercel.json` どおり **Astro / `npm run build` / 出力 `dist`** の静的ホスティングで足ります（Hobby 向け。サーバーレス用の `@astrojs/vercel` は使いません）。Git 連携済みなら、マージ後にダッシュボードの **Redeploy** だけで再ビルドできます。

## 記事の置き場とテンプレート

| パス | 役割 |
|---|---|
| `src/content/articles/_template.md` | **複製用テンプレート** |
| `src/content/articles/*.md` | 公開・下書き記事（`_` 始まりは除外） |
| `docs/content-guide.md` | 量産時の書き方・frontmatter・禁止事項 |

Frontmatter は次の6つです。

```yaml
title: 表示タイトル
description: メタディスクリプション
category: windows # windows | smartphone | network | peripherals
tags:
  - 例
updated: 2026-09-09
draft: false
```

`draft: true` の記事は一覧・サイトマップ・記事ページに出ません。追加手順の詳細は [docs/content-guide.md](docs/content-guide.md) を見てください。

サンプル記事（5本以上）は `src/content/articles/` に入っています。ホームとカテゴリから内部リンクされています。

## サイト構成

- `/` ホーム（カテゴリと新着）
- `/categories/` カテゴリ一覧
- `/categories/<id>/` Windows / スマホ / ネットワーク / 周辺機器
- `/articles/` 全記事
- `/articles/<slug>/` 記事（AdSlot 上・中・下）
- `/about/` 方針
- `/404` 日本語の 404
- `/sitemap-index.xml` `@astrojs/sitemap`
- `/robots.txt` サイトマップ URL つき

SEO: 各ページの `title` / `description`、canonical、OGP、記事の `TechArticle` JSON-LD。

広告: `src/components/AdSlot.astro` を `src/layouts/ArticleLayout.astro` が top / mid / bottom で呼び出します。ネットワーク用 script は置かないでください。

## Amazonアソシエイト

一部の手順記事に、切り分け用の周辺機器への **amazon.co.jp 検索リンク** を置いています（未確認の個別ASINレビューは書きません）。リンクは `src/lib/amazon.ts` が `tag=` 付きで組み立て、`src/components/AffiliateProduct.astro` が `rel="nofollow sponsored noopener"` で出します。フッターにアソシエイト参加の開示があります。

トラッキング ID（アソシエイトタグ）はビルド時の環境変数です。

| 変数 | 既定 | 用途 |
|---|---|---|
| `PUBLIC_AMAZON_ASSOCIATE_TAG` | `wasshoi22451-22` | amazon.co.jp の `tag=` |

Vercel でタグを変える場合は、Project → Settings → Environment Variables に `PUBLIC_AMAZON_ASSOCIATE_TAG` を追加し、**再ビルド（Redeploy）** してください。静的書き出しなので、変数だけ変えても既存 HTML は更新されません。

## 主なソース

```
src/
  content.config.ts          # 記事コレクション（Zod）
  content/articles/          # Markdown 本文
  components/AdSlot.astro            # 広告枠スタブ
  components/AffiliateProduct.astro  # Amazon検索リンク（任意）
  layouts/ArticleLayout.astro
  lib/amazon.ts                      # amazon.co.jp の tag= 付きURL
  lib/categories.ts                  # カテゴリ定義
  pages/                     # ルート
```

UI 文言は日本語です。見た目は本文が読めること優先の、モバイルファーストな手順書レイアウトにしています。
