# Certification and Training Branch

## Branch: `certification-and-training`

This branch contains the complete implementation of a **Certification and Training Management System** for the employee learning management platform.

---

## 📋 Overview

This branch adds comprehensive features for tracking employee certifications and training activities, with full frontend and backend integration.

### Key Features:
- ✅ **Certifications Management** - Track, add, update, and delete employee certifications
- ✅ **Training Tracking** - Manage training courses with status tracking
- ✅ **RESTful API** - Express.js backend with DynamoDB integration
- ✅ **Angular Frontend** - Material Design UI with responsive components
- ✅ **Portal Support** - Angular CDK portals for dynamic UI rendering
- ✅ **Local Development** - Fully configured for local development with mock data

---

## 🏗️ Architecture

### Frontend (`/frontend`)
- **Framework:** Angular 18+
- **UI Library:** Angular Material + Bulma
- **Component:** `LearningComponent` - Main certifications/trainings page
- **Services:**
  - `CertificationApiService` - Certifications API client
  - `TrainingApiService` - Training API client
  - `PortalService` - Dynamic portal rendering

### Backend (`/backend`)
- **Framework:** Node.js + Express.js
- **Database:** DynamoDB (local development)
- **Handlers:**
  - `certifications.js` - CRUD operations for certifications
  - `trainings.js` - CRUD operations for trainings
  - `local-api.js` - Local development API server

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- npm/yarn
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/ucmo-cs/S26_SE4920_TeamC.git
cd S26_SE4920_TeamC

# Checkout this branch
git checkout certification-and-training

# Install dependencies
cd frontend && npm ci && cd ..
cd backend && npm ci && cd ..
```

### Running Locally

**Terminal 1 - Start Backend (port 3001):**
```bash
cd backend
node src/local-api.js
```

**Terminal 2 - Start Frontend (port 4200):**
```bash
cd frontend
npm run start:local
```

**Open in Browser:**
```
http://localhost:4200
```

---

## 📁 Project Structure

```
S26_SE4920_TeamC/
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   │   ├── learning/
│   │   │   │   │   ├── learning.component.ts
│   │   │   │   │   ├── learning.component.html
│   │   │   │   │   └── learning.component.scss
│   │   │   │   ├── portal-outlet/
│   │   │   │   │   └── portal-outlet.component.ts
│   │   │   │   └── ...other components
│   │   │   ├── services/
│   │   │   │   ├── certification-api.service.ts
│   │   │   │   ├── training-api.service.ts
│   │   │   │   ├── portal.service.ts
│   │   │   │   └── ...other services
│   │   │   ├── models/
│   │   │   │   ├── cert-training.model.ts
│   │   │   │   └── ...other models
│   │   │   ├── app.module.ts
│   │   │   ├── app.routes.ts
│   │   │   └── app.component.ts
│   │   ├── environments/
│   │   │   ├── environment.ts
│   │   │   └── environment.local.ts
│   │   └── main.ts
│   ├── package.json
│   ├── angular.json
│   └── tsconfig.json
├── backend/
│   ├── src/
│   │   ├── handlers/
│   │   │   ├── certifications.js
│   │   │   ├── trainings.js
│   │   │   ├── user.js
│   │   │   └── ...other handlers
│   │   ├── local-api.js
│   │   └── ...other backend files
│   └── package.json
├── BRANCH_INFO.md (this file)
├── PORTAL_SUPPORT.md
└── README.md
```

---

## 🔌 API Endpoints

### Certifications
```
GET    /dev/certifications?userId=<userId>    # List certifications
POST   /dev/certifications                      # Create certification
PUT    /dev/certifications/:uuid               # Update certification
DELETE /dev/certifications/:uuid               # Delete certification
```

### Trainings
```
GET    /dev/trainings?userId=<userId>         # List trainings
POST   /dev/trainings                          # Create training
PUT    /dev/trainings/:uuid                   # Update training
DELETE /dev/trainings/:uuid                   # Delete training
```

---

## 📦 Data Models

### Certification
```typescript
{
  uuid: string;
  userId: string;
  name: string;
  issuer: string;
  obtainedDate: string;
  expiryDate: string;
  status: 'ACTIVE' | 'EXPIRED' | 'IN_PROGRESS';
  proofUrl: string;
  createdAt: string;
  updatedAt: string;
}
```

### Training
```typescript
{
  uuid: string;
  userId: string;
  title: string;
  provider: string;
  dueDate: string;
  completedDate: string;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE';
  notes: string;
  createdAt: string;
  updatedAt: string;
}
```

---

## 🎨 UI Components

### Learning Component
Main page displaying:
- List of employee certifications
- List of active trainings
- Add/Edit forms for certifications
- Add/Edit forms for trainings
- Status filtering
- Delete functionality

### Portal Outlet Component
Demo component showing:
- Template portal rendering
- Dynamic content attachment
- Portal lifecycle management

---

## 🔧 Configuration

### Environment Files

**`environment.local.ts` (Development)**
```typescript
{
  apiBaseUrl: 'http://localhost:3001/dev',
  rocApiUrl: 'http://localhost:3001/dev',
  // ... other config
}
```

**`environment.ts` (Production)**
```typescript
{
  apiBaseUrl: 'https://temp.execute-api.us-east-1.amazonaws.com',
  rocApiUrl: 'https://temp.execute-api.us-east-1.amazonaws.com',
  // ... other config
}
```

---

## 📝 Git Commits

Key commits on this branch:
- **Initial setup** - Project structure and dependencies
- **Backend handlers** - Certification and training API handlers
- **Frontend components** - Learning component and services
- **Portal support** - Angular CDK portal implementation
- **Local API** - Express.js local development server
- **Environment config** - Local development environment setup

---

## 🤝 Contributing

When working on this branch:

1. **Create feature branches** from `certification-and-training`
2. **Follow naming:** `feature/xyz` or `fix/xyz`
3. **Commit messages:** Use conventional commits (`feat:`, `fix:`, `docs:`)
4. **Test locally** before pushing
5. **Keep branch updated** with latest changes

### Local Development Workflow
```bash
# Create feature branch
git checkout -b feature/my-feature

