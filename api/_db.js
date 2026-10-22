// In-memory data store for Vercel Serverless Functions
let nextNumber = 2052;
let orders = [
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

export function getOrders() {
  return orders;
}

export function findOrder(id) {
  return orders.find(o => o.id === id);
}

export function addOrder({ aircraft, task, owner = 'CAMO', priority = 'Routine', partRequest = '—' }) {
  const id = `WO-${nextNumber++}`;
  const newOrder = {
    id,
    aircraft: aircraft || 'VT-AVA',
    task: task || 'General Maintenance',
    owner: owner || 'CAMO',
    status: 'Not started',
    priority: priority || 'Routine',
    lastUpdated: 'Just now',
    partRequest: partRequest || '—',
    handoffs: [
      { team: 'CAMO', action: 'Work order created', time: 'Just now', status: 'Not started' }
    ]
  };
  orders.unshift(newOrder);
  return newOrder;
}

export function addReview(id, { sendTo = 'CAMO review', note = '', dueDate = '' }) {
  const order = findOrder(id);
  if (!order) return null;
  order.owner = sendTo;
  order.status = 'Awaiting review';
  order.lastUpdated = 'Just now';
  let action = 'Review request sent';
  if (dueDate) action += ` · Due ${dueDate}`;
  if (note) action += ` · ${note}`;
  if (!order.handoffs) order.handoffs = [];
  order.handoffs.push({
    team: sendTo,
    action,
    time: 'Just now',
    status: order.status
  });
  return order;
}

export function getSummary() {
  const open = orders.filter(o => o.status !== 'Completed').length;
  const approvals = orders.filter(o => o.status.toLowerCase().includes('approval') || o.status.toLowerCase().includes('review')).length;
  const parts = orders.filter(o => o.partRequest && o.partRequest !== '—').length;
  return {
    openWorkOrders: open,
    waitingApprovals: approvals,
    partsToTrack: parts,
    updated: 'Live'
  };
}
