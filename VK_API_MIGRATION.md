# VK Backend API Migration to Next.js

This document describes the complete migration of the VK Go backend API endpoints to Next.js API routes.

## 📋 Overview

All API endpoints from the VK Go backend have been successfully migrated to Next.js. The APIs are available under the `/api/vk/` prefix.

## 🗄️ Database Setup

### Step 1: Run the Migration

Execute the SQL migration script to create all necessary tables in your Supabase database:

```bash
# Option 1: Using Supabase CLI (recommended)
cd vakeel
supabase db push

# Option 2: Manual - Copy and execute the SQL file
# Go to Supabase Dashboard > SQL Editor
# Copy contents from: supabase/migrations/001_vk_backend_schema.sql
# Execute the script
```

### Step 2: Verify Tables

After running the migration, verify these tables exist in your Supabase database:
- `advocates` - Service providers
- `clients` - Service consumers
- `sessions` - Authentication tokens
- `calls` - Video/voice call records
- `payments` - Payment transactions
- `outbox_events` - Event processing
- `idempotency_keys` - Idempotent operations

## 🔐 Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <token>
```

You receive a token after successful login (advocate or client).

## 📡 API Endpoints

### Authentication Endpoints

#### 1. Register Advocate (POST)
```
POST /api/vk/auth/advocate/register

Body:
{
  "email": "advocate@example.com",
  "password": "password123",
  "name": "John Doe"
}

Response:
{
  "id": 1,
  "email": "advocate@example.com",
  "name": "John Doe",
  "availability": "available",
  "uuid": "...",
  "earnings": 0,
  "hourly_rate": 0,
  "created_at": "...",
  "updated_at": "..."
}
```

#### 2. Login Advocate (POST)
```
POST /api/vk/auth/advocate/login

Body:
{
  "email": "advocate@example.com",
  "password": "password123"
}

Response:
{
  "id": 1,
  "email": "advocate@example.com",
  "name": "John Doe",
  "token": "advocate_1_...",
  ...
}
```

#### 3. Register Client (POST)
```
POST /api/vk/auth/client/register

Body:
{
  "email": "client@example.com",
  "password": "password123",
  "name": "Jane Smith"
}
```

#### 4. Login Client (POST)
```
POST /api/vk/auth/client/login

Body:
{
  "email": "client@example.com",
  "password": "password123"
}

Response includes token for authentication
```

### Advocate Endpoints (Protected)

#### 5. Update Availability (PUT)
```
PUT /api/vk/advocate/availability
Authorization: Bearer <advocate_token>

Body:
{
  "availability": "available" | "busy" | "offline"
}
```

#### 6. Get Profile (GET)
```
GET /api/vk/advocate/profile
Authorization: Bearer <advocate_token>
```

#### 7. Get Earnings (GET)
```
GET /api/vk/advocate/earnings
Authorization: Bearer <advocate_token>

Response:
{
  "earnings": 1250.50,
  "hourly_rate": 50.00
}
```

#### 8. Update Profile Image (PUT)
```
PUT /api/vk/advocate/profile-image
Authorization: Bearer <advocate_token>

Body:
{
  "profile_image": "https://example.com/image.jpg"
}
```

### Client Endpoints (Protected)

#### 9. Get Available Users (GET)
```
GET /api/vk/client/available-users?availability=available&location=Mumbai&min_rate=20&max_rate=100
Authorization: Bearer <client_token>

Query Parameters:
- availability: "available" | "all"
- location: string (optional)
- min_rate: number (optional)
- max_rate: number (optional)

Response:
{
  "users": [...],
  "count": 5
}
```

#### 10. Get Advocate Schedule (GET)
```
GET /api/vk/client/advocate/123/schedule?from=2026-01-01&to=2026-01-31
Authorization: Bearer <client_token>

Query Parameters:
- from: ISO date string (optional)
- to: ISO date string (optional)
```

#### 11. Update Client Profile Image (PUT)
```
PUT /api/vk/client/profile-image
Authorization: Bearer <client_token>

Body:
{
  "profile_image": "https://example.com/image.jpg"
}
```

### Payment Endpoints (Protected - Client Only)

#### 12. Initiate Payment (POST)
```
POST /api/vk/client/payment/initiate
Authorization: Bearer <client_token>

Body:
{
  "advocate_id": 1,
  "amount": 100.00
}

Response:
{
  "id": 1,
  "transaction_id": "txn_...",
  "status": "pending",
  "amount": 100.00,
  "advocate_commission": 80.00,
  "platform_fee": 20.00,
  ...
}
```

#### 13. Verify Payment (POST)
```
POST /api/vk/client/payment/verify
Authorization: Bearer <client_token>

Body:
{
  "transaction_id": "txn_..."
}

Response:
{
  "id": 1,
  "status": "completed",
  ...
}
```

### Call Endpoints (Protected)

#### 14. Initiate Call (POST)
```
POST /api/vk/calls/initiate
Authorization: Bearer <token>

Body:
{
  "receiver_id": 2
}

