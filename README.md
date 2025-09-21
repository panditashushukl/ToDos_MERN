# Todos MERN Application - Dual Mode

A comprehensive Todo application built with MERN stack that supports both **Guest Mode** (local storage) and **Authenticated Mode** (server-based) functionality.

## Features

### 🎯 Dual Mode Architecture
- **Guest Mode**: Full functionality using localStorage
- **Authenticated Mode**: Full server integration with cloud sync

### 📝 Todo Management
- Create, read, update, delete todos
- Mark todos as completed/pending
- Archive/unarchive todos
- Add labels and due dates
- Bulk operations
- Filter by status (all, pending, completed, archived)
- Statistics dashboard

### 🔐 Authentication
- User registration with avatar upload
- Secure login/logout
- JWT token-based authentication
- Password validation
- Profile management

### 🎨 User Interface
- Modern, responsive design
- Dark theme
- Real-time updates
- Loading states
- Error handling
- Mobile-friendly

## Technology Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose
- **JWT** for authentication
- **Cloudinary** for image uploads
- **bcrypt** for password hashing
- **Multer** for file handling

### Frontend
- **React 19** with hooks
- **Tailwind CSS** for styling
- **Context API** for state management
- **Local Storage** for guest mode
- **Fetch API** for server communication

## Project Structure

```
TodosMERN/
├── back-end/
│   ├── src/
│   │   ├── controllers/     # API controllers
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── middlewares/    # Authentication & file upload
│   │   ├── utils/          # Utility functions
│   │   └── app.js          # Express app configuration
│   └── package.json
├── front-end/
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── Auth/       # Authentication components
│   │   │   ├── TodoComponents/ # Todo-related components
│   │   │   └── Cards/      # UI card components
│   │   ├── contexts/       # React contexts
│   │   ├── services/       # API services
│   │   └── App.jsx         # Main app component
│   └── package.json
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- Cloudinary account (for image uploads)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd back-end
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with the following variables:
```env
MONGODB_URI=mongodb://localhost:27017/todosmern
JWT_SECRET=your_jwt_secret
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_EXPIRY=7d
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CORS_ORIGIN=http://localhost:5173
```

4. Start the development server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd front-end
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

## Usage

### Guest Mode
- Access the application without creating an account
- All todos are stored locally in your browser
- Full CRUD operations available
- Data persists between sessions on the same device
- No cloud sync or cross-device access

### Authenticated Mode
- Register a new account or login with existing credentials
- All todos are synced with the server
- Access your todos from any device
- Advanced features like bulk operations
- Profile management with avatar upload

## API Endpoints

### Authentication
- `POST /api/v1/users/register` - User registration
- `POST /api/v1/users/login` - User login
- `POST /api/v1/users/logout` - User logout
- `POST /api/v1/users/refresh-token` - Refresh access token
- `GET /api/v1/users/current-user` - Get current user
- `PATCH /api/v1/users/update-account` - Update profile
- `PATCH /api/v1/users/avatar` - Update avatar

### Todos (Authenticated)
- `GET /api/v1/todos/user/todos` - Get user todos
- `POST /api/v1/todos` - Create todo
- `GET /api/v1/todos/:todoId` - Get specific todo
- `PATCH /api/v1/todos/:todoId` - Update todo
- `DELETE /api/v1/todos/:todoId` - Delete todo
- `PATCH /api/v1/todos/:todoId/toggle-completion` - Toggle completion
- `PATCH /api/v1/todos/:todoId/toggle-archive` - Toggle archive
- `GET /api/v1/todos/stats` - Get todo statistics
- `GET /api/v1/todos/user/labels` - Get user labels
- `PATCH /api/v1/todos/bulk` - Bulk operations

### Guest
- `GET /api/v1/guest/info` - Get guest mode information

## Key Features

### Dual Mode Context
The application uses a sophisticated context system that automatically switches between guest and authenticated modes:

- **AuthContext**: Manages user authentication state
- **TodoContext**: Handles todo operations for both modes
- **API Service**: Manages server communication

### Data Persistence
- **Guest Mode**: localStorage with automatic sync
- **Authenticated Mode**: MongoDB with real-time updates

### Security
- JWT-based authentication
- Password hashing with bcrypt
- Secure cookie handling
- Input validation and sanitization

## Development

### Adding New Features
1. Backend: Add routes, controllers, and models
2. Frontend: Update contexts and components
3. Ensure both guest and authenticated modes work

### Testing
- Test both guest and authenticated modes
- Verify data persistence
- Check error handling
- Test responsive design

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Author

**Ashutosh Shukla**
- GitHub: [@panditashushukl](https://github.com/panditashushukl)
- Twitter: [@panditashushukl](https://twitter.com/panditashushukl)
- LinkedIn: [panditashushukl](https://linkedin.com/in/panditashushukl)
- Portfolio: [panditashushukl.github.io](https://panditashushukl.github.io/portfolio/)
