const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const twilio = require('twilio');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post('/api/send-appointment', async (req, res) => {
  try {
    const { fullName, phone, service, date, details } = req.body || {};

    if (!fullName || !phone || !service || !date || !details) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_PHONE_NUMBER;
    const recipientPhone = process.env.RECIPIENT_PHONE;

    if (!accountSid || !authToken || !fromNumber || !recipientPhone) {
      return res.status(500).json({ error: 'Twilio configuration missing' });
    }

    const client = twilio(accountSid, authToken);

    const messageBody = `Please look for this appointment. Name: ${fullName}. Service: ${service}. Date: ${date}. Phone: ${phone}.`;

    const message = await client.messages.create({
      body: messageBody,
      from: fromNumber,
      to: recipientPhone
    });

    return res.status(200).json({
      success: true,
      messageId: message.sid,
      status: message.status
    });
  } catch (error) {
    console.error('Twilio send error:', error);
    return res.status(500).json({
      error: 'Failed to send SMS',
      details: error.message
    });
  }
});

app.listen(port, () => {
  console.log(`Appointment server running on http://localhost:${port}`);
});
