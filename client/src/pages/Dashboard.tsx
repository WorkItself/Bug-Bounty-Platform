const Dashboard = () => {
  return (
    <div style={{ maxWidth: '1400px' }}>
      {/* Hero Section */}
      <section style={{
        marginBottom: '3rem',
        padding: '3rem 2rem',
        background: 'linear-gradient(135deg, #1B3A57 0%, #0C1A30 100%)',
        borderRadius: '0.75rem',
        border: '1px solid #009B77',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(0, 155, 119, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          transform: 'translate(50%, -50%)'
        }} />
        
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{
            fontSize: '2.8rem',
            fontWeight: '800',
            marginBottom: '1rem',
            letterSpacing: '-0.02em',
            background: 'linear-gradient(135deg, #FFFFFF 0%, #A2DFF7 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>Secure the Future. Get Paid.</h1>
          
          <p style={{
            color: '#A2DFF7',
            fontSize: '1.1rem',
            maxWidth: '600px',
            margin: '0 0 1.5rem 0',
            lineHeight: '1.6'
          }}>
            Join the world's most trusted ethical hackers. Discover vulnerabilities in top-tier infrastructure and earn substantial rewards while securing the digital ecosystem.
          </p>
          
          <button style={{
            padding: '0.75rem 1.75rem',
            background: '#009B77',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '0.5rem',
            fontWeight: '600',
            fontSize: '1rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 15px rgba(0, 155, 119, 0.3)'
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLElement).style.background = '#007A60';
            (e.target as HTMLElement).style.transform = 'translateY(-2px)';
            (e.target as HTMLElement).style.boxShadow = '0 6px 20px rgba(0, 155, 119, 0.4)';
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLElement).style.background = '#009B77';
            (e.target as HTMLElement).style.transform = 'translateY(0)';
            (e.target as HTMLElement).style.boxShadow = '0 4px 15px rgba(0, 155, 119, 0.3)';
          }}
          >
            Start Hunting Now
          </button>
        </div>
      </section>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.5rem'
      }}>
        <StatCard
          title="Total Bounties Paid"
          value="$2,450,000"
          accent="#009B77"
        />
        <StatCard
          title="Active Programs"
          value="482"
          accent="#A2DFF7"
        />
        <StatCard
          title="Vulnerabilities Fixed"
          value="12,904"
          accent="#007A60"
        />
      </div>
    </div>
  );
};

const StatCard = ({
  title,
  value,
  accent
}: {
  title: string;
  value: string;
  accent: string;
}) => (
  <div style={{
    background: 'linear-gradient(135deg, #1B3A57 0%, #0C1A30 100%)',
    padding: '1.75rem',
    borderRadius: '0.75rem',
    border: `1.5px solid ${accent}33`,
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    cursor: 'pointer'
  }}
  onMouseEnter={(e) => {
    (e.currentTarget as HTMLElement).style.borderColor = `${accent}66`;
    (e.currentTarget as HTMLElement).style.background = 'linear-gradient(135deg, #1B3A57 0%, #1B3A57 100%)';
    (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
  }}
  onMouseLeave={(e) => {
    (e.currentTarget as HTMLElement).style.borderColor = `${accent}33`;
    (e.currentTarget as HTMLElement).style.background = 'linear-gradient(135deg, #1B3A57 0%, #0C1A30 100%)';
    (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
  }}
  >
    <div style={{
      position: 'absolute',
      top: '-40px',
      right: '-40px',
      width: '120px',
      height: '120px',
      background: `${accent}15`,
      borderRadius: '50%'
    }} />
    
    <div style={{ position: 'relative', zIndex: 1 }}>
      <p style={{
        color: '#A2DFF7',
        margin: '0 0 0.5rem 0',
        fontSize: '0.9rem',
        fontWeight: '500'
      }}>{title}</p>
      
      <h3 style={{
        fontSize: '2rem',
        fontWeight: '700',
        margin: 0,
        color: accent
      }}>{value}</h3>
    </div>
  </div>
);

export default Dashboard;
