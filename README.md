# FinanceOS — Financial Reporting & Management System

Starter project for a cloud-based, multi-user accounting and financial reporting web application.

## Included in this first delivery

- Next.js + React + TypeScript application shell.
- Responsive Indonesian-language finance dashboard.
- Sidebar navigation for the planned modules.
- Excel/CSV file reader with browser-side preview (first 100 rows shown).
- PostgreSQL initial schema for companies, users, roles, accounts, journals, imports, periods, and audit logs.
- Initial security posture: Row Level Security enabled; no permissive policies are provided.

## Important status

This is **Phase 1 starter code**, not a production accounting system yet.
Dashboard amounts and sample transactions are illustrative. The import preview does not save data.
Do not use this version to issue official financial statements or upload confidential company data.

## Requirements

- Node.js 20+
- npm
- Supabase project (for later backend integration)

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000.

## Database setup

1. Create a Supabase project.
2. Open SQL Editor.
3. Review and run `supabase/schema.sql`.
4. Before exposing any table, implement company-scoped Row Level Security policies.
5. Configure authentication and server-side authorization.

## Next implementation phases

1. Confirm Excel source templates and column mappings.
2. Build robust import staging, validation, duplicate detection, and posting workflow.
3. Add server-side authentication and company-scoped permissions.
4. Add journal entry workflow and audit trail.
5. Build trial balance, general ledger, balance sheet, income statement, cash flow, and equity reports.
6. Add ratio analysis and management commentary.
7. Add automated tests, reconciliation tests, backup, deployment, and monitoring.

## Accounting design decisions to confirm

- Chart of accounts and account classification.
- Whether source Excel is journal-level, general-ledger-level, trial-balance-level, or a combination.
- Fiscal year and period closing rules.
- Cash flow method (direct or indirect).
- Whether dimensions such as branch, department, project, and cost center are required.
- Approval workflow for journal posting and period locking.

## Security notes

- Never commit `.env.local`.
- Never expose the Supabase service-role key in browser code.
- Enforce company-level access on the server and with RLS.
- Validate debit-credit equality and account/period status on the server, not only in the UI.
- Keep imported source files and error reports under controlled access.
