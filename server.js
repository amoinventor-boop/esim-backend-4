require('dotenv').config();
const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const { nanoid } = require('nanoid');

const { plans } = require('./plans');
const { createOrder, updateOrder, getOrder } = require('./db');
const { provisionESIM } = require('./esimProvider');

const app = express();
app.use(cors());

const LEMONSQUEEZY_API_KEY = process.env.LEMONSQUEEZY_API_KEY;
const LEMONSQUEEZY_STORE_ID = process.env.LEMONSQUEEZY_STORE_ID;
const LEMONSQUEEZY_WEBHOOK_SECRET = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;

// -----------------------------------------------------------------------
// IMPORTANT: the webhook route needs the raw request body to verify the
// signature, so it must be registered BEFORE express.json(). Every other
// route below it can use the normal JSON parser.
// -----------------------------------------------------------------------
app.post('/api/webhook/lemonsqueezy', express.raw({ type: 'application/json' }), async (req, res) => {
  const signature = req.headers['x-signature'];

  const digest = crypto
    .createHmac('sha256', LEMONSQUEEZY_WEBHOOK_SECRET)
    .update(req.body)
    .digest('hex');

  if (signature !== digest) {
    console.error('Webhook signature verification failed');
    return res.status(400).send('Invalid signature');
  }

  const event = JSON.parse(req.body.toString());
  const eventName = event.meta?.event_name;

  if (eventName === 'order_created') {
    const orderId = event.meta?.custom_data?.orderId;
    const planId = event.meta?.custom_data?.planId;
    const customerEmail = event.data?.attributes?.user_email;

    // Respond fast, then provision in the background.
    res.status(200).json({ received: true });

    try {
      const plan = plans[planId];
      const esim = await provisionESIM(plan, customerEmail);
      updateOrder(orderId, { status: 'issued', esim, customerEmail });
      console.log(`eSIM issued for order ${orderId}`);
    } catch (err) {
      console.error(`Provisioning failed for order ${orderId}:`, err.message);
      updateOrder(orderId, { status: 'failed', error: err.message });
    }
    return;
  }

  res.status(200).json({ received: true });
});

app.use(express.json());

// -----------------------------------------------------------------------
// 1. Frontend calls this when the customer clicks "Buy eSIM".
//    Returns a Lemon Squeezy Checkout URL to redirect the browser to.
// -----------------------------------------------------------------------
app.post('/api/checkout/create-session', async (req, res) => {
  const { planId } = req.body;
  const plan = plans[planId];

  if (!plan) {
    return res.status(400).json({ error: `Unknown planId: ${planId}` });
  }
  if (!plan.variantId || plan.variantId === 'REPLACE_ME') {
    return res.status(400).json({ error: `Plan ${planId} has no Lemon Squeezy variantId set yet` });
  }

  const orderId = nanoid(12);

  try {
    const response = await fetch('https://api.lemonsqueezy.com/v1/checkouts', {
      method: 'POST',
      headers: {
        Accept: 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
        Authorization: `Bearer ${LEMONSQUEEZY_API_KEY}`,
      },
      body: JSON.stringify({
        data: {
          type: 'checkouts',
          attributes: {
            checkout_data: {
              custom: { orderId, planId },
            },
            product_options: {
              redirect_url: `${process.env.CLIENT_SUCCESS_URL}?orderId=${orderId}`,
            },
          },
          relationships: {
            store: {
              data: { type: 'stores', id: LEMONSQUEEZY_STORE_ID },
            },
            variant: {
              data: { type: 'variants', id: plan.variantId },
            },
          },
        },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Lemon Squeezy checkout creation failed: ${response.status} ${errText}`);
    }

    const result = await response.json();
    const checkoutUrl = result.data.attributes.url;

    createOrder(orderId, { planId });

    res.json({ checkoutUrl, orderId });
  } catch (err) {
    console.error('Failed to create checkout:', err.message);
    res.status(500).json({ error: 'Could not start checkout' });
  }
});

// -----------------------------------------------------------------------
// 2. Frontend polls this after redirecting back from Lemon Squeezy, until
//    status flips from "pending" to "issued" (or "failed").
// -----------------------------------------------------------------------
app.get('/api/orders/:orderId', (req, res) => {
  const order = getOrder(req.params.orderId);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json(order);
});

// -----------------------------------------------------------------------
// Plan catalog, so the frontend can fetch it instead of hardcoding it.
// -----------------------------------------------------------------------
app.get('/api/plans', (req, res) => {
  res.json(plans);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Roam backend running on port ${PORT}`);
  console.log(`eSIM provider mode: ${process.env.ESIM_PROVIDER || 'mock'}`);
});
