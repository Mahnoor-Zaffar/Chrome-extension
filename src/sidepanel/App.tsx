import React, { useEffect, useState } from 'react';
import { db, Article } from '../db';

export default function App() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [current, setCurrent] = useState<Article | null>(null);

  useEffect(() => {
    const load = async () => {
      const all = await db.articles.orderBy('addedAt').reverse().toArray();
      setArticles(all);
    };
    load();
  }, []);

  if (current) {
    return (
      <div>
        <button onClick={() => setCurrent(null)}>Back</button>
        <h1>{current.title}</h1>
        <article dangerouslySetInnerHTML={{ __html: current.content }} />
      </div>
    );
  }

  if (!articles.length) {
    return <p>No saved articles.</p>;
  }

  return (
    <ul>
      {articles.map((a) => (
        <li key={a.id}>
          <button onClick={() => setCurrent(a)}>{a.title}</button>
        </li>
      ))}
    </ul>
  );
}
