# 🔴 Network Error - How to Fix

## The Problem

When you click "Complete Payment", you get a network error because **your Stripe Secret Key is just a placeholder**.

## Solution - Get Real Stripe Keys

### Step 1: Sign Up for Stripe
1. Go to https://stripe.com/
2. Click "Sign up" (or sign in if you have an account)
3. Create an account with your business email

### Step 2: Get Your API Keys
1. Go to https://dashboard.stripe.com/
2. Click "Developers" in the left sidebar
3. Click "API keys" 
4. You'll see two keys:
   - **Secret Key** - starts with `sk_test_`
   - **Publishable Key** - starts with `pk_test_`

### Step 3: Update Backend .env
Edit `backend/src/.env` and replace:

```dotenv
STRIPE_SECRET_KEY=sk_test_YOUR_ACTUAL_SECRET_KEY_HERE
STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_ACTUAL_PUBLISHABLE_KEY_HERE
```

Replace `YOUR_ACTUAL_SECRET_KEY_HERE` with your real key from Stripe dashboard.

**Example:**
```dotenv
STRIPE_SECRET_KEY=sk_test_51Q8vK2JzQ3rEf4G5H6I7J8K9L0M1N2O3P4Q5R6S7T8U9V0W1X2Y3Z4
STRIPE_PUBLISHABLE_KEY=pk_test_51Q8vK2JzQ3rEf4G5H6I7J8K9L0M1N2O3
```

### Step 4: Update Frontend Payment.jsx
Edit `frontend/src/pages/Payment.jsx` line 15:

```javascript
const STRIPE_PUBLISHABLE_KEY = "pk_test_YOUR_ACTUAL_PUBLISHABLE_KEY_HERE";
```

Replace with your real publishable key.

### Step 5: Restart Backend
```bash
# Stop the current backend (Ctrl+C)
# Then restart:
npm run dev
```

You should see:
```
✅ Server running on port 5000
```

(Without the warning about Stripe key)

## Test Payment Flow

1. Navigate to your app's payment page
2. Fill in test information:
   - **Name**: John Doe
   - **Email**: john@example.com
   - **Address**: 123 Main St, New York, NY 10001
   - **Zip**: 10001
   - **Country**: United States

3. Enter test card details:
   - **Card Number**: `4242 4242 4242 4242`
   - **Expiry**: `12/25` (any future date)
   - **CVC**: `123` (any 3 digits)

4. Click "Complete Payment"

You should see "Payment Successful! 🎉" message.

## Why You Need Real Keys

- **Test keys** (`sk_test_`, `pk_test_`) are for development/testing
- **Live keys** (`sk_live_`, `pk_live_`) are for production
- **Placeholder keys** don't work - they cause the network error you're seeing
- Stripe validates all payments against real API keys

## If You Still Get Network Error

Check:
1. ✅ Backend is running on `http://localhost:5000` 
2. ✅ Real Stripe keys are in `.env` (not placeholders)
3. ✅ Backend was restarted after updating `.env`
4. ✅ Check browser console (F12) for more error details
5. ✅ Check backend console for error messages

