# Smart Campus Management System

![React](https://img.shields.io/badge/React-19.1.0-blue.svg)
![Django](https://img.shields.io/badge/Django-5.2.3-green.svg)
![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)

A library management system built with Django REST Framework and React, containerized with Docker.

## Features

### Library Management System (LMS)
- **Book Management**: Add, edit, delete, and view books
- **Class & Section Management**: Manage classes and sections
- **Book Issue/Return**: Issue books to students and track returns
- **Fine Management**: Calculate and track fines for late returns
- **Book History**: View complete borrowing history

### User Management
- **Role-based Authentication**: Support for librarian, student, principal, teacher, hod, nurse, doctor, health_staff, parent roles
- **JWT Authentication**: Secure login/logout with JWT tokens
- **Profile Management**: User profile with image upload
- **Password Change**: Users can change their passwords

### Notification System
- **Principal Notifications**: Principals can send notifications to users
- **File Attachments**: Support for document attachments in notifications
- **Priority Levels**: Normal, Urgent, and Info notification types

### Contact System
- **Contact Form**: Rate-limited contact form (2 requests per hour for anonymous users)

## Tech Stack

**Frontend:**
- React 19.1.0 with Vite
- TailwindCSS for styling
- TanStack Query for state management
- React Router Dom for navigation
- Axios for API calls

**Backend:**
- Django 5.2.3 with REST Framework
- JWT authentication
- SQLite database
- Media file handling for images and documents

## Quick Start with Docker

1. **Clone and navigate to the project:**
```bash
git clone <repository-url>
cd project
```

2. **Start with Docker Compose:**
```bash
cd docker
docker-compose up -d
```

3. **Access the application:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- Admin Panel: http://localhost:8000/admin

4. **Initialize the database:**
```bash
docker-compose exec backend python manage.py migrate
docker-compose exec backend python manage.py createsuperuser
```

## Development Setup

### Backend Setup
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## API Endpoints

### Authentication
- `POST /auth/login/` - User login
- `POST /auth/token/refresh/` - Refresh JWT token
- `POST /auth/token/blacklist/` - Logout

### Library Management
- `GET/POST /lms/books/` - List/Create books
- `PATCH/DELETE /lms/books/{id}/` - Update/Delete book
- `GET/POST /lms/book-issues/` - List/Create book issues
- `POST /lms/book-return/` - Return book

### Student Management
- `GET/POST /student/classes/` - List/Create classes
- `GET/POST /student/sections/` - List/Create sections
- `GET /student/all-student-profile/` - List all student profiles

### User Management
- `GET/PUT /user/` - Get/Update user profile
- `POST /user/change-password/` - Change password

### Notifications
- `GET /notification/` - Get user notifications

### Contact
- `POST /contact/` - Submit contact form
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
    ├── Dockerfile                    # Frontend container configuration
    ├── package.json                  # Dependencies and scripts
    ├── tailwind.config.js            # TailwindCSS configuration
    ├── vite.config.js                # Vite configuration
    ├── index.html                    # HTML template
    ├── public/                       # Static assets
    │   └── logo.png                  # Application logo
    └── src/                          # Source code
        ├── App.jsx                   # Main app component
        ├── main.jsx                  # Entry point
        ├── index.css                 # Global styles
        ├── api/                      # API layer
        ├── assets/                   # Static assets
        ├── components/               # Reusable components
        ├── context/                  # React context
        ├── hooks/                    # Custom hooks
        ├── pages/                    # Page components
        └── routes/                   # Routing configuration
```

## 🚦 Quick Start with Docker

The easiest way to get the Smart Campus Management System running is using Docker. This method requires minimal setup and works across all platforms.

### Prerequisites

- **Docker** (version 20.0+ recommended)
- **Docker Compose** (usually included with Docker Desktop)
- **Git** for cloning the repository

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd smart-campus-management
```

### Step 2: Start with Docker Compose

```bash
# Navigate to the docker directory
cd docker

# Start all services
docker-compose up -d

# View logs (optional)
docker-compose logs -f
```

### Step 3: Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **Admin Panel**: http://localhost:8000/admin

