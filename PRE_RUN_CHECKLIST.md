# 🚀 Pre-Run Project Checklist

## ✅ System Requirements

- ✅ Node.js 18+ installed
- ✅ npm/yarn package manager
- ✅ Angular CLI (`@angular/cli@18+`)
- ✅ Git installed and configured
- ✅ Available ports: 3001 (backend), 4200 (frontend)

## 📋 Project Structure Status

```
✅ Backend
   └─ /backend/src/
      ├─ local-api.js (Express server on port 3001)
      ├─ handlers/ (certifications, trainings, users, etc.)
      └─ package.json (dependencies installed)

✅ Frontend  
   └─ /frontend/src/app/
      ├─ components/ (LearningComponent, PortalThemeDemoComponent, ThemeSwitcherComponent)
      ├─ services/ (PortalThemeService, CertificationApiService, TrainingApiService)
      ├─ app.module.ts (all modules imported)
      ├─ app.routes.ts (routing configured)
      └─ environments/ (local + production configs)

✅ Documentation
   ├─ PORTAL_THEMES.md (comprehensive theme guide)
   ├─ PORTAL_THEMES_QUICK_START.md (quick integration)
   ├─ BRANCH_INFO.md (branch documentation)
   └─ README.md (project overview)
```

## 🔧 Installation Steps

### Step 1: Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### Step 2: Environment Configuration

Backend environment is configured in:
- `/backend/src/local-api.js` → Port 3001

Frontend environment is configured in:
- `/frontend/src/environments/environment.local.ts` → Connects to `http://localhost:3001/dev`

### Step 3: Verify Configuration Files

**Backend Configuration** ✅
```javascript
// /backend/src/local-api.js
const PORT = 3001;
const BASE_PATH = '/dev';
```

**Frontend Configuration** ✅
```typescript
// /frontend/src/environments/environment.local.ts
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:3001/dev',
  rocApiUrl: 'http://localhost:3001/dev'
};
```

## 🎯 Running the Project

### Option 1: Run Both Servers (Recommended)

**Terminal 1 - Start Backend:**
```bash
cd backend
node src/local-api.js
```

Expected output:
```
✅ Server listening on port 3001
```

**Terminal 2 - Start Frontend:**
```bash
cd frontend
npm start
# or
ng serve --configuration local
```

Expected output:
```
✅ Application bundle generated successfully
⠙ Compiling...
Local: http://localhost:4200/
```

### Option 2: Run with npm scripts

**Backend:**
```bash
npm run dev:backend
```

**Frontend:**
```bash
npm run dev:frontend
```

## 🧪 Quick Verification

After servers start, verify they're running:

```bash
# Check backend
curl http://localhost:3001/dev/certifications

# Check frontend
open http://localhost:4200
```

## 🎨 Portal Theme System Features

Available immediately after frontend loads:

- 🎨 **7 Color Schemes**: Light, Dark, Ocean, Forest, Sunset, Cyberpunk, Minimal
- 🔄 **Theme Switcher**: Dropdown in header for easy theme switching
- 📊 **Portal Component**: Interactive demo with portal attachment/detachment
- 🎯 **Color Palette Display**: View all theme colors in real-time

**To access:** Navigate to the portal theme demo in the app (or use the theme switcher component)

## 📚 Key Components Ready

### Frontend Components
- ✅ `LearningComponent` - Certifications & Training management
- ✅ `PortalThemeDemoComponent` - Theme showcase with portal
- ✅ `ThemeSwitcherComponent` - Easy theme selection
- ✅ `AppComponent` - Main app shell with routing

### Backend Endpoints
- ✅ `GET /dev/certifications?userId=X` - List certifications
- ✅ `POST /dev/certifications` - Create certification
- ✅ `DELETE /dev/certifications/:uuid` - Delete certification
- ✅ `GET /dev/trainings?userId=X` - List trainings
- ✅ `POST /dev/trainings` - Create training
- ✅ `DELETE /dev/trainings/:uuid` - Delete training

## 🔍 Troubleshooting Pre-Run Issues

### Issue: Port 3001 already in use
```bash
# Find process using port 3001
lsof -i :3001

# Kill process if needed
kill -9 <PID>
```

### Issue: Port 4200 already in use
```bash
# Frontend will automatically use alternate port
# Or specify a different port:
ng serve --port 4201
```

### Issue: npm modules not installed
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: TypeScript compilation errors
```bash
# Ensure you're using the correct Angular version
ng version

# Should show Angular 18+ with @angular/cli 18+
```

## 📊 File Status Summary

| Category | Count | Status |
|----------|-------|--------|
| Services | 5+ | ✅ Created |
| Components | 8+ | ✅ Created |
| Environment Files | 2 | ✅ Configured |
| API Handlers | 6+ | ✅ Ready |
| Documentation | 3 | ✅ Complete |
| Git Commits | 45+ | ✅ Staged |

## 🎯 Next Steps After Running

1. **Login to Application**
   - Use authentication from `auth.service.ts`
   - Navigate to home page

2. **Test Certifications Feature**
   - Go to Learning → Certifications tab
   - Add new certification
   - View and delete certifications

3. **Test Portal Theme System**
   - Switch between 7 color schemes
   - View color palette for each theme
   - Interact with portal demo component

4. **Explore Other Features**
   - Daily Status reporting
   - Projects management
   - Team summary
   - Admin tools

## 💾 Database Status

**Current Setup:**
- Mock DynamoDB mode (no actual DB required for local development)
- Data persists in memory during session
- Reset on server restart

**For Production:**
- Configure AWS DynamoDB credentials
- Update endpoint in `/backend/src/handlers/`

## 🚀 Performance Tips

- **Frontend:** Uses differential loading (smaller bundles for modern browsers)
- **Backend:** Express.js with minimal middleware for fast response
- **Portal:** CSS variables update instantly without re-renders
- **Themes:** Zero runtime overhead (pure CSS)

## 📝 Important Notes

- ⚠️ **API Base URL**: Make sure `environment.local.ts` points to correct backend
- ⚠️ **CORS**: Backend has CORS enabled for localhost:4200
- ⚠️ **File Watching**: Both servers auto-reload on file changes
- ⚠️ **Memory**: Backend runs in-memory DB; restart to reset data

## 🎓 Quick Reference Commands

```bash
# Backend
cd backend && node src/local-api.js

# Frontend
cd frontend && npm start

# Check status
curl http://localhost:3001/dev/certifications
open http://localhost:4200

# View logs
npm run logs:backend
npm run logs:frontend

# Stop servers
# Ctrl+C in terminal windows
```

## ✨ Everything Ready!

Your project is fully configured and ready to run. All components, services, and documentation are in place.

**Happy coding! 🎉**

---

**Last Updated**: March 22, 2026
**Project**: S26_SE4920_TeamC
**Version**: 2.0.0 (with Portal Theme System)
