// server.js

const express = require('express');
const app = express();
const port = 5000;
const cors = require('cors');
var corsOptions = {
  origin: 'http://localhost:5507',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(express.json());

app.get('/',cors(corsOptions) ,(req, res) => {
  var x;
  // Access the query parameter 'value'
  const queryValue = req.query.value;
  v = queryValue.split(".");
  var stripe = require('stripe')(v[0])
  const intent =  stripe.paymentIntents.create({
    amount: Number(v[1]), // Amount in cents
    currency: 'usd', // Currency code
    payment_method_types: ['card'],
    statement_descriptor: 'Custom descriptor'
  });
  intent.then((intent) => {
    x=(intent.client_secret);
    const responseData = { message: x };

  res.json(responseData);
  })

  // Assuming some data related to the provided value
  
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
