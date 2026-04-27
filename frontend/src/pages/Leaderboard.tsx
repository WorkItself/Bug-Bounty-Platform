import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface LeaderboardEntry {
  rank: number;
  userName: string;
  totalSubmitted: number;
  totalAccepted: number;
  totalCritical: number;
}

interface LeaderboardResult {
  entries: LeaderboardEntry[];
  totalCount: number;
  page: number;
  pageSize: number;
}

type SortMode = 'submitted' | 'accepted' | 'critical';

const PAGE_SIZE = 10;

const SORT_OPTIONS: { value: SortMode; label: string }[] = [
  { value: 'submitted', label: 'Most Submitted' },
  { value: 'accepted',  label: 'Most Accepted'  },
  { value: 'critical',  label: 'Most Critical'  },
];

const MEDAL: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' };

const Leaderboard = () => {
  const [sort, setSort]       = useState<SortMode>('submitted');
  const [page, setPage]       = useState(1);
  const [data, setData]       = useState<LeaderboardResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axiosInstance.get(`/leaderboard?sort=${sort}&page=${page}&pageSize=${PAGE_SIZE}`)
      .then(res => setData(res.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [sort, page]);

  const handleSort = (s: SortMode) => {
    if (s === sort) return;
    setSort(s);
    setPage(1);
  };

  const totalPages = data ? Math.ceil(data.totalCount / PAGE_SIZE) : 1;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1rem', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>

      {/* Header */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h1 style={{ margin: '0 0 0.3rem', fontSize: '1.7rem', fontWeight: 800, color: '#111', letterSpacing: '-0.02em' }}>Leaderboard</h1>
        <p style={{ margin: 0, color: '#6B7280', fontSize: '0.9rem' }}>Top bug hunters ranked by their submission activity.</p>
      </div>

      {/* Sort tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
        {SORT_OPTIONS.map(({ value, label }) => (
          <button key={value} onClick={() => handleSort(value)} style={{
            padding: '0.4rem 1rem', border: 'none', borderRadius: '6px', cursor: 'pointer',
            fontWeight: 600, fontSize: '0.85rem', transition: 'all 0.15s',
            background: sort === value ? '#3F3AFC' : '#F3F4F6',
            color: sort === value ? '#fff' : '#374151',
          }}>
            {label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F9FAFB' }}>
              {['Rank', 'Hunter', 'Submitted', 'Accepted', 'Critical'].map(h => (
                <th key={h} style={{ padding: '0.65rem 1.25rem', textAlign: h === 'Hunter' ? 'left' : 'right', fontSize: '0.72rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid #E5E7EB', whiteSpace: 'nowrap' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: '#9CA3AF', fontSize: '0.9rem' }}>Loading…</td></tr>
            ) : !data || data.entries.length === 0 ? (
              <tr><td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: '#9CA3AF', fontSize: '0.9rem' }}>No data yet.</td></tr>
            ) : data.entries.map((row, i) => {
              const isTop = row.rank <= 3;
              return (
                <tr key={row.userName}
                  style={{ borderBottom: i < data.entries.length - 1 ? '1px solid #F3F4F6' : 'none', transition: 'background 0.1s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#FAFAFA'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                >
                  {/* Rank */}
                  <td style={{ padding: '0.85rem 1.25rem', textAlign: 'right', width: '60px' }}>
                    {MEDAL[row.rank]
                      ? <span style={{ fontSize: '1.1rem' }}>{MEDAL[row.rank]}</span>
                      : <span style={{ fontWeight: 700, color: '#9CA3AF', fontSize: '0.88rem' }}>{row.rank}</span>
                    }
                  </td>
                  {/* Username */}
                  <td style={{ padding: '0.85rem 1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <div style={{
                        width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0,
                        background: isTop ? 'linear-gradient(135deg, #3F3AFC, #E81C79)' : '#EEF2FF',
                        color: isTop ? '#fff' : '#3F3AFC',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 800, fontSize: '0.82rem',
                      }}>
                        {row.userName.charAt(0).toUpperCase()}
                      </div>
                      <Link to={`/u/${row.userName}`} style={{ fontWeight: 600, fontSize: '0.9rem', color: '#111', textDecoration: 'none' }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#3F3AFC'}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = '#111'}
                      >
                        {row.userName}
                      </Link>
                    </div>
                  </td>
                  {/* Stats */}
                  <td style={{ padding: '0.85rem 1.25rem', textAlign: 'right', fontWeight: sort === 'submitted' ? 700 : 400, fontSize: '0.88rem', color: sort === 'submitted' ? '#3F3AFC' : '#374151' }}>
                    {row.totalSubmitted}
                  </td>
                  <td style={{ padding: '0.85rem 1.25rem', textAlign: 'right', fontWeight: sort === 'accepted' ? 700 : 400, fontSize: '0.88rem', color: sort === 'accepted' ? '#3F3AFC' : '#374151' }}>
                    {row.totalAccepted}
                  </td>
                  <td style={{ padding: '0.85rem 1.25rem', textAlign: 'right', fontWeight: sort === 'critical' ? 700 : 400, fontSize: '0.88rem', color: sort === 'critical' ? '#dc2626' : '#374151' }}>
                    {row.totalCritical}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {data && data.totalCount > PAGE_SIZE && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem' }}>
          <span style={{ fontSize: '0.82rem', color: '#6B7280' }}>
            Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, data.totalCount)} of {data.totalCount}
          </span>
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              style={{ padding: '0.35rem 0.6rem', border: '1px solid #E5E7EB', borderRadius: '6px', background: page === 1 ? '#F9FAFB' : '#fff', cursor: page === 1 ? 'not-allowed' : 'pointer', color: page === 1 ? '#D1D5DB' : '#374151', display: 'flex', alignItems: 'center' }}>
              <ChevronLeft size={15} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
              .reduce<(number | '...')[]>((acc, p, i, arr) => {
                if (i > 0 && (p as number) - (arr[i - 1] as number) > 1) acc.push('...');
                acc.push(p);
                return acc;
              }, [])
              .map((p, i) =>
                p === '...'
                  ? <span key={`e${i}`} style={{ padding: '0.35rem 0.5rem', fontSize: '0.82rem', color: '#9CA3AF' }}>…</span>
                  : <button key={p} onClick={() => setPage(p as number)} style={{
                      padding: '0.35rem 0.65rem', border: '1px solid', borderRadius: '6px', cursor: 'pointer',
                      borderColor: page === p ? '#3F3AFC' : '#E5E7EB',
                      background: page === p ? '#3F3AFC' : '#fff',
                      color: page === p ? '#fff' : '#374151',
                      fontWeight: page === p ? 700 : 400, fontSize: '0.82rem',
                    }}>{p}</button>
              )
            }
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              style={{ padding: '0.35rem 0.6rem', border: '1px solid #E5E7EB', borderRadius: '6px', background: page === totalPages ? '#F9FAFB' : '#fff', cursor: page === totalPages ? 'not-allowed' : 'pointer', color: page === totalPages ? '#D1D5DB' : '#374151', display: 'flex', alignItems: 'center' }}>
              <ChevronRight size={15} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
