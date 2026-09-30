# 🚀 Production Deployment & Database Setup Guide
## 🌱 FertilizerShop - Fullstack Freelance E-Commerce Platform

This guide explains how to deploy this fullstack application to free cloud hosting platforms (**Render**, **Railway**, or **Vercel**) and connect the **free online database (MongoDB Atlas)** to provide a live production URL to your client.

---

## 🗄️ Part 1: Setting Up the Free Online Database (MongoDB Atlas)

MongoDB Atlas offers a **100% Free Forever Tier (M0 Sandbox)** with 512 MB storage, shared RAM, and SSL encryption. **No credit card is required.**

### Step 1: Create a Free Account
1. Go to [https://www.mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register)
2. Sign up with Google, GitHub, or your email.

### Step 2: Deploy a Free M0 Cluster
1. Choose the **"M0 Free"** tier option.
2. Select your closest Cloud Provider & Region (e.g. AWS / Mumbai `ap-south-1` or Singapore / N. Virginia).
3. Name your cluster (e.g., `FertilizerCluster`).
4. Click **"Create Deployment"**.

### Step 3: Create a Database User
1. Enter a Username: e.g. `agroAdmin`
2. Enter or generate an auto-secure Password: e.g. `AgroSecurePass2026!`
3. Click **"Create Database User"** (keep this password saved).

### Step 4: Configure Network Access (Allow Cloud Hosting)
1. In the left navigation, go to **Security** -> **Network Access**.
2. Click **"+ Add IP Address"**.
3. Select **"Allow Access from Anywhere"** (`0.0.0.0/0`).
   > *Note: This is required so cloud hosting providers (Render, Railway, AWS) can connect to the database.*
4. Click **Confirm**.

### Step 5: Copy Your Connection String
1. Go to **Database** -> Click **"Connect"** on your cluster.
2. Choose **"Drivers"** (Node.js).
3. Copy the connection string:
   ```text
   mongodb+srv://agroAdmin:<password>@fertilizercluster.xxxx.mongodb.net/?retryWrites=true&w=majority
   ```
4. Replace `<password>` with your real database user password, and add `/fertilizer_shop` before `?`:
   ```text
   mongodb+srv://agroAdmin:AgroSecurePass2026!@fertilizercluster.xxxx.mongodb.net/fertilizer_shop?retryWrites=true&w=majority
   ```
5. Paste this connection string into your `.env` file under `MONGODB_URI`.
   > *Note: On startup, the backend automatically seeds all 10+ certified fertilizer products, default admin account, and demo customer orders!*

---

## ☁️ Part 2: Deploying to Free Cloud Hosting (Render.com)

Render provides free hosting for Node.js web services and will host both the frontend and backend under a single production URL (e.g., `https://fertilizer-shop.onrender.com`).

### 1-Click / Repository Deployment:
1. Push this project to GitHub or GitLab:
   ```bash
   git init
   git add .
   git commit -m "feat: complete fullstack fertilizer app"
   git branch -M main
   git remote add origin https://github.com/<your-username>/fertilizer-app.git
   git push -u origin main
   ```
2. Go to [https://render.com](https://render.com) and sign in.
3. Click **"New +"** -> **"Web Service"**.
4. Connect your GitHub repository `fertilizer-app`.
5. Configure the service settings:
   - **Name**: `fertilizer-shop` (or your client's business name)
   - **Environment**: `Node`
   - **Region**: Choose region closest to your client (e.g., Singapore or Frankfurt)
   - **Branch**: `main`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`
6. Add **Environment Variables**:
   - `NODE_ENV`: `production`
   - `JWT_SECRET`: `fertilizer_production_super_secret_key_2026`
   - `MONGODB_URI`: `<Your MongoDB Atlas Connection String from Part 1>`
7. Click **"Deploy Web Service"**.
8. In ~2 minutes, Render will build the React frontend and launch the Node.js backend.
9. **Your Live Production URL** will be displayed at the top:
   `https://fertilizer-shop.onrender.com`

---

## ⚡ Alternative Free Hosting Options

### Option B: Railway.app
1. Go to [railway.app](https://railway.app) and click **"Deploy from GitHub repo"**.
2. Add your environment variables (`MONGODB_URI`, `JWT_SECRET`, `NODE_ENV=production`).
3. Railway automatically detects `Procfile` and assigns a free public domain `*.up.railway.app`.

### Option C: Vercel (Frontend) + Render (Backend)
- If you prefer splitting frontend & backend:
  - Deploy backend on Render (`/api`)
  - Deploy React on Vercel with `REACT_APP_API_URL=https://your-backend.onrender.com/api`

---

## 🔑 Demo & Evaluation Credentials

You and your client can log in using either the **1-Click Demo Buttons** on the Login screen, or manually:

### 👤 Store Administrator
- **Email**: `admin@fertilizershop.com`
- **Password**: `Admin@123`
- **Capabilities**: View sales analytics, change order status (`Placed` -> `Shipped` -> `Delivered`), add/edit products, update inventory stock, reset seed catalog.

### 🌾 Farmer / Customer Account
- **Email**: `farmer@demo.com`
- **Password**: `Farmer@123`
- **Capabilities**: Browse fertilizer catalog, category filters, shopping cart, apply discount codes, checkout with address, real-time consignment order tracking, download invoices.

### 🏷️ Active Promotional Discount Coupons
- `KISAN10`: 10% Farmer Subsidy Discount
- `WELCOME15`: 15% First-time Buyer Discount

---

## 🛠️ Local Development & Running

To run both backend API and React frontend locally:

```bash
# Install all dependencies (Frontend + Backend)
npm install

# Start both servers concurrently (Express on :5000, React on :3000)
npm run dev

# Or run separately:
npm run server   # Starts Express backend at http://localhost:5000
npm run client   # Starts React dev server at http://localhost:3000
```
