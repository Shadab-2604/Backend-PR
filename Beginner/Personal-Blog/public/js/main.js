async function fetchArticles() {
    const response = await fetch('/api/articles');
    const articles = await response.json();
    
    const articlesList = document.getElementById('articlesList');
    articlesList.innerHTML = articles.map(article => `
        <article class="article">
            <h2>${article.title}</h2>
            <div class="date">${new Date(article.date).toLocaleDateString()}</div>
            <div class="content">${article.content}</div>
        </article>
    `).join('');
}

document.addEventListener('DOMContentLoaded', fetchArticles);