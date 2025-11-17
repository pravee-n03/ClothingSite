# Current Authentication Flow - User Login/Signup

This document explains how user authentication works in your deployed Vercel application.

## Overview

Your application uses a **custom JWT-based authentication system** with:
- **Access Tokens** (short-lived: 7 minutes)
- **Refresh Tokens** (long-lived: 5 years)
- **HttpOnly Cookies** for secure token storage
- **MongoDB** for user data and token storage
- **bcrypt** for password hashing

---

## 📝 User Signup Flow

### Step 1: User Fills Form
**File**: `pages/auth/signup.js`

User enters:
- First Name (required)
- Last Name (required)
- Email (required, validated)
- Password (required, must have uppercase, lowercase, numbers, 6-40 chars)
- Phone Number (optional)
- Address (optional)
- Accepts Terms & Conditions (required)

### Step 2: Frontend Sends Request
**File**: `pages/auth/signup.js` (lines 28-34)

```javascript
POST /api/auth/users
Content-Type: application/json

{
  "name": "John",
  "lastname": "Doe",
  "email": "john@example.com",
  "password": "Password123",
  "phone": "1234567890",
  "address": "123 Main St"
}
```

### Step 3: API Route Handler
**File**: `pages/api/auth/users.js`

- Routes POST request to `signupController`
- Wraps with `connectDB` middleware to ensure MongoDB connection

### Step 4: Database Connection
**File**: `middleware/db/mongodb.js`

1. Checks if `MONGODB_URI` environment variable is set
2. Checks if MongoDB is already connected
3. If not connected, connects to MongoDB using connection string
4. Returns error if connection fails

### Step 5: Signup Controller
**File**: `controller/authController/userSignupController.js`

#### 5.1 Validate Input
- Checks if `name`, `lastname`, `email`, and `password` are provided
- Returns error if data is incomplete

#### 5.2 Hash Password
**File**: `shared/utils/auth/bcrypt.js`
- Uses bcrypt to hash password with salt rounds of 10
- Password is never stored in plain text

#### 5.3 Create User in MongoDB
**File**: `models/UserModel.js`
- Creates new user document in MongoDB
- Fields saved:
  - `name`, `lastname`, `email`, `password` (hashed)
  - `phone`, `address` (optional)
  - `suspend: false` (default)
  - `avatar` (default image)
  - `createdAt`, `updatedAt` (timestamps)

#### 5.4 Generate JWT Tokens
**File**: `shared/utils/auth/JWTUtils.js`

**Access Token**:
- Contains user ID
- Signed with `process.env.access` secret
- Expires in 7 minutes
- Used for API authentication

**Refresh Token**:
- Contains user ID
- Signed with `process.env.refresh` secret
- Expires in 5 years
- Used to generate new access tokens

#### 5.5 Save Refresh Token to Database
**File**: `shared/utils/auth/refreshTokenSubmit.js`
- Saves refresh token to MongoDB `refreshtokens` collection
- Links token to user ID (`ownerId`)
- Used for token validation and security (prevents token hijacking)

#### 5.6 Set Cookies
**File**: `shared/utils/auth/tokenCookei.js`

Sets three HttpOnly cookies:
1. **`access`** cookie - Contains access token
   - HttpOnly: true
   - Secure: true (in production)
   - SameSite: lax
   - MaxAge: 7 minutes

2. **`refresh`** cookie - Contains refresh token
   - HttpOnly: true
   - Secure: true (in production)
   - SameSite: lax
   - MaxAge: 5 years

3. **`isAdmin`** cookie - Contains "false"
   - HttpOnly: true
   - Secure: true (in production)
   - SameSite: lax

#### 5.7 Return Success Response
```json
{
  "message": "account created successfuly",
  "user": {
    "name": "John",
    "lastname": "Doe",
    "phone": "1234567890",
    "address": "123 Main St"
  }
}
```

### Step 6: Frontend Handles Response
**File**: `pages/auth/signup.js` (lines 51-54)

- Updates global context with user data
- Redirects to home page (`/`)
- User is now logged in (cookies are set automatically)

---

## 🔐 User Login Flow

### Step 1: User Fills Form
**File**: `pages/auth/login.js`

User enters:
- Email (required, validated)
- Password (required, validated)

### Step 2: Frontend Sends Request
**File**: `pages/auth/login.js` (lines 22-28)

