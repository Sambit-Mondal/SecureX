import express from 'express';
import { signup, login } from '../controllers/authController';
import rateLimiter from '../utils/rateLimiter';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', rateLimiter, login);

export default router;