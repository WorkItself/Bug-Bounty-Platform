import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronUp, ChevronDown } from 'lucide-react';

const PROGRAMS = [
  { id:1, name:'Google VRP', tags:['IBB','Managed'], launch:'Jun 2010', resolved:12420, maxBounty:31337, avgBounty:3200 },
  { id:2, name:'Meta Bug Bounty', tags:['Offers bounties','Managed'], launch:'Jan 2011', resolved:8934, maxBounty:50000, avgBounty:5100 },
  { id:3, name:'Shopify', tags:['Offers bounties','Active program'], launch:'Mar 2015', resolved:4102, maxBounty:10000, avgBounty:900 },
  { id:4, name:'Tesla', tags:['Active program'], launch:'Sep 2016', resolved:1230, maxBounty:15000, avgBounty:1200 },
  { id:5, name:'Cloudflare', tags:['Offers bounties','High response efficiency'], launch:'Apr 2014', resolved:3310, maxBounty:3000, avgBounty:450 },
  { id:6, name:'GitHub Security', tags:['Offers bounties','Managed'], launch:'Feb 2014', resolved:5820, maxBounty:30000, avgBounty:2750 },
  { id:7, name:'Stripe', tags:['Offers bounties','Active program'], launch:'Oct 2013', resolved:2890, maxBounty:5000, avgBounty:720 },
  { id:8, name:'Twilio', tags:['Active program'], launch:'Jul 2017', resolved:980, maxBounty:2500, avgBounty:310 },
  { id:9, name:'Vercel', tags:['Offers bounties'], launch:'Nov 2020', resolved:560, maxBounty:3000, avgBounty:480 },
  { id:10, name:'AWS VDP', tags:['Managed','High response efficiency'], launch:'Jan 2013', resolved:9800, maxBounty:undefined, avgBounty:undefined },
];

const FEATURES = ['IBB','Offers bounties','High response efficiency','Managed','Offers retesting','Active program','Collaboration'];
const ASSET_TYPES = ['Any','CIDR','Domain','iOS','Android','Source Code','API','Other Asset'];

type SortKey = 'launch' | 'resolved' | 'maxBounty' | 'avgBounty';

const fmt = (n?: number) => n == null ? 'N/A' : n >= 1000 ? '$' + (n/1000).toFixed(n%1000===0?0:1) + 'k' : '$' + n;

