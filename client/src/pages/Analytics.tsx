const Analytics = () => {
  return (
    <div style={{ maxWidth: '1400px' }}>
      <h1 style={{
        fontSize: '2.2rem',
        fontWeight: '800',
        marginBottom: '0.75rem',
        letterSpacing: '-0.02em',
        color: '#FFFFFF'
      }}>Analytics &amp; Statistics</h1>
      <p style={{
        color: '#A2DFF7',
        fontSize: '1rem',
        marginBottom: '2rem',
        fontWeight: '500'
      }}>Track your bounty hunting performance</p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        <StatBox title="Total Earnings" value="$12,500" color="#009B77" />
        <StatBox title="Active Submissions" value="7" color="#A2DFF7" />
        <StatBox title="Accepted Reports" value="23" color="#1B3A57" />
        <StatBox title="Success Rate" value="92%" color="#009B77" />
      </div>

      <div style={{
        background: 'linear-gradient(135deg, #1B3A57 0%, #0C1A30 100%)',
        borderRadius: '0.75rem',
        border: '1px solid #1B3A57',
        padding: '2rem'
      }}>
        <h2 style={{ margin: '0 0 1.5rem 0', color: '#FFFFFF', fontSize: '1.3rem', fontWeight: '700' }}>Recent Activity</h2>
        <p style={{ color: '#A2DFF7', textAlign: 'center' }}>Detailed analytics charts coming soon</p>
      </div>
    </div>
  );
};

const StatBox = ({ title, value, color }: { title: string; value: string; color: string }) => (
  <div style={{
    background: 'linear-gradient(135deg, #0C1A30 0%, #1B3A57 100%)',
    padding: '1.5rem',
    borderRadius: '0.75rem',
    border: `1px solid ${color}33`,
    position: 'relative',
    overflow: 'hidden'
  }}>
    <div style={{
      position: 'absolute',
      top: '-40px',
      right: '-40px',
      width: '120px',
      height: '120px',
      background: `${color}15`,
      borderRadius: '50%'
    }} />
    <p style={{ color: '#A2DFF7', margin: '0 0 0.5rem 0', fontSize: '0.9rem', fontWeight: '500', position: 'relative', zIndex: 1 }}>
      {title}
    </p>
    <h3 style={{ fontSize: '1.8rem', fontWeight: '700', margin: 0, color, position: 'relative', zIndex: 1 }}>
      {value}
    </h3>
  </div>
);

export default Analytics;
