import Dexie, { Table } from 'dexie';

export interface Article {
  id?: number;
  url: string;
  title: string;
  content: string;
  addedAt: number;
  read: boolean;
}

export class ArticlesDB extends Dexie {
  articles!: Table<Article>;

  constructor() {
    super('articlesDB');
    this.version(1).stores({
      articles: '++id,url,addedAt,read'
    });
  }
}

export const db = new ArticlesDB();
