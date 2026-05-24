import { TRPCError } from "@trpc/server";
import { logger } from "./logger";

/**
 * Allowed file types for different upload categories
 */
export const ALLOWED_FILE_TYPES = {
  // Video uploads
  video: {
    mimeTypes: ["video/mp4", "video/quicktime", "video/x-msvideo", "video/webm"],
    extensions: [".mp4", ".mov", ".avi", ".webm"],
    maxSize: 500 * 1024 * 1024, // 500MB
  },

  // Image/Face uploads
  image: {
    mimeTypes: ["image/jpeg", "image/png", "image/webp"],
    extensions: [".jpg", ".jpeg", ".png", ".webp"],
    maxSize: 50 * 1024 * 1024, // 50MB
  },

  // Audio uploads
  audio: {
    mimeTypes: ["audio/mpeg", "audio/wav", "audio/webm", "audio/ogg"],
    extensions: [".mp3", ".wav", ".webm", ".ogg"],
    maxSize: 100 * 1024 * 1024, // 100MB
  },

  // Document uploads
  document: {
    mimeTypes: ["application/pdf", "text/plain"],
    extensions: [".pdf", ".txt"],
    maxSize: 10 * 1024 * 1024, // 10MB
  },
};

/**
 * Validate file upload before processing
 */
export function validateFileUpload(
  filename: string,
  mimeType: string,
  fileSize: number,
  category: keyof typeof ALLOWED_FILE_TYPES
): { valid: boolean; error?: string } {
  const allowedTypes = ALLOWED_FILE_TYPES[category];

  // Check file size
  if (fileSize > allowedTypes.maxSize) {
    const maxMB = allowedTypes.maxSize / (1024 * 1024);
    return {
      valid: false,
      error: `File size exceeds maximum of ${maxMB}MB`,
    };
  }

  // Check MIME type
  if (!allowedTypes.mimeTypes.includes(mimeType)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed types: ${allowedTypes.mimeTypes.join(", ")}`,
    };
  }

  // Check file extension
  const fileExtension = filename.substring(filename.lastIndexOf(".")).toLowerCase();
  if (!allowedTypes.extensions.includes(fileExtension)) {
    return {
      valid: false,
      error: `Invalid file extension. Allowed: ${allowedTypes.extensions.join(", ")}`,
    };
  }

  // Check for suspicious filenames
  if (filename.includes("..") || filename.includes("/") || filename.includes("\\")) {
    return {
      valid: false,
      error: "Invalid filename format",
    };
  }

  return { valid: true };
}

/**
 * Sanitize filename to prevent directory traversal and injection attacks
 */
export function sanitizeFilename(filename: string): string {
  // Remove path separators
  let sanitized = filename.replace(/[\/\\]/g, "");

  // Remove special characters except dots and hyphens
  sanitized = sanitized.replace(/[^a-zA-Z0-9._-]/g, "_");

  // Remove multiple consecutive dots (prevent ../ attacks)
  sanitized = sanitized.replace(/\.{2,}/g, ".");

  // Limit length
  if (sanitized.length > 255) {
    const ext = sanitized.substring(sanitized.lastIndexOf("."));
    sanitized = sanitized.substring(0, 255 - ext.length) + ext;
  }

  return sanitized;
}

/**
 * Generate secure file storage path
 * Prevents directory traversal by using user ID + timestamp
 */
export function generateSecureFilePath(
  userId: number,
  category: string,
  originalFilename: string
): string {
  const timestamp = Date.now();
  const sanitized = sanitizeFilename(originalFilename);
  return `uploads/${userId}/${category}/${timestamp}_${sanitized}`;
}

/**
 * Validate virus/malware scan (placeholder for integration)
 * In production, integrate with VirusTotal, ClamAV, or similar
 */
export async function validateFileContent(
  filePath: string,
  fileBuffer: Buffer
): Promise<{ safe: boolean; reason?: string }> {
  // TODO: Integrate with antivirus service
  // For now, perform basic checks
  
  // Check for suspicious file signatures
  const suspiciousSignatures = [
    Buffer.from([0x4d, 0x5a]), // MZ (executable)
    Buffer.from([0x7f, 0x45, 0x4c, 0x46]), // ELF (executable)
    Buffer.from([0xca, 0xfe, 0xba, 0xbe]), // Mach-O (executable)
  ];

  for (const sig of suspiciousSignatures) {
    if (fileBuffer.slice(0, sig.length).equals(sig)) {
      logger.warn({ filePath }, "[Security] Suspicious file signature detected");
      return {
        safe: false,
        reason: "File appears to be an executable",
      };
    }
  }

  return { safe: true };
}

/**
 * Log file upload for audit trail
 */
export function logFileUpload(
  userId: number,
  filename: string,
  category: string,
  fileSize: number,
  mimeType: string
) {
  logger.info({
    userId,
    filename,
    category,
    fileSize,
    mimeType,
  }, "[Audit] File uploaded");
}
