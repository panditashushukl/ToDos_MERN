# Integration Test Guide

## Testing the Dual-Mode Todo Application

### Prerequisites
1. Backend server running on `http://localhost:8000`
2. Frontend server running on `http://localhost:5173`
3. MongoDB running and accessible
4. Cloudinary configured (for avatar uploads)

### Test Scenarios

#### 1. Guest Mode Testing
**Objective**: Verify guest mode functionality with localStorage

**Steps**:
1. Open the application in a new browser window
2. Verify "Guest Mode" indicator is visible
3. Create a new todo with:
   - Content: "Test Guest Todo"
   - Label: "Testing"
   - Due Date: Tomorrow
4. Verify todo appears in the list
5. Mark todo as completed
6. Archive the todo
7. Refresh the page
8. Verify all data persists

**Expected Results**:
- ✅ Guest mode indicator visible
- ✅ Todo created successfully
- ✅ Todo can be completed and archived
- ✅ Data persists after page refresh
- ✅ Statistics update correctly

#### 2. Authentication Testing
**Objective**: Verify user registration and login

**Steps**:
1. Click the login button in the header
2. Switch to registration form
3. Register with:
   - Full Name: "Test User"
   - Username: "testuser"
   - Password: "TestPass123!"
   - Optional: Upload avatar
4. Verify successful registration
5. Login with the same credentials
6. Verify user profile shows in header

**Expected Results**:
- ✅ Registration form works
- ✅ User can register successfully
- ✅ Login works with new credentials
- ✅ User profile appears in header
- ✅ Guest mode indicator disappears

#### 3. Authenticated Mode Testing
**Objective**: Verify server-based todo functionality

**Steps**:
1. While logged in, create a new todo
2. Verify todo is saved to server
3. Open application in another browser/device
4. Login with same credentials
5. Verify todo appears across devices
6. Test all CRUD operations
7. Test bulk operations
8. Test label management

**Expected Results**:
- ✅ Todos sync across devices
- ✅ All CRUD operations work
- ✅ Bulk operations function correctly
- ✅ Labels are managed properly
- ✅ Statistics are accurate

#### 4. Mode Switching Testing
**Objective**: Verify seamless switching between modes

**Steps**:
1. Start in guest mode, create some todos
2. Register and login
3. Verify guest todos don't interfere with server todos
4. Logout and verify return to guest mode
5. Login again and verify server todos are still there

**Expected Results**:
- ✅ Guest and server todos are separate
- ✅ Mode switching is seamless
- ✅ No data loss during transitions

#### 5. Error Handling Testing
**Objective**: Verify error handling and edge cases

**Steps**:
1. Test with invalid login credentials
2. Test with weak passwords
3. Test with network disconnected
4. Test with invalid todo data
5. Test with expired tokens

**Expected Results**:
- ✅ Appropriate error messages shown
- ✅ Application doesn't crash
- ✅ Graceful fallback to guest mode when needed

### Performance Testing

#### 1. Load Testing
- Create 100+ todos in guest mode
- Verify performance remains good
- Test with large datasets

#### 2. Network Testing
- Test with slow network connections
- Test offline functionality
- Test reconnection scenarios

### Browser Compatibility
Test in:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

### Security Testing
1. Verify JWT tokens are secure
2. Test password validation
3. Verify CORS settings
4. Test file upload security

## Test Results Template

```
Date: ___________
Tester: ___________
Browser: ___________

Guest Mode:
- [ ] Basic functionality
- [ ] Data persistence
- [ ] Statistics
- [ ] Performance

Authentication:
- [ ] Registration
- [ ] Login
- [ ] Logout
- [ ] Profile management

Authenticated Mode:
- [ ] Server sync
- [ ] Cross-device access
- [ ] CRUD operations
- [ ] Bulk operations

Mode Switching:
- [ ] Seamless transitions
- [ ] Data separation
- [ ] No data loss

Error Handling:
- [ ] Invalid credentials
- [ ] Network errors
- [ ] Validation errors
- [ ] Token expiration

Performance:
- [ ] Load testing
- [ ] Network testing
- [ ] Browser compatibility

Security:
- [ ] Token security
- [ ] Password validation
- [ ] CORS
- [ ] File uploads

Overall Status: [ ] PASS [ ] FAIL
Notes: ___________
```

## Automated Testing (Future Enhancement)

Consider implementing:
1. Unit tests for contexts and services
2. Integration tests for API endpoints
3. E2E tests with Playwright/Cypress
4. Performance monitoring
5. Error tracking with Sentry