```javascript
PUT /api/auth/users
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "Password123"
}
```

### Step 3: API Route Handler
**File**: `pages/api/auth/users.js`

- Routes PUT request to `loginController`
- Passes `isAdmin: false` parameter

### Step 4: Login Controller
**File**: `controller/authController/loginController.js`

#### 4.1 Validate Input
- Checks if `email` and `password` are provided
- Returns error if incomplete

#### 4.2 Find User in Database
**File**: `models/UserModel.js`
- Searches for user by email
- Returns error if user not found

#### 4.3 Verify Password
**File**: `shared/utils/auth/bcrypt.js`
- Compares plain password with hashed password
- Uses bcrypt.compare()
- Returns error if password incorrect

#### 4.4 Generate JWT Tokens
**File**: `shared/utils/auth/JWTUtils.js`

Same as signup:
- Generates access token (7 minutes)
- Generates refresh token (5 years)

#### 4.5 Save Refresh Token
**File**: `shared/utils/auth/refreshTokenSubmit.js`
- Saves new refresh token to database
- Old refresh tokens remain (for security tracking)

#### 4.6 Set Cookies
**File**: `shared/utils/auth/tokenCookei.js`

Sets three cookies (same as signup):
- `access` cookie
- `refresh` cookie
- `isAdmin` cookie (set to "false")

#### 4.7 Return Success Response
```json
{
  "message": "login successfuly",
  "account": {
    "name": "John",
    "lastname": "Doe",
    "phone": "1234567890",
    "address": "123 Main St"
  }
}
```

### Step 5: Frontend Handles Response
**File**: `pages/auth/login.js` (lines 39-42)

- Updates global context with user data
- Redirects to home page (`/`)
- User is now logged in

---

## 🔄 Token Refresh Flow

### When Access Token Expires

Access tokens expire after 7 minutes. When a protected API call is made:

### Step 1: Client Makes Request
- Sends both `access` and `refresh` cookies
- Or sends refresh token if access token is missing

### Step 2: Access Control Check
**File**: `controller/authController/clientAccessController.js`

#### 2.1 Extract Tokens from Cookies
- Gets `access` and `refresh` tokens from cookies
- Checks headers first (server-side), then cookies (client-side)

#### 2.2 Verify Access Token
**File**: `shared/utils/auth/JWTUtils.js`
- Decodes access token
- Verifies signature with `process.env.access` secret
- Extracts user ID from token
- Finds user in database
- Checks if user is suspended

#### 2.3 If Access Token Valid
- Sets `authorized: true` header
- Returns `{ message: "user authorized" }`
- Request proceeds

#### 2.4 If Access Token Invalid/Expired
- Verifies refresh token instead

#### 2.5 Verify Refresh Token
**File**: `controller/authController/clientAccessController.js` (refreshTokenVerifier)

1. **Decode Refresh Token**
   - Verifies signature with `process.env.refresh` secret
   - Extracts user ID

2. **Check Token in Database**
   - Searches for refresh token in MongoDB
   - **If found**: Token is valid, delete it (one-time use)
   - **If not found but token is valid**: Token was hijacked, suspend account

3. **Security Feature**
   - Refresh tokens are one-time use
   - If a valid refresh token is used but not found in DB, account is suspended
   - Prevents token hijacking attacks

#### 2.6 Generate New Tokens
**File**: `controller/authController/clientAccessController.js` (authenticated function)

If refresh token is valid:
1. Generate new access token (7 minutes)
2. Generate new refresh token (5 years)
3. Save new refresh token to database
4. Set new cookies
5. Return authorized response

#### 2.7 If Refresh Token Invalid
- Delete all cookies
- Return `{ message: "user not authorized" }`
- User must login again

---

## 🔒 Security Features

### 1. Password Security
- Passwords are hashed with bcrypt (salt rounds: 10)
- Never stored in plain text
- Never sent in response

### 2. Token Security
- **HttpOnly Cookies**: Tokens cannot be accessed by JavaScript (XSS protection)
- **Secure Cookies**: Only sent over HTTPS in production
- **SameSite**: CSRF protection
- **Short-lived Access Tokens**: 7 minutes (limits damage if compromised)
- **One-time Refresh Tokens**: Prevents reuse if stolen

