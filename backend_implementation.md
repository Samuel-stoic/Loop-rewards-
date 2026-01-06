
# LoopRewards Backend Implementation Guide

This document outlines how to move from the React-simulated service to a real Node.js/PostgreSQL backend.

## 1. Database Schema (SQL)
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    is_suspended BOOLEAN DEFAULT FALSE,
    role VARCHAR(20) DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_ip INET,
    fingerprint TEXT,
    country VARCHAR(10),
    streak INTEGER DEFAULT 0,
    last_daily_bonus DATE
);

CREATE TABLE wallets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    balance_ngn DECIMAL(15, 2) DEFAULT 0,
    points INTEGER DEFAULT 0
);

CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    type VARCHAR(50) NOT NULL,
    amount DECIMAL(15, 2),
    points INTEGER,
    status VARCHAR(20) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    type VARCHAR(20) NOT NULL,
    value DECIMAL(15, 2) NOT NULL,
    expiry_date DATE NOT NULL,
    usage_limit INTEGER DEFAULT 1,
    used_count INTEGER DEFAULT 0,
    enabled BOOLEAN DEFAULT TRUE
);
```

## 2. Server Implementation snippet (Node.js + Express)
```javascript
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const app = express();

app.use(helmet());
app.use(express.json());

// Cloudflare Helper
const getClientInfo = (req) => {
    return {
        ip: req.headers['cf-connecting-ip'] || req.ip,
        country: req.headers['cf-ipcountry'] || 'Unknown'
    };
};

// Rate Limiter
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests from this IP"
});
app.use("/api/", apiLimiter);

// Endpoint Example
app.post('/api/user/withdraw', async (req, res) => {
    const { ip, country } = getClientInfo(req);
    // 1. Auth middleware check
    // 2. Anti-fraud check (VPN/Proxy)
    // 3. Database transaction (ACID)
    // 4. Return response
});

app.listen(3000, () => console.log('LoopRewards Backend running on port 3000'));
```

## 3. How to Test
1. **Signup**: Use a real email. Check the browser console for the mock OTP.
2. **Login**: Enter verified credentials.
3. **Tasks**: Go to the Tasks page, click 'Complete', and provide a TikTok username.
4. **Admin**: Log in with `youngstoic11@gmail.com` / `Nosayi17$`. You will see task logs and withdrawal requests ready for approval.
5. **Fraud**: The system logs fake IP attempts in the admin panel if they match internal "blocked" patterns.
