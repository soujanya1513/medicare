const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/taskmanager';

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB - Healthcare Database'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Patient Schema
const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        default: '',
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    dueDate: {
        type: Date,
        default: null
    },
    category: {
        type: String,
        default: 'General',
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

const Task = mongoose.model('Patient', taskSchema);

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Routes

// Get all patients
app.get('/api/tasks', async (req, res) => {
    try {
        const tasks = await Task.find().sort({ createdAt: -1 });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch patient records', message: error.message });
    }
});

// Get patient statistics
app.get('/api/tasks/stats/summary', async (req, res) => {
    try {
        const total = await Task.countDocuments();
        const completed = await Task.countDocuments({ completed: true });
        const pending = await Task.countDocuments({ completed: false });
        const overdue = await Task.countDocuments({ 
            dueDate: { $lt: new Date() }, 
            completed: false 
        });
        const high = await Task.countDocuments({ priority: 'high' });
        const medium = await Task.countDocuments({ priority: 'medium' });
        const low = await Task.countDocuments({ priority: 'low' });
        
        res.json({
            total,
            completed,
            pending,
            overdue,
            priority: { high, medium, low }
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch statistics', message: error.message });
    }
});

// Get single patient
app.get('/api/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ error: 'Patient record not found' });
        }
        res.json(task);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch patient record', message: error.message });
    }
});

// Create new patient record
app.post('/api/tasks', async (req, res) => {
    try {
        const { title, description, priority, dueDate, category } = req.body;
        
        if (!title) {
            return res.status(400).json({ error: 'Patient name is required' });
        }
        
        const newTask = new Task({
            title,
            description: description || '',
            priority: priority || 'medium',
            dueDate: dueDate || null,
            category: category || 'General'
        });
        
        await newTask.save();
        res.status(201).json(newTask);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create patient record', message: error.message });
    }
});

// Update patient record
app.put('/api/tasks/:id', async (req, res) => {
    try {
        const { title, description, completed, priority, dueDate, category } = req.body;
        
        const updateData = { updatedAt: Date.now() };
        if (title !== undefined) updateData.title = title;
        if (description !== undefined) updateData.description = description;
        if (completed !== undefined) updateData.completed = completed;
        if (priority !== undefined) updateData.priority = priority;
        if (dueDate !== undefined) updateData.dueDate = dueDate;
        if (category !== undefined) updateData.category = category;
        
        const task = await Task.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );
        
        if (!task) {
            return res.status(404).json({ error: 'Patient record not found' });
        }
        
        res.json(task);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update patient record', message: error.message });
    }
});

// Delete patient record
app.delete('/api/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        
        if (!task) {
            return res.status(404).json({ error: 'Patient record not found' });
        }
        
        res.json({ message: 'Patient record deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete patient record', message: error.message });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
