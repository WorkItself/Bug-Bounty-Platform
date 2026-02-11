const Dashboard = () => {
  return (
    <div>
      <section style={{ padding: '40px 0', borderBottom: '1px solid #334155' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Secure the Future. Get Paid.</h1>
        <p style={{ color: '#94a3b8', fontSize: '1.2rem', maxWidth: '600px' }}>
          Join the world's leading ethical hackers. Discover vulnerabilities in top-tier 
          infrastructure and earn massive rewards.
        </p>
        <button style={{ marginTop: '20px', padding: '12px 24px', background: '#38bdf8', color: '#0f172a', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer' }}>
          Start Hunting Now
        </button>
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginTop: '40px' }}>
        <StatCard title="Total Bounties Paid" value="$2,450,000" color="#10b981" />
        <StatCard title="Active Programs" value="482" color="#38bdf8" />
        <StatCard title="Vulnerabilities Fixed" value="12,904" color="#fbbf24" />
      </div>
    </div>
  );
};

const StatCard = ({ title, value, color }: { title: string, value: string, color: string }) => (
  <div style={{ background: '#1e293b', padding: '25px', borderRadius: '12px', borderLeft: `4px solid ${color}` }}>
    <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.9rem' }}>{title}</p>
    <h3 style={{ fontSize: '1.8rem', margin: '10px 0 0 0' }}>{value}</h3>
  </div>
);

export default Dashboard;
