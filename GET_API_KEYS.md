# How to Get Your Supabase API Keys

## ✅ You Have:
- **Project URL**: `https://aauhslzeeibhnykiqzja.supabase.co` ✅
- **Database Password**: (This is for direct database access, not needed for our API)

## 🔑 What You Need:

You need **2 API keys** (not the database password):

1. **Anon/Public Key** - Safe to use in client-side code
2. **Service Role Key** - Secret key for server-side (API routes)

---

## 📍 How to Get Your API Keys:

### Step 1: Go to Project Settings
1. In your Supabase dashboard
2. Click the **⚙️ Gear icon** (bottom left) → **Project Settings**

### Step 2: Go to API Section
1. Click **API** in the left sidebar
2. You'll see a page with your keys

### Step 3: Copy These Values:

**1. Project URL** (you already have this):
```
https://aauhslzeeibhnykiqzja.supabase.co
```

**2. anon public key** (looks like this):
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFhdWhzbHplZWliaG55a2lxemphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU0MjM0NTAsImV4cCI6MjA1MTAwOTQ1MH0.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```
- This is the **long string** under "Project API keys"
- Labeled as **"anon"** or **"public"**
- ✅ Safe to expose in client-side code

**3. service_role key** (looks similar but different):
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFhdWhzbHplZWliaG55a2lxemphIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNTQyMzQ1MCwiZXhwIjoyMDUxMDA5NDUwfQ.yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy
```
- This is the **long string** labeled as **"service_role"**
- ⚠️ **KEEP THIS SECRET** - Never expose in client-side code
- Only use in API routes (server-side)

---

## 📝 Where to Put Them:

Create a file called `.env.local` in your project root:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://aauhslzeeibhnykiqzja.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=paste-your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=paste-your-service-role-key-here
```

---

## 🔒 About the Database Password:

The **database password** you got is for:
- Direct PostgreSQL connections
- Database management tools (like pgAdmin)
- **NOT needed** for our Next.js API integration

We use **API keys** instead, which are safer and easier to use.

---

## ✅ Quick Checklist:

- [ ] Go to Project Settings → API
- [ ] Copy **anon public key**
- [ ] Copy **service_role key**
- [ ] Create `.env.local` file
- [ ] Paste all 3 values
- [ ] Restart dev server (`npm run dev`)

---

## 🚨 Security Reminder:

- ✅ **anon key** → Safe for client-side (browser)
- ⚠️ **service_role key** → NEVER expose in browser, only server-side
- ✅ `.env.local` → Already in `.gitignore` (won't be committed)

---

## 🎯 After Adding Keys:

1. **Restart your dev server**:
   ```bash
   npm run dev
   ```

2. **Test registration**:
   - Go to http://localhost:3000/signup/lawyer
   - Fill the form
   - Submit
   - Check Supabase dashboard to see the data!

---

**Need help?** Check `SUPABASE_SETUP.md` for more details!
