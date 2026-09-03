require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const connectDB = require('./config/db');
const localsMiddleware = require('./middleware/locals');
const routes = require('./routes');

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);

// Connect to Database Subsystem
connectDB();

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// View Engine Setup (EJS)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Session Configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'bitwise_cyber_secret_key_2026_super_secure',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7 // 7 days
    }
  })
);

// Flash Messages
app.use(flash());

// Global Template Locals
app.use(localsMiddleware);

// Mount Routes
app.use(routes);

// 404 Cyber Handler
app.use((req, res, next) => {
  res.status(404).render('pages/404', {
    title: '404 - Neural Node Not Found | Bitwise School of Technology'
  });
});

// 500 Internal Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled System Error:', err);
  res.status(500).render('pages/500', {
    title: '500 - Subsystem Malfunction | Bitwise School of Technology',
    error: process.env.NODE_ENV === 'development' ? err : null
  });
});

// Start Server with Resilient Port Fallback
function startServer(portToTry) {
  const numericPort = Number(portToTry);
  const server = app.listen(numericPort, () => {
    console.log('========================================================');
    console.log(`⚡ [BITWISE SCHOOL OF TECHNOLOGY]: Platform Online!`);
    console.log(`🌐 Web Portal URL: http://localhost:${numericPort}`);
    console.log(`🛡️  Admin Command Center: http://localhost:${numericPort}/admin`);
    console.log(`🚀 Student Launchpad: http://localhost:${numericPort}/launchpad`);
    console.log('========================================================\n');
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`⚠️ [BITWISE SERVER]: Port ${numericPort} in use, attempting port ${numericPort + 1}...`);
      startServer(numericPort + 1);
    } else {
      console.error('Server error:', err);
    }
  });

  return server;
}

startServer(PORT);

module.exports = app;
