// ============================================
// RESEND EMAIL FUNCTIONS
// ============================================

// ===== CONFIGURATION - REPLACE WITH YOUR API KEY! =====
const RESEND_CONFIG = {
    apiKey: 're_EeHlLkNCnL',
    fromEmail: 'noreply@smartstock-system.netlify.app',  // ← YOUR DOMAIN!
};

// ============================================
// SEND EMAIL FUNCTION
// ============================================

async function sendResendEmail(to, subject, htmlContent) {
    try {
        console.log('📧 Attempting to send email to:', to);
        
        const response = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${RESEND_CONFIG.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: RESEND_CONFIG.fromEmail,
                to: to,
                subject: subject,
                html: htmlContent
            })
        });

        const data = await response.json();
        
        console.log('📧 Response status:', response.status);
        console.log('📧 Response data:', data);
        
        if (response.ok) {
            console.log('✅ Email sent! ID:', data.id);
            return { success: true, id: data.id };
        } else {
            console.error('❌ Email error:', data);
            return { success: false, error: data };
        }
    } catch (error) {
        console.error('❌ Send error:', error);
        return { success: false, error: error };
    }
}

// ============================================
// WELCOME EMAIL
// ============================================

async function sendWelcomeEmail(userName, userEmail, userRole) {
    console.log('📧 Sending welcome email to:', userEmail);
    
    const subject = `Welcome to SmartStock!`;
    const html = `
        <h2>🎉 Welcome to SmartStock!</h2>
        
        <p>Hello <strong>${userName}</strong>,</p>
        
        <p>Your account has been created successfully!</p>
        
        <p><strong>Your login email:</strong> ${userEmail}</p>
        <p><strong>Your role:</strong> ${userRole}</p>
        
        <p>Click the button below to log in:</p>
        
        <a href="https://smartstock-system.netlify.app" style="background:#667eea;color:white;padding:12px 30px;border-radius:8px;text-decoration:none;">Login to SmartStock</a>
        
        <br><br>
        <p>Thank you,<br><strong>SmartStock Team</strong></p>
    `;
    
    return sendResendEmail([userEmail], subject, html);
}

// ============================================
// LOW STOCK ALERT
// ============================================

async function sendLowStockAlert(recipients, productName, sku, currentQty, reorderLevel, location) {
    const subject = `⚠️ Low Stock Alert - ${productName}`;
    const html = `
        <h2>⚠️ LOW STOCK ALERT</h2>
        
        <p><strong>Product:</strong> ${productName}</p>
        <p><strong>SKU:</strong> ${sku || 'N/A'}</p>
        <p><strong>Current Quantity:</strong> ${currentQty}</p>
        <p><strong>Reorder Level:</strong> ${reorderLevel || 10}</p>
        <p><strong>Location:</strong> ${location || 'Main Store'}</p>
        <p><strong>Date/Time:</strong> ${new Date().toLocaleString()}</p>
        
        <br>
        <p><strong>Action Required:</strong> Please review and initiate replenishment.</p>
        
        <a href="https://smartstock-system.netlify.app/inventory.html" style="background:#667eea;color:white;padding:12px 30px;border-radius:8px;text-decoration:none;">View Inventory →</a>
        
        <br><br>
        <p>SmartStock Team</p>
    `;
    return sendResendEmail(recipients, subject, html);
}

// ============================================
// PASSWORD RESET
// ============================================

async function sendPasswordResetEmail(userEmail, userName, resetCode) {
    const subject = `🔐 Password Reset Request`;
    const expiryTime = new Date();
    expiryTime.setMinutes(expiryTime.getMinutes() + 10);
    
    const html = `
        <h2>🔐 Password Reset Request</h2>
        
        <p>Hello <strong>${userName}</strong>,</p>
        
        <p>You requested to reset your password.</p>
        
        <p><strong>Reset Code:</strong> ${resetCode}</p>
        <p><strong>Expires:</strong> ${expiryTime.toLocaleString()}</p>
        
        <p>Enter this code in the app to reset your password.</p>
        
        <br>
        <p><strong>⚠️ Security Warning:</strong> If you didn't request this, please ignore this email.</p>
        
        <br><br>
        <p>SmartStock Team</p>
    `;
    return sendResendEmail([userEmail], subject, html);
}

console.log('✅ Resend email functions loaded!');