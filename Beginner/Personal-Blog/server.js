// server.js
const express = require('express');
const session = require('express-session');
const path = require('path');
const fs = require('fs/promises');
const bcrypt = require('bcrypt');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false
}));

// Authentication middleware
const requireAuth = (req, res, next) => {
    if (req.session.isAuthenticated) {
        next();
    } else {
        res.redirect('/login');
    }
};

// Routes
app.get('/', async (req, res) => {
    try {
        const articles = await getArticles();
        res.sendFile(path.join(__dirname, 'public', 'index.html'));
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch articles' });
    }
});

app.get('/api/articles', async (req, res) => {
    try {
        const articles = await getArticles();
        res.json(articles);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch articles' });
    }
});

app.get('/api/articles/:id', async (req, res) => {
    try {
        const article = await getArticle(req.params.id);
        if (!article) {
            return res.status(404).json({ error: 'Article not found' });
        }
        res.json(article);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch article' });
    }
});

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    // In production, use environment variables and proper password hashing
    if (username === 'admin' && password === 'password') {
        req.session.isAuthenticated = true;
        res.json({ success: true });
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
});

app.post('/api/articles', requireAuth, async (req, res) => {
    try {
        const article = {
            id: Date.now().toString(),
            title: req.body.title,
            content: req.body.content,
            date: new Date().toISOString()
        };
        await saveArticle(article);
        res.json(article);
    } catch (error) {
        res.status(500).json({ error: 'Failed to save article' });
    }
});

app.put('/api/articles/:id', requireAuth, async (req, res) => {
    try {
        const article = await getArticle(req.params.id);
        if (!article) {
            return res.status(404).json({ error: 'Article not found' });
        }
        const updatedArticle = {
            ...article,
            title: req.body.title,
            content: req.body.content
        };
        await saveArticle(updatedArticle);
        res.json(updatedArticle);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update article' });
    }
});

app.delete('/api/articles/:id', requireAuth, async (req, res) => {
    try {
        await deleteArticle(req.params.id);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete article' });
    }
});

// Helper functions
async function getArticles() {
    const files = await fs.readdir('articles');
    const articles = await Promise.all(
        files
            .filter(file => file.endsWith('.json'))
            .map(file => fs.readFile(`articles/${file}`, 'utf-8')
                .then(content => JSON.parse(content)))
    );
    return articles.sort((a, b) => new Date(b.date) - new Date(a.date));
}

async function getArticle(id) {
    try {
        const content = await fs.readFile(`articles/${id}.json`, 'utf-8');
        return JSON.parse(content);
    } catch (error) {
        return null;
    }
}

async function saveArticle(article) {
    await fs.writeFile(
        `articles/${article.id}.json`,
        JSON.stringify(article, null, 2)
    );
}

async function deleteArticle(id) {
    await fs.unlink(`articles/${id}.json`);
}

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});