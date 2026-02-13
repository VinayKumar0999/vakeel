# Quick Start: VK API Migration

## 🚀 Get Started in 3 Minutes

### Step 1: Run Database Migration

1. Open Supabase Dashboard: https://supabase.com/dashboard
2. Go to your project → SQL Editor
3. Copy and paste the contents of `supabase/migrations/001_vk_backend_schema.sql`
4. Click "Run"
5. Verify tables were created (you should see: advocates, clients, sessions, calls, payments)

### Step 2: Test Registration & Login

```bash
# 1. Register an advocate
curl -X POST http://localhost:3000/api/vk/auth/advocate/register \
  -H "Content-Type: application/json" \
  -d '{"email":"advocate@test.com","password":"test123","name":"Test Advocate"}'

# 2. Login to get token
curl -X POST http://localhost:3000/api/vk/auth/advocate/login \
  -H "Content-Type: application/json" \
  -d '{"email":"advocate@test.com","password":"test123"}'

# Copy the "token" from the response
```

### Step 3: Test Protected Endpoints

```bash
# Replace YOUR_TOKEN with the token from Step 2

# Get advocate profile
curl -X GET http://localhost:3000/api/vk/advocate/profile \
  -H "Authorization: Bearer YOUR_TOKEN"

# Update availability
curl -X PUT http://localhost:3000/api/vk/advocate/availability \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"availability":"available"}'
```

## 📋 All Available Endpoints

### Authentication (No token required)
- `POST /api/vk/auth/advocate/register`
- `POST /api/vk/auth/advocate/login`
- `POST /api/vk/auth/client/register`
- `POST /api/vk/auth/client/login`

### Advocate (Requires advocate token)
- `PUT /api/vk/advocate/availability`
- `GET /api/vk/advocate/profile`
- `GET /api/vk/advocate/earnings`
- `PUT /api/vk/advocate/profile-image`

### Client (Requires client token)
- `GET /api/vk/client/available-users`
- `GET /api/vk/client/advocate/:id/schedule`
- `PUT /api/vk/client/profile-image`
- `POST /api/vk/client/payment/initiate`
- `POST /api/vk/client/payment/verify`

### Calls (Requires any token)
- `POST /api/vk/calls/initiate`
- `POST /api/vk/calls/accept`
- `POST /api/vk/calls/end`
- `GET /api/vk/calls/token`

### LLM & Health
- `POST /api/vk/llm/chat`
- `GET /api/vk/llm/health`
- `GET /api/vk/health`

## ✅ What's Working

- ✅ Complete authentication system
- ✅ Advocate management
- ✅ Client management
- ✅ Payment initiation & verification
- ✅ Call management (initiate, accept, end)
- ✅ WebRTC token generation
- ✅ Session-based auth with automatic expiration
- ✅ All database tables with indexes and triggers

## ⚠️ What Needs Configuration

- Google OAuth (needs OAuth credentials)
- WebSocket signaling (needs WS server)
- Actual payment gateway (Stripe/Razorpay keys)
- LLM integration (OpenAI/Anthropic keys)
- Redis caching (optional)

## 📖 Full Documentation

See `VK_API_MIGRATION.md` for complete API documentation with request/response examples.

## 🎉 You're Ready!

Your VK backend APIs are now running in Next.js. Start building your frontend!
