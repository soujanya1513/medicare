// Check authentication
const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user') || '{}');

if (!token) {
    window.location.href = 'login.html';
}

const API_URL = 'http://localhost:3000/api';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    updateCurrentDate();
    loadDashboard();
    setupNavigation();
    setMinDate();
});

function updateCurrentDate() {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('currentDate').textContent = new Date().toLocaleDateString(undefined, options);
}

function setMinDate() {
    const today = new Date().toISOString().split('T')[0];
    const dateInput = document.getElementById('appointmentDate');
    if (dateInput) {
        dateInput.min = today;
    }
}

async function loadDashboard() {
    document.getElementById('welcomeMessage').textContent = `Welcome back, ${user.fullName || 'Patient'}!`;
    document.getElementById('userAvatar').textContent = (user.fullName || 'P').charAt(0).toUpperCase();

    await Promise.all([
        loadStats(),
        loadRecentAppointments(),
        loadAllAppointments(),
        loadMedicalRecords(),
        loadProfile()
    ]);
}

// Navigation
function setupNavigation() {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.dataset.section;
            showSection(section);
            
            document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
}

function showSection(section) {
    document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
    document.getElementById(`${section}-section`).classList.add('active');

    const titles = {
        'overview': 'Dashboard Overview',
        'appointments': 'My Appointments',
        'medical-records': 'Medical Records',
        'profile': 'My Profile'
    };
    document.getElementById('sectionTitle').textContent = titles[section] || 'Dashboard';

    // Update active nav
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.section === section) {
            link.classList.add('active');
        }
    });
}

