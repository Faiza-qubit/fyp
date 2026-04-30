# Deployment Guide

## 🚀 **Quick Start**

This app has **three parts** that deploy separately:
1. **Frontend** (React/Vite) → Vercel
2. **Backend** (Express/Node) → Railway/Render/Heroku
3. **Database** (MongoDB) → Already on MongoDB Atlas ✅
4. **Python Models** → Optional (deploy with backend or separately)

---

## **Part 1: Deploy Frontend to Vercel** 

### Step 1: Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub, GitLab, or email
3. Install Vercel CLI (optional):
   ```bash
   npm install -g vercel
   ```

### Step 2: Create `.vercelignore`
In the root folder (`fyp/`), create:

```
backend/
Foot-Detection-Model/
tryon-measurement/
node_modules
.git
```

### Step 3: Create Vercel Config
Create `vercel.json` in root:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build",
      "config": { "distDir": "dist" }
    }
  ],
  "routes": [
    {
      "src": "^/(.*)$",
      "dest": "frontend/dist/index.html"
    }
  ]
}
```

### Step 4: Deploy
**Option A: Git Push (Automatic)**
```bash
cd c:\Users\Muneeb\Desktop\FYP\fyp
git push  # Vercel auto-deploys on push if linked
```

**Option B: Vercel CLI**
```bash
vercel --prod
```

### Step 5: Set Environment Variables on Vercel
1. Go to Vercel Dashboard → Project Settings → Environment Variables
2. Add:
   ```
   VITE_API_BASE_URL=https://your-backend-url.com/api
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY
   ```

---

## **Part 2: Deploy Backend to Railway/Render**

### Option A: **Railway** (Recommended - Easy)

#### Step 1: Create Railway Account
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Create new project

#### Step 2: Connect GitHub
1. Click "Deploy from GitHub"
2. Select your FYP repository
3. Select the `backend` folder as root

#### Step 3: Add Environment Variables
In Railway Dashboard → Variables:
```
MONGO_URI=mongodb+srv://muneebamir067_db_user:wazX5Rt2@cluster0.cpconco.mongodb.net/
PORT=5000
JWT_SECRET=Qx9mN2vL8kR4yH7tB3sF6pW1jC5dZ0uA_MeTqYn8Gf4Kx2Pz7rV1hJ6bD3cL9sU
JWT_REFRESH_SECRET=Zr5Tn1kV8pQ3hM7yB2dF9sL4wC6jX0uA_NeGqYt8Kf1Px3Rz7vH2mJ5bD4cL9sW
STRIPE_SECRET_KEY=sk_test_YOUR_ACTUAL_KEY
CORS_ORIGIN=https://your-vercel-frontend-url.vercel.app
```

#### Step 4: Deploy
Railroad auto-deploys when you push to `main`. Your backend URL will be like:
```
https://your-app-name-prod.up.railway.app
```

---

### Option B: **Render.com** (Free Alternative)

#### Step 1: Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Create new Web Service

#### Step 2: Connect Repository
1. Click "New +" → Web Service
2. Select repository
3. Set Build Command: `npm install`
4. Set Start Command: `npm run dev` or `node src/index.js`
5. Select Instance Type: **Free** tier

#### Step 3: Add Env Vars
Same as Railway (see above)

#### Step 4: Deploy
Push to GitHub → Render auto-deploys

Your URL will be like:
```
https://your-app-name.onrender.com
```

---

## **Part 3: Update Frontend with Backend URL**

Once backend is deployed:

1. **Get your backend URL** (from Railway/Render dashboard)
2. **Update Vercel env var**:
   - Vercel Dashboard → Project Settings → Environment Variables
   - Set `VITE_API_BASE_URL=https://your-backend-url.com/api`
   - Redeploy (Vercel will auto-redeploy on env change)

3. **Or update locally and push**:
   ```bash
   # Create .env.local in frontend/
   VITE_API_BASE_URL=https://your-backend-url.com/api
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY
   ```

---

## **Part 4: Test the Deployment**

1. **Frontend**: Open `https://your-vercel-app.vercel.app`
2. **Login**: Try signup/login
3. **API Call**: Check browser console (F12) for any CORS errors
4. **Payment**: Test with card `4242 4242 4242 4242`

---

## **Troubleshooting**

### **CORS Error**
```
Access to XMLHttpRequest at 'https://backend.com' from origin 'https://frontend.vercel.app' 
has been blocked by CORS policy
```

**Fix**: In backend `.env`, set:
```
CORS_ORIGIN=https://your-vercel-frontend.vercel.app
```

### **Blank Page on Vercel**
- Check `vercel.json` is in root folder
- Run `npm run build` locally to test
- Check build output folder is `frontend/dist`

### **Backend Not Responding**
- Verify `CORS_ORIGIN` is set correctly
- Check backend logs on Railway/Render
- Verify MongoDB URI is correct

---

## **Part 5: Python Models** (Optional)

If you need to deploy the foot detection or try-on models:

### Option A: Include in Node Backend
1. Install Python in backend server
2. Call models from Express routes using `child_process.exec()`
3. Deploy together on Railway/Render

### Option B: Separate Python Deployment
1. Deploy to **Hugging Face Spaces** (free) or **Heroku**
2. Call via API from Node backend
3. Set Python API URL in backend `.env`

---

## **Final Checklist**

- [ ] Frontend builds locally: `npm run build`
- [ ] Backend .env has all secrets
- [ ] MongoDB connection tested
- [ ] Stripe keys added
- [ ] Backend deployed (Railway/Render)
- [ ] Frontend deployed (Vercel)
- [ ] CORS_ORIGIN set on backend
- [ ] VITE_API_BASE_URL set on frontend
- [ ] Test login flow end-to-end
- [ ] Test payment with test card

---

## **Useful Links**

- [Vercel Docs](https://vercel.com/docs)
- [Railway Docs](https://docs.railway.app)
- [Render Docs](https://render.com/docs)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Stripe Dashboard](https://dashboard.stripe.com)
