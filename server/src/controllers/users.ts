import { Request, Response } from 'express';
import { db } from '../database';

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const user = await db('users')
      .where('id', req.user.id)
      .select('id', 'email', 'full_name', 'profile_picture_url')
      .first();

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching current user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { full_name, profile_picture_url } = req.body;

    const [user] = await db('users')
      .where('id', req.user.id)
      .update({
        full_name,
        profile_picture_url,
        updated_at: db.fn.now(),
      })
      .returning(['id', 'email', 'full_name', 'profile_picture_url']);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const user = await db('users')
      .where('id', id)
      .select('id', 'email', 'full_name', 'profile_picture_url')
      .first();

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
}; 