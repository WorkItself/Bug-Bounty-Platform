import { useUser } from '../context/UserContext';

const AdminPanel = () => {
  const { user, adminEnabled, setAdminEnabled } = useUser();

  if (!user.isLoggedIn || user.type !== 'admin') {
    return (
      <div style={{
        textAlign: 'center',
        padding: '3rem 2rem'
      }}>
        <h1 style={{ color: '#ef4444', fontSize: '2rem', marginBottom: '1rem' }}>Access Denied</h1>
        <p style={{ color: '#A2DFF7' }}>This area is restricted to administrators only.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px' }}>
      <h1 style={{
        fontSize: '2.2rem',
        fontWeight: '800',
        marginBottom: '0.75rem',
        letterSpacing: '-0.02em',
        color: '#FFFFFF'
      }}>Admin Control Panel</h1>
      <p style={{
        color: '#A2DFF7',
        fontSize: '1rem',
        marginBottom: '2rem',
        fontWeight: '500'
      }}>System administration and oversight.</p>

      <div style={{
        background: 'linear-gradient(135deg, #1B3A57 0%, #0C1A30 100%)',
        padding: '2rem',
        borderRadius: '0.75rem',
        border: '1px solid #009B77'
      }}>
        <div style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '1rem', color: '#FFFFFF' }}>System Settings</h2>
          
          <div style={{
            padding: '1rem',
            background: '#0C1A30',
            borderRadius: '0.5rem',
            border: '1px solid #009B77',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <p style={{ color: '#FFFFFF', fontWeight: '600', margin: '0 0 0.25rem 0' }}>Admin Mode</p>
              <p style={{ color: '#A2DFF7', fontSize: '0.9rem', margin: 0 }}>Currently: {adminEnabled ? 'ACTIVE' : 'INACTIVE'}</p>
            </div>
            <button
              onClick={() => setAdminEnabled(!adminEnabled)}
              style={{
                padding: '0.75rem 1.5rem',
                background: adminEnabled ? '#ef4444' : '#009B77',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '0.5rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.transform = 'translateY(0)';
              }}
            >
              {adminEnabled ? 'Disable' : 'Enable'}
            </button>
          </div>
        </div>

        <div style={{
          padding: '1.5rem',
          background: '#1B3A57',
          borderRadius: '0.5rem',
          border: '1px solid #009B77'
        }}>
          <p style={{ color: '#A2DFF7', marginBottom: '0.5rem' }}>More admin features coming soon...</p>
          <p style={{ color: '#A2DFF7', fontSize: '0.9rem', margin: 0 }}>User management, analytics, and system logs will be available here.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
