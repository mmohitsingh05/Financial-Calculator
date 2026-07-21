# 📊 Premium Personal Finance Calculator & AI Wealth Advisory Suite

Welcome to the **Personal Finance Calculator & AI Wealth Advisory Suite**—a highly polished, modern single-page application built with **React**, **Vite**, and **Tailwind CSS**. It is equipped with interactive financial calculators, high-contrast dynamic charting, and a secure serverless AI engine powered by Gemini (via OpenRouter API).

This suite is fully optimized for **GitHub push** and automated deployment on **Cloudflare Pages** (using Cloudflare Pages Functions for secure serverless API management).

---

## ✨ Features

- **Interactive Financial Calculators**:
  - **Asset Growth Projector**: A clean, pre-calculated baseline model on the home hero section.
  - **Compound Interest Calculator**: Deep projection with monthly dynamic contribution modeling.
  - **Retirement Planner**: Determine target nest eggs and monthly milestones.
  - **Inflation Calculator**: Project buying-power degradation over custom time horizons.
- **Dynamic Charting**: High-fidelity, responsive visuals charting principal investments vs. compounded interest.
- **AI-Powered Wealth Strategy**: Instant EEAT-compliant custom financial roadmaps, pitfall analyses, and professional display quotes of wealth wisdom tailored to calculated outcomes.
- **Zero-Key Leakage Security**: Utilizes serverless endpoints to communicate with OpenRouter securely—never exposing secrets in client-side bundles.

---

## 🛠️ Project Structure

```bash
├── functions/                     # Cloudflare Pages Functions (Serverless Backend)
│   └── api/
│       ├── health.ts              # System health check endpoint
│       └── calculator/
│           └── strategy.ts        # OpenRouter API proxy for secure AI calculations
├── src/                           # Client-side React application
│   ├── components/                # Modular UI components (Calculators, charts, advisory modals)
│   ├── App.tsx                    # Core application layout and routing
│   ├── index.css                  # Global Tailwind CSS and fonts configuration
│   └── main.tsx                   # SPA React mount entrypoint
├── public/
│   └── _redirects                 # Router fallback configurations for Cloudflare SPA hosting
├── .env.example                   # Schema for local environment configuration variables
├── DEPLOYMENT.md                  # Comprehensive step-by-step deploy instructions
└── vite.config.ts                 # Fast Vite bundle config
```

---

## 🚀 Local Development Setup

To run this project locally on your machine, follow these simple steps:

### 1. Clone & Extract
Unpack your project files into your chosen local development directory.

### 2. Install Dependencies
Run the package installation command of your choice in your root directory:
```bash
npm install
# or
bun install
```

### 3. Setup Environment Variables
Create a `.env` file at the root of your project:
```bash
cp .env.example .env
```
Open `.env` and fill in your OpenRouter API details:
```env
OPENROUTER_API_KEY=your-sk-or-api-key-here
OPENROUTER_MODEL=google/gemini-2.5-flash:free
APP_URL=http://localhost:3000
```

### 4. Run Development Server
Boot up the fast local development server:
```bash
npm run dev
# or
bun run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## ☁️ Deployment on Cloudflare Pages

We have pre-configured everything needed for an effortless deploy:

1. **GitHub Upload**: Push your code to a clean GitHub repository.
2. **Connect to Pages**: Log into the [Cloudflare Dashboard](https://dash.cloudflare.com/), navigate to **Workers & Pages**, and choose **Connect to Git**.
3. **Configure Build Settings**:
   - **Framework Preset**: `Vite` (or custom configuration)
   - **Build Command**: `npm run build`
   - **Build Output Directory**: `dist`
4. **Environment Variables**: Add your `OPENROUTER_API_KEY` directly inside Cloudflare dashboard's project settings (Settings > Environment Variables) to protect your secret credentials.

*For detailed, step-by-step illustrations of the deployment pipeline, please refer to [DEPLOYMENT.md](./DEPLOYMENT.md).*

---

## 📄 License & Compliance

This tool is created as an educational wealth simulator. Calculated projections represent hypothetical scenarios and do not constitute formal, licensed financial advice.
