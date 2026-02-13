import { createServerClient } from './supabase';
// @ts-ignore - bcryptjs doesn't have perfect TypeScript support
import bcrypt from 'bcryptjs';

const supabase = createServerClient();

export interface CreateUserData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  role: 'CLIENT' | 'LAWYER' | 'ADMIN';
}

export interface CreateLawyerProfileData {
  userId: string;
  barCouncilNumber: string;
  barCouncilState: string;
  practiceAreas: string[];
  yearsOfExperience: string;
  education: string;
  languages: string[];
  bio: string;
  consultationFee: number;
  specializations: string[];
  officeAddress: string;
  city: string;
  state: string;
  pincode: string;
  barCertificatePath?: string;
  idProofPath?: string;
  profilePhotoPath?: string;
}

/**
 * Hash password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

/**
 * Verify password
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Check if email already exists
 */
export async function emailExists(email: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .single();

  return !!data && !error;
}

/**
 * Check if phone already exists
 */
export async function phoneExists(phone: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('users')
    .select('id')
    .eq('phone', phone)
    .single();

  return !!data && !error;
}

/**
 * Create a new user
 */
export async function createUser(userData: CreateUserData) {
  const { fullName, email, phone, password, role } = userData;

  // Check if email or phone already exists
  if (await emailExists(email)) {
    throw new Error('User already registered');
  }

  if (await phoneExists(phone)) {
    throw new Error('Phone number already registered');
  }

  // Hash password
  const passwordHash = await hashPassword(password);

  // Auto-approve all users for now. Set to 'PENDING' for lawyers to enable admin approval flow.
  const verificationStatus = role === 'LAWYER' ? 'APPROVED' : null;

  // Insert user
  const { data, error } = await supabase
    .from('users')
    .insert({
      full_name: fullName,
      email,
      phone,
      password_hash: passwordHash,
      role,
      verification_status: verificationStatus,
    })
    .select()
    .single();

  if (error) {
    const raw = error.message || error.code || String(error);
    // Supabase can return HTML (e.g. Cloudflare 521) when project is paused or down
    if (
      typeof raw === "string" &&
      (raw.includes("521") ||
        raw.includes("Web server is down") ||
        raw.includes("<!DOCTYPE html>"))
    ) {
      throw new Error(
        "Supabase is unavailable (server down or project paused). Open Supabase Dashboard → your project → Settings and resume the project if it is paused."
      );
    }
    throw new Error(`Failed to create user: ${raw}`);
  }

  return data;
}

/**
 * Create lawyer profile
 */
export async function createLawyerProfile(profileData: CreateLawyerProfileData) {
  const { data, error } = await supabase
    .from('lawyer_profiles')
    .insert({
      user_id: profileData.userId,
      bar_council_number: profileData.barCouncilNumber,
      bar_council_state: profileData.barCouncilState,
      practice_areas: profileData.practiceAreas,
      years_of_experience: profileData.yearsOfExperience,
      education: profileData.education,
      languages: profileData.languages,
      bio: profileData.bio,
      consultation_fee: profileData.consultationFee,
      specializations: profileData.specializations,
      office_address: profileData.officeAddress,
      city: profileData.city,
      state: profileData.state,
      pincode: profileData.pincode,
      bar_certificate_path: profileData.barCertificatePath,
      id_proof_path: profileData.idProofPath,
      profile_photo_path: profileData.profilePhotoPath,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create lawyer profile: ${error.message}`);
  }

  return data;
}

/**
 * Get user by email
 */
export async function getUserByEmail(email: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (error) {
    return null;
  }

  return data;
}

/**
 * Get user by ID
 */
export async function getUserById(id: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    return null;
  }

  return data;
}

/**
 * Get lawyer profile by user ID
 */
export async function getLawyerProfileByUserId(userId: string) {
  const { data, error } = await supabase
    .from('lawyer_profiles')
    .select('*, users(*)')
    .eq('user_id', userId)
    .single();

  if (error) {
    return null;
  }

  return data;
}

/**
 * Get all approved lawyers
 */
export async function getApprovedLawyers(filters?: {
  city?: string;
  state?: string;
  practiceArea?: string;
}) {
  let query = supabase
    .from('lawyer_profiles')
    .select('*, users!inner(*)')
    .eq('users.verification_status', 'APPROVED');

  if (filters?.city) {
    query = query.eq('city', filters.city);
  }

  if (filters?.state) {
    query = query.eq('state', filters.state);
  }

  if (filters?.practiceArea) {
    query = query.contains('practice_areas', [filters.practiceArea]);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch lawyers: ${error.message}`);
  }

  return data;
}
