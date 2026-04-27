import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';

interface ActivityReport {
  id: number;
  title: string;
  description?: string;
  severity: number;
  status: number;
  programId: number;
  programName: string;
  reporterId: number;
  reporterName: string;
  isPublic: boolean;
  resolvedAt: string;
}

const SEV: Record<number, { label: string; color: string; bg: string }> = {
  1: { label: 'Low',      color: '#16a34a', bg: '#DCFCE7' },
  2: { label: 'Medium',   color: '#d97706', bg: '#FEF3C7' },
  3: { label: 'High',     color: '#ea580c', bg: '#FFEDD5' },
  4: { label: 'Critical', color: '#dc2626', bg: '#FEE2E2' },
};

const STATUS: Record<number, { label: string; color: string }> = {
  3: { label: 'Accepted', color: '#16a34a' },
  4: { label: 'Fixed',    color: '#0ea5e9' },
  5: { label: 'Rewarded', color: '#8b5cf6' },
  6: { label: 'Rejected', color: '#dc2626' },
};

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });

const Dashboard = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState<ActivityReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sevFilter, setSevFilter] = useState<number | 'all'>('all');

  useEffect(() => {
    axiosInstance.get('/public/activity')
      .then(res => setReports(res.data ?? []))
      .catch(() => setReports([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = reports
    .filter(r => sevFilter === 'all' || r.severity === sevFilter)
    .filter(r => !search || r.title.toLowerCase().includes(search.toLowerCase()) || r.programName.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '1.75rem 1.5rem', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>

      {/* Hero */}
      <section style={{
        marginBottom: '1.75rem', padding: '2.5rem 2rem',
        background: 'linear-gradient(135deg, #3F3AFC 0%, #E81C79 100%)',
        borderRadius: '14px', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: '-20px', right: '3%', opacity: 0.08, fontSize: '12rem', lineHeight: 1, userSelect: 'none', pointerEvents: 'none' }}>🛡</div>
        <h1 style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 800, color: '#fff', lineHeight: 1.35, margin: '0 0 0.5rem', maxWidth: '600px', letterSpacing: '-0.02em' }}>
          Activity Feed
        </h1>
        <p style={{ margin: 0, color: 'rgba(255,255,255,0.8)', fontSize: '0.95rem' }}>
          Accepted vulnerability reports from active bug bounty programs.
        </p>
      </section>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: 1, minWidth: '200px', display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid #E5E7EB', borderRadius: '8px', padding: '0.5rem 0.85rem', background: '#fff' }}>
          <svg width="14" height="14" fill="none" stroke="#9CA3AF" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search reports or programs…"
            style={{ border: 'none', outline: 'none', flex: 1, fontSize: '0.87rem', color: '#374151', background: 'transparent', fontFamily: 'inherit' }}
          />
        </div>
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          {([{ v: 'all', l: 'All' }, { v: 1, l: 'Low' }, { v: 2, l: 'Medium' }, { v: 3, l: 'High' }, { v: 4, l: 'Critical' }] as const).map(({ v, l }) => {
            const active = sevFilter === v;
            return (
              <button key={l} onClick={() => setSevFilter(v as any)}
                style={{ padding: '0.35rem 0.85rem', border: `1.5px solid ${active ? '#3F3AFC' : '#E5E7EB'}`, borderRadius: '20px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: active ? 700 : 500, background: active ? '#EEF2FF' : '#fff', color: active ? '#3F3AFC' : '#374151' }}>
                {l}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results count */}
      {!loading && (
        <p style={{ margin: '0 0 0.75rem', fontSize: '0.8rem', color: '#9CA3AF' }}>
          {filtered.length} report{filtered.length !== 1 ? 's' : ''}
        </p>
      )}

      {/* List */}
      {loading ? (
        <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '3rem', textAlign: 'center', color: '#9CA3AF' }}>Loading…</div>
      ) : filtered.length === 0 ? (
        <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '3rem', textAlign: 'center', color: '#9CA3AF' }}>
          No accepted reports yet.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {filtered.map(r => {
            const sev    = SEV[r.severity]  ?? { label: '?', color: '#6B7280', bg: '#F3F4F6' };
            const status = STATUS[r.status] ?? { label: 'Resolved', color: '#0ea5e9' };
            return (
              <div key={r.id}
                onClick={() => r.isPublic && navigate(`/report/${r.id}`)}
                style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '1.1rem 1.4rem', cursor: r.isPublic ? 'pointer' : 'default', transition: 'box-shadow 0.15s', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
                onMouseEnter={e => { if (r.isPublic) (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'; }}
                onMouseLeave={e => { if (r.isPublic) (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)'; }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    {/* Program + status row */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#374151', background: '#F3F4F6', padding: '1px 8px', borderRadius: '4px' }}>{r.programName}</span>
                      <span style={{ fontSize: '0.72rem', fontWeight: 600, color: status.color }}>● {status.label}</span>
                      {!r.isPublic && (
                        <span style={{ fontSize: '0.7rem', color: '#9CA3AF', background: '#F9FAFB', border: '1px solid #E5E7EB', padding: '1px 7px', borderRadius: '4px' }}>Private</span>
                      )}
                    </div>
                    {/* Title */}
                    <p style={{ margin: '0 0 0.35rem', fontWeight: 700, fontSize: '0.95rem', color: r.isPublic ? '#111' : '#6B7280', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {r.title}
                    </p>
                    {/* Description (public only) */}
                    {r.isPublic && r.description && (
                      <p style={{ margin: '0 0 0.5rem', fontSize: '0.82rem', color: '#6B7280', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {r.description}
                      </p>
                    )}
                    {/* Meta */}
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.75rem', color: '#9CA3AF', flexWrap: 'wrap' }}>
                      <span>by <span style={{ color: '#3F3AFC', fontWeight: 600 }}>{r.reporterName}</span></span>
                      <span>·</span>
                      <span>{fmtDate(r.resolvedAt)}</span>
                    </div>
                  </div>

                  {/* Severity badge */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.35rem', flexShrink: 0 }}>
                    <span style={{ padding: '3px 10px', borderRadius: '5px', background: sev.bg, color: sev.color, fontSize: '0.72rem', fontWeight: 700 }}>{sev.label}</span>
                    {r.isPublic && <span style={{ fontSize: '0.72rem', color: '#3F3AFC', fontWeight: 600 }}>View →</span>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
