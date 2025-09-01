# Contributing to WEB TOZ PROJE 1

Thank you for considering contributing to WEB TOZ PROJE 1! We welcome contributions from everyone.

## Getting Started

### Prerequisites
- Node.js 18+
- npm 9+
- MongoDB
- Git

### Development Setup
1. Fork the repository
2. Clone your fork:
```bash
git clone https://github.com/your-username/WEB_TOZ_PROJE_1.git
cd WEB_TOZ_PROJE_1
```

3. Install dependencies:
```bash
npm run install:all
```

4. Set up environment variables:
```bash
cp .env.example .env
cp server/.env.example server/.env
cp client/.env.example client/.env
```

5. Start development servers:
```bash
npm run dev
```

## Development Workflow

### Code Style
- We use ESLint and Prettier for code formatting
- Run `npm run lint` to check for linting errors
- Run `npm run format` to format code

### Testing
- Write tests for new features
- Run `npm run test` to run all tests
- Maintain test coverage above 80%

### Commit Guidelines
We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Test changes
- `chore:` Build process or auxiliary tool changes

Example:
```
feat: add user profile management
fix: resolve authentication token expiration
docs: update API documentation
```

### Pull Request Process
1. Create a feature branch from `develop`
2. Make your changes
3. Add tests for new functionality
4. Ensure all tests pass
5. Update documentation if needed
6. Submit a pull request to `develop` branch

## Project Structure

```
WEB_TOZ_PROJE_1/
├── client/           # React frontend
├── server/           # Node.js backend
├── docs/            # Documentation
├── .github/         # GitHub workflows
└── docker-compose.yml
```

## Available Scripts

### Root Level
- `npm run dev` - Start development servers
- `npm run build` - Build for production
- `npm run test` - Run all tests
- `npm run lint` - Lint all code

### Server Scripts
- `npm run server:dev` - Start server in development
- `npm run server:build` - Build server
- `npm run server:test` - Run server tests

### Client Scripts
- `npm run client:dev` - Start client in development
- `npm run client:build` - Build client
- `npm run client:test` - Run client tests

## Code Standards

### TypeScript
- Use TypeScript for all new code
- Define proper interfaces and types
- Avoid using `any` type when possible

### React Components
- Use functional components with hooks
- Follow the component naming convention
- Write prop types and documentation

### Backend Code
- Follow RESTful API principles
- Use proper error handling
- Implement input validation
- Write comprehensive tests

## Reporting Issues

When reporting issues, please include:
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Environment details

## Questions?

If you have questions, please:
1. Check existing issues and documentation
2. Create a new issue with the "question" label
3. Contact the maintainers

Thank you for contributing!