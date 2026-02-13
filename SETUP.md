# Setup Instructions

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

2. **Configure Environment Variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` and set:
   - `NEXT_PUBLIC_USE_NEXT_API=true` (to use Next.js API routes)
   - Or configure `NEXT_PUBLIC_API_URL` if using external backend

3. **Create Uploads Directory**
   ```bash
   mkdir -p public/uploads/lawyers
   ```
   
   Or manually create the folder structure:
   ```
   public/
     uploads/
       lawyers/
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Access the Application**
   - Frontend: http://localhost:3000
   - Signup: http://localhost:3000/signup
   - Lawyer Signup: http://localhost:3000/signup/lawyer
   - Client Signup: http://localhost:3000/signup/client

## API Configuration

### Option 1: Use Next.js API Routes (Default)

The project includes Next.js API routes at `/app/api/auth/register/route.ts`.

**Pros:**
- No separate backend needed
- Fast development
- Integrated with Next.js

**Cons:**
- Limited scalability
- Not ideal for production at scale

**Setup:**
```env
NEXT_PUBLIC_USE_NEXT_API=true
```

### Option 2: Use External Backend

Point to your external backend API.

**Setup:**
```env
NEXT_PUBLIC_USE_NEXT_API=false
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

See `API_INTEGRATION.md` for backend implementation details.

## Database Setup (If Using Next.js API Routes)

The current implementation includes mock data. To use a real database:

1. **Install Database Client**
   ```bash
   npm install prisma @prisma/client
   # or your preferred ORM
   ```

2. **Configure Database Connection**
   - Update `DATABASE_URL` in `.env.local`
   - Create database schema
   - Update `/app/api/auth/register/route.ts` to use database

3. **Example Schema (Prisma)**
   ```prisma
   model User {
     id                String   @id @default(uuid())
     fullName          String
     email             String   @unique
     phone             String   @unique
     password          String
     role              String   // CLIENT | LAWYER | ADMIN
     verificationStatus String? // PENDING | APPROVED | REJECTED
     createdAt         DateTime @default(now())
     lawyerProfile     LawyerProfile?
   }

   model LawyerProfile {
     id                String   @id @default(uuid())
     userId            String   @unique
     user              User     @relation(fields: [userId], references: [id])
     barCouncilNumber  String
     barCouncilState   String
     practiceAreas     String[] // Array of strings
     yearsOfExperience String
     education         String
     languages         String[] // Array of strings
     bio               String
     consultationFee   Float
     specializations   String[] // Array of strings
     officeAddress     String
     city              String
     state             String
     pincode           String
     barCertificatePath String
     idProofPath       String
     profilePhotoPath  String?
     createdAt         DateTime @default(now())
   }
   ```

## File Upload Configuration

Files are stored in `public/uploads/lawyers/` by default.

**For Production:**
- Use cloud storage (AWS S3, Cloudinary, etc.)
- Update file storage logic in `/app/api/auth/register/route.ts`
- Never commit uploaded files to git

## Security Considerations

1. **Password Hashing**
   - Currently mocked - implement bcrypt/argon2
   - Never store plain text passwords

2. **JWT Tokens**
   - Currently mocked - implement proper JWT generation
   - Use secure secret key
   - Set appropriate expiration

3. **File Uploads**
   - Validate file types
   - Limit file sizes
   - Scan for malware (production)
   - Use secure file storage

4. **Input Validation**
   - All inputs are validated
   - Sanitize user inputs
   - Prevent SQL injection (if using SQL)

5. **Rate Limiting**
   - Implement rate limiting for registration endpoint
   - Prevent abuse

## Testing

### Test Lawyer Registration Flow:
1. Navigate to http://localhost:3000/signup
2. Click "Sign Up as Lawyer"
3. Complete all 5 steps:
   - Step 1: Basic Info
   - Step 2: Professional Details
   - Step 3: Upload Documents
   - Step 4: Profile Setup
   - Step 5: Review & Submit
4. Verify redirect to verification pending page

### Test Client Registration Flow:
1. Navigate to http://localhost:3000/signup
2. Click "Sign Up as Client"
3. Fill in the form
4. Submit and verify redirect to dashboard

## Troubleshooting

### 404 Error on /signup
- Restart dev server: `npm run dev`
- Clear `.next` folder: `rm -rf .next`
- Check file exists: `app/(auth)/signup/page.tsx`

### File Upload Errors
- Ensure `public/uploads/lawyers/` directory exists
- Check file size limits
- Verify file types are allowed

### API Errors
- Check browser console for errors
- Verify API endpoint URL in `.env.local`
- Check server logs for backend errors

## Next Steps

1. **Implement Database Integration**
   - Replace mock data with real database calls
   - Add proper error handling

2. **Add Email Verification**
   - Send verification emails
   - Verify email tokens

3. **Implement Admin Panel**
   - Lawyer verification interface
   - User management

4. **Add Authentication Middleware**
   - Protect routes
   - Verify JWT tokens

5. **Production Deployment**
   - Configure environment variables
   - Set up cloud storage
   - Enable HTTPS
   - Add monitoring
