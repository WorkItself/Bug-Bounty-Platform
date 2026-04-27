import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import axiosInstance from '../utils/axiosInstance';
import {
  Plus, FileText, BarChart2, Globe,
  ShieldCheck, Clock, CheckCircle, XCircle,
} from 'lucide-react';

interface Program { id: number; programName: string; isActive: boolean; ownerId: number; rewardCritical?: number; rewardHigh?: number; }
interface Report  { id: number; title: string; severity: number; status: number; reporterId: number; programId: number; }

const SEV: Record<number, { label: string; color: string; bg: string }> = {
  1: { label: 'Low',      color: '#16a34a', bg: '#DCFCE7' },
  2: { label: 'Medium',   color: '#d97706', bg: '#FEF3C7' },
  3: { label: 'High',     color: '#ea580c', bg: '#FFEDD5' },
  4: { label: 'Critical', color: '#dc2626', bg: '#FEE2E2' },
};

const STATUS: Record<number, { label: string; color: string }> = {
  1: { label: 'New',      color: '#6B7280' },
  2: { label: 'Triaged',  color: '#3b82f6' },
  3: { label: 'Accepted', color: '#16a34a' },
  4: { label: 'Fixed',    color: '#0ea5e9' },
  5: { label: 'Rewarded', color: '#8b5cf6' },
  6: { label: 'Rejected', color: '#dc2626' },
};

const fmt = (n?: number) => n == null ? '—' : n >= 1000 ? '$' + (n / 1000).toFixed(n % 1000 === 0 ? 0 : 1) + 'k' : '$' + n;

