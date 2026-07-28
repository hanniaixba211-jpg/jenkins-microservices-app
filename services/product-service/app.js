const express = require('express');
const app = express();
const port = process.env.PORT || 3002;

app.use(express.json());

const products = [
  { id: 101, name: 'Laptop', price: 1200.00, stock: 10 },
  { id: 102, name: 'Mouse', price: 25.50, stock: 50 }
];

app.get('/health', (req, res) => {
  res.json({ service: 'product-service', status: 'UP' });
});

app.get('/products', (req, res) => {
  res.json(products);
});

app.listen(port, () => {
  console.log(`📦 Product Service corriendo en puerto ${port}`);
});