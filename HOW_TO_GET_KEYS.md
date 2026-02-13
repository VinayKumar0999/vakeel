# 🔑 How to Get Your Supabase API Keys

## ✅ You Already Have:
- **Project URL**: `https://aauhslzeeibhnykiqzja.supabase.co` ✅

## ⚠️ Important: About the Password

The **password** you got is the **database password** - this is for direct database connections. **You don't need it** for our Next.js API integration.

Instead, we use **API keys** which are safer and easier.

---

## 📍 Step-by-Step: Get Your API Keys

### Step 1: Open Supabase Dashboard
1. Go to https://supabase.com/dashboard
2. Click on your project: `aauhslzeeibhnykiqzja`

### Step 2: Go to Project Settings
1. Look at the **left sidebar**
2. Click the **⚙️ Gear icon** at the bottom
3. Click **"Project Settings"**

### Step 3: Go to API Section
1. In the left menu, click **"API"**
2. You'll see a page with your project details

### Step 4: Find Your Keys

You'll see **3 important values**:

#### 1. **Project URL** ✅ (You already have this)
```
https://aauhslzeeibhnykiqzja.supabase.co
```

#### 2. **anon public** key (Long string starting with `eyJ...`)
- This is labeled as **"anon"** or **"public"**
- It's a very long string (looks like: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)
- ✅ **Safe to use in client-side code**
- Copy this → This is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`

#### 3. **service_role** key (Another long string)
- This is labeled as **"service_role"**
- Also a long string (similar format)
- ⚠️ **KEEP THIS SECRET** - Never expose in browser
- Copy this → This is your `SUPABASE_SERVICE_ROLE_KEY`

---

## 📝 Update Your .env.local File

I've created `.env.local` with your project URL. Now:

1. **Open** `.env.local` file
2. **Replace** these placeholders:
   ```env
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
   ```
3. **Paste** your actual keys:
   ```env
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (your actual key)
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (your actual key)
   ```

---

## 🎯 Visual Guide

In Supabase Dashboard → Project Settings → API, you'll see:

```
┌─────────────────────────────────────────┐
│ Project API keys                        │
├─────────────────────────────────────────┤
│                                         │
│ Project URL                             │
│ https://aauhslzeeibhnykiqzja.supabase.co│ ✅ You have this
│                                         │
│ anon public                             │
│ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... │ ⬅️ Copy this!
│                                         │
│ service_role                            │
│ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... │ ⬅️ Copy this!
│                                         │
└─────────────────────────────────────────┘
```

---

## ✅ Quick Checklist

- [x] Project URL added to `.env.local`
- [ ] Get anon key from Supabase dashboard
- [ ] Get service_role key from Supabase dashboard
- [ ] Paste both keys into `.env.local`
- [ ] Save `.env.local` file
- [ ] Restart dev server (`npm run dev`)

---

## 🔒 Security Notes

- ✅ **anon key** → Safe to use anywhere (client-side is fine)
- ⚠️ **service_role key** → **NEVER** expose in browser, only use in API routes
- ✅ `.env.local` → Already in `.gitignore` (won't be committed to git)
- ✅ The **database password** you got → Not needed, keep it safe but don't use it in code

---

## 🚀 After Adding Keys

1. **Restart your dev server**:
   ```bash
   npm run dev
   ```

2. **Test it**:
   - Go to http://localhost:3000/signup/lawyer
   - Fill the form
   - Submit registration
   - Check Supabase dashboard → Table Editor → `users` table
   - You should see your new user! 🎉

---

## 🆘 Can't Find the Keys?

If you can't find the API keys:
1. Make sure you're in the **correct project**
2. Check you're in **Project Settings** → **API** (not Database)
3. Look for sections labeled "Project API keys" or "API Keys"
4. The keys are long strings starting with `eyJ...`

---

**Once you add the keys, you're all set!** 🚀
