# Deployment Guide: GitHub & Cloudflare Pages 🚀

Aapke personal finance calculator project ko **GitHub** aur fir **Cloudflare Pages** per host krne ke liye humne saari configuration files successfully taiyar kr di hain! 

Kyuki ye ek React (Vite) SPA hai jisme AI strategies generate krne ke liye server-side routing (OpenRouter API) ka use hota hai, humne **Cloudflare Pages Functions** ka integration kra hai. Isse aapko koi alag se Node.js server container run krne ki zarurat nahi padegi—Cloudflare isse bilkul free aur secure edge functions ke throw serve krega!

---

## Step 1: Code ko GitHub pr Push krein 💻

1. **Local System pr files extract krein**:
   AI Studio UI me top right settings menu se project ko **ZIP/GitHub** export kr ke local computer me save aur extract krein.

2. **Git Initialize aur Commit krein**:
   Apne terminal/command prompt ko project root directory me open krein aur ye commands run krein:
   ```bash
   # Git repository initialize krein
   git init

   # Saari files add krein (.gitignore already configured hai dist/ aur node_modules/ ko filter krne ke liye)
   git add .

   # Initial commit krein
   git commit -m "Configure financial suite for Cloudflare Pages hosting"
   ```

3. **GitHub Repository pr Push krein**:
   - GitHub pr ek naya blank repository create krein (do not add README, .gitignore or license there).
   - Apne repository ki URL copy krein aur ye commands run krein:
   ```bash
   # Main branch select krein
   git branch -M main

   # Apne remote GitHub repository ko add krein
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

   # Code push krein
   git push -u origin main
   ```

---

## Step 2: Cloudflare Pages pr Host krein ☁️

1. **Cloudflare Dashboard open krein**:
   [Cloudflare Dashboard](https://dash.cloudflare.com/) pr login krein aur sidebar me **Workers & Pages** tab pr click krein.

2. **Naya Pages Project create krein**:
   - **Create application** button pr click krein.
   - **Pages** tab select krein aur **Connect to Git** button pr click krein.
   - Apne GitHub account ko link krein aur abhi push ki gyi repository select krein.

3. **Build Settings Configure krein**:
   Aapke build pipeline ke liye ye exact options fill krein:
   - **Framework Preset**: `Vite` (agar option list me ho, nahi toh manually configure krein)
   - **Build Command**: `npm run build`
   - **Build Output Directory**: `dist`
   - **Root directory**: `/` (leave empty/default)

4. **Deploy krein**:
   **Save and Deploy** button pr click krein. Cloudflare aapke pure static assets ko compile kr ke production CDN pr host kr dega aur **Cloudflare Pages Functions** (/functions directory) ke serverless backends automatically deploy ho jayenge!

---

## Step 3: Environment Variables Set krein (Secrets Security) 🔑

Vite single-page applications browser me execute hoti hain, isliye keys chupani zaruri hai. Humne serverless backend setup kra hai jo direct Cloudflare safe storage se key fetch krega:

1. Cloudflare Pages dashboard me apne project page pr **Settings** tab me jayein.
2. Left sidebar me **Environment variables** pr click krein.
3. **Production** aur **Preview** dono settings me ye variables add krein:
   
   | Variable Name | Value | Description |
   | :--- | :--- | :--- |
   | `OPENROUTER_API_KEY` | `sk-or-xxxx...` | Aapka OpenRouter actual secret API key. |
   | `OPENROUTER_MODEL` | `google/gemini-2.5-flash:free` | (Optional) Jo AI Model aap response ke liye use krna chahein. |
   | `APP_URL` | `https://your-custom-domain.pages.dev` | (Optional) Aapke pages.dev ka live absolute URL. |

4. Environment variables save krne ke baad, **Deployments** tab me jaakar last build ke options se **Redeploy** button click kr deing, taaki nayi settings apply ho sakein.

---

## Key Technical Assets Created for Deployment 📂

- 📁 `/functions/api/health.ts`: Cloudflare native edge function for checking system status.
- 📁 `/functions/api/calculator/strategy.ts`: Secure edge API function utilizing OpenRouter API, avoiding key leakage to client browsers.
- 📄 `/public/_redirects`: URL redirection system ensuring client-side SPA routing (`#/` hashes and relative direct loads) works flawlessly without 404s.

*Aapka code perfectly configured aur compile-ready hai! Jab bhi aap ise push krenge, ye automatic deploy ho jayega!* 🎉
