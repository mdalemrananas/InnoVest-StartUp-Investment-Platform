from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.decorators import login_required, user_passes_test
from django.urls import reverse
from django.conf import settings
from django.contrib import messages
from django.core.mail import send_mail
from django.http import JsonResponse
from django.db.models import Sum, Count, Q
from django.utils import timezone

from .forms import (
    CustomUserCreationForm, 
    CustomAuthenticationForm,
    ProjectForm, 
    InvestmentForm, 
    ProjectUpdateForm, 
    CommentForm, 
    UserProfileForm
)
from .models import (
    CustomUser, 
    EmailVerificationToken,
    Project, 
    Investment, 
    ProjectUpdate, 
    Comment,
    AccessRequest
)

#Authentication and Registration Views
def register_view(request):
    if request.method == 'POST':
        form = CustomUserCreationForm(request.POST)
        if form.is_valid():
            user = form.save()
            user.is_active = True  # User can login but not access protected pages until email verification
            user.save()
            
            # Create verification token
            verification_token = EmailVerificationToken.objects.create(user=user)
            
            # Build verification URL
            verification_url = f"{settings.SITE_URL}{reverse('verify_email', args=[str(verification_token.token)])}"
            
            # Send verification email
            subject = 'Verify your email address'
            message = f'Please click the link below to verify your email address:\n\n{verification_url}'
            send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [user.email])
            
            messages.success(request, 'Your account has been created. Please check your email to verify your account.')
            return redirect('login')
    else:
        form = CustomUserCreationForm()
    
    return render(request, 'accounts/register.html', {'form': form})

def login_view(request):
    if request.method == 'POST':
        form = CustomAuthenticationForm(request, data=request.POST)
        if form.is_valid():
            email = form.cleaned_data.get('username')  # In our case, username is email
            password = form.cleaned_data.get('password')
            user = authenticate(username=email, password=password)
            
            if user is not None:
                if user.is_email_verified:
                    login(request, user)
                    return redirect('profile')  # Redirect to profile or dashboard
                else:
                    messages.warning(request, 'Please verify your email before logging in.')
            else:
                messages.error(request, 'Invalid email or password.')
    else:
        form = CustomAuthenticationForm()
    
    return render(request, 'accounts/login.html', {'form': form})

def verify_email(request, token):
    try:
        verification_token = EmailVerificationToken.objects.get(token=token)
        user = verification_token.user
        
        if not user.is_email_verified:
            user.is_email_verified = True
            user.save()
            verification_token.delete()  # Delete the token after use
            messages.success(request, 'Your email has been verified. You can now log in.')
        else:
            messages.info(request, 'Your email is already verified.')
        
        return redirect('login')
    except EmailVerificationToken.DoesNotExist:
        messages.error(request, 'Invalid verification link.')
        return redirect('login')

def logout_view(request):
    if request.method == 'POST':
        logout(request)
        show_success_page = request.POST.get('show_success_page', False)
        
        if show_success_page:
            return render(request, 'accounts/logout_success.html')
        else:
            messages.success(request, 'You have been successfully logged out.')
            return redirect('home')
    else:
        return render(request, 'accounts/logout_confirm.html')

@login_required
def profile_view(request):
    """View for displaying and updating user profile"""
    if request.method == 'POST':
        # Handle profile update
        user = request.user
        user.first_name = request.POST.get('first_name', user.first_name)
        user.last_name = request.POST.get('last_name', user.last_name)
        user.email = request.POST.get('email', user.email)
        
        # Handle profile picture upload
        if 'profile_picture' in request.FILES:
            user.profile_picture = request.FILES['profile_picture']
        
        user.save()
        messages.success(request, 'Profile updated successfully!')
        return redirect('profile')
    
    return render(request, 'accounts/profile.html')

def home_view(request):
    projects = Project.objects.filter(status='active').order_by('-created_at')
    featured_projects = Project.objects.filter(status='active').order_by('-raised_amount')[:3]
    return render(request, 'home.html', {
        'projects': projects,
        'featured_projects': featured_projects
    })

#product detail view
def product_list(request):
    products = Product.objects.all()
    return render(request, 'home.html', {'products': products})

def product_detail(request, product_id):
    product = get_object_or_404(Product, id=product_id)
    return render(request, 'accounts/product_detail.html', {'product': product})

# Admin Panel
def is_admin(user):
    return user.is_authenticated and user.is_staff

