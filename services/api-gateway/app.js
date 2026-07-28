const express = require('express');
const axios = require('axios');
const CircuitBreaker = require('opossum');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Opciones del Circuit Breaker
const breakerOptions = {
  timeout: 3000,
  errorThresholdPercentage: 50,
  resetTimeout: 10000
};

// Llamadas a servicios
const fetchUsers = async () => (await axios.get('http://user-service:3001/users')).data;
const fetchProducts = async () => (await axios.get('http://product-service:3002/products')).data;

// Circuit Breakers
const userBreaker = new CircuitBreaker(fetchUsers, breakerOptions);
userBreaker.fallback(() => ({ status: 'degraded', message: 'User Service no disponible (Circuit Breaker Abierto)' }));

const productBreaker = new CircuitBreaker(fetchProducts, breakerOptions);
productBreaker.fallback(() => ({ status: 'degraded', message: 'Product Service no disponible (Circuit Breaker Abierto)' }));

// Health Check con validación de dependencias
app.get('/health', async (req, res) => {
  const health = {
    service: 'api-gateway',
    status: 'UP',
    dependencies: { userService: 'UNKNOWN', productService: 'UNKNOWN' }
  };

  try {
    await axios.get('http://user-service:3001/health', { timeout: 1000 });
    health.dependencies.userService = 'UP';
  } catch {
    health.dependencies.userService = 'DOWN';
  }

  try {
    await axios.get('http://product-service:3002/health', { timeout: 1000 });
    health.dependencies.productService = 'UP';
  } catch {
    health.dependencies.productService = 'DOWN';
  }

  const isHealthy = Object.values(health.dependencies).every(status => status === 'UP');
  res.status(isHealthy ? 200 : 503).json(health);
});

// Enrutamiento con Circuit Breaker
app.get('/users', async (req, res) => {
  try {
    const result = await userBreaker.fire();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/products', async (req, res) => {
  try {
    const result = await productBreaker.fire();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`🚀 API Gateway corriendo en puerto ${port}`);
});