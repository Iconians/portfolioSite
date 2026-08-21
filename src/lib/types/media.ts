import { z } from "zod";
import {
  MEDIA_OBJECT_DOMAINS,
  PORTFOLIO_MEDIA_OBJECT_TYPES,
} from "@/lib/media/object-keys";
import { MEDIA_MAX_BYTES } from "@/lib/media/validate-upload";

const MediaObjectKeySchema = z.object({
  domain: z.enum(MEDIA_OBJECT_DOMAINS).optional(),
  type: z.enum(PORTFOLIO_MEDIA_OBJECT_TYPES).optional(),
});

export const PresignMediaSchema = z
  .object({
    filename: z.string().min(1).max(255),
    mimeType: z.string().min(1),
    sizeBytes: z.number().int().positive().max(MEDIA_MAX_BYTES),
  })
  .merge(MediaObjectKeySchema);

export const CompleteMediaUploadSchema = z.object({
  storageKey: z.string().min(1),
  filename: z.string().min(1).max(255),
  mimeType: z.string().min(1),
  sizeBytes: z.number().int().positive().max(MEDIA_MAX_BYTES),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
});

export type PresignMediaInput = z.infer<typeof PresignMediaSchema>;
export type CompleteMediaUploadInput = z.infer<typeof CompleteMediaUploadSchema>;

export interface MediaAsset {
  id: string;
  filename: string;
  storageKey: string;
  publicUrl: string;
  mimeType: string;
  sizeBytes: number;
  width: number | null;
  height: number | null;
  altText: string | null;
  caption: string | null;
  storageProvider: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface CreateMediaAssetInput {
  filename: string;
  storageKey: string;
  publicUrl: string;
  mimeType: string;
  sizeBytes: number;
  width?: number | null;
  height?: number | null;
  storageProvider: string;
  createdBy: string;
}

export const UpdateMediaMetadataSchema = z.object({
  altText: z.string().max(500).nullable(),
  caption: z.string().max(2000).nullable(),
});

export type UpdateMediaMetadataInput = z.infer<typeof UpdateMediaMetadataSchema>;
