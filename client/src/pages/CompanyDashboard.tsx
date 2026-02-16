import { Link } from 'react-router-dom';

const CompanyDashboard = () => {
  const cardStyle: React.CSSProperties = {
    background: 'linear-gradient(145deg, #1e2a3a, #101822)',
    borderRadius: '12px',
    padding: '2rem',
    textAlign: 'center',
    color: '#fff',
    border: '1px solid #333',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    textDecoration: 'none',
  };

  const containerStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem',
    marginTop: '2rem',
  };

  return (
    <div style={{ padding: '2rem', color: '#e0e0e0' }}>
      <h1 style={{ textAlign: 'center', fontSize: '3rem', fontWeight: 'bold', marginBottom: '2rem' }}>
        Company Dashboard
      </h1>
      <div style={containerStyle}>
        <Link to="/company/add-project" style={cardStyle}
          onMouseOver={e => e.currentTarget.style.transform = 'translateY(-5px)'}
          onMouseOut={e => e.currentTarget.style.transform = 'translateY(0px)'}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>Add New Bounty</h2>
          <p style={{ color: '#a0a0a0' }}>Create a new bug bounty program for security researchers.</p>
        </Link>
        <Link to="/company/reports" style={cardStyle}
          onMouseOver={e => e.currentTarget.style.transform = 'translateY(-5px)'}
          onMouseOut={e => e.currentTarget.style.transform = 'translateY(0px)'}>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>View Submitted Reports</h2>
          <p style={{ color: '#a0a0a0' }}>Review and manage bug reports submitted by hackers.</p>
        </Link>
      </div>
    </div>
  );
};

export default CompanyDashboard;