Response:
{
  "id": 1,
  "caller_id": 1,
  "caller_type": "client",
  "receiver_id": 2,
  "receiver_type": "advocate",
  "status": "initiated",
  ...
}
```

#### 15. Accept Call (POST)
```
POST /api/vk/calls/accept
Authorization: Bearer <token>

Body:
{
  "call_id": 1
}
```

#### 16. End Call (POST)
```
POST /api/vk/calls/end
Authorization: Bearer <token>

Body:
{
  "call_id": 1
}

Response:
{
  "id": 1,
  "status": "ended",
  "duration": 360,
  ...
}
```

#### 17. Get WebRTC Token (GET)
```
GET /api/vk/calls/token?call_id=1
Authorization: Bearer <token>

Response:
{
  "token": "eyJhbGc...",
  "call_id": 1,
  "expires_at": "2026-02-12T13:30:00Z",
  "ice_servers": [...]
}
```

### LLM Endpoints

#### 18. Chat (POST - Protected)
```
POST /api/vk/llm/chat
Authorization: Bearer <token>

Body:
{
  "message": "Hello, I need legal advice",
  "history": [
    { "role": "user", "content": "..." },
    { "role": "assistant", "content": "..." }
  ]
}

Note: This is currently a placeholder. Integrate with OpenAI/Anthropic for production use.
```

#### 19. LLM Health Check (GET)
```
GET /api/vk/llm/health

Response:
{
  "status": "ok",
  "service": "llm_service",
  "timestamp": "..."
}
```

### Health Check Endpoints

#### 20. Health Check (GET)
```
GET /api/vk/health

Response:
{
  "status": "ok",
  "service": "vk_backend",
  "timestamp": "..."
}
```

## 🧪 Testing the APIs

### Using cURL

```bash
# Register an advocate
curl -X POST http://localhost:3000/api/vk/auth/advocate/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test Advocate"}'

# Login
curl -X POST http://localhost:3000/api/vk/auth/advocate/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get profile (use token from login response)
curl -X GET http://localhost:3000/api/vk/advocate/profile \
  -H "Authorization: Bearer advocate_1_..."
```

### Using Postman

1. Import the endpoints into Postman
2. Set up environment variables:
   - `base_url`: http://localhost:3000
   - `advocate_token`: (get from login response)
   - `client_token`: (get from login response)
3. Test each endpoint sequentially

## 🚀 Running the Application

```bash
# 1. Install dependencies
cd vakeel
npm install

# 2. Set up environment variables
# Make sure .env.local has:
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY
# - SUPABASE_SERVICE_ROLE_KEY
# - JWT_SECRET

# 3. Run database migrations (see Database Setup above)

# 4. Start the development server
npm run dev

# 5. The API will be available at:
# http://localhost:3000/api/vk/...
```

## 📦 Features Migrated

✅ Authentication (Register/Login for Advocates & Clients)
✅ Session Management
✅ Advocate Service (Profile, Availability, Earnings)
✅ Client Service (Available Users, Schedule, Profile)
✅ Payment Service (Initiate, Verify)
✅ Call Service (Initiate, Accept, End)
✅ WebRTC Service (Token Generation, ICE Servers)
✅ Health Check Endpoints
✅ LLM Chat Endpoint (Placeholder)

## 🔜 Not Yet Implemented

⚠️ Google OAuth (needs OAuth provider setup)
⚠️ WebSocket Signaling (requires WebSocket server setup)
⚠️ Redis Integration (optional for caching)
⚠️ Actual LLM Integration (OpenAI/Anthropic)
⚠️ Payment Gateway Integration (Stripe/Razorpay)
⚠️ Metrics/Prometheus endpoints

## 🔧 Environment Variables Needed

```env
# Supabase (Database)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx

# JWT
JWT_SECRET=your-secret-key-here-change-in-production

# Optional: TURN server for WebRTC
TURN_SERVER=turn:your-turn.com
TURN_USERNAME=user
TURN_PASSWORD=pass

# Optional: LLM providers
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...

# Optional: Payment gateways
STRIPE_SECRET_KEY=sk_test_...
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
```

## 📝 Notes

1. **Security**: All passwords are hashed using bcrypt before storage
2. **Sessions**: Tokens expire after 24 hours
3. **Payments**: Platform takes 20% commission (configurable)
4. **WebRTC**: Tokens are valid for 1 hour
5. **Database**: All tables have automatic `updated_at` triggers

## 🐛 Troubleshooting

### Database Connection Issues
- Verify Supabase credentials in `.env.local`
- Check if migrations ran successfully
- Ensure tables exist in Supabase dashboard

### Authentication Errors
- Verify JWT_SECRET is set
- Check token format: `Bearer <token>`
- Ensure user exists and credentials are correct

### API Errors
- Check Next.js console for error logs
- Verify request body matches expected format
- Ensure proper authorization headers

## 📚 Additional Resources

- Next.js API Routes: https://nextjs.org/docs/app/building-your-application/routing/route-handlers
- Supabase Docs: https://supabase.com/docs
- WebRTC Guide: https://webrtc.org/getting-started/overview

## ✅ Migration Complete!

All core API endpoints from the VK Go backend have been successfully migrated to Next.js. The application is ready for testing and deployment.
