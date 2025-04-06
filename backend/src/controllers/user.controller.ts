import { Request, Response, NextFunction } from 'express';
import { userService } from '../services/UserService';
import { hashPassword } from "../utils/PasswordUtils";

/**
 * Create a new user with email, username, and password.
 */
export const createUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email, username, and password are required' });
    }

    const user = await userService.createUser(email, password);
    return res.status(201).json({ message: 'User created successfully', user });
  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(500).json({ error: 'Error creating user' });
  }
};

export const getUserById = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const user = await userService.findById(parseInt(id));

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error('Error retrieving user:', error);
    return res.status(500).json({ error: 'Error retrieving user' });
  }
};

export const getAllUsers = async (_req: Request, res: Response): Promise<Response> => {
  try {
    const users = await userService.findAll();
    return res.status(200).json(users);
  } catch (error) {
    console.error('Error retrieving users:', error);
    return res.status(500).json({ error: 'Error retrieving users' });
  }
};

export const updateUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const { email, username } = req.body;

    const updatedUser = await userService.update(parseInt(id), { email, username });

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({ message: 'User updated successfully', updatedUser });
  } catch (error) {
    console.error('Error updating user:', error);
    return res.status(500).json({ error: 'Error updating user' });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const deleted = await userService.delete(parseInt(id));

    if (!deleted) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).json({ error: 'Error deleting user' });
  }
};
