// Real plans sourced from the eSIM Access dashboard (Country > Plan Details > Code).
// `providerPlanId` is the eSIM Access package code, passed straight to their
// API to provision this exact plan.
//
// `variantId` is still a placeholder — create a matching product for each
// plan in Lemon Squeezy and paste its Variant ID in here next.

const plans = {
  jp_5gb_30d:  { country: 'Japan',            flag: '🇯🇵', data: '5 GB',  validity: '30 days', price: 1200, providerPlanId: 'JC065',  variantId: 'REPLACE_ME' },
  kr_5gb_30d:  { country: 'South Korea',      flag: '🇰🇷', data: '5 GB',  validity: '30 days', price: 1200, providerPlanId: 'JC074',  variantId: 'REPLACE_ME' },
  th_3gb_15d:  { country: 'Thailand',         flag: '🇹🇭', data: '3 GB',  validity: '15 days', price: 900,  providerPlanId: 'JC046',  variantId: 'REPLACE_ME' },
  id_5gb_30d:  { country: 'Indonesia',        flag: '🇮🇩', data: '5 GB',  validity: '30 days', price: 1200, providerPlanId: 'JC058',  variantId: 'REPLACE_ME' },
  fr_5gb_30d:  { country: 'France',           flag: '🇫🇷', data: '5 GB',  validity: '30 days', price: 1400, providerPlanId: 'CKH983', variantId: 'REPLACE_ME' },
  it_5gb_30d:  { country: 'Italy',            flag: '🇮🇹', data: '5 GB',  validity: '30 days', price: 1300, providerPlanId: 'CKH130', variantId: 'REPLACE_ME' },
  gb_5gb_30d:  { country: 'United Kingdom',   flag: '🇬🇧', data: '5 GB',  validity: '30 days', price: 1300, providerPlanId: 'CKH143', variantId: 'REPLACE_ME' },
  pt_5gb_30d:  { country: 'Portugal',         flag: '🇵🇹', data: '5 GB',  validity: '30 days', price: 1300, providerPlanId: 'CKH986', variantId: 'REPLACE_ME' },
  us_5gb_30d:  { country: 'United States',    flag: '🇺🇸', data: '5 GB',  validity: '30 days', price: 2200, providerPlanId: 'CKH493', variantId: 'REPLACE_ME' },
  mx_5gb_30d:  { country: 'Mexico',           flag: '🇲🇽', data: '5 GB',  validity: '30 days', price: 2200, providerPlanId: 'CKH493', variantId: 'REPLACE_ME' },
  br_5gb_30d:  { country: 'Brazil',           flag: '🇧🇷', data: '5 GB',  validity: '30 days', price: 2000, providerPlanId: 'CKH333', variantId: 'REPLACE_ME' },
};

// price is in cents (USD) — this is YOUR resale price, set above the
// wholesale cost shown in eSIM Access (roughly a 4-5x markup here, healthy
// for a small reseller but adjust to taste).

module.exports = { plans };
