import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import axiosInstance from '../utils/axiosInstance';

interface Program { id: number; programName: string; isActive: boolean; ownerId: number; }
interface Report  { id: number; title: string; severity: number; status: number; reporterId: number; programId: number; }

const severityLabel: Record<number, { label: string; color: string }> = {
  1: { label: 'Low',      color: '#52c41a' },
  2: { label: 'Medium',   color: '#ffcc00' },
  3: { label: 'High',     color: '#f59e0b' },
  4: { label: 'Critical', color: '#ef4444' },
};

const statusLabel: Record<number, string> = {
  1: 'New', 2: 'Triaged', 3: 'Accepted', 4: 'Fixed', 5: 'Rewarded', 6: 'Rejected',
};

const CompanyDashboard = () => {
  const { user } = useUser();
  const [programs, setPrograms]   = useState<Program[]>([]);
  const [reports, setReports]     = useState<Report[]>([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    axiosInstance.get('/program/getAll')
      .then(async res => {
        const mine: Program[] = (res.data ?? []).filter(
          (p: Program) => p.ownerId === parseInt(user.id ?? '0')
        );
        setPrograms(mine);

        const allReports: Report[] = [];
        await Promise.all(
          mine.map(p =>
            axiosInstance.get(`/report/program/${p.id}`)
              .then(r => allReports.push(...(r.data ?? [])))
              .catch(() => {})
          )
        );
        setReports(allReports);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const activePrograms  = programs.filter(p => p.isActive).length;
  const totalReports    = reports.length;
  const newReports      = reports.filter(r => r.status === 1).length;
  const acceptedReports = reports.filter(r => r.status === 3).length;

  const stats = [
    { label: 'Active Programs',  value: loading ? '…' : String(activePrograms),  color: '#009B77' },
    { label: 'Total Reports',    value: loading ? '…' : String(totalReports),    color: '#A2DFF7' },
    { label: 'Pending Review',   value: loading ? '…' : String(newReports),      color: '#f59e0b' },
    { label: 'Accepted',         value: loading ? '…' : String(acceptedReports), color: '#10b981' },
  ];

  const recentReports = [...reports]
    .sort((a, b) => b.id - a.id)
    .slice(0, 5);

  const card: React.CSSProperties = {
    background: 'linear-gradient(135deg, #1B3A57 0%, #0C1A30 100%)',
    padding: '1.5rem',
    borderRadius: '0.75rem',
    border: '1px solid #009B77',
  };

  return (
    <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.2rem', fontWeight: '800', marginBottom: '0.5rem', letterSpacing: '-0.02em', color: '#FFFFFF' }}>
        Company Dashboard
      </h1>
      <p style={{ color: '#A2DFF7', fontSize: '1rem', marginBottom: '2rem', fontWeight: '500' }}>
        Welcome back, {user.name}!
      </p>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {stats.map(s => (
          <div key={s.label} style={{ ...card, textAlign: 'center' }}>
            <p style={{ color: '#A2DFF7', fontSize: '0.9rem', margin: '0 0 0.5rem' }}>{s.label}</p>
            <p style={{ color: s.color, fontSize: '2rem', fontWeight: '700', margin: 0 }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Submissions */}
      <div style={{ ...card, marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.3rem', fontWeight: '700', marginTop: 0, marginBottom: '1rem', color: '#FFFFFF' }}>
          Recent Submissions
        </h2>
        {loading ? (
          <p style={{ color: '#A2DFF7', textAlign: 'center' }}>Loading…</p>
        ) : recentReports.length === 0 ? (
          <p style={{ color: '#A2DFF7', textAlign: 'center', margin: '1rem 0' }}>No reports yet.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #009B77' }}>
                  {['Title', 'Severity', 'Status'].map(h => (
                    <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', color: '#A2DFF7', fontWeight: '600', fontSize: '0.85rem' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentReports.map(r => {
                  const sev = severityLabel[r.severity] ?? { label: 'Unknown', color: '#999' };
                  return (
                    <tr key={r.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '0.75rem 1rem', color: '#FFFFFF', fontSize: '0.9rem' }}>{r.title}</td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <span style={{ color: sev.color, fontWeight: 600, fontSize: '0.85rem' }}>{sev.label}</span>
                      </td>
                      <td style={{ padding: '0.75rem 1rem', color: '#A2DFF7', fontSize: '0.85rem' }}>
                        {statusLabel[r.status] ?? 'Unknown'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Action Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {[
          { to: '/company/add-project', icon: '➕', title: 'Create Program',  desc: 'Launch a new bug bounty program' },
          { to: '/company/reports',     icon: '📋', title: 'View Reports',    desc: 'Review and manage submissions' },
        ].map(({ to, icon, title, desc }) => (
          <Link key={to} to={to} style={{ ...card, textDecoration: 'none', display: 'block', transition: 'all 0.3s ease' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#A2DFF7'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#009B77'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
          >
            <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginTop: 0, marginBottom: '0.5rem', color: '#A2DFF7' }}>
              {icon} {title}
            </h3>
            <p style={{ color: '#A2DFF7', margin: 0 }}>{desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CompanyDashboard;
