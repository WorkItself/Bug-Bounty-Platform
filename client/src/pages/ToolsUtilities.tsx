import { useNavigate } from 'react-router-dom';

const ToolsUtilities = () => {
  const navigate = useNavigate();

  const tools = [
    {
      name: 'Burp Suite',
      description: 'Industry-leading web vulnerability scanner and security testing platform',
      url: 'https://portswigger.net/burp'
    },
    {
      name: 'OWASP ZAP',
      description: 'Free and open-source web application security scanner',
      url: 'https://www.zaproxy.org/'
    },
    {
      name: 'Nmap',
      description: 'Network mapper for network discovery and security auditing',
      url: 'https://nmap.org/'
    },
    {
      name: 'Metasploit',
      description: 'Penetration testing framework with extensive exploit database',
      url: 'https://www.metasploit.com/'
    },
    {
      name: 'SQLMap',
      description: 'Automatic SQL injection detection and exploitation tool',
      url: 'http://sqlmap.org/'
    },
    {
      name: 'HackerOne Resources',
      description: 'Community-driven resources and hacker tools',
      url: 'https://www.hackerone.com/resources'
    },
  ];

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
      }}>Tools & Utilities</h1>

      <div style={{
        background: 'linear-gradient(135deg, #1B3A57 0%, #0C1A30 100%)',
        padding: '2rem',
        borderRadius: '0.75rem',
        border: '1px solid #009B77',
        marginBottom: '2rem'
      }}>
        <h2 style={{ color: '#A2DFF7', fontSize: '1.3rem', marginTop: '0', marginBottom: '1rem' }}>Essential Security Testing Tools</h2>
        <p style={{ color: '#E0E0E0', marginBottom: '2rem' }}>
          Below is a curated list of tools that are widely used in bug bounty hunting and penetration testing. 
          Each tool serves a specific purpose in the security testing process.
        </p>

        <div style={{ display: 'grid', gap: '1rem' }}>
          {tools.map((tool, index) => (
            <div
              key={index}
              style={{
                background: '#0C1A30',
                padding: '1.5rem',
                borderRadius: '0.5rem',
                border: '1px solid #009B7744',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = '#009B77';
                (e.currentTarget as HTMLElement).style.background = '#1B3A57';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = '#009B7744';
                (e.currentTarget as HTMLElement).style.background = '#0C1A30';
              }}
            >
              <h3 style={{ color: '#A2DFF7', marginTop: '0', marginBottom: '0.5rem', fontSize: '1.1rem' }}>
                {tool.name}
              </h3>
              <p style={{ color: '#E0E0E0', marginBottom: '1rem', margin: '0 0 0.75rem 0' }}>
                {tool.description}
              </p>
              <a
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: '#A2DFF7',
                  textDecoration: 'none',
                  fontWeight: '600',
                  borderBottom: '1px solid #A2DFF7',
                  transition: 'color 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color = '#FFFFFF';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color = '#A2DFF7';
                }}
              >
                Learn More →
              </a>
            </div>
          ))}
        </div>
      </div>

      <div style={{
        background: 'linear-gradient(135deg, #1B3A57 0%, #0C1A30 100%)',
        padding: '2rem',
        borderRadius: '0.75rem',
        border: '1px solid #009B77'
      }}>
        <h2 style={{ color: '#A2DFF7', fontSize: '1.3rem', marginTop: '0', marginBottom: '1rem' }}>Tool Categories</h2>
        
        <h3 style={{ color: '#10b981', marginBottom: '0.75rem' }}>Web Application Testing</h3>
        <p style={{ color: '#E0E0E0', marginBottom: '1.5rem' }}>
          Burp Suite, OWASP ZAP, and SQLMap are essential for identifying security flaws in web applications.
        </p>

        <h3 style={{ color: '#10b981', marginBottom: '0.75rem' }}>Network Reconnaissance</h3>
        <p style={{ color: '#E0E0E0', marginBottom: '1.5rem' }}>
          Nmap helps discover services and systems running on networks, crucial for initial reconnaissance.
        </p>

        <h3 style={{ color: '#10b981', marginBottom: '0.75rem' }}>Exploitation</h3>
        <p style={{ color: '#E0E0E0' }}>
          Metasploit provides a comprehensive framework for testing and demonstrating vulnerabilities.
        </p>
      </div>
    </div>
  );
};

export default ToolsUtilities;
