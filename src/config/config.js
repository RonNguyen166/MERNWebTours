import "dotenv/config";

const config = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  mongoose: {
    url:
      process.env.MONGODB_URL +
      (process.env.NODE_ENV === "test" ? "-test" : ""),
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    accessExpirationMinutes: process.env.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: process.env.JWT_REFRESH_EXPIRATION_DAYS,
    cookieExpirationDays: process.env.JWT_COOKIE_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes:
      process.env.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    verifyEmailExpirationMinutes:
      process.env.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
  },
  email: {
    smtp: {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
      },
    },
    from: process.env.EMAIL_FROM,
  },
  googleClient: {
    oauth2ClientID: process.env.OAUTH2_CLIENT_ID,
  },
  facebookSecret: process.env.FACEBOOK_SECRET,
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY,
  },
};

export default config;
