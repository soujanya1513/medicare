const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');

const app = express();
const PORT = 3000;

// MySQL Connection Pool
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'taskmanager',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Initialize Database
async function initializeDatabase() {
    try {
        const connection = await pool.getConnection();
        
        // Create database if not exists
        await connection.query(`CREATE DATABASE IF NOT EXISTS taskmanager`);
        await connection.query(`USE taskmanager`);
        
        // Create tasks table
        await connection.query(`
            CREATE TABLE IF NOT EXISTS tasks (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                completed BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
        
        connection.release();
        console.log('✅ Connected to MySQL and database initialized');
    } catch (error) {
        console.error('❌ MySQL connection error:', error);
        process.exit(1);
    }
}

initializeDatabase();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Routes

// Get all tasks
app.get('/api/tasks', async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM tasks ORDER BY created_at DESC'
        );
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch tasks', message: error.message });
    }
});

// Get single task
app.get('/api/tasks/:id', async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM tasks WHERE id = ?',
            [req.params.id]
        );
        
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }
        
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch task', message: error.message });
    }
});

// Create new task
app.post('/api/tasks', async (req, res) => {
    try {
        const { title, description } = req.body;
        
        if (!title) {
            return res.status(400).json({ error: 'Title is required' });
        }
        
        const [result] = await pool.query(
            'INSERT INTO tasks (title, description) VALUES (?, ?)',
            [title, description || '']
        );
        
        const [newTask] = await pool.query(
            'SELECT * FROM tasks WHERE id = ?',
            [result.insertId]
        );
        
        res.status(201).json(newTask[0]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create task', message: error.message });
    }
});

// Update task
app.put('/api/tasks/:id', async (req, res) => {
    try {
        const { title, description, completed } = req.body;
        
        // First check if task exists
        const [existing] = await pool.query(
            'SELECT * FROM tasks WHERE id = ?',
            [req.params.id]
        );
        
        if (existing.length === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }
        
        // Build update query dynamically
        const updates = [];
        const values = [];
        
        if (title !== undefined) {
            updates.push('title = ?');
            values.push(title);
        }
        if (description !== undefined) {
            updates.push('description = ?');
            values.push(description);
        }
        if (completed !== undefined) {
            updates.push('completed = ?');
            values.push(completed);
        }
        
        if (updates.length === 0) {
            return res.json(existing[0]);
        }
        
        values.push(req.params.id);
        
        await pool.query(
            `UPDATE tasks SET ${updates.join(', ')} WHERE id = ?`,
            values
        );
        
        const [updatedTask] = await pool.query(
            'SELECT * FROM tasks WHERE id = ?',
            [req.params.id]
        );
        
        res.json(updatedTask[0]);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update task', message: error.message });
    }
});

// Delete task
app.delete('/api/tasks/:id', async (req, res) => {
    try {
        const [result] = await pool.query(
            'DELETE FROM tasks WHERE id = ?',
            [req.params.id]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Task not found' });
        }
        
        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete task', message: error.message });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