const BountyList = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [features, setFeatures] = useState<string[]>([]);
  const [assetType, setAssetType] = useState('Any');
  const [sortKey, setSortKey] = useState<SortKey>('resolved');
  const [sortDir, setSortDir] = useState<'asc'|'desc'>('desc');

  const toggleFeature = (f: string) =>
    setFeatures(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
  };

  const filtered = PROGRAMS
    .filter(p => p.name.toLowerCase().includes(search.toLowerCase()))
    .filter(p => features.every(f => p.tags.includes(f)))
    .sort((a, b) => {
      const va = a[sortKey] ?? (sortDir === 'asc' ? Infinity : -Infinity);
      const vb = b[sortKey] ?? (sortDir === 'asc' ? Infinity : -Infinity);
      if (typeof va === 'string') return sortDir === 'asc' ? va.localeCompare(vb as string) : (vb as string).localeCompare(va);
      return sortDir === 'asc' ? (va as number) - (vb as number) : (vb as number) - (va as number);
    });

  const SortBtn = ({ k, label }: { k: SortKey; label: string }) => (
    <th
      onClick={() => handleSort(k)}
      style={{ padding:'0.75rem 1rem', fontSize:'0.78rem', fontWeight:600, color:'#374151', textAlign:'right', cursor:'pointer', userSelect:'none', whiteSpace:'nowrap' }}
    >
      <span style={{ display:'inline-flex', alignItems:'center', gap:'2px' }}>
        {label}
        {sortKey === k
          ? (sortDir === 'asc' ? <ChevronUp size={12} color="#3F3AFC" /> : <ChevronDown size={12} color="#3F3AFC" />)
          : <ChevronDown size={12} color="#D1D5DB" />}
      </span>
    </th>
  );

  return (
    <div style={{ display:'flex', gap:'0', minHeight:'100vh', background:'#F7F9FC' }}>
      {/* Left filter panel */}
      <aside style={{ width:'220px', flexShrink:0, borderRight:'1px solid #E5E7EB', background:'#fff', padding:'1.75rem 1.5rem' }}>
        <h1 style={{ fontSize:'1.5rem', fontWeight:800, color:'#111', margin:'0 0 0.25rem' }}>Directory</h1>
        <p style={{ fontSize:'0.8rem', color:'#6B7280', margin:'0 0 1.75rem', lineHeight:1.5 }}>
          Browse all security programs across the platform.
        </p>

        <div style={{ marginBottom:'1.5rem' }}>
          <p style={{ fontSize:'0.75rem', fontWeight:700, color:'#374151', textTransform:'uppercase', letterSpacing:'0.05em', margin:'0 0 0.6rem' }}>Program features</p>
          {FEATURES.map(f => (
            <label key={f} style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'0.45rem', cursor:'pointer', fontSize:'0.82rem', color:'#374151' }}>
              <input type="checkbox" checked={features.includes(f)} onChange={() => toggleFeature(f)}
                style={{ accentColor:'#3F3AFC', width:'14px', height:'14px' }} />
              {f}
            </label>
          ))}
        </div>

        <div>
          <p style={{ fontSize:'0.75rem', fontWeight:700, color:'#374151', textTransform:'uppercase', letterSpacing:'0.05em', margin:'0 0 0.6rem' }}>Asset type</p>
          {ASSET_TYPES.map(a => (
            <label key={a} style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'0.45rem', cursor:'pointer', fontSize:'0.82rem', color:'#374151' }}>
              <input type="radio" name="asset" value={a} checked={assetType === a} onChange={() => setAssetType(a)}
                style={{ accentColor:'#3F3AFC', width:'14px', height:'14px' }} />
              {a}
            </label>
          ))}
        </div>
      </aside>

      {/* Right content */}
      <div style={{ flex:1, padding:'1.75rem 2rem', overflow:'auto' }}>
        {/* Search */}
        <div style={{ display:'flex', justifyContent:'flex-end', marginBottom:'1.25rem' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', border:'1px solid #D1D5DB', borderRadius:'6px', padding:'0.45rem 0.75rem', background:'#fff', width:'260px' }}>
            <Search size={14} color="#9CA3AF" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search programs�"
              style={{ border:'none', outline:'none', flex:1, fontSize:'0.84rem', color:'#374151', background:'transparent' }}
            />
          </div>
        </div>

        {/* Table */}
        <div style={{ background:'#fff', border:'1px solid #E5E7EB', borderRadius:'8px', overflow:'hidden' }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr style={{ borderBottom:'2px solid #E5E7EB', background:'#F9FAFB' }}>
                <th style={{ padding:'0.75rem 1rem', fontSize:'0.78rem', fontWeight:600, color:'#374151', textAlign:'left' }}>Program</th>
                <SortBtn k="launch" label="Launch date" />
                <SortBtn k="resolved" label="Reports resolved" />
                <SortBtn k="maxBounty" label="Max bounty" />
                <SortBtn k="avgBounty" label="Avg bounty" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, idx) => (
                <tr
                  key={p.id}
                  onClick={() => navigate(`/bounties/${p.id}`)}
                  style={{ borderBottom: idx < filtered.length-1 ? '1px solid #F3F4F6' : 'none', cursor:'pointer', transition:'background 0.1s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background='#F9FAFB'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background='transparent'}
                >
                  <td style={{ padding:'0.9rem 1rem' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'0.6rem' }}>
                      <div style={{ width:'32px', height:'32px', borderRadius:'6px', background:'#3F3AFC', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.7rem', fontWeight:700, color:'#fff', flexShrink:0 }}>
                        {p.name.charAt(0)}
                      </div>
                      <div>
                        <span style={{ fontWeight:600, fontSize:'0.88rem', color:'#111' }}>{p.name}</span>
                        <div style={{ display:'flex', gap:'0.3rem', marginTop:'0.2rem', flexWrap:'wrap' }}>
                          {p.tags.map(t => (
                            <span key={t} style={{ fontSize:'0.68rem', padding:'1px 6px', borderRadius:'10px', background:'#EEF2FF', color:'#4338CA', fontWeight:500 }}>{t}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding:'0.9rem 1rem', fontSize:'0.84rem', color:'#6B7280', textAlign:'right' }}>{p.launch}</td>
                  <td style={{ padding:'0.9rem 1rem', fontSize:'0.84rem', color:'#374151', fontWeight:600, textAlign:'right' }}>{p.resolved.toLocaleString()}</td>
                  <td style={{ padding:'0.9rem 1rem', fontSize:'0.84rem', color:'#374151', textAlign:'right' }}>{fmt(p.maxBounty)}</td>
                  <td style={{ padding:'0.9rem 1rem', fontSize:'0.84rem', color:'#374151', textAlign:'right' }}>{fmt(p.avgBounty)}</td>
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