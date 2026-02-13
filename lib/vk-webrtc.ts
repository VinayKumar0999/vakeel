/**
 * VK WebRTC Service
 * Handles WebRTC token generation and ICE server configuration
 */

import jwt from 'jsonwebtoken';
import { getCallById } from './vk-db';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here-change-in-production';

export interface ICEServer {
  urls: string | string[];
  username?: string;
  credential?: string;
}

/**
 * Generate a WebRTC token for a call
 */
export async function generateWebRTCToken(callId: number, userId: number): Promise<string> {
  // Get call details to verify user is a participant
  const call = await getCallById(callId);
  
  if (!call) {
    throw new Error('Call not found');
  }

  // Verify user is a participant in this call
  if (call.caller_id !== userId && call.receiver_id !== userId) {
    throw new Error('You are not a participant in this call');
  }

  // Generate JWT token with call and user information
  const token = jwt.sign(
    {
      call_id: callId,
      user_id: userId,
      caller_id: call.caller_id,
      receiver_id: call.receiver_id,
      iat: Math.floor(Date.now() / 1000),
    },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  return token;
}

/**
 * Get ICE servers configuration for WebRTC
 */
export function getICEServers(): ICEServer[] {
  const turnServer = process.env.TURN_SERVER || 'turn:your-turn.com';
  const turnUsername = process.env.TURN_USERNAME || 'user';
  const turnPassword = process.env.TURN_PASSWORD || 'pass';

  return [
    // Public STUN servers
    {
      urls: ['stun:stun.l.google.com:19302', 'stun:stun1.l.google.com:19302'],
    },
    // TURN server (if configured)
    {
      urls: turnServer,
      username: turnUsername,
      credential: turnPassword,
    },
  ];
}

/**
 * Verify a WebRTC token
 */
export function verifyWebRTCToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}
