/**
 * VK Backend Database Helper
 * This file contains database helpers for the migrated VK backend endpoints
 * It works with the advocates, clients, sessions, calls, and payments tables
 */

import { createServerClient } from './supabase';
import bcrypt from 'bcryptjs';

const supabase = createServerClient();

// =====================================
// TYPES & INTERFACES
// =====================================

export interface Advocate {
  id: number;
  email: string;
  google_id?: string | null;
  password: string;
  name: string;
  availability: string;
  uuid: string;
  location?: string;
  profile_image?: string;
  bio?: string;
  earnings: number;
  hourly_rate: number;
  created_at: string;
  updated_at: string;
}

export interface Client {
  id: number;
  email: string;
  google_id?: string | null;
  password: string;
  name: string;
  uuid: string;
  profile_image?: string;
  balance: number;
  created_at: string;
  updated_at: string;
}

export interface Session {
  id: number;
  user_id: number;
  user_type: 'advocate' | 'client';
  token: string;
  expires_at: string;
  created_at: string;
}

export interface Call {
  id: number;
  caller_id: number;
  caller_type: 'advocate' | 'client';
  receiver_id: number;
  receiver_type: 'advocate' | 'client';
  status: string;
  duration: number;
  charge_amount?: number;
  payment_id?: number;
  scheduled_at?: string;
  started_at?: string;
  ended_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: number;
  client_id: number;
  advocate_id: number;
  amount: number;
  status: string;
  transaction_id: string;
  payment_gateway: string;
  advocate_commission: number;
  platform_fee: number;
  created_at: string;
  updated_at: string;
}

// =====================================
// PASSWORD UTILITIES
// =====================================

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// =====================================
// ADVOCATE FUNCTIONS
// =====================================

export async function createAdvocate(data: {
  email: string;
  password: string;
  name: string;
}) {
  // Check if email exists
  const existing = await getAdvocateByEmail(data.email);
  if (existing) {
    throw new Error('Email already registered');
  }

  const passwordHash = await hashPassword(data.password);

  const { data: advocate, error } = await supabase
    .from('advocates')
    .insert({
      email: data.email,
      password: passwordHash,
      name: data.name,
      availability: 'available',
      earnings: 0,
      hourly_rate: 0,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create advocate: ${error.message}`);
  }

  return advocate;
}

export async function getAdvocateByEmail(email: string): Promise<Advocate | null> {
  const { data, error } = await supabase
    .from('advocates')
    .select('*')
    .eq('email', email)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}

export async function getAdvocateById(id: number): Promise<Advocate | null> {
  const { data, error } = await supabase
    .from('advocates')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}

export async function updateAdvocateAvailability(id: number, availability: string) {
  const { data, error } = await supabase
    .from('advocates')
    .update({ availability, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update availability: ${error.message}`);
  }

  return data;
}

export async function updateAdvocateProfileImage(id: number, profileImage: string) {
  const { data, error } = await supabase
    .from('advocates')
    .update({ profile_image: profileImage, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update profile image: ${error.message}`);
  }

  return data;
}

export async function getAvailableAdvocates(filter?: {
  availability?: string;
  location?: string;
  minRate?: number;
  maxRate?: number;
}) {
  let query = supabase.from('advocates').select('*');

  if (filter?.availability && filter.availability !== 'all') {
    query = query.eq('availability', filter.availability);
  }

  if (filter?.location) {
    query = query.eq('location', filter.location);
  }

  if (filter?.minRate) {
    query = query.gte('hourly_rate', filter.minRate);
  }

  if (filter?.maxRate) {
    query = query.lte('hourly_rate', filter.maxRate);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch advocates: ${error.message}`);
  }

  return data || [];
}

export async function getAdvocateEarnings(id: number) {
  const advocate = await getAdvocateById(id);
  if (!advocate) {
    throw new Error('Advocate not found');
  }

  return {
    earnings: advocate.earnings,
    hourly_rate: advocate.hourly_rate,
  };
}

// =====================================
// CLIENT FUNCTIONS
// =====================================

export async function createClient(data: {
  email: string;
  password: string;
  name: string;
}) {
  // Check if email exists
  const existing = await getClientByEmail(data.email);
  if (existing) {
    throw new Error('Email already registered');
  }

  const passwordHash = await hashPassword(data.password);

  const { data: client, error } = await supabase
    .from('clients')
    .insert({
      email: data.email,
      password: passwordHash,
      name: data.name,
      balance: 0,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create client: ${error.message}`);
  }

  return client;
}

export async function getClientByEmail(email: string): Promise<Client | null> {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('email', email)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}

export async function getClientById(id: number): Promise<Client | null> {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}

export async function updateClientProfileImage(id: number, profileImage: string) {
  const { data, error } = await supabase
    .from('clients')
    .update({ profile_image: profileImage, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update profile image: ${error.message}`);
  }

  return data;
}

