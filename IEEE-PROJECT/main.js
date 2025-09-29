let currentUser = null;
let currentSection = 'home';

document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeLoginModal();
    setupModalViews();
    loadEvents();
    loadTeamMembers();
    loadPublications();
    setupLoginForm();
    setupPublicationFilters();
    checkLoginState();
});

function setupModalViews() {
    const modalTitle = document.getElementById('modal-title');
    const loginContainer = document.getElementById('login-container');
    const registerContainer = document.getElementById('register-container');
    const forgotPasswordContainer = document.getElementById('forgot-password-container');

    const showRegisterBtn = document.getElementById('show-register-form');
    const showForgotBtn = document.getElementById('show-forgot-form');
    const backToLoginBtns = document.querySelectorAll('.back-to-login');

    showRegisterBtn.addEventListener('click', (e) => {
        e.preventDefault();
        modalTitle.textContent = 'New Member Registration';
        loginContainer.style.display = 'none';
        forgotPasswordContainer.style.display = 'none';
        registerContainer.style.display = 'block';
    });

    showForgotBtn.addEventListener('click', (e) => {
        e.preventDefault();
        modalTitle.textContent = 'Forgot Password';
        loginContainer.style.display = 'none';
        registerContainer.style.display = 'none';
        forgotPasswordContainer.style.display = 'block';
    });

    backToLoginBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            modalTitle.textContent = 'Member Login';
            registerContainer.style.display = 'none';
            forgotPasswordContainer.style.display = 'none';
            loginContainer.style.display = 'block';
        });
    });

    document.getElementById('registerForm').addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Registration feature coming soon!');
    });

    document.getElementById('forgotPasswordForm').addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Password reset feature coming soon!');
    });
}

function initializeNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    navToggle.addEventListener('click', function() {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetSection = this.getAttribute('data-section');
            showSection(targetSection);
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    document.addEventListener('click', function(e) {
        if (!navMenu.contains(e.target) && !navToggle.contains(e.target)) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
}

function initializeLoginModal() {
    const loginBtn = document.getElementById('login-btn');
    const loginModal = document.getElementById('login-modal');
    const closeBtn = document.getElementById('close-login');
    const joinBtn = document.getElementById('join-ieee-btn');

    const openModalAction = function() {
        if (currentUser) {
            const userMenu = confirm('You are already logged in. Do you want to logout?');
            if (userMenu) {
                logout();
            }
        } else {
            loginModal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    };

    loginBtn.addEventListener('click', openModalAction);
    if (joinBtn) {
        joinBtn.addEventListener('click', openModalAction);
    }

    const closeModalAction = function() {
        loginModal.style.display = 'none';
        document.body.style.overflow = 'auto';

        document.getElementById('modal-title').textContent = 'Member Login';
        document.getElementById('register-container').style.display = 'none';
        document.getElementById('forgot-password-container').style.display = 'none';
        document.getElementById('login-container').style.display = 'block';
        document.getElementById('welcome-message').style.display = 'none';
        document.getElementById('login-form').style.display = 'block';
    };

    closeBtn.addEventListener('click', closeModalAction);

    loginModal.addEventListener('click', function(e) {
        if (e.target === loginModal) {
            closeModalAction();
        }
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && loginModal.style.display === 'flex') {
            closeModalAction();
        }
    });
}

function showSection(sectionName) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active');
    });

    const targetSection = document.getElementById(sectionName);
    if (targetSection) {
        targetSection.classList.add('active');
        currentSection = sectionName;
        updateActiveNavLink(sectionName);
        window.location.hash = sectionName;
    }
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

function loadEvents() {
    const eventsContainer = document.getElementById('events-container');
    if (!eventsContainer) return;
    eventsContainer.innerHTML = '';
    eventData.forEach(event => {
        const eventCard = document.createElement('div');
        eventCard.className = 'event-card';
        eventCard.innerHTML = `
            <div class="event-date">${event.date}</div>
            <h3>${event.title}</h3>
            <p>${event.description}</p>
            <div class="event-location">${event.location}</div>
        `;
        eventsContainer.appendChild(eventCard);
    });
}

function loadTeamMembers() {
    const teamGrid = document.getElementById('team-grid');
    if (!teamGrid) return;
    teamGrid.innerHTML = '';
    teamData.forEach(member => {
        const memberCard = document.createElement('div');
        memberCard.className = 'team-member';
        memberCard.innerHTML = `
            <div class="member-photo">${member.initials}</div>
            <div class="member-name">${member.name}</div>
            <div class="member-position">${member.position}</div>
            <div class="member-bio">${member.bio}</div>
        `;
        teamGrid.appendChild(memberCard);
    });
}

function loadPublications(filter = 'all') {
    const publicationsList = document.getElementById('publications-list');
    if (!publicationsList) return;
    publicationsList.innerHTML = '';
    const filteredPublications = filter === 'all' ?
        publicationData :
        publicationData.filter(pub => pub.category === filter);
    filteredPublications.forEach(publication => {
        const publicationItem = document.createElement('div');
        publicationItem.className = 'publication-item';
        publicationItem.innerHTML = `
            <div class="publication-title">${publication.title}</div>
            <div class="publication-authors">${publication.authors}</div>
            <div class="publication-venue">${publication.venue}</div>
            <div class="publication-year">${publication.year}</div>
        `;
        publicationsList.appendChild(publicationItem);
    });
}

function setupPublicationFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            const category = this.getAttribute('data-category');
            loadPublications(category);
        });
    });
}

