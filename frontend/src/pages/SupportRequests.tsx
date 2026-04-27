import { useSupport } from '../context/SupportContext';

const STATUS_COLOR: Record<string, string> = {
  'Open':        '#d97706',
  'In Progress': '#3b82f6',
  'Resolved':    '#16a34a',
};

const SupportRequests = () => {
  const { requests, updateStatus } = useSupport();

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '1.75rem 1.5rem', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      <h1 style={{ margin: '0 0 0.25rem', fontSize: '1.6rem', fontWeight: 800, color: '#111', letterSpacing: '-0.02em' }}>Support Requests</h1>
      <p style={{ margin: '0 0 1.5rem', color: '#6B7280', fontSize: '0.9rem' }}>All incoming requests from users and researchers.</p>

      {!requests.length ? (
        <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '3rem', textAlign: 'center', color: '#9CA3AF', fontSize: '0.9rem' }}>
          No support requests yet.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {requests.map(r => (
            <div key={r.id} style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '1.25rem 1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.2rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.92rem', color: '#111' }}>{r.userName}</span>
                    {r.userEmail && <span style={{ fontSize: '0.8rem', color: '#6B7280' }}>— {r.userEmail}</span>}
                    {r.company && <span style={{ fontSize: '0.78rem', color: '#d97706', fontWeight: 600 }}>· {r.company}</span>}
                    {r.source === 'contact_form' && (
                      <span style={{ background: '#FDF2F8', color: '#E81C79', fontSize: '0.68rem', padding: '1px 6px', borderRadius: '4px', fontWeight: 700, border: '1px solid #FBCFE8' }}>
                        LANDING FORM
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#9CA3AF' }}>{new Date(r.createdAt).toLocaleString()}</div>
                  {r.securityObjective && (
                    <div style={{ fontSize: '0.8rem', color: '#6B7280', marginTop: '0.15rem' }}>Objective: {r.securityObjective}</div>
                  )}
                </div>
                <select
                  value={r.status}
                  onChange={e => updateStatus(r.id, e.target.value as any)}
                  style={{
                    padding: '0.35rem 0.65rem', borderRadius: '6px', fontSize: '0.82rem', fontWeight: 600,
                    border: '1.5px solid #E5E7EB', background: '#fff', cursor: 'pointer',
                    color: STATUS_COLOR[r.status] ?? '#374151',
                    outline: 'none',
                  }}
                >
                  <option>Open</option>
                  <option>In Progress</option>
                  <option>Resolved</option>
                </select>
              </div>
              <p style={{ margin: '0.75rem 0 0', color: '#374151', fontSize: '0.88rem', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{r.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SupportRequests;
