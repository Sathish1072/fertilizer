# 🌱 Fertilizer Shop - Online Fertilizer Purchasing Application

A modern, responsive, and colorful web application built with **Create React App** and **Material-UI** for purchasing fertilizers online. The application is PWA-ready and can be installed as a mobile app.

## ✨ Features

### 🔐 Authentication
- User-friendly login and signup screens
- Form validation with helpful error messages
- Secure session management

### 🛍️ Product Catalog
- Browse quality fertilizers with images and descriptions
- Category-based filtering (Nitrogen, Phosphate, Potassium, Organic, etc.)
- Search functionality
- Product ratings and stock information
- Responsive product cards with hover effects

### 🛒 Cart Management
- Add/remove products from cart
- Update quantities
- Real-time price calculation
- Cart persistence using localStorage
- Empty cart handling

### 💳 Checkout Process
- Multi-step checkout with stepper
- Shipping address form with validation
- Multiple payment options (UPI, Card, COD)
- Order summary and review

### 📦 Order Tracking
- Beautiful order confirmation screen
- Delivery status timeline with stepper
- Real-time order status updates
- Estimated delivery date

### 🎨 UI/UX Design
- Agricultural theme with green, brown, and earth tones
- Mobile-first responsive design
- Smooth transitions and hover effects
- Material-UI components (AppBar, Cards, Stepper, Drawer)
- Beautiful gradients and shadows
- Custom scrollbar styling

## 🚀 Tech Stack

- **React** (Create React App)
- **Material-UI (MUI)** - Component Library
- **React Router DOM** - Navigation
- **Context API** - State Management
- **PWA** - Progressive Web App capabilities
- **Service Workers** - Offline support

## 📱 PWA Features

- Installable on mobile devices
- Offline capability
- App-like experience
- Custom theme colors
- Optimized icons

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Install Dependencies
```bash
npm install
```

### Run Development Server
```bash
npm start
```
The app will open at [http://localhost:3000](http://localhost:3000)

### Build for Production
```bash
npm run build
```

### Test Production Build
```bash
npm install -g serve
serve -s build
```

## 📁 Project Structure

```
fertilizer-app/
├── public/
│   ├── index.html
│   ├── manifest.json (PWA configuration)
│   └── icons/
├── src/
│   ├── components/
│   │   └── Layout.js (Navigation & Footer)
│   ├── pages/
│   │   ├── Home.js
│   │   ├── Login.js
│   │   ├── Signup.js
│   │   ├── Products.js
│   │   ├── Cart.js
│   │   ├── Checkout.js
│   │   ├── OrderTracking.js
│   │   ├── Orders.js
│   │   └── Profile.js
│   ├── context/
│   │   ├── AuthContext.js (Authentication state)
│   │   └── CartContext.js (Cart state)
│   ├── data/
│   │   └── products.js (Product catalog)
│   ├── theme.js (MUI theme configuration)
│   ├── App.js (Routes & Providers)
│   └── index.js (Entry point)
```

## 🎯 Key Features Implementation

### Theme Configuration
- Custom MUI theme with agricultural colors
- Primary: Forest Green (#2e7d32)
- Secondary: Brown (#795548)
- Background: Light Green (#f1f8e9)
- Custom button and card styles with hover effects

### State Management
- **AuthContext**: Manages user authentication state
- **CartContext**: Manages shopping cart with localStorage persistence

### Routing
- Protected routes for authenticated users
- Redirects to login for unauthorized access
- Dynamic routing for order tracking

### Form Validation
- Real-time field validation
- User-friendly error messages
- Pattern matching for email, phone, pincode

### Responsive Design
- Mobile-first approach
- Breakpoint-based layouts
- Adaptive navigation (drawer for mobile, inline for desktop)

## 🎨 Color Palette

| Color | Hex Code | Usage |
|-------|----------|-------|
| Forest Green | #2e7d32 | Primary color, buttons, headers |
| Light Green | #60ad5e | Primary light variant |
| Dark Green | #005005 | Primary dark variant |
| Brown | #795548 | Secondary color, accents |
| Light Background | #f1f8e9 | Page background |
| White | #ffffff | Cards, paper surfaces |

## 📱 Mobile Installation

1. Open the app in Chrome on Android or Safari on iOS
2. Tap the menu icon (three dots)
3. Select "Add to Home Screen" or "Install App"
4. The app will be installed like a native app

## 🔧 Configuration

### Service Worker
Service worker is enabled by default for PWA features. To disable:
```javascript
// In src/index.js
serviceWorkerRegistration.unregister();
```

### Manifest
PWA configuration in `public/manifest.json`:
- App name: "FertilizerShop"
- Theme color: #2e7d32 (green)
- Background color: #f1f8e9 (light green)
- Display: standalone

## 🧪 Demo Credentials

You can use any email and password (min 6 characters) to test the app.
The authentication is simulated for demo purposes.

Example:
- Email: farmer@example.com
- Password: 123456

## 📝 Future Enhancements

- Real backend API integration
- Payment gateway integration
- Push notifications
- Advanced filtering options
- Wishlist functionality
- Product reviews and ratings
- Multi-language support
- Dark mode toggle

## 🤝 Contributing

This is a demonstration project. Feel free to fork and customize for your needs.

## 📄 License

This project is open source and available for educational purposes.

## 🙏 Credits

- Images from Unsplash
- Icons from Material-UI Icons
- Built with Create React App and Material-UI

---

**Happy Farming! 🌾**
