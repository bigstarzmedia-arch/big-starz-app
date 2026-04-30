/**
 * Gmail API Integration
 * Send automated welcome emails on user signup
 * Uses Google Workspace Gmail API (100% free, no external marketing tools)
 */

import { execSync } from "child_process";

export interface WelcomeEmailData {
  userEmail: string;
  userName: string;
  userId: number;
  signupDate: Date;
  subscriptionStatus: string;
}

/**
 * Send welcome email via Gmail API using gws CLI
 * Triggered on user signup in the database
 */
export async function sendWelcomeEmail(data: WelcomeEmailData): Promise<boolean> {
  try {
    const emailSubject = "Welcome to Big Starz Casting & Music! 🌟";
    const emailBody = buildWelcomeEmailBody(data);
    const fromEmail = process.env.GMAIL_SENDER_EMAIL || "noreply@bigstarz.com";

    // Use gws CLI to send email via Gmail API
    const command = `gws gmail users messages send --json '${JSON.stringify({
      raw: Buffer.from(
        `From: ${fromEmail}\nTo: ${data.userEmail}\nSubject: ${emailSubject}\nContent-Type: text/html; charset="UTF-8"\n\n${emailBody}`
      ).toString("base64"),
    })}'`;

    console.log(`[Gmail] Sending welcome email to ${data.userEmail}`);
    execSync(command, { stdio: "pipe" });

    console.log(`[Gmail] Welcome email sent successfully to ${data.userEmail}`);
    return true;
  } catch (error) {
    console.error(`[Gmail] Failed to send welcome email to ${data.userEmail}:`, error);
    return false;
  }
}

/**
 * Send subscription confirmation email
 */
export async function sendSubscriptionConfirmationEmail(
  userEmail: string,
  userName: string,
  subscriptionTier: string
): Promise<boolean> {
  try {
    const emailSubject = `Your Big Starz ${subscriptionTier} Subscription is Active ✨`;
    const emailBody = buildSubscriptionConfirmationBody(userName, subscriptionTier);
    const fromEmail = process.env.GMAIL_SENDER_EMAIL || "noreply@bigstarz.com";

    const command = `gws gmail users messages send --json '${JSON.stringify({
      raw: Buffer.from(
        `From: ${fromEmail}\nTo: ${userEmail}\nSubject: ${emailSubject}\nContent-Type: text/html; charset="UTF-8"\n\n${emailBody}`
      ).toString("base64"),
    })}'`;

    console.log(`[Gmail] Sending subscription confirmation to ${userEmail}`);
    execSync(command, { stdio: "pipe" });

    return true;
  } catch (error) {
    console.error(`[Gmail] Failed to send subscription confirmation:`, error);
    return false;
  }
}

/**
 * Send casting opportunity notification
 */
export async function sendCastingNotificationEmail(
  userEmail: string,
  userName: string,
  castingBrand: string,
  castingCompensation: string
): Promise<boolean> {
  try {
    const emailSubject = `New Casting Opportunity: ${castingBrand} 🎬`;
    const emailBody = buildCastingNotificationBody(userName, castingBrand, castingCompensation);
    const fromEmail = process.env.GMAIL_SENDER_EMAIL || "noreply@bigstarz.com";

    const command = `gws gmail users messages send --json '${JSON.stringify({
      raw: Buffer.from(
        `From: ${fromEmail}\nTo: ${userEmail}\nSubject: ${emailSubject}\nContent-Type: text/html; charset="UTF-8"\n\n${emailBody}`
      ).toString("base64"),
    })}'`;

    console.log(`[Gmail] Sending casting notification to ${userEmail}`);
    execSync(command, { stdio: "pipe" });

    return true;
  } catch (error) {
    console.error(`[Gmail] Failed to send casting notification:`, error);
    return false;
  }
}

/**
 * Build welcome email HTML body
 */
function buildWelcomeEmailBody(data: WelcomeEmailData): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #FF1493, #0080FF, #00FF00, #FFFF00); padding: 20px; border-radius: 8px; color: white; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; border-radius: 8px; margin-top: 20px; }
          .button { display: inline-block; padding: 12px 30px; background: #FF1493; color: white; text-decoration: none; border-radius: 5px; margin-top: 15px; }
          .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🌟 Welcome to Big Starz Casting & Music 🌟</h1>
          </div>
          <div class="content">
            <p>Hi ${data.userName},</p>
            <p>Welcome to Big Starz! You're now part of an exclusive community of creators, models, and artists.</p>
            <p><strong>Your Account Status:</strong> ${data.subscriptionStatus}</p>
            <p><strong>Signup Date:</strong> ${data.signupDate.toLocaleDateString()}</p>
            <p>With your Big Starz subscription, you now have access to:</p>
            <ul>
              <li>✨ Cameo & Beautify Engine - Transform your videos with AI</li>
              <li>🎵 Music & Lyric Studio - Generate lyrics and beats</li>
              <li>💰 Affiliate Modeling Hub - Get cast for premium brands</li>
              <li>🎬 Professional video generation tools</li>
            </ul>
            <p>Get started by exploring the app and uploading your first video or music track!</p>
            <a href="https://bigstarzapp.com/app" class="button">Open Big Starz App</a>
          </div>
          <div class="footer">
            <p>Big Starz Casting & Music | © 2026 | All Rights Reserved</p>
            <p>Questions? Reply to this email or visit our support center.</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

/**
 * Build subscription confirmation email body
 */
function buildSubscriptionConfirmationBody(userName: string, tier: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #FF1493; padding: 20px; border-radius: 8px; color: white; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; border-radius: 8px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✨ Subscription Confirmed ✨</h1>
          </div>
          <div class="content">
            <p>Hi ${userName},</p>
            <p>Your ${tier} subscription to Big Starz is now active!</p>
            <p>You can now access all premium features including video generation, music creation, and casting opportunities.</p>
            <p>Enjoy creating! 🎬</p>
          </div>
        </div>
      </body>
    </html>
  `;
}

/**
 * Build casting notification email body
 */
function buildCastingNotificationBody(
  userName: string,
  brand: string,
  compensation: string
): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #0080FF; padding: 20px; border-radius: 8px; color: white; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; border-radius: 8px; margin-top: 20px; }
          .button { display: inline-block; padding: 12px 30px; background: #FF1493; color: white; text-decoration: none; border-radius: 5px; margin-top: 15px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎬 New Casting Opportunity 🎬</h1>
          </div>
          <div class="content">
            <p>Hi ${userName},</p>
            <p>Great news! You've been matched with a new casting opportunity:</p>
            <p><strong>Brand:</strong> ${brand}</p>
            <p><strong>Compensation:</strong> ${compensation}</p>
            <p>Check the app to view the full casting brief and submit your application!</p>
            <a href="https://bigstarzapp.com/app/castings" class="button">View Casting</a>
          </div>
        </div>
      </body>
    </html>
  `;
}

/**
 * List available Gmail labels (for debugging)
 */
export async function listGmailLabels(): Promise<string[]> {
  try {
    const output = execSync("gws gmail users labels list --format json", {
      encoding: "utf-8",
    });
    const labels = JSON.parse(output);
    return labels.labels?.map((l: { name: string }) => l.name) || [];
  } catch (error) {
    console.error("[Gmail] Failed to list labels:", error);
    return [];
  }
}
