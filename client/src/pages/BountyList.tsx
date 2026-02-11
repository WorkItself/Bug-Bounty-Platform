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

const getTierColor = (tier: string): { bg: string; text: string; border: string } => {
  switch (tier) {
    case 'CRITICAL':
      return { bg: '#7f1d1d', text: '#fca5a5', border: '#dc2626' };
    case 'HIGH':
      return { bg: '#7c2d12', text: '#fdba74', border: '#f97316' };
    default:
      return { bg: '#1e3a8a', text: '#93c5fd', border: '#3b82f6' };
  }
};

const BountyList = () => {
  return (
    <div style={{ maxWidth: '1400px' }}>
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

                {/* Scope */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{
                    fontSize: '0.7rem',
                    color: '#A2DFF7',
                    display: 'block',
                    marginBottom: '0.5rem',
                    textTransform: 'uppercase',
                    fontWeight: '600',
                    letterSpacing: '0.05em'
                  }}>Scope</label>
                  <p style={{
                    margin: 0,
                    fontSize: '0.95rem',
                    color: '#A2DFF7',
                    lineHeight: '1.5'
                  }}>{program.scope}</p>
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
                <button style={{
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
                  Details
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BountyList;
