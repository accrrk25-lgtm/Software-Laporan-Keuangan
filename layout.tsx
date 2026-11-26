import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Finance & Accounting Management System",
  description: "Sistem laporan keuangan dan analisis manajemen"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="id"><body>{children}</body></html>;
}
