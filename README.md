# Restaurant Management System

A full-stack restaurant management system with features for both customers and administrators.

## Features

### Customer Features
- Browse menu items
- Place orders
- View order history
- Leave reviews and testimonials
- Contact restaurant
- User authentication

### Admin Features
- Menu management
- Order management
- Sales analytics
- Customer feedback management
- User management

## Tech Stack

### Frontend
- Next.js
- React
- Material-UI
- Axios for API calls

### Backend
- Node.js
- Express.js
- Prisma ORM
- PostgreSQL/MongoDB
- JWT Authentication

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- PostgreSQL or MongoDB
- Git

## Local Development Setup

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd restaurant-management-system
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   # Create .env file with required variables
   cp .env.example .env
   # Update .env with your configuration
   npm run prisma:generate
   npm run prisma:migrate
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   # Create .env file with required variables
   cp .env.example .env
   # Update .env with your configuration
   npm run dev
   ```

## Environment Variables

### Backend (.env)
```
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:3000
PORT=5000
```

### Frontend (.env)
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - User login
- GET `/api/auth/me` - Get current user

### Menu
- GET `/api/menu` - Get all menu items
- GET `/api/menu/:id` - Get specific menu item
- POST `/api/admin/menu` - Add new menu item (admin)
- PUT `/api/admin/menu/:id` - Update menu item (admin)
- DELETE `/api/admin/menu/:id` - Delete menu item (admin)

### Orders
- POST `/api/orders` - Create new order
- GET `/api/orders` - Get user orders
- GET `/api/admin/orders` - Get all orders (admin)
- PUT `/api/admin/orders/:id` - Update order status (admin)

### Reviews
- POST `/api/reviews` - Add review
- GET `/api/reviews` - Get all reviews
- DELETE `/api/admin/reviews/:id` - Delete review (admin)

## Usage Guide

### Customer Flow
1. Register/Login to your account
2. Browse the menu
3. Add items to cart
4. Place order
5. Track order status
6. Leave reviews

### Admin Flow
1. Login to admin dashboard
2. Manage menu items
3. Process orders
4. View analytics
5. Manage reviews
6. Handle customer inquiries

## Development

### Running Tests
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

### Code Style
- ESLint for code linting
- Prettier for code formatting

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed deployment instructions.

## Support

For support, please:
1. Check the documentation
2. Search existing issues
3. Create a new issue if needed

## License

This project is licensed under the MIT License - see the LICENSE file for details. 