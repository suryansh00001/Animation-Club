// Simple rate limiting middleware
const rateLimitStore = new Map();

// Clean up old entries every 15 minutes
setInterval(() => {
    const now = Date.now();
    for (const [key, data] of rateLimitStore.entries()) {
        if (now - data.resetTime > 0) {
            rateLimitStore.delete(key);
        }
    }
}, 15 * 60 * 1000);

export const rateLimit = (options = {}) => {
    const {
        windowMs = 1 * 60 * 1000, // 1 minutes
        maxRequests = 100, // Maximum requests per window
        keyGenerator = (req) => req.ip || req.connection.remoteAddress,
        skipSuccessfulRequests = false,
        skipFailedRequests = false,
        message = 'Too many requests, please try again later.'
    } = options;

    return (req, res, next) => {
        const key = keyGenerator(req);
        const now = Date.now();
        
        if (!rateLimitStore.has(key)) {
            rateLimitStore.set(key, {
                count: 1,
                resetTime: now + windowMs
            });
            return next();
        }

        const data = rateLimitStore.get(key);
        
        // Reset if window has expired
        if (now > data.resetTime) {
            data.count = 1;
            data.resetTime = now + windowMs;
            return next();
        }

        // Check if limit exceeded
        if (data.count >= maxRequests) {
            return res.status(429).json({
                success: false,
                message,
                retryAfter: Math.ceil((data.resetTime - now) / 1000)
            });
        }

        // Increment counter
        data.count++;
        next();
    };
};

// Specific rate limiters for different endpoints
export const authRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 200, // 200 auth attempts per 15 minutes (increased for development)
    message: 'Too many authentication attempts, please try again later.'
});

export const apiRateLimit = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    maxRequests: 300, // 300 API calls per minute (increased for development with multiple API calls)
    message: 'API rate limit exceeded, please try again later.'
});

export const uploadRateLimit = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 50, // 50 uploads per hour (increased for development)
    message: 'Upload rate limit exceeded, please try again later.'
});

// Brute force protection for specific users
const bruteForceStore = new Map();

export const bruteForceProtection = (options = {}) => {
    const {
        maxAttempts = 5,
        blockDuration = 30 * 60 * 1000, // 30 minutes
        keyGenerator = (req) => req.body.email || req.ip
    } = options;

    return (req, res, next) => {
        const key = keyGenerator(req);
        const now = Date.now();
        
        if (!bruteForceStore.has(key)) {
            bruteForceStore.set(key, {
                attempts: 0,
                blockedUntil: 0
            });
        }

        const data = bruteForceStore.get(key);
        
        // Check if currently blocked
        if (data.blockedUntil > now) {
            return res.status(429).json({
                success: false,
                message: 'Account temporarily blocked due to too many failed attempts.',
                retryAfter: Math.ceil((data.blockedUntil - now) / 1000)
            });
        }

        // Reset if block period has expired
        if (data.blockedUntil > 0 && data.blockedUntil <= now) {
            data.attempts = 0;
            data.blockedUntil = 0;
        }

        // Add method to track failed attempt
        req.recordFailedAttempt = () => {
            data.attempts++;
            if (data.attempts >= maxAttempts) {
                data.blockedUntil = now + blockDuration;
            }
        };

        // Add method to reset attempts on successful login
        req.resetFailedAttempts = () => {
            data.attempts = 0;
            data.blockedUntil = 0;
        };

        next();
    };
};
