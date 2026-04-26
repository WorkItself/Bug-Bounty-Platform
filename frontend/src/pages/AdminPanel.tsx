import { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import axiosInstance from '../utils/axiosInstance';

interface PlatformUser {
  id: number;
  userName: string;
  email: string;
  role: string;
  registeredOn: string;
}

const AdminPanel = () => {
  const { user } = useUser();
  const [users, setUsers] = useState<PlatformUser[]>([]);
  const [filtered, setFiltered] = useState<PlatformUser[]>([]);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<PlatformUser | null>(null);
  const [verifyStatus, setVerifyStatus] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance.get('/users')
      .then(res => { setUsers(res.data ?? []); setFiltered(res.data ?? []); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(users.filter(u => u.userName.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)));
    setSelected(null);
  }, [search, users]);

  if (!user.isLoggedIn || user.type !== 'admin') {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <h1 style={{ color: '#ef4444', fontSize: '2rem' }}>Access Denied</h1>
        <p style={{ color: '#A2DFF7' }}>This area is restricted to administrators only.</p>
      </div>
    );
  }

  const handleVerify = async () => {
    if (!selected) return;
    setVerifyStatus('');
    try {
      await axiosInstance.patch(`/company/profile/${selected.id}/verify`);
      setVerifyStatus('Company verified successfully.');
    } catch {
      setVerifyStatus('Verification failed — company may not have a profile yet.');
    }
  };

  const roleColor = (role: string) => ({ User: '#3F3AFC', Company: '#E81C79', Admin: '#f59e0b' })[role] ?? '#999';

  return (
    <div style={{ width: '100%', maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '0.5rem', color: '#FFFFFF' }}>Admin Control Panel</h1>
      <p style={{ color: '#A2DFF7', fontSize: '1rem', marginBottom: '2rem', fontWeight: 500 }}>
        User management and company verification.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Left — user list */}
        <div style={{ background: 'linear-gradient(135deg, #1B3A57 0%, #0C1A30 100%)', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid #009B77' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem', color: '#fff' }}>Registered Users</h2>
          <input type="text" placeholder="Search by name or email…" value={search} onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', padding: '0.65rem 0.9rem', borderRadius: '6px', border: '1px solid #009B77', background: '#0C1A30', color: '#fff', marginBottom: '1.25rem', boxSizing: 'border-box', fontSize: '0.9rem' }} />

          {loading ? <p style={{ color: '#A2DFF7', textAlign: 'center' }}>Loading…</p> : (
            <div style={{ maxHeight: '500px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {filtered.map(u => (
                <div key={u.id} onClick={() => { setSelected(u); setVerifyStatus(''); }}
                  style={{ padding: '0.75rem 1rem', background: selected?.id === u.id ? '#009B77' : '#1e2a3a', borderRadius: '8px', cursor: 'pointer', border: `1px solid ${selected?.id === u.id ? '#00FF7F' : '#333'}`, color: selected?.id === u.id ? '#000' : '#fff', transition: 'all 0.15s' }}
                  onMouseEnter={e => { if (selected?.id !== u.id) e.currentTarget.style.background = '#0c1a2e'; }}
                  onMouseLeave={e => { if (selected?.id !== u.id) e.currentTarget.style.background = '#1e2a3a'; }}
                >
                  <div style={{ fontWeight: 600, marginBottom: '0.2rem' }}>{u.userName}</div>
                  <div style={{ fontSize: '0.82rem', opacity: 0.8 }}>{u.email}</div>
                  <div style={{ marginTop: '0.25rem' }}>
                    <span style={{ fontSize: '0.72rem', padding: '1px 8px', borderRadius: '10px', background: roleColor(u.role), color: '#fff', fontWeight: 700 }}>{u.role}</span>
                  </div>
                </div>
              ))}
              {filtered.length === 0 && <p style={{ color: '#A2DFF7', textAlign: 'center' }}>No users found.</p>}
            </div>
          )}
        </div>

        {/* Right — user details */}
        <div style={{ background: 'linear-gradient(135deg, #1B3A57 0%, #0C1A30 100%)', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid #009B77' }}>
          {selected ? (
            <>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.25rem', color: '#fff' }}>User Details</h2>

              {[['Username', selected.userName], ['Email', selected.email], ['Role', selected.role], ['Registered', new Date(selected.registeredOn).toLocaleDateString()]].map(([label, val]) => (
                <div key={label} style={{ marginBottom: '1rem' }}>
                  <div style={{ color: '#A2DFF7', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.2rem' }}>{label}</div>
                  <div style={{ color: '#fff', fontSize: '1rem' }}>{val}</div>
                </div>
              ))}

              {selected.role === 'Company' && (
                <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #1e3a57' }}>
                  <h3 style={{ color: '#A2DFF7', fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem' }}>Company Verification</h3>
                  <p style={{ color: '#A2DFF7', fontSize: '0.85rem', marginBottom: '1rem' }}>
                    Verified companies can create and manage bounty programs.
                  </p>
                  <button onClick={handleVerify} style={{ padding: '0.65rem 1.5rem', background: '#009B77', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '0.95rem' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#007A60'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = '#009B77'}
                  >
                    Verify Company
                  </button>
                  {verifyStatus && <p style={{ marginTop: '0.75rem', color: verifyStatus.includes('failed') ? '#ef4444' : '#4caf50', fontSize: '0.9rem' }}>{verifyStatus}</p>}
                </div>
              )}
            </>
          ) : (
            <div style={{ textAlign: 'center', color: '#A2DFF7', paddingTop: '3rem' }}>
              <p>Select a user from the list to view details.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
