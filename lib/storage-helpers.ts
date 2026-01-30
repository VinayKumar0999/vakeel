import { createServerClient } from './supabase';

const supabase = createServerClient();

/** Supabase Storage bucket for lawyer documents (Bar Certificate, ID Proof, Profile Photo). Create this bucket in Supabase Dashboard → Storage if you get "Bucket not found". */
export const LAWYER_DOCUMENTS_BUCKET = 'lawyer-documents';

/**
 * Upload file to Supabase Storage
 */
export async function uploadFile(
  bucket: string,
  path: string,
  file: File | Blob,
  options?: {
    contentType?: string;
    upsert?: boolean;
  }
) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      contentType: options?.contentType || file.type,
      upsert: options?.upsert || false,
    });

  if (error) {
    const message = error.message?.toLowerCase().includes('bucket')
      ? `${error.message} Create the bucket "${bucket}" in Supabase Dashboard → Storage. See SUPABASE_STORAGE_SETUP.md.`
      : `Failed to upload file: ${error.message}`;
    throw new Error(message);
  }

  return data;
}

/**
 * Get public URL for a file
 */
export function getPublicUrl(bucket: string, path: string): string {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

/**
 * Upload lawyer documents
 */
export async function uploadLawyerDocuments(
  userId: string,
  documents: {
    barCertificate?: File;
    idProof?: File;
    profilePhoto?: File;
  }
) {
  const timestamp = Date.now();
  const uploadedPaths: {
    barCertificatePath?: string;
    idProofPath?: string;
    profilePhotoPath?: string;
  } = {};

  // Upload Bar Certificate
  if (documents.barCertificate) {
    const barCertPath = `bar-certificates/${userId}-${timestamp}-${documents.barCertificate.name}`;
    await uploadFile(LAWYER_DOCUMENTS_BUCKET, barCertPath, documents.barCertificate);
    uploadedPaths.barCertificatePath = getPublicUrl(LAWYER_DOCUMENTS_BUCKET, barCertPath);
  }

  // Upload ID Proof
  if (documents.idProof) {
    const idProofPath = `id-proofs/${userId}-${timestamp}-${documents.idProof.name}`;
    await uploadFile(LAWYER_DOCUMENTS_BUCKET, idProofPath, documents.idProof);
    uploadedPaths.idProofPath = getPublicUrl(LAWYER_DOCUMENTS_BUCKET, idProofPath);
  }

  // Upload Profile Photo
  if (documents.profilePhoto) {
    const profilePhotoPath = `profile-photos/${userId}-${timestamp}-${documents.profilePhoto.name}`;
    await uploadFile(LAWYER_DOCUMENTS_BUCKET, profilePhotoPath, documents.profilePhoto);
    uploadedPaths.profilePhotoPath = getPublicUrl(LAWYER_DOCUMENTS_BUCKET, profilePhotoPath);
  }

  return uploadedPaths;
}

/**
 * Delete file from storage
 */
export async function deleteFile(bucket: string, path: string) {
  const { error } = await supabase.storage.from(bucket).remove([path]);

  if (error) {
    throw new Error(`Failed to delete file: ${error.message}`);
  }
}
