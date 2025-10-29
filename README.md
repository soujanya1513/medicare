# 📝 Task Manager Web App

A simple and elegant task management application built with Node.js, Express, and vanilla JavaScript.

## 🚀 Features

- ✅ Create, read, update, and delete tasks
- ✅ Mark tasks as complete/incomplete
- ✅ Filter tasks (All, Active, Completed)
- ✅ Responsive design for mobile and desktop
- ✅ RESTful API backend
- ✅ Clean and modern UI

## 🛠️ Technologies Used

**Backend:**
- Node.js
- Express.js
- CORS
- Body-parser

**Frontend:**
- HTML5
- CSS3
- Vanilla JavaScript
- Fetch API

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (version 14 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Git](https://git-scm.com/)

## 🔧 Installation & Setup

### 1. Clone or Download the Project

If you have this project on GitHub, clone it:
```bash
git clone https://github.com/yourusername/task-manager-app.git
cd task-manager-app
```

### 2. Install Dependencies

Open a terminal in the project directory and run:
```bash
npm install
```

This will install:
- express
- cors
- body-parser
- nodemon (for development)

### 3. Start the Server

Run the following command:
```bash
npm start
```

For development with auto-restart:
```bash
npm run dev
```

You should see:
```
Server is running on http://localhost:3000
```

### 4. Open the Application

Open your web browser and navigate to:
```
http://localhost:3000
```

## 🔌 How Frontend Connects to Backend

### Backend (server.js)
The backend runs on `http://localhost:3000` and provides these API endpoints:

- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get a specific task
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

### Frontend (public/app.js)
The frontend connects to the backend using the Fetch API:

```javascript
const API_URL = 'http://localhost:3000/api/tasks';

// Example: Fetching tasks
const response = await fetch(API_URL);
const tasks = await response.json();

// Example: Creating a task
await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, description })
});
```

**Key Points:**
- CORS is enabled on the backend to allow browser requests
- Express serves static files from the `public` folder
- The frontend makes async HTTP requests to the API
- Data is exchanged in JSON format

## 📁 Project Structure

```
task-manager-app/
├── public/
│   ├── index.html      # Main HTML file
│   ├── styles.css      # CSS styling
│   └── app.js          # Frontend JavaScript
├── server.js           # Backend Express server
├── package.json        # Dependencies and scripts
├── .gitignore         # Git ignore file
└── README.md          # This file
```

## 📤 How to Upload to GitHub

### Step 1: Create a GitHub Repository

1. Go to [GitHub](https://github.com)
2. Click the "+" icon → "New repository"
3. Name it: `task-manager-app`
4. Choose "Public" or "Private"
5. **Do NOT** initialize with README (we already have one)
6. Click "Create repository"

### Step 2: Initialize Git (if not already done)

Open terminal in your project folder:

```bash
git init
```

### Step 3: Add Files to Git

```bash
git add .
```

### Step 4: Commit Your Changes

```bash
git commit -m "Initial commit: Task Manager App"
```

### Step 5: Connect to GitHub

Replace `yourusername` with your GitHub username:

```bash
git remote add origin https://github.com/yourusername/task-manager-app.git
```

### Step 6: Push to GitHub

```bash
git branch -M main
git push -u origin main
```

### Step 7: Verify

- Go to your GitHub repository
- Refresh the page
- You should see all your files!

## 🔄 Making Updates

After making changes:

```bash
git add .
git commit -m "Description of changes"
git push
```

## 🎯 API Testing

You can test the API using:

### Using PowerShell:

```powershell
# Get all tasks
Invoke-RestMethod -Uri http://localhost:3000/api/tasks -Method Get

# Create a task
$body = @{
    title = "Test Task"
    description = "Testing API"
} | ConvertTo-Json

Invoke-RestMethod -Uri http://localhost:3000/api/tasks -Method Post -Body $body -ContentType "application/json"
```

### Using a Browser:
- Navigate to `http://localhost:3000/api/tasks` to see all tasks in JSON format

## 🐛 Troubleshooting

**Port 3000 already in use:**
- Change the PORT in `server.js` to another number (e.g., 3001)
- Update API_URL in `public/app.js` accordingly

**Cannot connect to server:**
- Ensure the server is running (`npm start`)
- Check if you're using the correct URL
- Verify no firewall is blocking the connection

**Tasks not loading:**
- Open browser console (F12) to see errors
- Ensure CORS is enabled in server.js
- Check if the server is running

## 📝 License

MIT License - Feel free to use this project for learning and development!

## 👨‍💻 Author

Created with ❤️ by [Your Name]

---

**Happy Coding! 🚀**