// Load Stats
async function loadStats() {
    try {
        const response = await fetch(`${API_URL}/dashboard/stats`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const stats = await response.json();
            document.getElementById('totalAppointments').textContent = stats.totalAppointments;
            document.getElementById('upcomingAppointments').textContent = stats.upcomingAppointments;
            document.getElementById('completedAppointments').textContent = stats.completedAppointments;
            document.getElementById('medicalRecords').textContent = stats.medicalRecords;
        }
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

// Load Recent Appointments
async function loadRecentAppointments() {
    try {
        const response = await fetch(`${API_URL}/appointments`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const appointments = await response.json();
            const recent = appointments.slice(0, 3);
            const container = document.getElementById('recentAppointmentsList');

            if (recent.length === 0) {
                container.innerHTML = '<p class="empty-state">No recent appointments</p>';
                return;
            }

            container.innerHTML = recent.map(apt => `
                <div class="appointment-card ${apt.status}">
                    <div class="appointment-header">
                        <h4>Dr. ${apt.doctorName}</h4>
                        <span class="status-badge status-${apt.status}">${apt.status}</span>
                    </div>
                    <div class="appointment-details">
                        <p><strong>Department:</strong> ${apt.department}</p>
                        <p><strong>Date:</strong> ${formatDate(apt.appointmentDate)} at ${apt.appointmentTime}</p>
                        <p><strong>Symptoms:</strong> ${apt.symptoms}</p>
                    </div>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading recent appointments:', error);
    }
}

// Load All Appointments
async function loadAllAppointments() {
    try {
        const response = await fetch(`${API_URL}/appointments`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const appointments = await response.json();
            const container = document.getElementById('appointmentsList');

            if (appointments.length === 0) {
                container.innerHTML = '<p class="empty-state">No appointments found. Book your first appointment!</p>';
                return;
            }

            container.innerHTML = appointments.map(apt => `
                <div class="appointment-card ${apt.status}">
                    <div class="appointment-header">
                        <div>
                            <h4>Dr. ${apt.doctorName}</h4>
                            <p class="department">${apt.department}</p>
                        </div>
                        <span class="status-badge status-${apt.status}">${apt.status}</span>
                    </div>
                    <div class="appointment-details">
                        <div class="detail-row">
                            <span>📅</span>
                            <span>${formatDate(apt.appointmentDate)} at ${apt.appointmentTime}</span>
                        </div>
                        <div class="detail-row">
                            <span>🏥</span>
                            <span>${apt.symptoms}</span>
                        </div>
                        <div class="detail-row">
                            <span>🚨</span>
                            <span class="priority-${apt.priority}">${capitalize(apt.priority)} Priority</span>
                        </div>
                    </div>
                    ${apt.status === 'scheduled' ? `
                        <div class="appointment-actions">
                            <button class="btn-small btn-danger" onclick="cancelAppointment('${apt._id}')">Cancel</button>
                        </div>
                    ` : ''}
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading appointments:', error);
    }
}

// Load Medical Records
async function loadMedicalRecords() {
    try {
        const response = await fetch(`${API_URL}/medical-records`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const records = await response.json();
            const container = document.getElementById('medicalRecordsList');

            if (records.length === 0) {
                container.innerHTML = '<p class="empty-state">No medical records found</p>';
                return;
            }

            container.innerHTML = records.map(record => `
                <div class="record-card">
                    <div class="record-header">
                        <div>
                            <h4>${record.title}</h4>
                            <p class="record-type">${formatRecordType(record.recordType)}</p>
                        </div>
                        <span class="record-date">${formatDate(record.date)}</span>
                    </div>
                    <div class="record-details">
                        ${record.description ? `<p>${record.description}</p>` : ''}
                        ${record.doctorName ? `<p><strong>Doctor:</strong> ${record.doctorName}</p>` : ''}
                        ${record.result ? `<p><strong>Result:</strong> ${record.result}</p>` : ''}
                    </div>
                </div>
            `).join('');
        }
    } catch (error) {
        console.error('Error loading medical records:', error);
    }
}

// Load Profile
async function loadProfile() {
    try {
        const response = await fetch(`${API_URL}/auth/profile`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const profile = await response.json();
            const container = document.getElementById('profileInfo');

            container.innerHTML = `
                <div class="profile-grid">
                    <div class="profile-item">
                        <label>Full Name</label>
                        <p>${profile.fullName}</p>
                    </div>
                    <div class="profile-item">
                        <label>Email</label>
                        <p>${profile.email}</p>
                    </div>
                    <div class="profile-item">
                        <label>Phone</label>
                        <p>${profile.phone}</p>
                    </div>
                    <div class="profile-item">
                        <label>Date of Birth</label>
                        <p>${formatDate(profile.dateOfBirth)}</p>
                    </div>
                    <div class="profile-item">
                        <label>Gender</label>
                        <p>${capitalize(profile.gender)}</p>
                    </div>
                    <div class="profile-item">
                        <label>Blood Group</label>
                        <p>${profile.bloodGroup}</p>
                    </div>
                    ${profile.address ? `
                        <div class="profile-item full-width">
                            <label>Address</label>
                            <p>${profile.address}</p>
                        </div>
                    ` : ''}
                    ${profile.emergencyContact && profile.emergencyContact.name ? `
                        <div class="profile-item full-width">
                            <label>Emergency Contact</label>
                            <p>${profile.emergencyContact.name} - ${profile.emergencyContact.phone} (${profile.emergencyContact.relation})</p>
                        </div>
                    ` : ''}
                </div>
            `;
        }
    } catch (error) {
        console.error('Error loading profile:', error);
    }
}

// Appointment Modal
function openAppointmentModal() {
    document.getElementById('appointmentModal').classList.add('show');
}

function closeAppointmentModal() {
    document.getElementById('appointmentModal').classList.remove('show');
    document.getElementById('appointmentForm').reset();
}

// Book Appointment
document.getElementById('appointmentForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const appointmentData = {
        patientName: user.fullName,
        doctorName: document.getElementById('doctorName').value,
        department: document.getElementById('department').value,
        appointmentDate: document.getElementById('appointmentDate').value,
        appointmentTime: document.getElementById('appointmentTime').value,
        symptoms: document.getElementById('symptoms').value,
        priority: document.getElementById('priority').value
    };

    try {
        const response = await fetch(`${API_URL}/appointments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(appointmentData)
        });

        if (response.ok) {
            showNotification('Appointment booked successfully!', 'success');
            closeAppointmentModal();
            await loadDashboard();
        } else {
            const error = await response.json();
            showNotification(error.message || 'Failed to book appointment', 'error');
        }
    } catch (error) {
        console.error('Error booking appointment:', error);
        showNotification('Connection error. Please try again.', 'error');
    }
});

// Cancel Appointment
async function cancelAppointment(id) {
    if (!confirm('Are you sure you want to cancel this appointment?')) return;

    try {
        const response = await fetch(`${API_URL}/appointments/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            showNotification('Appointment cancelled', 'success');
            await loadDashboard();
        } else {
            showNotification('Failed to cancel appointment', 'error');
        }
    } catch (error) {
        console.error('Error cancelling appointment:', error);
        showNotification('Connection error', 'error');
    }
}

// Utility Functions
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatRecordType(type) {
    return type.split('-').map(word => capitalize(word)).join(' ');
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.remove(), 3000);
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = 'login.html';
    }
}

function openRecordModal() {
    showNotification('Medical record upload feature coming soon!', 'info');
}

// Close modal on outside click
document.getElementById('appointmentModal').addEventListener('click', (e) => {
    if (e.target.id === 'appointmentModal') {
        closeAppointmentModal();
    }
});
