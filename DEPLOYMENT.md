# ResumeIQ Deployment Guide

Complete instructions for deploying ResumeIQ to Vercel (Frontend) and Render (Backend).

## 🚀 Backend Deployment on Render

### Prerequisites
- GitHub account with your ResumeParser repository pushed
- Render account (free tier available at https://render.com)
- Gemini API key

### Step 1: Prepare Backend for Deployment

1. Ensure `backend/main.py` is in the correct location
2. Create `backend/requirements.txt`:
```bash
cd backend
pip freeze > requirements.txt
```

3. Or manually create `requirements.txt` with:
```
fastapi==0.104.1
uvicorn==0.24.0
python-dotenv==1.0.0
pdfplumber==0.11.0
python-docx==0.8.11
google-generativeai==0.3.0
```

4. Push to GitHub:
```bash
git add .
git commit -m "Add requirements.txt for deployment"
git push
```

### Step 2: Deploy on Render

1. Visit https://render.com and sign up/login
2. Click **"New +"** → Select **"Web Service"**
3. Connect your GitHub repository:
   - Click "Connect account" if not already connected
   - Select your `ResumeParser` repository
   - Click "Connect"

4. Configure the deployment:
   - **Name:** `resumeiq-backend`
   - **Environment:** `Python 3.10`
   - **Build Command:** `pip install -r backend/requirements.txt`
   - **Start Command:** `cd backend && uvicorn main:app --host 0.0.0.0 --port 8000`
   - **Region:** Choose closest to you

5. Add Environment Variables:
   - Click **"Environment"**
   - Add new variable:
     - **Key:** `GEMINI_API_KEY`
     - **Value:** Your actual Gemini API key
   - Click "Save"

6. Click **"Create Web Service"**
7. Wait for deployment (2-5 minutes)
8. Copy the deployment URL (e.g., `https://resumeiq-backend.onrender.com`)

### Step 3: Update CORS for Frontend

Edit `backend/main.py` to allow Vercel domain:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://resumeiq-frontend.vercel.app",  # Your Vercel URL
        "*"  # Or be more specific
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

Push to GitHub:
```bash
git add .
git commit -m "Update CORS for Vercel deployment"
git push
```

---

## 🎨 Frontend Deployment on Vercel

### Prerequisites
- GitHub account with repository
- Vercel account (free at https://vercel.com)
- Backend URL from Render

### Step 1: Update Frontend API URL

Edit `frontend/src/App.js` and replace the API endpoint:

Find this line:
```javascript
const res = await axios.post("http://localhost:8000/parse_resume/", formData, {
```

Replace with:
```javascript
const res = await axios.post("https://resumeiq-backend.onrender.com/parse_resume/", formData, {
```

Save and push:
```bash
git add .
git commit -m "Update API endpoint for production"
git push
```

### Step 2: Deploy on Vercel

1. Visit https://vercel.com and sign up/login with GitHub
2. Click **"Add New..."** → Select **"Project"**
3. Import your GitHub repository:
   - Find and select `ResumeParser`
   - Click "Import"

4. Configure Project:
   - **Project Name:** `resumeiq-frontend` (or any name)
   - **Framework Preset:** `Create React App`
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`
   - **Install Command:** `npm install`

5. Click **"Deploy"**
6. Wait for deployment (2-5 minutes)
7. Get your live URL (e.g., `https://resumeiq-frontend.vercel.app`)

---

## 🔗 Final Connection

### Update Backend CORS Again (if needed)

If you have the Vercel URL now, update backend/main.py:

```python
allow_origins=[
    "http://localhost:3000",
    "https://resumeiq-frontend.vercel.app",
    "*"
]
```

Push to GitHub (Render will auto-redeploy):
```bash
git add .
git commit -m "Final CORS update with Vercel URL"
git push
```

---

## ✅ Testing Production

1. Visit: `https://resumeiq-frontend.vercel.app`
2. Upload a PDF or DOCX resume
3. Should work seamlessly with backend on Render

---

## 🐛 Troubleshooting

### CORS Error
- Verify Vercel URL is in `allow_origins` in backend
- Restart Render service: Settings → Manual Deploy

### API Not Responding
- Check Render service status: https://render.com/dashboard
- Check logs: Click service → Logs tab
- Verify GEMINI_API_KEY is set in environment variables

### Slow Performance
- Render free tier may sleep after 15 mins of inactivity
- Upgrade to paid plan for always-on service
- Use cron job to keep service alive

### File Upload Issues
- Check file size limits (usually 25MB on Render)
- Ensure timeout is sufficient (set to 60s+ if needed)

---

## 🚀 Alternative: Deploy Backend to Railway

### Step 1: Create Railway Account
Visit https://railway.app and sign up with GitHub

### Step 2: Deploy
1. Click **"New Project"** → **"Deploy from GitHub repo"**
2. Select `ResumeParser` repository
3. Select `backend` folder as root directory
4. Add environment variable:
   - **GEMINI_API_KEY:** Your API key

### Step 3: Get URL
Railway provides a domain automatically

---

## 💰 Cost Breakdown

- **Vercel:** Free tier (excellent for frontend)
- **Render:** Free tier with limitations (sleeps after 15 min inactivity)
- **Railway:** Free credits monthly (~$5 worth)

### Recommended for Production
- **Frontend:** Vercel (always free)
- **Backend:** Railway or Render Paid Plan ($7/month)

---

## 📊 Environment Variables Checklist

### Backend (Render/Railway)
- ✅ `GEMINI_API_KEY` - Your Google Gemini API key

### Frontend (Vercel)
- ✅ Update API URL in `App.js` to production backend URL

---

## 🎯 Quick Reference Commands

```bash
# Build frontend for production
cd frontend
npm run build

# Test build locally
npm run start

# Push all changes
git add .
git commit -m "Production ready"
git push

# Check backend requirements
cd backend
pip freeze > requirements.txt
git add requirements.txt
git commit -m "Update requirements"
git push
```

---

## 📞 Support

For issues:
1. Check Render/Vercel logs
2. Verify environment variables
3. Test API locally before deploying
4. Use Postman to test API endpoint

---

**Your ResumeIQ is now production-ready! 🎉**
