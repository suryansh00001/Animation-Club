import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { generateToken, generateRefreshToken, setTokenCookie, clearTokenCookies } from '../middlewares/jwtUtils.js';

// User Registration
export const registerUser = async (req, res) => {
    try {
        const { name, email, password, phone, studentId, year, department, institution, experience } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [
                { email: email.toLowerCase() },
                ...(studentId && studentId.trim() ? [{ studentId: studentId.trim() }] : [])
            ]
        });

        if (existingUser) {
            if (req.recordFailedAttempt) req.recordFailedAttempt();
            
            return res.status(400).json({
                success: false,
                message: existingUser.email === email.toLowerCase() 
                    ? 'User with this email already exists' 
                    : 'User with this student ID already exists'
            });
        }

        // Hash password
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create new user
        const newUser = new User({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password: hashedPassword,
            phone: phone ? phone.trim() : '',
            studentId: studentId ? studentId.trim() : `TEMP_${Date.now()}`,
            year: year || '1st Year',
            department: department ? department.trim() : '',
            institution: institution ? institution.trim() : '',
            experience: experience || 'Beginner',
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=7c3aed&color=fff&size=200`,
            role: 'student'
        });

        await newUser.save();

        // Generate tokens
        const token = generateToken(newUser._id, newUser.role);
        const refreshToken = generateRefreshToken(newUser._id);

        // Set cookies
        setTokenCookie(res, token, refreshToken);

        // Update last login
        newUser.lastLoginAt = new Date();
        await newUser.save();

        // Reset failed attempts on successful registration
        if (req.resetFailedAttempts) req.resetFailedAttempts();

        // Remove password from response
        const userResponse = newUser.toJSON();

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: userResponse,
            token // Also send in response for frontend flexibility
        });

    } catch (error) {
        console.error('Registration error:', error);
        
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            return res.status(400).json({
                success: false,
                message: `${field === 'email' ? 'Email' : 'Student ID'} already exists`
            });
        }

        res.status(500).json({
            success: false,
            message: 'Registration failed',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

// User Login
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email: email.toLowerCase().trim() });

        if (!user) {
            if (req.recordFailedAttempt) req.recordFailedAttempt();
            
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Check if account is active
        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Account is inactive. Please contact administrator.'
            });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            if (req.recordFailedAttempt) req.recordFailedAttempt();
            
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Generate tokens
        const token = generateToken(user._id, user.role);
        const refreshToken = generateRefreshToken(user._id);

        // Set cookies
        setTokenCookie(res, token, refreshToken);

        // Update last login
        user.lastLoginAt = new Date();
        await user.save();

        // Reset failed attempts on successful login
        if (req.resetFailedAttempts) req.resetFailedAttempts();

        // Remove password from response
        const userResponse = user.toJSON();

        res.status(200).json({
            success: true,
            message: 'Login successful',
            user: userResponse,
            token // Also send in response for frontend flexibility
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Login failed',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

// User Logout
export const logoutUser = async (req, res) => {
    try {
        // Clear authentication cookies
        clearTokenCookies(res);

        res.status(200).json({
            success: true,
            message: 'Logout successful'
        });

    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
            success: false,
            message: 'Logout failed',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

// Get Current User Profile
export const getCurrentUser = async (req, res) => {
    try {
        // User is already attached to req by authenticateToken middleware
        const user = await User.findById(req.user._id).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            user
        });

    } catch (error) {
        console.error('Get current user error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to get user profile',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};

// Refresh Token
export const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({
                success: false,
                message: 'Refresh token required'
            });
        }

        // Verify refresh token
        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
        
        if (decoded.type !== 'refresh') {
            return res.status(401).json({
                success: false,
                message: 'Invalid refresh token'
            });
        }

        // Find user
        const user = await User.findById(decoded.userId);

        if (!user || !user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'User not found or inactive'
            });
        }

        // Generate new tokens
        const newToken = generateToken(user._id, user.role);
        const newRefreshToken = generateRefreshToken(user._id);

        // Set new cookies
        setTokenCookie(res, newToken, newRefreshToken);

        res.status(200).json({
            success: true,
            message: 'Token refreshed successfully',
            token: newToken
        });

    } catch (error) {
        console.error('Refresh token error:', error);
        
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid or expired refresh token'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Token refresh failed',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
        });
    }
};
