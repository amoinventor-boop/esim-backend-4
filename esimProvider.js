// This is the one file you need to rewrite when you plug in a real
// eSIM provider. Every function returns the same shape:
//
//   { iccid, qrCodeUrl, activationCode, smDpAddress }
//
// so nothing else in the app needs to change when you swap providers —
// only the body of `provisionESIM` below.

const PROVIDER = process.env.ESIM_PROVIDER || 'mock';

async function provisionESIM(plan, customerEmail) {
  switch (PROVIDER) {
    case 'airalo':
      return provisionWithAiralo(plan, customerEmail);
    case 'esimaccess':
      return provisionWithEsimAccess(plan, customerEmail);
    default:
      return provisionMock(plan, customerEmail);
  }
}

// ---------------------------------------------------------------------
// MOCK — works out of the box, no API keys needed. Good for building
// and testing the checkout flow before you've signed with a provider.
// ---------------------------------------------------------------------
async function provisionMock(plan) {
  await sleep(800); // simulate network latency
  const fakeIccid = '8944' + Math.floor(Math.random() * 1e15).toString().padStart(15, '0');
  return {
    iccid: fakeIccid,
    qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=LPA:1$mock.esim.roam$${fakeIccid}`,
    activationCode: `LPA:1$mock.esim.roam$${fakeIccid}`,
    smDpAddress: 'mock.esim.roam',
  };
}

// ---------------------------------------------------------------------
// AIRALO — Partner API. Real endpoints, but you must fill in your own
// client id/secret from the Airalo partner dashboard.
// Docs: https://partners-doc.airalo.com/
// ---------------------------------------------------------------------
async function provisionWithAiralo(plan, customerEmail) {
  const token = await getAiraloToken();

  const orderRes = await fetch(`${process.env.AIRALO_BASE_URL}/v2/orders`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      package_id: plan.providerPlanId,
      quantity: '1',
      description: `Order for ${customerEmail}`,
    }),
  });

  if (!orderRes.ok) {
    throw new Error(`Airalo order failed: ${orderRes.status} ${await orderRes.text()}`);
  }

  const order = await orderRes.json();
  const sim = order?.data?.sims?.[0];

  return {
    iccid: sim.iccid,
    qrCodeUrl: sim.qrcode_url,
    activationCode: sim.qrcode, // the LPA: string
    smDpAddress: sim.lpa,
  };
}

async function getAiraloToken() {
  const res = await fetch(`${process.env.AIRALO_BASE_URL}/v2/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.AIRALO_CLIENT_ID,
      client_secret: process.env.AIRALO_CLIENT_SECRET,
      grant_type: 'client_credentials',
    }),
  });
  const data = await res.json();
  return data.data.access_token;
}

// ---------------------------------------------------------------------
// ESIM ACCESS — alternative aggregator. Simpler single-key auth.
// Docs: https://docs.esimaccess.com/
// ---------------------------------------------------------------------
async function provisionWithEsimAccess(plan, customerEmail) {
  const res = await fetch(`${process.env.ESIMACCESS_BASE_URL}/api/v1/open/esim/order`, {
    method: 'POST',
    headers: {
      'RT-AccessCode': process.env.ESIMACCESS_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      packageCode: plan.providerPlanId,
      count: 1,
      email: customerEmail,
    }),
  });

  if (!res.ok) {
    throw new Error(`eSIM Access order failed: ${res.status} ${await res.text()}`);
  }

  const data = await res.json();
  const esim = data?.obj?.esimList?.[0];

  return {
    iccid: esim.iccid,
    qrCodeUrl: esim.qrCodeUrl,
    activationCode: esim.ac,
    smDpAddress: esim.smdpAddress,
  };
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports = { provisionESIM };