### 3. Token Hijacking Protection
- Refresh tokens stored in database
- If valid token used but not in DB → account suspended
- Prevents use of stolen tokens

### 4. Account Suspension
- Users can be suspended (`suspend: true`)
- Suspended users cannot access protected resources
- Automatic suspension on token hijacking detection

---

## 🗄️ Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String (required),
  lastname: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  phone: Number,
  address: String,
  suspend: Boolean (default: false),
  avatar: String (default: default image),
  createdAt: Date,
  updatedAt: Date
}
```

### Refresh Tokens Collection
```javascript
{
  _id: ObjectId,
  token: String (required),
  ownerId: String (required, user ID),
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔑 Environment Variables Required

### For Vercel Deployment:

1. **`MONGODB_URI`** (Required)
   - MongoDB connection string
   - Format: `mongodb+srv://username:password@cluster.mongodb.net/database?options`

2. **`refresh`** (Required)
   - Secret key for signing refresh tokens
   - Should be long, random string
   - Used in JWT signing

3. **`access`** (Required)
   - Secret key for signing access tokens
   - Should be long, random string (different from refresh)
   - Used in JWT signing

4. **`NODE_ENV`** (Automatic)
   - Set to `production` by Vercel
   - Used to enable secure cookies

---

## 📊 Flow Diagrams

### Signup Flow
```
User Form → POST /api/auth/users → Connect DB → Hash Password → 
Create User → Generate Tokens → Save Refresh Token → Set Cookies → 
Return Success → Redirect to Home
```

### Login Flow
```
User Form → PUT /api/auth/users → Connect DB → Find User → 
Verify Password → Generate Tokens → Save Refresh Token → 
Set Cookies → Return Success → Redirect to Home
```

### Token Refresh Flow
```
API Request → Extract Tokens → Verify Access Token → 
If Invalid → Verify Refresh Token → Check in DB → 
If Valid → Generate New Tokens → Save Refresh Token → 
Set New Cookies → Return Authorized
```

---

## 🐛 Common Issues

### 1. "undefined" Error
- **Cause**: Environment variables not set in Vercel
- **Solution**: Set `MONGODB_URI`, `refresh`, and `access` in Vercel

### 2. Database Connection Failed
- **Cause**: `MONGODB_URI` not set or incorrect
- **Solution**: Verify connection string in Vercel environment variables

### 3. Authentication Failed
- **Cause**: JWT secrets not set or incorrect
- **Solution**: Verify `refresh` and `access` environment variables

### 4. Cookies Not Set
- **Cause**: Secure cookies require HTTPS
- **Solution**: Ensure Vercel deployment uses HTTPS (automatic)

### 5. Token Expired
- **Cause**: Access token expired (7 minutes)
- **Solution**: System automatically refreshes using refresh token

---

## 🔍 Key Files Reference

### Frontend
- `pages/auth/signup.js` - Signup page
- `pages/auth/login.js` - Login page

### Backend API
- `pages/api/auth/users.js` - User auth API route

### Controllers
- `controller/authController/userSignupController.js` - Signup logic
- `controller/authController/loginController.js` - Login logic
- `controller/authController/clientAccessController.js` - Token verification

### Models
- `models/UserModel.js` - User schema
- `models/RefreshTokenModel.js` - Refresh token schema

### Utilities
- `shared/utils/auth/JWTUtils.js` - JWT token generation/verification
- `shared/utils/auth/bcrypt.js` - Password hashing
- `shared/utils/auth/tokenCookei.js` - Cookie management
- `shared/utils/auth/refreshTokenSubmit.js` - Token storage

### Middleware
- `middleware/db/mongodb.js` - Database connection

### Configuration
- `shared/json/index.js` - Token configuration (ages, types)

---

## 📝 Notes

1. **Cookies are HttpOnly**: Cannot be accessed by JavaScript (XSS protection)
2. **Tokens are signed**: Cannot be tampered with (JWT signature)
3. **Refresh tokens are one-time use**: Prevents reuse if stolen
4. **Account suspension**: Automatic on token hijacking detection
5. **Password hashing**: bcrypt with salt rounds 10
6. **Token expiration**: Access (7 min), Refresh (5 years)
7. **Secure in production**: Cookies only sent over HTTPS

---

This is how your current authentication system works. All user data and tokens are stored in MongoDB, and authentication is handled through JWT tokens stored in HttpOnly cookies.



