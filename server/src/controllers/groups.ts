import { Request, Response } from 'express';
import { db } from '../database';
import { v4 as uuidv4 } from 'uuid';

export const createGroup = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;
    const community_head_id = req.user.id;

    const [group] = await db('groups')
      .insert({
        id: uuidv4(),
        name,
        description,
        community_head_id,
      })
      .returning('*');

    // Add the community head as a member with 'admin' role
    await db('group_members').insert({
      id: uuidv4(),
      group_id: group.id,
      user_id: community_head_id,
      role: 'admin',
    });

    res.status(201).json(group);
  } catch (error) {
    console.error('Error creating group:', error);
    res.status(500).json({ error: 'Failed to create group' });
  }
};

export const getGroups = async (req: Request, res: Response) => {
  try {
    const groups = await db('groups')
      .select('*')
      .orderBy('created_at', 'desc');

    res.json(groups);
  } catch (error) {
    console.error('Error fetching groups:', error);
    res.status(500).json({ error: 'Failed to fetch groups' });
  }
};

export const getGroupById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const group = await db('groups')
      .where('id', id)
      .first();

    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    res.json(group);
  } catch (error) {
    console.error('Error fetching group:', error);
    res.status(500).json({ error: 'Failed to fetch group' });
  }
};

export const updateGroup = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const [group] = await db('groups')
      .where('id', id)
      .update({
        name,
        description,
        updated_at: db.fn.now(),
      })
      .returning('*');

    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    res.json(group);
  } catch (error) {
    console.error('Error updating group:', error);
    res.status(500).json({ error: 'Failed to update group' });
  }
};

export const addGroupMember = async (req: Request, res: Response) => {
  try {
    const { groupId } = req.params;
    const { userId, role = 'member' } = req.body;

    // Check if group exists
    const group = await db('groups').where('id', groupId).first();
    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    // Check if user exists
    const user = await db('users').where('id', userId).first();
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if user is already a member
    const existingMember = await db('group_members')
      .where({ group_id: groupId, user_id: userId })
      .first();

    if (existingMember) {
      return res.status(400).json({ error: 'User is already a member of this group' });
    }

    const [member] = await db('group_members')
      .insert({
        id: uuidv4(),
        group_id: groupId,
        user_id: userId,
        role,
      })
      .returning('*');

    res.status(201).json(member);
  } catch (error) {
    console.error('Error adding group member:', error);
    res.status(500).json({ error: 'Failed to add group member' });
  }
};

export const removeGroupMember = async (req: Request, res: Response) => {
  try {
    const { groupId, userId } = req.params;

    const result = await db('group_members')
      .where({ group_id: groupId, user_id: userId })
      .delete();

    if (!result) {
      return res.status(404).json({ error: 'Group member not found' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error removing group member:', error);
    res.status(500).json({ error: 'Failed to remove group member' });
  }
}; 