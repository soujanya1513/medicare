// API Configuration
const API_URL = 'http://localhost:3000/api/tasks';

// Global state
let allTasks = [];
let currentFilter = 'all';
let searchQuery = '';

// DOM Elements
const taskForm = document.getElementById('taskForm');
const taskTitle = document.getElementById('taskTitle');
const taskDescription = document.getElementById('taskDescription');
const taskPriority = document.getElementById('taskPriority');
const taskDueDate = document.getElementById('taskDueDate');
const taskCategory = document.getElementById('taskCategory');
const tasksList = document.getElementById('tasksList');
const filterButtons = document.querySelectorAll('.filter-btn');
const searchInput = document.getElementById('searchInput');

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    loadStats();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    taskForm.addEventListener('submit', handleAddTask);
    
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase();
        renderTasks();
    });
    
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
        loadStats();
    } catch (error) {
        console.error('Error loading patient records:', error);
        showError('Failed to load patient records. Make sure the server is running.');
    }
}

// Load statistics
async function loadStats() {
    try {
        const response = await fetch(`http://localhost:3000/api/tasks/stats/summary`);
        if (!response.ok) throw new Error('Failed to fetch stats');
        const stats = await response.json();
        
        document.getElementById('totalTasks').textContent = stats.total;
        document.getElementById('completedTasks').textContent = stats.completed;
        document.getElementById('pendingTasks').textContent = stats.pending;
        document.getElementById('overdueTasks').textContent = stats.overdue;
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

// Add new task
async function handleAddTask(e) {
    e.preventDefault();
    
    const title = taskTitle.value.trim();
    const description = taskDescription.value.trim();
    const priority = taskPriority.value;
    const dueDate = taskDueDate.value;
    const category = taskCategory.value.trim();
    
    if (!title) return;
    
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, description, priority, dueDate, category })
        });
        
        if (!response.ok) throw new Error('Failed to create task');
        
        const newTask = await response.json();
        allTasks.unshift(newTask); // Add to beginning of array
        renderTasks();
        loadStats();
        
        // Reset form
        taskTitle.value = '';
        taskDescription.value = '';
        taskPriority.value = 'medium';
        taskDueDate.value = '';
        taskCategory.value = 'General';
    } catch (error) {
        console.error('Error adding patient record:', error);
        showError('Failed to add patient record');
    }
}

// Get task ID (works with both MongoDB _id and MySQL id)
function getTaskId(task) {
    return task._id || task.id;
}

// Toggle patient treatment status
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
        
        if (!response.ok) throw new Error('Failed to update patient status');
        
        const updatedTask = await response.json();
        const index = allTasks.findIndex(t => getTaskId(t) === taskId);
        allTasks[index] = updatedTask;
        renderTasks();
        loadStats();
    } catch (error) {
        console.error('Error updating patient status:', error);
        showError('Failed to update patient status');
    }
}

// Delete patient record
async function deleteTask(taskId) {
    if (!confirm('Are you sure you want to delete this patient record?')) return;
    
    try {
        const response = await fetch(`${API_URL}/${taskId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Failed to delete patient record');
        
        allTasks = allTasks.filter(t => getTaskId(t) !== taskId);
        renderTasks();
        loadStats();
    } catch (error) {
        console.error('Error deleting patient record:', error);
        showError('Failed to delete patient record');
    }
}

// Edit patient record
function editTask(taskId) {
    const task = allTasks.find(t => getTaskId(t) === taskId);
    if (!task) return;
    
    const newTitle = prompt('Edit patient name:', task.title);
    if (newTitle === null || newTitle.trim() === '') return;
    
    const newDescription = prompt('Edit medical notes:', task.description);
    if (newDescription === null) return;
    
    updateTask(taskId, { title: newTitle.trim(), description: newDescription.trim() });
}

// Update patient record
async function updateTask(taskId, updates) {
    try {
        const response = await fetch(`${API_URL}/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updates)
        });
        
        if (!response.ok) throw new Error('Failed to update patient record');
        
        const updatedTask = await response.json();
        const index = allTasks.findIndex(t => getTaskId(t) === taskId);
        allTasks[index] = updatedTask;
        renderTasks();
    } catch (error) {
        console.error('Error updating patient record:', error);
        showError('Failed to update patient record');
    }
}

