let currentUser = null;
let currentSection = 'home';

document.addEventListener('DOMContentLoaded', () => {
    initializePage();
});

function initializePage() {
    initializeNavigation();
    initializeLoginModal();
    setupModalViews();
    loadDynamicContent();
    setupFormsAndFilters();
    checkLoginState();
    handleUrlChanges();
}

function showSection(sectionName) {
    if (!sectionName) return;

    const sections = document.querySelectorAll('.section');
    const targetSection = document.getElementById(sectionName);

    if (!targetSection) {
        console.warn(`Section "${sectionName}" not found.`);
        return;
    }

    sections.forEach(section => {
        section.classList.remove('active');
    });

    targetSection.classList.add('active');
    updateActiveNavLink(sectionName);
    currentSection = sectionName;
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateActiveNavLink(sectionName) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === sectionName) {
            link.classList.add('active');
        }
    });
}

function initializeNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navigationTriggers = document.querySelectorAll('[data-section]');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        document.addEventListener('click', (e) => {
            if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }

    navigationTriggers.forEach(trigger => {
        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            const targetSection = this.getAttribute('data-section');
            window.location.hash = targetSection;
            
            if (navToggle && navMenu && navMenu.classList.contains('active')) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    });
}

function handleUrlChanges() {
    const showSectionFromHash = () => {
        const hash = window.location.hash.substring(1);
        showSection(hash || 'home'); 
    };

    window.addEventListener('hashchange', showSectionFromHash);
    showSectionFromHash();
}

function initializeLoginModal() {
    const loginBtn = document.getElementById('login-btn');
    const loginModal = document.getElementById('login-modal');
    const closeBtn = document.getElementById('close-login');
    const joinBtn = document.getElementById('join-ieee-btn');

    const openModal = () => {
        if (loginModal) {
            loginModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    };

    const closeModal = () => {
        if (loginModal) {
            loginModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    };

    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            if (currentUser) {
                if (confirm('You are already logged in. Do you want to logout?')) {
                    logout();
                }
            } else {
                openModal();
            }
        });
    }

    if (joinBtn) joinBtn.addEventListener('click', openModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (loginModal) {
        loginModal.addEventListener('click', (e) => {
            if (e.target === loginModal) closeModal();
        });
    }
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && loginModal && loginModal.style.display === 'flex') {
            closeModal();
        }
    });
}

function setupModalViews() {
    const modalTitle = document.getElementById('modal-title');
    const containers = {
        login: document.getElementById('login-container'),
        register: document.getElementById('register-container'),
        forgot: document.getElementById('forgot-password-container')
    };

    const showView = (viewName, title) => {
        if(modalTitle) modalTitle.textContent = title;
        for (const key in containers) {
            if (containers[key]) containers[key].style.display = (key === viewName) ? 'block' : 'none';
        }
    };

    document.getElementById('show-register-form')?.addEventListener('click', (e) => {
        e.preventDefault();
        showView('register', 'New Member Registration');
    });

    document.getElementById('show-forgot-form')?.addEventListener('click', (e) => {
        e.preventDefault();
        showView('forgot', 'Forgot Password');
    });

    document.querySelectorAll('.back-to-login').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            showView('login', 'Member Login');
        });
    });
}

function loadDynamicContent() {
    loadEvents();
    loadTeamMembers();
    loadPublications();
}

function loadEvents() {
    const container = document.getElementById('events-container');
    if (!container || typeof eventData === 'undefined') return;
    container.innerHTML = eventData.map(event => `
        <div class="event-card">
            <div class="event-date">${event.date}</div>
            <h3>${event.title}</h3>
            <p>${event.description}</p>
            <div class="event-location">${event.location}</div>
        </div>
    `).join('');
}

function loadTeamMembers() {
    const container = document.getElementById('team-grid');
    if (!container || typeof teamData === 'undefined') return;
    container.innerHTML = teamData.map(member => `
        <div class="team-member">
            <div class="member-photo">
                ${member.imageUrl ? `<img src="${member.imageUrl}" alt="Photo of ${member.name}">` : member.initials}
            </div>
            <div class="member-name">${member.name}</div>
            <div class="member-position">${member.position}</div>
            <div class="member-bio">${member.bio}</div>
        </div>
    `).join('');
}

function loadPublications(filter = 'all') {
    const container = document.getElementById('publications-list');
    if (!container || typeof publicationData === 'undefined') return;
    const filtered = (filter === 'all') 
        ? publicationData 
        : publicationData.filter(p => p.category === filter);
    
    container.innerHTML = filtered.map(pub => `
        <div class="publication-item">
            <div class="publication-title">${pub.title}</div>
            <div class="publication-authors">${pub.authors}</div>
            <div class="publication-venue">${pub.venue}</div>
            <div class="publication-year">${pub.year}</div>
        </div>
    `).join('');
}

function setupFormsAndFilters() {
    document.getElementById('loginForm')?.addEventListener('submit', handleLogin);
    document.getElementById('registerForm')?.addEventListener('submit', e => {
        e.preventDefault();
        alert('Registration feature coming soon!');
    });
    document.getElementById('forgotPasswordForm')?.addEventListener('submit', e => {
        e.preventDefault();
        alert('Password reset feature coming soon!');
    });

    document.querySelectorAll('.filter-btn').forEach(button => {
        button.addEventListener('click', function() {
            document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            loadPublications(this.dataset.category);
        });
    });
}

function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    if (typeof sampleUsers === 'undefined') return;

    const user = sampleUsers.find(u => u.email === email && u.password === password);
    if (user) {
        login(user);
    } else {
        alert('Invalid credentials. Try:\nEmail: admin@ieee.smvitm.ac.in\nPassword: admin123');
    }
}

function login(user) {
    currentUser = user;
    localStorage.setItem('ieeeUser', JSON.stringify(user));
    updateLoginState();
    
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('welcome-message').style.display = 'block';

    setTimeout(() => {
        document.getElementById('login-modal').style.display = 'none';
        document.body.style.overflow = 'auto';
    }, 2000);
}

function logout() {
    currentUser = null;
    localStorage.removeItem('ieeeUser');
    updateLoginState();
    
    const loginModal = document.getElementById('login-modal');
    if (loginModal) {
        document.getElementById('welcome-message').style.display = 'none';
        document.getElementById('login-form').style.display = 'block';
        document.getElementById('loginForm')?.reset();
    }
}

function checkLoginState() {
    const storedUser = localStorage.getItem('ieeeUser');
    if (storedUser) {
        currentUser = JSON.parse(storedUser);
    }
    updateLoginState();
}

function updateLoginState() {
    const loginBtn = document.getElementById('login-btn');
    const notificationBell = document.getElementById('notification-bell');
    const userProfile = document.getElementById('user-profile');

    if (!loginBtn || !notificationBell || !userProfile) return;

    if (currentUser) {
        loginBtn.textContent = 'Logout';
        loginBtn.classList.add('logged-in');
        notificationBell.style.display = 'block';
        userProfile.style.display = 'block';
        document.getElementById('user-name').textContent = `Welcome, ${currentUser.name.split(' ')[0]}`;
        
        const unreadCount = notificationData.filter(n => !n.read).length;
        document.getElementById('notification-count').textContent = unreadCount;
    } else {
        loginBtn.textContent = 'Login';
        loginBtn.classList.remove('logged-in');
        notificationBell.style.display = 'none';
        userProfile.style.display = 'none';
    }
}

document.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if(header) {
        header.style.background = (window.scrollY > 50) ? 'rgba(15, 23, 42, 0.9)' : 'rgba(15, 23, 42, 0.8)';
    }
});
