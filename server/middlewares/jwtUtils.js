import jwt from 'jsonwebtoken';

// Generate JWT token
export const generateToken = (userId, role = 'student') => {
    return jwt.sign(
        { 
            userId, 
            role,
            timestamp: Date.now()
        },
        process.env.JWT_SECRET,
        { 
            expiresIn: `${parseInt(process.env.SESSION_TIMEOUT) || 30}m` // Token expires based on session timeout (default 30 minutes)
        }
    );
};

// Generate refresh token (longer expiration)
export const generateRefreshToken = (userId) => {
    return jwt.sign(
        { 
            userId,
            type: 'refresh',
            timestamp: Date.now()
        },
        process.env.JWT_SECRET,
        { 
            expiresIn: '30d' // Refresh token expires in 30 days
        }
    );
};

// Verify JWT token
export const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        throw error;
    }
};

// Set token as HTTP-only cookie
export const setTokenCookie = (res, token, refreshToken = null) => {
    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days in milliseconds
    };

    res.cookie('token', token, cookieOptions);

    if (refreshToken) {
        res.cookie('refreshToken', refreshToken, {
            ...cookieOptions,
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days for refresh token
        });
    }
};

// Clear authentication cookies
export const clearTokenCookies = (res) => {
    res.clearCookie('token');
    res.clearCookie('refreshToken');
};

// Extract token from request
export const extractToken = (req) => {
    // Try to get token from cookies first, then from Authorization header
    return req.cookies.token || 
           (req.headers.authorization && req.headers.authorization.split(' ')[1]);
};

// Generate admin token (with admin role)
export const generateAdminToken = (userId) => {
    return generateToken(userId, 'admin');
};

// Validate token strength
export const validateTokenStrength = (token) => {
    try {
        const decoded = verifyToken(token);
        
        // Check if token is not too old (security measure)
        const tokenAge = Date.now() - decoded.timestamp;
        const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
        
        if (tokenAge > maxAge) {
            throw new Error('Token is too old');
        }
        
        return decoded;
    } catch (error) {
        throw error;
    }
};
