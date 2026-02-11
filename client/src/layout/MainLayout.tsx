import { Link, Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0f172a', color: 'white', fontFamily: 'sans-serif' }}>
      {/* SIDEBAR */}
      <nav style={{ width: '260px', background: '#1e293b', padding: '25px', borderRight: '1px solid #334155' }}>
        <h2 style={{ color: '#38bdf8', fontSize: '1.5rem', marginBottom: '40px', fontWeight: 'bold' }}>BUGBOUNTY PRO</h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <p style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '5px' }}>Public</p>
          <Link to="/" style={linkStyle}>Dashboard</Link>
          <Link to="/bounties" style={linkStyle}>Bounty List</Link>
          <Link to="/leaderboard" style={linkStyle}>Leaderboard</Link>
          <Link to="/kb" style={linkStyle}>Knowledge Base</Link>

          <p style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', marginTop: '20px', marginBottom: '5px' }}>Researcher</p>
          <Link to="/submit" style={{ ...linkStyle, color: '#fbbf24' }}>Submit Report</Link>
          <Link to="/my-submissions" style={linkStyle}>My Submissions</Link>
          <Link to="/profile" style={linkStyle}>Profile</Link>
          <Link to="/login" style={linkStyle}>Login / Register</Link>

          <p style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', marginTop: '20px', marginBottom: '5px' }}>System</p>
          <Link to="/admin" style={{ ...linkStyle, color: '#f87171' }}>Admin Panel</Link>
        </div>
      </nav>

      {/* MAIN CONTENT AREA */}
      <main style={{ flexGrow: 1, padding: '40px', overflowY: 'auto' }}>
        <Outlet />
      </main>
    </div>
  );
};

const linkStyle = {
  color: '#cbd5e1',
  textDecoration: 'none',
  fontSize: '1rem',
  padding: '8px 12px',
  borderRadius: '6px',
  transition: 'background 0.2s',
  display: 'block'
};

export default MainLayout;