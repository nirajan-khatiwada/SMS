# Smart Campus Management System

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19.1.0-blue.svg)
![Django](https://img.shields.io/badge/Django-5.2.3-green.svg)
![Status](https://img.shields.io/badge/Status-In%20Development-yellow.svg)

A comprehensive educational institution management platform that provides seven integrated management portals for different stakeholders in a campus environment.

## 📖 Table of Contents

- [Project Overview](#-project-overview)
- [Architecture](#-architecture)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Configuration](#-environment-configuration)
- [API Documentation](#-api-documentation)
- [User Roles](#-user-roles)
- [Security Features](#-security-features)
- [Development](#-development)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

## 🎯 Project Overview

Smart Campus is a full-stack web application designed to streamline campus operations through role-based management systems. It provides dedicated portals for different user roles including students, teachers, administrators, and support staff.

## 🏗️ Architecture

```mermaid
graph TB
    A[React Frontend] --> B[Django REST API]
    B --> C[SQLite Database]
    B --> D[JWT Authentication]
    B --> E[Media Files]
    A --> F[TailwindCSS Styling]
    A --> G[React Query State]
```

**Frontend**: React.js with Vite, TailwindCSS, and modern UI components  
**Backend**: Django REST Framework with JWT authentication  
**Database**: SQLite (development), PostgreSQL (production ready)  
**State Management**: TanStack Query (React Query)  
**Authentication**: JWT-based with role-based access control

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

- **🔐 Role-based Authentication**: JWT-based authentication with role-specific access
- **📝 Contact Form**: Rate-limited contact form for inquiries
- **👤 User Profiles**: Customizable user profiles with image upload
- **📱 Responsive Design**: Mobile-first design with TailwindCSS
- **⚡ Real-time Updates**: Using React Query for efficient data fetching
- **🔔 Notifications**: Real-time notification system
- **📊 Dashboard Analytics**: Role-specific dashboards with key metrics
- **🌐 Multi-device Support**: Seamless experience across devices

## 🛠️ Tech Stack

### Frontend
- **React 19.1.0** - UI library with latest features
- **Vite 6.3.5** - Next-generation build tool and dev server
- **TailwindCSS 4.1.10** - Utility-first CSS framework
- **React Router Dom 7.6.2** - Client-side routing
- **TanStack Query 5.80.10** - Data fetching and state management
- **Axios 1.10.0** - HTTP client
- **React Hook Form 7.58.1** - Form management with validation
- **Lucide React 0.518.0** - Beautiful icon library
- **React Toastify 11.0.5** - Notification system
- **JWT Decode 4.0.0** - JWT token handling

### Backend
- **Django 5.2.3** - High-level Python web framework
- **Django REST Framework** - Powerful toolkit for building APIs
- **SimpleJWT** - JWT authentication for Django
- **django-cors-headers** - CORS handling for cross-origin requests
- **Pillow** - Python Imaging Library for image processing

### Development Tools
- **ESLint 9.25.0** - Code linting and formatting
- **Vite Plugin React 4.4.1** - React support for Vite
- **TypeScript Support** - Type definitions for React

## 📁 Project Structure

```
project/
├── README.md                          # Project documentation
├── docker/                           # Docker configuration (if applicable)
├── backend/                          # Django backend application
│   ├── manage.py                     # Django management script
│   ├── db.sqlite3                    # SQLite database file
│   ├── debug_admin.py                # Admin debugging utilities
│   ├── backend/                      # Main Django project
│   │   ├── __init__.py
│   │   ├── settings.py               # Django settings
│   │   ├── urls.py                   # URL routing
│   │   ├── wsgi.py                   # WSGI configuration
│   │   └── asgi.py                   # ASGI configuration
│   ├── contactform/                  # Contact form app
│   │   ├── models.py                 # Contact form models
│   │   ├── views.py                  # API views
│   │   ├── serializer.py             # Data serializers
│   │   ├── urls.py                   # URL patterns
│   │   └── migrations/               # Database migrations
│   ├── customauth/                   # Custom authentication
│   │   ├── views.py                  # Auth views
│   │   ├── serializer.py             # Auth serializers
│   │   └── urls.py                   # Auth URLs
│   ├── customuser/                   # User management
│   │   ├── models.py                 # User models
│   │   ├── views.py                  # User views
│   │   ├── admin.py                  # Admin interface
│   │   └── migrations/               # User migrations
│   ├── lms/                          # Library Management System
│   │   ├── models.py                 # LMS models
│   │   ├── views.py                  # LMS API views
│   │   └── serializer.py             # LMS serializers
│   ├── student/                      # Student management
│   │   ├── models.py                 # Student models
│   │   ├── views.py                  # Student views
│   │   └── migrations/               # Student migrations
│   ├── Notification/                 # Notification system
│   │   ├── models.py                 # Notification models
│   │   ├── views.py                  # Notification views
│   │   └── serializer.py             # Notification serializers
│   └── media/                        # Media files storage
│       ├── notices/                  # Notice attachments
│       └── profile_pics/             # User profile pictures
└── frontend/                         # React frontend application
    ├── package.json                  # Dependencies and scripts
    ├── index.html                    # Main HTML template
    ├── vite.config.js                # Vite configuration
    ├── tailwind.config.js            # TailwindCSS configuration
    ├── eslint.config.js              # ESLint configuration
    ├── public/                       # Static assets
    │   └── logo.png                  # Application logo
    └── src/                          # Source code
        ├── main.jsx                  # Application entry point
        ├── App.jsx                   # Main App component
        ├── index.css                 # Global styles
        ├── api/                      # API integration
        ├── assets/                   # Static assets
        ├── components/               # Reusable components
        │   ├── UI/                   # UI components
        │   └── SmallComponent/       # Small utility components
        ├── pages/                    # Page components
        ├── routes/                   # Routing configuration
        ├── context/                  # React context providers
        └── hooks/                    # Custom React hooks
```

## 🚦 Getting Started

### Prerequisites

Make sure you have the following installed on your system:

- **Python 3.9+** (recommended: Python 3.11+)
- **Node.js 18+** (recommended: Node.js 20+)
- **npm** or **yarn** package manager
- **Git** for version control

### Quick Start

1. **Clone the repository:**
```bash
git clone <repository-url>
cd project
```

### Backend Setup

1. **Navigate to the backend directory:**
```bash
cd backend
```

2. **Create and activate a virtual environment:**
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python -m venv venv
source venv/bin/activate
```

3. **Install Python dependencies:**
```bash
pip install --upgrade pip
pip install django djangorestframework django-cors-headers djangorestframework-simplejwt pillow
```

4. **Apply database migrations:**
```bash
python manage.py makemigrations
python manage.py migrate
```

5. **Create a superuser account:**
```bash
python manage.py createsuperuser
```

6. **Load initial data (optional):**
```bash
python manage.py loaddata fixtures/initial_data.json  # if fixtures exist
```

7. **Start the Django development server:**
```bash
python manage.py runserver
```

The backend API will be available at `http://localhost:8000`

**Admin Interface:** `http://localhost:8000/admin`

### Frontend Setup

1. **Open a new terminal and navigate to the frontend directory:**
```bash
cd frontend
```

2. **Install Node.js dependencies:**
```bash
npm install
# or if you prefer yarn
yarn install
```

3. **Start the React development server:**
```bash
npm run dev
# or with yarn
yarn dev
```

The frontend will be available at `http://localhost:5173`

### Verify Installation

1. Open `http://localhost:5173` in your browser
2. You should see the Smart Campus login page
3. Test the API at `http://localhost:8000/api/`
4. Access admin panel at `http://localhost:8000/admin`

## 🔧 Environment Configuration

### Backend Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Django Settings
DEBUG=True
SECRET_KEY=your-secret-key-here
ALLOWED_HOSTS=localhost,127.0.0.1

# Database Configuration (for production)
DATABASE_URL=postgresql://user:password@localhost:5432/smartcampus

# JWT Settings
JWT_SECRET_KEY=your-jwt-secret-key
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_LIFETIME=60  # minutes
JWT_REFRESH_TOKEN_LIFETIME=1440  # minutes (24 hours)

# Email Configuration (for notifications)
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password

# Rate Limiting
RATELIMIT_ENABLE=True
RATELIMIT_USE_CACHE=default

# Media Files
MEDIA_ROOT=media/
MEDIA_URL=/media/
```

### Frontend Environment Variables

Create a `.env` file in the `frontend/` directory:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8000/api
VITE_MEDIA_BASE_URL=http://localhost:8000/media

# Application Settings
VITE_APP_NAME=Smart Campus Management System
VITE_APP_VERSION=1.0.0

# Development Settings
VITE_DEV_MODE=true
VITE_ENABLE_DEVTOOLS=true
```

### Production Environment

For production deployment, update the following:

**Backend (.env.production):**
```env
DEBUG=False
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
DATABASE_URL=postgresql://user:password@localhost:5432/smartcampus_prod
```

**Frontend (.env.production):**
```env
VITE_API_BASE_URL=https://api.yourdomain.com
VITE_DEV_MODE=false
VITE_ENABLE_DEVTOOLS=false
```

## 📚 API Documentation

### Authentication Endpoints

```http
POST /api/auth/login/
POST /api/auth/register/
POST /api/auth/logout/
POST /api/auth/refresh/
GET  /api/auth/user/
```

### Core API Endpoints

```http
# User Management
GET    /api/users/
POST   /api/users/
GET    /api/users/{id}/
PUT    /api/users/{id}/
DELETE /api/users/{id}/

# Contact Form
POST   /api/contact/

# Library Management
GET    /api/lms/books/
POST   /api/lms/books/
GET    /api/lms/books/{id}/
PUT    /api/lms/books/{id}/

# Student Management
GET    /api/students/
POST   /api/students/
GET    /api/students/{id}/

# Notifications
GET    /api/notifications/
POST   /api/notifications/
PUT    /api/notifications/{id}/read/
```

### Rate Limiting

The API implements rate limiting to prevent abuse:

- **Anonymous users**: 2 requests per hour
- **Authenticated users**: 1000 requests per hour
- **Login attempts**: 4 requests per minute per IP

### Response Format

All API responses follow this structure:

```json
{
    "success": true,
    "data": {
        // Response data
    },
    "message": "Success message",
    "errors": null
}
```

Error responses:
```json
{
    "success": false,
    "data": null,
    "message": "Error message",
    "errors": {
        "field": ["Error details"]
    }
}
```

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

#### Frontend Commands
```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run preview          # Preview production build
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint errors

# Testing (if configured)
npm run test             # Run tests
npm run test:coverage    # Run tests with coverage
```

#### Backend Commands
```bash
# Development
python manage.py runserver              # Start development server
python manage.py runserver 0.0.0.0:8000 # Start server accessible from network

# Database
python manage.py makemigrations         # Create new migrations
python manage.py migrate                # Apply migrations
python manage.py flush                  # Clear database
python manage.py loaddata <fixture>     # Load test data

# Utilities
python manage.py collectstatic          # Collect static files
python manage.py createsuperuser        # Create admin user
python manage.py shell                  # Django shell
python manage.py dbshell                # Database shell

# Testing
python manage.py test                   # Run tests
python manage.py test --verbosity=2     # Run tests with verbose output
```

### Development Workflow

1. **Feature Development:**
   - Create a new branch: `git checkout -b feature/feature-name`
   - Make changes in both frontend and backend as needed
   - Test thoroughly in development environment
   - Commit changes: `git commit -m "feat: add feature description"`

2. **Testing:**
   - Run backend tests: `python manage.py test`
   - Run frontend linting: `npm run lint`
   - Manual testing in browser
   - Test API endpoints with tools like Postman

3. **Code Quality:**
   - Follow PEP 8 for Python code
   - Use ESLint configuration for JavaScript/React
   - Write meaningful commit messages
   - Add comments for complex logic

### Database Management

#### Reset Database
```bash
# Remove database file
rm db.sqlite3

# Recreate database
python manage.py migrate
python manage.py createsuperuser
```

#### Create Fixtures
```bash
# Export data to fixture
python manage.py dumpdata app_name > fixtures/app_name_data.json

# Load fixture
python manage.py loaddata fixtures/app_name_data.json
```

### API Testing

#### Using curl
```bash
# Get JWT token
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "password"}'

# Use token in requests
curl -X GET http://localhost:8000/api/users/ \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

#### Using Python requests
```python
import requests

# Login
response = requests.post('http://localhost:8000/api/auth/login/', {
    'username': 'admin',
    'password': 'password'
})
token = response.json()['access']

# Make authenticated request
headers = {'Authorization': f'Bearer {token}'}
response = requests.get('http://localhost:8000/api/users/', headers=headers)
```

## 🚀 Deployment

### Frontend Deployment

#### Using Vercel (Recommended)

1. **Build the frontend:**
```bash
cd frontend
npm run build
```

2. **Deploy to Vercel:**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

3. **Environment Variables:**
Set environment variables in Vercel dashboard:
- `VITE_API_BASE_URL`
- `VITE_MEDIA_BASE_URL`

#### Using Netlify

1. **Build and deploy:**
```bash
npm run build
```

2. **Deploy the `dist` folder to Netlify**

3. **Configure redirects** by creating `public/_redirects`:
```
/*    /index.html   200
```

### Backend Deployment

#### Using Railway/Render

1. **Prepare for production:**
```python
# In settings.py
DEBUG = False
ALLOWED_HOSTS = ['your-domain.com', 'www.your-domain.com']
```

2. **Create requirements.txt:**
```bash
pip freeze > requirements.txt
```

3. **Configure database:**
```python
# Use PostgreSQL for production
DATABASES = {
    'default': dj_database_url.parse(os.environ.get('DATABASE_URL'))
}
```

4. **Static files configuration:**
```python
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'
```

#### Using Docker

1. **Create Dockerfile for backend:**
```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["gunicorn", "backend.wsgi:application", "--bind", "0.0.0.0:8000"]
```

2. **Create docker-compose.yml:**
```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - DEBUG=False
    volumes:
      - ./backend:/app
  
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend
```

## 🔍 Troubleshooting

### Common Issues

#### Backend Issues

**1. Migration Errors**
```bash
# Reset migrations
python manage.py migrate --fake-initial
python manage.py migrate
```

**2. CORS Issues**
```python
# In settings.py, add to CORS_ALLOWED_ORIGINS:
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
```

**3. Static Files Not Loading**
```bash
# Collect static files
python manage.py collectstatic --noinput
```

**4. Database Connection Issues**
```bash
# Check database settings
python manage.py dbshell
```

#### Frontend Issues

**1. Build Errors**
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**2. API Connection Issues**
```bash
# Check environment variables
echo $VITE_API_BASE_URL
```

**3. Routing Issues**
- Ensure server is configured for SPA routing
- Check React Router configuration

#### Development Environment

**1. Port Already in Use**
```bash
# Kill process on port 8000
npx kill-port 8000

# Kill process on port 5173
npx kill-port 5173
```

**2. Virtual Environment Issues**
```bash
# Recreate virtual environment
deactivate
rm -rf venv
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
```

### Performance Optimization

**Backend:**
- Use database indexing for frequently queried fields
- Implement caching with Redis
- Use database connection pooling
- Optimize database queries

**Frontend:**
- Implement code splitting
- Use React.memo for component optimization
- Implement virtual scrolling for large lists
- Optimize images and assets

### Debugging Tips

**Backend Debugging:**
```bash
# Enable debug mode
export DEBUG=True

# View logs
python manage.py runserver --verbosity=2
```

**Frontend Debugging:**
```bash
# Enable React Query devtools
npm run dev

# View network requests in browser dev tools
# Check console for errors
```

## 🤝 Contributing

We welcome contributions to the Smart Campus Management System! Here's how you can contribute:

### Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR-USERNAME/smart-campus.git
   cd smart-campus
   ```
3. **Create a branch** for your feature:
   ```bash
   git checkout -b feature/your-feature-name
   ```

### Development Guidelines

#### Code Style
- **Python**: Follow PEP 8 guidelines
- **JavaScript/React**: Use ESLint configuration provided
- **Commit Messages**: Use conventional commits format
  ```
  feat: add new feature
  fix: bug fix
  docs: documentation update
  style: formatting changes
  refactor: code refactoring
  test: adding tests
  ```

#### Before Submitting

1. **Test your changes:**
   ```bash
   # Backend tests
   cd backend
   python manage.py test
   
   # Frontend linting
   cd frontend
   npm run lint
   ```

2. **Update documentation** if needed
3. **Add tests** for new features
4. **Ensure migrations** are included for model changes

### Submitting Changes

1. **Commit your changes:**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

2. **Push to your fork:**
   ```bash
   git push origin feature/your-feature-name
   ```

3. **Create a Pull Request** on GitHub with:
   - Clear description of changes
   - Screenshots (if UI changes)
   - Testing instructions
   - Related issue number (if applicable)

### Issues and Bug Reports

When reporting bugs, please include:
- Operating system and version
- Python and Node.js versions
- Steps to reproduce the issue
- Expected vs actual behavior
- Error messages or screenshots

### Feature Requests

For new features:
- Check existing issues first
- Provide clear use case
- Describe expected behavior
- Consider implementation approach

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### MIT License Summary

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software.

## 📞 Support

### Documentation
- **API Documentation**: Available at `/api/docs/` when running the backend
- **Component Documentation**: Storybook documentation (if configured)

### Getting Help
- **Issues**: Report bugs and request features on GitHub Issues
- **Discussions**: Join community discussions on GitHub Discussions
- **Contact**: Use the contact form in the application
- **Email**: development-team@smartcampus.edu (if applicable)

### Community
- Follow the project on GitHub for updates
- Star the repository if you find it useful
- Share the project with others who might benefit

## 🔮 Future Enhancements

### Short-term Goals (Next 3 months)
- [ ] Mobile application (React Native)
- [ ] Advanced analytics dashboard
- [ ] Email notification system
- [ ] Document management system
- [ ] Calendar integration

### Medium-term Goals (3-6 months)
- [ ] Multi-language support (i18n)
- [ ] Advanced reporting features
- [ ] Integration with external systems (LTI, LDAP)
- [ ] Video conferencing integration
- [ ] Progressive Web App (PWA) features

### Long-term Vision (6+ months)
- [ ] AI-powered insights and recommendations
- [ ] Blockchain-based certification system
- [ ] IoT integration for smart campus features
- [ ] Advanced security features (2FA, SSO)
- [ ] Microservices architecture migration

### Contribution Opportunities
- Frontend components and UI improvements
- Backend API enhancements
- Mobile app development
- Documentation improvements
- Testing and quality assurance
- Performance optimization
- Security auditing

---

## 🏆 Acknowledgments

- **Django Team** - For the excellent web framework
- **React Team** - For the powerful UI library
- **TailwindCSS** - For the utility-first CSS framework
- **Contributors** - All the developers who have contributed to this project
- **Educational Institutions** - For providing requirements and feedback

---

**Built with ❤️ for educational institutions**

*Last updated: June 2025*