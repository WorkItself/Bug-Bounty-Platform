import { useState } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

type Trend = 'up' | 'down' | 'flat';
interface LeaderRow { rank: number; name: string; country: string; val1: number; val2?: number; val3?: number; trend: Trend; }

const HIGHEST_REP: LeaderRow[] = [
  { rank:1, name:'haxta4ok00', country:'UA', val1:3892, val2:0.93, val3:0.78, trend:'up' },
  { rank:2, name:'xploited', country:'DE', val1:3450, val2:0.88, val3:0.72, trend:'flat' },
  { rank:3, name:'w2bb1t', country:'RO', val1:3211, val2:0.91, val3:0.65, trend:'up' },
  { rank:4, name:'dee__dee__', country:'IN', val1:3008, val2:0.85, val3:0.61, trend:'down' },
  { rank:5, name:'fisher_sec', country:'PL', val1:2980, val2:0.79, val3:0.58, trend:'up' },
];
const UP_AND_COMERS: LeaderRow[] = [
  { rank:1, name:'locus-x64', country:'BR', val1:842, trend:'up' },
  { rank:2, name:'hossam25', country:'EG', val1:810, trend:'up' },
  { rank:3, name:'pr1vate_eye', country:'MA', val1:776, trend:'up' },
  { rank:4, name:'y_security', country:'FR', val1:741, trend:'flat' },
  { rank:5, name:'brewm4ster', country:'US', val1:699, trend:'up' },
];
const HIGHEST_CRIT: LeaderRow[] = [
  { rank:1, name:'hunter_zero', country:'NL', val1:1204, val2:0.95, val3:0.90, trend:'up' },
  { rank:2, name:'zacoerp', country:'PK', val1:1180, val2:0.92, val3:0.87, trend:'flat' },
  { rank:3, name:'rogue_sec', country:'TR', val1:1140, val2:0.89, val3:0.84, trend:'down' },
  { rank:4, name:'xploit_nl', country:'NL', val1:1090, val2:0.87, val3:0.80, trend:'up' },
  { rank:5, name:'zer0_day', country:'RU', val1:1010, val2:0.85, val3:0.76, trend:'down' },
];
const MOST_UPVOTED: LeaderRow[] = [
  { rank:1, name:'haxta4ok00', country:'UA', val1:2341, trend:'up' },
  { rank:2, name:'xploited', country:'DE', val1:2102, trend:'flat' },
  { rank:3, name:'hunter_zero', country:'NL', val1:1980, trend:'up' },
  { rank:4, name:'dee__dee__', country:'IN', val1:1854, trend:'down' },
  { rank:5, name:'fisher_sec', country:'PL', val1:1701, trend:'up' },
];

const TrendIcon = ({ trend }: { trend: Trend }) => {
  if (trend === 'up') return <TrendingUp size={13} color="#16a34a" />;
  if (trend === 'down') return <TrendingDown size={13} color="#dc2626" />;
  return <Minus size={13} color="#9CA3AF" />;
};

interface LeaderTableProps { title: string; subtitle?: string; rows: LeaderRow[]; cols: string[]; viewAll?: string; }
const LeaderTable = ({ title, subtitle, rows, cols, viewAll }: LeaderTableProps) => (
  <div style={{ background:'#fff', border:'1px solid #E5E7EB', borderRadius:'10px', overflow:'hidden' }}>
    <div style={{ padding:'1rem 1.25rem', borderBottom:'1px solid #E5E7EB' }}>
      <h3 style={{ margin:0, fontSize:'1rem', fontWeight:700, color:'#111' }}>{title}</h3>
      {subtitle && <p style={{ margin:'0.15rem 0 0', fontSize:'0.78rem', color:'#6B7280' }}>{subtitle}</p>}
    </div>
    <table style={{ width:'100%', borderCollapse:'collapse' }}>
      <thead>
        <tr style={{ background:'#F9FAFB' }}>
          <th style={{ padding:'0.5rem 1.25rem', fontSize:'0.72rem', fontWeight:600, color:'#6B7280', textAlign:'left' }}>{cols[0]}</th>
          {cols.slice(1).map(c => (
            <th key={c} style={{ padding:'0.5rem 0.75rem', fontSize:'0.72rem', fontWeight:600, color:'#6B7280', textAlign:'right' }}>{c}</th>
          ))}
          <th style={{ width:'28px' }} />
        </tr>
      </thead>
      <tbody>
        {rows.map((r, idx) => (
          <tr key={r.rank} style={{ borderTop:'1px solid #F3F4F6', background: idx % 2 === 0 ? '#fff' : '#FAFAFA' }}>
            <td style={{ padding:'0.65rem 1.25rem', fontSize:'0.84rem' }}>
              <span style={{ fontWeight:700, color:'#6B7280', minWidth:'1.4rem', display:'inline-block' }}>{r.rank}.</span>{' '}
              <span style={{ color:'#2563EB', fontWeight:500, cursor:'pointer' }}>{r.name}</span>{' '}
              <span style={{ fontSize:'0.7rem', color:'#9CA3AF' }}>{r.country}</span>
            </td>
            <td style={{ padding:'0.65rem 0.75rem', fontSize:'0.84rem', color:'#374151', fontWeight:600, textAlign:'right' }}>{r.val1.toLocaleString()}</td>
            {r.val2 != null && <td style={{ padding:'0.65rem 0.75rem', fontSize:'0.84rem', color:'#374151', textAlign:'right' }}>{r.val2.toFixed(2)}</td>}
            {r.val3 != null && <td style={{ padding:'0.65rem 0.75rem', fontSize:'0.84rem', color:'#374151', textAlign:'right' }}>{r.val3.toFixed(2)}</td>}
            <td style={{ padding:'0.65rem 0.5rem', textAlign:'center' }}><TrendIcon trend={r.trend} /></td>
          </tr>
        ))}
      </tbody>
    </table>
    {viewAll && (
      <div style={{ padding:'0.75rem 1.25rem', borderTop:'1px solid #F3F4F6', textAlign:'center' }}>
        <span style={{ fontSize: '0.8rem', color: '#3F3AFC', fontWeight: 600, cursor: 'pointer' }}>{viewAll} &gt;</span>
      </div>
    )}
  </div>
);

