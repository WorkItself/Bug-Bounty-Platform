import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import axiosInstance from '../utils/axiosInstance';
import { Search, Check, X } from 'lucide-react';

interface Program { id: number; programName: string; }
interface Report {
  id: number; title: string; description?: string;
  severity: number; status: number; reporterId: number; programId: number;
}

const SEV: Record<number, { label: string; color: string; bg: string }> = {
  1: { label: 'Low',      color: '#16a34a', bg: '#DCFCE7' },
  2: { label: 'Medium',   color: '#d97706', bg: '#FEF3C7' },
  3: { label: 'High',     color: '#ea580c', bg: '#FFEDD5' },
  4: { label: 'Critical', color: '#dc2626', bg: '#FEE2E2' },
};

const STATUS_LIST = [
  { value: 'all', label: 'All' },
  { value: 1,     label: 'New' },
  { value: 2,     label: 'Triaged' },
  { value: 3,     label: 'Accepted' },
  { value: 4,     label: 'Fixed' },
  { value: 5,     label: 'Rewarded' },
  { value: 6,     label: 'Rejected' },
] as const;

const STATUS_COLOR: Record<number, string> = {
  1: '#6B7280', 2: '#3b82f6', 3: '#16a34a', 4: '#0ea5e9', 5: '#8b5cf6', 6: '#dc2626',
};