function StatCard({ icon, label, value, color, sub }: { icon: React.ReactNode; label: string; value: string; color: string; sub?: string }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <span style={{ color }}>{icon}</span>
      </div>
      <div>
        <p style={{ margin: '0 0 0.15rem', fontSize: '0.75rem', fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
        <p style={{ margin: '0 0 0.1rem', fontSize: '1.6rem', fontWeight: 800, color, lineHeight: 1.1 }}>{value}</p>
        {sub && <p style={{ margin: 0, fontSize: '0.72rem', color: '#9CA3AF' }}>{sub}</p>}
      </div>
    </div>
  );
}

const CompanyDashboard = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [reports,  setReports]  = useState<Report[]>([]);
  const [loading,  setLoading]  = useState(true);

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
  const pendingReports  = reports.filter(r => r.status === 1 || r.status === 2).length;
  const acceptedReports = reports.filter(r => r.status === 3 || r.status === 5).length;
  const rejectedReports = reports.filter(r => r.status === 6).length;

  const recentReports = [...reports].sort((a, b) => b.id - a.id).slice(0, 8);

  const card: React.CSSProperties = {
    background: '#fff', border: '1px solid #E5E7EB',
    borderRadius: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.75rem 1.5rem', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ margin: '0 0 0.25rem', fontSize: '1.6rem', fontWeight: 800, color: '#111', letterSpacing: '-0.02em' }}>
            Company Dashboard
          </h1>
          <p style={{ margin: 0, color: '#6B7280', fontSize: '0.9rem' }}>
            Welcome back, <strong style={{ color: '#111' }}>{user.name}</strong>
          </p>
        </div>
        <Link to="/company/add-project" style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
          padding: '0.55rem 1.1rem', background: '#3F3AFC', color: '#fff',
          borderRadius: '8px', textDecoration: 'none', fontWeight: 700, fontSize: '0.88rem',
        }}>
          <Plus size={15} /> New Program
        </Link>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1rem', marginBottom: '1.75rem' }}>
        <StatCard icon={<Globe size={20} />}       label="Active Programs" value={loading ? '…' : String(activePrograms)}  color="#3F3AFC" sub={`of ${programs.length} total`} />
        <StatCard icon={<BarChart2 size={20} />}   label="Total Reports"   value={loading ? '…' : String(totalReports)}    color="#0ea5e9" />
        <StatCard icon={<Clock size={20} />}       label="Pending Review"  value={loading ? '…' : String(pendingReports)}  color="#d97706" sub="New + Triaged" />
        <StatCard icon={<CheckCircle size={20} />} label="Accepted"        value={loading ? '…' : String(acceptedReports)} color="#16a34a" />
        <StatCard icon={<XCircle size={20} />}     label="Rejected"        value={loading ? '…' : String(rejectedReports)} color="#dc2626" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>

        {/* Programs */}
        <div style={card}>
          <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#111' }}>Your Programs</h2>
            <Link to="/company/add-project" style={{ fontSize: '0.78rem', color: '#3F3AFC', textDecoration: 'none', fontWeight: 600 }}>+ Add new</Link>
          </div>
          {loading ? (
            <p style={{ padding: '1.5rem', textAlign: 'center', color: '#9CA3AF', fontSize: '0.88rem' }}>Loading…</p>
          ) : programs.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
              <ShieldCheck size={32} color="#D1D5DB" style={{ marginBottom: '0.5rem' }} />
              <p style={{ color: '#9CA3AF', fontSize: '0.88rem', margin: '0 0 0.75rem' }}>No programs yet.</p>
              <Link to="/company/add-project" style={{ fontSize: '0.82rem', color: '#3F3AFC', fontWeight: 600, textDecoration: 'none' }}>Create your first program →</Link>
            </div>
          ) : (
            <div>
              {programs.map((p, i) => {
                const topReward = p.rewardCritical ?? p.rewardHigh;
                return (
                  <div key={p.id}
                    onClick={() => navigate(`/bounties/${p.id}`)}
                    style={{ padding: '0.85rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: i < programs.length - 1 ? '1px solid #F9FAFB' : 'none', cursor: 'pointer', transition: 'background 0.1s' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#F9FAFB'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                  >
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8rem', color: '#3F3AFC', flexShrink: 0 }}>
                      {p.programName.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: '0 0 0.1rem', fontWeight: 600, fontSize: '0.88rem', color: '#111', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.programName}</p>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: '#6B7280' }}>
                        {topReward != null ? `Top reward: ${fmt(topReward)}` : 'No rewards set'}
                      </p>
                    </div>
                    <span style={{ padding: '2px 8px', borderRadius: '10px', fontSize: '0.7rem', fontWeight: 700, background: p.isActive ? '#DCFCE7' : '#F3F4F6', color: p.isActive ? '#16a34a' : '#6B7280' }}>
                      {p.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[
            { to: '/company/add-project',  icon: <Plus size={18} />,      title: 'Create Program',   desc: 'Launch a new bug bounty program',    color: '#3F3AFC' },
            { to: '/company/reports',      icon: <FileText size={18} />,  title: 'Manage Reports',   desc: 'Review and triage all submissions',   color: '#0ea5e9' },
            { to: '/company/profile',      icon: <ShieldCheck size={18}/>,title: 'Company Profile',  desc: 'Update your public profile & handle', color: '#E81C79' },
          ].map(({ to, icon, title, desc, color }) => (
            <Link key={to} to={to} style={{ ...card, padding: '1rem 1.25rem', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '1rem', transition: 'box-shadow 0.15s' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)'}
            >
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color }}>
                {icon}
              </div>
              <div>
                <p style={{ margin: '0 0 0.1rem', fontWeight: 700, fontSize: '0.92rem', color: '#111' }}>{title}</p>
                <p style={{ margin: 0, fontSize: '0.78rem', color: '#6B7280' }}>{desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Reports */}
      <div style={card}>
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: '#111' }}>Recent Reports</h2>
          <Link to="/company/reports" style={{ fontSize: '0.78rem', color: '#3F3AFC', textDecoration: 'none', fontWeight: 600 }}>View all →</Link>
        </div>

        {loading ? (
          <p style={{ padding: '1.5rem', textAlign: 'center', color: '#9CA3AF', fontSize: '0.88rem' }}>Loading…</p>
        ) : recentReports.length === 0 ? (
          <p style={{ padding: '2rem', textAlign: 'center', color: '#9CA3AF', fontSize: '0.88rem' }}>No reports yet.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F9FAFB' }}>
                  {['Report Title', 'Program', 'Severity', 'Status', ''].map(h => (
                    <th key={h} style={{ padding: '0.6rem 1rem', textAlign: 'left', fontSize: '0.72rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #E5E7EB' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentReports.map((r, i) => {
                  const sev    = SEV[r.severity]    ?? { label: '?', color: '#6B7280', bg: '#F3F4F6' };
                  const status = STATUS[r.status]   ?? { label: '?', color: '#6B7280' };
                  const prog   = programs.find(p => p.id === r.programId);
                  return (
                    <tr key={r.id} style={{ borderBottom: i < recentReports.length - 1 ? '1px solid #F3F4F6' : 'none', cursor: 'pointer', transition: 'background 0.1s' }}
                      onClick={() => navigate(`/report/${r.id}`)}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#F9FAFB'}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                    >
                      <td style={{ padding: '0.75rem 1rem', fontSize: '0.88rem', fontWeight: 500, color: '#111', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.title}</td>
                      <td style={{ padding: '0.75rem 1rem', fontSize: '0.82rem', color: '#374151' }}>{prog?.programName ?? `#${r.programId}`}</td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <span style={{ padding: '2px 8px', borderRadius: '4px', background: sev.bg, color: sev.color, fontSize: '0.72rem', fontWeight: 700 }}>{sev.label}</span>
                      </td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <span style={{ fontSize: '0.78rem', fontWeight: 600, color: status.color }}>{status.label}</span>
                      </td>
                      <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                        <span style={{ fontSize: '0.75rem', color: '#3F3AFC', fontWeight: 600 }}>View →</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyDashboard;
