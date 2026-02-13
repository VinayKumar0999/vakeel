# Advocate registration script

Register an advocate (lawyer) via the API using a JSON body (no file uploads).

## Body file

- **`advocate-register-body.json`** – Sample advocate payload. Change `email` and `phone` if they are already registered.

Required fields:

- `fullName`, `email`, `phone`, `password`, `role` (use `"LAWYER"`)
- `barCouncilNumber`, `barCouncilState`
- `practiceAreas` (array), `yearsOfExperience`, `education`, `languages` (array)
- `bio` (min 50 characters), `consultationFee`, `specializations` (array)
- `officeAddress`, `city`, `state`, `pincode`

## Register

**PowerShell (Windows):**

```powershell
cd c:\Users\vinay\Documents\WORK\vakeel
.\scripts\register-advocate.ps1
# Or with custom base URL:
.\scripts\register-advocate.ps1 -BaseUrl "http://localhost:3000"
```

**Bash (Git Bash / WSL / macOS):**

```bash
cd /path/to/vakeel
./scripts/register-advocate.sh http://localhost:3000
```

**curl (any OS):**

```bash
curl -X POST "http://localhost:3000/api/auth/register" \
  -H "Content-Type: application/json" \
  -d @scripts/advocate-register-body.json
```

Ensure the dev server is running (`npm run dev`) and that `email` / `phone` in the JSON are not already in use.
