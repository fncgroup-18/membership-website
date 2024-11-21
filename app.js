// API Configuration
const API_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000/api'
    : 'https://membership-website-backend.onrender.com/api';  // Update this with your deployed backend URL

// DOM Elements
const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const logoutBtn = document.getElementById('logoutBtn');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const sections = document.querySelectorAll('.section');
const memberName = document.getElementById('memberName');
const membershipLevel = document.getElementById('membershipLevel');
const memberContent = document.getElementById('memberContent');
const companyProfileForm = document.getElementById('companyProfileForm');
const membershipValidity = document.getElementById('membershipValidity');
const membershipDate = document.getElementById('membershipDate');

// Helper Functions
const showSection = (sectionId) => {
    sections.forEach(section => {
        section.classList.remove('active');
        if (section.id === sectionId) {
            section.classList.add('active');
        }
    });
};

const updateNavButtons = () => {
    const token = localStorage.getItem('token');
    if (token) {
        loginBtn.style.display = 'none';
        signupBtn.style.display = 'none';
        logoutBtn.style.display = 'block';
    } else {
        loginBtn.style.display = 'block';
        signupBtn.style.display = 'block';
        logoutBtn.style.display = 'none';
    }
};

const showError = (message) => {
    alert(message || 'An error occurred. Please try again.');
};

const updateProfile = async (userData) => {
    try {
        const response = await fetch(`${API_URL}/user/profile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(userData)
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to update profile');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Profile update error:', error);
        throw error;
    }
};

const loadUserProfile = async () => {
    try {
        console.log('Loading user profile...');
        const response = await fetch(`${API_URL}/user/profile`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            console.error('Profile load failed:', await response.text());
            throw new Error('Failed to load profile');
        }

        const user = await response.json();
        console.log('Profile loaded:', user);
        
        // Update form fields
        document.getElementById('companyName').value = user.companyName || '';
        document.getElementById('companyEmail').value = user.companyEmail || '';
        document.getElementById('telephone').value = user.telephone || '';
        document.getElementById('companyDescription').value = user.companyDescription || '';
        
        // Update membership info
        memberName.textContent = user.name || '';
        membershipLevel.textContent = user.membershipType || '';
        membershipDate.textContent = user.membershipDate ? new Date(user.membershipDate).toLocaleDateString() : '';
        membershipValidity.textContent = user.membershipValidity ? new Date(user.membershipValidity).toLocaleDateString() : '';
    } catch (error) {
        console.error('Error loading profile:', error);
        showError(error.message);
    }
};

// Event Listeners
loginBtn.addEventListener('click', () => showSection('login-section'));
signupBtn.addEventListener('click', () => showSection('signup-section'));

logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('token');
    showSection('welcome-section');
    updateNavButtons();
});

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = e.target.querySelector('[type="email"]').value;
    const password = e.target.querySelector('[type="password"]').value;
    
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Login failed');
        }
        
        const data = await response.json();
        localStorage.setItem('token', data.token);
        
        // Load user profile first
        await loadUserProfile();
        
        // Then show member section and update navigation
        showSection('member-section');
        updateNavButtons();
        loginForm.reset();
    } catch (error) {
        console.error('Login error:', error);
        showError(error.message);
    }
});

signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = {
        name: e.target.querySelector('[type="text"]').value,
        email: e.target.querySelector('[type="email"]').value,
        password: e.target.querySelector('[type="password"]').value,
        membershipType: document.getElementById('membershipType').value
    };
    
    try {
        console.log('Attempting registration:', { ...formData, password: '***' });
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Registration failed');
        }
        
        const data = await response.json();
        console.log('Registration successful:', data);
        localStorage.setItem('token', data.token);
        showSection('member-section');
        updateNavButtons();
        if (data.user) {
            memberName.textContent = data.user.name;
            membershipLevel.textContent = data.user.membershipType;
        }
        signupForm.reset();
        alert('Registration successful! Welcome to MemberHub!');
    } catch (error) {
        console.error('Registration error:', error);
        showError(error.message);
    }
});

companyProfileForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = {
        companyName: document.getElementById('companyName').value,
        companyEmail: document.getElementById('companyEmail').value,
        telephone: document.getElementById('telephone').value,
        companyDescription: document.getElementById('companyDescription').value
    };
    
    try {
        await updateProfile(formData);
        showError('Profile updated successfully!');
    } catch (error) {
        showError(error.message);
    }
});

// Initialize
updateNavButtons();
showSection('welcome-section');
