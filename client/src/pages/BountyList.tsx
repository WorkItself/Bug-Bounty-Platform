import { useNavigate } from 'react-router-dom';

const programs = [
  {
    id: 1,
    company: 'Google',
    reward: '$30,000',
    scope: 'V8 Engine, Chrome Browser',
    tier: 'CRITICAL',
    programs: 45
  },
  {
    id: 2,
    company: 'Meta',
    reward: '$45,000',
    scope: 'WhatsApp, Instagram API',
    tier: 'CRITICAL',
    programs: 38
  },
  {
    id: 3,
    company: 'Shopify',
    reward: '$10,000',
    scope: 'Payment Gateway',
    tier: 'HIGH',
    programs: 22
  },
  {
    id: 4,
    company: 'Tesla',
    reward: '$15,000',
    scope: 'Infotainment System',
    tier: 'HIGH',
    programs: 18
  }
];

const FEATURES = ['IBB','Offers bounties','High response efficiency','Managed','Offers retesting','Active program','Collaboration'];
const ASSET_TYPES = ['Any','CIDR','Domain','iOS','Android','Source Code','API','Other Asset'];

type SortKey = 'launch' | 'resolved' | 'maxBounty' | 'avgBounty';

const fmt = (n?: number) => n == null ? 'N/A' : n >= 1000 ? '$' + (n/1000).toFixed(n%1000===0?0:1) + 'k' : '$' + n;

const BountyList = () => {
  const navigate = useNavigate();

  return (
    <div style={{ width: '100%', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <header style={{ marginBottom: '2.5rem' }}>
        <h1 style={{
          fontSize: '2.2rem',
          fontWeight: '800',
          margin: '0 0 0.75rem 0',
          letterSpacing: '-0.02em',
          color: '#FFFFFF'
        }}>Bounty Programs</h1>
        <p style={{
          color: '#A2DFF7',
          fontSize: '1rem',
          margin: 0,
          fontWeight: '500'
        }}>Select a program to view scope, rules, and submission guidelines.</p>
      </header>
      
      {/* Programs Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(330px, 1fr))',
        gap: '1.5rem'
      }}>
        {programs.map((program) => {
          const tierColor = getTierColor(program.tier);
          return (
            <div
              key={program.id}
              style={{
                background: 'linear-gradient(135deg, #1B3A57 0%, #0C1A30 100%)',
                borderRadius: '0.75rem',
                padding: '1.75rem',
                border: '1px solid #009B77',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = '#A2DFF7';
                (e.currentTarget as HTMLElement).style.background = 'linear-gradient(135deg, #1B3A57 0%, #1B3A57 100%)';
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 10px 30px rgba(0, 155, 119, 0.2)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = '#009B77';
                (e.currentTarget as HTMLElement).style.background = 'linear-gradient(135deg, #1B3A57 0%, #0C1A30 100%)';
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLElement).style.boxShadow = 'none';
              }}
            >
              {/* Company Header */}
              <div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  marginBottom: '1.5rem'
                }}>
                  <div>
                    <h2 style={{
                      fontSize: '1.4rem',
                      fontWeight: '700',
                      margin: 0,
                      color: '#FFFFFF'
                    }}>{program.company}</h2>
                  </div>
                  <span style={{
                    fontSize: '0.7rem',
                    letterSpacing: '0.1em',
                    fontWeight: '700',
                    background: tierColor.bg,
                    color: tierColor.text,
                    padding: '0.4rem 0.8rem',
                    borderRadius: '0.4rem',
                    border: `1px solid ${tierColor.border}`,
                    textTransform: 'uppercase',
                    whiteSpace: 'nowrap'
                  }}>
                    {program.tier}
                  </span>
                </div>

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

              {/* Footer */}
              <div style={{
                paddingTop: '1.5rem',
                borderTop: '1px solid #009B77',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <label style={{
                    fontSize: '0.7rem',
                    color: '#A2DFF7',
                    display: 'block',
                    marginBottom: '0.5rem',
                    textTransform: 'uppercase',
                    fontWeight: '600',
                    letterSpacing: '0.05em'
                  }}>Max Bounty</label>
                  <span style={{
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    color: '#009B77'
                  }}>{program.reward}</span>
                </div>
                <button 
                onClick={() => navigate(`/bounties/${program.id}`)}
                style={{
                  background: '#009B77',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '0.75rem 1.25rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  fontWeight: '600',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.background = '#007A60';
                  (e.target as HTMLElement).style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.background = '#009B77';
                  (e.target as HTMLElement).style.transform = 'translateY(0)';
                }}
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