const ViewReports = () => {
  const { user }   = useUser();
  const navigate   = useNavigate();

  const [programs,         setPrograms]         = useState<Program[]>([]);
  const [selectedProgram,  setSelectedProgram]  = useState<number | null>(null);
  const [reports,          setReports]          = useState<Report[]>([]);
  const [search,           setSearch]           = useState('');
  const [filter,           setFilter]           = useState<number | 'all'>('all');
  const [loadingPrograms,  setLoadingPrograms]  = useState(true);
  const [loadingReports,   setLoadingReports]   = useState(false);
  const [updating,         setUpdating]         = useState<number | null>(null);

  useEffect(() => {
    axiosInstance.get('/program/getAll')
      .then(res => {
        const mine = (res.data ?? []).filter((p: any) => p.ownerId === parseInt(user.id ?? '0'));
        setPrograms(mine);
        if (mine.length > 0) setSelectedProgram(mine[0].id);
      })
      .catch(() => {})
      .finally(() => setLoadingPrograms(false));
  }, []);

  useEffect(() => {
    if (!selectedProgram) return;
    setLoadingReports(true);
    axiosInstance.get(`/report/program/${selectedProgram}`)
      .then(res => setReports(res.data ?? []))
      .catch(() => setReports([]))
      .finally(() => setLoadingReports(false));
  }, [selectedProgram]);

  const handleStatusUpdate = async (report: Report, newStatus: number) => {
    setUpdating(report.id);
    try {
      await axiosInstance.put('/report', { ...report, status: newStatus });
      setReports(prev => prev.map(r => r.id === report.id ? { ...r, status: newStatus } : r));
    } catch {}
    setUpdating(null);
  };

  const counts = STATUS_LIST.slice(1).reduce((acc, s) => {
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
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.75rem 1.5rem', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>

      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ margin: '0 0 0.2rem', fontSize: '1.6rem', fontWeight: 800, color: '#111', letterSpacing: '-0.02em' }}>Reports</h1>
        <p style={{ margin: 0, color: '#6B7280', fontSize: '0.9rem' }}>Review and manage vulnerability submissions for your programs.</p>
      </div>

      <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>

        {/* Left sidebar */}
        <div style={{ width: '210px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          {/* Programs */}
          <div style={card}>
            <p style={{ margin: 0, padding: '0.75rem 1rem 0.4rem', fontSize: '0.7rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Program</p>
            {loadingPrograms ? (
              <p style={{ padding: '0.75rem 1rem', color: '#9CA3AF', fontSize: '0.82rem' }}>Loading…</p>
            ) : programs.length === 0 ? (
              <p style={{ padding: '0.75rem 1rem', color: '#9CA3AF', fontSize: '0.82rem' }}>No programs found.</p>
            ) : programs.map(p => (
              <button key={p.id} onClick={() => setSelectedProgram(p.id)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.5rem 1rem', border: 'none', cursor: 'pointer', textAlign: 'left',
                  background: selectedProgram === p.id ? '#EEF2FF' : 'transparent',
                  color: selectedProgram === p.id ? '#3F3AFC' : '#374151',
                  fontWeight: selectedProgram === p.id ? 700 : 500,
                  fontSize: '0.85rem',
                  borderLeft: selectedProgram === p.id ? '2px solid #3F3AFC' : '2px solid transparent',
                  transition: 'all 0.1s',
                }}
                onMouseEnter={e => { if (selectedProgram !== p.id) (e.currentTarget as HTMLElement).style.background = '#F9FAFB'; }}
                onMouseLeave={e => { if (selectedProgram !== p.id) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
              >
                <div style={{ width: '22px', height: '22px', borderRadius: '5px', background: selectedProgram === p.id ? '#3F3AFC' : '#E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.62rem', fontWeight: 800, color: selectedProgram === p.id ? '#fff' : '#374151', flexShrink: 0 }}>
                  {p.programName.charAt(0).toUpperCase()}
                </div>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.programName}</span>
              </button>
            ))}
            <div style={{ height: '0.5rem' }} />
          </div>

          {/* Status filter */}
          <div style={card}>
            <p style={{ margin: 0, padding: '0.75rem 1rem 0.4rem', fontSize: '0.7rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Status</p>
            {STATUS_LIST.map(({ value, label }) => {
              const count = value === 'all' ? reports.length : (counts[value as number] ?? 0);
              const active = filter === value;
              return (
                <button key={value} onClick={() => setFilter(value as any)}
                  style={{
                    width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '0.45rem 1rem', border: 'none', cursor: 'pointer',
                    background: active ? '#EEF2FF' : 'transparent',
                    color: active ? '#3F3AFC' : '#374151',
                    fontWeight: active ? 700 : 500, fontSize: '0.85rem',
                    borderLeft: active ? '2px solid #3F3AFC' : '2px solid transparent',
                    transition: 'all 0.1s',
                  }}
                  onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = '#F9FAFB'; }}
                  onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                >
                  <span>{label}</span>
                  {count > 0 && (
                    <span style={{ background: active ? '#3F3AFC' : '#E5E7EB', color: active ? '#fff' : '#6B7280', borderRadius: '10px', padding: '1px 7px', fontSize: '0.68rem', fontWeight: 700 }}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
            <div style={{ height: '0.5rem' }} />
          </div>
        </div>

        {/* Main content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={card}>
            {/* Toolbar */}
            <div style={{ padding: '0.875rem 1.25rem', borderBottom: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '200px', display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid #E5E7EB', borderRadius: '7px', padding: '0.45rem 0.75rem', background: '#F9FAFB' }}>
                <Search size={14} color="#9CA3AF" style={{ flexShrink: 0 }} />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search reports…"
                  style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '0.85rem', color: '#374151', flex: 1 }}
                />
              </div>
              <span style={{ fontSize: '0.8rem', color: '#9CA3AF', whiteSpace: 'nowrap' }}>
                {filtered.length} result{filtered.length !== 1 ? 's' : ''}
              </span>
            </div>

            {/* Table */}
            {loadingReports ? (
              <p style={{ padding: '2rem', textAlign: 'center', color: '#9CA3AF', fontSize: '0.88rem' }}>Loading reports…</p>
            ) : filtered.length === 0 ? (
              <div style={{ padding: '3rem 2rem', textAlign: 'center' }}>
                <p style={{ color: '#9CA3AF', fontSize: '0.9rem', margin: 0 }}>
                  {search ? 'No reports match your search.' : 'No reports in this category.'}
                </p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#F9FAFB' }}>
                      {['Report', 'Severity', 'Status', 'Actions', ''].map(h => (
                        <th key={h} style={{ padding: '0.6rem 1rem', textAlign: 'left', fontSize: '0.7rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid #E5E7EB', whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((report, i) => {
                      const sev    = SEV[report.severity] ?? { label: '?', color: '#6B7280', bg: '#F3F4F6' };
                      const stColor = STATUS_COLOR[report.status] ?? '#6B7280';
                      const stLabel = STATUS_LIST.find(s => s.value === report.status)?.label ?? 'Unknown';
                      const isNew   = report.status === 1;
                      const busy    = updating === report.id;

                      return (
                        <tr key={report.id}
                          style={{ borderBottom: i < filtered.length - 1 ? '1px solid #F9FAFB' : 'none', transition: 'background 0.1s' }}
                          onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#FAFAFA'}
                          onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                        >
                          <td style={{ padding: '0.85rem 1rem', maxWidth: '300px' }}>
                            <p style={{ margin: '0 0 0.15rem', fontWeight: 600, fontSize: '0.88rem', color: '#111', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{report.title}</p>
                            <p style={{ margin: 0, fontSize: '0.75rem', color: '#9CA3AF' }}>Reporter #{report.reporterId}</p>
                          </td>

                          <td style={{ padding: '0.85rem 1rem', whiteSpace: 'nowrap' }}>
                            <span style={{ padding: '2px 9px', borderRadius: '4px', background: sev.bg, color: sev.color, fontSize: '0.72rem', fontWeight: 700 }}>
                              {sev.label}
                            </span>
                          </td>

                          <td style={{ padding: '0.85rem 1rem', whiteSpace: 'nowrap' }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.78rem', fontWeight: 600, color: stColor }}>
                              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: stColor, display: 'inline-block', flexShrink: 0 }} />
                              {stLabel}
                            </span>
                          </td>

                          <td style={{ padding: '0.85rem 1rem', whiteSpace: 'nowrap' }}>
                            {isNew ? (
                              <div style={{ display: 'flex', gap: '0.4rem' }}>
                                <button disabled={busy} onClick={() => handleStatusUpdate(report, 3)}
                                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.3rem 0.7rem', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '0.76rem', fontWeight: 700, opacity: busy ? 0.6 : 1 }}>
                                  <Check size={11} /> Accept
                                </button>
                                <button disabled={busy} onClick={() => handleStatusUpdate(report, 6)}
                                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.3rem 0.7rem', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '0.76rem', fontWeight: 700, opacity: busy ? 0.6 : 1 }}>
                                  <X size={11} /> Reject
                                </button>
                              </div>
                            ) : (
                              <span style={{ fontSize: '0.78rem', color: '#9CA3AF' }}>—</span>
                            )}
                          </td>

                          <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                            <button onClick={() => navigate(`/report/${report.id}`)}
                              style={{ padding: '0.3rem 0.8rem', background: 'transparent', border: '1px solid #D1D5DB', borderRadius: '6px', color: '#374151', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600, transition: 'all 0.1s' }}
                              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#EEF2FF'; (e.currentTarget as HTMLElement).style.borderColor = '#3F3AFC'; (e.currentTarget as HTMLElement).style.color = '#3F3AFC'; }}
                              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.borderColor = '#D1D5DB'; (e.currentTarget as HTMLElement).style.color = '#374151'; }}
                            >
                              View →
                            </button>
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
      </div>
    </div>
  );
};

export default ViewReports;
