# 🗄️ Database Setup Guide - Task Manager App

This guide will help you set up either **MongoDB** or **MySQL** for your Task Manager App.

---

## 📊 Choose Your Database

### Option 1: MongoDB (Recommended for Beginners) ✅
- NoSQL database
- Easier to set up
- No complex queries needed
- Cloud option available (MongoDB Atlas - Free)

### Option 2: MySQL 🔷
- Traditional SQL database
- More structured
- Widely used in enterprises
- Requires local installation

---

## 🟢 MongoDB Setup

### Method A: Local MongoDB Installation

#### Step 1: Install MongoDB

**Windows:**
1. Download MongoDB Community Server from: https://www.mongodb.com/try/download/community
2. Run the installer
3. Choose "Complete" installation
4. Install as a Windows Service
5. Default port: 27017

**Verify Installation:**
```powershell
mongod --version
```

#### Step 2: Install MongoDB Node.js Driver

```powershell
cd c:\Users\HP\Desktop\cc
npm install mongoose
```

#### Step 3: Use MongoDB Server

Rename `server-mongodb.js` to `server.js` or run it directly:

```powershell
# Option 1: Rename and use
mv server.js server-original.js
mv server-mongodb.js server.js
node server.js

# Option 2: Run directly
node server-mongodb.js
```

#### Step 4: Verify Connection

You should see:
```
✅ Connected to MongoDB
🚀 Server is running on http://localhost:3000
```

---

### Method B: MongoDB Atlas (Cloud - FREE) ☁️

**Recommended if you don't want to install locally!**

#### Step 1: Create Account
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for free
3. Create a FREE cluster (M0)

#### Step 2: Set Up Database
1. Click "Create Database"
2. Database name: `taskmanager`
3. Collection name: `tasks`

#### Step 3: Get Connection String
1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string (looks like):
   ```
   mongodb+srv://username:<password>@cluster0.xxxxx.mongodb.net/
   ```

#### Step 4: Update server-mongodb.js

Replace line 10 with your connection string:
```javascript
const MONGODB_URI = 'mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/taskmanager';
```

#### Step 5: Install and Run
```powershell
npm install mongoose
node server-mongodb.js
```

---

## 🔷 MySQL Setup

### Step 1: Install MySQL

**Windows:**
1. Download MySQL Installer: https://dev.mysql.com/downloads/installer/
2. Run installer → Choose "Developer Default"
3. Set root password (remember this!)
4. Default port: 3306

**Verify Installation:**
```powershell
mysql --version
```

### Step 2: Create Database

Open MySQL Command Line Client (or MySQL Workbench):

```sql
CREATE DATABASE taskmanager;
USE taskmanager;
```

The table will be created automatically by the app!

### Step 3: Install MySQL Driver

```powershell
cd c:\Users\HP\Desktop\cc
npm install mysql2
```

### Step 4: Configure Connection

Edit `server-mysql.js` (lines 8-11) with your MySQL credentials:

```javascript
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',           // Your MySQL username
    password: 'your_password',  // Your MySQL password
    database: 'taskmanager',
    // ... rest of config
});
```

### Step 5: Use MySQL Server

```powershell
# Option 1: Rename and use
mv server.js server-original.js
mv server-mysql.js server.js
node server.js

# Option 2: Run directly
node server-mysql.js
```

### Step 6: Verify Connection

You should see:
```
✅ Connected to MySQL and database initialized
🚀 Server is running on http://localhost:3000
```

---

## 🔄 Switching Between Databases

### Update package.json Scripts

Add these to your `package.json` under `"scripts"`:

```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js",
  "mongodb": "node server-mongodb.js",
  "mysql": "node server-mysql.js"
}
```

### Run with Specific Database

```powershell
# Use MongoDB
npm run mongodb

# Use MySQL
npm run mysql
```

---

## 🔧 Environment Variables (Optional - Recommended)

Create a `.env` file in your project root:

