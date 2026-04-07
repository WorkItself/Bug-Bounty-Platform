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
      <div style={{ padding:'0.6rem 1.25rem', borderTop:'1px solid #E5E7EB', background:'#FAFAFA', textAlign:'center' }}>
        <span style={{ fontSize:'0.75rem', color:'#2563EB', fontWeight:600, cursor:'pointer' }}>{viewAll} &rarr;</span>
      </div>
    )}
  </div>
);

const Leaderboard = () => {
  const [period, setPeriod] = useState('Quarter');

  return (
    <div style={{ maxWidth:'1100px', margin:'0 auto', padding:'2rem 1rem' }}>
      <header style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:'2rem' }}>
        <div>
          <h1 style={{ fontSize:'2rem', fontWeight:800, margin:'0 0 0.4rem', color:'#111', letterSpacing:'-0.02em' }}>Leaderboards</h1>
          <p style={{ margin:0, color:'#6B7280', fontSize:'0.95rem' }}>Top performing hackers across our network.</p>
        </div>
        <div style={{ display:'flex', background:'#E5E7EB', padding:'2px', borderRadius:'6px' }}>
          {['All Time', 'Year', 'Quarter', 'Month'].map(p => (
            <button key={p} onClick={() => setPeriod(p)} style={{
              border:'none', background: period === p ? '#fff' : 'transparent',
              boxShadow: period === p ? '0 1px 2px rgba(0,0,0,0.1)' : 'none',
              padding:'0.4rem 0.8rem', borderRadius:'4px', fontSize:'0.75rem', fontWeight:600,
              color: period === p ? '#111' : '#6B7280', cursor:'pointer', transition:'all 0.2s'
            }}>
              {p}
            </button>
          ))}
        </div>
      </header>

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
        />
        <LeaderTable
          title="Most Upvoted"
          subtitle="Hackers whose reports received the most community upvotes"
          rows={MOST_UPVOTED}
          cols={['Hacker','Upvotes']}
        />
      </div>
    </div>
  );
};

export default Leaderboard;
