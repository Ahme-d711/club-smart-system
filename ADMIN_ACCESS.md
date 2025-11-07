# How to Access and View Orders

## Architecture Overview

The system uses **one React application** with different routes for different user types:

- **Customer App** - For customers to browse menus and place orders
- **Admin Dashboard** - For staff to manage all orders

Both are part of the same React frontend (`client/`), but serve different purposes.

## How to View Orders

### For Customers (View Their Own Orders)

1. **Start the application:**
   ```bash
   npm run dev
   ```

2. **Open browser:**
   ```
   http://localhost:3000
   ```

3. **Navigate to "My Orders" or click "Orders" in the navigation bar**

4. **URL:** `http://localhost:3000/orders`

   - Shows only the customer's own orders
   - Real-time order status updates
   - View order details and tracking

### For Staff/Admin (View ALL Orders)

1. **Start the application:**
   ```bash
   npm run dev
   ```

2. **Open browser:**
   ```
   http://localhost:3000
   ```

3. **Navigate to "Admin" in the navigation bar**

4. **URL:** `http://localhost:3000/admin`

   - Shows ALL orders from ALL customers
   - Update order status
   - Delete orders
   - Filter orders by status
   - View statistics

## Admin Dashboard Features

The Admin page (`/admin`) provides:

✅ **View All Orders**
   - All orders from all customers
   - Sorted by most recent first

✅ **Order Management**
   - Update order status (pending → confirmed → preparing → ready → delivered)
   - Delete orders
   - Filter by status (All, Pending, Confirmed, Preparing, Ready, Delivered, Cancelled)

✅ **Statistics Dashboard**
   - Total orders count
   - Active orders count
   - Ready for pickup count

✅ **Real-Time Updates**
   - New orders appear instantly
   - Status changes update in real-time
   - Order deletions synchronized

## File Structure

```
client/
└── src/
    ├── pages/
    │   ├── Admin.js          ← Admin dashboard (views ALL orders)
    │   ├── Orders.js          ← Customer orders page (views THEIR orders)
    │   ├── Menus.js
    │   ├── Home.js
    │   └── Padel.js
    └── App.js                 ← Routes defined here
```

## Routes in the Application

| Route | Purpose | Who Uses It |
|-------|---------|-------------|
| `/` | Home page | Everyone |
| `/menus` | Browse menus | Customers |
| `/orders` | View customer's own orders | Customers |
| `/admin` | View and manage ALL orders | Staff/Admin |
| `/padel` | Book padel courts | Customers |

## Quick Access

**Customer Orders Page:**
```
http://localhost:3000/orders
```

**Admin Dashboard:**
```
http://localhost:3000/admin
```

## Why Both Are in Client Section?

The admin page is in the `client/` folder because:

1. **Single Page Application (SPA)** - One React app serves both customer and admin interfaces
2. **Shared Components** - Both use the same navigation, styling, and utilities
3. **Easier Deployment** - One build and deployment process
4. **Code Reusability** - Shared code for API calls, translations, etc.

This is a common pattern in modern web applications. The separation is by **route** (URL), not by separate applications.

## Security Note

Currently, the admin page is accessible to anyone. For production, you should add:
- Authentication/Authorization
- Admin login system
- Role-based access control

This can be added later as a future enhancement.