// Render tasks
function renderTasks() {
    const filteredTasks = filterTasks(allTasks);
    
    if (filteredTasks.length === 0) {
        tasksList.innerHTML = `
            <div class="empty-state">
                <p>No patient records found. Add a new appointment to get started! 🏥</p>
            </div>
        `;
        return;
    }
    
    tasksList.innerHTML = filteredTasks.map(task => {
        const taskId = getTaskId(task);
        const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;
        const priorityClass = `priority-${task.priority || 'medium'}`;
        const overdueClass = isOverdue ? 'overdue' : '';
        
        return `
            <div class="task-item ${task.completed ? 'completed' : ''} ${priorityClass} ${overdueClass}">
                <input 
                    type="checkbox" 
                    class="task-checkbox" 
                    ${task.completed ? 'checked' : ''}
                    onchange="toggleTask('${taskId}')"
                >
                <div class="task-content">
                    <div class="task-title">${escapeHtml(task.title)}</div>
                    ${task.description ? `<div class="task-description">${escapeHtml(task.description)}</div>` : ''}
                    <div class="task-meta">
                        <span class="task-badge priority-badge ${priorityClass}">
                            ${getPriorityIcon(task.priority)} ${capitalize(task.priority || 'medium')}
                        </span>
                        ${task.dueDate ? `
                            <span class="task-badge due-date-badge ${isOverdue ? 'overdue' : ''}">
                                📅 ${formatDate(task.dueDate)}
                            </span>
                        ` : ''}
                        ${task.category && task.category !== 'general' ? `
                            <span class="task-badge category-badge">
                                🏷️ ${escapeHtml(task.category)}
                            </span>
                        ` : ''}
                    </div>
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
    let filtered = tasks;
    
    // Apply filter
    switch (currentFilter) {
        case 'active':
            filtered = filtered.filter(t => !t.completed);
            break;
        case 'completed':
            filtered = filtered.filter(t => t.completed);
            break;
        case 'high':
            filtered = filtered.filter(t => t.priority === 'high');
            break;
        case 'overdue':
            filtered = filtered.filter(t => {
                return t.dueDate && new Date(t.dueDate) < new Date() && !t.completed;
            });
            break;
    }
    
    // Apply search
    if (searchQuery) {
        filtered = filtered.filter(t => {
            return t.title.toLowerCase().includes(searchQuery) ||
                   (t.description && t.description.toLowerCase().includes(searchQuery)) ||
                   (t.category && t.category.toLowerCase().includes(searchQuery));
        });
    }
    
    return filtered;
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

// Helper: Get priority icon
function getPriorityIcon(priority) {
    switch(priority) {
        case 'high': return '🔴';
        case 'medium': return '🟡';
        case 'low': return '🟢';
        default: return '🟡';
    }
}

// Helper: Capitalize string
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Helper: Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Reset time part for comparison
    today.setHours(0, 0, 0, 0);
    tomorrow.setHours(0, 0, 0, 0);
    const compareDate = new Date(date);
    compareDate.setHours(0, 0, 0, 0);
    
    if (compareDate.getTime() === today.getTime()) {
        return 'Today';
    } else if (compareDate.getTime() === tomorrow.getTime()) {
        return 'Tomorrow';
    } else if (compareDate < today) {
        const options = { month: 'short', day: 'numeric' };
        return date.toLocaleDateString(undefined, options);
    } else {
        const options = { month: 'short', day: 'numeric' };
        return date.toLocaleDateString(undefined, options);
    }
}
