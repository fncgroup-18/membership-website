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

// Mock database (in a real app, this would be a backend server)
let users = JSON.parse(localStorage.getItem('users')) || [];
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

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
    if (currentUser) {
        loginBtn.style.display = 'none';
        signupBtn.style.display = 'none';
        logoutBtn.style.display = 'block';
    } else {
        loginBtn.style.display = 'block';
        signupBtn.style.display = 'block';
        logoutBtn.style.display = 'none';
    }
};

const updateMemberSection = () => {
    if (currentUser) {
        memberName.textContent = currentUser.name;
        membershipLevel.textContent = currentUser.membershipType;
        
        // Display membership-specific content
        const content = {
            basic: '<p>Welcome to your Basic Membership! You have access to:</p><ul><li>Basic community features</li><li>Standard content access</li></ul>',
            premium: '<p>Welcome to your Premium Membership! You have access to:</p><ul><li>All community features</li><li>Premium content access</li><li>Exclusive events</li><li>Priority support</li></ul>'
        };
        
        memberContent.innerHTML = content[currentUser.membershipType];
    }
};

// Event Listeners
loginBtn.addEventListener('click', () => showSection('login-section'));
signupBtn.addEventListener('click', () => showSection('signup-section'));

logoutBtn.addEventListener('click', () => {
    currentUser = null;
    localStorage.removeItem('currentUser');
    showSection('welcome-section');
    updateNavButtons();
});

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = e.target.querySelector('[type="email"]').value;
    const password = e.target.querySelector('[type="password"]').value;
    
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        showSection('member-section');
        updateNavButtons();
        updateMemberSection();
        loginForm.reset();
    } else {
        alert('Invalid email or password');
    }
});

signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = e.target.querySelector('[type="text"]').value;
    const email = e.target.querySelector('[type="email"]').value;
    const password = e.target.querySelector('[type="password"]').value;
    const membershipType = document.getElementById('membershipType').value;
    
    if (users.some(u => u.email === email)) {
        alert('Email already registered');
        return;
    }
    
    const newUser = { name, email, password, membershipType };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    currentUser = newUser;
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    
    showSection('member-section');
    updateNavButtons();
    updateMemberSection();
    signupForm.reset();
});

// Initialize app state
if (currentUser) {
    showSection('member-section');
    updateMemberSection();
} else {
    showSection('welcome-section');
}
updateNavButtons();
