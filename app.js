// API Configuration
const API_URL = 'http://localhost:3000/api';

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
        showSection('member-section');
        updateNavButtons();
        if (data.user) {
            memberName.textContent = data.user.name;
            membershipLevel.textContent = data.user.membershipType;
        }
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

// Initialize
updateNavButtons();
showSection('welcome-section');
