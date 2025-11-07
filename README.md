# Club Smart System

A comprehensive web-based smart software system for club hospitality and recreation management. This system allows customers to order food and drinks from anywhere in the club, and enables staff to manage orders efficiently.

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   cd client && npm install && cd ..
   ```

2. **Start the application:**
   ```bash
   npm run dev
   ```

3. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📝 Note for Windows Users

If you encounter PowerShell execution policy issues, use the provided batch files:
- `INSTALL_DEPENDENCIES.bat` - Install all dependencies
- `START_BOTH.bat` - Start both servers
- `QUICK_START.bat` - Quick start with auto-install

## Features

### Customer App
- ✅ Browse menus from all cafés and restaurants
- ✅ Order food/drinks to current location or table number
- ✅ View current order status and estimated delivery time
- ✅ Real-time order tracking with WebSocket updates
- ✅ Receive notifications for order status changes
- ✅ Book padel courts
- ✅ Bilingual interface (Arabic/English) with RTL support
- ✅ Mobile-responsive design

### Admin / Staff Dashboard
- ✅ Manage incoming orders and assign them to kitchens/waiters
- ✅ Update order status in real time
- ✅ View order history and statistics
- ✅ Track popular items
- ✅ Manage menus, prices, and promotions (API ready)
- ✅ Real-time order updates via WebSocket

## Technology Stack

### Frontend
- **React 18** - UI framework
- **React Router** - Navigation
- **Socket.io Client** - Real-time updates
- **i18next** - Internationalization (Arabic/English)
- **Axios** - HTTP client
- **CSS3** - Styling with responsive design

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **Socket.io** - Real-time communication
- **JSON File Storage** - Data persistence (easily upgradeable to database)

## Project Structure

```
club-smart-system/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context (Cart)
│   │   ├── locales/        # Translation files
│   │   └── ...
│   └── package.json
├── server/                 # Node.js backend
│   ├── routes/             # API routes
│   ├── data/               # JSON data files
│   └── index.js            # Server entry point
└── package.json
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Setup Steps

1. **Install root dependencies:**
   ```bash
   npm install
   ```

2. **Install client dependencies:**
   ```bash
   cd client
   npm install
   cd ..
   ```

3. **Or install all at once:**
   ```bash
   npm run install-all
   ```

## Running the Application

### Development Mode

Run both frontend and backend concurrently:
```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:5000`
- Frontend React app on `http://localhost:3000`

### Production Build

1. Build the React app:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   NODE_ENV=production npm run server
   ```

## API Endpoints

### Orders
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get order by ID
- `POST /api/orders` - Create new order
- `PATCH /api/orders/:id/status` - Update order status
- `DELETE /api/orders/:id` - Delete order

### Menus
- `GET /api/menus` - Get all menus
- `GET /api/menus/:venueId` - Get menu by venue
- `PUT /api/menus/:venueId` - Update menu
- `POST /api/menus/:venueId/items` - Add item to menu
- `PUT /api/menus/:venueId/items/:itemId` - Update menu item
- `DELETE /api/menus/:venueId/items/:itemId` - Delete menu item

### Padel Bookings
- `GET /api/padel` - Get all bookings
- `GET /api/padel/availability/:date` - Get available time slots
- `POST /api/padel` - Create new booking
- `PATCH /api/padel/:id/status` - Update booking status

### Tables
- `GET /api/tables` - Get all tables
- `GET /api/tables/:number` - Get table by number

## Real-time Updates

The system uses Socket.io for real-time order updates:
- New orders are broadcast to all connected clients
- Order status changes are pushed in real-time
- Order deletions are synchronized across all clients

## Payment System

Currently, the system does not include online payment. Orders are paid in person using:
- Cash
- Club card
- Room charge

**Future Enhancement:** The system is designed to easily integrate payment gateways or QR-based billing systems.

## Language Support

The system supports:
- **English** (LTR)
- **Arabic** (RTL)

Language can be switched using the language selector in the navigation bar. The interface automatically adjusts text direction and layout.

## Mobile Responsiveness

The application is fully responsive and optimized for:
- Mobile phones
- Tablets
- Desktop computers

## Future Enhancements

Potential features for future expansion:
- Membership management
- Event booking system
- Loyalty points system
- Online payment integration
- QR code-based ordering
- Push notifications
- Advanced analytics dashboard
- Inventory management
- Staff scheduling

## Data Storage

Currently, data is stored in JSON files:
- `server/data/orders.json` - Order data
- `server/data/menus.json` - Menu data
- `server/data/tables.json` - Table information
- `server/data/padel.json` - Padel bookings

**Note:** For production use, consider migrating to a database (MongoDB, PostgreSQL, etc.).

## Development Notes

- The cart is persisted in localStorage
- Real-time updates require Socket.io connection
- Menu items support bilingual names and descriptions
- Order statuses: pending → confirmed → preparing → ready → delivered

## License

This project is proprietary software developed for club management.

## Support

For issues or questions, please contact the development team.

