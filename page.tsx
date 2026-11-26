"use client";

import { useMemo, useState } from "react";
import * as XLSX from "xlsx";
import {
  LayoutDashboard, FileSpreadsheet, BookOpen, Wallet, ChartNoAxesCombined,
  Users, Settings, Search, Bell, Upload, ArrowUpRight, ArrowDownRight,
  FileText, CircleAlert, CheckCircle2, Menu, X
} from "lucide-react";

type ImportRow = Record<string, unknown>;

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Data Import", icon: FileSpreadsheet },
  { label: "Master Data", icon: BookOpen },
  { label: "Transaksi", icon: Wallet },
  { label: "Buku Besar", icon: FileText },
  { label: "Laporan Keuangan", icon: FileSpreadsheet },
  { label: "Cash Management", icon: Wallet },
  { label: "Piutang & Utang", icon: Users },
  { label: "Financial Analysis", icon: ChartNoAxesCombined },
  { label: "Administration", icon: Settings }
];

const currency = (n: number) => new Intl.NumberFormat("id-ID", {
  style: "currency", currency: "IDR", maximumFractionDigits: 0
}).format(n);

export default function Home() {
  const [active, setActive] = useState("Dashboard");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [rows, setRows] = useState<ImportRow[]>([]);
  const [fileName, setFileName] = useState("");
  const [message, setMessage] = useState("");

  const parsed = useMemo(() => {
    if (!rows.length) return { valid: 0, errors: 0 };
    const valid = rows.filter((r) => {
      const keys = Object.keys(r).map(k => k.toLowerCase());
      return keys.length > 0;
    }).length;
    return { valid, errors: rows.length - valid };
  }, [rows]);

  async function handleFile(file?: File) {
    if (!file) return;
    setFileName(file.name);
    setMessage("");
    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array", cellDates: true });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json<ImportRow>(firstSheet, { defval: "" });
      setRows(data.slice(0, 100));
      setMessage(data.length
        ? `Berhasil membaca ${data.length} baris. Preview dibatasi 100 baris pertama.`
        : "File terbaca, tetapi tidak ditemukan baris data.");
      setActive("Data Import");
    } catch {
      setRows([]);
      setMessage("File tidak dapat dibaca. Pastikan format .xlsx, .xls, atau .csv.");
    }
  }

  const sidebar = (
    <aside className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`}>
      <div className="brand">
        <div className="brand-mark">FA</div>
        <div><strong>FINANCE<span>OS</span></strong><small>ACCOUNTING SYSTEM</small></div>
        <button className="mobile-close" onClick={() => setMobileOpen(false)} aria-label="Tutup menu"><X size={19}/></button>
      </div>
      <div className="workspace-label">WORKSPACE</div>
      <nav>
        {navItems.map(item => {
          const Icon = item.icon;
          return <button key={item.label} className={`nav-item ${active === item.label ? "active" : ""}`}
            onClick={() => { setActive(item.label); setMobileOpen(false); }}>
            <Icon size={18}/><span>{item.label}</span>
          </button>;
        })}
      </nav>
      <div className="sidebar-bottom">
        <div className="status-dot"/> <span>Prototype environment</span>
        <small>Version 0.1.0</small>
      </div>
    </aside>
  );

  return (
    <main className="shell">
      {sidebar}
      {mobileOpen && <button className="scrim" onClick={() => setMobileOpen(false)} aria-label="Tutup navigasi"/>}
      <section className="main-area">
        <header className="topbar">
          <button className="mobile-menu" onClick={() => setMobileOpen(true)} aria-label="Buka menu"><Menu/></button>
          <div className="breadcrumb">Workspace <span>/</span> <strong>{active}</strong></div>
          <div className="top-actions">
            <button className="icon-button" aria-label="Cari"><Search size={18}/></button>
            <button className="icon-button notification" aria-label="Notifikasi"><Bell size={18}/><i/></button>
            <div className="profile"><div className="avatar">AD</div><div><strong>Administrator</strong><small>Super Admin</small></div></div>
          </div>
        </header>

        <div className="content">
          {active === "Dashboard" ? (
            <>
              <div className="page-heading">
                <div><div className="eyebrow">FINANCIAL OVERVIEW</div><h1>Dashboard Keuangan</h1>
                  <p>Ringkasan performa dan posisi keuangan perusahaan.</p></div>
                <div className="period-select">Periode: <strong>November 2026</strong> <span>⌄</span></div>
              </div>
              <div className="notice"><CircleAlert size={17}/><span>Mode prototype: angka di bawah adalah data ilustrasi, bukan data keuangan aktual.</span></div>
              <div className="kpi-grid">
                <Kpi title="Kas & Setara Kas" value={currency(4250000000)} change="+8,4%" positive icon={<Wallet/>}/>
                <Kpi title="Total Aset" value={currency(12850000000)} change="+3,2%" positive icon={<FileText/>}/>
                <Kpi title="Pendapatan" value={currency(6850000000)} change="+12,6%" positive icon={<ArrowUpRight/>}/>
                <Kpi title="Laba Bersih" value={currency(925000000)} change="-2,1%" positive={false} icon={<ChartNoAxesCombined/>}/>
              </div>
              <div className="dashboard-grid">
                <section className="panel performance">
                  <div className="panel-head"><div><h2>Ringkasan Performa</h2><p>Perbandingan pendapatan dan beban</p></div><span className="pill">Ilustrasi</span></div>
                  <div className="chart">
                    <div className="y-labels"><span>8 M</span><span>6 M</span><span>4 M</span><span>2 M</span><span>0</span></div>
                    <div className="chart-area">
                      <div className="grid-lines"><i/><i/><i/><i/><i/></div>
                      <div className="bars">
                        {[["Sep",62,39],["Okt",73,46],["Nov",86,52],["Des",68,43],["Jan",79,48],["Feb",91,58]].map(([m,a,b]) =>
                          <div className="bar-group" key={String(m)}><div className="bar-pair"><i style={{height:`${a}%`}}/><i style={{height:`${b}%`}}/></div><small>{m}</small></div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="legend"><span><i className="blue"/> Pendapatan</span><span><i className="pale"/> Beban</span></div>
                </section>
                <section className="panel cash-panel">
                  <div className="panel-head"><div><h2>Komposisi Keuangan</h2><p>Posisi aset dan sumber pendanaan</p></div></div>
                  <div className="donut-wrap"><div className="donut"><div><strong>12,85 M</strong><small>Total Aset</small></div></div></div>
                  <div className="composition">
                    <div><i className="blue"/> <span>Aset</span><strong>Rp 12,85 M</strong></div>
                    <div><i className="purple"/> <span>Kewajiban</span><strong>Rp 5,10 M</strong></div>
                    <div><i className="pale"/> <span>Ekuitas</span><strong>Rp 7,75 M</strong></div>
                  </div>
                </section>
              </div>
              <section className="panel table-panel">
                <div className="panel-head"><div><h2>Aktivitas Terbaru</h2><p>Contoh transaksi pada sistem</p></div><button className="text-button" onClick={() => setActive("Transaksi")}>Lihat semua <ArrowUpRight size={15}/></button></div>
                <div className="table-scroll"><table><thead><tr><th>Tanggal</th><th>Deskripsi</th><th>Kategori</th><th>Status</th><th className="right">Nominal</th></tr></thead>
                  <tbody>
                    <tr><td>26/11/2026</td><td><strong>Penerimaan penjualan</strong><small>TRX-2026-11026</small></td><td>Operasional</td><td><span className="tag success">Posted</span></td><td className="right amount">+ Rp 185.000.000</td></tr>
                    <tr><td>25/11/2026</td><td><strong>Pembayaran supplier</strong><small>TRX-2026-11025</small></td><td>Pengeluaran</td><td><span className="tag success">Posted</span></td><td className="right amount negative">- Rp 72.500.000</td></tr>
                    <tr><td>25/11/2026</td><td><strong>Penerimaan piutang</strong><small>TRX-2026-11024</small></td><td>Penerimaan</td><td><span className="tag warning">Review</span></td><td className="right amount">+ Rp 96.000.000</td></tr>
                  </tbody></table></div>
              </section>
            </>
          ) : active === "Data Import" ? (
            <>
              <div className="page-heading"><div><div className="eyebrow">DATA MANAGEMENT</div><h1>Import Data Excel</h1><p>Unggah data keuangan dan periksa hasil pembacaan sebelum diproses.</p></div></div>
              <div className="notice"><CircleAlert size={17}/><span>Preview ini berjalan di browser. Data belum disimpan ke database atau memengaruhi laporan.</span></div>
              <section className="panel import-panel">
                <div className="upload-zone">
                  <div className="upload-icon"><Upload size={25}/></div><h2>Upload file keuangan</h2>
                  <p>Pilih file Excel atau CSV untuk melihat preview data.</p>
                  <label className="primary-button">Pilih File
                    <input type="file" accept=".xlsx,.xls,.csv" onChange={e => handleFile(e.target.files?.[0])}/>
                  </label>
                  <small>Format didukung: XLSX, XLS, CSV</small>
                </div>
                {message && <div className="import-message"><CheckCircle2 size={17}/>{message}</div>}
                {fileName && <div className="file-summary"><FileSpreadsheet size={19}/><div><strong>{fileName}</strong><small>{rows.length} baris preview</small></div><span className="tag success">Terbaca</span></div>}
                {rows.length > 0 && <><div className="validation-strip"><div><strong>{parsed.valid}</strong><small>Baris terbaca</small></div><div><strong>{parsed.errors}</strong><small>Baris bermasalah</small></div><div><strong>{Object.keys(rows[0]).length}</strong><small>Kolom terdeteksi</small></div></div>
                  <div className="table-scroll"><table><thead><tr>{Object.keys(rows[0]).map(k => <th key={k}>{k}</th>)}</tr></thead><tbody>{rows.slice(0,10).map((r,i)=><tr key={i}>{Object.keys(rows[0]).map(k=><td key={k}>{String(r[k] ?? "")}</td>)}</tr>)}</tbody></table></div>
                  <p className="helper-text">Tahap berikutnya: pemetaan kolom, validasi akun dan debit-kredit, deteksi duplikasi, lalu penyimpanan ke database.</p>
                </>}
              </section>
            </>
          ) : (
            <div className="page-heading"><div><div className="eyebrow">MODULE PREVIEW</div><h1>{active}</h1><p>Modul ini masuk dalam roadmap pengembangan berikutnya.</p></div></div>
          )}
          <footer>© 2026 FinanceOS · Financial Reporting & Management System <span>Prototype v0.1.0</span></footer>
        </div>
      </section>
    </main>
  );
}

function Kpi({title,value,change,positive,icon}:{title:string;value:string;change:string;positive:boolean;icon:React.ReactNode}) {
  return <section className="kpi-card"><div className="kpi-top"><span>{title}</span><div className="kpi-icon">{icon}</div></div><strong className="kpi-value">{value}</strong><div className={`kpi-change ${positive?"up":"down"}`}>{positive?<ArrowUpRight size={14}/>:<ArrowDownRight size={14}/>} {change} <span>vs periode lalu</span></div></section>;
}
