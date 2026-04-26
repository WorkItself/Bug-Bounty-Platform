import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import { Search, FileText } from 'lucide-react';

interface Report {
  id: number;
  title: string;
  severity: number;
  status: number;
  programId: number;
}

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

const STATUS_FILTERS = [
  { value: 'all', label: 'All' },
  { value: 1,     label: 'New' },
  { value: 2,     label: 'Triaged' },
  { value: 3,     label: 'Accepted' },
  { value: 5,     label: 'Rewarded' },
  { value: 6,     label: 'Rejected' },
] as const;

const MySubmissions = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState('');
  const [filter,  setFilter]  = useState<number | 'all'>('all');

  useEffect(() => {
    axiosInstance.get('/report/my')
      .then(res => setReports(res.data ?? []))
      .catch(() => setReports([]))
      .finally(() => setLoading(false));
  }, []);

  const counts = STATUS_FILTERS.slice(1).reduce((acc, s) => {
    acc[s.value as number] = reports.filter(r => r.status === s.value).length;
    return acc;
  }, {} as Record<number, number>);

  const filtered = reports
    .filter(r => filter === 'all' || r.status === filter)
    .filter(r => !search || r.title.toLowerCase().includes(search.toLowerCase()));

  const card: React.CSSProperties = {
    background: '#fff', border: '1px solid #E5E7EB',
    borderRadius: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '1.75rem 1.5rem', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h1 style={{ margin: '0 0 0.2rem', fontSize: '1.6rem', fontWeight: 800, color: '#111', letterSpacing: '-0.02em' }}>My Submissions</h1>
          <p style={{ margin: 0, color: '#6B7280', fontSize: '0.9rem' }}>Track your vulnerability reports and bounty status.</p>
        </div>
        <button onClick={() => navigate('/bounties')}
          style={{ padding: '0.55rem 1.1rem', background: '#3F3AFC', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>
          + New Report
        </button>
      </div>

      {/* Summary chips */}
      {!loading && reports.length > 0 && (
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
          {STATUS_FILTERS.map(({ value, label }) => {
            const count  = value === 'all' ? reports.length : (counts[value as number] ?? 0);
            const active = filter === value;
            if (value !== 'all' && count === 0) return null;
            return (
              <button key={value} onClick={() => setFilter(value as any)}
                style={{
                  padding: '0.35rem 0.9rem', border: `1.5px solid ${active ? '#3F3AFC' : '#E5E7EB'}`,
                  borderRadius: '20px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: active ? 700 : 500,
                  background: active ? '#EEF2FF' : '#fff', color: active ? '#3F3AFC' : '#374151',
                  transition: 'all 0.1s',
                }}>
                {label} {count > 0 && <span style={{ opacity: 0.7 }}>({count})</span>}
              </button>
            );
          })}
        </div>
      )}

      {loading ? (
        <div style={{ ...card, padding: '3rem', textAlign: 'center', color: '#9CA3AF', fontSize: '0.9rem' }}>Loading…</div>
      ) : reports.length === 0 ? (
        <div style={{ ...card, padding: '3rem 2rem', textAlign: 'center' }}>
          <FileText size={40} color="#D1D5DB" style={{ marginBottom: '0.75rem' }} />
          <h3 style={{ margin: '0 0 0.4rem', color: '#111', fontSize: '1rem' }}>No submissions yet</h3>
          <p style={{ margin: '0 0 1.25rem', color: '#9CA3AF', fontSize: '0.88rem' }}>Find a vulnerability in a program and submit your first report.</p>
          <button onClick={() => navigate('/bounties')}
            style={{ padding: '0.6rem 1.4rem', background: '#3F3AFC', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '0.88rem' }}>
            Browse Programs
          </button>
        </div>
      ) : (
        <div style={card}>
          {/* Toolbar */}
          <div style={{ padding: '0.875rem 1.25rem', borderBottom: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid #E5E7EB', borderRadius: '7px', padding: '0.45rem 0.75rem', background: '#F9FAFB' }}>
              <Search size={14} color="#9CA3AF" style={{ flexShrink: 0 }} />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search reports…"
                style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '0.85rem', color: '#374151', flex: 1, fontFamily: 'inherit' }} />
            </div>
            <span style={{ fontSize: '0.8rem', color: '#9CA3AF', whiteSpace: 'nowrap' }}>
              {filtered.length} result{filtered.length !== 1 ? 's' : ''}
            </span>
          </div>

          {/* Table */}
          {filtered.length === 0 ? (
            <p style={{ padding: '2.5rem', textAlign: 'center', color: '#9CA3AF', fontSize: '0.88rem', margin: 0 }}>
              {search ? 'No reports match your search.' : 'No reports in this category.'}
            </p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#F9FAFB' }}>
                    {['Report Title', 'Program', 'Severity', 'Status', ''].map(h => (
                      <th key={h} style={{ padding: '0.6rem 1rem', textAlign: 'left', fontSize: '0.7rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid #E5E7EB', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r, i) => {
                    const sev    = SEV[r.severity]  ?? { label: '?', color: '#6B7280', bg: '#F3F4F6' };
                    const status = STATUS[r.status] ?? { label: '?', color: '#6B7280' };
                    return (
                      <tr key={r.id}
                        style={{ borderBottom: i < filtered.length - 1 ? '1px solid #F9FAFB' : 'none', cursor: 'pointer', transition: 'background 0.1s' }}
                        onClick={() => navigate(`/report/${r.id}`)}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#FAFAFA'}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                      >
                        <td style={{ padding: '0.85rem 1rem', maxWidth: '340px' }}>
                          <p style={{ margin: 0, fontWeight: 600, fontSize: '0.88rem', color: '#111', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.title}</p>
                        </td>
                        <td style={{ padding: '0.85rem 1rem', fontSize: '0.82rem', color: '#6B7280', whiteSpace: 'nowrap' }}>
                          #{r.programId}
                        </td>
                        <td style={{ padding: '0.85rem 1rem', whiteSpace: 'nowrap' }}>
                          <span style={{ padding: '2px 9px', borderRadius: '4px', background: sev.bg, color: sev.color, fontSize: '0.72rem', fontWeight: 700 }}>
                            {sev.label}
                          </span>
                        </td>
                        <td style={{ padding: '0.85rem 1rem', whiteSpace: 'nowrap' }}>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.78rem', fontWeight: 600, color: status.color }}>
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: status.color, display: 'inline-block', flexShrink: 0 }} />
                            {status.label}
                          </span>
                        </td>
                        <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                          <span style={{ fontSize: '0.78rem', color: '#3F3AFC', fontWeight: 600 }}>View →</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MySubmissions;
