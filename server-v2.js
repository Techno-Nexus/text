require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const { MongoClient, ObjectId } = require('mongodb');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');

const { initializePayment, verifyPayment } = require('./services/paystack');

const app = express();

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/foodexpress';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const DELIVERY_FEE = 1000;

let db, usersCollection, foodsCollection, ordersCollection, paymentsCollection, reviewsCollection, favoritesCollection, dealsCollection, notificationsCollection;
const connectedUsers = new Map();

// Middleware
app.use(cors());
app.use(express.json());

// Socket.IO setup
const server = http.createServer(app);
const io = socketIO(server, { cors: { origin: '*' } });

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);
  
  socket.on('subscribe-order', (orderId) => {
    socket.join(`order-${orderId}`);
  });
  
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// JWT Middleware
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid token' });
  }
};

const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });
    next();
  });
};

// ==================== PAYMENT ROUTES ====================
app.post('/api/payments/initialize', verifyToken, async (req, res) => {
  try {
    const { amount, orderId } = req.body;
    const user = await usersCollection.findOne({ _id: new ObjectId(req.user.userId) });
    const paymentData = await initializePayment(user.email, amount, { orderId });
    const payment = {
      userId: new ObjectId(req.user.userId),
      orderId: new ObjectId(orderId),
      reference: paymentData.reference,
      amount,
      status: 'pending',
      createdAt: new Date()
    };

    const result = await paymentsCollection.insertOne(payment);
    res.json({ ...paymentData, paymentId: result.insertedId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/payments/verify/:reference', verifyToken, async (req, res) => {
  try {
    const paymentData = await verifyPayment(req.params.reference);
    if (paymentData.status === 'success') {
      const payment = await paymentsCollection.findOne({ reference: req.params.reference });
      if (payment) {
        await paymentsCollection.updateOne(
          { _id: payment._id },
          { $set: { status: 'completed', verifiedAt: new Date() } }
        );
        await ordersCollection.updateOne(
          { _id: payment.orderId },
          { $set: { paymentStatus: 'Paid' } }
        );
      }
    }

    res.json(paymentData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'FoodExpress API v2', time: new Date().toISOString() });
});

// ==================== AUTH ROUTES ====================
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, phone, password, address } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: 'Missing required fields' });
    
    const existing = await usersCollection.findOne({ email });
    if (existing) return res.status(400).json({ error: 'Email already registered' });
    
    const hashedPassword = await bcryptjs.hash(password, 10);
    const user = {
      name,
      email,
      phone: phone || '',
      address: address || '',
      password: hashedPassword,
      role: 'customer',
      createdAt: new Date()
    };
    
    const result = await usersCollection.insertOne(user);
    const token = jwt.sign({ userId: result.insertedId.toString(), email, role: 'customer' }, JWT_SECRET);
    
    res.status(201).json({ 
      success: true, 
      token, 
      user: { id: result.insertedId, name, email, role: 'customer' } 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
    
    const user = await usersCollection.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    
    const validPassword = await bcryptjs.compare(password, user.password);
    if (!validPassword) return res.status(401).json({ error: 'Invalid credentials' });
    
    const token = jwt.sign({ userId: user._id.toString(), email, role: user.role }, JWT_SECRET);
    
    res.json({
      success: true,
      token,
      user: { id: user._id, name: user.name, email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/auth/me', verifyToken, async (req, res) => {
  try {
    const user = await usersCollection.findOne({ _id: new ObjectId(req.user.userId) });
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      role: user.role
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== FOOD ROUTES ====================
app.get('/api/foods', async (req, res) => {
  try {
    const foods = await foodsCollection.find({ isAvailable: true }).toArray();
    res.json(foods);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/foods/:id', async (req, res) => {
  try {
    const food = await foodsCollection.findOne({ _id: new ObjectId(req.params.id) });
    res.json(food || { error: 'Food not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/foods', verifyAdmin, async (req, res) => {
  try {
    const { name, price, category, description, image, isAvailable } = req.body;
    const food = { name, price, category, description, image, isAvailable: isAvailable !== false, createdAt: new Date() };
    const result = await foodsCollection.insertOne(food);
    res.status(201).json({ id: result.insertedId, ...food });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/foods/:id', verifyAdmin, async (req, res) => {
  try {
    const result = await foodsCollection.updateOne({ _id: new ObjectId(req.params.id) }, { $set: req.body });
    res.json({ success: result.modifiedCount > 0 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/foods/:id', verifyAdmin, async (req, res) => {
  try {
    const result = await foodsCollection.deleteOne({ _id: new ObjectId(req.params.id) });
    res.json({ success: result.deletedCount > 0 });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== CART ROUTES ====================
app.get('/api/cart', verifyToken, async (req, res) => {
  try {
    const user = await usersCollection.findOne({ _id: new ObjectId(req.user.userId) });
    const cart = user?.cart || [];
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    res.json({
      items: cart,
      subtotal,
      deliveryFee: cart.length ? DELIVERY_FEE : 0,
      total: subtotal + (cart.length ? DELIVERY_FEE : 0),
      count: cart.reduce((sum, item) => sum + item.qty, 0)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/cart', verifyToken, async (req, res) => {
  try {
    const { foodId, qty } = req.body;
    const food = await foodsCollection.findOne({ _id: new ObjectId(foodId) });
    if (!food) return res.status(404).json({ error: 'Food not found' });
    
    const user = await usersCollection.findOne({ _id: new ObjectId(req.user.userId) });
    const cart = user?.cart || [];
    const existing = cart.find(item => item.id === foodId);
    
    if (existing) existing.qty += Math.max(1, qty || 1);
    else cart.push({ id: foodId, name: food.name, price: food.price, image: food.image, qty: Math.max(1, qty || 1) });
    
    await usersCollection.updateOne({ _id: new ObjectId(req.user.userId) }, { $set: { cart } });
    
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    res.json({
      items: cart,
      subtotal,
      deliveryFee: cart.length ? DELIVERY_FEE : 0,
      total: subtotal + (cart.length ? DELIVERY_FEE : 0),
      count: cart.reduce((sum, item) => sum + item.qty, 0)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/cart/:foodId', verifyToken, async (req, res) => {
  try {
    const user = await usersCollection.findOne({ _id: new ObjectId(req.user.userId) });
    const cart = (user?.cart || []).filter(item => item.id !== req.params.foodId);
    await usersCollection.updateOne({ _id: new ObjectId(req.user.userId) }, { $set: { cart } });
    
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    res.json({
      items: cart,
      subtotal,
      deliveryFee: cart.length ? DELIVERY_FEE : 0,
      total: subtotal + (cart.length ? DELIVERY_FEE : 0),
      count: cart.reduce((sum, item) => sum + item.qty, 0)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== ORDER ROUTES ====================
app.post('/api/orders', verifyToken, async (req, res) => {
  try {
    const { address, paymentMethod } = req.body;
    if (!address || address.trim().length < 5) return res.status(400).json({ error: 'Valid address required' });
    
    const user = await usersCollection.findOne({ _id: new ObjectId(req.user.userId) });
    const cart = user?.cart || [];
    if (!cart.length) return res.status(400).json({ error: 'Cart is empty' });
    
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const total = subtotal + DELIVERY_FEE;
    
    const order = {
      userId: new ObjectId(req.user.userId),
      customer: user.name,
      items: cart,
      subtotal,
      deliveryFee: DELIVERY_FEE,
      total,
      address,
      paymentMethod: paymentMethod || 'Cash on Delivery',
      status: 'Pending',
      paymentStatus: 'Pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await ordersCollection.insertOne(order);
    await usersCollection.updateOne({ _id: new ObjectId(req.user.userId) }, { $set: { cart: [] } });
    
    const orderWithId = { ...order, _id: result.insertedId };
    io.to(`order-${result.insertedId}`).emit('order:created', orderWithId);
    
    res.status(201).json({ id: result.insertedId, ...order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/orders', verifyToken, async (req, res) => {
  try {
    const orders = await ordersCollection.find({ userId: new ObjectId(req.user.userId) }).sort({ createdAt: -1 }).toArray();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/orders/:id', verifyToken, async (req, res) => {
  try {
    const order = await ordersCollection.findOne({ _id: new ObjectId(req.params.id) });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (order.userId.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.patch('/api/orders/:id/status', verifyAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Pending', 'Confirmed', 'Cooking', 'Ready', 'Out for Delivery', 'Delivered'];
    if (!validStatuses.includes(status)) return res.status(400).json({ error: 'Invalid status' });
    
    const result = await ordersCollection.findOneAndUpdate(
      { _id: new ObjectId(req.params.id) },
      { $set: { status, updatedAt: new Date() } },
      { returnDocument: 'after' }
    );
    
    io.to(`order-${req.params.id}`).emit('order:updated', result.value);
    res.json(result.value);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== FAVORITES ROUTES ====================
app.get('/api/favorites', verifyToken, async (req, res) => {
  try {
    const user = await usersCollection.findOne({ _id: new ObjectId(req.user.userId) });
    const favorites = user?.favorites || [];
    res.json(favorites);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/favorites', verifyToken, async (req, res) => {
  try {
    const { foodId } = req.body;
    const food = await foodsCollection.findOne({ _id: new ObjectId(foodId) });
    if (!food) return res.status(404).json({ error: 'Food not found' });
    
    const user = await usersCollection.findOne({ _id: new ObjectId(req.user.userId) });
    const favorites = user?.favorites || [];
    
    if (!favorites.find(fav => fav.id === foodId)) {
      favorites.push({ id: foodId, name: food.name, price: food.price, image: food.image });
    }
    
    await usersCollection.updateOne({ _id: new ObjectId(req.user.userId) }, { $set: { favorites } });
    res.json(favorites);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/favorites/:foodId', verifyToken, async (req, res) => {
  try {
    const user = await usersCollection.findOne({ _id: new ObjectId(req.user.userId) });
    const favorites = (user?.favorites || []).filter(fav => fav.id !== req.params.foodId);
    await usersCollection.updateOne({ _id: new ObjectId(req.user.userId) }, { $set: { favorites } });
    res.json(favorites);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== DEALS ROUTES ====================
app.get('/api/deals', async (req, res) => {
  try {
    const deals = await dealsCollection.find({ active: true }).toArray();
    res.json(deals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/deals', verifyAdmin, async (req, res) => {
  try {
    const deal = { ...req.body, active: true, createdAt: new Date() };
    const result = await dealsCollection.insertOne(deal);
    res.status(201).json({ id: result.insertedId, ...deal });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== ASSISTANT ROUTES ====================
app.post('/api/assistant', async (req, res) => {
  try {
    const { message, mode } = req.body;
    const text = String(message || '').toLowerCase();
    const available = await foodsCollection.find({ isAvailable: true }).toArray();
    
    const budgetMatch = text.match(/(?:under|below|less than|maximum|max)\s*₦?\s*([\d,]+)/i);
    const budget = budgetMatch ? Number(budgetMatch[1].replace(/,/g, '')) : null;
    let recommendations = available;
    
    if (budget) recommendations = recommendations.filter(item => item.price <= budget);
    if (/vegetarian|vegan|plant based/.test(text)) recommendations = recommendations.filter(item => /vegetable|plantain|salad|rice/i.test(item.name + item.description));
    if (/healthy|health|nutrition|protein/.test(text)) recommendations = recommendations.filter(item => /fish|seafood|vegetable|chicken/i.test(item.name + item.description));
    if (/best|popular|recommend|suggest|bestseller/.test(text)) recommendations = recommendations.slice(0, 3);
    
    const reply = recommendations.length
      ? `I found ${recommendations.length} meal${recommendations.length === 1 ? '' : 's'}: ${recommendations.slice(0, 3).map(item => `${item.name} (₦${item.price.toLocaleString()})`).join(', ')}.`
      : 'I could not find a matching meal. Try adjusting your criteria.';
    
    res.json({ mode: mode || 'standard', reply, recommendations: recommendations.slice(0, 4) });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== STATIC FILES ====================
function sendFirstDesignHome(req, res) {
  const source = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
  const injectedStart = source.indexOf('      <!DOCTYPE html>');
  const preservedDesign = injectedStart === -1
    ? source
    : source.slice(0, injectedStart) + source.slice(source.indexOf('    @media (max-width: 575.98px)', injectedStart));
  res.type('html').send(preservedDesign);
}

app.get('/', sendFirstDesignHome);
app.get('/index.html', sendFirstDesignHome);
app.use(express.static(__dirname));

// Connect to MongoDB and start server
MongoClient.connect(MONGODB_URI)
  .then(async (client) => {
    const database = client.db('foodexpress');
    db = database;
    usersCollection = database.collection('users');
    foodsCollection = database.collection('foods');
    ordersCollection = database.collection('orders');
    paymentsCollection = database.collection('payments');
    reviewsCollection = database.collection('reviews');
    favoritesCollection = database.collection('favorites');
    dealsCollection = database.collection('deals');
    notificationsCollection = database.collection('notifications');
    
    // Create indexes
    await usersCollection.createIndex({ email: 1 }, { unique: true });
    await ordersCollection.createIndex({ userId: 1 });
    await ordersCollection.createIndex({ createdAt: -1 });
    
    server.listen(PORT, () => console.log(`🍕 FoodExpress running at http://localhost:${PORT}`));
  })
  .catch(error => {
    console.error('MongoDB connection failed:', error.message);
    process.exitCode = 1;
  });
