# 手順ナビ（it-howto-ads）

Windows・スマホ・ネットワーク・周辺機器の **設定とトラブル手順** を日本語で出す、静的サイトです。本文は Markdown、ビルドは Astro（SSG）。Google AdSense のクライアント ID（既定 `ca-pub-3011430865071926`）で head に公式スクリプトを出します。記事のディスプレイ枠はスロット ID があるときだけユニットタグになります。

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
- `/about/` このサイトについて・運営者情報
- `/privacy/` プライバシーポリシー
- `/disclaimer/` 免責事項
- `/404` 日本語の 404
- `/sitemap-index.xml` `@astrojs/sitemap`
- `/robots.txt` サイトマップ URL つき
- `/ads.txt` AdSense の seller 行（`pub-3011430865071926`）

SEO: 各ページの `title` / `description`、canonical、OGP、記事の `TechArticle` JSON-LD。

広告: `src/components/AdSlot.astro` を `src/layouts/ArticleLayout.astro` が top / mid / bottom で呼び出します。head の `adsbygoogle.js` は既定クライアントで入ります。枠 ID がない位置はユニット未設定のスタブです。Amazon アソシエイトとは別です。

## Amazonアソシエイト

一部の手順記事に、切り分け用の周辺機器への **amazon.co.jp 検索リンク** を置いています（未確認の個別ASINレビューは書きません）。リンクは `src/lib/amazon.ts` が `tag=` 付きで組み立て、`src/components/AffiliateProduct.astro` が `rel="nofollow sponsored noopener"` で出します。フッターにアソシエイト参加の開示があります。

トラッキング ID（アソシエイトタグ）はビルド時の環境変数です。

| 変数 | 既定 | 用途 |
|---|---|---|
| `PUBLIC_AMAZON_ASSOCIATE_TAG` | `wasshoi22451-22` | amazon.co.jp の `tag=` |

Vercel でタグを変える場合は、Project → Settings → Environment Variables に `PUBLIC_AMAZON_ASSOCIATE_TAG` を追加し、**再ビルド（Redeploy）** してください。静的書き出しなので、変数だけ変えても既存 HTML は更新されません。

## Google AdSense

既定のパブリッシャー ID は `ca-pub-3011430865071926` です（`src/lib/adsense.ts` の `DEFAULT_ADSENSE_CLIENT`）。`PUBLIC_ADSENSE_CLIENT` が空ならこの値を使い、有効な `ca-pub-` + 数字ならそちらを優先します。プレビューでスクリプトを止めたいときだけ、`ca-pub-` 以外（例: `off`）を入れてください。

各ページの `<head>` には公式タグが出ます。

```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3011430865071926" crossorigin="anonymous"></script>
```

あわせて `<meta name="google-adsense-account" content="ca-pub-3011430865071926">` です。これでサイト確認と Auto ads（AdSense 側で有効にした場合）が動きます。

**ディスプレイ広告ユニット（`data-ad-slot`）はまだありません。** AdSense でユニットを作ったあと、枠 ID（数字）を次の変数に入れて Redeploy してください。空の `ins` を出さないため、枠 ID がない位置は「ユニット未設定」スタブのままです。

| 変数 | 既定 | 用途 |
|---|---|---|
| `PUBLIC_ADSENSE_CLIENT` | `ca-pub-3011430865071926` | head のスクリプト。Vercel に同値を置いてもよいが、未設定ならコードの既定で足りる |
| `PUBLIC_ADSENSE_SLOT_TOP` | （なし） | 記事上部ユニット |
| `PUBLIC_ADSENSE_SLOT_MID` | （なし） | 記事中部ユニット |
| `PUBLIC_ADSENSE_SLOT_BOTTOM` | （なし） | 記事下部ユニット |

`public/ads.txt` は [Google の ads.txt 形式](https://support.google.com/adsense/answer/7532444) です。

```
google.com, pub-3011430865071926, DIRECT, f08c47fec0942fa0
```

`pub-` は `ca-pub-` から `ca-` を除いた値。末尾の `f08c47fec0942fa0` は Google 共通の認証局 ID です。

### 枠 ID を後から足す（Vercel）

Astro の `PUBLIC_*` は **ビルド時** に埋め込まれます。

1. AdSense でディスプレイユニットを作り、枠 ID をコピーする。
2. Vercel → Settings → Environment Variables に `PUBLIC_ADSENSE_SLOT_TOP` などを追加する。
3. **Redeploy**（Use existing Build Cache はオフ）。
4. 記事 HTML で `data-ad-slot` がプレースホルダではなく数字になっていることを確認する。

クライアント ID を Vercel に置く必要はありません（ハードコード既定で同じ値になります）。別アカウントに切り替えるときだけ `PUBLIC_ADSENSE_CLIENT` を上書きしてください。

### 仕組み（実装メモ）

| 変数 | 未設定時 | 有効な値がビルドに入ったとき |
|---|---|---|
| `PUBLIC_ADSENSE_CLIENT` | 既定 `ca-pub-3011430865071926` で head スクリプト | その値で head スクリプト |
| `PUBLIC_ADSENSE_SLOT_*` | その位置はスタブ | 対応する `AdSlot` が `ins.adsbygoogle` + `push` |

他社の広告ネットワークは入れていません。

## 主なソース

```
src/
  content.config.ts          # 記事コレクション（Zod）
  content/articles/          # Markdown 本文
  components/AdSlot.astro            # 枠IDがあるときだけユニット。なければスタブ
  components/AdSenseHead.astro       # 既定 ca-pub で adsbygoogle.js
  components/AffiliateProduct.astro  # Amazon検索リンク（任意）
  layouts/ArticleLayout.astro
  lib/adsense.ts                     # AdSense env の検証と ads.txt 行の組み立て
  lib/amazon.ts                      # amazon.co.jp の tag= 付きURL
  lib/categories.ts                  # カテゴリ定義
  pages/about.astro                  # このサイトについて / 運営者情報
  pages/privacy.astro                # プライバシーポリシー
  pages/disclaimer.astro             # 免責事項
  pages/                     # ルート
```

UI 文言は日本語です。見た目は本文が読めること優先の、モバイルファーストな手順書レイアウトにしています。
