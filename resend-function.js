// ============================================
// RESEND EMAIL FUNCTIONS
// ============================================

// ===== CONFIGURATION =====
const RESEND_CONFIG = {
    apiKey: 're_EeHLkNcN...
    fromEmail: 'onboarding@resend.dev',  // Default Resend email - WORKS WITHOUT DNS!
};

// ============================================
// SEND EMAIL FUNCTION
// ============================================

async function sendResendEmail(to, subject, htmlContent) {
    try {
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
        
        if (response.ok) {
            console.log('✅ Email sent:', data.id);
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
    const subject = `Welcome to SmartStock!`;
    const html = `
        <h2>🎉 Welcome to SmartStock!</h2>
        <p>Hello <strong>${userName}</strong>,</p>
        <p>Your account has been created successfully!</p>
        <p><strong>Your login email:</strong> ${userEmail}</p>
        <p><strong>Your role:</strong> ${userRole}</p>
        <a href="https://smartstock-system.netlify.app" style="background:#667eea;color:white;padding:12px 30px;border-radius:8px;text-decoration:none;">Login to SmartStock</a>
        <br><br><p>SmartStock Team</p>
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
        <a href="https://smartstock-system.netlify.app/inventory.html" style="background:#667eea;color:white;padding:12px 30px;border-radius:8px;text-decoration:none;">View Inventory →</a>
        <br><br><p>SmartStock Team</p>
    `;
    return sendResendEmail(recipients, subject, html);
}

// ============================================
// PASSWORD RESET
// ============================================
async function sendPasswordResetEmail(userEmail, userName, resetCode) {
    const subject = `🔐 Password Reset Request`;
    const html = `
        <h2>🔐 Password Reset Request</h2>
        <p>Hello <strong>${userName}</strong>,</p>
        <p>You requested to reset your password.</p>
        <p><strong>Reset Code:</strong> ${resetCode}</p>
        <p><strong>Expires:</strong> ${new Date(Date.now() + 600000).toLocaleString()}</p>
        <p>Enter this code in the app to reset your password.</p>
        <p><strong>⚠️ Security Warning:</strong> If you didn't request this, please ignore this email.</p>
        <br><br><p>SmartStock Team</p>
    `;
    return sendResendEmail([userEmail], subject, html);
}

// ============================================
// STOCK RECEIVED
// ============================================
async function sendStockReceivedEmail(recipients, supplier, product, quantity, receivedBy, deliveryNote) {
    const subject = `📥 Stock Received - ${product}`;
    const html = `
        <h2>📥 Stock Received</h2>
        <p><strong>Supplier:</strong> ${supplier}</p>
        <p><strong>Product:</strong> ${product}</p>
        <p><strong>Quantity:</strong> ${quantity}</p>
        <p><strong>Received By:</strong> ${receivedBy}</p>
        <p><strong>Delivery Note:</strong> ${deliveryNote || 'N/A'}</p>
        <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
        <a href="https://smartstock-system.netlify.app/inventory.html" style="background:#667eea;color:white;padding:12px 30px;border-radius:8px;text-decoration:none;">View Inventory →</a>
        <br><br><p>SmartStock Team</p>
    `;
    return sendResendEmail(recipients, subject, html);
}

// ============================================
// STOCK ISSUED
// ============================================
async function sendStockIssuedEmail(recipients, product, quantity, department, requestedBy, issuedBy) {
    const subject = `📤 Stock Issued - ${product}`;
    const html = `
        <h2>📤 Stock Issued</h2>
        <p><strong>Product:</strong> ${product}</p>
        <p><strong>Quantity:</strong> ${quantity}</p>
        <p><strong>Department:</strong> ${department}</p>
        <p><strong>Requested By:</strong> ${requestedBy}</p>
        <p><strong>Issued By:</strong> ${issuedBy}</p>
        <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
        <a href="https://smartstock-system.netlify.app/inventory.html" style="background:#667eea;color:white;padding:12px 30px;border-radius:8px;text-decoration:none;">View Inventory →</a>
        <br><br><p>SmartStock Team</p>
    `;
    return sendResendEmail(recipients, subject, html);
}

// ============================================
// STOCK COUNT COMPLETED
// ============================================
async function sendStockCountEmail(recipients, item, expected, actual, variance, countedBy) {
    const subject = `📋 Stock Count Completed - ${item}`;
    const html = `
        <h2>📋 Stock Count Completed</h2>
        <p><strong>Item:</strong> ${item}</p>
        <p><strong>Expected Quantity:</strong> ${expected}</p>
        <p><strong>Actual Quantity:</strong> ${actual}</p>
        <p><strong>Variance:</strong> ${variance}</p>
        <p><strong>Counted By:</strong> ${countedBy}</p>
        <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
        <a href="https://smartstock-system.netlify.app/stock-count.html" style="background:#667eea;color:white;padding:12px 30px;border-radius:8px;text-decoration:none;">View Stock Count →</a>
        <br><br><p>SmartStock Team</p>
    `;
    return sendResendEmail(recipients, subject, html);
}

console.log("✅ Resend email functions loaded!");