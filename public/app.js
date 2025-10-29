// API Configuration
const API_URL = 'http://localhost:3000/api/tasks';

// Global state
let allTasks = [];
let currentFilter = 'all';

// DOM Elements
const taskForm = document.getElementById('taskForm');
const taskTitle = document.getElementById('taskTitle');
const taskDescription = document.getElementById('taskDescription');
const tasksList = document.getElementById('tasksList');
const filterButtons = document.querySelectorAll('.filter-btn');

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    taskForm.addEventListener('submit', handleAddTask);
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderTasks();
        });
    });
}

// Load tasks from server
async function loadTasks() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Failed to fetch tasks');
        allTasks = await response.json();
        renderTasks();
    } catch (error) {
        console.error('Error loading tasks:', error);
        showError('Failed to load tasks. Make sure the server is running.');
    }
}

// Add new task
async function handleAddTask(e) {
    e.preventDefault();
    
    const title = taskTitle.value.trim();
    const description = taskDescription.value.trim();
    
    if (!title) return;
    
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, description })
        });
        
        if (!response.ok) throw new Error('Failed to create task');
        
        const newTask = await response.json();
        allTasks.unshift(newTask); // Add to beginning of array
        renderTasks();
        
        // Reset form
        taskTitle.value = '';
        taskDescription.value = '';
    } catch (error) {
        console.error('Error adding task:', error);
        showError('Failed to add task');
    }
}

// Get task ID (works with both MongoDB _id and MySQL id)
function getTaskId(task) {
    return task._id || task.id;
}

// Toggle task completion
async function toggleTask(taskId) {
    const task = allTasks.find(t => getTaskId(t) === taskId);
    if (!task) return;
    
    try {
        const response = await fetch(`${API_URL}/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ completed: !task.completed })
        });
        
        if (!response.ok) throw new Error('Failed to update task');
        
        const updatedTask = await response.json();
        const index = allTasks.findIndex(t => getTaskId(t) === taskId);
        allTasks[index] = updatedTask;
        renderTasks();
    } catch (error) {
        console.error('Error toggling task:', error);
        showError('Failed to update task');
    }
}

// Delete task
async function deleteTask(taskId) {
    if (!confirm('Are you sure you want to delete this task?')) return;
    
    try {
        const response = await fetch(`${API_URL}/${taskId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Failed to delete task');
        
        allTasks = allTasks.filter(t => getTaskId(t) !== taskId);
        renderTasks();
    } catch (error) {
        console.error('Error deleting task:', error);
        showError('Failed to delete task');
    }
}

// Edit task
function editTask(taskId) {
    const task = allTasks.find(t => getTaskId(t) === taskId);
    if (!task) return;
    
    const newTitle = prompt('Edit task title:', task.title);
    if (newTitle === null || newTitle.trim() === '') return;
    
    const newDescription = prompt('Edit task description:', task.description);
    if (newDescription === null) return;
    
    updateTask(taskId, { title: newTitle.trim(), description: newDescription.trim() });
}

// Update task
async function updateTask(taskId, updates) {
    try {
        const response = await fetch(`${API_URL}/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updates)
        });
        
        if (!response.ok) throw new Error('Failed to update task');
        
        const updatedTask = await response.json();
        const index = allTasks.findIndex(t => getTaskId(t) === taskId);
        allTasks[index] = updatedTask;
        renderTasks();
    } catch (error) {
        console.error('Error updating task:', error);
        showError('Failed to update task');
    }
}

// Render tasks
function renderTasks() {
    const filteredTasks = filterTasks(allTasks);
    
    if (filteredTasks.length === 0) {
        tasksList.innerHTML = `
            <div class="empty-state">
                <p>No tasks found. Add a new task to get started! 🚀</p>
            </div>
        `;
        return;
    }
    
    tasksList.innerHTML = filteredTasks.map(task => {
        const taskId = getTaskId(task);
        return `
            <div class="task-item ${task.completed ? 'completed' : ''}">
                <input 
                    type="checkbox" 
                    class="task-checkbox" 
                    ${task.completed ? 'checked' : ''}
                    onchange="toggleTask('${taskId}')"
                >
                <div class="task-content">
                    <div class="task-title">${escapeHtml(task.title)}</div>
                    ${task.description ? `<div class="task-description">${escapeHtml(task.description)}</div>` : ''}
                </div>
                <div class="task-actions">
                    <button class="btn-edit" onclick="editTask('${taskId}')">Edit</button>
                    <button class="btn-delete" onclick="deleteTask('${taskId}')">Delete</button>
                </div>
            </div>
        `;
    }).join('');
}

// Filter tasks
function filterTasks(tasks) {
    switch (currentFilter) {
        case 'active':
            return tasks.filter(t => !t.completed);
        case 'completed':
            return tasks.filter(t => t.completed);
        default:
            return tasks;
    }
}

// Utility: Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Show error message
function showError(message) {
    alert(message);
}
