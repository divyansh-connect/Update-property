# Development Workflow & Implementation Plan

This document outlines the complete workflow for implementing the 11 new client requirements. It breaks down the features, assigns responsibilities safely to **Developer 1** and **Developer 2**, and establishes a clear Git collaboration strategy to ensure **zero merge conflicts**.

## Client Objective
To enhance the property management system with improved tenant notifications, expanded payment options (Cash/Advance/Partial), multilingual support (Spanish), seamless in-app communication (WhatsApp/SMS/Email), and role-based access for Collection Managers.

---

## Part 1: Comprehensive Feature Breakdown

Here are the 11 requirements extracted from the client's specifications, organized by technical domain:

### Domain A: Finance, Invoicing, and Ledgers (Assigned to Developer 1)
1. **Payment Process Preview (Trial Version)**
   - **Goal:** Provide a comprehensive visual preview of the tenant payment process (Card, ACH, Cash, Fee breakdown) so stakeholders can verify security and UX without making actual payments.
2. **Invoice Delivery Options**
   - **Goal:** Automate monthly invoice delivery via Email/SMS. Add manual dispatch options for invoices and receipts via Email, SMS, and **WhatsApp**.
3. **Professional Tenant Ledger**
   - **Goal:** Upgrade the rent ledger UI to a professional, printable statement format featuring the Company Name, Tenant Name/Phone, Property/Unit Address, and complete transaction history.
4. **Part Payment & Full Payment Option**
   - **Goal:** Add an explicit toggle/choice allowing tenants and managers to process partial payments alongside full balance payments.
5. **Cash Payment Receipt Option**
   - **Goal:** Implement an automated workflow where logging a cash payment instantly generates and dispatches a formal cash receipt to the tenant.

### Domain B: Communication, Maintenance, and Security (Assigned to Developer 2)
6. **Notification Redirect**
   - **Goal:** Ensure clicking any system notification (payment received, maintenance request) directly routes the user to the specific record in 1-click (no manual searching).
7. **Spanish Language Support**
   - **Goal:** Fully activate the Spanish language toggle for the Tenant Portal to cater to Spanish-speaking tenants.
8. **In-App Tenant Communication**
   - **Goal:** Build a direct messaging center allowing managers and tenants to discuss maintenance and general inquiries. Include quick-actions for Phone, Email, and WhatsApp.
9. **Role-Based User Access (Collection Manager)**
   - **Goal:** Create a strict RBAC profile for "Collection Manager". This role must only see Pending Collections, Balances, and Maintenance Requests. All other sidebar links and features must be hidden.
10. **Advance Payment for Maintenance Work**
    - **Goal:** Add tracking fields to work orders/vendors to log advance payments made to maintenance personnel for tracking expenses.
11. **Maintenance Violations Integration**
    - **Goal:** Build a dedicated dashboard within Maintenance to track state and city municipal violations (DOB/HPD), fine amounts, and compliance deadlines via API.

---

## Part 2: Safe Collaboration Strategy (Zero Conflicts)

Because both developers are working on the same React application, editing massive global files like `src/api/mockApi.ts` or `src/routes/index.tsx` concurrently **will** cause severe merge conflicts. 

To prevent this, we will use a **Modular File Creation Strategy**.

### 1. File Isolation Guidelines
Instead of modifying existing heavy files, developers must build features in isolation:
- **Developer 1 (Finance):** Create new components like `CashReceiptModal.tsx` and data files like `src/api/financeMockApi.ts`.
- **Developer 2 (Communication/Maintenance):** Create new components like `ViolationsDashboard.tsx` and `src/api/maintenanceMockApi.ts`.

### 2. Git Workflow (Step-by-Step)
Follow these strict steps when working on GitHub to ensure smooth integration:

1. **Always Sync Before Starting:**
   ```bash
   git checkout main
   git pull origin main
   ```
2. **Create a Dedicated Feature Branch:**
   ```bash
   # Developer 1
   git checkout -b feature/finance-ledger-updates
   
   # Developer 2
   git checkout -b feature/maintenance-communication
   ```
3. **Commit Your Work:**
   ```bash
   git add .
   git commit -m "feat: added new professional tenant ledger layout"
   ```
4. **Merge Safely:**
   - Push your feature branch to GitHub.
   - Create a Pull Request (PR) on GitHub.
   - Once approved, merge it into `main`. The other developer will then pull the updated `main` branch.
