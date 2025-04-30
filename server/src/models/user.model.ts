import { query } from '../config/database';
import bcrypt from 'bcryptjs';

export interface User {
  id: string;
  email: string;
  phone_number?: string;
  full_name: string;
  profile_picture_url?: string;
  created_at: Date;
  updated_at: Date;
}

export const createUser = async (user: Omit<User, 'id' | 'created_at' | 'updated_at'>, password: string): Promise<User> => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await query(
    `INSERT INTO users (email, phone_number, full_name, profile_picture_url, password)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, email, phone_number, full_name, profile_picture_url, created_at, updated_at`,
    [user.email, user.phone_number, user.full_name, user.profile_picture_url, hashedPassword]
  );
  return result.rows[0];
};

export const getUserByEmail = async (email: string): Promise<User & { password: string } | null> => {
  const result = await query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );
  return result.rows[0] || null;
};

export const getUserById = async (id: string): Promise<User | null> => {
  const result = await query(
    'SELECT id, email, phone_number, full_name, profile_picture_url, created_at, updated_at FROM users WHERE id = $1',
    [id]
  );
  return result.rows[0] || null;
};

export const updateUser = async (id: string, updates: Partial<User>): Promise<User | null> => {
  const fields = Object.keys(updates).map((key, index) => `${key} = $${index + 2}`);
  const values = Object.values(updates);
  
  const result = await query(
    `UPDATE users SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
     WHERE id = $1
     RETURNING id, email, phone_number, full_name, profile_picture_url, created_at, updated_at`,
    [id, ...values]
  );
  return result.rows[0] || null;
};

export const verifyPassword = async (email: string, password: string): Promise<boolean> => {
  const user = await getUserByEmail(email);
  if (!user) return false;
  return bcrypt.compare(password, user.password);
}; 