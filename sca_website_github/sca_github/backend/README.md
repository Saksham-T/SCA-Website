# SCA Careers Backend

Production-ready Node.js + Express backend that processes Careers Application Form
submissions: validates input, accepts a resume upload, stores the application in
MongoDB, emails HR with the resume attached, and sends the candidate a branded
acknowledgement.

## Stack
Express · MongoDB/Mongoose · Multer · Nodemailer · Winston/Morgan · Helmet ·
express-rate-limit · express-mongo-sanitize · sanitize-html · validator.

## Workflow
```
candidate submits form (multipart/form-data)
  → rate limit per IP
  → multer parses + validates resume (pdf/doc/docx, size, unique name)
  → spam/honeypot + time-trap check
  → input sanitization (XSS + NoSQL injection)
  → server-side field validation (structured errors)
  → save Application in MongoDB (status = "New")
  → email HR (all details + resume attached)
  → email candidate (acknowledgement)
  → 201 { submissionId, status, notifications }
```

## Folder structure
```
backend/
├── server.js                 # entrypoint: DB connect, SMTP verify, listen
│                             # (credentials live in the project-root .env)
└── src/
    ├── app.js                # express app factory + middleware wiring
    ├── config/               # env config, db connection, winston logger
    ├── models/               # Application mongoose schema
    ├── middleware/           # upload, sanitize, validate, rateLimiter, spam, errorHandler
    ├── controllers/          # submission workflow
    ├── routes/               # /api/applications
    ├── services/             # nodemailer email service
    └── utils/                # ApiError, asyncHandler, validators, email templates
```

## Setup
```bash
# 1. Edit the SINGLE project-root .env (../.env from here) and fill in:
#      MONGODB_URI, SMTP_PASS, HR_EMAIL, etc.
#    The same file also powers the legacy Vercel function api/apply.js.
cd backend
npm install
npm run dev               # or: npm start
```

## API

### `POST /api/applications`
`Content-Type: multipart/form-data`

| Field                | Required | Notes |
|----------------------|----------|-------|
| fullName             | yes      | max 120 |
| email                | yes      | valid email |
| phone                | yes      | 7–20 digits, +/spaces ok |
| location             | yes      | current residence |
| country              | yes      | |
| position             | yes      | position applied for |
| yearsOfExperience    | yes      | number 0–60 |
| linkedin             | no       | valid linkedin.com URL |
| portfolio            | no       | valid http(s) URL |
| willingToRelocate    | yes      | `Yes` \| `No` \| `Maybe` |
| preferredWorkMode    | yes      | `On-site` \| `Hybrid` \| `Remote` |
| joiningAvailability  | yes      | e.g. "Immediate", "30 days" |
| coverLetter          | no       | max 5000 |
| resume               | yes      | file: pdf/doc/docx |
| company_website      | no       | **honeypot** — must stay empty |
| form_render_ts       | no       | epoch ms when form rendered (time-trap) |
| *(any other field)*  | no       | captured into `additionalFields` |

**Success `201`**
```json
{
  "success": true,
  "message": "Application submitted successfully.",
  "data": {
    "submissionId": "APP-7F3K9Q2X4M",
    "status": "New",
    "submittedAt": "2026-06-24T10:00:00.000Z",
    "notifications": { "hr": true, "candidate": true }
  }
}
```

**Validation error `400`**
```json
{
  "success": false,
  "message": "Validation failed. Please correct the highlighted fields.",
  "errors": [
    { "field": "email", "message": "Enter a valid email address." },
    { "field": "resume", "message": "A resume file (PDF, DOC or DOCX) is required." }
  ]
}
```

Other statuses: `429` (rate limited), `404` (unknown route), `500` (server error).

### `GET /health`
Liveness probe → `{ "status": "ok", "uptime": <seconds> }`.

## Security
- Helmet security headers, CORS allow-list.
- Per-IP rate limiting on submissions.
- Honeypot + submission-time trap anti-bot checks.
- HTML stripping (XSS) + `$`/`.` key stripping (NoSQL injection) on all input.
- Strict resume validation (mime **and** extension), size cap, sanitized unique
  filenames, orphan-file cleanup on failure.
- Centralized error handling with global `unhandledRejection`/`uncaughtException`
  guards; request/error logging via Morgan + Winston (`logs/`).
