import { Request, Response } from 'express';
import { db } from '../database';
import { v4 as uuidv4 } from 'uuid';

export const initiateCall = async (req: Request, res: Response) => {
  try {
    const { receiver_id, group_id } = req.body;
    const caller_id = req.user.id;

    // Check if receiver exists
    const receiver = await db('users').where('id', receiver_id).first();
    if (!receiver) {
      return res.status(404).json({ error: 'Receiver not found' });
    }

    // If group_id is provided, verify both users are members
    if (group_id) {
      const callerMembership = await db('group_members')
        .where({ group_id, user_id: caller_id })
        .first();
      const receiverMembership = await db('group_members')
        .where({ group_id, user_id: receiver_id })
        .first();

      if (!callerMembership || !receiverMembership) {
        return res.status(403).json({ error: 'Both users must be group members' });
      }
    }

    const [call] = await db('call_sessions')
      .insert({
        id: uuidv4(),
        caller_id,
        receiver_id,
        group_id,
        started_at: db.fn.now(),
      })
      .returning('*');

    res.status(201).json(call);
  } catch (error) {
    console.error('Error initiating call:', error);
    res.status(500).json({ error: 'Failed to initiate call' });
  }
};

export const acceptCall = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const receiver_id = req.user.id;

    const call = await db('call_sessions')
      .where({ id, receiver_id })
      .first();

    if (!call) {
      return res.status(404).json({ error: 'Call not found' });
    }

    if (call.ended_at) {
      return res.status(400).json({ error: 'Call has already ended' });
    }

    res.json(call);
  } catch (error) {
    console.error('Error accepting call:', error);
    res.status(500).json({ error: 'Failed to accept call' });
  }
};

export const endCall = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user_id = req.user.id;

    const call = await db('call_sessions')
      .where('id', id)
      .where(function() {
        this.where('caller_id', user_id)
          .orWhere('receiver_id', user_id);
      })
      .first();

    if (!call) {
      return res.status(404).json({ error: 'Call not found' });
    }

    if (call.ended_at) {
      return res.status(400).json({ error: 'Call has already ended' });
    }

    const ended_at = db.fn.now();
    const duration = db.raw('EXTRACT(EPOCH FROM (? - started_at))', [ended_at]);

    const [updatedCall] = await db('call_sessions')
      .where('id', id)
      .update({
        ended_at,
        duration,
      })
      .returning('*');

    res.json(updatedCall);
  } catch (error) {
    console.error('Error ending call:', error);
    res.status(500).json({ error: 'Failed to end call' });
  }
};

export const submitFeedback = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { quality_rating, feedback } = req.body;
    const user_id = req.user.id;

    const call = await db('call_sessions')
      .where('id', id)
      .where(function() {
        this.where('caller_id', user_id)
          .orWhere('receiver_id', user_id);
      })
      .first();

    if (!call) {
      return res.status(404).json({ error: 'Call not found' });
    }

    if (!call.ended_at) {
      return res.status(400).json({ error: 'Call has not ended yet' });
    }

    const [updatedCall] = await db('call_sessions')
      .where('id', id)
      .update({
        quality_rating,
        feedback,
      })
      .returning('*');

    res.json(updatedCall);
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
}; 