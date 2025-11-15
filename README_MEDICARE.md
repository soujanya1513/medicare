# 🏥 MediCare - Professional Patient Portal

A comprehensive healthcare patient portal web application with secure authentication, appointment management, and medical records tracking.

## ✨ Features

### Patient Features
- **Secure Authentication** - Register and login with JWT-based authentication
- **Appointment Booking** - Schedule appointments with doctors across different departments
- **Medical Records** - View and track your medical history, lab tests, prescriptions
- **Dashboard Overview** - See all your health information at a glance
- **Profile Management** - Update personal information, emergency contacts
- **Appointment History** - Track past, present, and upcoming appointments

### Security & Privacy
- 🔒 Password encryption with bcrypt
- 🔐 JWT token-based authentication
- ✅ HIPAA-compliant data handling
- 🛡️ Secure session management

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/soujanya1513/task-manager-app.git
cd task-manager-app
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
   - Copy `.env.example` to `.env`
   - Update with your MongoDB connection string

4. **Start MongoDB** (if using local MongoDB)
```powershell
# Windows
Start-Process -FilePath "D:\Program Files\MongoDB\Server\8.2\bin\mongod.exe" -ArgumentList "--dbpath `"C:\data\db`""
```

5. **Start the server**
```bash
npm start
```

6. **Open your browser**
   - Navigate to `http://localhost:3000/login.html`
   - Register a new account or login

## 📱 Application Structure

```
medicare-patient-portal/
├── public/
│   ├── login.html           # Login page
│   ├── register.html        # Registration page
│   ├── dashboard.html       # Patient dashboard
│   ├── dashboard.js         # Dashboard functionality
│   ├── dashboard-styles.css # Dashboard styles
│   ├── auth-styles.css      # Authentication pages styles
│   └── ...
├── server-auth.js           # Main server with authentication
├── package.json
├── .env                     # Environment variables (not in git)
└── README.md
```

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new patient
- `POST /api/auth/login` - Patient login
- `GET /api/auth/profile` - Get user profile (protected)
- `PUT /api/auth/profile` - Update profile (protected)

### Appointments
- `POST /api/appointments` - Book appointment (protected)
- `GET /api/appointments` - Get all user appointments (protected)
- `GET /api/appointments/:id` - Get single appointment (protected)
- `PUT /api/appointments/:id` - Update appointment (protected)
- `DELETE /api/appointments/:id` - Cancel appointment (protected)

### Medical Records
- `POST /api/medical-records` - Add medical record (protected)
- `GET /api/medical-records` - Get all records (protected)

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics (protected)

## 💡 Usage Guide

### For Patients

1. **Register Account**
   - Go to registration page
   - Fill in personal details (name, email, phone, DOB, gender, blood group)
   - Create secure password
   - Submit to create account

2. **Login**
   - Enter email and password
   - Click "Sign In"
   - Redirected to dashboard

3. **Book Appointment**
   - Click "Book New Appointment" button
   - Select doctor, department, date, and time
   - Enter symptoms/reason for visit
   - Choose priority level
   - Submit booking

4. **View Appointments**
   - Navigate to "Appointments" section
   - See all scheduled, completed, and cancelled appointments
   - Cancel appointments if needed

5. **View Medical Records**
   - Navigate to "Medical Records" section
   - View lab tests, prescriptions, diagnoses
   - Track medical history

6. **Update Profile**
   - Navigate to "My Profile" section
   - View personal information
   - Update details as needed

## 🏗️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing

### Frontend
- **HTML5** - Structure
- **CSS3** - Styling with gradients and animations
- **Vanilla JavaScript** - Client-side functionality
- **Fetch API** - HTTP requests

## 🎨 Design Features

- Modern gradient UI with medical blue theme
- Responsive design for all devices
- Smooth animations and transitions
- Professional dashboard layout
- Card-based information display
- Intuitive navigation
- Real-time notifications

## 🔧 Configuration

### Environment Variables

Create a `.env` file with:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/healthcareapp

# JWT Secret (change in production!)
JWT_SECRET=your-super-secret-jwt-key

# Server Port
PORT=3000
```

### Database Setup

The application uses MongoDB with the following collections:
- **users** - Patient accounts and profiles
- **appointments** - Appointment bookings
- **medicalrecords** - Medical history and records

All collections are created automatically on first use.

## 📊 Dashboard Features

### Overview Section
- Total appointments counter
- Upcoming appointments
- Completed appointments
- Medical records count
- Quick action buttons
- Recent appointments list

### Appointment Management
- View all appointments
- Filter by status
- Book new appointments
- Cancel appointments
- See appointment details

### Medical Records
- View all records by type
- Lab test results
- Prescriptions
- Diagnoses
- Vaccination records

### Profile Management
- Personal information
- Contact details
- Emergency contacts
- Medical history
- Allergies and medications

## 🔒 Security Features

- **Password Security**: Bcrypt hashing with salt rounds
- **JWT Tokens**: Secure authentication with 7-day expiry
- **Protected Routes**: Middleware authentication for all sensitive endpoints
- **Input Validation**: Server-side validation for all inputs
- **CORS Protection**: Configured CORS policies
- **Environment Variables**: Sensitive data in .env files

## 🚀 Deployment

### Local Deployment
```bash
npm start
```

### Production Deployment
1. Set up MongoDB Atlas for cloud database
2. Update `.env` with production MongoDB URI
3. Change JWT_SECRET to a strong secret key
4. Deploy to platforms like:
   - Heroku
   - Vercel
   - AWS
   - DigitalOcean

## 📝 Future Enhancements

- [ ] Email notifications for appointments
- [ ] SMS reminders
- [ ] Video consultation integration
- [ ] Prescription upload and download
- [ ] Health metrics tracking
- [ ] Doctor dashboard
- [ ] Admin panel
- [ ] Multi-language support
- [ ] Dark mode

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this project for learning or production.

## 👨‍💻 Author

**Soujanya Poojari**
- GitHub: [@soujanya1513](https://github.com/soujanya1513)

## 🙏 Acknowledgments

- Built with modern web technologies
- Designed for patient convenience
- HIPAA compliance considerations
- Focus on security and privacy

---

**Note**: This is a demonstration application. For production use in healthcare settings, ensure full HIPAA compliance, security audits, and proper data protection measures.
