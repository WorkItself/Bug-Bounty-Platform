import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const CompanyDashboard = () => {
  const { user } = useUser();

  const stats = [
    { label: 'Active Programs', value: '4', color: '#009B77' },
    { label: 'Total Reports', value: '12', color: '#A2DFF7' },
    { label: 'Team Members', value: '8', color: '#f59e0b' },
    { label: 'Budget Spent', value: '$54,000', color: '#10b981' },
  ];

  const recentReports = [
    { id: 1, hacker: 'SecurityPro', severity: 'High', status: 'Under Review' },
    { id: 2, hacker: 'BugHunter22', severity: 'Critical', status: 'Approved' },
    { id: 3, hacker: 'VulnResearcher', severity: 'Medium', status: 'Resolved' },
  ];

  return (
    <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{
        fontSize: '2.2rem',
        fontWeight: '800',
        marginBottom: '0.5rem',
        letterSpacing: '-0.02em',
        color: '#FFFFFF'
      }}>Company Dashboard</h1>
      <p style={{
        color: '#A2DFF7',
        fontSize: '1rem',
        marginBottom: '2rem',
        fontWeight: '500'
      }}>Welcome back, {user.name}!</p>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {stats.map((stat, index) => (
          <div
            key={index}
            style={{
              background: 'linear-gradient(135deg, #1B3A57 0%, #0C1A30 100%)',
              padding: '1.5rem',
              borderRadius: '0.75rem',
              border: '1px solid #009B77',
              textAlign: 'center'
            }}
          >
            <p style={{ color: '#A2DFF7', fontSize: '0.9rem', marginBottom: '0.5rem', margin: '0 0 0.5rem 0' }}>
              {stat.label}
            </p>
            <p style={{ color: stat.color, fontSize: '2rem', fontWeight: '700', margin: 0 }}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Recent Reports */}
      <div style={{
        background: 'linear-gradient(135deg, #1B3A57 0%, #0C1A30 100%)',
        padding: '2rem',
        borderRadius: '0.75rem',
        border: '1px solid #009B77',
        marginBottom: '2rem'
      }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: '700', marginTop: 0, marginBottom: '1rem', color: '#FFFFFF' }}>
          Recent Submissions
        </h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #009B77' }}>
                <th style={{ padding: '1rem', textAlign: 'left', color: '#A2DFF7', fontWeight: '600' }}>Researcher</th>
                <th style={{ padding: '1rem', textAlign: 'left', color: '#A2DFF7', fontWeight: '600' }}>Severity</th>
                <th style={{ padding: '1rem', textAlign: 'left', color: '#A2DFF7', fontWeight: '600' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentReports.map((report) => (
                <tr key={report.id} style={{ borderBottom: '1px solid #0C1A30' }}>
                  <td style={{ padding: '1rem', color: '#FFFFFF' }}>{report.hacker}</td>
                  <td style={{ padding: '1rem', color: report.severity === 'Critical' ? '#ef4444' : report.severity === 'High' ? '#f59e0b' : '#10b981' }}>
                    {report.severity}
                  </td>
                  <td style={{ padding: '1rem', color: '#A2DFF7' }}>{report.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.5rem'
      }}>
        <Link to="/company/add-project" style={{
          background: 'linear-gradient(135deg, #1B3A57 0%, #0C1A30 100%)',
          padding: '2rem',
          borderRadius: '0.75rem',
          border: '1px solid #009B77',
          textDecoration: 'none',
          transition: 'all 0.3s ease',
          display: 'block'
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor = '#A2DFF7';
          (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor = '#009B77';
          (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
        }}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginTop: 0, marginBottom: '0.5rem', color: '#09B77' }}>
            ➕ Create Program
          </h3>
          <p style={{ color: '#A2DFF7', margin: 0 }}>Launch a new bug bounty program</p>
        </Link>

        <Link to="/company/reports" style={{
          background: 'linear-gradient(135deg, #1B3A57 0%, #0C1A30 100%)',
          padding: '2rem',
          borderRadius: '0.75rem',
          border: '1px solid #009B77',
          textDecoration: 'none',
          transition: 'all 0.3s ease',
          display: 'block'
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor = '#A2DFF7';
          (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor = '#009B77';
          (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
        }}>
          <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginTop: 0, marginBottom: '0.5rem', color: '#A2DFF7' }}>
            📋 View Reports
          </h3>
          <p style={{ color: '#A2DFF7', margin: 0 }}>Review and manage submissions</p>
        </Link>
      </div>
    </div>
  );
};

export default CompanyDashboard;