# Make changes and test
npm run start:local  # frontend
node src/local-api.js  # backend

# Commit changes
git add .
git commit -m "feat: add my feature"

# Push to origin
git push origin feature/my-feature

# Create pull request to certification-and-training
```

---

## 🧪 Testing

### Manual Testing Checklist
- [ ] Login page loads
- [ ] Can navigate to Learning page
- [ ] Can add a certification
- [ ] Can add a training
- [ ] Can view list of certifications
- [ ] Can view list of trainings
- [ ] Can delete items
- [ ] Can update status
- [ ] Portal demo works
- [ ] Backend API responds (curl tests)

### Backend API Tests
```bash
# Test GET certifications
curl 'http://localhost:3001/dev/certifications?userId=test-user-1'

# Test POST certification
curl -X POST http://localhost:3001/dev/certifications \
  -H 'Content-Type: application/json' \
  -d '{
    "userId": "test-user-1",
    "name": "AWS Certified",
    "issuer": "Amazon",
    "status": "ACTIVE"
  }'

# Test DELETE
curl -X DELETE http://localhost:3001/dev/certifications/{uuid}
```

---

## 📚 Documentation

- [`PORTAL_SUPPORT.md`](./PORTAL_SUPPORT.md) - Portal implementation guide
- [`frontend/README.md`](./frontend/README.md) - Frontend setup guide
- [`backend/README.md`](./backend/README.md) - Backend setup guide

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3001
lsof -i :3001 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Kill process on port 4200
lsof -i :4200 | grep LISTEN | awk '{print $2}' | xargs kill -9
```

### Dependencies Not Installed
```bash
cd frontend && npm ci && cd ..
cd backend && npm ci && cd ..
```

### Frontend Not Building
```bash
cd frontend
rm -rf node_modules package-lock.json
npm ci
npm run start:local
```

### Backend API Not Responding
```bash
cd backend
rm -rf node_modules package-lock.json
npm ci
node src/local-api.js
```

---

## 📞 Support

For issues or questions about this branch:
1. Check existing GitHub issues
2. Review commit history for context
3. Check [`PORTAL_SUPPORT.md`](./PORTAL_SUPPORT.md) for feature documentation
4. Contact team members

---

## ✅ Checklist Before Merging

- [ ] All tests pass
- [ ] No merge conflicts
- [ ] Code follows project standards
- [ ] Documentation is updated
- [ ] Commit messages are clear
- [ ] Branch is up to date with `main`
- [ ] Both backend and frontend build successfully
- [ ] Local development setup verified

---

**Last Updated:** March 18, 2026  
**Branch:** `certification-and-training`  
**Status:** ✅ Ready for Development
