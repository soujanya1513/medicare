# 🔄 Quick Database Switch Guide

## 🚀 TL;DR - Quick Start

### Option 1: MongoDB (Cloud - No Installation!) ☁️
**EASIEST - Recommended for beginners!**

```powershell
# 1. Install MongoDB driver
npm install mongoose

# 2. Get free MongoDB Atlas account
# Visit: https://www.mongodb.com/cloud/atlas
# Create cluster → Get connection string

# 3. Update server-mongodb.js line 10 with your connection string
# 4. Run the server
node server-mongodb.js
```

### Option 2: MongoDB (Local)
```powershell
# 1. Download & Install MongoDB from mongodb.com
# 2. Install driver
npm install mongoose

# 3. Run server
node server-mongodb.js
```

### Option 3: MySQL
```powershell
# 1. Download & Install MySQL from mysql.com
# 2. Install driver
npm install mysql2

# 3. Update credentials in server-mysql.js
# 4. Run server
node server-mysql.js
```

---

## 📁 Your Project Now Has:

- `server.js` - Original (in-memory storage)
- `server-mongodb.js` - MongoDB version
- `server-mysql.js` - MySQL version
- `public/app.js` - Updated frontend (works with ALL versions!)

---

## 🎯 How to Choose & Run

### Run with In-Memory (Original)
```powershell
node server.js
```
✅ No setup needed
❌ Data lost on restart

### Run with MongoDB
```powershell
node server-mongodb.js
```
✅ Easy setup
✅ Free cloud option
✅ Data persists
✅ No SQL knowledge needed

### Run with MySQL
```powershell
node server-mysql.js
```
✅ Industry standard
✅ Structured data
✅ Data persists
⚠️ Requires SQL knowledge

---

## 🔧 My Recommendation

**For Learning/Prototyping:**
→ Use **MongoDB Atlas** (cloud, free, zero setup)

**For Portfolio/Real Projects:**
→ Use **MongoDB** (easier) or **MySQL** (more professional)

**For Quick Testing:**
→ Keep using `server.js` (in-memory)

---

## 📖 Full Setup Instructions

See `DATABASE_SETUP.md` for detailed step-by-step guides!

---

## ✅ Data Persistence Test

1. Run server with database
2. Add some tasks
3. Stop server (Ctrl+C)
4. Start server again
5. Check if tasks are still there!

If yes → Database working! 🎉
If no → Check database connection

---

## 💡 Pro Tips

1. **Start Simple**: Use in-memory first, add database later
2. **MongoDB Atlas**: Easiest way to get started (5 minutes)
3. **Environment Variables**: Use `.env` for sensitive data
4. **Version Control**: Don't commit database credentials!

---

Need help? Check DATABASE_SETUP.md for troubleshooting! 🚀
