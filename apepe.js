const express = require('express');
const app = express();
const port = 3000;

const Joi = require('joi');

// Defina o esquema Joi
const schema = Joi.object({
  username: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required(),

  password: Joi.string()
    .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),

  repeat_password: Joi.ref('password'),

  access_token: [
    Joi.string(),
    Joi.number()
  ],

  birth_year: Joi.number()
    .integer()
    .min(1900)
    .max(2013),

  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
})
  .with('username', 'birth_year');

// Middleware para permitir o uso de JSON no corpo da solicitação
app.use(express.json());

// Rota POST para validar dados
app.post('/validate', async (req, res) => {
  const inputData = req.body;

  // Valide os dados de entrada usando o esquema Joi
  const { error, value } = schema.validate(inputData);

  if (error) {
    // Se houver um erro de validação, envie uma resposta com o erro e retorne imediatamente
    return res.status(400).send(error.details[0].message);
  }

  // Se os dados forem válidos, envie uma resposta JSON com o resultado
  res.json({ message: 'Dados válidos', data: value });
});

// Rota GET para a página HTML
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Inicie o servidor na porta especificada
app.listen(port, () => {
  console.log(`Servidor Express ouvindo na porta ${port}`);
});
