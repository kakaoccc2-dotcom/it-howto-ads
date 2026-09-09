# 手順ナビ（it-howto-ads）

Windows・スマホ・ネットワーク・周辺機器の **設定とトラブル手順** を日本語で出す、静的サイトです。本文は Markdown、ビルドは Astro（SSG）。記事レイアウトに `AdSlot` があり、**環境変数が揃ったときだけ** Google AdSense のタグを出します。未設定のビルドでは無害な「準備中」枠のままです。

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
- `/404` 日本語の 404
- `/sitemap-index.xml` `@astrojs/sitemap`
- `/robots.txt` サイトマップ URL つき
- `/ads.txt` AdSense 承認後に差し替えるテンプレート（コメントのみ）

SEO: 各ページの `title` / `description`、canonical、OGP、記事の `TechArticle` JSON-LD。

広告: `src/components/AdSlot.astro` を `src/layouts/ArticleLayout.astro` が top / mid / bottom で呼び出します。`PUBLIC_ADSENSE_CLIENT` が未設定、またはプレースホルダのときは配信スクリプトを出しません。Amazon アソシエイトとは別です。

## Amazonアソシエイト

一部の手順記事に、切り分け用の周辺機器への **amazon.co.jp 検索リンク** を置いています（未確認の個別ASINレビューは書きません）。リンクは `src/lib/amazon.ts` が `tag=` 付きで組み立て、`src/components/AffiliateProduct.astro` が `rel="nofollow sponsored noopener"` で出します。フッターにアソシエイト参加の開示があります。

トラッキング ID（アソシエイトタグ）はビルド時の環境変数です。

| 変数 | 既定 | 用途 |
|---|---|---|
| `PUBLIC_AMAZON_ASSOCIATE_TAG` | `wasshoi22451-22` | amazon.co.jp の `tag=` |

Vercel でタグを変える場合は、Project → Settings → Environment Variables に `PUBLIC_AMAZON_ASSOCIATE_TAG` を追加し、**再ビルド（Redeploy）** してください。静的書き出しなので、変数だけ変えても既存 HTML は更新されません。

## Google AdSense

承認前は **配信タグを有効にしない**でください。仮の `ca-pub-` 番号をリポジトリや Vercel に入れないこと。未設定のままだと広告枠はスタブ表示です（ポリシー上のフェイク広告にもなりません）。

申請時にサイト側で揃えてあるもの:

- 記事コンテンツ（手順記事）
- [このサイトについて / 運営者情報](src/pages/about.astro)（`/about/`）
- [プライバシーポリシー](src/pages/privacy.astro)（`/privacy/`、広告・アフィリエイト Cookie の説明）
- `public/ads.txt`（コメントのテンプレート。承認前に publisher ID は書いていません）

### 承認後に貼るもの

AdSense 管理画面から **画面に出た値をそのまま** 使います（推測しない）。

| 貼る場所 | 管理画面でコピーするもの |
|---|---|
| Vercel の `PUBLIC_ADSENSE_CLIENT` | パブリッシャー ID（`ca-pub-` で始まる値） |
| 任意: `PUBLIC_ADSENSE_SLOT_TOP` / `_MID` / `_BOTTOM` | ディスプレイ広告ユニットの枠 ID（数字） |
| `public/ads.txt` | サイト用 ads.txt の **1 行**（`google.com, pub-…, DIRECT, …`） |

`ads.txt` の `pub-` はタグの `ca-pub-` から `ca-` を除いた値です。末尾の認証局 ID は Google 共通なので、必ず AdSense が表示した行を使ってください。

### Vercel で環境変数を入れて再デプロイする

Astro の `PUBLIC_*` は **ビルド時** に HTML へ埋め込まれます。変数を足しただけでは本番は変わりません。

