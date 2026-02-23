import { useNavigate } from 'react-router-dom';

const BugBountyBasics = () => {
  const navigate = useNavigate();

  return (
    <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
      <button 
        onClick={() => navigate('/kb')}
        style={{
          marginBottom: '2rem',
          padding: '0.5rem 1rem',
          background: '#009B77',
          color: '#FFFFFF',
          border: 'none',
          borderRadius: '0.5rem',
          cursor: 'pointer',
          fontWeight: '600',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => {
          (e.target as HTMLElement).style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={(e) => {
          (e.target as HTMLElement).style.transform = 'translateY(0)';
        }}
      >
        ← Back to Resources
      </button>

      <h1 style={{
        fontSize: '2.2rem',
        fontWeight: '800',
        marginBottom: '1rem',
        letterSpacing: '-0.02em',
        color: '#FFFFFF'
      }}>Bug Bounty Basics</h1>

      <div style={{
        background: 'linear-gradient(135deg, #1B3A57 0%, #0C1A30 100%)',
        padding: '2rem',
        borderRadius: '0.75rem',
        border: '1px solid #009B77',
        lineHeight: '1.8'
      }}>
        <h2 style={{ color: '#A2DFF7', fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem' }}>What is Bug Bounty Hunting?</h2>
        <p style={{ color: '#E0E0E0', marginBottom: '1rem' }}>
          Bug bounty hunting is the practice of finding and reporting security vulnerabilities in software, websites, and applications. 
          Organizations run bug bounty programs to incentivize the discovery of security issues before malicious actors can exploit them.
        </p>

        <h2 style={{ color: '#A2DFF7', fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem' }}>Getting Started</h2>
        <ul style={{ color: '#E0E0E0', marginBottom: '1rem' }}>
          <li style={{ marginBottom: '0.5rem' }}>Create an account on the platform</li>
          <li style={{ marginBottom: '0.5rem' }}>Review the bounty programs available</li>
          <li style={{ marginBottom: '0.5rem' }}>Read the program scope and rules carefully</li>
          <li style={{ marginBottom: '0.5rem' }}>Start looking for vulnerabilities</li>
          <li style={{ marginBottom: '0.5rem' }}>Report your findings following the responsible disclosure guidelines</li>
        </ul>

        <h2 style={{ color: '#A2DFF7', fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem' }}>Common Vulnerability Types</h2>
        <ul style={{ color: '#E0E0E0', marginBottom: '1rem' }}>
          <li style={{ marginBottom: '0.5rem' }}><strong>SQL Injection:</strong> Exploiting SQL queries through user input</li>
          <li style={{ marginBottom: '0.5rem' }}><strong>Cross-Site Scripting (XSS):</strong> Injecting malicious scripts into web pages</li>
          <li style={{ marginBottom: '0.5rem' }}><strong>Cross-Site Request Forgery (CSRF):</strong> Tricking users into making unwanted requests</li>
          <li style={{ marginBottom: '0.5rem' }}><strong>Authentication Flaws:</strong> Weaknesses in login and session management</li>
          <li style={{ marginBottom: '0.5rem' }}><strong>Sensitive Data Exposure:</strong> Unauthorized access to confidential information</li>
        </ul>

        <h2 style={{ color: '#A2DFF7', fontSize: '1.5rem', marginTop: '2rem', marginBottom: '1rem' }}>Tips for Success</h2>
        <ul style={{ color: '#E0E0E0' }}>
          <li style={{ marginBottom: '0.5rem' }}>Focus on quality over quantity in your reports</li>
          <li style={{ marginBottom: '0.5rem' }}>Test thoroughly and provide clear reproduction steps</li>
          <li style={{ marginBottom: '0.5rem' }}>Respect the scope of the program</li>
          <li style={{ marginBottom: '0.5rem' }}>Follow ethical hacking practices</li>
          <li style={{ marginBottom: '0.5rem' }}>Keep learning and improving your skills</li>
        </ul>
      </div>
    </div>
  );
};

export default BugBountyBasics;
