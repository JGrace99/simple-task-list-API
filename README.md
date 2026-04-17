# Simple Task List API

## Overview
A GraphQL API for managing a simple task list, supporting full CRUD operations with input validation and error handling.

## Tech Stack
- NodeJS
- TypeScript
- Yoga GQL
- Pothos GQL
- Prisma

## Setup
- npm installl
- cp .env.example .env --> DATABASE_URL = ""
- npx prisma generate
- npx prisma migrate deploy
- npm run dev

- Server runs at http://localhost:4000/graphql