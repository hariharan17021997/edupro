## **EduPro - Unused Files & Cleanup Report**

### **Files to Remove/Consolidate**

#### ❌ **Completely Unused**

1. **`src/pages/Login.jsx`**

   - ✅ Consolidated into `AuthPage.jsx` with toggle functionality
   - Safe to delete

2. **`src/pages/SignUp.jsx`**

   - ✅ Consolidated into `AuthPage.jsx` with toggle functionality
   - Safe to delete

3. **`src/App.css`**
   - ✅ All styles migrated to `theme/theme.js`
   - Safe to delete

#### ⚠️ **Unused but May Be Useful**

1. **`src/App.test.js`** - Test file (not configured for CI/CD)

   - Consider for future unit testing setup
   - Safe to delete for now

2. **`src/setupTests.js`** - Test configuration

   - Only used if testing is configured
   - Safe to delete for now

3. **`src/reportWebVitals.js`** - Web Vitals tracking

   - Not imported/used in app
   - Safe to delete

4. **`src/api/apiUtils.js`** - Incomplete utility
   - Only has stub `apiGet` function
   - Consider removing or completing
   - Safe to delete

---

### **✨ App Name Enhancement - COMPLETED**

#### **New File Created:**

**`src/constants/appConfig.js`**

```javascript
export const APP_CONFIG = {
  name: "EduPro",
  tagline: "Empowering minds through innovative learning",
  version: "1.0.0",
  description: "Professional e-learning platform for modern education",
  links: {
    /* route configuration */
  },
};
```

#### **Updated Files:**

1. **`src/pages/AuthPage.jsx`**

   - ✅ Imports `APP_CONFIG`
   - ✅ Displays app name in login/signup header
   - ✅ App name now configurable from single location

2. **`src/components/Navbar.jsx`**
   - ✅ Imports `APP_CONFIG`
   - ✅ Uses `{APP_CONFIG.name}` instead of hardcoded "EduPro"
   - ✅ Navbar title now dynamic

---

### **Benefits of This Change**

✅ **Centralized Configuration** - Change app name in one place
✅ **Easier Rebranding** - Update `appConfig.js` for white-label versions
✅ **Scalable** - Can add more config (version, routes, etc.)
✅ **Type-Safe** - Easy to export constants for TypeScript later

---

### **Recommended Cleanup Actions**

```bash
# Remove unused files (optional):
rm src/pages/Login.jsx
rm src/pages/SignUp.jsx
rm src/App.css
rm src/App.test.js
rm src/setupTests.js
rm src/reportWebVitals.js
rm src/api/apiUtils.js
```

---

### **Current Active Files Summary**

| Component  | File                                             | Status                   |
| ---------- | ------------------------------------------------ | ------------------------ |
| Auth       | `AuthPage.jsx`                                   | ✅ Active (consolidated) |
| Navigation | `Navbar.jsx`                                     | ✅ Active                |
| Pages      | Home, About, Notifications, CourseContent        | ✅ All Active            |
| Forms      | DynamicFormField                                 | ✅ Active                |
| Components | CommonButton, CommonInput, CommonDataTable, etc. | ✅ All Active            |
| API        | auth.js, axiosClient.js, endpoints.js            | ✅ All Active            |
| Theme      | theme.js                                         | ✅ Active (centralized)  |
| Config     | `appConfig.js` (NEW)                             | ✅ New                   |
