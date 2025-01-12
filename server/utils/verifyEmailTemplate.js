const VerificationEmail = (username, otp) => {
  return `
  <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Email Verification</title>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Roboto', sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background: #ffffff;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            border: 1px solid rgba(0, 0, 0, 0.15);
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
        }
        .header img {
            width: 120px;
            margin-bottom: 10px;
        }
        .heading {
            font-size: 24px;
            font-weight: 500;
        }
        .content {
            line-height: 1.6;
            font-size: 16px;
            margin-bottom: 20px;
        }
        .otp {
            font-size: 36px;
            font-weight: bold;
            text-align: center;
            margin: 20px 0;
        }
        .footer {
            text-align: center;
            font-size: 12px;
            color: #777;
            margin-top: -18px;
        }
        .footer a {
            color: #007BFF;
            text-decoration: none;
        }
        hr {
            border: 0;
            border-top: 1px solid rgba(0, 0, 0, 0.1);
            margin: 20px 0;
        }
        .small-line-height {
            line-height: 1.3; /* Reduced line height */
        }

        /* Responsive Design */
        @media screen and (max-width: 600px) {
            .container {
                padding: 20px;
            }
            .heading {
                font-size: 20px;
            }
            .content {
                font-size: 14px;
            }
            .otp {
                font-size: 30px;
            }
            .footer {
                font-size: 10px;
            }
        }

        @media screen and (max-width: 400px) {
            .heading {
                font-size: 18px;
            }
            .content {
                font-size: 13px;
            }
            .otp {
                font-size: 28px;
            }
            .footer {
                font-size: 9px;
            }
        }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <img src="https://raw.githubusercontent.com/TarunPatil001/ecommerce-app/main/client/public/logo.jpg" alt="Logo" />
        <div class="heading">Verify your email</div>
      </div>
      <hr />
      <div class="content">
        <p>Hi <strong>${username}</strong>,</p>
        <p>Thank you for registering with Ecommerce App! Please use the OTP below to verify your email address:</p>
        <div class="otp">${otp}</div>
        <p class="small-line-height">This code will expire in 10 minutes.</p>
        <p class="small-line-height">If you did not request this, you can safely ignore this email.</p>
      </div>
    </div>
      <div class="footer">
        <p>&copy; ${new Date().getFullYear()} Ecommerce App. All rights reserved.</p>
      </div>
  </body>
</html>


      `;
};

export default VerificationEmail;
