# Zentrol Property - Complete Workflow Guide

This document details the project structure, user roles and personas, data flow, and module-specific workflows for the **Zentrol Property** management system.

---

## 🛠️ Tech Stack

This project is built using modern frontend technologies:
- **Core Library**: React (v19)
- **Language**: TypeScript
- **Bundler & Build Tool**: Vite (v8)
- **Routing**: `@tanstack/react-router`
- **State Management**: Zustand
- **Query & Data Fetching**: `@tanstack/react-query`
- **Styling**: TailwindCSS & PostCSS
- **Icons**: Lucide React
- **Linter & Tools**: Oxlint

---

## 📁 Folder Structure

The primary directories and key files of the project are organized as follows:

- **[`src/routes/index.tsx`](file:///Users/Software/Kiaan/Zentrol-property/src/routes/index.tsx)**: The single entrypoint for all route definitions and page layouts.
- **[`src/features/`](file:///Users/Software/Kiaan/Zentrol-property/src/features)**: Modules organized by business domain features:
  - `auth/`: Login, Forgot Password, and Reset Password views.
  - `landing/`: The main marketing website homepage.
  - `dashboard/`: Custom dashboards for managers and Super Admins.
  - `properties/` & `units/`: Management of real estate properties, buildings, and units.
  - `tenants/` & `leasing/`: Management of tenants, leases, renewals, move-in/out procedures, and rental applications.
  - `crm/`: Customer Relationship Management (Leads & Contacts management).
  - `rent/`: Rent collection, invoices, payments, deposits, payment plans, and refunds.
  - `accounting/`: Chart of accounts, general ledger, journal entries, expenses, bills, bank reconciliation, and taxes.
  - `maintenance/`: Maintenance requests, work orders, preventive maintenance, assets, inventory, and vendor details.
  - `documents/`: Document hub, electronic signatures, templates, and permissions.
  - `reports/`: Interactive charts, executive dashboards, forecasting, and custom report builders.
  - `communication/`: Shared inbox, email, SMS, announcements, and marketing campaigns.
  - `ai/`: Smart AI assistant and settings.
  - `owner/` & `tenant/`: Dedicated self-service portals for property owners and tenants.
  - `admin/`: System-wide preferences, team roles, integrations, webhooks, and audit logs.
- **[`src/components/`](file:///Users/Software/Kiaan/Zentrol-property/src/components)**: Reusable global components like `DataTable`, `KanbanBoard`, `Timeline`, `FileUploader`, and custom UI components.
- **[`src/store/useStore.ts`](file:///Users/Software/Kiaan/Zentrol-property/src/store/useStore.ts)**: Global state management powered by Zustand (Theme, Authentication, and Notifications).

---

## 👥 User Roles & Personas

Authentication is handled dynamically in `useAuthStore` based on the user's login email format:

1. **Super Admin** (Email must contain `admin`):
   - Has full, unrestricted system access.
   - Manages global settings, integrations, audit/activity logs, and system billing.
2. **Property Manager / Staff** (Standard email format):
   - Manages day-to-day operations: rentals, collections, leases, and maintenance.
3. **Property Owner** (Email must contain `owner`):
   - Accesses a dedicated portal to view property performance, distribution payments, and financial statements.
4. **Tenant** (Email must contain `tenant`):
   - Accesses a tenant portal to pay rent online, submit maintenance tickets, view lease documents, and register visitors.

---

## 🔄 Core Business Workflows

### 1. Lead-to-Tenant Workflow
1. **Lead Generation**: A prospect submits an inquiry, which is registered under the CRM module (`src/features/crm`).
2. **Rental Application**: The lead is invited to submit a digital application (`src/features/leasing/ApplicationsPage`).
3. **Lease Creation**: Upon screening and approval, a formal lease agreement is generated (`src/features/leasing/NewLeasePage`).
4. **Move-In**: Security deposits and signed lease agreements are completed, and a move-in checklist is triggered.
5. **Tenant Portal Activation**: The tenant is given access to their tenant portal.

### 2. Rent Collection & Payment Flow
1. **Invoice Generation**: Invoices are automatically generated on a recurring basis as dictated by active lease agreement terms.
2. **Online Payment**: Tenants receive notifications and pay directly through their portal via card or bank transfer.
3. **Ledger & Accounting Update**: Once a payment succeeds, the property Rent Ledger is updated, and matching transactions are posted to the General Ledger.

### 3. Maintenance Ticket Workflow
1. **Request Submission**: A tenant submits a maintenance request (e.g., HVAC failure) from their portal.
2. **Work Order Creation**: The Property Manager reviews the ticket and converts it into a Work Order, assigning it to a vendor.
3. **Execution & Billing**: The vendor executes the repair, marks the job as complete, and submits an invoice.
4. **Expense Registration**: The manager approves the work, pays the vendor bill, and registers the transaction as a maintenance expense.

---

## 📊 Analytics & Reporting
- **Executive Dashboard**: Offers summaries of occupancy rates, cash flow, and outstanding tasks.
- **Forecasting**: Predicts future rental income and seasonal maintenance expenses based on history.
- **Custom Report Builder**: Admins can customize, schedule, and export financial and operational reports.

---

## 🚀 Local Development Setup

1. **Install Dependencies**:
   ```bash
   npm install
   ```
2. **Run Development Server**:
   ```bash
   npm run dev
   ```
3. **Log in with Mock Roles (Email Inputs)**:
   - **Super Admin**: `admin@zentrol.com`
   - **Owner**: `owner@zentrol.com`
   - **Tenant**: `tenant@zentrol.com`
   - **Property Manager**: `manager@zentrol.com` (or any general email)
