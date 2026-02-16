import { useSupport } from '../context/SupportContext';

const SupportRequests = () => {
  const { requests, updateStatus } = useSupport();

  if (!requests.length) {
    return <div style={{ padding: '2rem', color: '#A2DFF7' }}>No support requests yet.</div>;
  }

  return (
    <div style={{ maxWidth: '1200px' }}>
      <h1 style={{ color: '#FFFFFF', fontSize: '2rem' }}>Support Requests</h1>
      <p style={{ color: '#A2DFF7' }}>All incoming support requests from users.</p>

      <div style={{ marginTop: '1rem', display: 'grid', gap: '1rem' }}>
        {requests.map(r => (
          <div key={r.id} style={{ padding: '1rem', background: '#0C1A30', border: '1px solid #1B3A57', borderRadius: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ color: '#A2DFF7', fontSize: '0.85rem' }}>{r.userName} — {r.userEmail ?? 'No email'}</div>
                <div style={{ color: '#fff', fontWeight: 600 }}>{new Date(r.createdAt).toLocaleString()}</div>
              </div>
              <div>
                <select value={r.status} onChange={(e) => updateStatus(r.id, e.target.value as any)} style={{ padding: '0.4rem', borderRadius: '6px', background: '#101822', color: '#fff', border: '1px solid #333' }}>
                  <option>Open</option>
                  <option>In Progress</option>
                  <option>Resolved</option>
                </select>
              </div>
            </div>
            <p style={{ marginTop: '0.75rem', color: '#A2DFF7' }}>{r.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SupportRequests;
