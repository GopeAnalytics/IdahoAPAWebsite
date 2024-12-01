const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const { Storage } = require('@google-cloud/storage');
const multer = require('multer');
const stripe = require('stripe')('your-stripe-secret-key'); // Replace with your Stripe secret key
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors()); // For handling cross-origin requests

// Static files (CSS, JS, Images)
app.use(express.static('public'));

// Nodemailer Configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'olwenyjohn87@gmail.com', // Replace with your email
        pass: 'jnnr cfps siur xjgh',   // Replace with your email password or app-specific password
    },
});

// Google Cloud Storage Configuration
const storage = new Storage({
    keyFilename: 'path-to-your-service-account.json', // Replace with your JSON key file path
    projectId: 'your-project-id',                    // Replace with your Google Cloud project ID
});
const bucketName = 'your-bucket-name'; // Replace with your bucket name
const upload = multer({ storage: multer.memoryStorage() });

// Routes

// 1. Contact Form Email Sending
app.post('/send-email', (req, res) => {
    const { name, email, message } = req.body;

    const mailOptions = {
        from: email,
        to: 'j00512317@gmail.com', // Replace with your organization's email
        subject: `Contact Form: ${name}`,
        text: message,
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Email failed to send');
        }
        res.send('Email sent successfully!');
    });
});

// 2. Application Form Submission (with Email)
app.post('/submit-application', (req, res) => {
    const { name, email, applicationDetails } = req.body;

    const mailOptions = {
        from: email,
        to: 'olwenyjohn87@gmail.com',
        subject: `New Application Submission: ${name}`,
        text: applicationDetails,
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Application submission failed');
        }
        res.send('Application submitted successfully!');
    });
});

// 3. File Upload to Google Cloud
app.post('/upload', upload.single('document'), (req, res) => {
    const bucket = storage.bucket(bucketName);
    const blob = bucket.file(req.file.originalname);
    const blobStream = blob.createWriteStream({
        resumable: false,
        metadata: {
            contentType: req.file.mimetype,
        },
    });

    blobStream.on('error', (err) => {
        console.error(err);
        res.status(500).send('File upload failed');
    });

    blobStream.on('finish', () => {
        res.send('File uploaded successfully!');
    });

    blobStream.end(req.file.buffer);
});

// 4. Stripe Payment Intent Creation
app.post('/create-payment-intent', async (req, res) => {
    try {
        const { amount } = req.body; // Amount in cents
        const paymentIntent = await stripe.paymentIntents.create({
            amount, // Amount should be sent from frontend
            currency: 'usd',
            payment_method_types: ['card'],
        });

        res.send({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error(error);
        res.status(500).send('Payment creation failed');
    }
});

// Server Listener
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
