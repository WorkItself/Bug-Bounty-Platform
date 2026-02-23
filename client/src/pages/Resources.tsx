import { useNavigate } from 'react-router-dom';

const Resources = () => {
  const navigate = useNavigate();

  const resources = [
    { 
      title: 'OWASP Top 10', 
      description: 'Learn about the most critical web application security risks',
      action: () => {
        window.open('https://owasp.org/www-project-top-ten/', '_blank');
      }
    },
    { 
      title: 'Bug Bounty Basics', 
      description: 'A comprehensive guide to getting started in bug bounty hunting',
      action: () => {
        navigate('/resources/bug-bounty-basics');
      }
    },
    { 
      title: 'Vulnerability Reporting', 
      description: 'Best practices for reporting security issues responsibly',
      action: () => {
        navigate('/resources/vulnerability-reporting');
      }
    },
    { 
      title: 'Tools & Utilities', 
      description: 'Essential security testing tools for researchers',
      action: () => {
        navigate('/resources/tools');
      }
    }
  ];

  return (
    <div style={{ maxWidth: '1200px' }}>
      <h1 style={{
        fontSize: '2.2rem',
        fontWeight: '800',
        marginBottom: '0.75rem',
        letterSpacing: '-0.02em',
        color: '#FFFFFF'
      }}>Learning Resources</h1>
      <p style={{
        color: '#A2DFF7',
        fontSize: '1rem',
        marginBottom: '2rem',
        fontWeight: '500'
      }}>Guides and documentation to help you succeed.</p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '1.5rem'
      }}>
        {resources.map((resource, index) => (
          <button
            key={index}
            onClick={resource.action}
            style={{
              background: 'linear-gradient(135deg, #1B3A57 0%, #0C1A30 100%)',
              padding: '1.75rem',
              borderRadius: '0.75rem',
              border: '1px solid #009B77',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              textAlign: 'left',
              color: 'inherit',
              display: 'block',
              width: '100%',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = '#A2DFF7';
              (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
              (e.currentTarget as HTMLElement).style.boxShadow = '0 10px 30px rgba(0, 155, 119, 0.2)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = '#009B77';
              (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
              (e.currentTarget as HTMLElement).style.boxShadow = 'none';
            }}
          >
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.5rem', color: '#FFFFFF', margin: '0 0 0.5rem 0' }}>
              {resource.title}
            </h3>
            <p style={{ color: '#A2DFF7', fontSize: '0.95rem', margin: 0, lineHeight: '1.5' }}>
              {resource.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Resources;
