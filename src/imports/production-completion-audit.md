Perform a FINAL PRODUCTION COMPLETION AUDIT and extend the existing mobile application design into a fully complete, real-world production-ready food subscription and delivery platform.

STRICT NON-NEGOTIABLE RULES:

• DO NOT redesign or visually modify ANY existing screen.
• DO NOT change layout, colors, typography, spacing, icons, or components.
• DO NOT remove existing navigation or restructure UI.
• ONLY add missing screens, flows, navigation logic, and UX/system states.
• Reuse existing components and design tokens.
• All new screens must visually match the current design perfectly.

---

CORE ONBOARDING FLOW (KEEP + EXTEND)

Splash → Session Check → Login / Signup

Signup → Create Account → Role Selection

ROLE LOGIC:

Customer:
Login → Customer Home

Chef:
FSSAI Upload → Application Submitted →
Approval Pending →
Dashboard unlocked only after Admin Approval

Admin:
Restricted manual access.

---

GLOBAL SYSTEM SCREENS

Add if missing:

• Session Checking Screen
• Global Loading & Skeleton Screens
• No Internet Screen
• Server Error Screen
• Maintenance Mode Screen
• Force Update Screen
• Location Permission Screen
• Notification Permission Screen
• Permission Denied States
• Token Expired / Session Expired Screen
• Background Sync State
• App Resume Sync Loader
• Success / Error Dialogs
• Toast Notifications

---

AUTHENTICATION COMPLETION

• Signup validation states
• Forgot Password
• OTP Verification
• Reset Password
• Change Password
• Delete Account Flow
• Logout Confirmation (Customer, Chef, Admin)
• Account Blocked Screen

---

CUSTOMER PANEL — COMPLETE ORDER ECOSYSTEM

CART SYSTEM (MANDATORY FIX)

• Add-to-Cart interaction logic
• Quantity Stepper after add
• Cart badge sync globally
• Dedicated Cart Screen
• Empty Cart Screen
• Add-to-Cart confirmation state

ORDER & CHECKOUT FLOW

Home → Dish → Add → Cart → Checkout → Payment → Success → Orders → Tracking

ADD MISSING SCREENS:

• Checkout / Order Review
• Delivery Instructions
• Apply Coupon
• Offers List
• Delivery Address Confirmation

PRE-ORDER SYSTEM (NEW)

• Schedule Delivery Screen
• Date Picker
• Time Slot Selector
• Recurring Subscription Selector (Daily/Weekly)
• Pre-Order Confirmation Screen

REORDER SYSTEM (NEW)

Orders → Past Order → Reorder Flow:

• Reorder Review Screen
• Editable Quantity Screen
• Reorder Confirmation Dialog
• Reorder Success Screen

PAYMENT SYSTEM (FULL COMPLETION)

Add:

• Select Payment Method Screen
• Payment Processing Screen
• Payment Verification Screen
• Payment Pending Screen
• Payment Failed Screen
• Retry Payment Screen
• Payment Timeout Screen
• COD Confirmation Screen
• Payment Receipt Screen
• Payment Success Screen

POST ORDER STATES

• No Orders Screen
• Order Cancellation Reason
• Refund Status
• Wallet / Refund Balance
• Write Review Screen
• Post Delivery Rating Popup

---

CHEF PANEL COMPLETION

• Incoming Order Alert
• Accept / Reject Order Dialog
• Order Detail View
• Cooking Status Update
• Order Ready Confirmation
• Pause Orders Toggle
• Restaurant Open/Close Toggle
• Edit Menu Item
• Delete Item Confirmation
• Earnings Dashboard
• Transactions History
• Withdrawal Request
• Performance Statistics
• Notification Center
• Menu Empty State

Chef Application Lifecycle:

• Application Submitted
• Approval Pending
• Approval Rejected

ADD:
Chef Logout Option with confirmation dialog.

---

ADMIN PANEL COMPLETION

• All Orders Monitoring
• Live Order Control
• Order Status Override
• Customer Management
• User Detail View
• Chef Approval / Rejection
• Refund Approval Screen
• Complaint & Support Panel
• Analytics Dashboard
• Coupon Management
• Banner Management
• Push Notification Sender
• Chef Suspension Control
• Payment Dispute Screen

ADD:
Admin Logout Option with confirmation dialog.

---

NAVIGATION & UX RULES

• Every screen must have correct forward/back navigation.
• Maintain existing bottom navigation.
• Deep linking:
Notification → Order Tracking.
• Android back-button exit confirmation.
• Empty states everywhere data may not exist.
• Maintain identical mobile responsiveness.
• Preserve animation behavior.

---

FINAL OUTPUT REQUIREMENT

Extend the existing design into a FULLY COMPLETE production-ready food subscription and delivery application ready for direct Firebase/backend API integration WITHOUT any visual redesign.
