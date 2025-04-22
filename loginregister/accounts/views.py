from django.shortcuts import render, redirect
from .models import RegisteredUser, ProfileDescription
from django.contrib import messages
from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth.hashers import make_password, check_password
import random, string

def generate_verification_code():
    """Generates a random 32-character verification code."""
    return ''.join(random.choices(string.ascii_letters + string.digits, k=32))

def register_view(request):
    """Handles user registration."""
    if request.method == 'POST':
        full_name = request.POST['fullname']
        username = request.POST['username']
        email = request.POST['email']
        password = request.POST['password']

        # Check if the username or email already exists in the database
        if RegisteredUser.objects.filter(username=username).exists():
            messages.error(request, "Username already exists.")
        elif RegisteredUser.objects.filter(email=email).exists():
            messages.error(request, "Email already used.")
        else:
            v_code = generate_verification_code()

            # Create the user and profile description objects
            profile = ProfileDescription.objects.create(username=username, email=email)
            user = RegisteredUser.objects.create(
                full_name=full_name,
                username=username,
                email=email,
                password=make_password(password),  # Hash the password before storing
                verification_code=v_code,
                is_verified=False
            )

            # Send the verification email with the verification link
            verification_link = f'http://{request.get_host()}/verify/?email={email}&v_code={v_code}'
            send_mail(
                'Email verification from Innovest',
                f'Click the link to verify: {verification_link}',
                settings.EMAIL_HOST_USER,
                [email],
                fail_silently=False,
            )

            messages.success(request, "Check your email for complete registration.")
            return redirect('login')

    return render(request, 'accounts/register.html')


def login_view(request):
    """Handles user login."""
    if request.method == 'POST':
        email_or_username = request.POST['email_username']
        password = request.POST['password']

        try:
            # Fetch the user by username or email
            user = RegisteredUser.objects.get(username=email_or_username) if RegisteredUser.objects.filter(username=email_or_username).exists() else RegisteredUser.objects.get(email=email_or_username)

            # Check if the account is verified
            if not user.is_verified:
                messages.error(request, "You have been blocked by the Admin!")
            # Check if the password is correct
            elif check_password(password, user.password):  # Use check_password to verify hashed password
                request.session['username'] = user.username
                return redirect('home')  # Redirect to homepage or dashboard after successful login
            else:
                messages.error(request, "Incorrect password.")
        except RegisteredUser.DoesNotExist:
            messages.error(request, "Username or email not registered.")

    return render(request, 'accounts/login.html')


def verify_email(request):
    """Handles email verification."""
    email = request.GET.get('email')
    v_code = request.GET.get('v_code')

    try:
        # Try to find the user with the given email and verification code
        user = RegisteredUser.objects.get(email=email, verification_code=v_code)
        if not user.is_verified:
            user.is_verified = True
            user.save()
            return render(request, 'accounts/verify_success.html')
        else:
            return render(request, 'accounts/verify_already.html')
    except RegisteredUser.DoesNotExist:
        return render(request, 'accounts/verify_failed.html')
from django.shortcuts import render

def home(request):
    username = request.session.get('username')

    if not username:
        return redirect('login')  

    return render(request, 'accounts/home.html', {'username': username})

def logout_view(request):
    request.session.flush() 
    return redirect('login')



