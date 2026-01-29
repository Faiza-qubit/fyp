# Stripe Payment Integration Setup

## Backend Configuration

The backend now supports Stripe payments. Follow these steps:

### 1. Get Stripe API Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Sign up or log in to your Stripe account
3. Go to "Developers" > "API keys"
4. Copy your:
   - **Secret Key** (starts with `sk_test_` or `sk_live_`)
   - **Publishable Key** (starts with `pk_test_` or `pk_live_`)

### 2. Update Backend .env File

Update `backend/src/.env` with your Stripe keys:

```
MONGO_URI=mongodb+srv://your_connection_string
PORT=5000
STRIPE_SECRET_KEY=sk_test_YOUR_SECRET_KEY
STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_PUBLISHABLE_KEY
```

### 3. Update Frontend Stripe Key

Update `frontend/src/pages/Payment.jsx` line ~15:

```javascript
const STRIPE_PUBLISHABLE_KEY = "pk_test_YOUR_ACTUAL_KEY";
```

## Payment Flow

1. **User fills in billing information** on the Payment page
2. **User enters card details** using Stripe CardElement
3. **Frontend creates payment intent** by calling `/api/payments/create-intent`
4. **Stripe processes the card payment** securely
5. **Frontend confirms the payment** by calling `/api/payments/confirm`
6. **Backend stores payment record** in MongoDB
7. **User is redirected to home page** after successful payment

## Testing Stripe Payments

### Test Card Numbers

Use these card numbers for testing (in test mode):

- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Require Auth**: `4000 0025 0000 3155`

**Expiry**: Any future date (e.g., 12/25)
**CVC**: Any 3 digits (e.g., 123)

### Test Payment Flow

1. Navigate to `/payment` in the frontend
2. Fill in billing information
3. Enter test card number
4. Click "Complete Payment"
5. Monitor console for payment status

## API Endpoints

### Create Payment Intent
```
POST /api/payments/create-intent
Body: {
  amount: number,
  email: string,
  fullName: string,
  shoeSize: string
}
Response: {
  success: boolean,
  clientSecret: string,
  paymentIntentId: string
}
```

### Confirm Payment
```
POST /api/payments/confirm
Body: {
  paymentIntentId: string,
  fullName: string,
  email: string,
  phone: string,
  address: string,
  city: string,
  zipCode: string,
  country: string,
  shoeSize: string,
  amount: number
}
Response: {
  success: boolean,
  message: string,
  payment: object
}
```

### Get All Payments
```
GET /api/payments
Response: Array of payment records
```

### Get Payment by Email
```
GET /api/payments/email/:email
Response: Array of payments for that email
```

## Security Notes

- ⚠️ **Never store credit card details** on the backend (handled by Stripe)
- ✅ **Stripe handles PCI compliance** - we only see masked card info
- ✅ **Use HTTPS in production** to encrypt data in transit
- ✅ **Never expose SECRET keys** in frontend code

## Troubleshooting

### "Stripe is not loaded"
- Verify `STRIPE_PUBLISHABLE_KEY` is correct in `Payment.jsx`
- Check browser console for errors

### "Payment intent creation failed"
- Verify backend is running on `http://localhost:5000`
- Check that `STRIPE_SECRET_KEY` in `.env` is correct
- Check backend console for error messages

### "Card declined"
- Test with card number `4242 4242 4242 4242`
- Check that CardElement is properly rendered

## Production Deployment

Before deploying to production:

1. Switch to **Live API Keys** in Stripe Dashboard
2. Update environment variables with live keys
3. Update `STRIPE_PUBLISHABLE_KEY` in `Payment.jsx`
4. Enable HTTPS on your domain
5. Test payments thoroughly
