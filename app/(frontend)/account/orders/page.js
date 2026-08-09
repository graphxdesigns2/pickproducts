'use client';

export default function OrdersPage() {
  // Mock data placeholder - replace with Payload fetch once the collection exists
  const orders = [];

  const activeStatuses = ['pending', 'processing', 'shipped', 'in_transit'];

  const currentOrders = orders.filter((order) =>
    activeStatuses.includes(order.status?.toLowerCase())
  );

  const pastOrders = orders.filter(
    (order) => !activeStatuses.includes(order.status?.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Panel 1: Current Orders */}
      <section id="current-orders" className="account-card">
        <div className="card-header">
          <h2>Current Orders</h2>
          <p>Track active in-transit and processing purchases.</p>
        </div>

        <div className="order-list">
          {currentOrders.length === 0 ? (
            <p style={{ color: '#9aa3b5', fontSize: '14px' }}>
              You have no active orders in progress.
            </p>
          ) : (
            currentOrders.map((order) => (
              <div className="order-item" key={order.id}>
                <div className="order-details">
                  <span className="order-number">Order #{order.id}</span>
                  <span className="order-date">Placed on {order.date}</span>
                </div>
                <div className="order-meta">
                  <span className="badge badge-success">{order.status}</span>
                  <span className="order-total">${order.total}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Panel 2: Order History */}
      <section id="order-history" className="account-card">
        <div className="card-header">
          <h2>Order History</h2>
          <p>Review your completed and archived purchases.</p>
        </div>

        <div className="order-list">
          {pastOrders.length === 0 ? (
            <p style={{ color: '#9aa3b5', fontSize: '14px' }}>
              You haven't placed any past orders yet.
            </p>
          ) : (
            pastOrders.map((order) => (
              <div className="order-item" key={order.id}>
                <div className="order-details">
                  <span className="order-number">Order #{order.id}</span>
                  <span className="order-date">Placed on {order.date}</span>
                </div>
                <div className="order-meta">
                  <span className="badge badge-success">{order.status}</span>
                  <span className="order-total">${order.total}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}