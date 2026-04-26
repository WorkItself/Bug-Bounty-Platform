import { useNavigate, Link } from 'react-router-dom';

const ChooseRole = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      background: '#F7F9FC',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif',
      padding: '2rem 1rem',
    }}>
      {/* Logo */}
      <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2.5rem' }}>
        <div style={{
          width: '32px', height: '32px',
          background: 'linear-gradient(135deg, #3F3AFC, #E81C79)',
          borderRadius: '8px', display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: '16px', fontWeight: 900, color: '#fff',
        }}>B</div>
        <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#111', letterSpacing: '-0.02em' }}>BountyOS</span>
      </Link>

      <div style={{
        background: '#fff',
        borderRadius: '16px',
        border: '1px solid #E5E7EB',
        boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
        padding: '2.5rem',
        width: '100%',
        maxWidth: '520px',
      }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#111', margin: '0 0 0.4rem', letterSpacing: '-0.02em' }}>
          Join BountyOS
        </h1>
        <p style={{ fontSize: '0.95rem', color: '#6B7280', margin: '0 0 2rem', lineHeight: 1.5 }}>
          Choose your account type to get started
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
          {/* Hacker card */}
          <RoleCard
            icon="🎯"
            title="Security Researcher"
            desc="Find vulnerabilities and earn bounty rewards"
            accentColor="#3F3AFC"
            accentBg="#EEF2FF"
            onClick={() => navigate('/register', { state: { role: 'user' } })}
          />
          {/* Company card */}
          <RoleCard
            icon="🏢"
            title="Company"
            desc="Launch a bug bounty program for your organization"
            accentColor="#E81C79"
            accentBg="#FFF0F6"
            onClick={() => navigate('/register', { state: { role: 'company' } })}
          />
        </div>

        <p style={{ textAlign: 'center', color: '#6B7280', fontSize: '0.9rem', margin: 0 }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#3F3AFC', textDecoration: 'none', fontWeight: 600 }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '0.7'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '1'}
          >Login here</Link>
        </p>
      </div>
    </div>
  );
};

interface RoleCardProps {
  icon: string;
  title: string;
  desc: string;
  accentColor: string;
  accentBg: string;
  onClick: () => void;
}

const RoleCard = ({ icon, title, desc, accentColor, accentBg, onClick }: RoleCardProps) => {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '1.75rem 1.25rem',
        borderRadius: '12px',
        border: `2px solid #E5E7EB`,
        background: '#FAFBFC',
        cursor: 'pointer',
        textAlign: 'center',
        transition: 'all 0.2s ease',
        width: '100%',
        fontFamily: 'inherit',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = accentColor;
        el.style.background = accentBg;
        el.style.transform = 'translateY(-3px)';
        el.style.boxShadow = `0 8px 24px ${accentColor}22`;
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = '#E5E7EB';
        el.style.background = '#FAFBFC';
        el.style.transform = 'translateY(0)';
        el.style.boxShadow = 'none';
      }}
    >
      <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>{icon}</div>
      <h3 style={{ fontSize: '0.97rem', fontWeight: 700, color: '#111', margin: '0 0 0.4rem' }}>{title}</h3>
      <p style={{ fontSize: '0.82rem', color: '#6B7280', margin: 0, lineHeight: 1.45 }}>{desc}</p>
      <div style={{ marginTop: '1rem', fontSize: '0.82rem', fontWeight: 600, color: accentColor }}>
        Get Started →
      </div>
    </button>
  );
};

export default ChooseRole;
