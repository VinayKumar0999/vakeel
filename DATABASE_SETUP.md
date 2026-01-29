# Free Database Setup Guide

## 🏆 Recommended: Supabase (Best Overall)

**Why Supabase?**
- ✅ **PostgreSQL database** (free tier: 500MB storage, unlimited API requests)
- ✅ **Built-in authentication** (can replace custom auth)
- ✅ **File storage included** (1GB free, perfect for lawyer documents)
- ✅ **Real-time subscriptions** (for notifications)
- ✅ **Excellent Next.js integration**
- ✅ **Auto-generated REST API**
- ✅ **Row Level Security** (built-in security)

**Free Tier Limits:**
- 500MB database storage
- 1GB file storage
- 2GB bandwidth/month
- Unlimited API requests
- 50,000 monthly active users

### Setup Steps:

1. **Create Supabase Account**
   - Go to https://supabase.com
   - Sign up (free)
   - Create a new project

2. **Get Connection String**
   - Go to Project Settings → Database
   - Copy the connection string (URI format)

3. **Install Dependencies**
   ```bash
   npm install @supabase/supabase-js
   ```

4. **Create Supabase Client**
   Create `lib/supabase.ts`:
   ```typescript
   import { createClient } from '@supabase/supabase-js'

   const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
   const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

   export const supabase = createClient(supabaseUrl, supabaseAnonKey)
   ```

5. **Environment Variables**
   Add to `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

6. **Database Schema**
   Run this SQL in Supabase SQL Editor:
   ```sql
   -- Users table
   CREATE TABLE users (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     full_name TEXT NOT NULL,
     email TEXT UNIQUE NOT NULL,
     phone TEXT UNIQUE NOT NULL,
     password_hash TEXT NOT NULL,
     role TEXT NOT NULL CHECK (role IN ('CLIENT', 'LAWYER', 'ADMIN')),
     verification_status TEXT DEFAULT 'PENDING' CHECK (verification_status IN ('PENDING', 'APPROVED', 'REJECTED')),
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Lawyer profiles table
   CREATE TABLE lawyer_profiles (
     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
     user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
     bar_council_number TEXT NOT NULL,
     bar_council_state TEXT NOT NULL,
     practice_areas TEXT[] NOT NULL,
     years_of_experience TEXT NOT NULL,
     education TEXT NOT NULL,
     languages TEXT[] NOT NULL,
     bio TEXT NOT NULL,
     consultation_fee DECIMAL(10,2) NOT NULL,
     specializations TEXT[] NOT NULL,
     office_address TEXT NOT NULL,
     city TEXT NOT NULL,
     state TEXT NOT NULL,
     pincode TEXT NOT NULL,
     bar_certificate_path TEXT,
     id_proof_path TEXT,
     profile_photo_path TEXT,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Create indexes
   CREATE INDEX idx_users_email ON users(email);
   CREATE INDEX idx_users_phone ON users(phone);
   CREATE INDEX idx_users_role ON users(role);
   CREATE INDEX idx_lawyer_profiles_user_id ON lawyer_profiles(user_id);
   ```

---

## 🥈 Alternative Option 1: Neon (Serverless PostgreSQL)

**Why Neon?**
- ✅ **Serverless PostgreSQL** (free tier: 0.5GB storage)
- ✅ **Auto-scaling**
- ✅ **Branching** (like Git for databases)
- ✅ **Great for Next.js**

**Free Tier Limits:**
- 0.5GB storage
- Unlimited compute time
- 1 project

### Setup Steps:

1. **Create Neon Account**
   - Go to https://neon.tech
   - Sign up (free)
   - Create a new project

2. **Get Connection String**
   - Copy the connection string from dashboard

3. **Install Dependencies**
   ```bash
   npm install pg @types/pg
   # or use Prisma
   npm install prisma @prisma/client
   ```

4. **Environment Variables**
   ```env
   DATABASE_URL=postgresql://user:password@host.neon.tech/dbname
   ```

---

## 🥉 Alternative Option 2: MongoDB Atlas (NoSQL)

**Why MongoDB?**
- ✅ **NoSQL** (flexible schema)
- ✅ **Free tier: 512MB storage**
- ✅ **Easy to use**
- ⚠️ **Need separate file storage** (use Cloudinary free tier)

**Free Tier Limits:**
- 512MB storage
- Shared cluster

### Setup Steps:

1. **Create MongoDB Atlas Account**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up (free)
   - Create a free cluster

2. **Get Connection String**
   - Click "Connect" → "Connect your application"
   - Copy connection string

3. **Install Dependencies**
   ```bash
   npm install mongodb
   # or use Mongoose
   npm install mongoose
   ```

4. **Environment Variables**
   ```env
   MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/dbname
   ```

---

## 📊 Comparison Table

| Feature | Supabase | Neon | MongoDB Atlas |
|---------|----------|------|---------------|
| Database Type | PostgreSQL | PostgreSQL | MongoDB (NoSQL) |
| Free Storage | 500MB | 0.5GB | 512MB |
| File Storage | ✅ 1GB included | ❌ | ❌ |
| Authentication | ✅ Built-in | ❌ | ❌ |
| Real-time | ✅ | ❌ | ✅ |
| Next.js Integration | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| Best For | Full-stack apps | Serverless apps | Flexible schema |

---

## 🎯 My Recommendation: **Supabase**

For your lawyer/client registration app, **Supabase is the best choice** because:

1. **File Storage Included**: You need to store Bar Certificates, ID Proofs, and Profile Photos. Supabase includes 1GB free storage.

2. **Authentication Ready**: Can use Supabase Auth instead of building custom auth.

3. **PostgreSQL**: Relational database perfect for your data structure (users, lawyer_profiles, relationships).

4. **Easy Integration**: Great Next.js libraries and examples.

5. **Production Ready**: Can scale as you grow.

---

## 🚀 Quick Start with Supabase

### 1. Install Supabase Client
```bash
cd C:\Users\vinay\Documents\WORK\vakeel
npm install @supabase/supabase-js
```

### 2. Create Supabase Client File
Create `lib/supabase.ts`:
```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### 3. Update API Route
I'll create an updated version of the registration route that uses Supabase. Would you like me to create that?

### 4. File Storage Setup
Supabase Storage buckets:
- Create bucket: `lawyer-documents`
- Set policies for authenticated uploads

---

## 📝 Next Steps

1. **Choose your database** (I recommend Supabase)
2. **Set up account** and get credentials
3. **Run database schema** (SQL provided above)
4. **Update API route** to use database
5. **Configure file storage** (if using Supabase)

Would you like me to:
- Create the Supabase integration code?
- Update the registration API route to use Supabase?
- Add file upload handling with Supabase Storage?
