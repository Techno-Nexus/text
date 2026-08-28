const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { URL } = require('url');
const bcrypt = require('bcryptjs');

const PORT = Number(process.env.PORT) || 3000;
const ROOT = __dirname;
const DATA_DIR = path.join(ROOT, 'data');
const DATA_FILE = path.join(DATA_DIR, 'store.json');
const SESSION_COOKIE = 'fe_session';
const DELIVERY_FEE = 1000;
const clients = new Set();

const seedMenu = [
  { id: 'food_001', name: 'Jollof Rice + Chicken & Coleslaw', category: 'Rice & Combo', price: 3500, description: 'Jollof rice served with fried chicken leg and fresh coleslaw salad.', image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=900&q=80', isAvailable: true },
  { id: 'food_002', name: 'Jollof Rice + Chicken & Plantain', category: 'Rice & Combo', price: 3500, description: 'Classic Jollof rice packed with fried chicken leg and sweet dodo.', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=80', isAvailable: true },
  { id: 'food_003', name: 'Beef Jollof Rice & Plantain', category: 'Rice & Combo', price: 3000, description: 'Rich Jollof rice topped with tender fried beef chunks and fried plantain.', image: 'https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?auto=format&fit=crop&w=900&q=80', isAvailable: true },
  { id: 'food_004', name: 'Native Soup / Leafy Stew', category: 'Soups & Stews', price: 4000, description: 'Traditional rich leafy green soup packed with assorted meats.', image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80', isAvailable: true },
  { id: 'food_005', name: 'Seafood Stew', category: 'Soups & Stews', price: 5300, description: 'Rich stew with prawns, fish, peppers, and soft plantain.', image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=900&q=80', isAvailable: true },
  { id: 'food_006', name: 'Cinnamon Burger', category: 'Rice & Combo', price: 2900, description: 'Juicy grilled patty with cheddar, lettuce, and potato wedges.', image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=900&q=80', isAvailable: true }
];

function loadStore() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) {
    const initial = { menu: seedMenu, carts: {}, orders: [], tickets: [], users: [], favorites: {} };
    fs.writeFileSync(DATA_FILE, JSON.stringify(initial, null, 2));
    return initial;
  }
  const loaded = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  loaded.users ||= [];
  loaded.favorites ||= {};
  return loaded;
}

let store = loadStore();
function saveStore() { fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2)); }
function sendJson(res, status, body, headers = {}) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', ...headers });
  res.end(JSON.stringify(body));
}
function parseCookies(req) {
  return Object.fromEntries((req.headers.cookie || '').split(';').filter(Boolean).map(item => {
    const [key, ...value] = item.trim().split('=');
    return [key, decodeURIComponent(value.join('='))];
  }));
}
function sessionId(req, res) {
  const cookies = parseCookies(req);
  if (cookies[SESSION_COOKIE]) return cookies[SESSION_COOKIE];
  const id = crypto.randomUUID();
  res.setHeader('Set-Cookie', `${SESSION_COOKIE}=${id}; Path=/; SameSite=Lax; HttpOnly`);
  return id;
}
function cartFor(id) { return store.carts[id] || (store.carts[id] = []); }
function cartSummary(cart) {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  return { items: cart, subtotal, deliveryFee: cart.length ? DELIVERY_FEE : 0, total: subtotal + (cart.length ? DELIVERY_FEE : 0), count: cart.reduce((sum, item) => sum + item.qty, 0) };
}
function body(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', chunk => { raw += chunk; if (raw.length > 1e6) req.destroy(); });
    req.on('end', () => { try { resolve(raw ? JSON.parse(raw) : {}); } catch { reject(new Error('Invalid JSON')); } });
    req.on('error', reject);
  });
}
function broadcast(event, data) {
  const message = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const client of clients) client.write(message);
}
function assistantReply(message, mode) {
  const text = String(message || '').toLowerCase();
  const available = store.menu.filter(item => item.isAvailable);
  const budgetMatch = text.match(/(?:under|below|less than|maximum|max)\s*₦?\s*([\d,]+)/i);
  const budget = budgetMatch ? Number(budgetMatch[1].replace(/,/g, '')) : null;
  let recommendations = available;
  if (budget) recommendations = recommendations.filter(item => item.price <= budget);
  if (/vegetarian|vegan|plant based/.test(text)) recommendations = recommendations.filter(item => /vegetable|plantain|salad|rice/i.test(item.name + item.description));
  if (/healthy|health|nutrition|protein/.test(text)) recommendations = recommendations.filter(item => /fish|seafood|vegetable|chicken/i.test(item.name + item.description));
  if (/best|popular|recommend|suggest|bestseller/.test(text)) recommendations = recommendations.slice(0, 3);
  if (mode === 'standard') {
    if (budget && recommendations.length) return { reply: `I found ${recommendations.length} meal${recommendations.length === 1 ? '' : 's'} within your budget: ${recommendations.slice(0, 3).map(item => `${item.name} (${item.price.toLocaleString()} naira)`).join(', ')}.`, recommendations };
    if (/menu|food|meal|hungry|recommend|best/.test(text)) return { reply: `Our popular choice is ${available[0].name} at ${available[0].price.toLocaleString()} naira. You can also try ${available[1].name}.`, recommendations: available.slice(0, 2) };
    return { reply: 'I can help you choose a meal, check prices, or find options by budget. Try asking for a meal under 3,000 naira.', recommendations: [] };
  }
  if (!recommendations.length) return { reply: budget ? `I could not find a matching meal under ${budget.toLocaleString()} naira. Try increasing your budget or removing a dietary filter.` : 'I could not find a matching meal yet. Tell me your budget or dietary preference.', recommendations: [] };
  const reason = budget ? `within your ${budget.toLocaleString()} naira budget` : /healthy|health|nutrition|protein/.test(text) ? 'with protein and fresh ingredients' : /vegetarian|vegan|plant based/.test(text) ? 'matching your plant-forward preference' : 'based on our current menu';
  return { reply: `Here are my best matches ${reason}: ${recommendations.slice(0, 4).map(item => `${item.name} (${item.price.toLocaleString()} naira)`).join(', ')}.`, recommendations: recommendations.slice(0, 4) };
}
function serveStatic(req, res, pathname) {
  const requested = pathname === '/' ? '/index.html' : pathname;
  const file = path.normalize(path.join(ROOT, requested));
  if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) return sendJson(res, 404, { error: 'Not found' });
  const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg' };
  res.writeHead(200, { 'Content-Type': `${types[path.extname(file)] || 'application/octet-stream'}; charset=utf-8` });
  fs.createReadStream(file).pipe(res);
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const { pathname } = url;
  if (pathname === '/api/health') return sendJson(res, 200, { ok: true, service: 'FoodExpress API', time: new Date().toISOString() });
  if (pathname === '/api/events') {
    res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' });
    res.write(`event: connected\ndata: ${JSON.stringify({ ok: true })}\n\n`);
    clients.add(res);
    req.on('close', () => clients.delete(res));
    return;
  }
  if (!pathname.startsWith('/api/')) return serveStatic(req, res, pathname);

  try {
    const id = sessionId(req, res);
    if (pathname === '/api/menu' && req.method === 'GET') return sendJson(res, 200, store.menu.filter(item => item.isAvailable));
    if (pathname === '/api/auth/register' && req.method === 'POST') {
      const input = await body(req);
      const name = String(input.name || '').trim();
      const email = String(input.email || '').trim().toLowerCase();
      const password = String(input.password || '');
      if (!name || !email || password.length < 6) return sendJson(res, 400, { error: 'Name, email, and a password of at least 6 characters are required' });
      if (store.users.some(user => user.email === email)) return sendJson(res, 409, { error: 'Email already registered' });
      const user = { id: `USR-${Date.now().toString().slice(-8)}`, name, email, phone: String(input.phone || '').trim(), address: String(input.address || '').trim(), password: await bcrypt.hash(password, 10), createdAt: new Date().toISOString() };
      store.users.push(user); saveStore();
      res.setHeader('Set-Cookie', `${SESSION_COOKIE}=${id}; Path=/; SameSite=Lax; HttpOnly`);
      return sendJson(res, 201, { success: true, user: { id: user.id, name: user.name, email: user.email, phone: user.phone, address: user.address } });
    }
    if (pathname === '/api/auth/login' && req.method === 'POST') {
      const input = await body(req);
      const email = String(input.email || '').trim().toLowerCase();
      const user = store.users.find(value => value.email === email);
      if (!user || !(await bcrypt.compare(String(input.password || ''), user.password))) return sendJson(res, 401, { error: 'Invalid credentials' });
      res.setHeader('Set-Cookie', `${SESSION_COOKIE}=${id}; Path=/; SameSite=Lax; HttpOnly`);
      return sendJson(res, 200, { success: true, user: { id: user.id, name: user.name, email: user.email, phone: user.phone, address: user.address } });
    }
    if (pathname === '/api/auth/me' && req.method === 'GET') {
      const user = store.users.find(value => value.id === store.sessions?.[id]);
      return user ? sendJson(res, 200, { id: user.id, name: user.name, email: user.email, phone: user.phone, address: user.address }) : sendJson(res, 401, { error: 'Not authenticated' });
    }
    if (pathname === '/api/assistant' && req.method === 'POST') {
      const input = await body(req);
      if (!input.message || !String(input.message).trim()) return sendJson(res, 400, { error: 'Message is required' });
      const mode = input.mode === 'advanced' ? 'advanced' : 'standard';
      return sendJson(res, 200, { mode, ...assistantReply(input.message, mode) });
    }
    if (pathname === '/api/cart' && req.method === 'GET') return sendJson(res, 200, cartSummary(cartFor(id)));
    if (pathname === '/api/cart' && req.method === 'POST') {
      const input = await body(req);
      const food = store.menu.find(item => (item.id === input.foodId || item.name === input.foodName) && item.isAvailable);
      if (!food) return sendJson(res, 404, { error: 'Food item not found' });
      const cart = cartFor(id); const existing = cart.find(item => item.id === food.id);
      if (existing) existing.qty += Math.max(1, Number(input.qty) || 1);
      else cart.push({ id: food.id, name: food.name, price: food.price, image: food.image, qty: Math.max(1, Number(input.qty) || 1) });
      saveStore(); return sendJson(res, 200, cartSummary(cart));
    }
    const cartItem = pathname.match(/^\/api\/cart\/([^/]+)$/);
    if (cartItem && req.method === 'PATCH') {
      const input = await body(req); const cart = cartFor(id); const item = cart.find(value => value.id === cartItem[1]);
      if (!item) return sendJson(res, 404, { error: 'Cart item not found' });
      item.qty = Number(input.qty); if (!Number.isInteger(item.qty) || item.qty < 1) store.carts[id] = cart.filter(value => value.id !== item.id);
      saveStore(); return sendJson(res, 200, cartSummary(store.carts[id] || []));
    }
    if (cartItem && req.method === 'DELETE') {
      store.carts[id] = cartFor(id).filter(item => item.id !== cartItem[1]); saveStore(); return sendJson(res, 200, cartSummary(store.carts[id]));
    }
    if (pathname === '/api/orders' && req.method === 'GET') return sendJson(res, 200, store.orders.filter(order => order.sessionId === id));
    const orderRoute = pathname.match(/^\/api\/orders\/([^/]+)$/);
    if (orderRoute && req.method === 'GET') {
      const order = store.orders.find(value => value.id === orderRoute[1] && value.sessionId === id);
      return order ? sendJson(res, 200, order) : sendJson(res, 404, { error: 'Order not found' });
    }
    if (orderRoute && req.method === 'PATCH') {
      const input = await body(req); const order = store.orders.find(value => value.id === orderRoute[1]);
      if (!order) return sendJson(res, 404, { error: 'Order not found' });
      const statuses = ['Pending', 'Confirmed', 'Cooking', 'Out For Delivery', 'Delivered'];
      if (!statuses.includes(input.status)) return sendJson(res, 400, { error: 'Invalid order status' });
      order.status = input.status; order.updatedAt = new Date().toISOString(); saveStore(); broadcast('order.updated', order); return sendJson(res, 200, order);
    }
    if (pathname === '/api/orders' && req.method === 'POST') {
      const input = await body(req); const cart = cartFor(id);
      if (!cart.length) return sendJson(res, 400, { error: 'Your cart is empty' });
      if (!input.address || input.address.trim().length < 5) return sendJson(res, 400, { error: 'A delivery address is required' });
      const summary = cartSummary(cart); const order = { id: `ORD-${Date.now().toString().slice(-8)}`, sessionId: id, customer: input.customer || 'Guest User', address: input.address.trim(), paymentMethod: input.paymentMethod || 'Cash on Delivery', items: cart.map(item => ({ ...item })), subtotal: summary.subtotal, deliveryFee: summary.deliveryFee, total: summary.total, status: 'Pending', createdAt: new Date().toISOString() };
      store.orders.unshift(order); store.carts[id] = []; saveStore(); broadcast('order.updated', order); return sendJson(res, 201, order);
    }
    if (pathname === '/api/support' && req.method === 'POST') {
      const input = await body(req); if (!input.message || !input.message.trim()) return sendJson(res, 400, { error: 'Message is required' });
      const ticket = { id: `TKT-${Date.now().toString().slice(-8)}`, sessionId: id, email: input.email || '', message: input.message.trim(), status: 'Open', createdAt: new Date().toISOString() }; store.tickets.push(ticket); saveStore(); return sendJson(res, 201, ticket);
    }
    return sendJson(res, 404, { error: 'API route not found' });
  } catch (error) { return sendJson(res, 400, { error: error.message || 'Request failed' }); }
});

server.listen(PORT, () => console.log(`FoodExpress server running at http://localhost:${PORT}`));
