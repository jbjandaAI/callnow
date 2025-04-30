import { Request, Response } from 'express';
import { db } from '../database';
import jwt from 'jsonwebtoken';
import config from '../config';
import bcrypt from 'bcrypt';

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, full_name } = req.body;

    // Check if user already exists
    const existingUser = await db('users').where('email', email).first();
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const [user] = await db('users')
      .insert({
        email,
        password: hashedPassword,
        full_name,
      })
      .returning(['id', 'email', 'full_name']);

    // Generate tokens
    const accessToken = jwt.sign(
      { id: user.id, email: user.email, full_name: user.full_name },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    res.status(201).json({ user, accessToken });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await db('users').where('email', email).first();
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate tokens
    const accessToken = jwt.sign(
      { id: user.id, email: user.email, full_name: user.full_name },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    res.json({ user: { id: user.id, email: user.email, full_name: user.full_name }, accessToken });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(401).json({ error: 'Refresh token required' });
    }

    const payload = jwt.verify(refreshToken, config.jwt.secret) as {
      id: string;
      email: string;
      full_name: string;
    };

    const accessToken = jwt.sign(
      { id: payload.id, email: payload.email, full_name: payload.full_name },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    res.json({ accessToken });
  } catch (error) {
    console.error('Error refreshing token:', error);
    res.status(401).json({ error: 'Invalid refresh token' });
  }
};

export const logout = async (req: Request, res: Response) => {
  res.json({ message: 'Logged out successfully' });
}; 