// server.js
require('dotenv').config({ path: __dirname + '/../.env' });
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');

const { connectRedis } = require('./configs/redis');
const initializeRoutes = require('./routes/route');

// ✅ Custom middleware to inject context
const requestContext = require('./middlewares/requestContext');

// ✅ Middleware to optionally log every request
const { requestLogger } = require('./middlewares/requestLogger');

const app = express();
const PORT = process.env.MS_PORT || 3000;

// 🛡️ CORS setup
app.use(cors({
  origin: 'http://localhost:5000',
  credentials: true
}));

// 🍪 Middleware setup
app.use(helmet());
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// 🔒 Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.RATE_LIMIT, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later."
});
app.use(limiter);

// 🧠 Inject request context into AsyncLocalStorage
app.use(requestContext);

// 📝 Log each request (optional, can be toggled or filtered)
app.use(requestLogger);

// 🚀 Boot up
(async () => {
  try {
    await connectRedis();
    await initializeRoutes(app);

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to initialize server:", err);
    process.exit(1);
  }
})();