const Leaderboard = () => {
  const [programTab, setProgramTab] = useState<'bbp'|'vdp'|'all'>('all');
  const [typeTab, setTypeTab] = useState<'individuals'|'collectives'>('individuals');
  const [dateRange, setDateRange] = useState('Jan - Mar 2026');

  const TAB_BTN = (active: boolean) => ({
    padding:'0.4rem 1rem', border:'none', cursor:'pointer',
    background: active ? '#3F3AFC' : 'transparent',
    color: active ? '#fff' : '#6B7280',
    borderRadius:'6px', fontWeight:600, fontSize:'0.84rem',
    transition:'all 0.15s',
  });

  return (
    <div style={{ maxWidth:'1000px', margin:'0 auto', padding:'2rem 1.5rem' }}>
      {/* Header */}
      <div style={{ marginBottom:'1.5rem' }}>
        <h1 style={{ fontSize:'1.8rem', fontWeight:800, color:'#111', margin:'0 0 0.25rem', letterSpacing:'-0.02em' }}>BountyOS Leaderboard</h1>
        <p style={{ color:'#6B7280', fontSize:'0.88rem', margin:0 }}>
          The most reputable security researchers in the community, ranked by Reputation, Signal, and Impact.
        </p>
      </div>

      {/* Controls */}
      <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'1.75rem', flexWrap:'wrap' }}>
        {(['bbp','vdp','all'] as const).map(t => (
          <button key={t} style={TAB_BTN(programTab===t)} onClick={() => setProgramTab(t)}>
            {t.toUpperCase()}
          </button>
        ))}
        <div style={{ width:'1px', height:'24px', background:'#E5E7EB', margin:'0 0.25rem' }} />
        {(['individuals','collectives'] as const).map(t => (
          <button key={t} style={TAB_BTN(typeTab===t)} onClick={() => setTypeTab(t)}>
            {t.charAt(0).toUpperCase()+t.slice(1)}
            {t==='collectives' && <span style={{ marginLeft:'0.3rem', background:'#22c55e', color:'#fff', fontSize:'0.6rem', padding:'1px 5px', borderRadius:'9px', fontWeight:700 }}>New</span>}
          </button>
        ))}
        <div style={{ marginLeft:'auto' }}>
          <select
            value={dateRange}
            onChange={e => setDateRange(e.target.value)}
            style={{ padding:'0.4rem 0.75rem', border:'1px solid #D1D5DB', borderRadius:'6px', fontSize:'0.84rem', color:'#374151', background:'#fff', cursor:'pointer', outline:'none' }}
          >
            {['Jan - Mar 2026','Oct - Dec 2025','Jul - Sep 2025','Apr - Jun 2025'].map(d => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 2x2 grid */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.25rem' }}>
        <LeaderTable
          title="Highest Reputation"
          rows={HIGHEST_REP}
          cols={['Hacker','Reputation','Signal','Impact']}
          viewAll="View all-time leaderboard"
        />
        <LeaderTable
          title="Up and Comers"
          subtitle="Hackers who earned the most reputation this period"
          rows={UP_AND_COMERS}
          cols={['Hacker','Reputation']}
          viewAll="View all rankings"
        />
        <LeaderTable
          title="Highest Critical Reputation"
          subtitle="Earned from critical vulnerability reports"
          rows={HIGHEST_CRIT}
          cols={['Hacker','Reputation','Signal','Impact']}
          viewAll="View all rankings"
        />
        <LeaderTable
          title="Most Upvoted"
          subtitle="Researchers with the most community upvotes"
          rows={MOST_UPVOTED}
          cols={['Hacker','Votes']}
          viewAll="View all rankings"
        />
      </div>
    </div>
  );
};

export default Leaderboard;