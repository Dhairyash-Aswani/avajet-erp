import React, { useState, useMemo } from 'react';

// =========================================================================
// Helper: Generic Prototype Modal
// =========================================================================
function ProtoModal({ title, subtitle, onClose, children }) {
  return (
    <div className="modal-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
      <section className="modal-dialog" role="dialog" aria-modal="true">
        <div className="modal-head">
          <div>
            <div className="eyebrow">OPERATIONAL ACTION</div>
            <h2>{title}</h2>
            {subtitle && <p>{subtitle}</p>}
          </div>
          <button className="icon-button" onClick={onClose} aria-label="Close modal">✕</button>
        </div>
        {children}
      </section>
    </div>
  );
}

const DefaultBtn = ({ children, kind, onClick, type = 'button', icon, ...props }) => (
  <button type={type} className={`btn ${kind ? `btn-${kind}` : ''}`} onClick={onClick} {...props}>
    {children}
  </button>
);

// Helper: Download a generated CSV file
function downloadCSV(filename, headers, rows) {
  const content = [headers, ...rows]
    .map(r => r.map(v => `"${String(v ?? '').replace(/"/g, '""')}"`).join(','))
    .join('\r\n');
  const blob = new Blob(['\ufeff' + content], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// =========================================================================
// 1. Management: Reports & Analytics
// =========================================================================
export function ManagementReportsView({ openOrder, nav, setToast = () => {}, Icon, StatusBadge, Button = DefaultBtn, PageHeader, Card, KpiCard }) {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [inspectReport, setInspectReport] = useState(null);
  const [form, setForm] = useState({ name: '', cat: 'CAMO', format: 'PDF & CSV', period: 'Current Month' });
  const [reports, setReports] = useState([
    { id: 'REP-101', name: 'Monthly Fleet Airworthiness & AD Audit', cat: 'CAMO', format: 'PDF & CSV', period: 'Current Month', status: 'Serviceable', genDate: 'Today, 06:00', rows: 42 },
    { id: 'REP-102', name: 'Component Hard-Time & LLP Life Limit Summary', cat: 'Technical', format: 'PDF', period: 'Q1 2026', status: 'Serviceable', genDate: 'Yesterday', rows: 18 },
    { id: 'REP-103', name: 'Tech Log Defect Rectification & Pilot Reports', cat: 'Operations', format: 'Excel', period: 'Last 30 Days', status: 'Serviceable', genDate: '20 Apr 2026', rows: 64 },
    { id: 'REP-104', name: 'Scheduled vs Unscheduled AOG Downtime Analysis', cat: 'Management', format: 'PDF', period: 'YTD 2026', status: 'Serviceable', genDate: '18 Apr 2026', rows: 12 },
    { id: 'REP-105', name: 'Line Maintenance Fuel & Consumables Variance', cat: 'Technical', format: 'Excel', period: 'Current Month', status: 'In progress', genDate: 'Generating...', rows: 29 },
  ]);

  const filtered = reports.filter(r => {
    const matchCat = filter === 'All' || r.cat === filter;
    const matchSearch = !search || r.name.toLowerCase().includes(search.toLowerCase()) || r.id.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleGenerate = e => {
    e.preventDefault();
    if (!form.name.trim()) return;
    const newId = `REP-${100 + reports.length + 1}`;
    const newReport = {
      id: newId,
      name: form.name.trim(),
      cat: form.cat,
      format: form.format,
      period: form.period,
      status: 'Serviceable',
      genDate: 'Just now',
      rows: Math.floor(15 + Math.random() * 50),
    };
    setReports([newReport, ...reports]);
    setModalOpen(false);
    setForm({ name: '', cat: 'CAMO', format: 'PDF & CSV', period: 'Current Month' });
    setToast(`${newId} generated and ready for export`);
  };

  const handleDownload = r => {
    downloadCSV(
      `${r.id}-${r.name.replace(/[^a-zA-Z0-9]/g, '_')}.csv`,
      ['Report ID', 'Title', 'Category', 'Period', 'Sample Value 1', 'Sample Value 2', 'Status'],
      [
        [r.id, r.name, r.cat, r.period, 'VT-AVA Metric', 'Complied', 'Serviceable'],
        [r.id, r.name, r.cat, r.period, 'VT-AVB Metric', 'Complied', 'Serviceable'],
        [r.id, r.name, r.cat, r.period, 'VT-AVC Metric', 'In Progress', 'Action Due'],
      ]
    );
    setToast(`Downloaded ${r.id} (${r.format})`);
  };

  const handleDelete = id => {
    setReports(reports.filter(r => r.id !== id));
    setToast(`Deleted ${id}`);
    if (inspectReport?.id === id) setInspectReport(null);
  };

  return (
    <>
      <PageHeader title="Executive Reports & Analytics" description="Automated airworthiness reports, compliance audit exports, and reliability statistics.">
        <Button kind="primary" icon="plus" onClick={() => setModalOpen(true)}>Generate New Report</Button>
      </PageHeader>

      <section className="kpi-strip">
        <KpiCard label="Reports Generated" value={reports.length} note="Ready for Download" />
        <KpiCard label="Scheduled Runs" value="4 Active" note="Automated Dispatch" />
        <KpiCard label="Fleet Compliance" value="99.4%" note="DGCA CAR M Standard" />
        <KpiCard label="Audit Readiness" value="100%" note="Permanent Logs" />
      </section>

      <div className="card flush-card">
        <div className="table-filter-bar">
          <label className="filter-search-box">
            <Icon name="search" size={15} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Filter reports by name or ID..." />
          </label>
          <div className="filter-tabs">
            {['All', 'CAMO', 'Technical', 'Operations', 'Management'].map(c => (
              <button key={c} className={`tab-btn ${filter === c ? 'active' : ''}`} onClick={() => setFilter(c)}>{c}</button>
            ))}
          </div>
        </div>

        <div className="table-responsive">
          <table className="erp-table">
            <thead>
              <tr>
                <th>Report ID</th>
                <th>Report Title</th>
                <th>Category</th>
                <th>Format</th>
                <th>Period</th>
                <th>Generated</th>
                <th>Status</th>
                <th className="th-action">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.id} onClick={() => setInspectReport(r)} className="click-row">
                  <td><span className="ref-badge">{r.id}</span></td>
                  <td><strong>{r.name}</strong></td>
                  <td>{r.cat}</td>
                  <td>{r.format}</td>
                  <td>{r.period}</td>
                  <td>{r.genDate}</td>
                  <td><StatusBadge value={r.status} /></td>
                  <td className="cell-action" onClick={e => e.stopPropagation()}>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button className="row-open-btn" title="Download report" onClick={() => handleDownload(r)}>
                        <Icon name="download" size={14} />
                      </button>
                      <button className="row-open-btn" title="Delete report" onClick={() => handleDelete(r.id)} style={{ color: 'var(--red)' }}>
                        ✕
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Generate Report */}
      {modalOpen && (
        <ProtoModal title="Generate Aviation Report" subtitle="Select audit parameters and compilation format" onClose={() => setModalOpen(false)}>
          <form onSubmit={handleGenerate} className="modal-form">
            <label className="form-field">
              <span>Report Title *</span>
              <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Q1 Engine Hot Section Trend Analysis" />
            </label>
            <div className="form-two-col">
              <label className="form-field">
                <span>Category</span>
                <select value={form.cat} onChange={e => setForm({ ...form, cat: e.target.value })}>
                  <option>CAMO</option>
                  <option>Technical</option>
                  <option>Operations</option>
                  <option>Management</option>
                </select>
              </label>
              <label className="form-field">
                <span>Export Format</span>
                <select value={form.format} onChange={e => setForm({ ...form, format: e.target.value })}>
                  <option>PDF & CSV</option>
                  <option>PDF Only</option>
                  <option>Excel (.xlsx)</option>
                </select>
              </label>
            </div>
            <label className="form-field">
              <span>Time Period</span>
              <select value={form.period} onChange={e => setForm({ ...form, period: e.target.value })}>
                <option>Current Month</option>
                <option>Q1 2026</option>
                <option>Last 30 Days</option>
                <option>YTD 2026</option>
                <option>Full Year 2025</option>
              </select>
            </label>
            <div className="modal-action-bar">
              <Button onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button kind="primary" type="submit">Compile & Generate</Button>
            </div>
          </form>
        </ProtoModal>
      )}

      {/* Modal: Inspect Report Details */}
      {inspectReport && (
        <ProtoModal title={inspectReport.name} subtitle={`Reference: ${inspectReport.id} · Category: ${inspectReport.cat}`} onClose={() => setInspectReport(null)}>
          <div style={{ display: 'grid', gap: '14px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', background: '#F8FAFC', padding: '12px 14px', borderRadius: '8px' }}>
              <div><small style={{ color: 'var(--muted)' }}>Period:</small> <strong>{inspectReport.period}</strong></div>
              <div><small style={{ color: 'var(--muted)' }}>Format:</small> <strong>{inspectReport.format}</strong></div>
              <div><small style={{ color: 'var(--muted)' }}>Compiled:</small> <strong>{inspectReport.genDate}</strong></div>
              <div><small style={{ color: 'var(--muted)' }}>Records Analyzed:</small> <strong>{inspectReport.rows} items</strong></div>
            </div>
            <p style={{ fontSize: '12.5px', color: '#4A5E72', margin: 0 }}>
              This report compiles verified telemetry, pilot tech logs, and open CAMO maintenance orders for regulatory compliance.
            </p>
            <div className="modal-action-bar">
              <Button onClick={() => setInspectReport(null)}>Close</Button>
              <Button kind="primary" icon="download" onClick={() => handleDownload(inspectReport)}>Download File</Button>
            </div>
          </div>
        </ProtoModal>
      )}
    </>
  );
}

// =========================================================================
// 2. Engineering: Compliance & Documents (AD & SB Tracking)
// =========================================================================
export function ComplianceView({ openOrder, setToast = () => {}, Icon, StatusBadge, Button = DefaultBtn, PageHeader, Card, KpiCard }) {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [inspectDirective, setInspectDirective] = useState(null);
  const [form, setForm] = useState({ id: '', type: 'AD', ata: 'ATA 28', title: '', aircraft: 'VT-AVA', due: '', authority: 'FAA / DGCA' });
  const [directives, setDirectives] = useState([
    { id: 'AD-2026-04-11', type: 'AD', ata: 'ATA 28', title: 'Engine Fuel Pump Filter Assembly Inspection', aircraft: 'VT-AVA', due: '14,200 FH (in 120 FH)', status: 'Awaiting review', authority: 'FAA / DGCA', notes: 'Ultrasonic inspection required before flight cycle limit.' },
    { id: 'AD-2026-02-08', type: 'AD', ata: 'ATA 32', title: 'Main Landing Gear Actuator Pin Ultrasonic Check', aircraft: 'VT-AVB', due: '28 May 2026', status: 'Complied', authority: 'EASA / DGCA', notes: 'Task signed off in Tech Log Book 4, Page 12.' },
    { id: 'SB-AVA-732', type: 'SB', ata: 'ATA 29', title: 'Hydraulic Return Line Flexible Hose Upgrade', aircraft: 'VT-AVC', due: 'Next A-Check', status: 'In progress', authority: 'OEM Service Bulletin', notes: 'Replacement kit P/N 2-8041-1 dispatched.' },
    { id: 'AD-2025-11-04', type: 'AD', ata: 'ATA 24', title: 'AC Generator Electrical Terminal Torque Verification', aircraft: 'VT-AVA', due: 'Completed', status: 'Complied', authority: 'FAA / DGCA', notes: 'Torque values verified at 42 in-lbs.' },
    { id: 'SB-AVA-804', type: 'SB', ata: 'ATA 34', title: 'TCAS II Version 7.1 Software Certification', aircraft: 'Fleet Wide', due: '15 Jun 2026', status: 'Waiting', authority: 'Mandatory Ops', notes: 'Software load scheduled during overnight maintenance.' },
  ]);

  const filtered = directives.filter(d => {
    const matchType = filter === 'All' || d.type === filter || (filter === 'Action Due' && d.status !== 'Complied');
    const matchSearch = !search || d.id.toLowerCase().includes(search.toLowerCase()) || d.title.toLowerCase().includes(search.toLowerCase()) || d.aircraft.toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  const handleAdd = e => {
    e.preventDefault();
    if (!form.id.trim() || !form.title.trim()) return;
    const newEntry = {
      id: form.id.trim(),
      type: form.type,
      ata: form.ata,
      title: form.title.trim(),
      aircraft: form.aircraft,
      due: form.due || 'Next Inspection',
      authority: form.authority,
      status: 'Awaiting review',
      notes: 'Logged into CAMO compliance tracking system.',
    };
    setDirectives([newEntry, ...directives]);
    setModalOpen(false);
    setForm({ id: '', type: 'AD', ata: 'ATA 28', title: '', aircraft: 'VT-AVA', due: '', authority: 'FAA / DGCA' });
    setToast(`Logged ${newEntry.id} into compliance register`);
  };

  const toggleStatus = (id, newStatus) => {
    setDirectives(directives.map(d => d.id === id ? { ...d, status: newStatus } : d));
    setToast(`Updated ${id} to ${newStatus}`);
    if (inspectDirective?.id === id) {
      setInspectDirective({ ...inspectDirective, status: newStatus });
    }
  };

  return (
    <>
      <PageHeader title="Airworthiness Directives & Service Bulletins" description="FAA, EASA, and DGCA mandatory regulatory compliance records and status verification.">
        <Button kind="primary" icon="plus" onClick={() => setModalOpen(true)}>Log New Directive</Button>
      </PageHeader>

      <section className="kpi-strip">
        <KpiCard label="Total Tracked Directives" value={directives.length} note="Active Fleet" />
        <KpiCard label="Complied Records" value={directives.filter(d => d.status === 'Complied').length} note="Verified Signed Off" />
        <KpiCard label="Action Required" value={directives.filter(d => d.status !== 'Complied').length} note="Due / In Review" tone="warn" />
        <KpiCard label="Authority Standard" value="DGCA CAR M" note="Audited Compliance" />
      </section>

      <div className="card flush-card">
        <div className="table-filter-bar">
          <label className="filter-search-box">
            <Icon name="search" size={15} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search AD/SB number, ATA chapter, or tail..." />
          </label>
          <div className="filter-tabs">
            {['All', 'AD', 'SB', 'Action Due'].map(f => (
              <button key={f} className={`tab-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>{f}</button>
            ))}
          </div>
        </div>

        <div className="table-responsive">
          <table className="erp-table">
            <thead>
              <tr>
                <th>Directive Number</th>
                <th>Type</th>
                <th>ATA Chapter</th>
                <th>Description / Scope</th>
                <th>Aircraft</th>
                <th>Compliance Limit</th>
                <th>Authority</th>
                <th>Status</th>
                <th className="th-action">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(d => (
                <tr key={d.id} onClick={() => setInspectDirective(d)} className="click-row">
                  <td><span className="ref-badge">{d.id}</span></td>
                  <td><strong>{d.type}</strong></td>
                  <td>{d.ata}</td>
                  <td><strong>{d.title}</strong></td>
                  <td><span className="tail-tag">{d.aircraft}</span></td>
                  <td>{d.due}</td>
                  <td>{d.authority}</td>
                  <td><StatusBadge value={d.status === 'Complied' ? 'Serviceable' : d.status} /></td>
                  <td className="cell-action" onClick={e => e.stopPropagation()}>
                    <Button kind="text" onClick={() => toggleStatus(d.id, d.status === 'Complied' ? 'Awaiting review' : 'Complied')}>
                      {d.status === 'Complied' ? 'Reopen' : 'Sign Off'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Log Directive */}
      {modalOpen && (
        <ProtoModal title="Log Airworthiness Directive / SB" subtitle="Enter regulatory mandating authority and compliance scope" onClose={() => setModalOpen(false)}>
          <form onSubmit={handleAdd} className="modal-form">
            <div className="form-two-col">
              <label className="form-field">
                <span>Directive Reference *</span>
                <input required value={form.id} onChange={e => setForm({ ...form, id: e.target.value })} placeholder="e.g. AD-2026-05-18" />
              </label>
              <label className="form-field">
                <span>Type</span>
                <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                  <option>AD</option>
                  <option>SB</option>
                  <option>Emergency AD</option>
                </select>
              </label>
            </div>
            <label className="form-field">
              <span>Directive Title / Subject *</span>
              <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Flap Actuator Ball Screw Inspection" />
            </label>
            <div className="form-two-col">
              <label className="form-field">
                <span>ATA Chapter</span>
                <input value={form.ata} onChange={e => setForm({ ...form, ata: e.target.value })} placeholder="e.g. ATA 27" />
              </label>
              <label className="form-field">
                <span>Applicable Aircraft</span>
                <select value={form.aircraft} onChange={e => setForm({ ...form, aircraft: e.target.value })}>
                  <option>VT-AVA</option>
                  <option>VT-AVB</option>
                  <option>VT-AVC</option>
                  <option>Fleet Wide</option>
                </select>
              </label>
            </div>
            <div className="form-two-col">
              <label className="form-field">
                <span>Compliance Limit / Date</span>
                <input value={form.due} onChange={e => setForm({ ...form, due: e.target.value })} placeholder="e.g. In 150 FH or 30 Jun 2026" />
              </label>
              <label className="form-field">
                <span>Issuing Authority</span>
                <select value={form.authority} onChange={e => setForm({ ...form, authority: e.target.value })}>
                  <option>FAA / DGCA</option>
                  <option>EASA / DGCA</option>
                  <option>OEM Service Bulletin</option>
                </select>
              </label>
            </div>
            <div className="modal-action-bar">
              <Button onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button kind="primary" type="submit">Log Directive</Button>
            </div>
          </form>
        </ProtoModal>
      )}

      {/* Modal: Inspect Directive */}
      {inspectDirective && (
        <ProtoModal title={inspectDirective.id} subtitle={inspectDirective.title} onClose={() => setInspectDirective(null)}>
          <div style={{ display: 'grid', gap: '14px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', background: '#F8FAFC', padding: '12px 14px', borderRadius: '8px' }}>
              <div><small style={{ color: 'var(--muted)' }}>Applicable Tail:</small> <strong>{inspectDirective.aircraft}</strong></div>
              <div><small style={{ color: 'var(--muted)' }}>ATA Chapter:</small> <strong>{inspectDirective.ata}</strong></div>
              <div><small style={{ color: 'var(--muted)' }}>Compliance Deadline:</small> <strong>{inspectDirective.due}</strong></div>
              <div><small style={{ color: 'var(--muted)' }}>Authority:</small> <strong>{inspectDirective.authority}</strong></div>
            </div>
            <div>
              <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--muted)' }}>Compliance Notes:</span>
              <p style={{ margin: '4px 0', fontSize: '13px', color: 'var(--ink)' }}>{inspectDirective.notes}</p>
            </div>
            <div className="modal-action-bar" style={{ justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <Button kind={inspectDirective.status === 'Complied' ? 'secondary' : 'primary'} onClick={() => toggleStatus(inspectDirective.id, 'Complied')}>
                  ✓ Mark as Complied
                </Button>
                <Button kind={inspectDirective.status === 'In progress' ? 'secondary' : 'outline-red'} onClick={() => toggleStatus(inspectDirective.id, 'In progress')}>
                  Mark In Progress
                </Button>
              </div>
              <Button onClick={() => setInspectDirective(null)}>Close</Button>
            </div>
          </div>
        </ProtoModal>
      )}
    </>
  );
}

// =========================================================================
// 3. Procurement: Purchase Orders
// =========================================================================
export function PurchaseOrdersView({ setToast = () => {}, Icon, StatusBadge, Button = DefaultBtn, PageHeader, Card, KpiCard }) {
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [inspectPO, setInspectPO] = useState(null);
  const [form, setForm] = useState({ vendor: 'AeroParts International', items: '', aircraft: 'VT-AVA', val: '', eta: '' });
  const [orders, setOrders] = useState([
    { id: 'PO-2026-089', vendor: 'AeroParts International', items: 'Hydraulic Seals (x4), O-Rings (x20)', aircraft: 'VT-AVA', val: '$4,850', date: '21 Apr 2026', eta: '25 Apr 2026', status: 'In progress' },
    { id: 'PO-2026-092', vendor: 'Turbine Component Specialists', items: 'Combustor Liner Inspection Kit', aircraft: 'VT-AVB', val: '$32,400', date: '19 Apr 2026', eta: '02 May 2026', status: 'Awaiting review' },
    { id: 'PO-2026-077', vendor: 'Global Aviation Avionics Ltd', items: 'TCAS Processor LRU Unit', aircraft: 'VT-AVC', val: '$18,900', date: '14 Apr 2026', eta: 'Delivered', status: 'Serviceable' },
    { id: 'PO-2026-081', vendor: 'Honeywell Aerospace Support', items: 'APU Fuel Control Solenoid', aircraft: 'VT-AVA', val: '$7,200', date: '16 Apr 2026', eta: '28 Apr 2026', status: 'In progress' },
  ]);

  const filtered = orders.filter(o => !search || o.id.toLowerCase().includes(search.toLowerCase()) || o.vendor.toLowerCase().includes(search.toLowerCase()) || o.items.toLowerCase().includes(search.toLowerCase()));

  const handleCreate = e => {
    e.preventDefault();
    if (!form.items.trim()) return;
    const id = `PO-2026-0${93 + orders.length}`;
    const newPO = {
      id,
      vendor: form.vendor,
      items: form.items.trim(),
      aircraft: form.aircraft,
      val: form.val ? `$${form.val.replace('$', '')}` : '$3,200',
      date: 'Today',
      eta: form.eta || 'In 7 days',
      status: 'Awaiting review',
    };
    setOrders([newPO, ...orders]);
    setModalOpen(false);
    setForm({ vendor: 'AeroParts International', items: '', aircraft: 'VT-AVA', val: '', eta: '' });
    setToast(`${id} dispatched for authorization`);
  };

  const updatePOStatus = (id, newStatus) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status: newStatus } : o));
    setToast(`Updated ${id} status to ${newStatus}`);
    if (inspectPO?.id === id) setInspectPO({ ...inspectPO, status: newStatus });
  };

  return (
    <>
      <PageHeader title="Purchase Orders &amp; Procurement" description="Track aviation supplier purchase orders, rotable component acquisitions, and delivery ETAs.">
        <Button kind="primary" icon="plus" onClick={() => setModalOpen(true)}>Create Purchase Order</Button>
      </PageHeader>

      <section className="kpi-strip">
        <KpiCard label="Open Commitments" value={`$${orders.reduce((acc, o) => acc + parseInt(o.val.replace(/[^0-9]/g, '') || 0), 0).toLocaleString()}`} note="Total PO Value" />
        <KpiCard label="Awaiting Approval" value={orders.filter(o => o.status === 'Awaiting review').length} note="Pending Sign-Off" tone="warn" />
        <KpiCard label="In Transit" value={orders.filter(o => o.status === 'In progress').length} note="Dispatched" />
        <KpiCard label="Delivered" value={orders.filter(o => o.status === 'Serviceable').length} note="Received in Hangar" />
      </section>

      <div className="card flush-card">
        <div className="table-filter-bar">
          <label className="filter-search-box">
            <Icon name="search" size={15} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Filter PO number, supplier, or items..." />
          </label>
        </div>

        <div className="table-responsive">
          <table className="erp-table">
            <thead>
              <tr>
                <th>PO Number</th>
                <th>Supplier / Vendor</th>
                <th>Requisition Details</th>
                <th>Aircraft</th>
                <th>Total Value</th>
                <th>Issued</th>
                <th>Target ETA</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(o => (
                <tr key={o.id} onClick={() => setInspectPO(o)} className="click-row">
                  <td><span className="ref-badge">{o.id}</span></td>
                  <td><strong>{o.vendor}</strong></td>
                  <td>{o.items}</td>
                  <td><span className="tail-tag">{o.aircraft}</span></td>
                  <td><strong>{o.val}</strong></td>
                  <td>{o.date}</td>
                  <td>{o.eta}</td>
                  <td><StatusBadge value={o.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Create PO */}
      {modalOpen && (
        <ProtoModal title="Create Purchase Order" subtitle="Dispatched to certified aviation parts suppliers" onClose={() => setModalOpen(false)}>
          <form onSubmit={handleCreate} className="modal-form">
            <div className="form-two-col">
              <label className="form-field">
                <span>Vendor / Supplier</span>
                <select value={form.vendor} onChange={e => setForm({ ...form, vendor: e.target.value })}>
                  <option>AeroParts International</option>
                  <option>Turbine Component Specialists</option>
                  <option>Global Aviation Avionics Ltd</option>
                  <option>Honeywell Aerospace Support</option>
                  <option>Dallas Airmotive Supplies</option>
                </select>
              </label>
              <label className="form-field">
                <span>Target Aircraft</span>
                <select value={form.aircraft} onChange={e => setForm({ ...form, aircraft: e.target.value })}>
                  <option>VT-AVA</option>
                  <option>VT-AVB</option>
                  <option>VT-AVC</option>
                  <option>General Stock</option>
                </select>
              </label>
            </div>
            <label className="form-field">
              <span>Items / Part Numbers *</span>
              <input required value={form.items} onChange={e => setForm({ ...form, items: e.target.value })} placeholder="e.g. Fuel Pump Seal Kit (x2), Filter Element" />
            </label>
            <div className="form-two-col">
              <label className="form-field">
                <span>Estimated Value ($) *</span>
                <input required value={form.val} onChange={e => setForm({ ...form, val: e.target.value })} placeholder="e.g. 5200" />
              </label>
              <label className="form-field">
                <span>Delivery ETA</span>
                <input value={form.eta} onChange={e => setForm({ ...form, eta: e.target.value })} placeholder="e.g. 05 May 2026" />
              </label>
            </div>
            <div className="modal-action-bar">
              <Button onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button kind="primary" type="submit">Authorize & Dispatch PO</Button>
            </div>
          </form>
        </ProtoModal>
      )}

      {/* Modal: Inspect PO */}
      {inspectPO && (
        <ProtoModal title={inspectPO.id} subtitle={`Vendor: ${inspectPO.vendor}`} onClose={() => setInspectPO(null)}>
          <div style={{ display: 'grid', gap: '14px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', background: '#F8FAFC', padding: '12px 14px', borderRadius: '8px' }}>
              <div><small style={{ color: 'var(--muted)' }}>Value:</small> <strong>{inspectPO.val}</strong></div>
              <div><small style={{ color: 'var(--muted)' }}>Allocated To:</small> <strong>{inspectPO.aircraft}</strong></div>
              <div><small style={{ color: 'var(--muted)' }}>Issued Date:</small> <strong>{inspectPO.date}</strong></div>
              <div><small style={{ color: 'var(--muted)' }}>Delivery ETA:</small> <strong>{inspectPO.eta}</strong></div>
            </div>
            <div>
              <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--muted)' }}>Requisition Details:</span>
              <p style={{ margin: '4px 0', fontSize: '13px', color: 'var(--ink)' }}>{inspectPO.items}</p>
            </div>
            <div className="modal-action-bar" style={{ justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: '6px' }}>
                <Button kind="primary" onClick={() => updatePOStatus(inspectPO.id, 'Serviceable')}>Receive into Stock</Button>
                <Button kind="secondary" onClick={() => updatePOStatus(inspectPO.id, 'In progress')}>Mark In Transit</Button>
              </div>
              <Button onClick={() => setInspectPO(null)}>Close</Button>
            </div>
          </div>
        </ProtoModal>
      )}
    </>
  );
}

// =========================================================================
// 4. Procurement: Inventory & Spare Parts
// =========================================================================
export function InventoryView({ setToast = () => {}, Icon, StatusBadge, Button = DefaultBtn, PageHeader, Card, KpiCard }) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [inspectPart, setInspectPart] = useState(null);
  const [form, setForm] = useState({ pn: '', desc: '', ata: 'ATA 29', bin: 'Bin A-01', qty: 2, min: 1, cost: '1200', condition: 'Serviceable / Tagged' });
  const [parts, setParts] = useState([
    { pn: 'P/N 2-8041-1', desc: 'Main Fuel Metering Valve (Rotable)', ata: 'ATA 73', bin: 'Hangar Rack A-12', qty: 2, min: 1, cost: '$8,400', condition: 'Serviceable / Tagged' },
    { pn: 'P/N MF10-02-11', desc: 'Hydraulic O-Ring Pack (Expendable)', ata: 'ATA 29', bin: 'Bin C-04', qty: 42, min: 20, cost: '$45', condition: 'New / Sealed' },
    { pn: 'P/N 2-8020-28', desc: 'Emergency Fuel Shutoff Actuator', ata: 'ATA 28', bin: 'Rack B-08', qty: 1, min: 1, cost: '$6,200', condition: 'Serviceable / Tagged' },
    { pn: 'P/N 40-128-01', desc: 'Main Landing Gear Brake Assembly', ata: 'ATA 32', bin: 'Heavy Bay 2', qty: 1, min: 2, cost: '$14,500', condition: 'Overhaul Required' },
    { pn: 'P/N AV-304-X', desc: 'Pitot Static Probe Heating Element', ata: 'ATA 34', bin: 'Bin E-11', qty: 4, min: 2, cost: '$1,150', condition: 'Serviceable / Tagged' },
  ]);

  const filtered = parts.filter(p => {
    const matchCat = filter === 'All' || (filter === 'Rotable' && p.desc.includes('Rotable')) || (filter === 'Alert' && p.qty <= p.min);
    const matchSearch = !search || p.pn.toLowerCase().includes(search.toLowerCase()) || p.desc.toLowerCase().includes(search.toLowerCase()) || p.bin.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleAddPart = e => {
    e.preventDefault();
    if (!form.pn.trim()) return;
    const newPart = {
      pn: form.pn.trim(),
      desc: form.desc.trim(),
      ata: form.ata,
      bin: form.bin,
      qty: Number(form.qty) || 1,
      min: Number(form.min) || 1,
      cost: `$${String(form.cost).replace('$', '')}`,
      condition: form.condition,
    };
    setParts([newPart, ...parts]);
    setModalOpen(false);
    setForm({ pn: '', desc: '', ata: 'ATA 29', bin: 'Bin A-01', qty: 2, min: 1, cost: '1200', condition: 'Serviceable / Tagged' });
    setToast(`Added ${newPart.pn} to inventory`);
  };

  const adjustQty = (pn, delta) => {
    setParts(parts.map(p => {
      if (p.pn === pn) {
        const nextQty = Math.max(0, p.qty + delta);
        if (inspectPart?.pn === pn) setInspectPart({ ...inspectPart, qty: nextQty });
        return { ...p, qty: nextQty };
      }
      return p;
    }));
    setToast(`Stock updated for ${pn}`);
  };

  return (
    <>
      <PageHeader title="Spare Parts &amp; Consumables Inventory" description="Bin-level rotables tracking, FAA 8130-3 release tags, and automated min-stock thresholds.">
        <Button kind="primary" icon="plus" onClick={() => setModalOpen(true)}>Add Part to Inventory</Button>
      </PageHeader>

      <section className="kpi-strip">
        <KpiCard label="Total Catalog SKUs" value={parts.length} note="Active Inventory" />
        <KpiCard label="Low Stock Warning" value={parts.filter(p => p.qty <= p.min).length} note="Reorder Threshold" tone="warn" />
        <KpiCard label="Total Stock Valuation" value={`$${parts.reduce((acc, p) => acc + (p.qty * parseInt(p.cost.replace(/[^0-9]/g, '') || 0)), 0).toLocaleString()}`} note="Audited Asset Value" />
        <KpiCard label="Condition Standard" value="FAA / EASA" note="Release Tagged" />
      </section>

      <div className="card flush-card">
        <div className="table-filter-bar">
          <label className="filter-search-box">
            <Icon name="search" size={15} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search part number, description, bin location..." />
          </label>
          <div className="filter-tabs">
            {['All', 'Rotable', 'Alert'].map(f => (
              <button key={f} className={`tab-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>{f}</button>
            ))}
          </div>
        </div>

        <div className="table-responsive">
          <table className="erp-table">
            <thead>
              <tr>
                <th>Part Number</th>
                <th>Description</th>
                <th>ATA Chapter</th>
                <th>Bin Location</th>
                <th>On Hand</th>
                <th>Min Qty</th>
                <th>Unit Value</th>
                <th>Condition Tag</th>
                <th className="th-action">Quick Stock</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.pn} onClick={() => setInspectPart(p)} className="click-row">
                  <td><span className="ref-badge">{p.pn}</span></td>
                  <td><strong>{p.desc}</strong></td>
                  <td>{p.ata}</td>
                  <td>{p.bin}</td>
                  <td><strong className={p.qty <= p.min ? 'text-red' : ''}>{p.qty} EA</strong></td>
                  <td>{p.min} EA</td>
                  <td>{p.cost}</td>
                  <td><StatusBadge value={p.condition.includes('Serviceable') || p.condition.includes('New') ? 'Serviceable' : 'Awaiting review'} /></td>
                  <td className="cell-action" onClick={e => e.stopPropagation()}>
                    <div style={{ display: 'flex', gap: '3px' }}>
                      <button className="row-open-btn" title="Issue 1 part" onClick={() => adjustQty(p.pn, -1)} disabled={p.qty <= 0}>−</button>
                      <button className="row-open-btn" title="Receive 1 part" onClick={() => adjustQty(p.pn, 1)}>+</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add Part */}
      {modalOpen && (
        <ProtoModal title="Add Part to Inventory" subtitle="Record new rotable, expendable, or consumables" onClose={() => setModalOpen(false)}>
          <form onSubmit={handleAddPart} className="modal-form">
            <div className="form-two-col">
              <label className="form-field">
                <span>Part Number *</span>
                <input required value={form.pn} onChange={e => setForm({ ...form, pn: e.target.value })} placeholder="e.g. P/N 3-9402-01" />
              </label>
              <label className="form-field">
                <span>ATA Chapter</span>
                <input value={form.ata} onChange={e => setForm({ ...form, ata: e.target.value })} placeholder="e.g. ATA 29" />
              </label>
            </div>
            <label className="form-field">
              <span>Part Description *</span>
              <input required value={form.desc} onChange={e => setForm({ ...form, desc: e.target.value })} placeholder="e.g. Fuel Flow Transmitter (Rotable)" />
            </label>
            <div className="form-two-col">
              <label className="form-field">
                <span>Bin Location</span>
                <input value={form.bin} onChange={e => setForm({ ...form, bin: e.target.value })} placeholder="e.g. Rack A-04" />
              </label>
              <label className="form-field">
                <span>Unit Value ($)</span>
                <input value={form.cost} onChange={e => setForm({ ...form, cost: e.target.value })} placeholder="e.g. 1400" />
              </label>
            </div>
            <div className="form-two-col">
              <label className="form-field">
                <span>Initial Quantity</span>
                <input type="number" min="0" value={form.qty} onChange={e => setForm({ ...form, qty: e.target.value })} />
              </label>
              <label className="form-field">
                <span>Min Stock Alert</span>
                <input type="number" min="0" value={form.min} onChange={e => setForm({ ...form, min: e.target.value })} />
              </label>
            </div>
            <label className="form-field">
              <span>Condition Tag</span>
              <select value={form.condition} onChange={e => setForm({ ...form, condition: e.target.value })}>
                <option>Serviceable / Tagged</option>
                <option>New / Sealed</option>
                <option>Overhaul Required</option>
                <option>Quarantined / Untagged</option>
              </select>
            </label>
            <div className="modal-action-bar">
              <Button onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button kind="primary" type="submit">Add to Inventory</Button>
            </div>
          </form>
        </ProtoModal>
      )}

      {/* Modal: Inspect Part */}
      {inspectPart && (
        <ProtoModal title={inspectPart.pn} subtitle={inspectPart.desc} onClose={() => setInspectPart(null)}>
          <div style={{ display: 'grid', gap: '14px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', background: '#F8FAFC', padding: '12px 14px', borderRadius: '8px' }}>
              <div><small style={{ color: 'var(--muted)' }}>Shelf Location:</small> <strong>{inspectPart.bin}</strong></div>
              <div><small style={{ color: 'var(--muted)' }}>Unit Cost:</small> <strong>{inspectPart.cost}</strong></div>
              <div><small style={{ color: 'var(--muted)' }}>On Hand:</small> <strong>{inspectPart.qty} EA</strong></div>
              <div><small style={{ color: 'var(--muted)' }}>Condition:</small> <strong>{inspectPart.condition}</strong></div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center', padding: '10px 0' }}>
              <span>Adjust Stock Count:</span>
              <Button onClick={() => adjustQty(inspectPart.pn, -1)} disabled={inspectPart.qty <= 0}>Issue 1 EA</Button>
              <strong style={{ fontSize: '18px', padding: '0 8px' }}>{inspectPart.qty}</strong>
              <Button onClick={() => adjustQty(inspectPart.pn, 1)}>Restock 1 EA</Button>
            </div>
            <div className="modal-action-bar">
              <Button onClick={() => setInspectPart(null)}>Done</Button>
            </div>
          </div>
        </ProtoModal>
      )}
    </>
  );
}

// =========================================================================
// 5. Procurement: Vendors & Suppliers
// =========================================================================
export function VendorsView({ setToast = () => {}, Icon, StatusBadge, Button = DefaultBtn, PageHeader, Card, KpiCard }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [inspectVendor, setInspectVendor] = useState(null);
  const [form, setForm] = useState({ name: '', cat: 'Rotables & Expendables', cert: 'FAA 145 / EASA 145', rating: 'Class A (99%)', contact: '' });
  const [vendors, setVendors] = useState([
    { code: 'V-101', name: 'AeroParts International Inc.', cat: 'Rotables & Expendables', cert: 'FAA 145 / EASA 145', rating: 'Class A (99.8%)', contact: 'sales@aeroparts.aero', status: 'Serviceable', orders: 14 },
    { code: 'V-104', name: 'Turbine Component Specialists', cat: 'Engine Overhaul & Hot Sections', cert: 'FAA / DGCA Approved', rating: 'Class A (98.5%)', contact: 'mro@turbinespec.com', status: 'Serviceable', orders: 6 },
    { code: 'V-108', name: 'Global Aviation Avionics Ltd', cat: 'Avionics LRU & Radar Calibration', cert: 'EASA Part 145', rating: 'Class A (100%)', contact: 'support@globalavionics.aero', status: 'Serviceable', orders: 8 },
    { code: 'V-112', name: 'Precision Hydraulic Overhaul', cat: 'Landing Gear & Actuators', cert: 'DGCA CAR 145', rating: 'Class B (94.2%)', contact: 'service@precisionhyd.in', status: 'Awaiting review', orders: 3 },
  ]);

  const handleRegister = e => {
    e.preventDefault();
    if (!form.name.trim()) return;
    const code = `V-${113 + vendors.length}`;
    const newVendor = {
      code,
      name: form.name.trim(),
      cat: form.cat,
      cert: form.cert,
      rating: form.rating,
      contact: form.contact || 'contact@supplier.aero',
      status: 'Serviceable',
      orders: 0,
    };
    setVendors([newVendor, ...vendors]);
    setModalOpen(false);
    setForm({ name: '', cat: 'Rotables & Expendables', cert: 'FAA 145 / EASA 145', rating: 'Class A (99%)', contact: '' });
    setToast(`Registered ${newVendor.name} (${code})`);
  };

  const toggleVendorStatus = code => {
    setVendors(vendors.map(v => v.code === code ? { ...v, status: v.status === 'Serviceable' ? 'Awaiting review' : 'Serviceable' } : v));
    setToast(`Updated compliance approval for ${code}`);
  };

  return (
    <>
      <PageHeader title="Approved Aviation Suppliers &amp; MROs" description="Certified vendor database, quality ratings, and CAR-145 / Part-145 approval certificates.">
        <Button kind="primary" icon="plus" onClick={() => setModalOpen(true)}>Register Supplier</Button>
      </PageHeader>

      <section className="kpi-strip">
        <KpiCard label="Approved Suppliers" value={vendors.length} note="Active in Directory" />
        <KpiCard label="Average Quality" value="98.1%" note="Incoming Part Acceptance" />
        <KpiCard label="CAR-145 Certified" value="100%" note="Regulatory Oversight" />
        <KpiCard label="Audit Period" value="Annual" note="Quality Assurance" />
      </section>

      <div className="grid-two-col">
        {vendors.map(v => (
          <div className="card vendor-card" key={v.code} style={{ padding: '16px 18px', gap: '10px' }} onClick={() => setInspectVendor(v)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span className="ref-badge" style={{ marginRight: '8px' }}>{v.code}</span>
                <strong style={{ fontSize: '15px', color: 'var(--navy)' }}>{v.name}</strong>
              </div>
              <StatusBadge value={v.status} />
            </div>
            <div style={{ fontSize: '12px', color: 'var(--muted)', display: 'grid', gap: '4px' }}>
              <div><span>Scope:</span> <strong style={{ color: 'var(--ink)' }}>{v.cat}</strong></div>
              <div><span>Certification:</span> <strong style={{ color: 'var(--ocean)' }}>{v.cert}</strong></div>
              <div><span>Quality Rating:</span> <strong style={{ color: 'var(--green)' }}>{v.rating}</strong></div>
              <div><span>Orders Fulfilled:</span> {v.orders} Purchase Orders</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', paddingTop: '8px', borderTop: '1px solid var(--line-light)' }}>
              <span style={{ fontSize: '11px', color: 'var(--muted)' }}>{v.contact}</span>
              <Button kind="text" onClick={e => { e.stopPropagation(); toggleVendorStatus(v.code); }}>
                {v.status === 'Serviceable' ? 'Put on Hold' : 'Re-Approve'}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <ProtoModal title="Register Approved Aviation Supplier" subtitle="Add supplier to accredited MRO and parts registry" onClose={() => setModalOpen(false)}>
          <form onSubmit={handleRegister} className="modal-form">
            <label className="form-field">
              <span>Company Name *</span>
              <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Apex Avionics Component Services" />
            </label>
            <div className="form-two-col">
              <label className="form-field">
                <span>Supply Scope</span>
                <select value={form.cat} onChange={e => setForm({ ...form, cat: e.target.value })}>
                  <option>Rotables & Expendables</option>
                  <option>Engine Overhaul & Hot Sections</option>
                  <option>Avionics LRU & Radar</option>
                  <option>Landing Gear & Actuators</option>
                  <option>Ground Support Equipment</option>
                </select>
              </label>
              <label className="form-field">
                <span>Certification Standard</span>
                <select value={form.cert} onChange={e => setForm({ ...form, cert: e.target.value })}>
                  <option>FAA 145 / EASA 145</option>
                  <option>DGCA CAR 145</option>
                  <option>OEM Certified</option>
                </select>
              </label>
            </div>
            <label className="form-field">
              <span>Contact Email</span>
              <input type="email" value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })} placeholder="e.g. dispatch@supplier.com" />
            </label>
            <div className="modal-action-bar">
              <Button onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button kind="primary" type="submit">Register Supplier</Button>
            </div>
          </form>
        </ProtoModal>
      )}
    </>
  );
}

// =========================================================================
// 6. Finance: Invoices
// =========================================================================
export function InvoicesView({ setToast = () => {}, Icon, StatusBadge, Button = DefaultBtn, PageHeader, Card, KpiCard }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [inspectInvoice, setInspectInvoice] = useState(null);
  const [form, setForm] = useState({ client: '', desc: '', tail: 'VT-AVA', amount: '', due: '' });
  const [invoices, setInvoices] = useState([
    { id: 'INV-4011', client: 'Apex Private Charters Ltd', desc: 'Line Maintenance & Turnaround Check', tail: 'VT-AVA', amount: '$18,400', due: '15 May 2026', status: 'Serviceable' },
    { id: 'INV-4019', client: 'Titan Aero Leasing Co.', desc: 'Component Overhaul Management Retainer', tail: 'VT-AVB', amount: '$42,100', due: '30 May 2026', status: 'In progress' },
    { id: 'INV-4024', client: 'Zenith Aviation Holdings', desc: 'Hydraulic System Inspection & Parts', tail: 'VT-AVA', amount: '$8,950', due: '28 Apr 2026', status: 'Awaiting review' },
    { id: 'INV-4008', client: 'Skyward Executive Sorties', desc: 'CAMO Airworthiness Oversight Retainer', tail: 'VT-AVC', amount: '$12,500', due: 'Paid', status: 'Serviceable' },
  ]);

  const handleCreate = e => {
    e.preventDefault();
    if (!form.client.trim() || !form.amount) return;
    const id = `INV-40${25 + invoices.length}`;
    const newInv = {
      id,
      client: form.client.trim(),
      desc: form.desc || 'Aviation Operations Service',
      tail: form.tail,
      amount: `$${form.amount.replace('$', '')}`,
      due: form.due || 'Net 30',
      status: 'In progress',
    };
    setInvoices([newInv, ...invoices]);
    setModalOpen(false);
    setForm({ client: '', desc: '', tail: 'VT-AVA', amount: '', due: '' });
    setToast(`${id} generated and logged`);
  };

  const markPaid = id => {
    setInvoices(invoices.map(inv => inv.id === id ? { ...inv, status: 'Serviceable', due: 'Paid' } : inv));
    setToast(`Marked ${id} as Paid`);
    if (inspectInvoice?.id === id) setInspectInvoice({ ...inspectInvoice, status: 'Serviceable', due: 'Paid' });
  };

  return (
    <>
      <PageHeader title="Customer &amp; Charter Invoicing" description="Billing for maintenance management, charter flight hours, and line station services.">
        <Button kind="primary" icon="plus" onClick={() => setModalOpen(true)}>Create New Invoice</Button>
      </PageHeader>

      <section className="kpi-strip">
        <KpiCard label="Receivables Due" value={`$${invoices.filter(i => i.status !== 'Serviceable').reduce((acc, i) => acc + parseInt(i.amount.replace(/[^0-9]/g, '') || 0), 0).toLocaleString()}`} note="Open Invoices" />
        <KpiCard label="Collected (Month)" value={`$${invoices.filter(i => i.status === 'Serviceable').reduce((acc, i) => acc + parseInt(i.amount.replace(/[^0-9]/g, '') || 0), 0).toLocaleString()}`} note="Settled" />
        <KpiCard label="Overdue Notices" value={invoices.filter(i => i.status === 'Awaiting review').length} note="Requires Attention" tone="warn" />
        <KpiCard label="Standard Terms" value="Net 30" note="Aviation Billing" />
      </section>

      <div className="card flush-card">
        <div className="table-responsive">
          <table className="erp-table">
            <thead>
              <tr>
                <th>Invoice Number</th>
                <th>Client / Operator</th>
                <th>Billing Description</th>
                <th>Target Aircraft</th>
                <th>Invoice Amount</th>
                <th>Due Date</th>
                <th>Status</th>
                <th className="th-action">Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map(inv => (
                <tr key={inv.id} onClick={() => setInspectInvoice(inv)} className="click-row">
                  <td><span className="ref-badge">{inv.id}</span></td>
                  <td><strong>{inv.client}</strong></td>
                  <td>{inv.desc}</td>
                  <td><span className="tail-tag">{inv.tail}</span></td>
                  <td><strong>{inv.amount}</strong></td>
                  <td>{inv.due}</td>
                  <td><StatusBadge value={inv.status} /></td>
                  <td className="cell-action" onClick={e => e.stopPropagation()}>
                    {inv.status !== 'Serviceable' ? (
                      <Button kind="text" onClick={() => markPaid(inv.id)}>Mark Paid</Button>
                    ) : (
                      <span style={{ fontSize: '11px', color: 'var(--green)', fontWeight: 600 }}>Settled</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <ProtoModal title="Create Customer Invoice" subtitle="Invoice private jet owner or charter client" onClose={() => setModalOpen(false)}>
          <form onSubmit={handleCreate} className="modal-form">
            <label className="form-field">
              <span>Client / Operator Name *</span>
              <input required value={form.client} onChange={e => setForm({ ...form, client: e.target.value })} placeholder="e.g. Zenith Aviation Holdings" />
            </label>
            <label className="form-field">
              <span>Billing Description *</span>
              <input required value={form.desc} onChange={e => setForm({ ...form, desc: e.target.value })} placeholder="e.g. 50-Hour Inspection & Oil Filter Replacements" />
            </label>
            <div className="form-two-col">
              <label className="form-field">
                <span>Target Aircraft</span>
                <select value={form.tail} onChange={e => setForm({ ...form, tail: e.target.value })}>
                  <option>VT-AVA</option>
                  <option>VT-AVB</option>
                  <option>VT-AVC</option>
                </select>
              </label>
              <label className="form-field">
                <span>Amount ($) *</span>
                <input required value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} placeholder="e.g. 14500" />
              </label>
            </div>
            <label className="form-field">
              <span>Due Date</span>
              <input value={form.due} onChange={e => setForm({ ...form, due: e.target.value })} placeholder="e.g. 15 Jun 2026" />
            </label>
            <div className="modal-action-bar">
              <Button onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button kind="primary" type="submit">Issue Invoice</Button>
            </div>
          </form>
        </ProtoModal>
      )}

      {inspectInvoice && (
        <ProtoModal title={inspectInvoice.id} subtitle={inspectInvoice.client} onClose={() => setInspectInvoice(null)}>
          <div style={{ display: 'grid', gap: '14px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', background: '#F8FAFC', padding: '12px 14px', borderRadius: '8px' }}>
              <div><small style={{ color: 'var(--muted)' }}>Total Billed:</small> <strong>{inspectInvoice.amount}</strong></div>
              <div><small style={{ color: 'var(--muted)' }}>Aircraft:</small> <strong>{inspectInvoice.tail}</strong></div>
              <div><small style={{ color: 'var(--muted)' }}>Due Date:</small> <strong>{inspectInvoice.due}</strong></div>
              <div><small style={{ color: 'var(--muted)' }}>Status:</small> <strong>{inspectInvoice.status}</strong></div>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--ink)' }}>{inspectInvoice.desc}</p>
            <div className="modal-action-bar">
              {inspectInvoice.status !== 'Serviceable' && (
                <Button kind="primary" onClick={() => markPaid(inspectInvoice.id)}>Mark as Paid</Button>
              )}
              <Button onClick={() => setInspectInvoice(null)}>Close</Button>
            </div>
          </div>
        </ProtoModal>
      )}
    </>
  );
}

// =========================================================================
// 7. Finance: Accounts Payable / Receivable
// =========================================================================
export function AccountsView({ setToast = () => {}, Icon, StatusBadge, Button = DefaultBtn, PageHeader, Card, KpiCard }) {
  const [tab, setTab] = useState('AR');
  const [ar, setAr] = useState([
    { id: 'AR-101', entity: 'Titan Aero Leasing Co.', desc: 'Component Retainer', amount: 42100, status: 'In progress' },
    { id: 'AR-102', entity: 'Apex Private Charters Ltd', desc: 'Line Check & Ferry', amount: 18400, status: 'Serviceable' },
    { id: 'AR-103', entity: 'Zenith Aviation Holdings', desc: 'Hydraulic Overhaul', amount: 8950, status: 'Awaiting review' },
  ]);
  const [ap, setAp] = useState([
    { id: 'AP-201', entity: 'Turbine Component Specialists', desc: 'Hot Section Parts', amount: 32400, status: 'Awaiting review' },
    { id: 'AP-202', entity: 'AeroParts International', desc: 'Hydraulic Seal Kits', amount: 4850, status: 'In progress' },
    { id: 'AP-203', entity: 'Precision Hydraulic Overhaul', desc: 'Actuator Calibration', amount: 5550, status: 'Serviceable' },
  ]);

  const totalAR = ar.reduce((acc, item) => acc + item.amount, 0);
  const totalAP = ap.reduce((acc, item) => acc + item.amount, 0);

  const settleItem = (list, setList, id) => {
    setList(list.map(i => i.id === id ? { ...i, status: 'Serviceable' } : i));
    setToast(`Settled transaction ${id}`);
  };

  return (
    <>
      <PageHeader title="Accounts Payable &amp; Receivable" description="Financial ledger balancing maintenance liabilities, supplier dues, and owner retainers." />

      <section className="kpi-strip">
        <KpiCard label="Accounts Receivable (AR)" value={`$${totalAR.toLocaleString()}`} note="Inflow Expected" />
        <KpiCard label="Accounts Payable (AP)" value={`$${totalAP.toLocaleString()}`} note="Supplier Dues" />
        <KpiCard label="Net Liquidity Margin" value={`+$${(totalAR - totalAP).toLocaleString()}`} note="Working Capital" />
        <KpiCard label="Aging Ratio" value="4.2% > 30d" note="Healthy Solvency" />
      </section>

      <div className="card flush-card">
        <div className="table-filter-bar">
          <div className="filter-tabs">
            <button className={`tab-btn ${tab === 'AR' ? 'active' : ''}`} onClick={() => setTab('AR')}>
              Accounts Receivable (${totalAR.toLocaleString()})
            </button>
            <button className={`tab-btn ${tab === 'AP' ? 'active' : ''}`} onClick={() => setTab('AP')}>
              Accounts Payable (${totalAP.toLocaleString()})
            </button>
          </div>
        </div>

        <div className="table-responsive">
          <table className="erp-table">
            <thead>
              <tr>
                <th>Reference</th>
                <th>Entity / Company</th>
                <th>Transaction Scope</th>
                <th>Amount</th>
                <th>Status</th>
                <th className="th-action">Action</th>
              </tr>
            </thead>
            <tbody>
              {(tab === 'AR' ? ar : ap).map(item => (
                <tr key={item.id}>
                  <td><span className="ref-badge">{item.id}</span></td>
                  <td><strong>{item.entity}</strong></td>
                  <td>{item.desc}</td>
                  <td><strong>${item.amount.toLocaleString()}</strong></td>
                  <td><StatusBadge value={item.status} /></td>
                  <td className="cell-action">
                    {item.status !== 'Serviceable' ? (
                      <Button kind="text" onClick={() => settleItem(tab === 'AR' ? ar : ap, tab === 'AR' ? setAr : setAp, item.id)}>
                        Settle
                      </Button>
                    ) : (
                      <span style={{ fontSize: '11px', color: 'var(--green)' }}>Reconciled</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

// =========================================================================
// 8. Finance: Operating Expenses
// =========================================================================
export function ExpensesView({ setToast = () => {}, Icon, StatusBadge, Button = DefaultBtn, PageHeader, Card, KpiCard }) {
  const [tailFilter, setTailFilter] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ cat: 'Jet A-1 Fuel Uplift', aircraft: 'VT-AVA', vendor: '', amount: '' });
  const [expenses, setExpenses] = useState([
    { id: 'EXP-801', cat: 'Jet A-1 Fuel Uplift', aircraft: 'VT-AVA', vendor: 'Bharat Petroleum Aviation', amount: 6420, date: '21 Apr 2026', status: 'Serviceable' },
    { id: 'EXP-802', cat: 'Navigation & Overflight Fees', aircraft: 'VT-AVB', vendor: 'Airports Authority of India', amount: 1850, date: '20 Apr 2026', status: 'Serviceable' },
    { id: 'EXP-803', cat: 'Line Station Hangarage', aircraft: 'VT-AVC', vendor: 'GMR Aero Technic', amount: 3200, date: '19 Apr 2026', status: 'In progress' },
    { id: 'EXP-804', cat: 'Engine Oil & Consumables', aircraft: 'VT-AVA', vendor: 'ExxonMobil Aviation Lubricants', amount: 840, date: '18 Apr 2026', status: 'Serviceable' },
  ]);

  const filtered = expenses.filter(e => tailFilter === 'All' || e.aircraft === tailFilter);

  const handleAdd = e => {
    e.preventDefault();
    if (!form.amount) return;
    const id = `EXP-${805 + expenses.length}`;
    const newExp = {
      id,
      cat: form.cat,
      aircraft: form.aircraft,
      vendor: form.vendor || 'Aviation Fuel & Nav Services',
      amount: Number(form.amount) || 1200,
      date: 'Today',
      status: 'Serviceable',
    };
    setExpenses([newExp, ...expenses]);
    setModalOpen(false);
    setForm({ cat: 'Jet A-1 Fuel Uplift', aircraft: 'VT-AVA', vendor: '', amount: '' });
    setToast(`Logged expense ${id} for ${newExp.aircraft}`);
  };

  return (
    <>
      <PageHeader title="Direct Operating Expenses" description="Trip costs, fuel burn allocations, landing fees, and line maintenance charges.">
        <Button kind="primary" icon="plus" onClick={() => setModalOpen(true)}>Log Expense</Button>
      </PageHeader>

      <section className="kpi-strip">
        <KpiCard label="Fuel Expenses (Month)" value={`$${expenses.filter(e => e.cat.includes('Fuel')).reduce((a, b) => a + b.amount, 0).toLocaleString()}`} note="Jet A-1 Uplift" />
        <KpiCard label="Nav & Landing Fees" value={`$${expenses.filter(e => e.cat.includes('Nav')).reduce((a, b) => a + b.amount, 0).toLocaleString()}`} note="Airport Authorities" />
        <KpiCard label="Total Operating Expenses" value={`$${expenses.reduce((a, b) => a + b.amount, 0).toLocaleString()}`} note="Fleet Total" />
        <KpiCard label="Avg DOC per Hour" value="$2,420" note="Fuel & Fees" />
      </section>

      <div className="card flush-card">
        <div className="table-filter-bar">
          <div className="filter-tabs">
            {['All', 'VT-AVA', 'VT-AVB', 'VT-AVC'].map(t => (
              <button key={t} className={`tab-btn ${tailFilter === t ? 'active' : ''}`} onClick={() => setTailFilter(t)}>{t}</button>
            ))}
          </div>
        </div>

        <div className="table-responsive">
          <table className="erp-table">
            <thead>
              <tr>
                <th>Expense ID</th>
                <th>Category</th>
                <th>Target Aircraft</th>
                <th>Vendor / Authority</th>
                <th>Amount</th>
                <th>Billing Date</th>
                <th>Approval</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(e => (
                <tr key={e.id}>
                  <td><span className="ref-badge">{e.id}</span></td>
                  <td><strong>{e.cat}</strong></td>
                  <td><span className="tail-tag">{e.aircraft}</span></td>
                  <td>{e.vendor}</td>
                  <td><strong>${e.amount.toLocaleString()}</strong></td>
                  <td>{e.date}</td>
                  <td><StatusBadge value={e.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <ProtoModal title="Log Direct Operating Expense" subtitle="Record trip, fuel, or line maintenance expense" onClose={() => setModalOpen(false)}>
          <form onSubmit={handleAdd} className="modal-form">
            <label className="form-field">
              <span>Expense Category</span>
              <select value={form.cat} onChange={e => setForm({ ...form, cat: e.target.value })}>
                <option>Jet A-1 Fuel Uplift</option>
                <option>Navigation & Overflight Fees</option>
                <option>Line Station Hangarage</option>
                <option>Engine Oil & Consumables</option>
                <option>Crew Per Diem & Hotel</option>
              </select>
            </label>
            <div className="form-two-col">
              <label className="form-field">
                <span>Target Aircraft</span>
                <select value={form.aircraft} onChange={e => setForm({ ...form, aircraft: e.target.value })}>
                  <option>VT-AVA</option>
                  <option>VT-AVB</option>
                  <option>VT-AVC</option>
                </select>
              </label>
              <label className="form-field">
                <span>Amount ($) *</span>
                <input required type="number" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} placeholder="e.g. 2400" />
              </label>
            </div>
            <label className="form-field">
              <span>Vendor / Authority</span>
              <input value={form.vendor} onChange={e => setForm({ ...form, vendor: e.target.value })} placeholder="e.g. Indian Oil Aviation" />
            </label>
            <div className="modal-action-bar">
              <Button onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button kind="primary" type="submit">Log Expense</Button>
            </div>
          </form>
        </ProtoModal>
      )}
    </>
  );
}

// =========================================================================
// 9. Finance: Financial Reports
// =========================================================================
export function FinancialReportsView({ setToast = () => {}, Icon, StatusBadge, Button = DefaultBtn, PageHeader, Card, KpiCard }) {
  const [simRate, setSimRate] = useState(3800);

  const aircraftStats = [
    { tail: 'VT-AVA', hours: 68.4, baseRev: 220000, doc: 128000, maint: 18000 },
    { tail: 'VT-AVB', hours: 52.2, baseRev: 168000, doc: 98400, maint: 14200 },
    { tail: 'VT-AVC', hours: 44.8, baseRev: 92000, doc: 69000, maint: 10200 },
  ];

  const handleExport = () => {
    downloadCSV(
      'avajet-financial-pl.csv',
      ['Aircraft', 'Flight Hours', 'Charter Revenue', 'Operating Costs', 'Maintenance Reserves', 'Net Contribution'],
      aircraftStats.map(s => [
        s.tail,
        `${s.hours} FH`,
        `$${Math.round(s.hours * simRate).toLocaleString()}`,
        `$${s.doc.toLocaleString()}`,
        `$${s.maint.toLocaleString()}`,
        `$${Math.round((s.hours * simRate) - s.doc - s.maint).toLocaleString()}`
      ])
    );
    setToast('Financial statement CSV exported');
  };

  return (
    <>
      <PageHeader title="Financial Statements &amp; Fleet P&amp;L" description="Direct operating margins, maintenance reserves, and profitability per tail.">
        <Button kind="primary" icon="download" onClick={handleExport}>Export P&amp;L Statement</Button>
      </PageHeader>

      <section className="kpi-strip">
        <KpiCard label="Fleet Revenue" value={`$${Math.round(aircraftStats.reduce((a, b) => a + (b.hours * simRate), 0)).toLocaleString()}`} note="Simulated Target" />
        <KpiCard label="Operating Costs (DOC)" value="$295,400" note="Fuel, Line, Crew" />
        <KpiCard label="Net Operating Margin" value="38.5%" note="Positive Contribution" />
        <KpiCard label="Cost per Flight Hour" value="$2,450" note="Fleet Average" />
      </section>

      <div className="card" style={{ padding: '16px 20px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <strong>Interactive Hourly Rate Simulator</strong>
            <p style={{ margin: '2px 0 0', fontSize: '12px', color: 'var(--muted)' }}>Adjust average charter billable rate to simulate projected operating margins</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <input type="range" min="2500" max="6000" step="100" value={simRate} onChange={e => setSimRate(Number(e.target.value))} style={{ width: '160px' }} />
            <strong style={{ fontSize: '16px', color: 'var(--navy)' }}>${simRate.toLocaleString()} / FH</strong>
          </div>
        </div>
      </div>

      <div className="card flush-card">
        <div className="card-head">
          <h2>Aircraft-wise Operating Contribution (Q1 2026)</h2>
        </div>
        <div className="table-responsive">
          <table className="erp-table">
            <thead>
              <tr>
                <th>Aircraft</th>
                <th>Hours Flown</th>
                <th>Simulated Charter Revenue</th>
                <th>Direct Operating Costs</th>
                <th>Maintenance Reserves</th>
                <th>Net Margin</th>
                <th>Margin %</th>
              </tr>
            </thead>
            <tbody>
              {aircraftStats.map(s => {
                const rev = Math.round(s.hours * simRate);
                const margin = rev - s.doc - s.maint;
                const pct = ((margin / rev) * 100).toFixed(1);
                return (
                  <tr key={s.tail}>
                    <td><span className="tail-tag">{s.tail}</span></td>
                    <td>{s.hours} FH</td>
                    <td><strong>${rev.toLocaleString()}</strong></td>
                    <td>${s.doc.toLocaleString()}</td>
                    <td>${s.maint.toLocaleString()}</td>
                    <td><strong>${margin.toLocaleString()}</strong></td>
                    <td><strong style={{ color: margin > 0 ? 'var(--green)' : 'var(--red)' }}>{pct}%</strong></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

// =========================================================================
// 10. HR: Employees & Engineers Directory
// =========================================================================
export function EmployeesView({ setToast = () => {}, Icon, StatusBadge, Button = DefaultBtn, PageHeader, Card, KpiCard }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [inspectEmp, setInspectEmp] = useState(null);
  const [form, setForm] = useState({ name: '', role: 'AME Cat B1.1 (Airframe / Engine)', license: 'DGCA AME #', rating: 'Avajet 400', expiry: '2028-04-15' });
  const [employees, setEmployees] = useState([
    { id: 'ENG-01', name: 'Vikram Sen', role: 'Chief Engineer / CAMO Manager', license: 'DGCA AME Cat B1.1 (Turbine)', rating: 'Airbus / Avajet 400', expiry: '14 Nov 2027', status: 'Serviceable', duty: 'On Shift' },
    { id: 'ENG-04', name: 'Rohan Deshmukh', role: 'Avionics Specialist Engineer', license: 'DGCA AME Cat B2 (Avionics)', rating: 'Radar / TCAS / FADEC', expiry: '22 Aug 2026', status: 'Serviceable', duty: 'On Shift' },
    { id: 'ENG-07', name: 'Aditya Kulkarni', role: 'Line Maintenance Technician', license: 'AME Basic / Approved Sign-off', rating: 'Airframe / Powerplant', expiry: '10 Jan 2027', status: 'Serviceable', duty: 'AOG Standby' },
    { id: 'PLT-02', name: 'Capt. Rajesh Sharma', role: 'Chief Pilot / Operations Lead', license: 'ATPL #48201', rating: 'Type Rated PIC', expiry: '04 Oct 2026', status: 'Serviceable', duty: 'Flight Duty' },
    { id: 'PLT-05', name: 'Capt. Neha Kapoor', role: 'First Officer', license: 'CPL / ATPL Frozen', rating: 'Type Rated SIC', expiry: '18 Dec 2026', status: 'Serviceable', duty: 'Standby' },
  ]);

  const handleAddStaff = e => {
    e.preventDefault();
    if (!form.name.trim()) return;
    const id = `${form.role.includes('Pilot') ? 'PLT' : 'ENG'}-0${employees.length + 1}`;
    const newEmp = {
      id,
      name: form.name.trim(),
      role: form.role,
      license: form.license,
      rating: form.rating,
      expiry: form.expiry || '2027-12-31',
      status: 'Serviceable',
      duty: 'On Shift',
    };
    setEmployees([newEmp, ...employees]);
    setModalOpen(false);
    setForm({ name: '', role: 'AME Cat B1.1 (Airframe / Engine)', license: 'DGCA AME #', rating: 'Avajet 400', expiry: '2028-04-15' });
    setToast(`Added ${newEmp.name} to personnel registry`);
  };

  const toggleDuty = id => {
    setEmployees(employees.map(e => {
      if (e.id === id) {
        const nextDuty = e.duty === 'On Shift' ? 'Off Duty' : 'On Shift';
        if (inspectEmp?.id === id) setInspectEmp({ ...inspectEmp, duty: nextDuty });
        return { ...e, duty: nextDuty };
      }
      return e;
    }));
    setToast(`Updated shift status for ${id}`);
  };

  return (
    <>
      <PageHeader title="Technical Staff &amp; Flight Crew Directory" description="AME license oversight, endorsement validity, recurrent training certifications, and staff duty logs.">
        <Button kind="primary" icon="plus" onClick={() => setModalOpen(true)}>Add Staff Member</Button>
      </PageHeader>

      <section className="kpi-strip">
        <KpiCard label="Licensed Engineers" value={employees.filter(e => e.id.startsWith('ENG')).length} note="Cat B1 / B2 Active" />
        <KpiCard label="Flight Crew (Pilots)" value={employees.filter(e => e.id.startsWith('PLT')).length} note="Active Endorsements" />
        <KpiCard label="License Expiry < 90d" value="0" note="All Compliant" />
        <KpiCard label="FDTL Compliance" value="100%" note="Safety Oversight" />
      </section>

      <div className="card flush-card">
        <div className="table-responsive">
          <table className="erp-table">
            <thead>
              <tr>
                <th>Staff ID</th>
                <th>Full Name</th>
                <th>Designation / Role</th>
                <th>License / Endorsement</th>
                <th>Type Scope</th>
                <th>License Expiry</th>
                <th>Current Duty</th>
                <th className="th-action">Toggle Duty</th>
              </tr>
            </thead>
            <tbody>
              {employees.map(e => (
                <tr key={e.id} onClick={() => setInspectEmp(e)} className="click-row">
                  <td><span className="ref-badge">{e.id}</span></td>
                  <td><strong>{e.name}</strong></td>
                  <td>{e.role}</td>
                  <td><strong>{e.license}</strong></td>
                  <td>{e.rating}</td>
                  <td>{e.expiry}</td>
                  <td><StatusBadge value={e.duty === 'On Shift' || e.duty === 'Flight Duty' ? 'Serviceable' : 'In progress'} /></td>
                  <td className="cell-action" onClick={ev => ev.stopPropagation()}>
                    <Button kind="text" onClick={() => toggleDuty(e.id)}>{e.duty === 'On Shift' ? 'Check Out' : 'Check In'}</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <ProtoModal title="Add Personnel Record" subtitle="Onboard engineer, CAMO specialist, or flight crew" onClose={() => setModalOpen(false)}>
          <form onSubmit={handleAddStaff} className="modal-form">
            <label className="form-field">
              <span>Full Name *</span>
              <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Suresh Nair" />
            </label>
            <div className="form-two-col">
              <label className="form-field">
                <span>Role / Designation</span>
                <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                  <option>AME Cat B1.1 (Airframe / Engine)</option>
                  <option>AME Cat B2 (Avionics)</option>
                  <option>Line Technician</option>
                  <option>Chief Pilot / Captain</option>
                  <option>First Officer</option>
                </select>
              </label>
              <label className="form-field">
                <span>License Number</span>
                <input value={form.license} onChange={e => setForm({ ...form, license: e.target.value })} placeholder="e.g. DGCA AME #4928" />
              </label>
            </div>
            <div className="form-two-col">
              <label className="form-field">
                <span>Type Rating Scope</span>
                <input value={form.rating} onChange={e => setForm({ ...form, rating: e.target.value })} placeholder="e.g. Avajet 400 / PW535" />
              </label>
              <label className="form-field">
                <span>License Expiry Date</span>
                <input type="date" value={form.expiry} onChange={e => setForm({ ...form, expiry: e.target.value })} />
              </label>
            </div>
            <div className="modal-action-bar">
              <Button onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button kind="primary" type="submit">Add Personnel</Button>
            </div>
          </form>
        </ProtoModal>
      )}

      {inspectEmp && (
        <ProtoModal title={inspectEmp.name} subtitle={`${inspectEmp.id} · ${inspectEmp.role}`} onClose={() => setInspectEmp(null)}>
          <div style={{ display: 'grid', gap: '14px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', background: '#F8FAFC', padding: '12px 14px', borderRadius: '8px' }}>
              <div><small style={{ color: 'var(--muted)' }}>License Number:</small> <strong>{inspectEmp.license}</strong></div>
              <div><small style={{ color: 'var(--muted)' }}>Type Rating:</small> <strong>{inspectEmp.rating}</strong></div>
              <div><small style={{ color: 'var(--muted)' }}>License Valid Until:</small> <strong>{inspectEmp.expiry}</strong></div>
              <div><small style={{ color: 'var(--muted)' }}>Shift Status:</small> <strong>{inspectEmp.duty}</strong></div>
            </div>
            <div className="modal-action-bar">
              <Button kind="primary" onClick={() => toggleDuty(inspectEmp.id)}>Toggle Shift ({inspectEmp.duty})</Button>
              <Button onClick={() => setInspectEmp(null)}>Close</Button>
            </div>
          </div>
        </ProtoModal>
      )}
    </>
  );
}

// =========================================================================
// 11. HR: Attendance & Duty Logs
// =========================================================================
export function AttendanceView({ setToast = () => {}, Icon, StatusBadge, Button = DefaultBtn, PageHeader, Card, KpiCard }) {
  const [shifts, setShifts] = useState([
    { name: 'Vikram Sen', role: 'CAMO Manager', shift: 'Morning Shift (07:00 - 15:30)', hours: 8.5, week: 38.0, fdtl: 'Serviceable' },
    { name: 'Rohan Deshmukh', role: 'Avionics Tech', shift: 'Evening Line Shift (15:00 - 23:30)', hours: 8.5, week: 34.0, fdtl: 'Serviceable' },
    { name: 'Aditya Kulkarni', role: 'Hangar Tech', shift: 'AOG Standby Rotation', hours: 0, week: 40.0, fdtl: 'Serviceable' },
    { name: 'Capt. Rajesh Sharma', role: 'PIC', shift: 'Flight Rotation BOM-DEL', hours: 4.8, week: 24.5, fdtl: 'Serviceable' },
  ]);

  const addDutyHour = name => {
    setShifts(shifts.map(s => s.name === name ? { ...s, hours: +(s.hours + 1).toFixed(1), week: +(s.week + 1).toFixed(1) } : s));
    setToast(`Logged +1.0 hour for ${name}`);
  };

  return (
    <>
      <PageHeader title="Attendance, Shift Rosters &amp; FDTL" description="Flight duty time limitations (FDTL) tracking and maintenance line shift rest periods." />

      <section className="kpi-strip">
        <KpiCard label="On-Duty Personnel" value={shifts.length} note="Active Shift" />
        <KpiCard label="AOG Standby Techs" value="3" note="24/7 Rapid Response" />
        <KpiCard label="FDTL Rest Violations" value="0" note="Strictly Compliant" />
        <KpiCard label="Weekly Average" value="34.1 h" note="Within Safe Limits" />
      </section>

      <div className="card flush-card">
        <div className="table-responsive">
          <table className="erp-table">
            <thead>
              <tr>
                <th>Staff Name</th>
                <th>Role</th>
                <th>Current Shift Assignment</th>
                <th>Hours Logged Today</th>
                <th>Weekly Duty Total</th>
                <th>FDTL Compliance</th>
                <th className="th-action">Log Hours</th>
              </tr>
            </thead>
            <tbody>
              {shifts.map(s => (
                <tr key={s.name}>
                  <td><strong>{s.name}</strong></td>
                  <td>{s.role}</td>
                  <td>{s.shift}</td>
                  <td><strong>{s.hours} h</strong></td>
                  <td>{s.week} h</td>
                  <td><StatusBadge value={s.fdtl} /></td>
                  <td className="cell-action">
                    <Button kind="text" onClick={() => addDutyHour(s.name)}>+1 Hour</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

// =========================================================================
// 12. HR: Payroll Information
// =========================================================================
export function PayrollView({ setToast = () => {}, Icon, StatusBadge, Button = DefaultBtn, PageHeader, Card, KpiCard }) {
  const [records, setRecords] = useState([
    { id: 'PAY-2603', period: 'March 2026', staff: 24, gross: 148200, allow: 18400, net: 134800, status: 'Serviceable' },
    { id: 'PAY-2602', period: 'February 2026', staff: 24, gross: 146500, allow: 16200, net: 133100, status: 'Serviceable' },
    { id: 'PAY-2601', period: 'January 2026', staff: 23, gross: 142000, allow: 15800, net: 129500, status: 'Serviceable' },
  ]);

  const handleRunPayroll = () => {
    const id = `PAY-260${4 + records.length}`;
    const newBatch = {
      id,
      period: 'April 2026 (Live Batch)',
      staff: 24,
      gross: 149500,
      allow: 19100,
      net: 136200,
      status: 'Serviceable',
    };
    setRecords([newBatch, ...records]);
    setToast(`Compiled & Disbursed ${id} for April 2026`);
  };

  return (
    <>
      <PageHeader title="Payroll &amp; Aviation Allowances" description="Base salaries, flight duty hour allowances, technical overtime, and statutory benefits.">
        <Button kind="primary" icon="plus" onClick={handleRunPayroll}>Run Current Month Payroll Batch</Button>
      </PageHeader>

      <section className="kpi-strip">
        <KpiCard label="Latest Batch Disbursed" value={`$${records[0].net.toLocaleString()}`} note={records[0].period} />
        <KpiCard label="Flight Duty Allowances" value={`$${records[0].allow.toLocaleString()}`} note="Sorties & Per Diem" />
        <KpiCard label="Active Personnel" value={records[0].staff} note="Technical & Flight Crew" />
        <KpiCard label="Statutory Compliance" value="100%" note="Tax & Benefits Reconciled" />
      </section>

      <div className="card flush-card">
        <div className="table-responsive">
          <table className="erp-table">
            <thead>
              <tr>
                <th>Batch Reference</th>
                <th>Payroll Period</th>
                <th>Headcount</th>
                <th>Gross Earnings</th>
                <th>Flight Allowances</th>
                <th>Net Disbursed</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {records.map(p => (
                <tr key={p.id}>
                  <td><span className="ref-badge">{p.id}</span></td>
                  <td><strong>{p.period}</strong></td>
                  <td>{p.staff} Personnel</td>
                  <td>${p.gross.toLocaleString()}</td>
                  <td>${p.allow.toLocaleString()}</td>
                  <td><strong>${p.net.toLocaleString()}</strong></td>
                  <td><StatusBadge value={p.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

// =========================================================================
// 13. CRM: Customers & Aircraft Owners
// =========================================================================
export function CustomersView({ setToast = () => {}, Icon, StatusBadge, Button = DefaultBtn, PageHeader, Card, KpiCard, nav }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [inspectCustomer, setInspectCustomer] = useState(null);
  const [form, setForm] = useState({ name: '', type: 'Private Jet Owner', fleet: 'VT-AVA', manager: 'Amit Roy', contact: '' });
  const [customers, setCustomers] = useState([
    { id: 'CUST-01', name: 'Zenith Aviation Holdings', type: 'Private Jet Owner', fleet: 'VT-AVA, VT-AVB', manager: 'Amit Roy', contact: 'dispatch@zenith.aero', status: 'Serviceable', flightHours: 120.4 },
    { id: 'CUST-02', name: 'Apex Private Charters Ltd', type: 'Charter Operator', fleet: 'Charter Retainer', manager: 'Sanjay Mehta', contact: 'ops@apexcharters.in', status: 'Serviceable', flightHours: 84.0 },
    { id: 'CUST-03', name: 'Titan Aero Leasing Co.', type: 'Lessor / Asset Manager', fleet: 'VT-AVC', manager: 'Amit Roy', contact: 'contracts@titanaero.com', status: 'Serviceable', flightHours: 210.2 },
    { id: 'CUST-04', name: 'Skyward Executive Sorties', type: 'Corporate Flight Dept', fleet: 'Line Maintenance', manager: 'Sanjay Mehta', contact: 'aviation@skyward.org', status: 'In progress', flightHours: 46.5 },
  ]);

  const handleAddCustomer = e => {
    e.preventDefault();
    if (!form.name.trim()) return;
    const id = `CUST-0${customers.length + 1}`;
    const newCust = {
      id,
      name: form.name.trim(),
      type: form.type,
      fleet: form.fleet,
      manager: form.manager,
      contact: form.contact || 'contact@client.com',
      status: 'Serviceable',
      flightHours: 0,
    };
    setCustomers([newCust, ...customers]);
    setModalOpen(false);
    setForm({ name: '', type: 'Private Jet Owner', fleet: 'VT-AVA', manager: 'Amit Roy', contact: '' });
    setToast(`Added ${newCust.name} to CRM`);
  };

  return (
    <>
      <PageHeader title="Customers &amp; Aircraft Owners" description="Client profiles, managed aircraft leaseholders, charter accounts, and primary dispatch contacts.">
        <Button kind="primary" icon="plus" onClick={() => setModalOpen(true)}>Add Client Profile</Button>
      </PageHeader>

      <section className="kpi-strip">
        <KpiCard label="Active Accounts" value={customers.length} note="Owners & Lessors" />
        <KpiCard label="Managed Fleet" value="3 Aircraft" note="Under Direct CAMO" />
        <KpiCard label="Average Retention" value="98%" note="Long-Term Contracts" />
        <KpiCard label="Monthly Flight Hours" value="461 FH" note="Client Fleet" />
      </section>

      <div className="grid-two-col">
        {customers.map(c => (
          <div className="card" key={c.id} style={{ padding: '16px 18px', gap: '8px' }} onClick={() => setInspectCustomer(c)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span className="ref-badge" style={{ marginRight: '8px' }}>{c.id}</span>
                <strong style={{ fontSize: '15px', color: 'var(--navy)' }}>{c.name}</strong>
              </div>
              <StatusBadge value={c.status} />
            </div>
            <div style={{ fontSize: '12px', color: 'var(--muted)', display: 'grid', gap: '3px' }}>
              <div><span>Account Type:</span> <strong style={{ color: 'var(--ink)' }}>{c.type}</strong></div>
              <div><span>Linked Fleet:</span> <strong style={{ color: 'var(--ocean)' }}>{c.fleet}</strong></div>
              <div><span>Account Lead:</span> {c.manager}</div>
              <div><span>Direct Contact:</span> {c.contact}</div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
              <Button kind="text">View Dossier</Button>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <ProtoModal title="Add Client / Aircraft Owner" subtitle="Create CRM account and assign fleet tail" onClose={() => setModalOpen(false)}>
          <form onSubmit={handleAddCustomer} className="modal-form">
            <label className="form-field">
              <span>Client / Company Name *</span>
              <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Horizon Aviation Group" />
            </label>
            <div className="form-two-col">
              <label className="form-field">
                <span>Account Type</span>
                <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                  <option>Private Jet Owner</option>
                  <option>Charter Operator</option>
                  <option>Lessor / Asset Manager</option>
                  <option>Corporate Flight Dept</option>
                </select>
              </label>
              <label className="form-field">
                <span>Assigned Fleet Tail</span>
                <input value={form.fleet} onChange={e => setForm({ ...form, fleet: e.target.value })} placeholder="e.g. VT-AVA" />
              </label>
            </div>
            <label className="form-field">
              <span>Contact Email</span>
              <input type="email" value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })} placeholder="e.g. dispatch@horizon.com" />
            </label>
            <div className="modal-action-bar">
              <Button onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button kind="primary" type="submit">Create Client Profile</Button>
            </div>
          </form>
        </ProtoModal>
      )}

      {inspectCustomer && (
        <ProtoModal title={inspectCustomer.name} subtitle={`${inspectCustomer.id} · ${inspectCustomer.type}`} onClose={() => setInspectCustomer(null)}>
          <div style={{ display: 'grid', gap: '14px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', background: '#F8FAFC', padding: '12px 14px', borderRadius: '8px' }}>
              <div><small style={{ color: 'var(--muted)' }}>Assigned Aircraft:</small> <strong>{inspectCustomer.fleet}</strong></div>
              <div><small style={{ color: 'var(--muted)' }}>Account Manager:</small> <strong>{inspectCustomer.manager}</strong></div>
              <div><small style={{ color: 'var(--muted)' }}>Contact:</small> <strong>{inspectCustomer.contact}</strong></div>
              <div><small style={{ color: 'var(--muted)' }}>Total Logged Hours:</small> <strong>{inspectCustomer.flightHours} FH</strong></div>
            </div>
            <div className="modal-action-bar">
              <Button onClick={() => setInspectCustomer(null)}>Close</Button>
            </div>
          </div>
        </ProtoModal>
      )}
    </>
  );
}

// =========================================================================
// 14. CRM: Charter Requests & Enquiries
// =========================================================================
export function CharterRequestsView({ setToast = () => {}, Icon, StatusBadge, Button = DefaultBtn, PageHeader, Card, KpiCard }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [inspectTrip, setInspectTrip] = useState(null);
  const [form, setForm] = useState({ client: '', route: 'VABB (Mumbai) → VIDP (Delhi)', date: '', pax: '4 PAX', aircraft: 'VT-AVA' });
  const [requests, setRequests] = useState([
    { id: 'TRIP-804', client: 'Zenith Aviation', route: 'VABB (Mumbai) → VIDP (Delhi)', date: '28 Apr 2026, 09:30', pax: '6 PAX', aircraft: 'VT-AVA', status: 'Serviceable' },
    { id: 'TRIP-809', client: 'Apex Private Charters', route: 'VIDP (Delhi) → VOBL (Bengaluru)', date: '02 May 2026, 14:00', pax: '4 PAX', aircraft: 'VT-AVB', status: 'In progress' },
    { id: 'TRIP-812', client: 'Titan Aero Leasing', route: 'VOHS (Hyderabad) → VABB (Mumbai)', date: '05 May 2026, 11:15', pax: '8 PAX', aircraft: 'VT-AVC', status: 'Awaiting review' },
    { id: 'TRIP-815', client: 'Horizon Executive Flights', route: 'VAAH (Ahmedabad) → VIDP (Delhi)', date: '08 May 2026, 16:45', pax: '5 PAX', aircraft: 'VT-AVA', status: 'In progress' },
  ]);

  const handleCreate = e => {
    e.preventDefault();
    if (!form.client.trim()) return;
    const id = `TRIP-${816 + requests.length}`;
    const newReq = {
      id,
      client: form.client.trim(),
      route: form.route,
      date: form.date || 'In 5 days',
      pax: form.pax,
      aircraft: form.aircraft,
      status: 'Awaiting review',
    };
    setRequests([newReq, ...requests]);
    setModalOpen(false);
    setForm({ client: '', route: 'VABB (Mumbai) → VIDP (Delhi)', date: '', pax: '4 PAX', aircraft: 'VT-AVA' });
    setToast(`${id} recorded for slot clearance & feasibility check`);
  };

  const updateTripStatus = (id, newStatus) => {
    setRequests(requests.map(r => r.id === id ? { ...r, status: newStatus } : r));
    setToast(`Trip ${id} marked as ${newStatus}`);
    if (inspectTrip?.id === id) setInspectTrip({ ...inspectTrip, status: newStatus });
  };

  return (
    <>
      <PageHeader title="Charter Enquiries &amp; Trip Requests" description="Flight requests, departure slot feasibility, aircraft availability matching, and route dispatch.">
        <Button kind="primary" icon="plus" onClick={() => setModalOpen(true)}>Log Charter Enquiry</Button>
      </PageHeader>

      <section className="kpi-strip">
        <KpiCard label="Pending Feasibility" value={requests.filter(r => r.status === 'Awaiting review').length} note="Slot Clearance" tone="warn" />
        <KpiCard label="Confirmed Flights" value={requests.filter(r => r.status === 'Serviceable').length} note="Dispatched" />
        <KpiCard label="In Progress / Quoting" value={requests.filter(r => r.status === 'In progress').length} note="Route Review" />
        <KpiCard label="On-Time Departure" value="99.2%" note="Fleet Reliability" />
      </section>

      <div className="card flush-card">
        <div className="table-responsive">
          <table className="erp-table">
            <thead>
              <tr>
                <th>Trip ID</th>
                <th>Client Name</th>
                <th>Flight Routing</th>
                <th>Departure Target</th>
                <th>Passenger Count</th>
                <th>Assigned Tail</th>
                <th>Status</th>
                <th className="th-action">Dispatch</th>
              </tr>
            </thead>
            <tbody>
              {requests.map(r => (
                <tr key={r.id} onClick={() => setInspectTrip(r)} className="click-row">
                  <td><span className="ref-badge">{r.id}</span></td>
                  <td><strong>{r.client}</strong></td>
                  <td><strong>{r.route}</strong></td>
                  <td>{r.date}</td>
                  <td>{r.pax}</td>
                  <td><span className="tail-tag">{r.aircraft}</span></td>
                  <td><StatusBadge value={r.status} /></td>
                  <td className="cell-action" onClick={e => e.stopPropagation()}>
                    <Button kind="text" onClick={() => updateTripStatus(r.id, r.status === 'Serviceable' ? 'Awaiting review' : 'Serviceable')}>
                      {r.status === 'Serviceable' ? 'Re-check' : 'Confirm'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <ProtoModal title="Log Charter Enquiry" subtitle="Route feasibility, slot checks, and aircraft allocation" onClose={() => setModalOpen(false)}>
          <form onSubmit={handleCreate} className="modal-form">
            <label className="form-field">
              <span>Client / Requester *</span>
              <input required value={form.client} onChange={e => setForm({ ...form, client: e.target.value })} placeholder="e.g. Apex Private Charters" />
            </label>
            <label className="form-field">
              <span>Flight Routing *</span>
              <input required value={form.route} onChange={e => setForm({ ...form, route: e.target.value })} placeholder="e.g. VABB (Mumbai) → VOBL (Bengaluru)" />
            </label>
            <div className="form-two-col">
              <label className="form-field">
                <span>Passenger Count</span>
                <input value={form.pax} onChange={e => setForm({ ...form, pax: e.target.value })} placeholder="e.g. 6 PAX" />
              </label>
              <label className="form-field">
                <span>Assigned Aircraft</span>
                <select value={form.aircraft} onChange={e => setForm({ ...form, aircraft: e.target.value })}>
                  <option>VT-AVA</option>
                  <option>VT-AVB</option>
                  <option>VT-AVC</option>
                </select>
              </label>
            </div>
            <label className="form-field">
              <span>Target Departure Date & Time</span>
              <input value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} placeholder="e.g. 15 May 2026, 10:00" />
            </label>
            <div className="modal-action-bar">
              <Button onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button kind="primary" type="submit">Submit Enquiry</Button>
            </div>
          </form>
        </ProtoModal>
      )}

      {inspectTrip && (
        <ProtoModal title={inspectTrip.id} subtitle={inspectTrip.client} onClose={() => setInspectTrip(null)}>
          <div style={{ display: 'grid', gap: '14px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', background: '#F8FAFC', padding: '12px 14px', borderRadius: '8px' }}>
              <div><small style={{ color: 'var(--muted)' }}>Route:</small> <strong>{inspectTrip.route}</strong></div>
              <div><small style={{ color: 'var(--muted)' }}>Assigned Aircraft:</small> <strong>{inspectTrip.aircraft}</strong></div>
              <div><small style={{ color: 'var(--muted)' }}>Departure:</small> <strong>{inspectTrip.date}</strong></div>
              <div><small style={{ color: 'var(--muted)' }}>Passengers:</small> <strong>{inspectTrip.pax}</strong></div>
            </div>
            <div className="modal-action-bar" style={{ justifyContent: 'space-between' }}>
              <Button kind="primary" onClick={() => updateTripStatus(inspectTrip.id, 'Serviceable')}>
                Confirm Flight & Clear Slots
              </Button>
              <Button onClick={() => setInspectTrip(null)}>Close</Button>
            </div>
          </div>
        </ProtoModal>
      )}
    </>
  );
}

// =========================================================================
// 15. CRM: Quotations & Estimates
// =========================================================================
export function QuotationsView({ setToast = () => {}, Icon, StatusBadge, Button = DefaultBtn, PageHeader, Card, KpiCard }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [inspectQuote, setInspectQuote] = useState(null);
  const [form, setForm] = useState({ client: '', trip: '', estHours: '4.0', rate: '4500' });
  const [quotes, setQuotes] = useState([
    { id: 'QT-2026-14', client: 'Zenith Aviation Holdings', trip: 'BOM - DEL - BOM Charter (VT-AVA)', estHours: '4.8 FH', amount: '$21,600', valid: '30 Apr 2026', status: 'Serviceable' },
    { id: 'QT-2026-19', client: 'Apex Private Charters', trip: 'BOM - BLR Line Support & Ferry Flight', estHours: '3.2 FH', amount: '$14,400', valid: '05 May 2026', status: 'In progress' },
    { id: 'QT-2026-22', client: 'Titan Aero Leasing', trip: 'HYD - BOM Executive Trip (VT-AVC)', estHours: '2.4 FH', amount: '$10,800', valid: '08 May 2026', status: 'Awaiting review' },
  ]);

  const handleCreate = e => {
    e.preventDefault();
    if (!form.client.trim()) return;
    const id = `QT-2026-${23 + quotes.length}`;
    const total = Math.round((Number(form.estHours) || 3) * (Number(form.rate) || 4500));
    const newQ = {
      id,
      client: form.client.trim(),
      trip: form.trip || 'Charter Flight Route',
      estHours: `${form.estHours} FH`,
      amount: `$${total.toLocaleString()}`,
      valid: 'In 14 days',
      status: 'Awaiting review',
    };
    setQuotes([newQ, ...quotes]);
    setModalOpen(false);
    setForm({ client: '', trip: '', estHours: '4.0', rate: '4500' });
    setToast(`${id} quotation generated`);
  };

  const updateQuoteStatus = (id, newStatus) => {
    setQuotes(quotes.map(q => q.id === id ? { ...q, status: newStatus } : q));
    setToast(`Updated quotation ${id} to ${newStatus}`);
    if (inspectQuote?.id === id) setInspectQuote({ ...inspectQuote, status: newStatus });
  };

  return (
    <>
      <PageHeader title="Quotations &amp; Trip Estimates" description="Hourly charter rate calculations, ferry fuel estimates, and formal owner quotation bids.">
        <Button kind="primary" icon="plus" onClick={() => setModalOpen(true)}>New Quotation</Button>
      </PageHeader>

      <section className="kpi-strip">
        <KpiCard label="Active Bid Value" value={`$${quotes.reduce((acc, q) => acc + parseInt(q.amount.replace(/[^0-9]/g, '') || 0), 0).toLocaleString()}`} note="Pipeline Volume" />
        <KpiCard label="Conversion Rate" value="76%" note="Client Acceptance" />
        <KpiCard label="Pending Approval" value={quotes.filter(q => q.status === 'Awaiting review').length} note="Review Required" tone="warn" />
        <KpiCard label="Avg Turnaround" value="2.4 h" note="Rapid Response" />
      </section>

      <div className="card flush-card">
        <div className="table-responsive">
          <table className="erp-table">
            <thead>
              <tr>
                <th>Quote Reference</th>
                <th>Client / Requester</th>
                <th>Routing / Mission Scope</th>
                <th>Estimated Hours</th>
                <th>Quoted Value</th>
                <th>Validity Until</th>
                <th>Bid Status</th>
                <th className="th-action">Action</th>
              </tr>
            </thead>
            <tbody>
              {quotes.map(q => (
                <tr key={q.id} onClick={() => setInspectQuote(q)} className="click-row">
                  <td><span className="ref-badge">{q.id}</span></td>
                  <td><strong>{q.client}</strong></td>
                  <td>{q.trip}</td>
                  <td>{q.estHours}</td>
                  <td><strong>{q.amount}</strong></td>
                  <td>{q.valid}</td>
                  <td><StatusBadge value={q.status} /></td>
                  <td className="cell-action" onClick={e => e.stopPropagation()}>
                    <Button kind="text" onClick={() => updateQuoteStatus(q.id, q.status === 'Serviceable' ? 'In progress' : 'Serviceable')}>
                      {q.status === 'Serviceable' ? 'Re-estimate' : 'Accept'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <ProtoModal title="Generate Quotation" subtitle="Calculate hourly charter billings and fuel allocations" onClose={() => setModalOpen(false)}>
          <form onSubmit={handleCreate} className="modal-form">
            <label className="form-field">
              <span>Client / Requester *</span>
              <input required value={form.client} onChange={e => setForm({ ...form, client: e.target.value })} placeholder="e.g. Zenith Aviation" />
            </label>
            <label className="form-field">
              <span>Routing / Scope *</span>
              <input required value={form.trip} onChange={e => setForm({ ...form, trip: e.target.value })} placeholder="e.g. BOM - DEL Return Same Day" />
            </label>
            <div className="form-two-col">
              <label className="form-field">
                <span>Estimated Flight Hours</span>
                <input value={form.estHours} onChange={e => setForm({ ...form, estHours: e.target.value })} placeholder="e.g. 4.5" />
              </label>
              <label className="form-field">
                <span>Hourly Rate ($)</span>
                <input value={form.rate} onChange={e => setForm({ ...form, rate: e.target.value })} placeholder="e.g. 4500" />
              </label>
            </div>
            <div className="modal-action-bar">
              <Button onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button kind="primary" type="submit">Compile Quote</Button>
            </div>
          </form>
        </ProtoModal>
      )}

      {inspectQuote && (
        <ProtoModal title={inspectQuote.id} subtitle={inspectQuote.client} onClose={() => setInspectQuote(null)}>
          <div style={{ display: 'grid', gap: '14px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', background: '#F8FAFC', padding: '12px 14px', borderRadius: '8px' }}>
              <div><small style={{ color: 'var(--muted)' }}>Quoted Amount:</small> <strong>{inspectQuote.amount}</strong></div>
              <div><small style={{ color: 'var(--muted)' }}>Flight Hours:</small> <strong>{inspectQuote.estHours}</strong></div>
              <div><small style={{ color: 'var(--muted)' }}>Validity:</small> <strong>{inspectQuote.valid}</strong></div>
              <div><small style={{ color: 'var(--muted)' }}>Status:</small> <strong>{inspectQuote.status}</strong></div>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--ink)' }}>{inspectQuote.trip}</p>
            <div className="modal-action-bar" style={{ justifyContent: 'space-between' }}>
              <Button kind="primary" onClick={() => updateQuoteStatus(inspectQuote.id, 'Serviceable')}>
                Mark as Accepted by Client
              </Button>
              <Button onClick={() => setInspectQuote(null)}>Close</Button>
            </div>
          </div>
        </ProtoModal>
      )}
    </>
  );
}

// =========================================================================
// 16. System: User & Role Management
// =========================================================================
export function UserRolesView({ setToast = () => {}, Icon, StatusBadge, Button = DefaultBtn, PageHeader, Card, KpiCard }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [inspectRole, setInspectRole] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', role: 'CAMO Manager' });
  const [roles, setRoles] = useState([
    { role: 'CAMO Manager', desc: 'Full airworthiness sign-off, AD compliance authority, and audit release', users: '2 Users', perm: 'Full Admin & Sign-off', status: 'Serviceable', signoff: true },
    { role: 'Chief Engineer (AME Cat B1)', desc: 'Work order execution, technical log sign-off, defect rectification', users: '4 Users', perm: 'Technical Release', status: 'Serviceable', signoff: true },
    { role: 'Avionics Specialist (AME Cat B2)', desc: 'Radar, avionics LRU testing, instrument sign-off', users: '2 Users', perm: 'Avionics Release', status: 'Serviceable', signoff: true },
    { role: 'Procurement Specialist', desc: 'Purchase orders, parts inventory management, supplier approvals', users: '2 Users', perm: 'Supply Chain Admin', status: 'Serviceable', signoff: false },
    { role: 'Finance Controller', desc: 'Invoicing, accounts receivable/payable, operating expenses', users: '2 Users', perm: 'Finance Read/Write', status: 'Serviceable', signoff: false },
    { role: 'Flight Operations Dispatcher', desc: 'Charter enquiries, trip requests, FDTL monitoring', users: '2 Users', perm: 'Ops & Roster Admin', status: 'Serviceable', signoff: false },
  ]);

  const handleInvite = e => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return;
    setModalOpen(false);
    setToast(`Invitation dispatched to ${form.email} (${form.role})`);
    setForm({ name: '', email: '', role: 'CAMO Manager' });
  };

  const toggleSignoff = roleName => {
    setRoles(roles.map(r => r.role === roleName ? { ...r, signoff: !r.signoff } : r));
    setToast(`Updated sign-off authority for ${roleName}`);
  };

  return (
    <>
      <PageHeader title="User &amp; Role Management (RBAC)" description="Role-based access control, CAMO sign-off authority levels, and audit trail permissions.">
        <Button kind="primary" icon="plus" onClick={() => setModalOpen(true)}>Invite New User</Button>
      </PageHeader>

      <section className="kpi-strip">
        <KpiCard label="Configured Roles" value={roles.length} note="Operational Tiers" />
        <KpiCard label="Active Accounts" value="14 Personnel" note="Two-Factor Verified" />
        <KpiCard label="Sign-Off Authority" value={roles.filter(r => r.signoff).length} note="Authorized Roles" />
        <KpiCard label="Audit Logging" value="100%" note="Permanent Traceability" />
      </section>

      <div className="card flush-card">
        <div className="table-responsive">
          <table className="erp-table">
            <thead>
              <tr>
                <th>Security Role</th>
                <th>Responsibilities / Authority Scope</th>
                <th>Assigned Personnel</th>
                <th>System Permission Level</th>
                <th>Sign-Off Authority</th>
                <th className="th-action">Toggle Authority</th>
              </tr>
            </thead>
            <tbody>
              {roles.map(r => (
                <tr key={r.role} onClick={() => setInspectRole(r)} className="click-row">
                  <td><strong>{r.role}</strong></td>
                  <td>{r.desc}</td>
                  <td>{r.users}</td>
                  <td><span className="ref-badge">{r.perm}</span></td>
                  <td><StatusBadge value={r.signoff ? 'Serviceable' : 'In progress'} /></td>
                  <td className="cell-action" onClick={e => e.stopPropagation()}>
                    <Button kind="text" onClick={() => toggleSignoff(r.role)}>
                      {r.signoff ? 'Revoke' : 'Authorize'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <ProtoModal title="Invite New System User" subtitle="Assign security role and technical authority" onClose={() => setModalOpen(false)}>
          <form onSubmit={handleInvite} className="modal-form">
            <label className="form-field">
              <span>Full Name *</span>
              <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Rahul Verma" />
            </label>
            <label className="form-field">
              <span>Work Email *</span>
              <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="e.g. rahul.verma@avajet.aero" />
            </label>
            <label className="form-field">
              <span>Security Role</span>
              <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                {roles.map(r => <option key={r.role}>{r.role}</option>)}
              </select>
            </label>
            <div className="modal-action-bar">
              <Button onClick={() => setModalOpen(false)}>Cancel</Button>
              <Button kind="primary" type="submit">Dispatch Invitation</Button>
            </div>
          </form>
        </ProtoModal>
      )}

      {inspectRole && (
        <ProtoModal title={inspectRole.role} subtitle={inspectRole.perm} onClose={() => setInspectRole(null)}>
          <div style={{ display: 'grid', gap: '14px' }}>
            <p style={{ fontSize: '13px', color: '#4A5E72', margin: 0 }}>{inspectRole.desc}</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', background: '#F8FAFC', padding: '12px 14px', borderRadius: '8px' }}>
              <div><small style={{ color: 'var(--muted)' }}>Assigned Accounts:</small> <strong>{inspectRole.users}</strong></div>
              <div><small style={{ color: 'var(--muted)' }}>Airworthiness Sign-off:</small> <strong>{inspectRole.signoff ? 'Authorized' : 'Disabled'}</strong></div>
            </div>
            <div className="modal-action-bar" style={{ justifyContent: 'space-between' }}>
              <Button kind="primary" onClick={() => toggleSignoff(inspectRole.role)}>
                {inspectRole.signoff ? 'Revoke Sign-off Rights' : 'Grant Sign-off Rights'}
              </Button>
              <Button onClick={() => setInspectRole(null)}>Close</Button>
            </div>
          </div>
        </ProtoModal>
      )}
    </>
  );
}
