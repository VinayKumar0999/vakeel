# Install Dependencies

## 🔧 Fix Build Error

The build is failing because dependencies aren't installed. Run:

```bash
npm install
```

This will install:
- `@supabase/supabase-js` - Supabase client
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT tokens
- `@types/bcryptjs` - TypeScript types
- `@types/jsonwebtoken` - TypeScript types

## ✅ After Installation

Once `npm install` completes:

1. **Try build again**:
   ```bash
   npm run build
   ```

2. **Or start dev server**:
   ```bash
   npm run dev
   ```

## 🎯 Quick Fix

Just run this command:

```bash
npm install
```

Then test with:

```bash
npm run dev
```

---

**That's it!** The dependencies will be installed and your build should work! 🚀
