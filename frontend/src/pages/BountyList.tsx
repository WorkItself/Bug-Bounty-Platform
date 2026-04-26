import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronUp, ChevronDown } from 'lucide-react';
import axiosInstance from '../utils/axiosInstance';

interface Program {
  id: number;
  programName: string;
  programDescription?: string;
  rewardCritical?: number;
  rewardHigh?: number;
  rewardMedium?: number;
  rewardLow?: number;
  rewardInformational?: number;
  ownerId: number;
  isActive: boolean;
}

type SortKey = 'programName' | 'topReward';

const fmt = (n: number) => n >= 1000 ? '$' + (n / 1000).toFixed(n % 1000 === 0 ? 0 : 1) + 'k' : '$' + n;

const topReward = (p: Program) =>
  p.rewardCritical ?? p.rewardHigh ?? p.rewardMedium ?? p.rewardLow ?? p.rewardInformational ?? 0;

const BountyList = () => {
  const navigate = useNavigate();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('topReward');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    axiosInstance.get('/program/getAll')
      .then(res => setPrograms(res.data ?? []))
      .catch(() => setPrograms([]))
      .finally(() => setLoading(false));
  }, []);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
  };

  const filtered = programs
    .filter(p => p.programName.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortKey === 'programName') {
        return sortDir === 'asc' ? a.programName.localeCompare(b.programName) : b.programName.localeCompare(a.programName);
      }
      const va = topReward(a), vb = topReward(b);
      return sortDir === 'asc' ? va - vb : vb - va;
    });

  const SortBtn = ({ k, label }: { k: SortKey; label: string }) => (
    <th onClick={() => handleSort(k)} style={{ padding: '0.75rem 1rem', fontSize: '0.78rem', fontWeight: 600, color: '#374151', textAlign: 'right', cursor: 'pointer', userSelect: 'none', whiteSpace: 'nowrap' }}>
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '2px' }}>
        {label}
        {sortKey === k
          ? (sortDir === 'asc' ? <ChevronUp size={12} color="#3F3AFC" /> : <ChevronDown size={12} color="#3F3AFC" />)
          : <ChevronDown size={12} color="#D1D5DB" />}
      </span>
    </th>
  );

  return (
    <div style={{ display: 'flex', gap: '0', minHeight: '100vh', background: '#F7F9FC' }}>
      <aside style={{ width: '220px', flexShrink: 0, borderRight: '1px solid #E5E7EB', background: '#fff', padding: '1.75rem 1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111', margin: '0 0 0.25rem' }}>Directory</h1>
        <p style={{ fontSize: '0.8rem', color: '#6B7280', margin: '0 0 1.75rem', lineHeight: 1.5 }}>
          Browse all security programs across the platform.
        </p>
        <div>
          <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 0.6rem' }}>Status</p>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.45rem', cursor: 'pointer', fontSize: '0.82rem', color: '#374151' }}>
            <input type="checkbox" defaultChecked style={{ accentColor: '#3F3AFC', width: '14px', height: '14px' }} />
            Active programs
          </label>
        </div>
      </aside>

      <div style={{ flex: 1, padding: '1.75rem 2rem', overflow: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid #D1D5DB', borderRadius: '6px', padding: '0.45rem 0.75rem', background: '#fff', width: '260px' }}>
            <Search size={14} color="#9CA3AF" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search programs..."
              style={{ border: 'none', outline: 'none', flex: 1, fontSize: '0.84rem', color: '#374151', background: 'transparent' }} />
          </div>
        </div>

        <div style={{ background: '#fff', borderRadius: '8px', border: '1px solid #E5E7EB', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#F9FAFB', borderBottom: '1px solid #E5E7EB' }}>
                <th style={{ padding: '0.75rem 1rem', fontSize: '0.78rem', fontWeight: 600, color: '#374151' }}>Program</th>
                <SortBtn k="topReward" label="Top Reward" />
                <th style={{ padding: '0.75rem 1rem', fontSize: '0.78rem', fontWeight: 600, color: '#374151', textAlign: 'right' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={3} style={{ padding: '2rem', textAlign: 'center', color: '#6B7280', fontSize: '0.9rem' }}>Loading programs…</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={3} style={{ padding: '2rem', textAlign: 'center', color: '#6B7280', fontSize: '0.9rem' }}>No programs found.</td></tr>
              ) : filtered.map(p => (
                <tr key={p.id} onClick={() => navigate(`/bounties/${p.id}`)}
                  style={{ borderBottom: '1px solid #F3F4F6', cursor: 'pointer', transition: 'background 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#F9FAFB'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{ padding: '0.9rem 1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '6px', background: '#3F3AFC', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                        {p.programName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <span style={{ fontWeight: 600, fontSize: '0.88rem', color: '#111' }}>{p.programName}</span>
                        {p.programDescription && (
                          <div style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: '0.15rem', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {p.programDescription}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '0.9rem 1rem', fontSize: '0.84rem', fontWeight: 700, color: '#dc2626', textAlign: 'right' }}>
                    {topReward(p) > 0 ? fmt(topReward(p)) : '—'}
                  </td>
                  <td style={{ padding: '0.9rem 1rem', textAlign: 'right' }}>
                    <span style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: '10px', background: p.isActive ? '#DCFCE7' : '#F3F4F6', color: p.isActive ? '#16A34A' : '#6B7280', fontWeight: 600 }}>
                      {p.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BountyList;
