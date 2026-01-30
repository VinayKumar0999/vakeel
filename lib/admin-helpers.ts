import { createServerClient } from './supabase';

const supabase = createServerClient();

export interface PendingLawyer {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  createdAt: string;
  barCouncilNumber: string;
  barCouncilState: string;
  practiceAreas: string[];
  yearsOfExperience: string;
  education: string;
  bio: string;
  consultationFee: number;
  city: string;
  state: string;
  barCertificatePath: string | null;
  idProofPath: string | null;
  profilePhotoPath: string | null;
  agencyId: string | null;
  agencyName: string | null;
}

export interface PendingAgency {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  description: string | null;
  agencyAdminId: string | null;
  agencyAdminName: string | null;
  createdAt: string;
}

/**
 * Get all pending lawyer approvals
 */
export async function getPendingLawyers(adminUserId?: string): Promise<PendingLawyer[]> {
  let query = supabase
    .from('users')
    .select(`
      id,
      full_name,
      email,
      phone,
      created_at,
      lawyer_profiles (
        bar_council_number,
        bar_council_state,
        practice_areas,
        years_of_experience,
        education,
        bio,
        consultation_fee,
        city,
        state,
        bar_certificate_path,
        id_proof_path,
        profile_photo_path,
        agency_id,
        agencies (name)
      )
    `)
    .eq('role', 'LAWYER')
    .eq('verification_status', 'PENDING')
    .order('created_at', { ascending: false });

  // If admin is AGENCY_ADMIN, only show lawyers from their agency
  if (adminUserId) {
    const { data: adminUser } = await supabase
      .from('users')
      .select('role, agencies!agency_admin_id(id)')
      .eq('id', adminUserId)
      .single();

    if (adminUser?.role === 'AGENCY_ADMIN' && adminUser.agencies?.[0]?.id) {
      query = query.eq('lawyer_profiles.agency_id', adminUser.agencies[0].id);
    }
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Failed to fetch pending lawyers: ${error.message}`);
  }

  return (data || []).map((user: any) => ({
    id: user.id,
    fullName: user.full_name,
    email: user.email,
    phone: user.phone,
    createdAt: user.created_at,
    barCouncilNumber: user.lawyer_profiles?.[0]?.bar_council_number || '',
    barCouncilState: user.lawyer_profiles?.[0]?.bar_council_state || '',
    practiceAreas: user.lawyer_profiles?.[0]?.practice_areas || [],
    yearsOfExperience: user.lawyer_profiles?.[0]?.years_of_experience || '',
    education: user.lawyer_profiles?.[0]?.education || '',
    bio: user.lawyer_profiles?.[0]?.bio || '',
    consultationFee: parseFloat(user.lawyer_profiles?.[0]?.consultation_fee || '0'),
    city: user.lawyer_profiles?.[0]?.city || '',
    state: user.lawyer_profiles?.[0]?.state || '',
    barCertificatePath: user.lawyer_profiles?.[0]?.bar_certificate_path || null,
    idProofPath: user.lawyer_profiles?.[0]?.id_proof_path || null,
    profilePhotoPath: user.lawyer_profiles?.[0]?.profile_photo_path || null,
    agencyId: user.lawyer_profiles?.[0]?.agency_id || null,
    agencyName: user.lawyer_profiles?.[0]?.agencies?.name || null,
  }));
}

/**
 * Get all pending agency approvals
 */
export async function getPendingAgencies(): Promise<PendingAgency[]> {
  const { data, error } = await supabase
    .from('agencies')
    .select(`
      id,
      name,
      email,
      phone,
      address,
      city,
      state,
      description,
      agency_admin_id,
      users!agency_admin_id(full_name),
      created_at
    `)
    .eq('verification_status', 'PENDING')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch pending agencies: ${error.message}`);
  }

  return (data || []).map((agency: any) => ({
    id: agency.id,
    name: agency.name,
    email: agency.email,
    phone: agency.phone,
    address: agency.address,
    city: agency.city,
    state: agency.state,
    description: agency.description,
    agencyAdminId: agency.agency_admin_id,
    agencyAdminName: agency.users?.full_name || null,
    createdAt: agency.created_at,
  }));
}

/**
 * Approve or reject a lawyer
 */
export async function approveLawyer(
  lawyerId: string,
  adminId: string,
  action: 'APPROVED' | 'REJECTED',
  notes?: string
) {
  const { data, error } = await supabase
    .from('users')
    .update({
      verification_status: action,
      approved_by: adminId,
      approval_notes: notes || null,
      approved_at: action === 'APPROVED' ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', lawyerId)
    .eq('role', 'LAWYER')
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to ${action.toLowerCase()} lawyer: ${error.message}`);
  }

  return data;
}

/**
 * Approve or reject an agency
 */
export async function approveAgency(
  agencyId: string,
  adminId: string,
  action: 'APPROVED' | 'REJECTED',
  notes?: string
) {
  const { data, error } = await supabase
    .from('agencies')
    .update({
      verification_status: action,
      approved_by: adminId,
      approval_notes: notes || null,
      approved_at: action === 'APPROVED' ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', agencyId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to ${action.toLowerCase()} agency: ${error.message}`);
  }

  return data;
}

/**
 * Check if user has admin permissions
 */
export async function isAdmin(userId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('users')
    .select('role')
    .eq('id', userId)
    .single();

  if (error || !data) {
    return false;
  }

  return ['ADMIN', 'SUPER_ADMIN', 'AGENCY_ADMIN'].includes(data.role);
}

/**
 * Check if user can approve specific lawyer (agency admin can only approve their agency lawyers)
 */
export async function canApproveLawyer(adminId: string, lawyerId: string): Promise<boolean> {
  const { data: admin } = await supabase
    .from('users')
    .select('role, agencies!agency_admin_id(id)')
    .eq('id', adminId)
    .single();

  if (!admin) return false;

  // SUPER_ADMIN and ADMIN can approve anyone
  if (admin.role === 'SUPER_ADMIN' || admin.role === 'ADMIN') {
    return true;
  }

  // AGENCY_ADMIN can only approve lawyers in their agency
  if (admin.role === 'AGENCY_ADMIN') {
    const { data: lawyer } = await supabase
      .from('lawyer_profiles')
      .select('agency_id')
      .eq('user_id', lawyerId)
      .single();

    return lawyer?.agency_id === admin.agencies?.[0]?.id;
  }

  return false;
}