# Dashboard Home
@login_required
@user_passes_test(is_admin)
def admin_dashboard(request):
    # Get summary statistics
    total_companies = Company.objects.count()
    approved_companies = Company.objects.filter(status='approved').count()
    pending_companies = Company.objects.filter(status='pending').count()
    rejected_companies = Company.objects.filter(status='rejected').count()
    
    total_campaigns = CrowdfundingCampaign.objects.count()
    total_funding = CrowdfundingCampaign.objects.filter(status='approved').aggregate(Sum('current_amount'))['current_amount__sum'] or 0
    total_contributors = Contribution.objects.values('contributor').distinct().count()
    
    # Recent applications
    recent_companies = Company.objects.filter(status='pending').order_by('-created_at')[:5]
    
    context = {
        'total_companies': total_companies,
        'approved_companies': approved_companies,
        'pending_companies': pending_companies,
        'rejected_companies': rejected_companies,
        'total_campaigns': total_campaigns,
        'total_funding': total_funding,
        'total_contributors': total_contributors,
        'recent_companies': recent_companies,
        'active_page': 'dashboard',
    }
    return render(request, 'accounts/dashboard.html', context)

# Companies List
@login_required
@user_passes_test(is_admin)
def admin_companies(request):
    companies = Company.objects.all().order_by('-created_at')
    status_filter = request.GET.get('status', '')
    industry_filter = request.GET.get('industry', '')
    search_query = request.GET.get('search', '')
    
    if status_filter:
        companies = companies.filter(status=status_filter)
    
    if industry_filter:
        companies = companies.filter(industry_type=industry_filter)
    
    if search_query:
        companies = companies.filter(
            Q(name__icontains=search_query) | 
            Q(owner__username__icontains=search_query) |
            Q(location__icontains=search_query)
        )
    
    context = {
        'companies': companies,
        'status_choices': STATUS_CHOICES,
        'status_filter': status_filter,
        'industry_filter': industry_filter,
        'search_query': search_query,
        'active_page': 'companies',
    }
    return render(request, 'accounts/companies.html', context)

# Crowdfunding Campaigns
@login_required
@user_passes_test(is_admin)
def admin_crowdfunding(request):
    campaigns = CrowdfundingCampaign.objects.all().order_by('-created_at')
    status_filter = request.GET.get('status', '')
    search_query = request.GET.get('search', '')
    
    if status_filter:
        campaigns = campaigns.filter(status=status_filter)
    
    if search_query:
        campaigns = campaigns.filter(
            Q(title__icontains=search_query) | 
            Q(company__name__icontains=search_query)
        )
    
    context = {
        'campaigns': campaigns,
        'status_choices': STATUS_CHOICES,
        'status_filter': status_filter,
        'search_query': search_query,
        'active_page': 'crowdfunding',
    }
    return render(request, 'accounts/crowdfunding.html', context)

# Contributors
@login_required
@user_passes_test(is_admin)
def admin_contributors(request):
    contributors = CustomUser.objects.annotate(
        total_contributions=Count('contributions'),
        total_amount=Sum('contributions__amount')
    ).filter(total_contributions__gt=0).order_by('-total_amount')
    
    search_query = request.GET.get('search', '')
    if search_query:
        contributors = contributors.filter(username__icontains=search_query)
    
    context = {
        'contributors': contributors,
        'search_query': search_query,
        'active_page': 'contributors',
    }
    return render(request, 'accounts/contributors.html', context)

# Company Detail and Status Update
@login_required
@user_passes_test(is_admin)
def company_detail(request, company_id):
    company = get_object_or_404(Company, id=company_id)
    
    if request.method == 'POST':
        status = request.POST.get('status')
        if status in [choice[0] for choice in STATUS_CHOICES]:
            company.status = status
            company.save()
            messages.success(request, f"Company status updated to {dict(STATUS_CHOICES)[status]}")
            return redirect('admin_companies')
    
    campaigns = company.campaigns.all()
    context = {
        'company': company,
        'campaigns': campaigns,
        'status_choices': STATUS_CHOICES,
        'active_page': 'companies',
    }
    return render(request, 'accounts/company_detail.html', context)

# Update company status via AJAX
@login_required
@user_passes_test(is_admin)
def update_company_status(request):
    if request.method == 'POST' and request.is_ajax():
        company_id = request.POST.get('company_id')
        new_status = request.POST.get('status')
        
        try:
            company = Company.objects.get(id=company_id)
            company.status = new_status
            company.save()
            return JsonResponse({'success': True, 'new_status': dict(STATUS_CHOICES)[new_status]})
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)})
    
    return JsonResponse({'success': False, 'error': 'Invalid request'})

