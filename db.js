// Minimal in-memory store so the demo works with zero setup.
// Replace with Postgres/Mongo/etc — the interface (get/set) is all that
// matters, so swapping the implementation shouldn't touch the routes.

const orders = new Map();

function createOrder(orderId, data) {
  orders.set(orderId, { status: 'pending', ...data, createdAt: Date.now() });
  return orders.get(orderId);
}

function updateOrder(orderId, patch) {
  const existing = orders.get(orderId);
  if (!existing) return null;
  const updated = { ...existing, ...patch };
  orders.set(orderId, updated);
  return updated;
}

function getOrder(orderId) {
  return orders.get(orderId) || null;
}

module.exports = { createOrder, updateOrder, getOrder };
