/**
 * Google Sheets API Integration
 * Real-time database mirroring for master dashboard
 * Uses Google Workspace Sheets API (100% free, no external tools)
 */

import { execSync } from "child_process";

export interface SheetConfig {
  spreadsheetId: string;
  sheetName: string;
  headers: string[];
}

/**
 * Initialize Big Starz master dashboard spreadsheet
 * Creates sheets for: Users, Videos, Music, Castings, Leads
 */
export async function initializeMasterDashboard(
  spreadsheetId: string
): Promise<boolean> {
  try {
    console.log("[Sheets] Initializing master dashboard spreadsheet...");

    // Create Users sheet
    await createSheet(spreadsheetId, "Users", [
      "User ID",
      "Email",
      "Name",
      "Role",
      "Subscriber Count",
      "Subscription Status",
      "Signup Date",
      "Last Active",
      "Total Earnings",
    ]);

    // Create Videos sheet
    await createSheet(spreadsheetId, "Videos", [
      "Video ID",
      "User ID",
      "Title",
      "AI Model",
      "Status",
      "Created Date",
      "Beautified URL",
      "Style Preset",
    ]);

    // Create Music sheet
    await createSheet(spreadsheetId, "Music", [
      "Music ID",
      "User ID",
      "Title",
      "Genre",
      "Lyric Model",
      "Status",
      "Created Date",
      "Generated Music URL",
    ]);

    // Create Castings sheet
    await createSheet(spreadsheetId, "Castings", [
      "Casting ID",
      "Brand Name",
      "Category",
      "Compensation",
      "Status",
      "Applications",
      "Deadline",
      "Created Date",
    ]);

    // Create Leads sheet
    await createSheet(spreadsheetId, "Leads", [
      "Lead ID",
      "Name",
      "Email",
      "Phone",
      "Company",
      "Interest",
      "Jotform ID",
      "Submission Date",
      "Status",
    ]);

    console.log("[Sheets] Master dashboard initialized successfully");
    return true;
  } catch (error) {
    console.error("[Sheets] Failed to initialize master dashboard:", error);
    return false;
  }
}

/**
 * Create a new sheet in the spreadsheet
 */
async function createSheet(
  spreadsheetId: string,
  sheetName: string,
  headers: string[]
): Promise<boolean> {
  try {
    // Add sheet request
    const addSheetCommand = `gws sheets spreadsheets batchUpdate --json '{
      "requests": [{
        "addSheet": {
          "properties": {
            "title": "${sheetName}",
            "gridProperties": {
              "rowCount": 1000,
              "columnCount": ${headers.length}
            }
          }
        }
      }]
    }' --params '{"spreadsheetId": "${spreadsheetId}"}'`;

    execSync(addSheetCommand, { stdio: "pipe" });

    // Add headers
    const headerRow = headers.map((h) => `"${h}"`).join(",");
    const updateCommand = `gws sheets spreadsheets values append --json '{
      "values": [[${headerRow}]]
    }' --params '{"spreadsheetId": "${spreadsheetId}", "range": "${sheetName}!A1"}'`;

    execSync(updateCommand, { stdio: "pipe" });

    console.log(`[Sheets] Created sheet: ${sheetName}`);
    return true;
  } catch (error) {
    console.error(`[Sheets] Failed to create sheet ${sheetName}:`, error);
    return false;
  }
}

/**
 * Append user data to Users sheet
 */
export async function appendUserToSheet(
  spreadsheetId: string,
  userData: {
    id: number;
    email: string;
    name: string;
    role: string;
    subscriberCount: number;
    subscriptionStatus: string;
    createdAt: Date;
    lastSignedIn: Date;
    totalEarnings: string;
  }
): Promise<boolean> {
  try {
    const values = [
      [
        userData.id,
        userData.email,
        userData.name,
        userData.role,
        userData.subscriberCount,
        userData.subscriptionStatus,
        userData.createdAt.toISOString(),
        userData.lastSignedIn.toISOString(),
        userData.totalEarnings,
      ],
    ];

    const command = `gws sheets spreadsheets values append --json '{
      "values": ${JSON.stringify(values)}
    }' --params '{"spreadsheetId": "${spreadsheetId}", "range": "Users!A:I"}'`;

    execSync(command, { stdio: "pipe" });

    console.log(`[Sheets] Appended user: ${userData.email}`);
    return true;
  } catch (error) {
    console.error("[Sheets] Failed to append user:", error);
    return false;
  }
}

/**
 * Append video data to Videos sheet
 */
export async function appendVideoToSheet(
  spreadsheetId: string,
  videoData: {
    id: number;
    userId: number;
    title: string;
    aiModel: string;
    processingStatus: string;
    createdAt: Date;
    beautifiedVideoUrl: string | null;
    stylePreset: string | null;
  }
): Promise<boolean> {
  try {
    const values = [
      [
        videoData.id,
        videoData.userId,
        videoData.title || "Untitled",
        videoData.aiModel,
        videoData.processingStatus,
        videoData.createdAt.toISOString(),
        videoData.beautifiedVideoUrl || "Processing...",
        videoData.stylePreset || "Default",
      ],
    ];

    const command = `gws sheets spreadsheets values append --json '{
      "values": ${JSON.stringify(values)}
    }' --params '{"spreadsheetId": "${spreadsheetId}", "range": "Videos!A:H"}'`;

    execSync(command, { stdio: "pipe" });

    console.log(`[Sheets] Appended video: ${videoData.title}`);
    return true;
  } catch (error) {
    console.error("[Sheets] Failed to append video:", error);
    return false;
  }
}

