# Email Verification Setup Guide

## Overview
This feature implements email verification via OTP (One-Time Password) for new user registrations.

## Features
- ✅ 6-digit OTP sent to user email upon registration
- ✅ OTP valid for 10 minutes
- ✅ Maximum 5 verification attempts per OTP
- ✅ Rate limiting: 1 OTP request per minute
- ✅ Existing users automatically marked as verified
- ✅ Professional email templates
- ✅ Welcome email after successful verification

## Setup Instructions

### 1. Gmail App Password Setup

1. Go to your Google Account: https://myaccount.google.com/
2. Navigate to **Security** → **2-Step Verification** (enable if not already)
3. Scroll down to **App passwords**
4. Click **Select app** → Choose **Mail**
5. Click **Select device** → Choose **Other** → Enter "Flourishing Hub"
6. Click **Generate**
7. Copy the 16-character password (remove spaces)

### 2. Environment Variables

Add these to your `.env` file:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password
```

**Example:**
```env
EMAIL_USER=flourishinghub@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop
```

### 3. Database Migration

Run the Prisma migration to add the new fields:

```bash
# Generate Prisma client
npm run prisma:generate

# Push schema changes to database
npm run prisma:push

# Migrate existing users to verified status
node scripts/migrate-existing-users.js
```

### 4. Install Dependencies

```bash
npm install nodemailer
```

## API Endpoints

### 1. Register (Modified)
**POST** `/api/v1/auth/register`

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully. Please check your email for OTP verification.",
  "data": {
    "userId": "clxxx...",
    "email": "user@iitb.ac.in",
    "name": "John Doe",
    "role": "STUDENT",
    "isVerified": false
  }
}
```

### 2. Verify OTP
**POST** `/api/v1/auth/verify-otp`

**Request:**
```json
{
  "userId": "clxxx...",
  "otp": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Email verified successfully"
}
```

### 3. Resend OTP
**POST** `/api/v1/auth/resend-otp`

**Request:**
```json
{
  "userId": "clxxx..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent successfully"
}
```

### 4. Login (Modified)
**POST** `/api/v1/auth/login`

**Error Response (Unverified):**
```json
{
  "success": false,
  "message": "Please verify your email before logging in",
  "data": {
    "userId": "clxxx...",
    "email": "user@iitb.ac.in"
  }
}
```

## Database Schema

### User Model (Updated)
```prisma
model User {
  // ... existing fields
  isVerified         Boolean            @default(false)
  emailVerifications EmailVerification[]
}
```

### EmailVerification Model (New)
```prisma
model EmailVerification {
  id                 String    @id @default(cuid())
  userId             String
  otp                String
  expiresAt          DateTime
  attempts           Int       @default(0)
  isUsed             Boolean   @default(false)
  createdAt          DateTime  @default(now())
  user               User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId, expiresAt])
  @@index([otp, isUsed])
}
```

## Frontend Flow

1. **Signup** → User fills registration form
2. **API Call** → Backend creates user with `isVerified: false`
3. **OTP Email** → 6-digit code sent to user's email
4. **Redirect** → User redirected to `/verify-email?userId=xxx&email=xxx`
5. **OTP Input** → User enters 6-digit code
6. **Verification** → Backend validates OTP and marks user as verified
7. **Welcome Email** → Sent after successful verification
8. **Redirect** → User redirected to login page
9. **Login** → User can now login with verified account

## Security Features

- ✅ OTP expires after 10 minutes
- ✅ Maximum 5 attempts per OTP
- ✅ Rate limiting: 1 OTP request per minute
- ✅ OTP marked as used after successful verification
- ✅ Old OTPs invalidated when new one is requested
- ✅ Unverified users cannot login

## Testing

### Test Email Sending
```javascript
// In your terminal or test file
import { sendOTPEmail } from './services/email.service.js';

await sendOTPEmail('test@iitb.ac.in', 'Test User', '123456');
```

### Test OTP Flow
1. Register a new user
2. Check email for OTP
3. Enter OTP on verification page
4. Verify success message
5. Login with verified account

## Troubleshooting

### Email Not Sending
- Check Gmail App Password is correct
- Ensure 2-Step Verification is enabled
- Check `EMAIL_USER` and `EMAIL_PASSWORD` in `.env`
- Check server logs for errors

### OTP Expired
- OTP is valid for 10 minutes only
- Click "Resend OTP" to get a new code

### Too Many Attempts
- Maximum 5 attempts per OTP
- Request a new OTP if exceeded

### Rate Limit Error
- Wait 60 seconds before requesting new OTP

## Production Deployment

### Render Environment Variables
Add these in Render dashboard:
- `EMAIL_USER`: Your Gmail address
- `EMAIL_PASSWORD`: Your Gmail App Password

### Vercel Environment Variables
No changes needed for frontend (uses existing API URL)

## Existing Users

All existing users are automatically marked as `isVerified: true` via the migration script. They can login without email verification.

## Support

For issues or questions, contact the development team.
