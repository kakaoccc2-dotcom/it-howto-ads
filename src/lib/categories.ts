export const categoryIds = ['windows', 'smartphone', 'network', 'peripherals'] as const;

export type CategoryId = (typeof categoryIds)[number];

export interface Category {
  id: CategoryId;
  name: string;
  shortName: string;
  description: string;
  href: string;
}

export const categories: Record<CategoryId, Category> = {
  windows: {
    id: 'windows',
    name: 'Windows',
    shortName: 'Windows',
    description:
      'Windows 10 / 11 の設定、エラーメッセージ、スタートアップ、互換性の手順です。',
    href: '/categories/windows/',
  },
  smartphone: {
    id: 'smartphone',
    name: 'スマホ',
    shortName: 'スマホ',
    description: 'Android と iPhone の Wi-Fi、Bluetooth、設定まわりの手順です。',
    href: '/categories/smartphone/',
  },
  network: {
    id: 'network',
    name: 'ネットワーク',
    shortName: 'ネット',
    description: 'Wi-Fi、DNS、インターネット接続エラーの切り分けと直し方です。',
    href: '/categories/network/',
  },
  peripherals: {
    id: 'peripherals',
    name: '周辺機器',
    shortName: '周辺機器',
    description: 'プリンター、キーボード、ヘッドセットなど接続と互換性の案内です。',
    href: '/categories/peripherals/',
  },
};

export const categoryList: Category[] = categoryIds.map((id) => categories[id]);

export function getCategory(id: string): Category | undefined {
  return categoryIds.includes(id as CategoryId) ? categories[id as CategoryId] : undefined;
}