function setupLoginForm() {
    const loginForm = document.getElementById('loginForm');
    if (!loginForm) return;
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const user = sampleUsers.find(u => u.email === email && u.password === password);
        if (user) {
            login(user);
        } else {
            alert('Invalid credentials. Try:\nEmail: admin@ieee.smvitm.ac.in\nPassword: admin123');
        }
    });
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
    document.getElementById('welcome-message').style.display = 'none';
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('loginForm').reset();
    document.getElementById('login-modal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

function checkLoginState() {
    const storedUser = localStorage.getItem('ieeeUser');
    if (storedUser) {
        currentUser = JSON.parse(storedUser);
        updateLoginState();
    }
}

function updateLoginState() {
    const notificationBell = document.getElementById('notification-bell');
    const userProfile = document.getElementById('user-profile');
    const userName = document.getElementById('user-name');
    const loginBtn = document.getElementById('login-btn');
    
    if (currentUser) {
        notificationBell.style.display = 'block';
        userProfile.style.display = 'block';
        userName.textContent = `Welcome, ${currentUser.name.split(' ')[0]}`;
        loginBtn.textContent = 'Logout';
        loginBtn.classList.add('logged-in');
        
        const unreadCount = notificationData.filter(n => !n.read).length;
        document.getElementById('notification-count').textContent = unreadCount;
    } else {
        notificationBell.style.display = 'none';
        userProfile.style.display = 'none';
        loginBtn.textContent = 'Login';
        loginBtn.classList.remove('logged-in');
    }
}

document.getElementById('notification-bell').addEventListener('click', function() {
    if (currentUser) {
        alert('You have ' + notificationData.filter(n => !n.read).length + ' unread notifications:\n\n' +
            notificationData.filter(n => !n.read).map(n => '• ' + n.message).join('\n'));
    }
});

window.addEventListener('hashchange', function() {
    const hash = window.location.hash.substring(1);
    if (hash && hash !== currentSection) {
        showSection(hash);
    }
});

window.addEventListener('load', function() {
    const hash = window.location.hash.substring(1);
    if (hash) {
        showSection(hash);
    }
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        if (targetId) {
            showSection(targetId);
        }
    });
});

document.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 50) {
        header.style.background = 'rgba(15, 23, 42, 0.9)';
    } else {
        header.style.background = 'rgba(15, 23, 42, 0.8)';
    }
});

function showLoadingState(container) {
    container.innerHTML = '<div style="text-align: center; padding: 2rem;">Loading...</div>';
}

function handleLoadError(container, message) {
    container.innerHTML = `<div style="text-align: center; padding: 2rem; color: var(--error);">${message}</div>`;
}

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        document.getElementById('nav-toggle').classList.remove('active');
        document.getElementById('nav-menu').classList.remove('active');
    }
});

document.querySelectorAll('.society-btn').forEach(button => {
    button.addEventListener('click', function() {
        const societyName = this.parentElement.querySelector('h3').textContent;
        alert(`More information about ${societyName} coming soon!`);
    });
});

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.event-card, .society-card, .team-member, .achievement-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});