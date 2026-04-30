/**
 * Jotform → Google Sheets Integration
 * Automatically capture leads from Jotform into Google Sheets
 * Webhook-based real-time sync (100% free, no external tools)
 */

import { appendLeadToSheet } from "./google-sheets";

export interface JotformSubmission {
  event_type: string;
  timestamp: number;
  submission_uuid: string;
  submission_id: string;
  form_id: string;
  answers: Record<string, { text: string; type: string }>;
}

export interface ProcessedLead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  interest?: string;
  jotformId: string;
  submissionDate: Date;
}

/**
 * Process Jotform webhook submission
 * Called when a new form submission is received
 */
export async function processJotformSubmission(
  payload: JotformSubmission,
  spreadsheetId: string
): Promise<boolean> {
  try {
    console.log(`[Jotform] Processing submission: ${payload.submission_id}`);

    // Extract lead data from Jotform answers
    const lead = extractLeadData(payload);

    if (!lead.email) {
      console.warn("[Jotform] Submission missing email, skipping...");
      return false;
    }

    // Append to Google Sheets
    const success = await appendLeadToSheet(spreadsheetId, lead);

    if (success) {
      console.log(`[Jotform] Lead captured: ${lead.email}`);
      // TODO: Send confirmation email to lead
      // TODO: Send notification to admin
    }

    return success;
  } catch (error) {
    console.error("[Jotform] Failed to process submission:", error);
    return false;
  }
}

/**
 * Extract lead information from Jotform answers
 * Handles various field types and naming conventions
 */
function extractLeadData(payload: JotformSubmission): ProcessedLead {
  const answers = payload.answers;

  // Helper function to find answer by common field names
  const findAnswer = (
    ...fieldNames: string[]
  ): string | undefined => {
    for (const fieldName of fieldNames) {
      const answer = answers[fieldName];
      if (answer && answer.text) {
        return answer.text.trim();
      }
    }
    return undefined;
  };

  const name =
    findAnswer("name", "full_name", "firstName", "first_name") || "Unknown";
  const email =
    findAnswer("email", "email_address", "contact_email") || "";
  const phone =
    findAnswer("phone", "phone_number", "contact_phone") || undefined;
  const company =
    findAnswer("company", "company_name", "organization") || undefined;
  const interest =
    findAnswer("interest", "interested_in", "what_interested", "interest_area") ||
    undefined;

  return {
    id: `jotform_${payload.submission_id}`,
    name,
    email,
    phone,
    company,
    interest,
    jotformId: payload.submission_id,
    submissionDate: new Date(payload.timestamp * 1000),
  };
}

/**
 * Verify Jotform webhook signature
 * Ensures webhook is authentic and from Jotform
 */
export function verifyJotformSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  try {
    // Jotform uses HMAC-SHA256 for signatures
    const crypto = require("crypto");
    const hash = crypto
      .createHmac("sha256", secret)
      .update(payload)
      .digest("hex");

    return hash === signature;
  } catch (error) {
    console.error("[Jotform] Signature verification failed:", error);
    return false;
  }
}

/**
 * Jotform webhook handler for Express
 * Attach to POST /api/webhooks/jotform
 */
export async function jotformWebhookHandler(
  req: any,
  res: any,
  spreadsheetId: string
) {
  try {
    // Verify webhook signature
    const signature = req.headers["x-jotform-signature"];
    const jotformSecret = process.env.JOTFORM_WEBHOOK_SECRET;

    if (!jotformSecret) {
      console.warn("[Jotform] JOTFORM_WEBHOOK_SECRET not configured");
      return res.status(400).json({ error: "Webhook secret not configured" });
    }

    const payload = JSON.stringify(req.body);
    if (!verifyJotformSignature(payload, signature, jotformSecret)) {
      console.warn("[Jotform] Invalid webhook signature");
      return res.status(401).json({ error: "Invalid signature" });
    }

    // Process the submission
    const success = await processJotformSubmission(req.body, spreadsheetId);

    if (success) {
      return res.status(200).json({ success: true, message: "Lead captured" });
    } else {
      return res.status(500).json({ error: "Failed to process submission" });
    }
  } catch (error) {
    console.error("[Jotform] Webhook handler error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * Get Jotform form details (for debugging)
 */
export async function getJotformFormDetails(formId: string): Promise<any> {
  try {
    const apiKey = process.env.JOTFORM_API_KEY;
    if (!apiKey) {
      throw new Error("JOTFORM_API_KEY not configured");
    }

    const response = await fetch(
      `https://api.jotform.com/form/${formId}?apiKey=${apiKey}`
    );
    const data = await response.json();

    return data;
  } catch (error) {
    console.error("[Jotform] Failed to get form details:", error);
    return null;
  }
}

/**
 * List all Jotform submissions for a form
 */
export async function listJotformSubmissions(
  formId: string,
  limit: number = 100
): Promise<any[]> {
  try {
    const apiKey = process.env.JOTFORM_API_KEY;
    if (!apiKey) {
      throw new Error("JOTFORM_API_KEY not configured");
    }

    const response = await fetch(
      `https://api.jotform.com/form/${formId}/submissions?apiKey=${apiKey}&limit=${limit}`
    );
    const data = await response.json();

    return data.content || [];
  } catch (error) {
    console.error("[Jotform] Failed to list submissions:", error);
    return [];
  }
}

/**
 * Sync historical Jotform submissions to Google Sheets
 * Useful for initial migration
 */
export async function syncHistoricalSubmissions(
  formId: string,
  spreadsheetId: string,
  limit: number = 1000
): Promise<number> {
  try {
    console.log(
      `[Jotform] Syncing historical submissions from form ${formId}...`
    );

    const submissions = await listJotformSubmissions(formId, limit);
    let successCount = 0;

    for (const submission of submissions) {
      const success = await processJotformSubmission(submission, spreadsheetId);
      if (success) {
        successCount++;
      }
    }

    console.log(
      `[Jotform] Synced ${successCount} of ${submissions.length} submissions`
    );
    return successCount;
  } catch (error) {
    console.error("[Jotform] Historical sync failed:", error);
    return 0;
  }
}
