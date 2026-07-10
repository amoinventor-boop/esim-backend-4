// Same catalog the storefront renders. In production this would live in a
// database or be pulled live from your eSIM provider's catalog endpoint.
//
// - `providerPlanId`: what you'd pass to your eSIM provider's API (Airalo, etc.)
//   to provision that exact plan — placeholders until you're approved.
// - `variantId`: the Lemon Squeezy "Variant ID" for this plan's product.
//   You get this from your Lemon Squeezy dashboard after creating each
//   product (Products → click a product → the variant's ID is in the URL
//   or the variant details panel). Every plan below needs its own product
//   in Lemon Squeezy with a matching variantId here.

const plans = {
  jp_5gb_7d:   { country: 'Japan',            flag: '🇯🇵', data: '5 GB',  validity: '7 days',  price: 1200, providerPlanId: 'airalo_jp_5gb_7d',   variantId: 'REPLACE_ME' },
  kr_3gb_5d:   { country: 'South Korea',      flag: '🇰🇷', data: '3 GB',  validity: '5 days',  price: 900,  providerPlanId: 'airalo_kr_3gb_5d',   variantId: 'REPLACE_ME' },
  th_10gb_14d: { country: 'Thailand',         flag: '🇹🇭', data: '10 GB', validity: '14 days', price: 1500, providerPlanId: 'airalo_th_10gb_14d', variantId: 'REPLACE_ME' },
  id_8gb_10d:  { country: 'Indonesia',        flag: '🇮🇩', data: '8 GB',  validity: '10 days', price: 1300, providerPlanId: 'airalo_id_8gb_10d',  variantId: 'REPLACE_ME' },
  fr_10gb_14d: { country: 'France',           flag: '🇫🇷', data: '10 GB', validity: '14 days', price: 1700, providerPlanId: 'airalo_fr_10gb_14d', variantId: 'REPLACE_ME' },
  it_8gb_10d:  { country: 'Italy',            flag: '🇮🇹', data: '8 GB',  validity: '10 days', price: 1500, providerPlanId: 'airalo_it_8gb_10d',  variantId: 'REPLACE_ME' },
  gb_6gb_10d:  { country: 'United Kingdom',   flag: '🇬🇧', data: '6 GB',  validity: '10 days', price: 1400, providerPlanId: 'airalo_gb_6gb_10d',  variantId: 'REPLACE_ME' },
  pt_5gb_7d:   { country: 'Portugal',         flag: '🇵🇹', data: '5 GB',  validity: '7 days',  price: 1100, providerPlanId: 'airalo_pt_5gb_7d',   variantId: 'REPLACE_ME' },
  us_8gb_10d:  { country: 'United States',    flag: '🇺🇸', data: '8 GB',  validity: '10 days', price: 1900, providerPlanId: 'airalo_us_8gb_10d',  variantId: 'REPLACE_ME' },
  mx_6gb_10d:  { country: 'Mexico',           flag: '🇲🇽', data: '6 GB',  validity: '10 days', price: 1300, providerPlanId: 'airalo_mx_6gb_10d',  variantId: 'REPLACE_ME' },
  br_5gb_7d:   { country: 'Brazil',           flag: '🇧🇷', data: '5 GB',  validity: '7 days',  price: 1400, providerPlanId: 'airalo_br_5gb_7d',   variantId: 'REPLACE_ME' },
  global_90:   { country: 'Global 90',        flag: '🌐', data: '20 GB', validity: '30 days', price: 5900, providerPlanId: 'airalo_global_90',   variantId: 'REPLACE_ME' },
  europe_reg:  { country: 'Europe Regional',  flag: '🌍', data: '15 GB', validity: '21 days', price: 3400, providerPlanId: 'airalo_europe_reg',  variantId: 'REPLACE_ME' },
  asia_reg:    { country: 'Asia Regional',    flag: '🌏', data: '12 GB', validity: '21 days', price: 2900, providerPlanId: 'airalo_asia_reg',    variantId: 'REPLACE_ME' },
};

// price is in cents (USD) — shown for reference; Lemon Squeezy uses the
// price you set on the product itself, so keep these in sync manually.

module.exports = { plans };
