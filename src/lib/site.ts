export const siteMeta = {
  name: '手順ナビ',
  tagline: 'ガジェットとITの、ていねいな手順書',
  description:
    'Windows・スマホ・Wi-Fi・プリンターなどの設定とトラブルを、症状・原因・手順でわかりやすく案内します。',
  locale: 'ja_JP',
  htmlLang: 'ja',
  githubUrl: 'https://github.com/kakaoccc2-dotcom/it-howto-ads',
  githubIssuesUrl: 'https://github.com/kakaoccc2-dotcom/it-howto-ads/issues',
} as const;

export function absoluteUrl(path: string, site: URL | string | undefined): string {
  const origin =
    typeof site === 'string' ? site : (site?.origin ?? 'https://example.com');
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return new URL(normalized, origin.endsWith('/') ? origin : `${origin}/`).href;
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}
