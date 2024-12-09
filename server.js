const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const { Storage } = require('@google-cloud/storage');
const multer = require('multer'); // First and only declaration
const stripe = require('stripe')('your-stripe-secret-key'); // Replace with your Stripe secret key
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors()); // For handling cross-origin requests
app.get('/favicon.ico', (req, res) => res.status(204).end());


// Configure Multer to use memory storage
const upload = multer({ storage: multer.memoryStorage() });

// Static files (CSS, JS, Images)
app.use(express.static('public'));

// Nodemailer with Mailgun Configuration
const transporter = nodemailer.createTransport({
    host: "smtp.mailgun.org",
    port: 587,
    auth: {
        user: "postmaster@sandboxd6daf816fa9d4ed1be462febe4636b40.mailgun.org", // Replace with your sandbox domain
        pass: "b928402e82e12e3007aad775f742811c-f55d7446-60c6a826", // Replace with your SMTP password
    },
});
// Google Cloud Storage Configuration
const storage = new Storage({
    keyFilename: 'path-to-your-service-account.json', // Replace with your JSON key file path
    projectId: 'your-project-id',                    // Replace with your Google Cloud project ID
});
const bucketName = 'your-bucket-name'; // Replace with your bucket name

// Routes

// 1. Contact Form Email Sending
// Contact Form Email Sending
app.post('/send-email', (req, res) => {
    const { name, email, message, consultation_day, consultation_mode } = req.body;
  
    const mailOptions = {
      from: `${name} <${email}>`,
      to: 'j00512317@gmail.com',
      subject: `Contact Form Submission from ${name}`,
      text: `
        Name: ${name}
        Email: ${email}
        Message: ${message}
        Consultation Day: ${consultation_day}
        Consultation Mode: ${consultation_mode}
      `,
    };
  
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Failed to send email');
      }
      res.send('Email sent successfully!');
    });
  });  
// Submit Application Form
app.post('/submit-application', upload.array('documents', 5), (req, res) => {
    console.log('Files:', req.files); // Debug log for uploaded files
    console.log('Body:', req.body);   // Debug log for form fields

    if (!req.files) {
        return res.status(400).send('No files were uploaded');
    }
    const { name, email, details } = req.body;
    const attachments = req.files.map(file => ({
        filename: file.originalname,
        content: file.buffer,
    }));

    const mailOptions = {
        from: `${email}`, // Use the sender's email from the form dynamically
        to: 'kelvinekiganga999@gmail.com', // Replace with your organization's email
        subject: `Application Form Submission from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\nLand Details: ${details}`,
        attachments: attachments,
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Failed to send application email');
        }
        res.send('Application email sent successfully!');
    });
});

// Hire Us Form
app.post('/hire-us', upload.array('documents', 5), (req, res) => {
    const { name, email, land_details, consultation_day, service_type } = req.body;
  
    const attachments = req.files?.map((file) => ({
      filename: file.originalname,
      content: file.buffer,
    }));
  
    const mailOptions = {
      from: `${name} <${email}>`,
      to: 'j00512317@gmail.com',
      subject: `Hire-Us Form Submission from ${name}`,
      text: `
        Name: ${name}
        Email: ${email}
        Land Details: ${land_details}
        Consultation Day: ${consultation_day}
        Service Type: ${service_type}
      `,
      attachments,
    };
  
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Failed to send hire-us email');
      }
      res.send('Hire-us email sent successfully!');
    });
  });  
// Contact Us Form Submission
app.post('/contact-us', (req, res) => {
    const { name, email, message } = req.body;

    const mailOptions = {
        from: email, // Use the sender's email from the form
        to: 'kelvinekiganga999@gmail.com', // Replace with your organization's email
        subject: `Contact Form: ${name}`, // Include the name in the subject
        text: `You have received a new message from your website contact form.Name: ${name} Email: ${email}
          Message:${message}`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.error('Error sending email:', err);
            return res.status(500).send('Failed to send contact form email');
        }
        res.send('Contact form email sent successfully!');
    });
});

    // 2. Helcim Payment Intent (Redirect)
    app.get('/payment-redirect', (req, res) => {
    // Replace with your Helcim Payment Page URL
    const helcimPaymentPageUrl = "https://secure.helcim.com/payment/your-helcim-id";
    res.redirect(helcimPaymentPageUrl);
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

/*/ 4. Stripe Payment Intent Creation
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
});*/

// Server Listener
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
