import { execSync } from 'child_process';

/**
 * Google Drive integration for Big Starz
 * - Fetch Sora videos from Google Drive
 * - Save generated videos to Google Drive
 * - Create shareable links
 */

interface DriveFile {
  name: string;
  id: string;
  size: number;
  mimeType: string;
}

/**
 * Get list of Sora videos from Google Drive
 */
export async function getSoraVideosFromDrive(): Promise<DriveFile[]> {
  try {
    // Use rclone to list files from "Sora videos" folder
    const output = execSync(
      'rclone lsjson "manus_google_drive:/Sora videos" --config /home/ubuntu/.gdrive-rclone.ini',
      { encoding: 'utf-8' }
    );

    const files = JSON.parse(output);
    return files
      .filter((f: any) => f.Name.endsWith('.mp4'))
      .map((f: any) => ({
        name: f.Name,
        id: f.ID,
        size: f.Size,
        mimeType: 'video/mp4',
      }));
  } catch (error) {
    console.error('Error fetching Sora videos:', error);
    return [];
  }
}

/**
 * Get shareable link for a Google Drive file
 */
export async function getShareableLink(fileId: string): Promise<string> {
  try {
    // Google Drive shareable link format
    return `https://drive.google.com/uc?id=${fileId}&export=download`;
  } catch (error) {
    console.error('Error creating shareable link:', error);
    return '';
  }
}

/**
 * Save generated video to Google Drive
 */
export async function saveVideoToDrive(
  videoPath: string,
  fileName: string,
  folderName: string = 'Big Starz Generated'
): Promise<string> {
  try {
    // Create folder if it doesn't exist
    const drivePath = `manus_google_drive:/${folderName}`;

    // Upload file using rclone
    execSync(
      `rclone copy "${videoPath}" "${drivePath}" --config /home/ubuntu/.gdrive-rclone.ini`,
      { encoding: 'utf-8' }
    );

    console.log(`Video saved to Google Drive: ${fileName}`);
    return `${drivePath}/${fileName}`;
  } catch (error) {
    console.error('Error saving video to Google Drive:', error);
    throw error;
  }
}

/**
 * Get all generated videos from Google Drive
 */
export async function getGeneratedVideosFromDrive(): Promise<DriveFile[]> {
  try {
    const output = execSync(
      'rclone lsjson "manus_google_drive:/Big Starz Generated" --config /home/ubuntu/.gdrive-rclone.ini',
      { encoding: 'utf-8' }
    );

    const files = JSON.parse(output);
    return files
      .filter((f: any) => f.Name.endsWith('.mp4'))
      .map((f: any) => ({
        name: f.Name,
        id: f.ID,
        size: f.Size,
        mimeType: 'video/mp4',
      }));
  } catch (error) {
    console.error('Error fetching generated videos:', error);
    return [];
  }
}

/**
 * Get streaming URL for Google Drive video
 */
export function getStreamingUrl(fileId: string): string {
  return `https://drive.google.com/uc?id=${fileId}&export=download`;
}
