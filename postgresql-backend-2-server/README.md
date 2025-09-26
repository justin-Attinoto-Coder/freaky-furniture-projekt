# Furniture Store API Backend (PostgreSQL + Sequelize)

This backend provides a RESTful API for products, categories, and authentication, following Swedish trade school VG requirements. Built with Node.js, Express, PostgreSQL, Sequelize, JWT, and Swagger.

## Features
- Products: CRUD, pagination, slug queries
- Categories: CRUD, slug queries, add/remove products
- Authentication: JWT login, admin-only operations
- Swagger API documentation

## Getting Started
1. Install dependencies: `npm install`
2. Set up PostgreSQL and configure `.env` (see `.env.example`)
3. Run migrations: `npm run migrate`
4. Start server: `npm start`

## API Documentation
See Swagger UI at `/api/docs` for full endpoint details.

## Development Stack
- Node.js
- Express
- PostgreSQL
- Sequelize
- JWT
- Swagger