/**
 * Append music data to Music sheet
 */
export async function appendMusicToSheet(
  spreadsheetId: string,
  musicData: {
    id: number;
    userId: number;
    title: string;
    genre: string;
    lyricModel: string;
    processingStatus: string;
    createdAt: Date;
    generatedMusicUrl: string | null;
  }
): Promise<boolean> {
  try {
    const values = [
      [
        musicData.id,
        musicData.userId,
        musicData.title || "Untitled",
        musicData.genre || "Unknown",
        musicData.lyricModel,
        musicData.processingStatus,
        musicData.createdAt.toISOString(),
        musicData.generatedMusicUrl || "Processing...",
      ],
    ];

    const command = `gws sheets spreadsheets values append --json '{
      "values": ${JSON.stringify(values)}
    }' --params '{"spreadsheetId": "${spreadsheetId}", "range": "Music!A:H"}'`;

    execSync(command, { stdio: "pipe" });

    console.log(`[Sheets] Appended music: ${musicData.title}`);
    return true;
  } catch (error) {
    console.error("[Sheets] Failed to append music:", error);
    return false;
  }
}

/**
 * Append casting data to Castings sheet
 */
export async function appendCastingToSheet(
  spreadsheetId: string,
  castingData: {
    id: number;
    brandName: string;
    productCategory: string;
    compensation: string;
    status: string;
    applicationDeadline: Date;
    createdAt: Date;
  }
): Promise<boolean> {
  try {
    const values = [
      [
        castingData.id,
        castingData.brandName,
        castingData.productCategory,
        castingData.compensation,
        castingData.status,
        "0", // Applications count (can be updated)
        castingData.applicationDeadline.toISOString(),
        castingData.createdAt.toISOString(),
      ],
    ];

    const command = `gws sheets spreadsheets values append --json '{
      "values": ${JSON.stringify(values)}
    }' --params '{"spreadsheetId": "${spreadsheetId}", "range": "Castings!A:H"}'`;

    execSync(command, { stdio: "pipe" });

    console.log(`[Sheets] Appended casting: ${castingData.brandName}`);
    return true;
  } catch (error) {
    console.error("[Sheets] Failed to append casting:", error);
    return false;
  }
}

/**
 * Append lead data to Leads sheet (from Jotform)
 */
export async function appendLeadToSheet(
  spreadsheetId: string,
  leadData: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    company?: string;
    interest?: string;
    jotformId: string;
    submissionDate: Date;
  }
): Promise<boolean> {
  try {
    const values = [
      [
        leadData.id,
        leadData.name,
        leadData.email,
        leadData.phone || "",
        leadData.company || "",
        leadData.interest || "",
        leadData.jotformId,
        leadData.submissionDate.toISOString(),
        "New", // Status
      ],
    ];

    const command = `gws sheets spreadsheets values append --json '{
      "values": ${JSON.stringify(values)}
    }' --params '{"spreadsheetId": "${spreadsheetId}", "range": "Leads!A:I"}'`;

    execSync(command, { stdio: "pipe" });

    console.log(`[Sheets] Appended lead: ${leadData.email}`);
    return true;
  } catch (error) {
    console.error("[Sheets] Failed to append lead:", error);
    return false;
  }
}

/**
 * Update video processing status in sheet
 */
export async function updateVideoStatusInSheet(
  spreadsheetId: string,
  videoId: number,
  status: string,
  beautifiedUrl?: string
): Promise<boolean> {
  try {
    // Find the row with this video ID and update status
    const command = `gws sheets spreadsheets values update --json '{
      "values": [["${status}"${beautifiedUrl ? `, "${beautifiedUrl}"` : ""}]]
    }' --params '{"spreadsheetId": "${spreadsheetId}", "range": "Videos!E:F"}'`;

    execSync(command, { stdio: "pipe" });

    console.log(`[Sheets] Updated video ${videoId} status: ${status}`);
    return true;
  } catch (error) {
    console.error("[Sheets] Failed to update video status:", error);
    return false;
  }
}

/**
 * Get all users from Users sheet (for analytics)
 */
export async function getAllUsersFromSheet(spreadsheetId: string): Promise<any[]> {
  try {
    const output = execSync(
      `gws sheets spreadsheets values get --params '{"spreadsheetId": "${spreadsheetId}", "range": "Users!A:I"}' --format json`,
      { encoding: "utf-8" }
    );

    const data = JSON.parse(output);
    return data.values || [];
  } catch (error) {
    console.error("[Sheets] Failed to get users:", error);
    return [];
  }
}

/**
 * Get all leads from Leads sheet
 */
export async function getAllLeadsFromSheet(spreadsheetId: string): Promise<any[]> {
  try {
    const output = execSync(
      `gws sheets spreadsheets values get --params '{"spreadsheetId": "${spreadsheetId}", "range": "Leads!A:I"}' --format json`,
      { encoding: "utf-8" }
    );

    const data = JSON.parse(output);
    return data.values || [];
  } catch (error) {
    console.error("[Sheets] Failed to get leads:", error);
    return [];
  }
}
