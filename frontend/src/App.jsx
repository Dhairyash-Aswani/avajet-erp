import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ManagementReportsView,
  ComplianceView,
  PurchaseOrdersView,
  InventoryView,
  VendorsView,
  InvoicesView,
  AccountsView,
  ExpensesView,
  FinancialReportsView,
  EmployeesView,
  AttendanceView,
  PayrollView,
  CustomersView,
  CharterRequestsView,
  QuotationsView,
  UserRolesView,
} from './PrototypeModules.jsx';

// Unified SVG Icon library
const iconPaths = {
  grid: <><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></>,
  orders: <><path d="M8 6h13M8 12h13M8 18h13"/><path d="M3 6h.01M3 12h.01M3 18h.01"/></>,
  check: <><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></>,
  plane: <><path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></>,
  search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
  plus: <><path d="M12 5v14M5 12h14"/></>,
  arrow: <><path d="M5 12h14M13 6l6 6-6 6"/></>,
  arrowUpRight: <><path d="M7 17 17 7M8 7h9v9"/></>,
  clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
  package: <><path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 8 9 5 9-5M3 8v9l9 5 9-5V8M12 13v9"/></>,
  bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4"/></>,
  back: <><path d="m15 18-6-6 6-6"/><path d="M9 12h12"/></>,
  close: <><path d="m18 6-12 12M6 6l12 12"/></>,
  chevronDown: <><path d="m6 9 6 6 6-6"/></>,
  chevronRight: <><path d="m9 6 6 6-6 6"/></>,
  calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/></>,
  download: <><path d="M12 3v12M7 10l5 5 5-5"/><path d="M5 21h14"/></>,
  gauge: <><path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/></>,
  panel: <><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16"/></>,
  shield: <><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></>,
  trend: <><path d="m3 17 6-6 4 4 8-8"/><path d="M14 7h7v7"/></>,
  dollar: <><line x1="12" y1="2" x2="12" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></>,
  users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
  briefcase: <><rect width="20" height="14" x="2" y="7" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></>,
  fileText: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></>,
  settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></>,
  truck: <><rect width="16" height="12" x="1" y="5" rx="2"/><path d="M17 8h4l3 4v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></>,
  info: <><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></>,
  userCheck: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/></>,
};

function Icon({ name, size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {iconPaths[name] || iconPaths.grid}
    </svg>
  );
}

const timeLabel = d => new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit' }).format(d);
const dateLabel = () => new Intl.DateTimeFormat('en', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date());
const isApproval = order => /approval|review/i.test(order.status);

// AVAJET Aviation ERP Brand Logo
function Logo() {
  return (
    <span className="logo" aria-label="AVAJET Aviation ERP">
      <svg className="logo-mark" viewBox="0 0 48 40" aria-hidden="true">
        <defs>
          <linearGradient id="lg-orbit" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="#41A1D9" />
            <stop offset="1" stopColor="#005F8F" />
          </linearGradient>
        </defs>
        <ellipse cx="24" cy="20" rx="21" ry="10" transform="rotate(-18 24 20)" fill="none" stroke="url(#lg-orbit)" strokeWidth="2.4" />
        <circle cx="24" cy="20" r="9.5" fill="#143758" />
        <path fill="#fff" transform="translate(24 20) rotate(45) scale(.6) translate(-12 -12)" d="M12 1.6c.9 0 1.5 1 1.5 2.2v5.5l8 4.6v2.1l-8-2.5v4.9l2.4 1.8v1.6L12 21l-3.9.8v-1.6l2.4-1.8v-4.9l-8 2.5v-2.1l8-4.6V3.8c0-1.2.6-2.2 1.5-2.2z" />
      </svg>
      <span className="logo-word">AVA<span>JET</span></span>
      <span className="logo-tag">ERP</span>
    </span>
  );
}

// -------------------------------------------------------------
// Sidebar Module Structure for Full Aviation ERP
// -------------------------------------------------------------
const ERP_MODULES = [
  {
    key: 'management',
    label: 'Management',
    items: [
      { key: 'analytics', label: 'Executive Dashboard', icon: 'grid', live: true },
      { key: 'management-reports', label: 'Reports & Analytics', icon: 'trend', live: false },
    ],
  },
  {
    key: 'engineering',
    label: 'Engineering & Maintenance',
    items: [
      { key: 'aircraft', label: 'Aircraft Fleet', icon: 'plane', live: true },
      { key: 'work-orders', label: 'Work Orders', icon: 'orders', live: true },
      { key: 'maintenance-analytics', label: 'Maintenance Analytics', icon: 'gauge', live: true },
      { key: 'approvals', label: 'Approvals & Handoffs', icon: 'check', live: true },
      { key: 'compliance', label: 'Compliance & Documents', icon: 'shield', live: false },
    ],
  },
  {
    key: 'procurement',
    label: 'Procurement & Inventory',
    items: [
      { key: 'purchase-requests', label: 'Purchase Requests', icon: 'package', live: true },
      { key: 'purchase-orders', label: 'Purchase Orders', icon: 'fileText', live: false },
      { key: 'inventory', label: 'Inventory / Spare Parts', icon: 'package', live: false },
      { key: 'vendors', label: 'Vendors & Suppliers', icon: 'truck', live: false },
    ],
  },
  {
    key: 'finance',
    label: 'Finance & Accounting',
    items: [
      { key: 'invoicing', label: 'Invoices', icon: 'dollar', live: false },
      { key: 'accounts', label: 'Accounts Payable / Receivable', icon: 'dollar', live: false },
      { key: 'expenses', label: 'Expenses', icon: 'trend', live: false },
      { key: 'financial-reports', label: 'Financial Reports', icon: 'fileText', live: false },
    ],
  },
  {
    key: 'hr',
    label: 'HR & Personnel',
    items: [
      { key: 'employees', label: 'Employees & Engineers', icon: 'users', live: false },
      { key: 'attendance', label: 'Attendance & Duty Logs', icon: 'calendar', live: false },
      { key: 'payroll', label: 'Payroll Information', icon: 'dollar', live: false },
    ],
  },
  {
    key: 'crm',
    label: 'CRM & Customers',
    items: [
      { key: 'customers', label: 'Customers & Operators', icon: 'briefcase', live: false },
      { key: 'charter-requests', label: 'Enquiries & Charters', icon: 'plane', live: false },
      { key: 'quotations', label: 'Quotations & Estimates', icon: 'fileText', live: false },
    ],
  },
  {
    key: 'system',
    label: 'System & Admin',
    items: [
      { key: 'notifications', label: 'Notifications', icon: 'bell', live: true },
      { key: 'user-roles', label: 'User & Role Management', icon: 'userCheck', live: false },
      { key: 'settings', label: 'System Settings', icon: 'settings', live: true },
    ],
  },
];

const SEED_WORK_ORDERS = [
  {
    id: 'WO-2048',
    aircraft: 'VT-AVA',
    task: 'Inspect hydraulic pump',
    owner: 'Maintenance',
    status: 'In progress',
    priority: 'Routine',
    lastUpdated: 'Today, 09:42',
    partRequest: 'PR-0317 · Hydraulic pump seal',
    handoffs: [
      { team: 'CAMO', action: 'Work order created', time: 'Today, 08:05', status: 'Created' },
      { team: 'Maintenance', action: 'Inspection started', time: 'Today, 09:42', status: 'In progress' }
    ]
  },
  {
    id: 'WO-2051',
    aircraft: 'VT-AVB',
    task: 'Review component log',
    owner: 'CAMO',
    status: 'Approval needed',
    priority: 'High',
    lastUpdated: 'Today, 08:15',
    partRequest: '—',
    handoffs: [
      { team: 'CAMO', action: 'Component log review requested', time: 'Today, 08:15', status: 'Approval needed' }
    ]
  },
  {
    id: 'WO-2039',
    aircraft: 'VT-AVC',
    task: 'Cabin pressure check',
    owner: 'Quality',
    status: 'Waiting',
    priority: 'Routine',
    lastUpdated: 'Yesterday',
    partRequest: '—',
    handoffs: [
      { team: 'Maintenance', action: 'Inspection submitted', time: 'Yesterday', status: 'Waiting' }
    ]
  }
];

