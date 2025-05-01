/* eslint-disable no-console */
const express = require('express');
const faker = require('faker');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());

const generateMessages = (num) => Array.from({ length: num }, () => {
  const receivedTime = Math.floor(Date.now() / 1000)
      - faker.datatype.number({ min: 0, max: 86400 });
  return {
    id: faker.datatype.uuid(),
    from: faker.internet.email(),
    subject: faker.lorem.sentence(),
    body: faker.lorem.paragraph(),
    received: receivedTime >= 0 ? receivedTime : 0,
  };
});

// Endpoint
app.get('/messages/unread', (req, res) => {
  const messages = generateMessages(5);
  const response = {
    status: 'ok',
    timestamp: Math.floor(Date.now() / 1000),
    messages,
  };
  res.status(200).json(response);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