@login_required
def create_project(request):
    if not request.user.is_entrepreneur:
        messages.error(request, "Only entrepreneurs can create projects.")
        return redirect('home')

    if request.method == 'POST':
        form = ProjectForm(request.POST, request.FILES)
        if form.is_valid():
            project = form.save(commit=False)
            project.entrepreneur = request.user
            project.save()
            messages.success(request, "Project created successfully!")
            return redirect('project_detail', project_id=project.id)
    else:
        form = ProjectForm()
    
    return render(request, 'accounts/create_project.html', {'form': form})

def project_detail(request, project_id):
    project = get_object_or_404(Project, id=project_id)
    updates = project.updates.all().order_by('-created_at')
    comments = project.comments.all().order_by('-created_at')
    
    if request.method == 'POST':
        if 'comment' in request.POST:
            comment_form = CommentForm(request.POST)
            if comment_form.is_valid():
                comment = comment_form.save(commit=False)
                comment.project = project
                comment.user = request.user
                comment.save()
                return redirect('project_detail', project_id=project.id)
        elif 'invest' in request.POST and request.user.is_authenticated:
            investment_form = InvestmentForm(request.POST)
            if investment_form.is_valid():
                investment = investment_form.save(commit=False)
                investment.project = project
                investment.investor = request.user
                investment.save()
                
                # Update project raised amount
                project.raised_amount += investment.amount
                project.save()
                
                messages.success(request, "Investment made successfully!")
                return redirect('project_detail', project_id=project.id)
    else:
        comment_form = CommentForm()
        investment_form = InvestmentForm()
    
    return render(request, 'accounts/project_detail.html', {
        'project': project,
        'updates': updates,
        'comments': comments,
        'comment_form': comment_form,
        'investment_form': investment_form,
    })

@login_required
def create_update(request, project_id):
    project = get_object_or_404(Project, id=project_id)
    if project.entrepreneur != request.user:
        messages.error(request, "You don't have permission to create updates for this project.")
        return redirect('project_detail', project_id=project.id)

    if request.method == 'POST':
        form = ProjectUpdateForm(request.POST, request.FILES)
        if form.is_valid():
            update = form.save(commit=False)
            update.project = project
            update.save()
            messages.success(request, "Update posted successfully!")
            return redirect('project_detail', project_id=project.id)
    else:
        form = ProjectUpdateForm()
    
    return render(request, 'accounts/create_update.html', {'form': form, 'project': project})

@login_required
def user_profile(request):
    if request.method == 'POST':
        form = UserProfileForm(request.POST, request.FILES, instance=request.user)
        if form.is_valid():
            form.save()
            messages.success(request, "Profile updated successfully!")
            return redirect('user_profile')
    else:
        form = UserProfileForm(instance=request.user)
    
    user_projects = Project.objects.filter(entrepreneur=request.user)
    user_investments = Investment.objects.filter(investor=request.user)
    
    return render(request, 'accounts/user_profile.html', {
        'form': form,
        'user_projects': user_projects,
        'user_investments': user_investments,
    })

def search_projects(request):
    query = request.GET.get('q', '')
    category = request.GET.get('category', '')
    
    projects = Project.objects.filter(status='active')
    
    if query:
        projects = projects.filter(
            Q(title__icontains=query) |
            Q(description__icontains=query)
        )
    
    if category:
        projects = projects.filter(category=category)
    
    return render(request, 'accounts/search_results.html', {
        'projects': projects,
        'query': query,
        'category': category,
    })

@login_required
def request_access(request, project_id):
    if request.method == 'POST':
        project = get_object_or_404(Project, id=project_id)
        
        # Check if request already exists
        if AccessRequest.objects.filter(user=request.user, project=project).exists():
            return JsonResponse({
                'success': False,
                'error': 'You have already requested access to this project.'
            })
        
        # Create new access request
        AccessRequest.objects.create(
            user=request.user,
            project=project,
            status='pending'
        )
        
        # Send notification to project owner
        # TODO: Implement notification system
        
        return JsonResponse({
            'success': True,
            'message': 'Access request sent successfully.'
        })
    
    return JsonResponse({
        'success': False,
        'error': 'Invalid request method.'
    })