1. [AdSense](https://www.google.com/adsense/) でサイトが承認されたことを確認する。
2. Vercel → 対象プロジェクト → **Settings → Environment Variables**。
3. 次を追加する（Production / Preview のどちらに入れるかは運用に合わせる。本番だけ有効にするなら Production のみ）。

   | Name | Value |
   |---|---|
   | `PUBLIC_ADSENSE_CLIENT` | AdSense の `ca-pub-` + 数字 |
   | `PUBLIC_ADSENSE_SLOT_TOP` | （任意）上部ユニットの枠 ID |
   | `PUBLIC_ADSENSE_SLOT_MID` | （任意）中部ユニットの枠 ID |
   | `PUBLIC_ADSENSE_SLOT_BOTTOM` | （任意）下部ユニットの枠 ID |

4. `public/ads.txt` を、AdSense が提示した行に差し替えてコミットする（推奨。下記の生成案でも可）。
5. **Deployments → 最新 Production → Redeploy**（または ads.txt のコミットを main にマージして自動デプロイ）。「Use existing Build Cache」はオフにする。
6. 公開 URL で次を確認する。
   - ページソースに `adsbygoogle.js?client=ca-pub-…` がある（クライアント ID を入れた場合）
   - 枠 ID も入れた記事ページで `data-ad-slot` がプレースホルダではない
   - `https://<本番ドメイン>/ads.txt` が AdSense の 1 行になっている

クライアント ID だけ入れて枠 ID を空にした場合、head の AdSense スクリプト（Auto ads / サイト確認用）は出ますが、記事の `AdSlot` はスタブのままです。空の `ins` を出してポリシー違反にしないためです。手動ユニットを出すなら枠 ID もセットしてください。

ローカル確認は `.env` に同じ変数を書き、`npm run build && npm run preview` です。`.env.example` に名前だけあります。**数字のダミー ID は書かないでください。**

### ads.txt の 2 通り

**A. 静的テンプレート（このリポジトリの既定）**

`public/ads.txt` はコメントのみです。承認後に AdSense の行へ置き換えてデプロイします。プレビューに誤った publisher ID が出ません。UTF-8 BOM 付きで、Vercel では `vercel.json` により `Content-Type: text/plain; charset=utf-8` です。

**B. ビルド時に環境変数から生成する（任意）**

`src/lib/adsense.ts` の `adsTxtLine()` は、有効な `PUBLIC_ADSENSE_CLIENT` があるときだけ `google.com, pub-…, DIRECT, …` を返します（プレースホルダは `undefined`）。自動生成する場合は `public/ads.txt` を外し、`src/pages/ads.txt.ts` からその 1 行を `text/plain; charset=utf-8` で返すようにします（`public/` とページが同じ `ads.txt` だと Astro は public 側を優先してページをスキップします）。既定では有効にしていません。

### 仕組み（実装メモ）

| 変数 | 未設定時 | 有効な値がビルドに入ったとき |
|---|---|---|
| `PUBLIC_ADSENSE_CLIENT` | スタブ枠。`adsbygoogle.js` なし | `<head>` に `google-adsense-account` と公式スクリプト |
| `PUBLIC_ADSENSE_SLOT_*` | その位置はスタブ | 対応する `AdSlot` が `ins.adsbygoogle` + `push` |

`ca-pub-xxxxxxxx` のようなプレースホルダや、数字以外を含む値は無効扱いです。他社の広告ネットワークは入れていません。

## 主なソース

```
src/
  content.config.ts          # 記事コレクション（Zod）
  content/articles/          # Markdown 本文
  components/AdSlot.astro            # 広告枠（env 未設定時はスタブ）
  components/AdSenseHead.astro       # AdSense スクリプト（client が有効なときだけ）
  components/AffiliateProduct.astro  # Amazon検索リンク（任意）
  layouts/ArticleLayout.astro
  lib/adsense.ts                     # AdSense env の検証と ads.txt 行の組み立て
  lib/amazon.ts                      # amazon.co.jp の tag= 付きURL
  lib/categories.ts                  # カテゴリ定義
  pages/about.astro                  # このサイトについて / 運営者情報
  pages/privacy.astro                # プライバシーポリシー
  pages/                     # ルート
```

UI 文言は日本語です。見た目は本文が読めること優先の、モバイルファーストな手順書レイアウトにしています。
