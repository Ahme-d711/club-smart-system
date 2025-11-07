# Quick Start Guide

## Installation

1. **Install all dependencies:**
   ```bash
   npm run install-all
   ```

   Or manually:
   ```bash
   npm install
   cd client
   npm install
   cd ..
   ```

## Running the Application

### Development Mode

Run both frontend and backend:
```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:5000`
- Frontend React app on `http://localhost:3000`

### Individual Services

Run backend only:
```bash
npm run server
```

Run frontend only:
```bash
npm run client
```

## First Time Setup

1. The data directory will be created automatically when the server starts
2. Initial menu data is already included in `server/data/menus.json`
3. Orders and bookings will be stored in JSON files automatically

## Accessing the Application

- **Customer App**: Open `http://localhost:3000` in your browser
- **Admin Dashboard**: Navigate to `http://localhost:3000/admin`

## Features to Test

### Customer Features
1. Browse menus from different venues
2. Add items to cart
3. Place an order with location and table number
4. View order status in real-time
5. Book a padel court

### Admin Features
1. View all orders in the admin dashboard
2. Update order status (pending → confirmed → preparing → ready → delivered)
3. Delete orders
4. Filter orders by status

## Language Switching

Click the language buttons (EN/AR) in the navigation bar to switch between English and Arabic.

## Mobile Testing

The application is fully responsive. Test on mobile by:
1. Opening browser developer tools (F12)
2. Toggle device toolbar
3. Select a mobile device or set custom dimensions

## Troubleshooting

### Port Already in Use
If port 5000 or 3000 is already in use:
- Change `PORT` in `.env` file for backend
- Change port in `client/package.json` scripts for frontend

### Socket.io Connection Issues
- Ensure backend is running before frontend
- Check that CORS is properly configured
- Verify Socket.io URL in `client/src/utils/socket.js`

### Data Not Persisting
- Check that `server/data` directory exists
- Verify file permissions
- Check server logs for errors

## Next Steps

1. Customize menus in `server/data/menus.json`
2. Add more venues or items
3. Configure production environment variables
4. Set up database (optional, for production)

## Support

For issues or questions, refer to the main README.md file.

