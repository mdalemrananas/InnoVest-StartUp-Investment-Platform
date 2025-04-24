# Project Progress Tracker

A Django-based web application for tracking project progress, expenses, and timelines.

## Features

- Submit project progress updates
- Track completion percentage
- Monitor expenses and budget
- Upload supporting documents
- Visual progress charts
- Timeline tracking

## Setup Instructions

1. Install Python 3.x
2. Install MySQL Server
3. Create a MySQL database named 'project_tracker'
4. Install required Python packages:
   ```
   pip install django mysqlclient pillow
   ```
5. Update database settings in `project_tracker/settings.py` if needed:
   ```python
   DATABASES = {
       'default': {
           'ENGINE': 'django.db.backends.mysql',
           'NAME': 'project_tracker',
           'USER': 'your_username',
           'PASSWORD': 'your_password',
           'HOST': 'localhost',
           'PORT': '3306',
       }
   }
   ```
6. Run migrations:
   ```
   python manage.py makemigrations
   python manage.py migrate
   ```
7. Create media directory:
   ```
   mkdir media
   ```
8. Run the development server:
   ```
   python manage.py runserver
   ```
9. Access the application at http://127.0.0.1:8000/

## Usage

1. Click "Add New Progress Update" to submit a new update
2. Fill in the form with project details
3. Submit the form to save the update
4. View all updates on the home page with progress charts

## File Structure

- `tracker/` - Main application directory
  - `models.py` - Database models
  - `views.py` - View functions
  - `forms.py` - Form definitions
  - `templates/` - HTML templates
  - `static/` - Static files (CSS, JS)
  - `templatetags/` - Custom template filters 