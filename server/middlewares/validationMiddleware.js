/**
 * Validation Middleware
 * 
 * This file contains only the essential validation middlewares:
 * - validateRegistration: For user registration input validation
 * - validateLogin: For user login input validation  
 * - sanitizeInput: For sanitizing all incoming data
 * 
 * All user validation endpoints (/validate/*) have been removed.
 * User authentication validation is now centralized through /auth/me endpoint only.
 * 
 * Removed unused validators:
 * - validateProfileUpdate (profile updates handled in userController)
 * - validateEventCreation (not currently used)
 * - validateSubmission (not currently used)
 */

// Validation middleware functions
export const validateRegistration = (req, res, next) => {
    const { name, email, password, phone, studentId, year, department, institution, experience } = req.body;
    const errors = [];

    // Required field validation
    if (!name || name.trim().length < 2) {
        errors.push('Name must be at least 2 characters long');
    }

    if (!email || !isValidEmail(email)) {
        errors.push('Valid email is required');
    }

    if (!password || password.length < (parseInt(process.env.PASSWORD_MIN_LENGTH) || 6)) {
        errors.push(`Password must be at least ${parseInt(process.env.PASSWORD_MIN_LENGTH) || 6} characters long`);
    }

    if (!phone || !isValidPhone(phone)) {
        errors.push('Valid phone number is required');
    }

    if (!studentId || studentId.trim().length < 3) {
        errors.push('Student ID must be at least 3 characters long');
    }

    if (!year || !['1st Year', '2nd Year', '3rd Year', '4th Year', 'Graduate', 'Alumni'].includes(year)) {
        errors.push('Valid academic year is required');
    }

    if (!department || department.trim().length < 2) {
        errors.push('Department is required');
    }

    if (!institution || institution.trim().length < 2) {
        errors.push('Institution is required');
    }

    if (!experience || !['Beginner', 'Intermediate', 'Advanced', 'Professional'].includes(experience)) {
        errors.push('Valid experience level is required');
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors
        });
    }

    next();
};

export const validateLogin = (req, res, next) => {
    const { email, password } = req.body;
    const errors = [];

    if (!email || !isValidEmail(email)) {
        errors.push('Valid email is required');
    }

    if (!password || password.length < 1) {
        errors.push('Password is required');
    }

    if (errors.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors
        });
    }

    next();
};

// Helper validation functions
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const isValidPhone = (phone) => {
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
};

// Sanitization middleware
export const sanitizeInput = (req, res, next) => {
    const sanitizeString = (str) => {
        if (typeof str !== 'string') return str;
        return str.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    };

    const sanitizeObject = (obj) => {
        for (const key in obj) {
            if (typeof obj[key] === 'string') {
                obj[key] = sanitizeString(obj[key]);
            } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                sanitizeObject(obj[key]);
            }
        }
    };

    if (req.body) {
        sanitizeObject(req.body);
    }

    if (req.query) {
        sanitizeObject(req.query);
    }

    next();
};