export default function App() {
  const [page, setPage] = useState('analytics');
  const [orders, setOrders] = useState(SEED_WORK_ORDERS);
  const [summary, setSummary] = useState({ openWorkOrders: 3, waitingApprovals: 1, partsToTrack: 1, updated: 'Live' });
  const [selectedId, setSelectedId] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All statuses');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [modal, setModal] = useState(false);
  const [toast, setToast] = useState('');
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ aircraft: '', task: '', owner: 'CAMO', priority: 'Routine', partRequest: '' });
  const [review, setReview] = useState({ sendTo: 'CAMO review', dueDate: '', note: '' });
  const [confirmationId, setConfirmationId] = useState('');
  const [lastSync, setLastSync] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const [openSections, setOpenSections] = useState({
    management: true,
    engineering: true,
    procurement: false,
    finance: false,
    hr: false,
    crm: false,
    system: false,
  });
  const searchRef = useRef(null);

  // Poll Java backend or Vercel serverless API with resilient fallback
  const refresh = async (initial = false) => {
    if (initial) setLoading(true);
    setError('');
    try {
      const [ordersRes, summaryRes] = await Promise.all([fetch('/api/work-orders'), fetch('/api/summary')]);
      if (!ordersRes.ok || !summaryRes.ok) throw new Error('API offline');
      const [orderData, summaryData] = await Promise.all([ordersRes.json(), summaryRes.json()]);
      if (Array.isArray(orderData) && orderData.length > 0) setOrders(orderData);
      if (summaryData) setSummary(summaryData);
      setLastSync(new Date());
    } catch (e) {
      setOrders(prev => (prev && prev.length > 0 ? prev : SEED_WORK_ORDERS));
      setSummary(prev => ({
        openWorkOrders: prev?.openWorkOrders || 3,
        waitingApprovals: prev?.waitingApprovals || 1,
        partsToTrack: prev?.partsToTrack || 1,
        updated: 'Live Preview'
      }));
    } finally {
      if (initial) setLoading(false);
    }
  };

  useEffect(() => {
    refresh(true);
    const timer = setInterval(() => refresh(), 25000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(''), 3500);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    const onKey = e => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const selectedOrder = orders.find(o => o.id === selectedId);
  const visibleOrders = useMemo(() => {
    return orders.filter(o => {
      const term = search.trim().toLowerCase();
      const matches = !term || [o.id, o.aircraft, o.task, o.owner, o.status, o.partRequest].some(v => String(v).toLowerCase().includes(term));
      const matchesStatus = statusFilter === 'All statuses' || o.status === statusFilter;
      return matches && matchesStatus;
    });
  }, [orders, search, statusFilter]);

  const handoffs = useMemo(() => {
    return orders.flatMap(o => (o.handoffs || []).map(h => ({ ...h, orderId: o.id, task: o.task }))).reverse().slice(0, 6);
  }, [orders]);

  const openOrder = id => {
    setSelectedId(id);
    setPage('detail');
  };

  const nav = next => {
    setPage(next);
    if (next !== 'detail') setSelectedId('');
  };

  // CSV export preserved and enhanced
  function exportReport() {
    const head = ['Reference', 'Aircraft', 'Task', 'Owner', 'Status', 'Priority', 'Last updated', 'Part request'];
    const rows = orders.map(o => [o.id, o.aircraft, o.task, o.owner, o.status, o.priority, o.lastUpdated, o.partRequest]);
    const csv = [head, ...rows].map(r => r.map(v => `"${String(v ?? '').replace(/"/g, '""')}"`).join(',')).join('\r\n');
    const url = URL.createObjectURL(new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `avajet-fleet-report-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setToast('Fleet report exported');
  }

  // Work order creation via POST /api/work-orders
  async function createOrder(e) {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await fetch('/api/work-orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(form),
      });
      if (res.ok) {
        const data = await res.json();
        await refresh();
        setModal(false);
        setForm({ aircraft: '', task: '', owner: 'CAMO', priority: 'Routine', partRequest: '' });
        setSelectedId(data.id);
        setPage('detail');
        setToast(`${data.id} created successfully`);
        return;
      }
    } catch {}

    // Resilient client fallback for offline/static deployment
    const nextId = `WO-${2052 + orders.length}`;
    const newOrder = {
      id: nextId,
      aircraft: form.aircraft || 'VT-AVA',
      task: form.task || 'Line Maintenance Inspection',
      owner: form.owner || 'CAMO',
      status: 'Not started',
      priority: form.priority || 'Routine',
      lastUpdated: 'Just now',
      partRequest: form.partRequest || '—',
      handoffs: [{ team: 'CAMO', action: 'Work order created', time: 'Just now', status: 'Not started' }]
    };
    setOrders(prev => [newOrder, ...prev]);
    setSummary(prev => ({ ...prev, openWorkOrders: prev.openWorkOrders + 1 }));
    setModal(false);
    setForm({ aircraft: '', task: '', owner: 'CAMO', priority: 'Routine', partRequest: '' });
    setSelectedId(nextId);
    setPage('detail');
    setToast(`${nextId} created successfully`);
    setBusy(false);
  }

  // Review request via POST /api/work-orders/:id/review
  async function sendReview(e) {
    e.preventDefault();
    if (!selectedOrder) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/work-orders/${encodeURIComponent(selectedOrder.id)}/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(review),
      });
      if (res.ok) {
        const data = await res.json();
        await refresh();
        setConfirmationId(data.id);
        setPage('confirmation');
        setToast('Review request recorded');
        return;
      }
    } catch {}

    // Resilient client fallback for offline/static deployment
    const dest = review.sendTo || 'CAMO review';
    let action = 'Review request sent';
    if (review.dueDate) action += ` · Due ${review.dueDate}`;
    if (review.note) action += ` · ${review.note}`;
    const updated = {
      ...selectedOrder,
      owner: dest,
      status: 'Awaiting review',
      lastUpdated: 'Just now',
      handoffs: [
        ...(selectedOrder.handoffs || []),
        { team: dest, action, time: 'Just now', status: 'Awaiting review' }
      ]
    };
    setOrders(prev => prev.map(o => o.id === updated.id ? updated : o));
    setConfirmationId(selectedOrder.id);
    setPage('confirmation');
    setToast('Review request recorded');
    setBusy(false);
  }

  const activeNavKey = page === 'detail' ? 'work-orders' : page === 'confirmation' ? 'approvals' : page;

  return (
    <div className={`shell ${collapsed ? 'collapsed' : ''}`}>
      {/* Top Navigation Bar */}
      <header className="topbar">
        <button className="brand" onClick={() => nav('analytics')} aria-label="AVAJET Aviation ERP Home">
          <Logo />
        </button>

        <label className="global-search">
          <Icon name="search" size={16} />
          <input
            id="global-search"
            ref={searchRef}
            value={search}
            onChange={e => {
              setSearch(e.target.value);
              if (page !== 'work-orders' && page !== 'analytics') nav('work-orders');
            }}
            placeholder="Search aircraft, tail number, task, maintenance..."
            aria-label="Global ERP Search"
          />
          <kbd>Ctrl K</kbd>
        </label>

        <div className="top-actions">
          <button className="icon-button" aria-label="Current Date" title={dateLabel()}>
            <Icon name="calendar" size={17} />
          </button>
          <button className="icon-button" aria-label="Notifications" onClick={() => nav('notifications')} title="Notifications & Approvals">
            <Icon name="bell" size={17} />
            {summary.waitingApprovals > 0 && <i className="badge-dot" />}
          </button>
          <div className="user-chip">
            <span className="avatar">AU</span>
            <span className="user-meta">
              <strong>Admin User</strong>
              <small>ADMIN</small>
            </span>
            <Icon name="chevronDown" size={14} />
          </div>
        </div>
      </header>

      {/* Collapsible Module Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-top">
          <button
            className="collapse-toggle"
            onClick={() => setCollapsed(c => !c)}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <Icon name="panel" size={17} />
          </button>
          {!collapsed && <span className="sidebar-title">OPERATIONS ERP</span>}
        </div>

        <div className="sidebar-scroll">
          {ERP_MODULES.map(group => {
            const isOpen = openSections[group.key] ?? false;
            return (
              <div className="nav-section" key={group.key}>
                <button
                  className="nav-section-head"
                  onClick={() => setOpenSections(v => ({ ...v, [group.key]: !v[group.key] }))}
                  aria-expanded={isOpen}
                >
                  <span>{group.label}</span>
                  <span className={`chev ${isOpen ? 'open' : ''}`}>
                    <Icon name="chevronDown" size={13} />
                  </span>
                </button>
                <nav className={`nav-list ${isOpen ? '' : 'hidden'}`} aria-label={group.label}>
                  {group.items.map(item => {
                    const isActive = activeNavKey === item.key;
                    return (
                      <button
                        key={item.key}
                        id={`nav-${item.key}`}
                        data-nav={item.key}
                        title={item.label}
                        className={`nav-item ${isActive ? 'active' : ''}`}
                        onClick={() => nav(item.key)}
                      >
                        <Icon name={item.icon} size={16} />
                        <span className="nav-text">{item.label}</span>
                        {item.key === 'approvals' && summary.waitingApprovals > 0 && (
                          <span className="nav-count">{summary.waitingApprovals}</span>
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>
            );
          })}
        </div>

        <div className="sidebar-foot">
          <span className="live-dot" />
          <span className="nav-text">Connected · Java REST API</span>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-area">
        <div className="page-wrap">
          {error && (
            <div className="alert" role="alert">
              <span className="alert-msg">
                <Icon name="info" size={16} />
                {error}
              </span>
              <button onClick={() => refresh()}>Retry</button>
            </div>
          )}

          {loading ? (
            <div className="loading">
              <span className="spinner" />
              Loading AVAJET Aviation ERP workspace...
            </div>
          ) : (
            <div className="page-anim" key={page}>
              {/* Executive Dashboard / Maintenance Analytics (VYOMA Reference Layout) */}
              {(page === 'analytics' || page === 'maintenance-analytics') && (
                <AnalyticsDashboard
                  orders={orders}
                  summary={summary}
                  handoffs={handoffs}
                  openOrder={openOrder}
                  goOrders={() => nav('work-orders')}
                  goApprovals={() => nav('approvals')}
                  create={() => setModal(true)}
                  exportReport={exportReport}
                  lastSync={lastSync}
                />
              )}

              {/* Work Orders List (Live Backend) */}
              {page === 'work-orders' && (
                <WorkOrdersView
                  orders={visibleOrders}
                  allOrders={orders}
                  search={search}
                  setSearch={setSearch}
                  statusFilter={statusFilter}
                  setStatusFilter={setStatusFilter}
                  openOrder={openOrder}
                  create={() => setModal(true)}
                />
              )}

              {/* Approvals & Handoffs (Live Backend) */}
              {page === 'approvals' && (
                <ApprovalsView orders={orders.filter(isApproval)} openOrder={openOrder} />
              )}

              {/* Work Order Detail View (Live Backend) */}
              {page === 'detail' && selectedOrder && (
                <DetailView
                  order={selectedOrder}
                  review={review}
                  setReview={setReview}
                  submit={sendReview}
                  back={() => nav('work-orders')}
                  busy={busy}
                />
              )}

              {page === 'detail' && !selectedOrder && (
                <EmptyView
                  title="Work order unavailable"
                  detail="This record may have been updated or removed."
                  action={() => nav('work-orders')}
                  actionLabel="Back to work orders"
                />
              )}

              {/* Confirmation View */}
              {page === 'confirmation' && (
                <ConfirmationView
                  order={orders.find(o => o.id === confirmationId) || selectedOrder}
                  goDetail={() => setPage('detail')}
                  goHome={() => nav('analytics')}
                />
              )}

              {/* Aircraft Fleet (Live Data Derived) */}
              {page === 'aircraft' && (
                <AircraftFleetView orders={orders} openOrder={openOrder} create={() => setModal(true)} />
              )}

              {/* Purchase Requests (Live Parts Derived) */}
              {page === 'purchase-requests' && (
                <PurchaseRequestsView orders={orders} openOrder={openOrder} create={() => setModal(true)} />
              )}

              {/* System Settings (Live Environment) */}
              {page === 'settings' && (
                <SettingsView summary={summary} refresh={refresh} lastSync={lastSync} />
              )}

              {/* Notifications Panel */}
              {page === 'notifications' && (
                <NotificationsView orders={orders} openOrder={openOrder} />
              )}

              {/* Interactive Prototype Modules */}
              {page === 'management-reports' && (
                <ManagementReportsView
                  openOrder={openOrder}
                  nav={nav}
                  setToast={setToast}
                  Icon={Icon}
                  StatusBadge={StatusBadge}
                  Button={Button}
                  PageHeader={PageHeader}
                  Card={Card}
                  KpiCard={KpiCard}
                />
              )}

              {page === 'compliance' && (
                <ComplianceView
                  openOrder={openOrder}
                  setToast={setToast}
                  Icon={Icon}
                  StatusBadge={StatusBadge}
                  Button={Button}
                  PageHeader={PageHeader}
                  Card={Card}
                  KpiCard={KpiCard}
                />
              )}

              {page === 'purchase-orders' && (
                <PurchaseOrdersView
                  setToast={setToast}
                  Icon={Icon}
                  StatusBadge={StatusBadge}
                  Button={Button}
                  PageHeader={PageHeader}
                  Card={Card}
                  KpiCard={KpiCard}
                />
              )}

              {page === 'inventory' && (
                <InventoryView
                  setToast={setToast}
                  Icon={Icon}
                  StatusBadge={StatusBadge}
                  Button={Button}
                  PageHeader={PageHeader}
                  Card={Card}
                  KpiCard={KpiCard}
                />
              )}

              {page === 'vendors' && (
                <VendorsView
                  setToast={setToast}
                  Icon={Icon}
                  StatusBadge={StatusBadge}
                  Button={Button}
                  PageHeader={PageHeader}
                  Card={Card}
                  KpiCard={KpiCard}
                />
              )}

              {page === 'invoicing' && (
                <InvoicesView
                  setToast={setToast}
                  Icon={Icon}
                  StatusBadge={StatusBadge}
                  Button={Button}
                  PageHeader={PageHeader}
                  Card={Card}
                  KpiCard={KpiCard}
                />
              )}

              {page === 'accounts' && (
                <AccountsView
                  setToast={setToast}
                  Icon={Icon}
                  StatusBadge={StatusBadge}
                  Button={Button}
                  PageHeader={PageHeader}
                  Card={Card}
                  KpiCard={KpiCard}
                />
              )}

              {page === 'expenses' && (
                <ExpensesView
                  setToast={setToast}
                  Icon={Icon}
                  StatusBadge={StatusBadge}
                  Button={Button}
                  PageHeader={PageHeader}
                  Card={Card}
                  KpiCard={KpiCard}
                />
              )}

              {page === 'financial-reports' && (
                <FinancialReportsView
                  setToast={setToast}
                  Icon={Icon}
                  StatusBadge={StatusBadge}
                  Button={Button}
                  PageHeader={PageHeader}
                  Card={Card}
                  KpiCard={KpiCard}
                />
              )}

              {page === 'employees' && (
                <EmployeesView
                  setToast={setToast}
                  Icon={Icon}
                  StatusBadge={StatusBadge}
                  Button={Button}
                  PageHeader={PageHeader}
                  Card={Card}
                  KpiCard={KpiCard}
                />
              )}

              {page === 'attendance' && (
                <AttendanceView
                  setToast={setToast}
                  Icon={Icon}
                  StatusBadge={StatusBadge}
                  Button={Button}
                  PageHeader={PageHeader}
                  Card={Card}
                  KpiCard={KpiCard}
                />
              )}

              {page === 'payroll' && (
                <PayrollView
                  setToast={setToast}
                  Icon={Icon}
                  StatusBadge={StatusBadge}
                  Button={Button}
                  PageHeader={PageHeader}
                  Card={Card}
                  KpiCard={KpiCard}
                />
              )}

              {page === 'customers' && (
                <CustomersView
                  setToast={setToast}
                  Icon={Icon}
                  StatusBadge={StatusBadge}
                  Button={Button}
                  PageHeader={PageHeader}
                  Card={Card}
                  KpiCard={KpiCard}
                />
              )}

              {page === 'charter-requests' && (
                <CharterRequestsView
                  setToast={setToast}
                  Icon={Icon}
                  StatusBadge={StatusBadge}
                  Button={Button}
                  PageHeader={PageHeader}
                  Card={Card}
                  KpiCard={KpiCard}
                />
              )}

              {page === 'quotations' && (
                <QuotationsView
                  setToast={setToast}
                  Icon={Icon}
                  StatusBadge={StatusBadge}
                  Button={Button}
                  PageHeader={PageHeader}
                  Card={Card}
                  KpiCard={KpiCard}
                />
              )}

              {page === 'user-roles' && (
                <UserRolesView
                  setToast={setToast}
                  Icon={Icon}
                  StatusBadge={StatusBadge}
                  Button={Button}
                  PageHeader={PageHeader}
                  Card={Card}
                  KpiCard={KpiCard}
                />
              )}
            </div>
          )}
        </div>
      </main>

      {/* Create Work Order Modal */}
      {modal && (
        <CreateModal form={form} setForm={setForm} close={() => setModal(false)} submit={createOrder} busy={busy} />
      )}

      {/* Floating System Toast */}
      {toast && (
        <div className="toast" role="status">
          <span className="toast-check">✓</span>
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}

function isPlaceholderModule(key) {
  const implemented = [
    'analytics',
    'maintenance-analytics',
    'work-orders',
    'approvals',
    'detail',
    'confirmation',
    'aircraft',
    'purchase-requests',
    'settings',
    'notifications',
  ];
  return !implemented.includes(key);
}

// -------------------------------------------------------------
// Component: Page Header
// -------------------------------------------------------------
function PageHeader({ eyebrow, title, description, children }) {
  return (
    <div className="page-heading">
      <div>
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
      {children && <div className="heading-actions">{children}</div>}
    </div>
  );
}

// -------------------------------------------------------------
// Component: Action Button
// -------------------------------------------------------------
function Button({ children, onClick, kind = 'secondary', icon, disabled, type = 'button', id }) {
  return (
    <button id={id} type={type} className={`button ${kind}`} onClick={onClick} disabled={disabled}>
      {icon && <Icon name={icon} size={15} />}
      <span>{children}</span>
    </button>
  );
}

// -------------------------------------------------------------
// Component: Status Badge (Standardized across app)
// -------------------------------------------------------------
function StatusBadge({ value }) {
  const text = String(value || 'Unknown');
  const cls = /progress/i.test(text)
    ? 'progress'
    : /approval|awaiting|review/i.test(text)
    ? 'critical'
    : /waiting/i.test(text)
    ? 'waiting'
    : /complete|serviceable|healthy/i.test(text)
    ? 'complete'
    : 'neutral';
  return (
    <span className={`status-badge ${cls}`}>
      <i className="status-dot" />
      {text}
    </span>
  );
}

// -------------------------------------------------------------
// Component: Card Wrapper
// -------------------------------------------------------------
function Card({ title, onOpen, children, className = '', headerExtra }) {
  return (
    <section className={`card ${className}`}>
      <div className="card-head">
        <h2>{title}</h2>
        <div className="card-head-right">
          {headerExtra}
          {onOpen && (
            <button className="card-open" onClick={onOpen} aria-label={`Open ${title}`} title={`Open ${title}`}>
              <Icon name="arrowUpRight" size={15} />
            </button>
          )}
        </div>
      </div>
      <div className="card-body">{children}</div>
    </section>
  );
}

// -------------------------------------------------------------
// Component: Top Metric KPI Card
// -------------------------------------------------------------
function KpiCard({ label, value, note, onClick, tone }) {
  return (
    <button className={`kpi-card ${tone || ''}`} onClick={onClick} type="button">
      <div className="kpi-top">
        <span className="kpi-label">{label}</span>
        <span className="kpi-arrow">
          <Icon name="arrowUpRight" size={14} />
        </span>
      </div>
      <strong className="kpi-value">{value}</strong>
      <small className="kpi-note">{note}</small>
    </button>
  );
}

// -------------------------------------------------------------
// Component: Donut Chart (Engine Health, Availability, etc.)
// -------------------------------------------------------------
function DonutChart({ segments, center, caption, size = 130 }) {
  const r = 46;
  const c = 2 * Math.PI * r;
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  let offset = 0;

  return (
    <svg className="donut-chart" width={size} height={size} viewBox="0 0 120 120" role="img" aria-label={`${center} ${caption}`}>
      <circle cx="60" cy="60" r={r} fill="none" stroke="#EEF3F8" strokeWidth="12" />
      {segments.map(s => {
        const len = (s.value / total) * c;
        const el = (
          <circle
            key={s.label}
            cx="60"
            cy="60"
            r={r}
            fill="none"
            stroke={s.stroke}
            strokeWidth="12"
            strokeDasharray={`${len} ${c - len}`}
            strokeDashoffset={-offset}
            transform="rotate(-90 60 60)"
            className="donut-seg"
          />
        );
        offset += len;
        return el;
      })}
      <text x="60" y="58" textAnchor="middle" className="donut-center-val">
        {center}
      </text>
      <text x="60" y="74" textAnchor="middle" className="donut-center-cap">
        {caption}
      </text>
    </svg>
  );
}

// -------------------------------------------------------------
// Component: Maintenance Forecast Bar Chart
// -------------------------------------------------------------
function MaintenanceForecastChart({ orders }) {
  const buckets = [
    { label: '0-30 days', color: 'red', match: o => /approval|review|awaiting/i.test(o.status) || /high|urgent/i.test(o.priority) },
    { label: '31-60 days', color: 'amber', match: o => /^waiting/i.test(o.status) },
    { label: '61-90 days', color: 'pink', match: o => /progress/i.test(o.status) },
    { label: '> 90 days', color: 'green', match: o => /not started|routine/i.test(o.status) || /routine/i.test(o.priority) },
  ].map(b => ({
    ...b,
    value: orders.filter(b.match).length || (b.label === '> 90 days' ? 1 : 0),
  }));

  const maxVal = Math.max(4, ...buckets.map(b => b.value));
  const ticks = [maxVal, Math.round(maxVal * 0.66), Math.round(maxVal * 0.33), 0];

  return (
    <div className="forecast-chart">
      <div className="forecast-legend">
        <span><i className="sq red" />0-30 days</span>
        <span><i className="sq amber" />31-60 days</span>
        <span><i className="sq pink" />61-90 days</span>
        <span><i className="sq green" />&gt; 90 days</span>
      </div>

      <div className="forecast-body">
        <div className="forecast-y-axis">
          {ticks.map((t, idx) => (
            <span key={idx}>{t}</span>
          ))}
        </div>
        <div className="forecast-plot">
          <div className="forecast-gridline" style={{ top: '0%' }} />
          <div className="forecast-gridline" style={{ top: '33%' }} />
          <div className="forecast-gridline" style={{ top: '66%' }} />
          <div className="forecast-gridline" style={{ top: '100%' }} />
          {buckets.map(b => {
            const pct = Math.max(6, (b.value / maxVal) * 100);
            return (
              <div className="forecast-col" key={b.label}>
                <div className={`forecast-bar ${b.color}`} style={{ height: `${pct}%` }}>
                  {b.value > 0 && <span className="bar-tag">{b.value}</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="forecast-x-axis">
        {buckets.map(b => (
          <span key={b.label}>{b.label}</span>
        ))}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// Component: Work Order Table (Shared across views)
// -------------------------------------------------------------
function WorkOrderTable({ orders, openOrder, compact = false }) {
  return (
    <div className="table-responsive">
      <table className="erp-table">
        <thead>
          <tr>
            <th>Reference</th>
            <th>Aircraft / Task</th>
            <th>Current Owner</th>
            {!compact && <th>Priority</th>}
            <th>Status</th>
            <th>Last Updated</th>
            <th className="th-action" aria-label="Action" />
          </tr>
        </thead>
        <tbody>
          {orders.length ? (
            orders.map(o => (
              <tr key={o.id} onClick={() => openOrder(o.id)} className="click-row">
                <td>
                  <span className="ref-badge">{o.id}</span>
                </td>
                <td>
                  <div className="cell-task">
                    <strong>{o.task}</strong>
                    <small>
                      <span className="tail-tag">{o.aircraft}</span>
                      {o.partRequest && o.partRequest !== '—' && (
                        <span className="part-hint"> · {o.partRequest}</span>
                      )}
                    </small>
                  </div>
                </td>
                <td className="cell-owner">{o.owner}</td>
                {!compact && (
                  <td>
                    <span className={`priority-tag ${String(o.priority).toLowerCase()}`}>
                      {o.priority}
                    </span>
                  </td>
                )}
                <td>
                  <StatusBadge value={o.status} />
                </td>
                <td className="cell-updated">{o.lastUpdated}</td>
                <td className="cell-action">
                  <button
                    className="row-open-btn"
                    aria-label={`Open ${o.id}`}
                    onClick={e => {
                      e.stopPropagation();
                      openOrder(o.id);
                    }}
                  >
                    <Icon name="chevronRight" size={15} />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={compact ? 6 : 7}>
                <div className="table-empty">No matching work orders found.</div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

// -------------------------------------------------------------
// View 1: Executive Dashboard / Maintenance Analytics (VYOMA Reference Layout)
// -------------------------------------------------------------
function AnalyticsDashboard({
  orders,
  summary,
  handoffs,
  openOrder,
  goOrders,
  goApprovals,
  create,
  exportReport,
  lastSync,
}) {
  const aircraft = [...new Set(orders.map(o => o.aircraft))];
  const highPriority = orders.filter(o => /high|urgent/i.test(o.priority));
  const activeAlerts = orders.filter(
    o => isApproval(o) || /high|urgent/i.test(o.priority) || /awaiting/i.test(o.status)
  );
  const pendingApprovals = summary.waitingApprovals;
  const onTrackCount = orders.length - pendingApprovals;
  const healthScore = orders.length ? Math.round((onTrackCount / orders.length) * 100) : 100;
  const healthPct = n => (orders.length ? `${((n / orders.length) * 100).toFixed(1)}%` : '0.0%');

  return (
    <>
      <PageHeader
        title="Fleet Compliance Analytics"
        description={
          <>
            Real-Time Airworthiness Status · {aircraft.length} aircraft under management{' '}
            <span className="live-status-tag">
              (Updated at {lastSync ? timeLabel(lastSync) : 'Live'})
            </span>
          </>
        }
      >
        <Button kind="outline-red" icon="download" onClick={exportReport} id="btn-export-report">
          Export Report
        </Button>
        <Button kind="primary" icon="plus" onClick={create} id="btn-create-work-order">
          New Work Order
        </Button>
      </PageHeader>

      {/* 6 Top Metric KPI Cards (Exact Vyoma Layout) */}
      <section className="kpi-strip" aria-label="Fleet KPIs">
        <KpiCard
          label="Total Aircraft"
          value={aircraft.length}
          note="Active in Fleet"
          onClick={goOrders}
        />
        <KpiCard
          label="Open Dues"
          value={summary.openWorkOrders}
          note={`Across ${aircraft.length} Aircraft`}
          onClick={goOrders}
        />
        <KpiCard
          label="Overdue ADs"
          value="0"
          note={`Across ${aircraft.length} Aircraft`}
          onClick={goApprovals}
        />
        <KpiCard
          label="MEL Expiring (7d)"
          value="0"
          note={`Across ${aircraft.length} Aircraft`}
          onClick={goOrders}
        />
        <KpiCard
          label="Active Alerts"
          value={activeAlerts.length}
          note="Requires Attention"
          onClick={goApprovals}
          tone={activeAlerts.length ? 'warn' : ''}
        />
        <KpiCard
          label="Avg Utilization"
          value="—"
          note="Flight Hours Used"
          onClick={goOrders}
        />
      </section>

      {/* Mid Row: 3 Primary Aviation Panels (Forecast, Critical Alerts, Engine Health) */}
      <section className="grid-three-col">
        {/* Panel 1: Maintenance Forecast */}
        <Card title="Maintenance Forecast (Tasks Due)" onOpen={goOrders}>
          <MaintenanceForecastChart orders={orders} />
        </Card>

        {/* Panel 2: Critical Alerts */}
        <Card title="Critical Alerts" onOpen={goApprovals}>
          <div className="alert-scroll-list">
            {activeAlerts.length ? (
              activeAlerts.map(o => (
                <button
                  key={o.id}
                  className="critical-alert-item"
                  onClick={() => openOrder(o.id)}
                  type="button"
                >
                  <span className="alert-gauge-icon">
                    <Icon name="gauge" size={17} />
                  </span>
                  <div className="alert-text-block">
                    <strong>
                      {o.aircraft} · {o.id}
                    </strong>
                    <small>
                      {o.task} — <span className="alert-highlight">{o.status}</span>
                      {/high|urgent/i.test(o.priority) ? ` · ${o.priority}` : ''}
                    </small>
                  </div>
                  <Icon name="chevronRight" size={15} />
                </button>
              ))
            ) : (
              <div className="card-empty-state">
                <Icon name="check" size={24} />
                <p>No critical alerts. Fleet airworthiness is on track.</p>
              </div>
            )}
          </div>
        </Card>

        {/* Panel 3: Engine Health (Fleet) */}
        <Card title="Engine Health (Fleet)" onOpen={goApprovals}>
          <div className="donut-panel-flex">
            <DonutChart
              size={135}
              center={`${healthScore}%`}
              caption="Health Score"
              segments={[
                { label: 'Healthy', value: onTrackCount, stroke: '#22A06B' },
                { label: 'Monitor', value: pendingApprovals, stroke: '#E8A317' },
                { label: 'Unhealthy', value: highPriority.length, stroke: '#D93A3F' },
              ]}
            />
            <ul className="donut-stat-legend">
              <li>
                <i className="dot-green" />
                <div>
                  <span className="leg-label">Healthy</span>
                  <strong>{onTrackCount} ({healthPct(onTrackCount)})</strong>
                </div>
              </li>
              <li>
                <i className="dot-amber" />
                <div>
                  <span className="leg-label">Monitor</span>
                  <strong>{pendingApprovals} ({healthPct(pendingApprovals)})</strong>
                </div>
              </li>
              <li>
                <i className="dot-red" />
                <div>
                  <span className="leg-label">Unhealthy</span>
                  <strong>{highPriority.length} ({healthPct(highPriority.length)})</strong>
                </div>
              </li>
            </ul>
          </div>
        </Card>
      </section>

      {/* Lower Row: Component Airworthiness Gauges */}
      <section className="grid-three-col mini-gauges">
        <Card title="Aircraft Availability" onOpen={goOrders}>
          <div className="mini-gauge-row">
            <DonutChart
              size={90}
              center="100%"
              caption="Available"
              segments={[{ label: 'Available', value: 100, stroke: '#22A06B' }]}
            />
            <div className="gauge-meta">
              <span className="meta-title">Total Time (30D)</span>
              <strong>142.8 FH</strong>
              <small className="meta-sub">Active Line Operations</small>
            </div>
          </div>
        </Card>

        <Card title="Landing Gear Health" onOpen={goOrders}>
          <div className="mini-gauge-row">
            <DonutChart
              size={90}
              center="100%"
              caption="Cycles"
              segments={[{ label: 'Healthy', value: 3, stroke: '#22A06B' }]}
            />
            <div className="gauge-meta">
              <span className="meta-title">Healthy</span>
              <strong>{aircraft.length} ({aircraft.length ? '100.0%' : '0%'})</strong>
              <small className="meta-sub">Zero Overdue Cycles</small>
            </div>
          </div>
        </Card>

        <Card title="APU Health" onOpen={goOrders}>
          <div className="mini-gauge-row">
            <DonutChart
              size={90}
              center="100%"
              caption="APU"
              segments={[{ label: 'Healthy', value: 2, stroke: '#22A06B' }]}
            />
            <div className="gauge-meta">
              <span className="meta-title">Healthy</span>
              <strong>{aircraft.length} ({aircraft.length ? '100.0%' : '0%'})</strong>
              <small className="meta-sub">Serviceable State</small>
            </div>
          </div>
        </Card>
      </section>

      {/* Bottom Row: Work Needing Attention + Recent Handoffs Audit Trail */}
      <section className="grid-two-col">
        <Card title="Work Needing Attention" onOpen={goOrders} className="flush-card">
          <WorkOrderTable orders={orders.slice(0, 5)} openOrder={openOrder} compact />
        </Card>

        <Card title="Recent Handoffs & Audit Trail" onOpen={goApprovals}>
          <div className="handoff-timeline">
            {handoffs.length ? (
              handoffs.map((h, idx) => (
                <div className="timeline-row" key={`${h.orderId}-${idx}`}>
                  <div className="timeline-bubble">
                    <Icon name={idx === 0 ? 'check' : 'arrow'} size={12} />
                  </div>
                  <div className="timeline-info">
                    <div className="timeline-head">
                      <strong>{h.orderId}</strong>
                      <time>
                        {/^\d{4}-/.test(h.time)
                          ? new Date(h.time).toLocaleDateString('en-GB', {
                              day: '2-digit',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : h.time}
                      </time>
                    </div>
                    <p className="timeline-action">{h.action}</p>
                    <small className="timeline-badge">
                      {h.team} · {h.status}
                    </small>
                  </div>
                </div>
              ))
            ) : (
              <div className="card-empty-state">No handoff history recorded yet.</div>
            )}
          </div>
        </Card>
      </section>
    </>
  );
}

// -------------------------------------------------------------
// View 2: Work Orders (Live Java Backend View)
// -------------------------------------------------------------
function WorkOrdersView({
  orders,
  allOrders,
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  openOrder,
  create,
}) {
  const uniqueStatuses = [...new Set(allOrders.map(o => o.status))];

  return (
    <>
      <PageHeader
        title="Engineering Work Orders"
        description="Filter records, trace current ownership, and manage CAMO review workflows."
      >
        <Button kind="primary" icon="plus" onClick={create} id="btn-create-wo">
          Create Work Order
        </Button>
      </PageHeader>

      <div className="card flush-card">
        <div className="table-filter-bar">
          <label className="filter-search-box">
            <Icon name="search" size={15} />
            <input
              id="orders-search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Filter by reference, aircraft, task, or parts..."
            />
          </label>

          <label className="filter-select-box">
            <span>Status:</span>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              <option>All statuses</option>
              {uniqueStatuses.map(s => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </label>
        </div>

        <WorkOrderTable orders={orders} openOrder={openOrder} />

        <div className="table-footer-bar">
          <span>
            Showing <strong>{orders.length}</strong> of {allOrders.length} records
          </span>
          <span className="footer-sync">Connected to Java REST API</span>
        </div>
      </div>
    </>
  );
}

// -------------------------------------------------------------
// View 3: Approvals & Handoffs (Live Java Backend View)
// -------------------------------------------------------------
function ApprovalsView({ orders, openOrder }) {
  return (
    <>
      <PageHeader
        title="Approvals & Inter-Team Handoffs"
        description="Review items requiring decision, verify handoff trails, and delegate next maintenance actions."
      />

      <div className="approvals-banner">
        <div className="banner-left">
          <span className="banner-eyebrow">PENDING DECISIONS</span>
          <strong className="banner-count">{orders.length}</strong>
        </div>
        <p className="banner-desc">
          Records currently awaiting CAMO, Maintenance, or Quality sign-off. Open any work order to inspect its history and route the next action.
        </p>
      </div>

      <div className="card flush-card">
        <div className="card-head">
          <h2>Pending Review Queue</h2>
        </div>
        <WorkOrderTable orders={orders} openOrder={openOrder} />
      </div>
    </>
  );
}

// -------------------------------------------------------------
// View 4: Work Order Detail & Review Form (Live Java Backend View)
// -------------------------------------------------------------
function DetailView({ order, review, setReview, submit, back, busy }) {
  return (
    <>
      <div className="detail-top-nav">
        <Button kind="text" icon="back" onClick={back}>
          Back to Work Orders
        </Button>
        <span className="detail-ref-tag">{order.id}</span>
      </div>

      <PageHeader
        eyebrow="Maintenance Record Detail"
        title={order.task}
        description={`${order.aircraft} · Work Order ${order.id}`}
      >
        <StatusBadge value={order.status} />
      </PageHeader>

      <div className="detail-layout">
        <div className="detail-left-col">
          {/* Record Summary */}
          <section className="card">
            <div className="card-head">
              <h2>Record Summary</h2>
            </div>
            <div className="spec-grid">
              <SpecItem label="Current Status">
                <StatusBadge value={order.status} />
              </SpecItem>
              <SpecItem label="Current Owner">{order.owner}</SpecItem>
              <SpecItem label="Priority">
                <span className={`priority-tag ${String(order.priority).toLowerCase()}`}>
                  {order.priority}
                </span>
              </SpecItem>
              <SpecItem label="Last Updated">{order.lastUpdated}</SpecItem>
              <SpecItem label="Linked Part Request" wide>
                {order.partRequest || 'None linked'}
              </SpecItem>
            </div>
          </section>

          {/* Audit Trail Handoff History */}
          <section className="card">
            <div className="card-head">
              <h2>Handoff History &amp; Audit Trail</h2>
              <span className="badge-count-pill">{order.handoffs?.length || 0} updates</span>
            </div>
            <div className="history-timeline-list">
              {(order.handoffs || []).map((h, idx) => (
                <div className="history-step" key={`${h.time}-${idx}`}>
                  <div className={`step-dot ${idx === order.handoffs.length - 1 ? 'latest' : ''}`}>
                    <span />
                  </div>
                  <div className="step-content">
                    <div className="step-header">
                      <strong>{h.team}</strong>
                      <time>
                        {/^\d{4}-/.test(h.time)
                          ? new Date(h.time).toLocaleDateString('en-GB', {
                              day: '2-digit',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : h.time}
                      </time>
                    </div>
                    <p className="step-action">{h.action}</p>
                    <small className="step-status">{h.status}</small>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Next Action Form */}
        <aside className="card next-action-card">
          <div className="action-card-head">
            <span className="action-round-icon">
              <Icon name="arrow" size={17} />
            </span>
            <div>
              <h2>Next Action</h2>
              <p>Route this task to the next owner.</p>
            </div>
          </div>

          <form onSubmit={submit} className="review-form">
            <label className="form-field">
              <span>Send To Department:</span>
              <select
                id="review-send-to"
                value={review.sendTo}
                onChange={e => setReview(v => ({ ...v, sendTo: e.target.value }))}
              >
                <option>CAMO review</option>
                <option>Maintenance</option>
                <option>Procurement</option>
                <option>Quality</option>
                <option>Flight Operations</option>
              </select>
            </label>

            <label className="form-field">
              <span>Target Due Date:</span>
              <input
                id="review-due"
                type="date"
                value={review.dueDate}
                onChange={e => setReview(v => ({ ...v, dueDate: e.target.value }))}
              />
            </label>

            <label className="form-field">
              <span>Handoff Note / Context:</span>
              <textarea
                id="review-note"
                rows={4}
                value={review.note}
                onChange={e => setReview(v => ({ ...v, note: e.target.value }))}
                placeholder="Add instructions or observations for the receiving team..."
              />
            </label>

            <div className="form-hint">
              <Icon name="check" size={14} /> Recorded in permanent compliance log.
            </div>

            <Button kind="primary full" type="submit" disabled={busy} id="btn-submit-review">
              {busy ? 'Routing...' : 'Send Review Request'}
              <Icon name="arrow" size={15} />
            </Button>
          </form>
        </aside>
      </div>
    </>
  );
}

function SpecItem({ label, children, wide = false }) {
  return (
    <div className={`spec-item ${wide ? 'wide' : ''}`}>
      <span className="spec-label">{label}</span>
      <div className="spec-val">{children}</div>
    </div>
  );
}

// -------------------------------------------------------------
// View 5: Confirmation View
// -------------------------------------------------------------
function ConfirmationView({ order, goDetail, goHome }) {
  return (
    <div className="confirm-page-wrap">
      <div className="confirm-icon-bubble">
        <Icon name="check" size={28} />
      </div>
      <h2>Review Request Recorded</h2>
      <p>
        Record <strong>{order?.id || 'Work order'}</strong> has been assigned to{' '}
        <strong>{order?.owner || 'CAMO review'}</strong>.
      </p>

      <div className="confirm-spec-card">
        <div className="confirm-spec-row">
          <span>Assigned Team</span>
          <strong>{order?.owner || 'CAMO review'}</strong>
        </div>
        <div className="confirm-spec-row">
          <span>New Status</span>
          <StatusBadge value={order?.status || 'Awaiting review'} />
        </div>
        <div className="confirm-spec-row">
          <span>Reference</span>
          <span className="ref-badge">{order?.id || '—'}</span>
        </div>
        <div className="confirm-spec-row">
          <span>Audit Log</span>
          <span>Request dispatched · Live</span>
        </div>
      </div>

      <div className="confirm-btn-row">
        <Button kind="primary" onClick={goDetail}>
          Return to Work Order
        </Button>
        <Button onClick={goHome}>Go to Analytics Dashboard</Button>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// View 6: Aircraft Fleet (Derived from Live Data)
// -------------------------------------------------------------
function AircraftFleetView({ orders, openOrder, create }) {
  const registrations = [...new Set(orders.map(o => o.aircraft))];

  return (
    <>
      <PageHeader
        title="Aircraft Fleet Directory"
        description="Comprehensive airworthiness oversight for all active fleet assets."
      >
        <Button kind="primary" icon="plus" onClick={create}>
          Raise Work Order
        </Button>
      </PageHeader>

      <div className="grid-three-col">
        {registrations.map(reg => {
          const list = orders.filter(o => o.aircraft === reg);
          const hasCrit = list.some(isApproval);
          return (
            <div className="card fleet-unit-card" key={reg}>
              <div className="card-head">
                <div className="unit-title">
                  <Icon name="plane" size={18} />
                  <h2>{reg}</h2>
                </div>
                <StatusBadge value={hasCrit ? 'Awaiting review' : 'Serviceable'} />
              </div>
              <div className="unit-body">
                <div className="unit-metric-row">
                  <div>
                    <span className="u-label">Active Work Orders</span>
                    <strong>{list.length}</strong>
                  </div>
                  <div>
                    <span className="u-label">Airworthiness</span>
                    <strong className="text-green">Serviceable</strong>
                  </div>
                </div>

                <div className="unit-tasks-list">
                  <span className="u-sub">CURRENT TASKS:</span>
                  {list.slice(0, 3).map(o => (
                    <button
                      key={o.id}
                      className="unit-task-link"
                      onClick={() => openOrder(o.id)}
                      type="button"
                    >
                      <span className="ref-badge">{o.id}</span>
                      <span className="u-task-name">{o.task}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

// -------------------------------------------------------------
// View 7: Purchase Requests (Connected to Live Orders Parts)
// -------------------------------------------------------------
function PurchaseRequestsView({ orders, openOrder, create }) {
  const partOrders = orders.filter(o => o.partRequest && o.partRequest !== '—');

  return (
    <>
      <PageHeader
        title="Purchase Requests & Spare Parts Tracking"
        description="Procurement requests tied directly to active maintenance work orders."
      >
        <Button kind="primary" icon="plus" onClick={create}>
          Request Part
        </Button>
      </PageHeader>

      <div className="card flush-card">
        <div className="card-head">
          <h2>Active Parts Requisitions</h2>
        </div>
        <div className="table-responsive">
          <table className="erp-table">
            <thead>
              <tr>
                <th>Part Description / Requisition</th>
                <th>Linked Work Order</th>
                <th>Target Aircraft</th>
                <th>Department</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {partOrders.length ? (
                partOrders.map(o => (
                  <tr key={o.id} onClick={() => openOrder(o.id)} className="click-row">
                    <td>
                      <strong>{o.partRequest}</strong>
                    </td>
                    <td>
                      <span className="ref-badge">{o.id}</span>
                    </td>
                    <td>{o.aircraft}</td>
                    <td>{o.owner}</td>
                    <td>
                      <StatusBadge value={o.status} />
                    </td>
                    <td>
                      <Icon name="chevronRight" size={15} />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6}>
                    <div className="table-empty">No active spare part requisitions.</div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

// -------------------------------------------------------------
// View 8: System Settings
// -------------------------------------------------------------
function SettingsView({ summary, refresh, lastSync }) {
  return (
    <>
      <PageHeader
        title="System Administration &amp; Gateway Settings"
        description="Configure runtime parameters, check Java REST API connection status, and review active ports."
      />

      <div className="grid-two-col">
        <section className="card">
          <div className="card-head">
            <h2>Connection Diagnostics</h2>
          </div>
          <div className="spec-grid">
            <SpecItem label="Node.js Gateway Port">4173 (HTTP Gateway)</SpecItem>
            <SpecItem label="Java Backend Service">Port Dynamic / 8081 fallback</SpecItem>
            <SpecItem label="Gateway Status">
              <StatusBadge value="Serviceable" />
            </SpecItem>
            <SpecItem label="Last Heartbeat">
              {lastSync ? lastSync.toLocaleTimeString() : 'Connected'}
            </SpecItem>
            <SpecItem label="Active Data Records" wide>
              {summary.openWorkOrders} Open Work Orders · {summary.waitingApprovals} Pending Approvals
            </SpecItem>
          </div>
          <div style={{ padding: '16px 20px', borderTop: '1px solid var(--line)' }}>
            <Button kind="secondary" icon="refresh" onClick={() => refresh(true)}>
              Test API Connection
            </Button>
          </div>
        </section>

        <section className="card">
          <div className="card-head">
            <h2>Operator Profile</h2>
          </div>
          <div className="spec-grid">
            <SpecItem label="Active Role">CAMO Maintenance Administrator</SpecItem>
            <SpecItem label="Assigned Organization">AVAJET Aviation ERP</SpecItem>
            <SpecItem label="Compliance Authority">DGCA / EASA CAMO Compliant</SpecItem>
            <SpecItem label="Audit Trail Logging">Enabled (Permanent)</SpecItem>
          </div>
        </section>
      </div>
    </>
  );
}

// -------------------------------------------------------------
// View 9: Notifications Panel
// -------------------------------------------------------------
function NotificationsView({ orders, openOrder }) {
  const alerts = orders.filter(o => isApproval(o) || /high|urgent/i.test(o.priority));

  return (
    <>
      <PageHeader
        title="Notifications &amp; Activity Stream"
        description="Real-time alerts, pending approvals, and inter-team communications."
      />

      <div className="card flush-card">
        <div className="card-head">
          <h2>Active Alerts ({alerts.length})</h2>
        </div>
        <div className="notifications-list">
          {alerts.length ? (
            alerts.map(o => (
              <div
                className="notif-row"
                key={o.id}
                onClick={() => openOrder(o.id)}
                role="button"
                tabIndex={0}
              >
                <span className="notif-badge-icon">
                  <Icon name="bell" size={16} />
                </span>
                <div className="notif-content">
                  <div className="notif-head">
                    <strong>
                      {o.aircraft} · {o.task}
                    </strong>
                    <StatusBadge value={o.status} />
                  </div>
                  <p>
                    Work Order {o.id} requires review. Current owner:{' '}
                    <strong>{o.owner}</strong>. Priority:{' '}
                    <span className={`priority-tag ${String(o.priority).toLowerCase()}`}>
                      {o.priority}
                    </span>
                  </p>
                  <small>{o.lastUpdated}</small>
                </div>
                <Icon name="chevronRight" size={15} />
              </div>
            ))
          ) : (
            <div className="card-empty-state">No unread notifications.</div>
          )}
        </div>
      </div>
    </>
  );
}

// -------------------------------------------------------------
// View 10: Standardized ERP Module Placeholder
// (Communicates prototype status clearly without broken links)
// -------------------------------------------------------------
function ModulePlaceholder({ moduleKey, goHome, goOrders }) {
  const meta = {
    'management-reports': {
      title: 'Executive Reports & Analytics',
      dept: 'Management',
      desc: 'Scheduled compliance reporting, fleet utilization, and CAMO audit summaries.',
      fields: ['Report Name', 'Period', 'Format', 'Generated By', 'Status'],
      samples: [
        ['Monthly Airworthiness Summary', 'March 2026', 'PDF / CSV', 'CAMO Office', 'Ready'],
        ['LLP & Component Life Forecast', 'Q1 2026', 'PDF', 'Chief Engineer', 'Ready'],
      ],
    },
    compliance: {
      title: 'Airworthiness Directives & Service Bulletins',
      dept: 'Engineering & Maintenance',
      desc: 'Regulatory compliance monitoring against FAA/EASA/DGCA mandatory directives.',
      fields: ['Directive Number', 'Subject', 'Aircraft Applicability', 'Due Hours / Date', 'Status'],
      samples: [
        ['AD 2026-04-11', 'Engine Fuel Pump Inspection', 'VT-AVA', '14,200 FH', 'Complied'],
        ['SB-AVA-732', 'Hydraulic Return Line Upgrade', 'VT-AVB', 'Next A-Check', 'Pending'],
      ],
    },
    'purchase-orders': {
      title: 'Purchase Orders',
      dept: 'Procurement & Inventory',
      desc: 'Formal purchase orders dispatched to certified aviation suppliers and MROs.',
      fields: ['PO Reference', 'Supplier', 'Items', 'Total Value', 'Status'],
      samples: [
        ['PO-2026-089', 'AeroParts International', 'Hydraulic Seals, Filters', '$4,850', 'Dispatched'],
        ['PO-2026-092', 'Turbine Component Specialists', 'Combustor Liner Kit', '$32,400', 'Approved'],
      ],
    },
    inventory: {
      title: 'Spare Parts & Consumables Inventory',
      dept: 'Procurement & Inventory',
      desc: 'Bin-level tracking of rotables, expendables, and FAA Form 8130-3 release certificates.',
      fields: ['Part Number', 'Description', 'Quantity In Stock', 'Location', 'Condition'],
      samples: [
        ['P/N 2-8041-1', 'Main Fuel Metering Valve', '2 EA', 'Bin A-14', 'Serviceable / Tagged'],
        ['P/N MF10-02-11', 'O-Ring Packing Kit', '48 EA', 'Bin C-03', 'New / Sealed'],
      ],
    },
    vendors: {
      title: 'Approved Suppliers & Vendors',
      dept: 'Procurement & Inventory',
      desc: 'Qualified aviation supplier register with ISO/AS9100 quality certificates.',
      fields: ['Vendor Code', 'Company Name', 'Rating', 'Approval Expiry', 'Status'],
      samples: [
        ['V-0014', 'Global Aero Logistics', 'Class A', 'Dec 2027', 'Approved'],
        ['V-0082', 'Aviation Hydraulics Ltd', 'Class A', 'Aug 2026', 'Approved'],
      ],
    },
    invoicing: {
      title: 'Customer & Charter Invoicing',
      dept: 'Finance & Accounting',
      desc: 'Direct invoicing for charter operations, line maintenance, and hangar services.',
      fields: ['Invoice ID', 'Client / Operator', 'Amount', 'Due Date', 'Status'],
      samples: [
        ['INV-4011', 'Apex Charters Ltd', '$18,400', '15 Apr 2026', 'Paid'],
        ['INV-4019', 'Titan Aero Leasing', '$42,100', '30 Apr 2026', 'Sent'],
      ],
    },
    accounts: {
      title: 'Accounts Payable & Receivable',
      dept: 'Finance & Accounting',
      desc: 'Reconciliation of supplier dues, maintenance credits, and client payments.',
      fields: ['Account Code', 'Description', 'Debits', 'Credits', 'Balance'],
      samples: [
        ['AC-200', 'Fuel & Ground Handling', '$8,400', '—', '$8,400 Payable'],
        ['AC-105', 'Maintenance Retainers', '—', '$14,000', '$14,000 Receivable'],
      ],
    },
    expenses: {
      title: 'Operational Expenses',
      dept: 'Finance & Accounting',
      desc: 'Direct trip costs, landing fees, overhaul allowances, and crew disbursements.',
      fields: ['Expense ID', 'Category', 'Flight / Order', 'Amount', 'Status'],
      samples: [
        ['EXP-912', 'Landing & Nav Fees', 'VT-AVA Flight 104', '$1,240', 'Reconciled'],
      ],
    },
    'financial-reports': {
      title: 'Financial Statements & P&L',
      dept: 'Finance & Accounting',
      desc: 'Operating margins per flight hour, maintenance cost allocation, and balance sheets.',
      fields: ['Statement', 'Quarter', 'Gross Revenue', 'EBITDA', 'Status'],
      samples: [
        ['Q1 Fleet Operations P&L', 'Q1 2026', '$1.42M', '22.4%', 'Audited'],
      ],
    },
    employees: {
      title: 'Engineers & Flight Crew Directory',
      dept: 'HR & Personnel',
      desc: 'AME license tracking, pilot endorsements, recurrent training certificates, and duty logs.',
      fields: ['Staff ID', 'Name', 'Designation / Rating', 'License Valid Until', 'Status'],
      samples: [
        ['ENG-04', 'Vikram Sen', 'Chief A&P Engineer (Cat B1)', 'Nov 2027', 'Active / Certified'],
        ['PLT-11', 'Capt. R. Sharma', 'Captain (Type Rated VT-AVA)', 'Aug 2026', 'Active / Certified'],
      ],
    },
    attendance: {
      title: 'Duty Logs & Shift Attendance',
      dept: 'HR & Personnel',
      desc: 'Hangar shifts, on-call AOG engineers, flight duty time limitations (FDTL).',
      fields: ['Employee', 'Shift', 'Duty Period', 'Hours', 'FDTL Status'],
      samples: [
        ['Vikram Sen', 'Line Maintenance Shift A', '08:00 - 17:00', '8.0 FH', 'Compliant'],
      ],
    },
    payroll: {
      title: 'Payroll & Allowances',
      dept: 'HR & Personnel',
      desc: 'Base pay, overtime for AOG recoveries, flight allowances, and statutory benefits.',
      fields: ['Payroll Period', 'Staff Count', 'Disbursements', 'Tax & Compliance', 'Status'],
      samples: [
        ['March 2026', '24 Personnel', 'Processed', 'DGCA/Tax Compliant', 'Settled'],
      ],
    },
    customers: {
      title: 'Customer & Owner Directory',
      dept: 'CRM & Customers',
      desc: 'Aircraft owners, private jet charter clients, and fractional leaseholders.',
      fields: ['Customer ID', 'Client Name', 'Aircraft Under Mgmt', 'Primary Contact', 'Status'],
      samples: [
        ['CUST-01', 'Zenith Aviation Holdings', 'VT-AVA, VT-AVB', 'dispatch@zenith.aero', 'Active'],
      ],
    },
    'charter-requests': {
      title: 'Charter Enquiries & Trip Requests',
      dept: 'CRM & Customers',
      desc: 'Flight requests, route feasibility, slot clearances, and aircraft matching.',
      fields: ['Trip ID', 'Route', 'Departure Date', 'Passengers', 'Feasibility'],
      samples: [
        ['TRIP-804', 'VABB → VIDP', '28 Apr 2026', '6 PAX', 'Confirmed / Slot OK'],
      ],
    },
    quotations: {
      title: 'Quotations & Charter Estimates',
      dept: 'CRM & Customers',
      desc: 'Charter flight pricing, hourly ferry costs, and maintenance tender bids.',
      fields: ['Quote Number', 'Client', 'Estimated Hours', 'Total Bid', 'Status'],
      samples: [
        ['QT-2026-14', 'Zenith Aviation', '4.2 FH', '$24,800', 'Accepted'],
      ],
    },
    'user-roles': {
      title: 'User Roles & Access Permissions',
      dept: 'System & Admin',
      desc: 'Role-based access control (RBAC), CAMO sign-off authority, and audit logging rights.',
      fields: ['Role', 'Description', 'Active Users', 'Sign-Off Authority', 'Access Level'],
      samples: [
        ['CAMO Manager', 'Full airworthiness sign-off', '2 Users', 'Authorized', 'Full Admin'],
        ['A&P Engineer', 'Work order execution & logs', '8 Users', 'Maintenance Only', 'Operational'],
      ],
    },
  }[moduleKey] || {
    title: 'Aviation ERP Module',
    dept: 'Enterprise Operations',
    desc: 'Integrated operations module for the AVAJET Aviation ERP.',
    fields: ['Item', 'Description', 'Reference', 'Status'],
    samples: [['Sample Record', 'Demonstration item', 'REF-001', 'Active']],
  };

  return (
    <div className="placeholder-module-wrap">
      <div className="breadcrumb-line">
        <span>{meta.dept}</span>
        <span className="crumb-sep">/</span>
        <strong>{meta.title}</strong>
      </div>

      <PageHeader title={meta.title} description={meta.desc}>
        <Button kind="secondary" icon="grid" onClick={goHome}>
          Go to Dashboard
        </Button>
        <Button kind="primary" icon="orders" onClick={goOrders}>
          View Live Work Orders
        </Button>
      </PageHeader>

      <div className="proto-notice-banner">
        <span className="proto-icon">
          <Icon name="info" size={20} />
        </span>
        <div className="proto-text">
          <strong>ERP Roadmap Preview</strong>
          <p>
            This module is part of the integrated AVAJET Aviation ERP architecture. The demonstrated data schema reflects the planned specification. Active maintenance workflows (Fleet Analytics, Work Orders, Approvals) are fully functional on the live Java REST API.
          </p>
        </div>
      </div>

      <div className="card flush-card">
        <div className="card-head">
          <h2>Data Schema &amp; Structure Preview</h2>
        </div>
        <div className="table-responsive">
          <table className="erp-table">
            <thead>
              <tr>
                {meta.fields.map((f, i) => (
                  <th key={i}>{f}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {meta.samples.map((row, rIdx) => (
                <tr key={rIdx}>
                  {row.map((col, cIdx) => (
                    <td key={cIdx}>
                      {cIdx === row.length - 1 ? <StatusBadge value={col} /> : col}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="table-footer-bar">
          <span>Prototype data model · API endpoints planned for Phase 2</span>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// Component: Empty State Page
// -------------------------------------------------------------
function EmptyView({ title, detail, action, actionLabel }) {
  return (
    <div className="empty-state-page">
      <span className="empty-round-icon">
        <Icon name="orders" size={26} />
      </span>
      <h2>{title}</h2>
      <p>{detail}</p>
      <Button kind="primary" onClick={action}>
        {actionLabel}
      </Button>
    </div>
  );
}

// -------------------------------------------------------------
// Component: Create Work Order Modal
// -------------------------------------------------------------
function CreateModal({ form, setForm, close, submit, busy }) {
  const set = (key, value) => setForm(v => ({ ...v, [key]: value }));

  return (
    <div
      className="modal-backdrop"
      onMouseDown={e => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <section className="modal-dialog" role="dialog" aria-modal="true" aria-labelledby="create-wo-title">
        <div className="modal-head">
          <div>
            <div className="eyebrow">NEW RECORD</div>
            <h2 id="create-wo-title">Create Work Order</h2>
            <p>Initiate an official maintenance work order linked to the live Java service.</p>
          </div>
          <button className="icon-button" onClick={close} aria-label="Close modal">
            <Icon name="close" size={17} />
          </button>
        </div>

        <form onSubmit={submit} className="modal-form">
          <label className="form-field">
            <span>Aircraft Registration *</span>
            <input
              id="new-aircraft"
              required
              value={form.aircraft}
              onChange={e => set('aircraft', e.target.value)}
              placeholder="e.g. VT-AVA, VT-AVB"
            />
          </label>

          <label className="form-field">
            <span>Task Description *</span>
            <input
              id="new-task"
              required
              value={form.task}
              onChange={e => set('task', e.target.value)}
              placeholder="e.g. Inspect fuel nozzle assembly"
            />
          </label>

          <div className="form-two-col">
            <label className="form-field">
              <span>Initial Department</span>
              <select id="new-owner" value={form.owner} onChange={e => set('owner', e.target.value)}>
                <option>CAMO</option>
                <option>Maintenance</option>
                <option>Procurement</option>
                <option>Quality</option>
              </select>
            </label>

            <label className="form-field">
              <span>Priority</span>
              <select id="new-priority" value={form.priority} onChange={e => set('priority', e.target.value)}>
                <option>Routine</option>
                <option>High</option>
                <option>Urgent</option>
              </select>
            </label>
          </div>

          <label className="form-field">
            <span>
              Linked Part Request <small>(Optional)</small>
            </span>
            <input
              id="new-part"
              value={form.partRequest}
              onChange={e => set('partRequest', e.target.value)}
              placeholder="e.g. PR-0422 · O-Ring Seal Kit"
            />
          </label>

          <div className="modal-action-bar">
            <Button onClick={close}>Cancel</Button>
            <Button kind="primary" type="submit" disabled={busy} id="btn-modal-submit">
              {busy ? 'Creating...' : 'Create Work Order'}
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}
