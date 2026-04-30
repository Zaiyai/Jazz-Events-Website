# 🎷 Jazz Events Website - QA Test Checklist

**Tester Name:** ________________  
**Test Date:** ________________  
**Browser/Version:** ________________  
**Environment:** [ ] Development [ ] Staging [ ] Production

---

## 1. Home Page Testing

- [ ] Page loads correctly without errors
- [ ] Hero carousel displays and transitions smoothly between images
- [ ] Navigation menu is accessible and all links work
- [ ] Header and footer display correctly on all sections
- [ ] All images load properly and display without distortion
- [ ] Page styling is consistent with design specifications
- [ ] Call-to-action buttons are visible and clickable

## 2. Navigation Testing

- [ ] Home link navigates to home page
- [ ] Booking link navigates to booking page
- [ ] Quote request link navigates to quote page
- [ ] Policies/Terms links navigate to correct pages
- [ ] Login/Register buttons navigate correctly
- [ ] Navigation is responsive on mobile devices

## 3. Authentication Testing (Login/Register)

- [ ] Register page loads and displays form correctly
- [ ] Form validation: Empty field submission shows error message
- [ ] Form validation: Invalid email format shows error
- [ ] Password requirements are clearly displayed and enforced
- [ ] Successfully register new user account
- [ ] Login page loads correctly
- [ ] Login with correct credentials succeeds
- [ ] Login with incorrect credentials shows error message
- [ ] Session persists correctly after login
- [ ] Logout functionality works and clears session

## 4. Booking Functionality Testing

- [ ] Booking page loads with all form fields displayed
- [ ] All required fields are marked clearly
- [ ] Form validation prevents empty submissions
- [ ] Date picker displays and allows selection of valid dates
- [ ] Past dates cannot be selected for event booking
- [ ] Valid booking submission succeeds
- [ ] Confirmation message displays after successful booking
- [ ] Booking data is saved to database correctly
- [ ] User can view their booking history

## 5. Quote Request Testing

- [ ] Quote request page loads correctly
- [ ] Quote form displays all necessary fields
- [ ] Form validation prevents empty submissions
- [ ] Quote can be successfully submitted
- [ ] Confirmation message displays after submission

## 6. User Dashboard Testing

- [ ] Dashboard page is only accessible when logged in
- [ ] Dashboard displays user profile information correctly
- [ ] Dashboard shows user's booking history
- [ ] User can edit their profile information
- [ ] User can cancel or modify existing bookings
- [ ] Dashboard is responsive on mobile devices

## 7. Policies Pages Testing

- [ ] Privacy Policy page loads and displays correctly
- [ ] Terms of Service page loads and displays correctly
- [ ] Policy pages have readable formatting and structure
- [ ] Links in policies are functional

## 8. Search Functionality Testing

- [ ] Search feature is accessible and visible
- [ ] Search returns relevant results for valid queries
- [ ] Search shows "no results" for non-matching queries
- [ ] Search is case-insensitive

## 9. Cookie & Session Management Testing

- [ ] Cookie consent banner displays on first visit
- [ ] User preferences for cookies are saved and respected
- [ ] Session timeout works correctly
- [ ] Session persists across page refreshes

## 10. Responsive Design Testing

- [ ] Desktop view (1920x1080) displays correctly
- [ ] Tablet view (768px width) displays correctly
- [ ] Mobile view (375px width) displays correctly
- [ ] Images scale appropriately on different screen sizes
- [ ] Text is readable on all devices without horizontal scrolling
- [ ] Forms are usable on mobile devices

## 11. Cross-Browser Testing

- [ ] Chrome: All pages load and function correctly
- [ ] Firefox: All pages load and function correctly
- [ ] Safari: All pages load and function correctly
- [ ] Edge: All pages load and function correctly
- [ ] No console errors in any browser

## 12. Performance Testing

- [ ] Pages load within 3 seconds on average connection
- [ ] Images are optimized and not unnecessarily large
- [ ] No performance issues with carousel transitions
- [ ] Database queries execute in reasonable time

## 13. Security Testing

- [ ] Passwords are not visible in plain text during input
- [ ] User cannot access other users' data
- [ ] SQL injection attempts are prevented
- [ ] XSS attacks are prevented in form inputs
- [ ] CSRF tokens are implemented for form submissions
- [ ] Sensitive data is not logged or exposed in errors

## 14. Error Handling & Validation

- [ ] Error messages are clear and user-friendly
- [ ] 404 page displays for missing resources
- [ ] Database connection errors are handled gracefully
- [ ] Form input validation provides real-time feedback
- [ ] Server errors are logged without exposing system details

## 15. Accessibility Testing

- [ ] All images have alt text descriptions
- [ ] Form labels are properly associated with inputs
- [ ] Color contrast is sufficient for readability
- [ ] Keyboard navigation works throughout the site
- [ ] Screen reader compatibility (tested with at least one reader)

---

## 📝 Test Notes & Issues

### Bugs Found:
1. 
2. 
3. 

### General Observations:


---

## Summary

**Total Tests:** 86  
**Tests Passed:** _____ / 86  
**Tests Failed:** _____  
**Pass Rate:** _____%  

**Status:** [ ] All Pass [ ] Ready for Release [ ] Needs Fixes

**Sign Off:**

Tester: ______________________ Date: __________

QA Lead: ______________________ Date: __________