**For MongoDB:**
```env
MONGODB_URI=mongodb://localhost:27017/taskmanager
PORT=3000
```

**For MySQL:**
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=taskmanager
PORT=3000
```

Install dotenv:
```powershell
npm install dotenv
```

Add to top of server file:
```javascript
require('dotenv').config();
```

---

## 📊 Database Comparison

| Feature | MongoDB | MySQL |
|---------|---------|-------|
| Setup Difficulty | ⭐⭐ Easy | ⭐⭐⭐ Moderate |
| Cloud Option | ✅ Free (Atlas) | ❌ Paid only |
| Learning Curve | ⭐⭐ Low | ⭐⭐⭐ Medium |
| Data Structure | Flexible (JSON) | Fixed (Tables) |
| Best For | Rapid development | Complex queries |

---

## 🐛 Troubleshooting

### MongoDB Issues

**"MongooseServerSelectionError":**
- Ensure MongoDB service is running
- Check connection string
- For Atlas: Check network access (add your IP)

**Check if MongoDB is running:**
```powershell
# Windows
Get-Service MongoDB
```

**Start MongoDB:**
```powershell
net start MongoDB
```

### MySQL Issues

**"ECONNREFUSED":**
- Ensure MySQL service is running
- Check username/password
- Verify port 3306 is not blocked

**Check if MySQL is running:**
```powershell
# Windows
Get-Service MySQL*
```

**Start MySQL:**
```powershell
net start MySQL80
```

**"ER_ACCESS_DENIED_ERROR":**
- Double-check username and password
- Ensure user has proper privileges

---

## 🎯 Testing Your Database

### Test MongoDB

```powershell
# Using Postman or PowerShell
Invoke-RestMethod -Uri http://localhost:3000/api/tasks -Method Get
```

### Test MySQL

Same command - the API endpoints remain the same!

### View Data Directly

**MongoDB:**
```javascript
// MongoDB Compass (GUI) - Download from mongodb.com
// Or MongoDB Shell:
mongosh
use taskmanager
db.tasks.find()
```

**MySQL:**
```sql
-- MySQL Workbench (GUI) or Command Line:
mysql -u root -p
USE taskmanager;
SELECT * FROM tasks;
```

---

## 📦 Updated Dependencies

Your `package.json` should include:

**For MongoDB:**
```json
"dependencies": {
  "express": "^4.18.2",
  "cors": "^2.8.5",
  "body-parser": "^1.20.2",
  "mongoose": "^7.0.0"
}
```

**For MySQL:**
```json
"dependencies": {
  "express": "^4.18.2",
  "cors": "^2.8.5",
  "body-parser": "^1.20.2",
  "mysql2": "^3.0.0"
}
```

**For Both:**
```json
"dependencies": {
  "express": "^4.18.2",
  "cors": "^2.8.5",
  "body-parser": "^1.20.2",
  "mongoose": "^7.0.0",
  "mysql2": "^3.0.0"
}
```

---

## 🚀 Quick Start Commands

### MongoDB (Local)
```powershell
npm install mongoose
node server-mongodb.js
```

### MongoDB (Atlas Cloud)
```powershell
npm install mongoose
# Update connection string in server-mongodb.js
node server-mongodb.js
```

### MySQL
```powershell
npm install mysql2
# Update credentials in server-mysql.js
node server-mysql.js
```

---

## ✅ Which Should You Choose?

**Choose MongoDB if:**
- ✅ You want quick setup
- ✅ You prefer cloud hosting (free)
- ✅ You're building a prototype/learning
- ✅ Your data structure might change

**Choose MySQL if:**
- ✅ You need structured data
- ✅ You're familiar with SQL
- ✅ You need complex relationships
- ✅ You're preparing for enterprise apps

---

## 📝 Next Steps

1. Choose your database
2. Follow the setup guide above
3. Install required packages
4. Update configuration
5. Run the server
6. Test the app!

Need help? Check the troubleshooting section or ask! 🤝
