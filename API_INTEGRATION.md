# API Integration Guide

## Lawyer Registration Endpoint

### Endpoint
- **URL**: `/api/auth/register`
- **Method**: `POST`
- **Content-Type**: `multipart/form-data` (for lawyer registration)

### Request Body (Lawyer Registration)

#### Text Fields:
- `role`: `"LAWYER"` (required)
- `fullName`: string (required)
- `email`: string (required, valid email format)
- `phone`: string (required, 10 digits)
- `password`: string (required, min 8 characters)
- `barCouncilNumber`: string (required)
- `barCouncilState`: string (required)
- `practiceAreas`: JSON string array (required, e.g., `["Criminal Law","Family Law"]`)
- `yearsOfExperience`: string (required, e.g., `"5-10"`)
- `education`: string (required)
- `languages`: JSON string array (required, e.g., `["English","Hindi"]`)
- `bio`: string (required, min 50 characters)
- `consultationFee`: string (required, numeric)
- `specializations`: JSON string array (required)
- `officeAddress`: string (required)
- `city`: string (required)
- `state`: string (required)
- `pincode`: string (required, 6 digits)

#### File Fields:
- `barCertificate`: File (required, PDF/Image)
- `idProof`: File (required, PDF/Image)
- `profilePhoto`: File (optional, Image)

### Response Format

#### Success (201 Created):
```json
{
  "data": {
    "user": {
      "id": "lawyer-1234567890",
      "fullName": "Dr. John Doe",
      "email": "john@example.com",
      "phone": "9876543210",
      "role": "LAWYER",
      "verificationStatus": "PENDING",
      "createdAt": "2024-01-27T10:00:00.000Z"
    },
    "lawyerProfile": {
      "userId": "lawyer-1234567890",
      "barCouncilNumber": "BCN123456",
      "barCouncilState": "Maharashtra",
      "practiceAreas": ["Criminal Law", "Family Law"],
      "yearsOfExperience": "5-10",
      "education": "LLB from XYZ University",
      "languages": ["English", "Hindi"],
      "bio": "Experienced lawyer with expertise in...",
      "consultationFee": 1500,
      "specializations": ["Bail matters", "Cheque bounce"],
      "officeAddress": "123 Main Street",
      "city": "Mumbai",
      "state": "Maharashtra",
      "pincode": "400001",
      "documents": {
        "barCertificate": "/uploads/lawyers/bar-cert-1234567890-certificate.pdf",
        "idProof": "/uploads/lawyers/id-proof-1234567890-id.pdf",
        "profilePhoto": "/uploads/lawyers/profile-1234567890-photo.jpg"
      }
    },
    "token": "jwt-token-here",
    "message": "Registration successful. Your account is pending verification."
  }
}
```

#### Error (400 Bad Request):
```json
{
  "message": "Field validation error message"
}
```

#### Error (500 Internal Server Error):
```json
{
  "message": "Registration failed. Please try again."
}
```

## Client Registration Endpoint

### Request Body (Client Registration)

#### Text Fields:
- `role`: `"CLIENT"` (required)
- `fullName`: string (required)
- `email`: string (required, valid email format)
- `phone`: string (required, 10 digits)
- `password`: string (required, min 8 characters)

### Response Format

#### Success (201 Created):
```json
{
  "data": {
    "user": {
      "id": "client-1234567890",
      "fullName": "Jane Doe",
      "email": "jane@example.com",
      "phone": "9876543210",
      "role": "CLIENT",
      "createdAt": "2024-01-27T10:00:00.000Z"
    },
    "token": "jwt-token-here",
    "message": "Account created successfully!"
  }
}
```

## Configuration

### Using Next.js API Routes (Current Implementation)

Set in `.env.local`:
```
NEXT_PUBLIC_USE_NEXT_API=true
```

The API will use `/api/auth/register` route.

### Using External Backend

Set in `.env.local`:
```
NEXT_PUBLIC_USE_NEXT_API=false
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

## Backend Integration Checklist

If you're implementing this in a separate backend (e.g., Express.js, NestJS), ensure:

1. **File Upload Handling**
   - Use `multer` (Express) or equivalent middleware
   - Configure file size limits (recommended: 5MB per file)
   - Validate file types (PDF, JPEG, PNG)
   - Store files securely (cloud storage recommended for production)

2. **Password Hashing**
   - Use `bcrypt` or `argon2`
   - Hash password before storing in database
   - Never store plain text passwords

3. **Database Schema**
   - Create `users` table with fields: id, fullName, email, phone, password (hashed), role, verificationStatus, createdAt
   - Create `lawyer_profiles` table with all lawyer-specific fields
   - Create `documents` table or store file paths in lawyer_profiles

4. **JWT Token Generation**
   - Generate JWT token after successful registration
   - Include userId and role in token payload
   - Set appropriate expiration (e.g., 7 days)

5. **Email Verification**
   - Send verification email after registration
   - Include verification token/link
   - Update user status after email verification

6. **Validation**
   - Validate all required fields
   - Check email format
   - Validate phone number format
   - Check password strength
   - Verify Bar Council number format (if applicable)

7. **Error Handling**
   - Return appropriate HTTP status codes
   - Provide clear error messages
   - Log errors for debugging
   - Handle duplicate email/phone gracefully

## Example Express.js Implementation

```javascript
const express = require('express');
const multer = require('multer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();
const upload = multer({ 
  dest: 'uploads/',
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Invalid file type'));
  }
});

router.post('/auth/register', 
  upload.fields([
    { name: 'barCertificate', maxCount: 1 },
    { name: 'idProof', maxCount: 1 },
    { name: 'profilePhoto', maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      // Extract and validate data
      // Hash password: const hashedPassword = await bcrypt.hash(password, 10);
      // Save to database
      // Generate JWT token
      // Return response
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
);
```

## Testing

### Using cURL (Lawyer Registration):
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -F "role=LAWYER" \
  -F "fullName=Dr. John Doe" \
  -F "email=john@example.com" \
  -F "phone=9876543210" \
  -F "password=SecurePass123" \
  -F "barCouncilNumber=BCN123456" \
  -F "barCouncilState=Maharashtra" \
  -F "practiceAreas=[\"Criminal Law\",\"Family Law\"]" \
  -F "yearsOfExperience=5-10" \
  -F "education=LLB from XYZ University" \
  -F "languages=[\"English\",\"Hindi\"]" \
  -F "bio=Experienced lawyer with 10 years of practice..." \
  -F "consultationFee=1500" \
  -F "specializations=[\"Bail matters\"]" \
  -F "officeAddress=123 Main Street" \
  -F "city=Mumbai" \
  -F "state=Maharashtra" \
  -F "pincode=400001" \
  -F "barCertificate=@/path/to/certificate.pdf" \
  -F "idProof=@/path/to/id.pdf" \
  -F "profilePhoto=@/path/to/photo.jpg"
```

### Using Postman:
1. Set method to POST
2. Set URL to `/api/auth/register`
3. Go to Body tab → Select `form-data`
4. Add all text fields
5. Add file fields and select files
6. Send request
