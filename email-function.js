// ============================================
// EMAILJS - COMPLETE EMAIL FUNCTIONS
// ============================================

// ===== CONFIGURATION =====
const EMAIL_CONFIG = {
    serviceId: 'service_qgairzm',
    welcomeTemplateId: 'template_5b49syf',
    reportTemplateId: 'template_sotuau3'
};

// ===== SEND EMAIL FUNCTION =====
async function sendEmail(templateId, templateParams) {
    try {
        const response = await emailjs.send(
            EMAIL_CONFIG.serviceId,
            templateId,
            templateParams
        );
        console.log('📧 Email sent successfully!');
        return { success: true, response: response };
    } catch (error) {
        console.error('❌ Email error:', error);
        return { success: false, error: error };
    }
}

// ===== WELCOME EMAIL =====
async function sendWelcomeEmailJS(userName, userEmail, userRole) {
    const templateParams = {
        userName: userName,
        userEmail: userEmail,
        userRole: userRole,
        loginLink: 'https://smartstock-system.netlify.app'
    };
    return sendEmail(EMAIL_CONFIG.welcomeTemplateId, templateParams);
}

// ===== REPORT EMAIL =====
async function sendReportEmail(recipientEmail, reportType, generatedBy, reportSummary, reportLink) {
    const templateParams = {
        recipientEmail: recipientEmail,
        reportType: reportType || 'Inventory Report',
        generatedBy: generatedBy || 'System',
        generatedDate: new Date().toLocaleString(),
        companyName: 'SmartStock',
        reportSummary: reportSummary || 'Inventory report generated.',
        reportLink: reportLink || 'https://smartstock-system.netlify.app/reports-dashboard.html'
    };
    return sendEmail(EMAIL_CONFIG.reportTemplateId, templateParams);
}

// ===== LOW STOCK ALERT =====
async function sendLowStockAlertEmail(recipientEmail, productName, sku, currentQty, reorderLevel, location) {
    const templateParams = {
        userName: 'Alert Recipient',
        userEmail: recipientEmail,
        userRole: 'Manager',
        loginLink: 'https://smartstock-system.netlify.app/inventory.html'
    };
    return sendEmail(EMAIL_CONFIG.welcomeTemplateId, templateParams);
}

// ===== EXPIRING ALERT =====
async function sendExpiringAlertEmail(recipientEmail, productName, batchNumber, expiryDate, quantity, location) {
    const templateParams = {
        userName: 'Alert Recipient',
        userEmail: recipientEmail,
        userRole: 'Manager',
        loginLink: 'https://smartstock-system.netlify.app/inventory.html'
    };
    return sendEmail(EMAIL_CONFIG.welcomeTemplateId, templateParams);
}

// ===== STOCK RECEIVED =====
async function sendStockReceivedEmail(recipientEmail, supplier, product, quantity, receivedBy, deliveryNote) {
    const templateParams = {
        userName: 'Stock Alert',
        userEmail: recipientEmail,
        userRole: 'Manager',
        loginLink: 'https://smartstock-system.netlify.app/inventory.html'
    };
    return sendEmail(EMAIL_CONFIG.welcomeTemplateId, templateParams);
}

// ===== STOCK ISSUED =====
async function sendStockIssuedEmail(recipientEmail, product, quantity, department, requestedBy, issuedBy) {
    const templateParams = {
        userName: 'Stock Alert',
        userEmail: recipientEmail,
        userRole: 'Department User',
        loginLink: 'https://smartstock-system.netlify.app/inventory.html'
    };
    return sendEmail(EMAIL_CONFIG.welcomeTemplateId, templateParams);
}

// ===== STOCK COUNT =====
async function sendStockCountEmail(recipientEmail, item, expected, actual, variance, countedBy) {
    const templateParams = {
        userName: 'Stock Alert',
        userEmail: recipientEmail,
        userRole: 'Stock Controller',
        loginLink: 'https://smartstock-system.netlify.app/stock-count.html'
    };
    return sendEmail(EMAIL_CONFIG.welcomeTemplateId, templateParams);
}
// ============================================
// EXPORT FUNCTIONS GLOBALLY
// ============================================

// Make functions available in console and other scripts
window.sendWelcomeEmailJS = sendWelcomeEmailJS;
window.sendReportEmail = sendReportEmail;
window.sendLowStockAlertEmail = sendLowStockAlertEmail;
window.sendExpiringAlertEmail = sendExpiringAlertEmail;
window.sendStockReceivedEmail = sendStockReceivedEmail;
window.sendStockIssuedEmail = sendStockIssuedEmail;
window.sendStockCountEmail = sendStockCountEmail;
window.sendEmail = sendEmail;

console.log('✅ Email functions are now globally available!');
