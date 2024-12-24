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

require('dotenv').config(); // Load environment variables

// Configure Multer to use memory storage
const upload = multer({ storage: multer.memoryStorage() });

// Static files (CSS, JS, Images)
app.use(express.static('public'));

// Nodemailer with Mailgun Configuration
const transporter = nodemailer.createTransport({
    host: "smtp.mailgun.org",
    port: 587,
    auth: {
        user: process.env.MAILGUN_USER, // From .env file
        pass: process.env.MAILGUN_PASS, // From .env file
    },
});
// Google Cloud Storage Configuration
const storage = new Storage({
    keyFilename: process.env.GOOGLE_KEY_FILE, // From .env file
    projectId: process.env.GOOGLE_PROJECT_ID, // From .env file
});
const bucketName = 'your-bucket-name'; // Replace with your bucket name

// Routes

// 1. Contact Form Email Sending
app.post('/send-email', (req, res) => {
  const { name, email, message, consultation_day, consultation_mode } = req.body;

  const mailOptions = {
    from: `"${name}" <${email}>`,
    to: process.env.ORGANIZATION_EMAIL, // From .env file
    subject: `New Consultation Form Submission from ${name}`,
    text: `
Dear Team,

You have received a new consultation form submission with the following details:

Name: ${name}
Email: ${email}
Consultation Day: ${consultation_day}
Consultation Mode: ${consultation_mode}

Message:
${message}

Please review and take the necessary action.

Best regards,
Automated Notification System
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

// Application Form Submission
app.post('/submit-application', upload.array('documents', 5), (req, res) => {
  console.log('Files received:', req.files); // Log the received files
  console.log('Form fields received:', req.body); // Log the other form fields
    const { name, email, details } = req.body;

    // Prepare attachments if files are uploaded
    const attachments = req.files && req.files.length > 0
        ? req.files.map((file) => ({
              filename: file.originalname,
              content: file.buffer,
          }))
        : []; // Empty array if no files are uploaded

    const mailOptions = {
      from: `${name} <${email}>`, // Use the sender's email from the form dynamically
        to: process.env.ORGANIZATION_EMAIL, // From .env file
        subject: `Application Form Submission from ${name}`,
        text: `
        Name: ${name}
        Email: ${email}
        Land Details: ${details}
        `,
        attachments, // Attach files if present
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
    console.log('Headers:', req.headers); // Log headers to check Content-Type
    console.log('Files received:', req.files); // Log the received files
    console.log('Form fields received:', req.body); // Log the other form fields
    const { name, email, land_details, consultation_day, service_type } = req.body;
  
    // Prepare attachments if files are uploaded
    const attachments = req.files && req.files.length > 0
        ? req.files.map((file) => ({
              filename: file.originalname,
              content: file.buffer,
          }))
        : []; // Empty array if no files are uploaded

    const mailOptions = {
      from: `${name} <${email}>`,
      to: process.env.ORGANIZATION_EMAIL, // From .env file
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
      from: `${name} <${email}>`, // Use the sender's email from the form
        to: process.env.ORGANIZATION_EMAIL, // From .env file
        subject: `Contact Form From ${name}`, // Include the name in the subject
        text:`
        Below is the information submitted through the Contact Us form on our website from ${name}.
        Email: ${email}
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
    const helcimPaymentPageUrl = process.env.HELCIM_PAYMENT_PAGE_URL; // From .env file
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

// Server Listener
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
