# Smart Campus Management System

A comprehensive educational institution management platform that provides seven integrated management portals for different stakeholders in a campus environment.

## 🎯 Project Overview

Smart Campus is a full-stack web application designed to streamline campus operations through role-based management systems. It provides dedicated portals for different user roles including students, teachers, administrators, and support staff.

## 🏗️ Architecture

**Frontend**: React.js with Vite, TailwindCSS, and modern UI components
**Backend**: Django REST Framework with JWT authentication
**Database**: SQLite (development)
**State Management**: TanStack Query (React Query)

## 🚀 Features

### Management Portals

1. **LMS** - Library Management System
   - Book inventory management
   - Borrowing and return tracking
   - Real-time availability status

2. **AMS** - Attendance Management System
   - Student and faculty attendance tracking
   - Automated reporting
   - Real-time notifications

3. **TMS** - Teacher Management System
   - Schedule management
   - Performance tracking
   - Resource allocation

4. **HMS (Hospital)** - Hospital Management System
   - Medical records management
   - Sick leave tracking
   - Health monitoring

5. **HMS (HOD)** - HOD Management System
   - Department oversight
   - Staff evaluation
   - Resource planning

6. **PMS** - Principal Management System
   - Executive dashboard
   - Institutional analytics
   - Strategic planning tools

7. **SMS** - Student Management System
   - Unified student portal
   - Grades and schedules
   - Communication hub

### Core Features

- **Role-based Authentication**: JWT-based authentication with role-specific access
- **Contact Form**: Rate-limited contact form for inquiries
- **User Profiles**: Customizable user profiles with image upload
- **Responsive Design**: Mobile-first design with TailwindCSS
- **Real-time Updates**: Using React Query for efficient data fetching

## 🛠️ Tech Stack

### Frontend
- **React 19.1.0** - UI library
- **Vite** - Build tool and dev server
- **TailwindCSS 4.1.10** - Utility-first CSS framework
- **React Router Dom 7.6.2** - Client-side routing
- **TanStack Query 5.80.10** - Data fetching and state management
- **Axios** - HTTP client
- **React Hook Form** - Form management
- **Lucide React** - Icon library
- **React Toastify** - Notification system

### Backend
- **Django 5.2.3** - Web framework
- **Django REST Framework** - API framework
- **SimpleJWT** - JWT authentication
- **django-cors-headers** - CORS handling
- **Pillow** - Image processing

## 📁 Project Structure

```
project/
├── backend/
│   ├── backend/
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── ...
│   ├── contactform/
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── serializer.py
│   │   └── ...
│   ├── customauth/
│   │   ├── views.py
│   │   ├── serializer.py
│   │   └── ...
│   ├── customuser/
│   │   ├── models.py
│   │   ├── views.py
│   │   └── ...
│   └── manage.py
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── UI/
    │   │   └── SmallComponent/
    │   ├── pages/
    │   ├── routes/
    │   ├── context/
    │   ├── hooks/
    │   └── api/
    ├── public/
    └── package.json
```

## 🚦 Getting Started

### Prerequisites

- Python 3.9+
- Node.js 16+
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create and activate a virtual environment:
```bash
python -m venv venv
venv\Scripts\activate  # Windows
```

3. Install dependencies:
```bash
pip install django djangorestframework django-cors-headers djangorestframework-simplejwt pillow
```

4. Run migrations:
```bash
python manage.py migrate
```

5. Create a superuser:
```bash
python manage.py createsuperuser
```

6. Start the development server:
```bash
python manage.py runserver
```

The backend will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## 🔐 User Roles

The system supports the following user roles:

- **Principal** - Full system access and analytics
- **HOD** - Department-level management
- **Teacher** - Class and student management
- **Student** - Personal dashboard and records
- **Librarian** - Library system management
- **Attender** - Attendance tracking
- **Nurse/Doctor/Health Staff** - Medical records management
- **Parent** - Student progress monitoring

## 🛡️ Security Features

- JWT token-based authentication
- Role-based access control
- Request rate limiting
- CORS protection
- Input validation and sanitization

## 📊 API Rate Limits

- Anonymous users: 2 requests per hour
- User login attempts: 4 requests per minute

## 🎨 UI/UX Features

- Modern, responsive design
- Dark/light theme support
- Interactive animations
- Mobile-first approach
- Accessibility compliant

## 📱 Mobile Support

The application is fully responsive and optimized for mobile devices with touch-friendly interfaces and adaptive layouts.

## 🔧 Development

### Available Scripts

**Frontend:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

**Backend:**
- `python manage.py runserver` - Start development server
- `python manage.py migrate` - Run database migrations
- `python manage.py collectstatic` - Collect static files

## 🚀 Deployment

### Frontend Deployment
1. Build the frontend:
```bash
npm run build
```

2. Deploy the `dist` folder to your hosting service

### Backend Deployment
1. Set `DEBUG = False` in settings.py
2. Configure `ALLOWED_HOSTS`
3. Set up a production database
4. Configure static file serving
5. Deploy to your hosting service

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support and inquiries, please use the contact form in the application or reach out to the development team.

## 🔮 Future Enhancements

- Mobile application
- Advanced analytics dashboard
- Integration with external systems
- Multi-language support
- Advanced reporting features
- Real-time notifications
- Video conferencing integration

---

**Built with ❤️ for educational institutions**