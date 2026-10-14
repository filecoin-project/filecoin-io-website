/**
 * Google Apps Script for the site's forms. Each form has its own Google Sheet with this same
 * script bound to it: the contact form ("Talk to sales"), the storage provider intake form
 * (/provide-storage/onboarding) and the partnership form ("Partner With Us", on the homepage).
 *
 * The site's /api/contact, /api/provider and /api/partner routes POST each submission to their sheet's
 * deployment as JSON, with a `form` field saying which form it is; this appends it as a row on
 * that form's tab (created with its header row on the first submission). Set up each sheet once:
 *
 *   1. Create a Google Sheet (any name). Extensions → Apps Script. Replace the editor's contents
 *      with this file and save.
 *   2. Deploy → New deployment → type "Web app". Execute as: Me. Who has access: Anyone.
 *      (Anyone with the URL can POST a row; the URL stays on the server and is never sent to
 *      browsers. Deploying asks you to authorise the script to edit the sheet.)
 *   3. Copy the web app URL (https://script.google.com/macros/s/…/exec) into the sheet's
 *      environment variable: CONTACT_SHEET_WEBHOOK_URL for the contact form's sheet,
 *      PROVIDER_SHEET_WEBHOOK_URL for the provider form's, PARTNER_SHEET_WEBHOOK_URL for the
 *      partnership form's. In .env.local locally, and in the
 *      Vercel project's environment variables for deployments.
 *
 * Editing this script later needs a new deployment (Deploy → Manage deployments → edit → new
 * version); the URL stays the same.
 */

var FORMS = {
  contact: {
    sheet: "Submissions",
    headers: [
      "Submitted at",
      "Full name",
      "Work email",
      "Company",
      "What are you looking to do?",
      "Project and storage needs",
      "Data in the next 12 months",
      "Page",
    ],
    row: function (data) {
      return [data.fullName, data.email, data.company, data.intent, data.project, data.volume, data.page];
    },
  },
  provider: {
    sheet: "Storage providers",
    headers: [
      "Submitted at",
      "Full name",
      "Work email",
      "Company / Organization",
      "Storage operation",
      "Storage capacity",
      "Looking to accomplish",
      "Page",
    ],
    row: function (data) {
      return [data.fullName, data.email, data.company, data.operation, data.capacity, data.goals, data.page];
    },
  },
  partner: {
    sheet: "Partners",
    headers: [
      "Submitted at",
      "Full name",
      "Work email",
      "Company / Organization",
      "Type of partnership",
      "What they'd like to explore",
      "Page",
    ],
    row: function (data) {
      return [data.fullName, data.email, data.company, data.type, data.details, data.page];
    },
  },
};

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var data = JSON.parse(e.postData.contents);
    // Contact submissions from before the provider form existed carried no `form`.
    var form = FORMS[data.form] || FORMS.contact;
    var sheet = getSheet(form);
    var when = data.submittedAt ? new Date(data.submittedAt) : new Date();
    sheet.appendRow([when].concat(form.row(data).map(text)));
    return json({ ok: true });
  } catch (error) {
    return json({ ok: false, error: String(error) });
  } finally {
    lock.releaseLock();
  }
}

/** Opening the URL in a browser shows that the deployment is alive. */
function doGet() {
  return json({
    ok: true,
    sheets: Object.keys(FORMS).map(function (key) {
      return FORMS[key].sheet;
    }),
  });
}

function getSheet(form) {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName(form.sheet) || spreadsheet.insertSheet(form.sheet);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(form.headers);
    sheet.getRange(1, 1, 1, form.headers.length).setFontWeight("bold");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

/**
 * A submitted value as plain text. Sheets runs a cell starting with = + - @ as a formula, so
 * those get a leading apostrophe, which keeps the text as typed and is not shown in the cell.
 */
function text(value) {
  var s = value == null ? "" : String(value);
  return /^[=+\-@\t\r]/.test(s) ? "'" + s : s;
}

function json(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);
}
