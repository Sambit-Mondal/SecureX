import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import User from '../models/userModel';
import sendVerificationCode from '../utils/emailService';

export const signup = async (req: Request, res: Response) => {
    try {
        const { accountType, name, email, mobile, password } = req.body;

        // Generate a random verification code
        const verificationCode = crypto.randomBytes(3).toString('hex').toUpperCase();

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save user to database
        const user = new User({
            accountType,
            name,
            email,
            mobile,
            password: hashedPassword,
            verificationCode,
        });

        await user.save();

        // Send verification code to user's email
        await sendVerificationCode(email, verificationCode);

        res.status(201).json({ message: 'Signup successful. Please check your email for the verification code.' });
    } catch (error) {
        if (error instanceof Error) {
            if (error instanceof Error) {
                console.error(error.message);
            } else {
                console.error('An unknown error occurred');
            }
        } else {
            console.error('An unknown error occurred');
        }
        res.status(500).json({ error: 'Signup failed. Please try again later.' });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { accountType, email, uniqueCode, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email, accountType, verificationCode: uniqueCode });
        if (!user) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }

        // Generate JWT
        const token = jwt.sign(
            { userId: user._id, accountType: user.accountType },
            process.env.JWT_SECRET || 'your_jwt_secret',
            { expiresIn: '1h' }
        );

        // Send response with token
        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        if (error instanceof Error) {
            if (error instanceof Error) {
                console.error(error.message);
                res.status(500).json({ error: 'Server error' });
            } else {
                console.error('An unknown error occurred');
            }
        }
    }
};