# WEB TOZ PROJE 1

Modern, production-ready web application built with React and Node.js.

## 🚀 Features

- **Frontend**: React 18 with TypeScript
- **Backend**: Node.js with Express
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT-based authentication
- **Security**: CORS, Helmet, Rate limiting
- **Development**: Hot reload, ESLint, Prettier
- **Production**: Docker, CI/CD, Environment configs
- **Testing**: Jest, React Testing Library
- **Documentation**: Comprehensive API docs

## 📋 Prerequisites

- Node.js 18+ 
- npm 9+
- MongoDB (or Docker)
- Git

## 🛠️ Installation

### Development Setup

1. Clone the repository:
```bash
git clone https://github.com/tozsolutions/WEB_TOZ_PROJE_1.git
cd WEB_TOZ_PROJE_1
```

2. Install all dependencies:
```bash
npm run install:all
```

3. Create environment files:
```bash
cp .env.example .env
cp server/.env.example server/.env
cp client/.env.example client/.env
```

4. Start development servers:
```bash
npm run dev
```

### Production Setup with Docker

1. Build and run with Docker:
```bash
npm run docker:prod
```

## 🔧 Available Scripts

### Root Level Commands
- `npm run dev` - Start both client and server in development mode
- `npm run build` - Build both client and server for production
- `npm run test` - Run all tests
- `npm run lint` - Lint all code
- `npm run install:all` - Install all dependencies

### Docker Commands
- `npm run docker:build` - Build Docker containers
- `npm run docker:up` - Start containers in development
- `npm run docker:down` - Stop containers
- `npm run docker:prod` - Start in production mode

## 📁 Project Structure

```
WEB_TOZ_PROJE_1/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── utils/
│   │   └── types/
│   ├── package.json
│   └── tsconfig.json
├── server/                 # Node.js backend
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── services/
│   │   └── utils/
│   ├── package.json
│   └── tsconfig.json
├── docs/                   # Documentation
├── docker-compose.yml      # Development containers
├── docker-compose.prod.yml # Production containers
├── .github/workflows/      # CI/CD pipelines
└── README.md
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users` - Get all users (admin)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## 🔒 Environment Variables

### Server (.env)
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/web_toz_db
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:3000
```

### Client (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_APP_NAME=WEB TOZ PROJE 1
```

## 🧪 Testing

Run tests for both client and server:
```bash
npm run test
```

Run tests individually:
```bash
npm run client:test
npm run server:test
```

## 🚀 Deployment

### Using Docker (Recommended)

1. Build production images:
```bash
docker-compose -f docker-compose.prod.yml build
```

2. Deploy:
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Manual Deployment

1. Build the application:
```bash
npm run build
```

2. Set production environment variables
3. Start the server:
```bash
npm start
```

## 📊 Monitoring

- Health check endpoint: `GET /health`
- Metrics endpoint: `GET /metrics`
- Logs are available in `logs/` directory

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

**TOZ Solutions** - *Initial work*

## 🐛 Bug Reports

Please use the [GitHub Issues](https://github.com/tozsolutions/WEB_TOZ_PROJE_1/issues) page to report bugs.

## 📞 Support

For support, email support@tozsolutions.com or create an issue in this repository.