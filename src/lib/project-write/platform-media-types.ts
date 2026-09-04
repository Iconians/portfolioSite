/** Platform admin media mutation types (verified M6 contract). */

export type PlatformMediaRole = "hero" | "og" | "gallery" | "thumbnail";

export interface PlatformMediaPresignRequest {
  filename: string;
  mime_type: string;
  size_bytes: number;
  role: PlatformMediaRole;
  audience?: string;
}

export interface PlatformMediaPresignResponse {
  media_id: string;
  storage_key: string;
  upload_url: string;
  upload_headers: Record<string, string>;
  public_url: string;
  expires_in: number;
}

export interface PlatformMediaRegisterRequest {
  storage_key: string;
  alt_text?: string | null;
  caption?: string | null;
  width?: number | null;
  height?: number | null;
  sort_order?: number | null;
}

export interface PlatformMediaUpdateRequest {
  alt_text?: string | null;
  caption?: string | null;
  sort_order?: number | null;
  audience?: string | null;
}

export interface PlatformAdminMediaRecord {
  id: string;
  case_study_id: string;
  storage_key: string;
  public_url: string;
  role: PlatformMediaRole;
  audience: string;
  alt_text?: string | null;
  caption?: string | null;
  mime_type?: string | null;
  size_bytes?: number | null;
  width?: number | null;
  height?: number | null;
  sort_order: number;
  upload_status: string;
  created_at?: string | null;
}

/** Browser-safe presign payload — no bearer token or internal secrets. */
export interface PlatformMediaPresignClientPayload {
  uploadUrl: string;
  uploadHeaders: Record<string, string>;
  storageKey: string;
  publicUrl: string;
  expiresIn: number;
}
