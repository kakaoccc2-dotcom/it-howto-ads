import { getCollection, type CollectionEntry } from 'astro:content';
import type { CategoryId } from './categories';

export type Article = CollectionEntry<'articles'>;

export async function getPublishedArticles(): Promise<Article[]> {
  const articles = await getCollection('articles', ({ data }) => data.draft !== true);
  return articles.sort((a, b) => b.data.updated.valueOf() - a.data.updated.valueOf());
}

export async function getArticlesByCategory(category: CategoryId): Promise<Article[]> {
  const articles = await getPublishedArticles();
  return articles.filter((article) => article.data.category === category);
}

export function relatedArticles(current: Article, pool: Article[], limit = 3): Article[] {
  const sameCategory = pool.filter(
    (article) => article.id !== current.id && article.data.category === current.data.category,
  );
  const currentTags = new Set(current.data.tags);
  const scored = pool
    .filter((article) => article.id !== current.id)
    .map((article) => {
      const tagScore = article.data.tags.filter((tag) => currentTags.has(tag)).length;
      const categoryScore = article.data.category === current.data.category ? 2 : 0;
      return { article, score: tagScore + categoryScore };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || b.article.data.updated.valueOf() - a.article.data.updated.valueOf());

  const picked = scored.map((entry) => entry.article);
  const merged = [...picked];
  for (const article of sameCategory) {
    if (!merged.some((item) => item.id === article.id)) merged.push(article);
  }
  return merged.slice(0, limit);
}

export function articlePath(article: Article): string {
  return `/articles/${article.id}/`;
}
