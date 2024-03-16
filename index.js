const express = require('express');
const multer = require('multer');
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const cors = require('cors'); 
const app = express();
const port = 8080;

app.use(express.static('public'));
app.use(cors({
    origin: '*'
  }));
const upload = multer({ dest: 'uploads/' });


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

// You don't need bodyParser middleware for file uploads
app.post('/pdfsend', upload.single('file'), async (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).send('Please upload a file.');
  }

  // SMTP configuration for your domain
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com", // Correct SMTP server hostname
    port: 465, // Secure port for SSL/TLS
    secure: true, // true for 465, other ports false
    auth: {
      user: "info@skillhubinstitute.com", // Your full email address
      pass: "osgr gewx hpaj jyra" // Your email account password
    }
  });

  const mailOptions = {
    from: 'info@skillhubinstitute.com',
    to: 'info@skillhubinstitute.com',
    subject: 'Registration form',
    text: 'Attached is the PDF you requested.',
    attachments: [
      {
        filename: 'Registration Form.pdf',
        path: path.join(__dirname, file.path),
      },
    ],
  };
  

  transporter.sendMail(mailOptions, function (error, info) {
    fs.unlink(path.join(__dirname, file.path), (err) => {
      if (err) console.error("Error deleting file:", err);
    });

    if (error) {
      console.error("Error sending email:", error);
      return res.status(500).send('Error sending email');
    } else {
      console.log('Email sent: ' + info.response);
      return res.send('PDF sent via email successfully!');
    }
  });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
