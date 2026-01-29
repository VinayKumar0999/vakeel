import { createServerClient } from './supabase';

const supabase = createServerClient();

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
    throw new Error(`Failed to upload file: ${error.message}`);
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
    await uploadFile('lawyer-documents', barCertPath, documents.barCertificate);
    uploadedPaths.barCertificatePath = getPublicUrl('lawyer-documents', barCertPath);
  }

  // Upload ID Proof
  if (documents.idProof) {
    const idProofPath = `id-proofs/${userId}-${timestamp}-${documents.idProof.name}`;
    await uploadFile('lawyer-documents', idProofPath, documents.idProof);
    uploadedPaths.idProofPath = getPublicUrl('lawyer-documents', idProofPath);
  }

  // Upload Profile Photo
  if (documents.profilePhoto) {
    const profilePhotoPath = `profile-photos/${userId}-${timestamp}-${documents.profilePhoto.name}`;
    await uploadFile('lawyer-documents', profilePhotoPath, documents.profilePhoto);
    uploadedPaths.profilePhotoPath = getPublicUrl('lawyer-documents', profilePhotoPath);
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
