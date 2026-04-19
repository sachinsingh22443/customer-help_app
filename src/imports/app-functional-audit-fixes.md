Perform a COMPLETE FUNCTIONAL AUDIT and FIX all missing logic, missing screens, broken navigation, and non-working buttons in the existing mobile food delivery application design.

STRICT RULES (MANDATORY):

* DO NOT redesign or visually modify any existing screen.
* DO NOT change colors, typography, spacing, layout, icons, or components.
* DO NOT remove any existing navigation.
* ONLY fix broken interactions and add missing required screens.
* Reuse existing design system and components.
* Ensure all buttons are visible and never hidden behind bottom navigation bars.
* Maintain consistent mobile-safe spacing and bottom padding.

---

## CRITICAL BUG FIXES (MUST FIX FIRST)

1. Ensure ALL “Add” buttons across every dish card function correctly:

   * On tap → Add item to Cart.
   * If item already added → Increase quantity.
   * Show quantity selector state.
   * Update cart badge count dynamically.

2. Fix bottom navigation overlap issue:

   * Ensure no button or CTA is hidden behind navbar.
   * Add safe bottom padding to scrollable screens.

3. Add missing Order button logic:

   * Cart → Checkout → Payment → Order Confirmation.

4. Ensure every screen has:

   * Proper back navigation.
   * No overflow.
   * Scroll enabled if content exceeds height.

---

## MISSING CUSTOMER FLOW SCREENS (ADD IF NOT PRESENT)

5. Dedicated Cart Screen (Full Screen)

   * Item list
   * Quantity control
   * Remove item option
   * Order Summary
   * Proceed to Checkout button

6. Empty Cart Screen

7. Order Review / Checkout Screen

8. Payment Processing Screen

9. Payment Success Screen

10. Payment Failed Screen

11. Order Confirmation Screen

12. Order Tracking Screen

13. No Orders Screen

14. Search Empty State

---

## ROLE FLOW CORRECTIONS

Signup → Create Account → Role Selection

IF Customer selected:

* Redirect to Login screen.
* After login → Customer Home.

IF Chef selected:

* Redirect to FSSAI Certificate Upload Screen.
* After upload → Show Chef Register Request Submitted Screen.
* Then show Approval Pending Screen.
* Chef Dashboard locked until Admin Approval.
* After approval → Chef Dashboard accessible.

Add missing screens:

15. FSSAI Certificate Upload Screen
16. Chef Registration Submitted Screen
17. Approval Pending Screen
18. Approval Rejected Screen

---

## CHEF PANEL FIXES

19. Add Logout option in Chef Profile.
20. Add Edit Menu Item screen.
21. Add Delete Confirmation dialog.
22. Add Order Details screen.
23. Add Earnings Summary screen.
24. Add Withdrawal Request screen.

---

## ADMIN PANEL FIXES

25. Add Logout option in Admin panel.
26. Add Chef Approval Screen.
27. Add User Management Screen.
28. Add Order Monitoring Screen.
29. Add Analytics Dashboard.

---

## AUTHENTICATION FIXES

30. Forgot Password Screen.
31. OTP Verification Screen.
32. Reset Password Screen.
33. Session Expired Screen.
34. Account Blocked Screen.
35. Logout Confirmation Dialog (All roles).

---

## BUTTON & VISIBILITY FIXES

36. Ensure all CTA buttons:

* Are fully visible.
* Have safe bottom spacing.
* Are not hidden behind navigation bars.
* Remain responsive on small devices.

37. Ensure all primary buttons have loading states.

---

## NAVIGATION FLOW (MUST WORK CORRECTLY)

Customer:
Home → Dish Detail → Add to Cart → Cart → Checkout → Payment → Success → Orders → Tracking

Chef:
Login → Pending (if not approved)
Approved → Dashboard → Orders → Earnings → Profile → Logout

Admin:
Login → Dashboard → Chef Approval → Orders → Users → Logout

---

## OUTPUT REQUIREMENT

Generate all missing screens, fix all broken button actions, implement complete cart flow, fix navigation structure, correct role-based onboarding logic, add logout options for Chef and Admin, and ensure all CTAs are fully visible and functional.

The application must become fully production-ready and backend integration-ready without altering any existing visual design.
