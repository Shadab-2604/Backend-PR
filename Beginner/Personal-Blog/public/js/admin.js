let currentArticleId = null;
  
  async function checkAuth() {
      try {
          const response = await fetch('/api/check-auth');
          const isAuthenticated = response.ok;
          
          document.getElementById('loginForm').style.display = 
              isAuthenticated ? 'none' : 'block';
          document.getElementById('adminPanel').style.display = 
              isAuthenticated ? 'block' : 'none';
          
          if (isAuthenticated) {
              fetchArticles();
          }
      } catch (error) {
          console.error('Auth check error:', error);
      }
  }
  
  async function handleLogin(e) {
      e.preventDefault();
      
      const username = document.querySelector('input[name="username"]').value;
      const password = document.querySelector('input[name="password"]').value;
      
      try {
          const response = await fetch('/api/login', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify({ username, password })
          });
          
          const data = await response.json();
          
          if (response.ok && data.success) {
              document.getElementById('loginForm').style.display = 'none';
              document.getElementById('adminPanel').style.display = 'block';
              fetchArticles();
          } else {
              alert('Invalid credentials. Please try again.');
          }
      } catch (error) {
          console.error('Login error:', error);
          alert('Login failed. Please try again.');
      }
  }
  
  async function fetchArticles() {
      try {
          const response = await fetch('/api/articles');
          const articles = await response.json();
          
          const articlesList = document.getElementById('articlesList');
          articlesList.innerHTML = articles.map(article => `
              <article class="article">
                  <h2>${article.title}</h2>
                  <div class="date">${new Date(article.date).toLocaleDateString()}</div>
                  <div class="content">${article.content}</div>
                  <div class="article-actions">
                      <button onclick="editArticle('${article.id}')">Edit</button>
                      <button class="delete-btn" onclick="deleteArticle('${article.id}')">Delete</button>
                  </div>
              </article>
          `).join('');
      } catch (error) {
          console.error('Error fetching articles:', error);
      }
  }
  
  async function handleArticleSubmit(e) {
      e.preventDefault();
      
      const formData = new FormData(e.target);
      const articleData = {
          title: formData.get('title'),
          content: formData.get('content')
      };
      
      try {
          const method = currentArticleId ? 'PUT' : 'POST';
          const url = currentArticleId 
              ? `/api/articles/${currentArticleId}`
              : '/api/articles';
              
          const response = await fetch(url, {
              method,
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(articleData)
          });
          
          if (response.ok) {
              resetForm();
              fetchArticles();
          } else {
              alert('Failed to save article');
          }
      } catch (error) {
          console.error('Error saving article:', error);
          alert('Error saving article');
      }
  }
  
  async function editArticle(id) {
      try {
          const response = await fetch(`/api/articles/${id}`);
          const article = await response.json();
          
          currentArticleId = id;
          const form = document.getElementById('article');
          form.title.value = article.title;
          form.content.value = article.content;
          
          document.getElementById('articleForm').style.display = 'block';
      } catch (error) {
          console.error('Error loading article:', error);
          alert('Error loading article');
      }
  }
  
  async function deleteArticle(id) {
      if (confirm('Are you sure you want to delete this article?')) {
          try {
              const response = await fetch(`/api/articles/${id}`, {
                  method: 'DELETE'
              });
              
              if (response.ok) {
                  fetchArticles();
              } else {
                  alert('Failed to delete article');
              }
          } catch (error) {
              console.error('Error deleting article:', error);
              alert('Error deleting article');
          }
      }
  }
  
  function resetForm() {
      currentArticleId = null;
      document.getElementById('article').reset();
      document.getElementById('articleForm').style.display = 'none';
  }
  
  document.addEventListener('DOMContentLoaded', () => {
      const loginForm = document.getElementById('login');
      if (loginForm) {
          loginForm.addEventListener('submit', handleLogin);
      }
      
      const articleForm = document.getElementById('article');
      if (articleForm) {
          articleForm.addEventListener('submit', handleArticleSubmit);
      }
      
      const newArticleBtn = document.getElementById('newArticleBtn');
      if (newArticleBtn) {
          newArticleBtn.addEventListener('click', () => {
              resetForm();
              document.getElementById('articleForm').style.display = 'block';
          });
      }
      
      const cancelEditBtn = document.getElementById('cancelEdit');
      if (cancelEditBtn) {
          cancelEditBtn.addEventListener('click', resetForm);
      }
      
      checkAuth();
  });