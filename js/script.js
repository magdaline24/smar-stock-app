// ===== SMART STOCK - Complete JavaScript =====

console.log("📦 Smart Stock is loaded!");

// ============================================
// ===== ROLE-BASED ACCESS CONTROL =====
// ============================================

const rolePermissions = {
    'Admin': {
        menu: ['dashboard', 'inventory', 'receive-stock', 'issue-stock', 'stock-count', 'reports', 'suppliers', 'users', 'settings'],
    },
    'Manager': {
        menu: ['dashboard', 'inventory', 'reports', 'users'],
    },
    'Stock Controller': {
        menu: ['inventory', 'stock-count', 'reports'],
    },
    'Storekeeper': {
        menu: ['receive-stock', 'issue-stock'],
    },
    'Department User': {
        menu: ['receive-stock', 'issue-stock'],
    }
};

function getCurrentUserRole() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (user && user.role) {
        return user.role;
    }
    return 'Admin';
}

function applyRoleBasedAccess() {
    const role = getCurrentUserRole();
    const permissions = rolePermissions[role] || rolePermissions['Storekeeper'];
    const allowedMenus = permissions.menu;
    
    console.log(`👤 Current Role: ${role}`);
    console.log(`📋 Allowed Menus:`, allowedMenus);
    
    const menuItems = document.querySelectorAll('.sidebar-nav .nav-item');
    menuItems.forEach(item => {
        const href = item.getAttribute('href');
        if (!href) return;
        
        let pageName = href.replace('.html', '').replace('./', '');
        if (pageName === 'dashboard') {
            item.style.display = 'flex';
            return;
        }
        
        const user = JSON.parse(localStorage.getItem('currentUser'));
        if (!user) {
            item.style.display = 'flex';
            return;
        }
        
        if (allowedMenus.includes(pageName)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

// ============================================
// ===== WAIT FOR PAGE TO LOAD =====
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    console.log("✅ Page ready!");
    
    // ============================================
    // GET ALL ELEMENTS
    // ============================================
    
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const forgotForm = document.getElementById('forgotForm');
    const verifyForm = document.getElementById('verifyForm');
    const newPasswordForm = document.getElementById('newPasswordForm');
    
    const showSignup = document.getElementById('showSignup');
    const showLogin = document.getElementById('showLogin');
    const forgotLink = document.querySelector('.forgot-password');
    const backToLoginFromForgot = document.getElementById('backToLoginFromForgot');
    const backToForgot = document.getElementById('backToForgot');
    const backToVerify = document.getElementById('backToVerify');
    
    let resetEmail = '';
    
    // ============================================
    // SHOW/HIDE FORMS
    // ============================================
    
    if (showSignup) {
        showSignup.addEventListener('click', function(e) {
            e.preventDefault();
            loginForm.style.display = 'none';
            signupForm.style.display = 'block';
            forgotForm.style.display = 'none';
            verifyForm.style.display = 'none';
            newPasswordForm.style.display = 'none';
        });
    }
    
    if (showLogin) {
        showLogin.addEventListener('click', function(e) {
            e.preventDefault();
            signupForm.style.display = 'none';
            loginForm.style.display = 'block';
            forgotForm.style.display = 'none';
            verifyForm.style.display = 'none';
            newPasswordForm.style.display = 'none';
        });
    }
    
    if (forgotLink) {
        forgotLink.addEventListener('click', function(e) {
            e.preventDefault();
            loginForm.style.display = 'none';
            signupForm.style.display = 'none';
            forgotForm.style.display = 'block';
            verifyForm.style.display = 'none';
            newPasswordForm.style.display = 'none';
        });
    }
    
    if (backToLoginFromForgot) {
        backToLoginFromForgot.addEventListener('click', function(e) {
            e.preventDefault();
            forgotForm.style.display = 'none';
            loginForm.style.display = 'block';
        });
    }
    
    if (backToForgot) {
        backToForgot.addEventListener('click', function(e) {
            e.preventDefault();
            verifyForm.style.display = 'none';
            forgotForm.style.display = 'block';
        });
    }
    
    if (backToVerify) {
        backToVerify.addEventListener('click', function(e) {
            e.preventDefault();
            newPasswordForm.style.display = 'none';
            verifyForm.style.display = 'block';
        });
    }
    
    // ============================================
    // LOGIN
    // ============================================
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            if (email === '' || password === '') {
                alert('❌ Please fill in all fields');
                return;
            }
            
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const foundUser = users.find(u => u.email === email);
            let role = 'Storekeeper';
            if (foundUser) {
                role = foundUser.role;
            }
            
            localStorage.setItem('currentUser', JSON.stringify({
                email: email,
                role: role
            }));
            
            alert('✅ Login successful!\nWelcome back, ' + email + '\n👤 Role: ' + role);
            window.location.href = 'dashboard.html';
        });
    }
    
    // ============================================
    // SIGNUP
    // ============================================
    
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const fullname = document.getElementById('fullname').value;
            const email = document.getElementById('signupEmail').value;
            const password = document.getElementById('signupPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const role = document.getElementById('role').value;
            
            if (fullname === '' || email === '' || password === '' || confirmPassword === '') {
                alert('❌ Please fill in all fields');
                return;
            }
            
            if (password !== confirmPassword) {
                alert('❌ Passwords do not match!');
                return;
            }
            
            if (password.length < 6) {
                alert('❌ Password must be at least 6 characters long');
                return;
            }
            
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            users.push({
                name: fullname,
                email: email,
                role: role
            });
            localStorage.setItem('users', JSON.stringify(users));
            
            alert('✅ Account created successfully!\n' +
                  'Name: ' + fullname + '\n' +
                  'Role: ' + role + '\n' +
                  'Email: ' + email);
            
            signupForm.style.display = 'none';
            loginForm.style.display = 'block';
            signupForm.reset();
        });
    }
    
    // ============================================
    // FORGOT PASSWORD
    // ============================================
    
    if (forgotForm) {
        forgotForm.addEventListener('submit', function(e) {
            e.preventDefault();
            resetEmail = document.getElementById('resetEmail').value;
            
            if (resetEmail === '') {
                alert('❌ Please enter your email address');
                return;
            }
            
            const verificationCode = Math.floor(100000 + Math.random() * 900000);
            alert('✅ Verification code sent to ' + resetEmail + '\n\n📱 Your code is: ' + verificationCode);
            
            forgotForm.style.display = 'none';
            verifyForm.style.display = 'block';
        });
    }
    
    // ============================================
    // VERIFY CODE
    // ============================================
    
    if (verifyForm) {
        verifyForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const code = document.getElementById('verificationCode').value;
            
            if (code === '' || code.length < 6) {
                alert('❌ Please enter the 6-digit verification code');
                return;
            }
            
            if (code.length === 6 && !isNaN(code)) {
                alert('✅ Code verified! Now create your new password.');
                verifyForm.style.display = 'none';
                newPasswordForm.style.display = 'block';
            } else {
                alert('❌ Invalid code. Please enter the 6-digit code.');
            }
        });
    }
    
    // ============================================
    // NEW PASSWORD
    // ============================================
    
    if (newPasswordForm) {
        newPasswordForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const newPassword = document.getElementById('newPassword').value;
            const confirmNewPassword = document.getElementById('confirmNewPassword').value;
            
            if (newPassword === '' || confirmNewPassword === '') {
                alert('❌ Please fill in all fields');
                return;
            }
            
            if (newPassword.length < 6) {
                alert('❌ Password must be at least 6 characters long');
                return;
            }
            
            if (newPassword !== confirmNewPassword) {
                alert('❌ Passwords do not match!');
                return;
            }
            
            alert('✅ Password updated successfully!\n\nYou can now login with your new password.');
            
            newPasswordForm.style.display = 'none';
            loginForm.style.display = 'block';
            forgotForm.reset();
            verifyForm.reset();
            newPasswordForm.reset();
        });
    }
    
    // ============================================
    // APPLY ROLE ACCESS ON DASHBOARD
    // ============================================
    
    if (document.querySelector('.dashboard-container')) {
        applyRoleBasedAccess();
    }

    // ============================================
    // ===== DASHBOARD: USER PROFILE CLICK =====
    // ============================================
    
    const userProfile = document.querySelector('.user-profile');
    if (userProfile) {
        userProfile.addEventListener('click', function() {
            window.location.href = 'profile.html';
        });
    }

    // ============================================
    // ===== DASHBOARD: NOTIFICATION BELL =====
    // ============================================
    
    const notifBtn = document.querySelector('.btn-notification');
    if (notifBtn) {
        notifBtn.addEventListener('click', function() {
            alert('🔔 You have 3 notifications:\n\n1. 🔴 Rice stock is below 10 units\n2. 🟡 5 medicine items expire in 7 days\n3. 🔵 Mary requested 20 boxes of gloves');
        });
    }

    // ============================================
    // ===== DASHBOARD: ALERT ITEMS =====
    // ============================================
    
    const alertItems = document.querySelectorAll('.alert-item');
    alertItems.forEach(item => {
        item.addEventListener('click', function() {
            const title = this.querySelector('strong')?.textContent || 'Alert';
            const desc = this.querySelector('.alert-desc')?.textContent || '';
            alert('🔔 ' + title + '\n\n' + desc + '\n\n(Click to view details - coming soon!)');
        });
    });

    // ============================================
    // ===== DASHBOARD: STAT CARDS =====
    // ============================================
    
    const statCards = document.querySelectorAll('.stat-card');
    statCards.forEach(card => {
        card.addEventListener('click', function() {
            const title = this.querySelector('.stat-info h3')?.textContent || 'Stat';
            const number = this.querySelector('.stat-number')?.textContent || '0';
            alert('📊 ' + title + '\n\nCurrent Value: ' + number + '\n\n(View detailed report - coming soon!)');
        });
    });

    // ============================================
    // ===== DASHBOARD: RECENT TRANSACTIONS =====
    // ============================================
    
    const transactionRows = document.querySelectorAll('.transaction-table tbody tr');
    transactionRows.forEach(row => {
        row.addEventListener('click', function() {
            const cells = this.querySelectorAll('td');
            if (cells.length >= 3) {
                const date = cells[0]?.textContent || 'N/A';
                const item = cells[1]?.textContent || 'N/A';
                const action = cells[2]?.textContent || 'N/A';
                alert('📋 Transaction Details:\n\n📅 Date: ' + date + '\n📦 Item: ' + item + '\n📌 Action: ' + action + '\n\n(Full details coming soon!)');
            }
        });
    });

    // ============================================
    // ===== DASHBOARD: ACTIVITY ITEMS =====
    // ============================================
    
    const activityItems = document.querySelectorAll('.activity-item');
    activityItems.forEach(item => {
        item.addEventListener('click', function() {
            const text = this.querySelector('.activity-detail p')?.textContent || 'Activity';
            const time = this.querySelector('.activity-time')?.textContent || '';
            alert('📅 Activity Details:\n\n' + text + '\n🕐 ' + time + '\n\n(Full details coming soon!)');
        });
    });

    // ============================================
    // ===== DASHBOARD: VIEW ALL LINKS =====
    // ============================================
    
    const viewAllLinks = document.querySelectorAll('.view-all');
    viewAllLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            alert('📋 Viewing all transactions...\n\n(This feature is coming soon!)');
        });
    });

    // ============================================
    // ===== UPDATE CHARTS =====
    // ============================================
    
    function updateCharts() {
        const items = JSON.parse(localStorage.getItem('inventoryItems') || '[]');
        
        const categories = {};
        items.forEach(item => {
            const cat = item.category || 'Uncategorized';
            categories[cat] = (categories[cat] || 0) + 1;
        });
        
        const colors = {
            'Food': '#667eea',
            'Medicine': '#764ba2',
            'Stationery': '#f59e0b',
            'Cleaning': '#22c55e',
            'Electronics': '#ef4444',
            'Furniture': '#3b82f6',
            'Uncategorized': '#888'
        };
        
        const total = Object.values(categories).reduce((a, b) => a + b, 0);
        const pieVisual = document.getElementById('pieVisual');
        const pieLegend = document.getElementById('pieLegend');
        
        if (pieVisual) {
            if (total === 0) {
                pieVisual.style.background = '#e0e0e0';
                pieVisual.innerHTML = '<span style="font-size:0.8rem;color:#888;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);">No Data</span>';
            } else {
                let gradient = '';
                let startAngle = 0;
                const entries = Object.entries(categories);
                entries.forEach(([cat, count]) => {
                    const percentage = (count / total) * 100;
                    const color = colors[cat] || '#888';
                    gradient += color + ' ' + startAngle + '% ' + (startAngle + percentage) + '%, ';
                    startAngle += percentage;
                });
                gradient = gradient.slice(0, -2);
                
                pieVisual.style.background = 'conic-gradient(' + gradient + ')';
                pieVisual.innerHTML = '<span style="font-size:0.7rem;color:white;position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-weight:bold;">' + total + '</span>';
            }
        }
        
        if (pieLegend) {
            if (total === 0) {
                pieLegend.innerHTML = '<div style="color:#888;font-size:0.8rem;">Add items to see chart</div>';
            } else {
                pieLegend.innerHTML = Object.entries(categories).map(function([cat, count]) {
                    var percentage = ((count / total) * 100).toFixed(1);
                    var color = colors[cat] || '#888';
                    return '<div><span style="background:' + color + ';"></span> ' + cat + ' ' + percentage + '%</div>';
                }).join('');
            }
        }
    }

    setTimeout(updateCharts, 500);

    // ============================================
    // ===== DARK MODE =====
    // ============================================
    
    function applyDarkModeToDashboard() {
        var saved = JSON.parse(localStorage.getItem('settings'));
        if (saved && saved.darkMode) {
            document.querySelectorAll('.stat-card, .card, .chart-card, .alerts-card').forEach(function(el) {
                if (!el.closest('.sidebar')) {
                    el.style.background = '#1a1a2e';
                    el.style.color = '#e0e0e0';
                }
            });
        }
    }
    
    setTimeout(applyDarkModeToDashboard, 300);

    console.log("🚀 Smart Stock fully loaded!");
});