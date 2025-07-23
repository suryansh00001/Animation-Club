import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Middleware to verify JWT token
export const authenticateToken = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access token required'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select('-password');
        
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found'
            });
        }

        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Account is inactive'
            });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid token'
            });
        }
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expired'
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Authentication failed'
        });
    }
};

// Middleware to verify admin role
export const requireAdmin = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Admin access required'
            });
        }

        next();
    } catch (error) {
        console.error('Admin middleware error:', error);
        return res.status(500).json({
            success: false,
            message: 'Authorization failed'
        });
    }
};

// Middleware to verify admin or manager role (for event management)
export const requireAdminOrManager = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }
        if (!['admin', 'manager'].includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Admin or Manager access required'
            });
        }
        next();
    } catch (error) {
        console.error('AdminOrManager middleware error:', error);
        return res.status(500).json({
            success: false,
            message: 'Authorization failed'
        });
    }
};

// Middleware to verify user role (student or admin)
export const requireUser = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        if (!['student', 'admin','manager'].includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'User access required'
            });
        }

        next();
    } catch (error) {
        console.error('User middleware error:', error);
        return res.status(500).json({
            success: false,
            message: 'Authorization failed'
        });
    }
};

// Optional authentication - doesn't fail if no token
export const optionalAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');
        
        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.userId).select('-password');
            
            if (user && user.isActive) {
                req.user = user;
            }
        }
        
        next();
    } catch (error) {
        // Continue without authentication if token is invalid
        next();
    }
};

// Middleware to check if user owns the resource
export const checkOwnership = (resourceIdField = 'userId') => {
    return async (req, res, next) => {
        try {
            if (!req.user) {
                return res.status(401).json({
                    success: false,
                    message: 'Authentication required'
                });
            }

            // Admin can access any resource
            if (req.user.role === 'admin') {
                return next();
            }

            // Get resource ID from request params or body
            const resourceUserId = req.params.userId || req.body[resourceIdField] || req.params.id;
            
            if (!resourceUserId) {
                return res.status(400).json({
                    success: false,
                    message: 'Resource ID required'
                });
            }

            // Check if user owns the resource
            if (req.user._id.toString() !== resourceUserId.toString()) {
                return res.status(403).json({
                    success: false,
                    message: 'Access denied: You can only access your own resources'
                });
            }

            next();
        } catch (error) {
            console.error('Ownership middleware error:', error);
            return res.status(500).json({
                success: false,
                message: 'Authorization failed'
            });
        }
    };
};
