// server.js
const express = require('express');
const session = require('express-session');
const path = require('path');
const fs = require('fs');  // Change this line
const fsPromises = require('fs').promises;  // Add this line

const app = express();
const PORT = 3000;

// Create articles directory if it doesn't exist
if (!fs.existsSync('articles')) {  // Now this will work
    fs.mkdirSync('articles');
}

// Middleware
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

// Authentication middleware
const requireAuth = (req, res, next) => {
    if (req.session.isAuthenticated) {
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
};

// Routes
app.get('/api/check-auth', (req, res) => {
    if (req.session.isAuthenticated) {
        res.json({ authenticated: true });
    } else {
        res.status(401).json({ authenticated: false });
    }
});

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === 'password') {
        req.session.isAuthenticated = true;
        res.json({ success: true });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
});

app.post('/api/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true });
});

app.get('/api/articles', async (req, res) => {
    try {
        const files = await fsPromises.readdir('articles');  // Use fsPromises here
        const articles = await Promise.all(
            files
                .filter(file => file.endsWith('.json'))
                .map(async file => {
                    const content = await fsPromises.readFile(`articles/${file}`, 'utf-8');  // And here
                    return JSON.parse(content);
                })
        );
        res.json(articles.sort((a, b) => new Date(b.date) - new Date(a.date)));
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch articles' });
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
        await fsPromises.writeFile(  // Use fsPromises here
            `articles/${article.id}.json`,
            JSON.stringify(article, null, 2)
        );
        res.json(article);
    } catch (error) {
        res.status(500).json({ error: 'Failed to save article' });
    }
});

app.put('/api/articles/:id', requireAuth, async (req, res) => {
    try {
        const filePath = `articles/${req.params.id}.json`;
        const article = {
            id: req.params.id,
            title: req.body.title,
            content: req.body.content,
            date: new Date().toISOString()
        };
        await fsPromises.writeFile(filePath, JSON.stringify(article, null, 2));  // Use fsPromises here
        res.json(article);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update article' });
    }
});

app.delete('/api/articles/:id', requireAuth, async (req, res) => {
    try {
        await fsPromises.unlink(`articles/${req.params.id}.json`);  // Use fsPromises here
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete article' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});