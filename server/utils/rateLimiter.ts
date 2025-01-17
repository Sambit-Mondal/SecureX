import rateLimit from 'express-rate-limit';

const rateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 requests per windowMs
    message: 'Too many login attempts from this IP, please try again later',
});

export default rateLimiter;