// =====================================
// SESSION FUNCTIONS
// =====================================

export async function createSession(userId: number, userType: 'advocate' | 'client') {
  // Generate a random token
  const token = `${userType}_${userId}_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  
  // Set expiration to 24 hours from now
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 24);

  const { data, error } = await supabase
    .from('sessions')
    .insert({
      user_id: userId,
      user_type: userType,
      token,
      expires_at: expiresAt.toISOString(),
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create session: ${error.message}`);
  }

  return data;
}

export async function getSessionByToken(token: string): Promise<Session | null> {
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('token', token)
    .single();

  if (error || !data) {
    return null;
  }

  // Check if session is expired
  if (new Date(data.expires_at) < new Date()) {
    return null;
  }

  return data;
}

export async function deleteSession(token: string) {
  const { error } = await supabase
    .from('sessions')
    .delete()
    .eq('token', token);

  if (error) {
    throw new Error(`Failed to delete session: ${error.message}`);
  }
}

// =====================================
// CALL FUNCTIONS
// =====================================

export async function createCall(data: {
  caller_id: number;
  caller_type: 'advocate' | 'client';
  receiver_id: number;
  receiver_type: 'advocate' | 'client';
}) {
  const { data: call, error } = await supabase
    .from('calls')
    .insert({
      caller_id: data.caller_id,
      caller_type: data.caller_type,
      receiver_id: data.receiver_id,
      receiver_type: data.receiver_type,
      status: 'initiated',
      duration: 0,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create call: ${error.message}`);
  }

  return call;
}

export async function getCallById(id: number): Promise<Call | null> {
  const { data, error } = await supabase
    .from('calls')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}

export async function acceptCall(callId: number, userId: number) {
  const call = await getCallById(callId);
  if (!call) {
    throw new Error('Call not found');
  }

  if (call.receiver_id !== userId) {
    throw new Error('Only the receiver can accept this call');
  }

  if (call.status !== 'initiated') {
    throw new Error('Call cannot be accepted in current status');
  }

  const { data, error } = await supabase
    .from('calls')
    .update({
      status: 'accepted',
      started_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', callId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to accept call: ${error.message}`);
  }

  return data;
}

export async function endCall(callId: number, userId: number) {
  const call = await getCallById(callId);
  if (!call) {
    throw new Error('Call not found');
  }

  if (call.caller_id !== userId && call.receiver_id !== userId) {
    throw new Error('You are not a participant in this call');
  }

  const now = new Date();
  const startedAt = call.started_at ? new Date(call.started_at) : now;
  const duration = Math.floor((now.getTime() - startedAt.getTime()) / 1000);

  const { data, error } = await supabase
    .from('calls')
    .update({
      status: 'ended',
      ended_at: now.toISOString(),
      duration,
      updated_at: now.toISOString(),
    })
    .eq('id', callId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to end call: ${error.message}`);
  }

  return data;
}

// =====================================
// PAYMENT FUNCTIONS
// =====================================

export async function createPayment(data: {
  client_id: number;
  advocate_id: number;
  amount: number;
  payment_gateway: string;
}) {
  const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  const platformCommission = 0.2; // 20% platform fee
  const platformFee = data.amount * platformCommission;
  const advocateCommission = data.amount - platformFee;

  const { data: payment, error } = await supabase
    .from('payments')
    .insert({
      client_id: data.client_id,
      advocate_id: data.advocate_id,
      amount: data.amount,
      status: 'pending',
      transaction_id: transactionId,
      payment_gateway: data.payment_gateway,
      advocate_commission: advocateCommission,
      platform_fee: platformFee,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create payment: ${error.message}`);
  }

  return payment;
}

export async function getPaymentByTransactionId(transactionId: string): Promise<Payment | null> {
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('transaction_id', transactionId)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}

export async function verifyPayment(transactionId: string) {
  const payment = await getPaymentByTransactionId(transactionId);
  if (!payment) {
    throw new Error('Payment not found');
  }

  // In a real implementation, you would verify with the payment gateway here
  // For now, we'll just mark it as completed
  const { data, error } = await supabase
    .from('payments')
    .update({
      status: 'completed',
      updated_at: new Date().toISOString(),
    })
    .eq('transaction_id', transactionId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to verify payment: ${error.message}`);
  }

  // Update advocate earnings
  await supabase.rpc('increment_advocate_earnings', {
    advocate_id: payment.advocate_id,
    amount: payment.advocate_commission,
  });

  return data;
}
