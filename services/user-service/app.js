const express = require('express');
const Ajv = require('ajv');
const addFormats = require('ajv-formats');
const userSchema = require('../../shared/contracts/user.schema.json');
const app = express();
const port = process.env.PORT || 3001;

const ajv = new Ajv();
addFormats(ajv);
const validateUser = ajv.compile(userSchema);

app.use(express.json());

const users = [
  { id: 1, name: 'Juan Perez', email: 'juan@example.com' },
  { id: 2, name: 'Maria Lopez', email: 'maria@example.com' }
];

app.get('/health', (req, res) => {
  res.json({ service: 'user-service', status: 'UP' });
});

app.get('/users', (req, res) => {
  res.json(users);
});

// Validación de Contrato en tiempo de ejecución
app.post('/users', (req, res) => {
  const isValid = validateUser(req.body);
  if (!isValid) {
    return res.status(400).json({ error: 'Contrato no válido', details: validateUser.errors });
  }

  const newUser = { id: users.length + 1, ...req.body };
  users.push(newUser);
  res.status(201).json(newUser);
});

app.listen(port, () => {
  console.log(`👤 User Service corriendo en puerto ${port}`);
});