const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const locationRoutes = require('./routes/locations');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/locations', locationRoutes);

app.get('/', (req, res) => {
  res.send('Thợ Săn Bánh Tráng API is running...');
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
