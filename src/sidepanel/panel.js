async function loadArticles() {
  const { articles = [] } = await chrome.storage.local.get('articles');
  const list = document.getElementById('list');
  list.innerHTML = '';
  articles.forEach((a, i) => {
    const li = document.createElement('li');
    li.textContent = a.title || a.url;
    li.addEventListener('click', () => showArticle(i));
    list.appendChild(li);
  });
}

async function showArticle(index) {
  const { articles = [] } = await chrome.storage.local.get('articles');
  const article = articles[index];
  document.getElementById('viewer').textContent = article.text;
}

document.addEventListener('DOMContentLoaded', loadArticles);

