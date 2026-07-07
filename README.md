# 🏡 RentNest - Premium Property Rental & Management Platform

RentNest is a feature-rich, high-performance property rental management platform that connects tenants looking for houses/apartments with landlords, backed by Stripe payments and administrator moderation.

---

## ✨ Features by Role

### 👤 Tenant Features
* **Authentication**: Register and login with secure password hashing.
* **Property Search**: Browse properties using advanced multi-variable filters:
  * Location keyword search
  * Price range (`minPrice` & `maxPrice`)
  * Category types (Studio, Apartment, Duplex, etc.)
  * Specific amenities (WiFi, AC, Parking, Gym, etc.)
* **Rental Requests**: Submit rental requests for available properties (excluding properties owned by themselves).
* **Booking Lifecycle**: Track request status (`PENDING`, `APPROVED`, `REJECTED`, `ACTIVE`, `COMPLETED`).
* **Stripe Payments**: Securely pay monthly-based rent values in **BDT** currency using Stripe Checkout.
* **Rental Completion**: Check out from active rental stays.
* **Reviews**: Leave ratings ($1-5$) and written reviews on properties (restricted to exactly **one review per completed stay** to prevent spam).

### 🏡 Landlord Features
* **Property Listings Management**: Full CRUD operations on property listings (Title, Description, Location, Price, Bedroom/Bathroom counts, Amenities, Category).
* **Manual Availability Toggle**: Manually flip availability status (`isAvailable = true/false`) to temporarily hide listings.
* **Rental Moderation Dashboard**: View and manage incoming tenant requests:
  * Approve or Reject request submissions.
* **Manual Checkout Confirm**: Complete active rental requests, triggering database state updates to mark the property available again.

### 🛡️ Admin Features
* **System Moderation**: View unified lists of all properties and rental request histories.
* **User Management**: Active dashboard to block or reactivate accounts (`ACTIVE` / `BLOCKED`).

---

## 🛠️ Tech Stack & Architecture
* **Runtime**: Node.js with TypeScript
* **Framework**: Express.js
* **Database**: PostgreSQL
* **ORM**: Prisma ORM
* **Payments**: Stripe SDK
* **Security**: JWT (JSON Web Tokens) & bcryptjs

---

## 🚀 Setup & Installation Instructions

### 1. Prerequisites
Make sure you have [Node.js](https://nodejs.org) (v18+) and [PostgreSQL](https://www.postgresql.org/) installed and running locally, or access to a cloud PostgreSQL instance (e.g. Prisma Postgres, Supabase, Neon).

### 2. Install Dependencies
Navigate to the project root and install the required npm packages:
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory and configure the variables as follows:
```env
PORT=5000
DATABASE_URL="postgresql://username:password@localhost:5432/rentnest?schema=public"

JWT_ACCESS_SECRET="your_jwt_access_secret_key"
JWT_ACCESS_EXPIRES_IN="3d"
JWT_REFRESH_SECRET="your_jwt_refresh_secret_key"
JWT_REFRESH_EXPIRES_IN="7d"

BCRYPT_SALT_ROUNDS=10
APP_URL="http://localhost:3000"

# Stripe Configurations
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

### 4. Database Setup
Run Prisma migrations to initialize the database tables and relations:
```bash
npx prisma db push
```

### 5. Start the Application
To run the server in development mode with automatic reload:
```bash
npm run dev
```
The server will run on `http://localhost:5000`.

### 6. Stripe Webhook Tunneling (Local testing)
To forward webhook events from Stripe to your local Express server, run:
```bash
npm run stripe:webhook
```
*Note: Copy the `webhook signing secret` printed in your terminal (starts with `whsec_`) and save it as your `STRIPE_WEBHOOK_SECRET` in the `.env` file.*

---

## 🔌 API Endpoints Directory

###  Authentication
| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/register` | Public | Register a new user (Tenant or Landlord) |
| **POST** | `/api/auth/login` | Public | Authenticate credentials and return JWT tokens |
| **POST** | `/api/auth/refresh-token` | Public | Refresh JWT access token using refresh token |
| **GET** | `/api/auth/me` | All Users | Retrieve current authenticated user's profile |
| **PATCH** | `/api/auth/me` | All Users | Update current authenticated user's profile |

###  Public Browsing
| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/properties` | Public | List properties with support for filtering, sorting, & pagination |
| **GET** | `/api/properties/:propertyId` | Public | Retrieve detailed property specification along with category, landlord, and reviews |
| **GET** | `/api/categories` | Public | Get all categories |

###  Tenant Operations
| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/rentals` | Tenant | Submit a new rental request |
| **GET** | `/api/rentals` | Tenant | Retrieve rental requests history |
| **GET** | `/api/rentals/:rentalRequestId` | Tenant | Retrieve detailed rental request specifications |
| **PATCH** | `/api/rentals/:rentalRequestId` | Tenant | Update a pending rental request |
| **POST** | `/api/reviews` | Tenant | Write a rating/comment for a completed rental |

###  Payments
| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/payments/create` | Tenant | Generate a Stripe checkout URL for an approved request |
| **POST** | `/api/payments/confirm` | Public (Stripe Signature) | Webhook to verify Stripe payment confirmation and update booking status |
| **GET** | `/api/payments` | Tenant/Landlord/Admin | View payment history list |
| **GET** | `/api/payments/:paymentId` | Tenant/Landlord/Admin | View individual transaction payment details |

###  Landlord Management
| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/landlord/properties` | Landlord | Create a new property listing |
| **PATCH** | `/api/landlord/properties/:propertyId` | Landlord | Update property fields |
| **DELETE** | `/api/landlord/properties/:propertyId` | Landlord | Remove property listing |
| **PATCH** | `/api/landlord/properties/:propertyId/availability` | Landlord | Toggle property availability state |
| **GET** | `/api/landlord/requests` | Landlord | Retrieve all rental requests for owned properties |
| **PATCH** | `/api/landlord/requests/:rentalRequestId` | Landlord | Approve/Reject a tenant's rental request |
| **PATCH** | `/api/landlord/requests/:rentalRequestId/complete` | Landlord | Complete an active rental (Checkout) |

###  Admin Controls
| Method | Endpoint | Auth | Description |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/admin/users` | Admin | List all registered users |
| **PATCH** | `/api/admin/users/:userId` | Admin | Block or activate user accounts |
| **POST** | `/api/categories` | Admin | Create a property category |
| **PATCH** | `/api/categories/:categoryId` | Admin | Update category details |
| **DELETE** | `/api/categories/:categoryId` | Admin | Delete a category |
| **GET** | `/api/admin/properties` | Admin | View a list of all properties in the system |
| **GET** | `/api/admin/rentals` | Admin | View all system rental requests |
