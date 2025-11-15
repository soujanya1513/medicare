// API Configuration
const API_URL = 'http://localhost:3000/api/tasks';

// Global state
let allTasks = [];
let currentFilter = 'all';
let searchQuery = '';
let currentEditingTaskId = null;

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
const currentDateElement = document.getElementById('currentDate');
const editModal = document.getElementById('editModal');

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    console.log('🏥 Healthcare App Initializing...');
    console.log('Form element:', taskForm);
    console.log('API URL:', API_URL);
    loadTasks();
    loadStats();
    setupEventListeners();
    updateCurrentDate();
    console.log('✅ Healthcare App Initialized');
});

// Update current date display
function updateCurrentDate() {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    currentDateElement.textContent = new Date().toLocaleDateString(undefined, options);
}

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
        showLoading();
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Failed to fetch tasks');
        allTasks = await response.json();
        renderTasks();
        loadStats();
        hideLoading();
    } catch (error) {
        console.error('Error loading patient records:', error);
        showNotification('Failed to load patient records. Make sure the server is running.', 'error');
        hideLoading();
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
    
    console.log('📝 Form submitted');
    
    const title = taskTitle.value.trim();
    const description = taskDescription.value.trim();
    const priority = taskPriority.value;
    const dueDate = taskDueDate.value;
    const category = taskCategory.value.trim();
    
    console.log('Form data:', { title, description, priority, dueDate, category });
    
    if (!title) {
        showNotification('Please enter patient name', 'error');
        taskTitle.focus();
        return;
    }
    
    try {
        showLoading();
        console.log('Sending POST request to:', API_URL);
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, description, priority, dueDate, category })
        });
        
        console.log('Response status:', response.status);
        
        if (!response.ok) throw new Error('Failed to create task');
        
        const newTask = await response.json();
        console.log('New task created:', newTask);
        allTasks.unshift(newTask); // Add to beginning of array
        renderTasks();
        loadStats();
        
        // Reset form with animation
        taskForm.reset();
        taskPriority.value = 'medium';
        taskCategory.value = 'General';
        
        showNotification('Patient appointment scheduled successfully! ✅', 'success');
        hideLoading();
    } catch (error) {
        console.error('Error adding patient record:', error);
        showNotification('Failed to add patient record: ' + error.message, 'error');
        hideLoading();
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
        
        const status = updatedTask.completed ? 'treated' : 'pending';
        showNotification(`Patient marked as ${status}`, 'success');
    } catch (error) {
        console.error('Error updating patient status:', error);
        showNotification('Failed to update patient status', 'error');
    }
}

// Delete patient record
async function deleteTask(taskId) {
    const task = allTasks.find(t => getTaskId(t) === taskId);
    if (!task) return;
    
    // Professional confirmation
    if (!confirm(`⚠️ Are you sure you want to delete patient record for "${task.title}"?\n\nThis action cannot be undone.`)) return;
    
    try {
        showLoading();
        const response = await fetch(`${API_URL}/${taskId}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Failed to delete patient record');
        
        allTasks = allTasks.filter(t => getTaskId(t) !== taskId);
        renderTasks();
        loadStats();
        showNotification('Patient record deleted successfully', 'success');
        hideLoading();
    } catch (error) {
        console.error('Error deleting patient record:', error);
        showNotification('Failed to delete patient record', 'error');
        hideLoading();
    }
}

// Edit patient record - Open modal
function editTask(taskId) {
    const task = allTasks.find(t => getTaskId(t) === taskId);
    if (!task) return;
    
    currentEditingTaskId = taskId;
    
    // Populate modal fields
    document.getElementById('editTitle').value = task.title;
    document.getElementById('editDescription').value = task.description || '';
    document.getElementById('editPriority').value = task.priority || 'medium';
    document.getElementById('editDueDate').value = task.dueDate ? task.dueDate.split('T')[0] : '';
    document.getElementById('editCategory').value = task.category || 'General';
    
    // Show modal
    editModal.classList.add('show');
}

// Close edit modal
function closeEditModal() {
    editModal.classList.remove('show');
    currentEditingTaskId = null;
}

// Save edit from modal
async function saveEdit() {
    if (!currentEditingTaskId) return;
    
    const title = document.getElementById('editTitle').value.trim();
    const description = document.getElementById('editDescription').value.trim();
    const priority = document.getElementById('editPriority').value;
    const dueDate = document.getElementById('editDueDate').value;
    const category = document.getElementById('editCategory').value.trim();
    
    if (!title) {
        showNotification('Patient name is required', 'error');
        return;
    }
    
    const updates = { title, description, priority, dueDate, category };
    
    try {
        showLoading();
        const response = await fetch(`${API_URL}/${currentEditingTaskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updates)
        });
        
        if (!response.ok) throw new Error('Failed to update patient record');
        
        const updatedTask = await response.json();
        const index = allTasks.findIndex(t => getTaskId(t) === currentEditingTaskId);
        allTasks[index] = updatedTask;
        renderTasks();
        
        closeEditModal();
        showNotification('Patient record updated successfully! ✅', 'success');
        hideLoading();
    } catch (error) {
        console.error('Error updating patient record:', error);
        showNotification('Failed to update patient record', 'error');
        hideLoading();
    }
}

// Close modal when clicking outside
editModal.addEventListener('click', (e) => {
    if (e.target === editModal) {
        closeEditModal();
    }
});

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

// Loading indicator
function showLoading() {
    // Simple loading state - could be enhanced with a spinner
    document.body.style.cursor = 'wait';
}

function hideLoading() {
    document.body.style.cursor = 'default';
}

// Professional notification system
function showNotification(message, type = 'info') {
    // Remove existing notification if any
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${getNotificationIcon(type)}</span>
            <span class="notification-message">${message}</span>
        </div>
    `;
    
    // Add styles dynamically
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            top: 24px;
            right: 24px;
            padding: 16px 24px;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            animation: slideInRight 0.3s ease, fadeOut 0.3s ease 2.7s;
            font-weight: 600;
            color: white;
            min-width: 300px;
        }
        
        .notification-success {
            background: linear-gradient(135deg, #4caf50 0%, #2e7d32 100%);
        }
        
        .notification-error {
            background: linear-gradient(135deg, #dc3545 0%, #c62828 100%);
        }
        
        .notification-info {
            background: linear-gradient(135deg, #1565c0 0%, #0d47a1 100%);
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        
        .notification-icon {
            font-size: 1.3rem;
        }
        
        @keyframes slideInRight {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes fadeOut {
            to {
                opacity: 0;
                transform: translateX(400px);
            }
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function getNotificationIcon(type) {
    switch(type) {
        case 'success': return '✅';
        case 'error': return '❌';
        case 'info': return 'ℹ️';
        default: return 'ℹ️';
    }
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
