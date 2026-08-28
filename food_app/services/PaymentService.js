// Express Node.js Payment Webhook Listener
const express = require('express');
const app = express();
app.use(express.json());

app.post('/webhook/payment', (req, res) => {
    const { orderId, status } = req.body;
    console.log(`Payment status for order ${orderId}: ${status}`);
    res.status(200).send({ received: true });
});

app.listen(5002, () => console.log('Node Payment Service running on port 5002')); 