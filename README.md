# Comuneo Todo - Recursive Task Manager

A recursive to-do list application built with **Remix.run**, **TypeScript**, and **Appwrite** as part of the Comuneo candidate assessment.

## ✨ Features

- **User Authentication**: Sign up and login with email/password via Appwrite
- **Recursive Tasks**: Create nested sub-tasks at unlimited depth
- **Full CRUD**: Add, complete, and delete tasks
- **Real-time Updates**: State management with React hooks
- **Responsive Design**: Works on desktop and mobile
- **Form Validation**: Client-side validation for signup/login forms
- **UI Tests**: Component tests using Vitest and Testing Library

## 🛠️ Tech Stack

- **Framework**: [Remix.run](https://remix.run/) with TypeScript
- **Backend as a Service**: [Appwrite](https://appwrite.io/) (Auth & Database)
- **Styling**: Custom CSS with CSS Variables
- **Testing**: Vitest + React Testing Library

## 📋 Prerequisites

- Node.js >= 20.0.0
- npm or yarn
- An Appwrite account (free at [cloud.appwrite.io](https://cloud.appwrite.io))

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd comuneo-todo
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Appwrite

1. Go to [cloud.appwrite.io](https://cloud.appwrite.io) and create a new project
2. Enable **Email/Password** authentication in Auth settings
3. Create a new **Database**
4. Create a **Collection** called `todos` with these attributes:

| Attribute | Type   | Required | Default |
|-----------|--------|----------|---------|
| userId    | string | Yes      | -       |
| title     | string | Yes      | -       |
| completed | boolean| Yes      | false   |
| parentId  | string | No       | null    |

5. Set up collection permissions:
   - Go to Collection Settings → Permissions
   - Add role: `Users`
   - Enable: Create, Read, Update, Delete

### 4. Configure environment variables

```bash
cp .env.example .env
```

Edit `.env` with your Appwrite credentials:

```env
VITE_APPWRITE_ENDPOINT=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your_project_id
VITE_APPWRITE_DATABASE_ID=your_database_id
VITE_APPWRITE_TODOS_COLLECTION_ID=your_collection_id
```

### 5. Run the development server

```bash
npm run dev
```

Visit [http://localhost:5173](http://localhost:5173)

## 📝 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Run production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript type checking |
| `npm run test` | Run tests |

## 🧪 Testing

Run the test suite:

```bash
npm run test
```

Tests cover:
- TodoList component rendering
- Adding, toggling, and deleting tasks
- Recursive task display
- Form validation
- Keyboard interactions

## 📁 Project Structure

```
comuneo-todo/
├── app/
│   ├── components/       # React components
│   │   ├── TodoItem.tsx  # Recursive todo item
│   │   ├── TodoList.tsx  # Main todo list
│   │   └── TodoList.test.tsx
│   ├── lib/
│   │   └── appwrite.ts   # Appwrite client config
│   ├── routes/
│   │   ├── _index.tsx    # Landing page
│   │   ├── signup.tsx    # Signup page
│   │   ├── login.tsx     # Login page
│   │   └── todos.tsx     # Main app page
│   ├── styles/
│   │   └── global.css    # Global styles
│   ├── types/
│   │   └── index.ts      # TypeScript types
│   └── root.tsx          # Root layout
├── test/
│   └── setup.ts          # Test setup
├── .env.example
├── package.json
├── tsconfig.json
├── vite.config.ts
└── vitest.config.ts
```

---

## 🔧 DevOps: CI/CD Pipeline Plan

### Overview

A robust CI/CD pipeline ensures code quality, prevents regressions, and automates deployments. Below is my proposed pipeline for this project.

### Pipeline Stages

```
┌─────────────┐   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐
│   Install   │ → │    Lint     │ → │    Test     │ → │    Build    │ → │   Deploy    │
│ Dependencies│   │  & Format   │   │ & Typecheck │   │             │   │             │
└─────────────┘   └─────────────┘   └─────────────┘   └─────────────┘   └─────────────┘
```

### Detailed Steps

1. **Install Dependencies**
   - Run `npm ci` for reproducible installs
   - Cache `node_modules` for faster subsequent runs

2. **Lint & Format**
   - Run `npm run lint` (ESLint)
   - Optionally run Prettier for formatting checks
   - Fail fast if linting errors exist

3. **Type Check**
   - Run `npm run typecheck` (TypeScript)
   - Catch type errors before runtime

4. **Test**
   - Run `npm run test` (Vitest)
   - Generate coverage reports
   - Fail if tests don't pass or coverage drops

5. **Build**
   - Run `npm run build`
   - Verify the build succeeds
   - Store build artifacts

6. **Deploy**
   - **Preview**: Deploy to preview URL on pull requests
   - **Production**: Deploy to production on merge to `main`

### Recommended Tools

| Purpose | Tool | Why |
|---------|------|-----|
| CI/CD Platform | **GitHub Actions** | Native GitHub integration, free for public repos, easy YAML config |
| Hosting | **Vercel** | First-class Remix support, automatic preview deployments, edge functions |
| Alternative Hosting | Railway, Fly.io, Cloudflare Pages | Good alternatives with different trade-offs |

### Example GitHub Actions Workflow

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: '20'

jobs:
  lint-and-test:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Run type check
        run: npm run typecheck

      - name: Run tests
        run: npm run test -- --coverage

      - name: Upload coverage
        uses: codecov/codecov-action@v4
        if: always()

  build:
    needs: lint-and-test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build application
        run: npm run build
        env:
          VITE_APPWRITE_ENDPOINT: ${{ secrets.VITE_APPWRITE_ENDPOINT }}
          VITE_APPWRITE_PROJECT_ID: ${{ secrets.VITE_APPWRITE_PROJECT_ID }}
          VITE_APPWRITE_DATABASE_ID: ${{ secrets.VITE_APPWRITE_DATABASE_ID }}
          VITE_APPWRITE_TODOS_COLLECTION_ID: ${{ secrets.VITE_APPWRITE_TODOS_COLLECTION_ID }}

      - name: Upload build artifacts
        uses: actions/upload-artifact@v4
        with:
          name: build
          path: build/

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### Branch Protection Rules

For production readiness, I'd recommend:

- Require PR reviews before merging
- Require status checks to pass (lint, test, build)
- Require branches to be up to date
- Disable force pushes to `main`

### Secrets Management

Store these secrets in GitHub repository settings:

- `VERCEL_TOKEN` - Vercel deployment token
- `VERCEL_ORG_ID` - Vercel organization ID
- `VERCEL_PROJECT_ID` - Vercel project ID
- `VITE_APPWRITE_*` - Appwrite credentials

---

## 🚀 Deployment to Vercel

### Quick Deploy

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repository
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables in Vercel

Add these in Project Settings → Environment Variables:

- `VITE_APPWRITE_ENDPOINT`
- `VITE_APPWRITE_PROJECT_ID`
- `VITE_APPWRITE_DATABASE_ID`
- `VITE_APPWRITE_TODOS_COLLECTION_ID`

---

## 📧 Bonus: Appwrite Function for Welcome Email

To send a welcome email on signup, create an Appwrite Function:

1. Go to Appwrite Console → Functions → Create Function
2. Use Node.js runtime
3. Set trigger: `users.*.create`
4. Function code:

```javascript
const sdk = require('node-appwrite');

module.exports = async function (req, res) {
  const client = new sdk.Client();
  const users = new sdk.Users(client);

  client
    .setEndpoint(process.env.APPWRITE_ENDPOINT)
    .setProject(process.env.APPWRITE_PROJECT_ID)
    .setKey(process.env.APPWRITE_API_KEY);

  const { userId, email } = JSON.parse(req.payload);

  // Use your preferred email service (SendGrid, Mailgun, etc.)
  // This is a placeholder for the email sending logic
  console.log(`Welcome email would be sent to: ${email}`);

  return res.json({
    success: true,
    message: `Welcome email sent to ${email}`,
  });
};
```

---

## 📄 License

MIT

---

## 👤 Author

Rohit - Full Stack Developer

Built for Comuneo candidate assessment.
