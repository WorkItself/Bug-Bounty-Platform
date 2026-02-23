import { useParams, useNavigate } from 'react-router-dom';

const programs: Record<number, any> = {
  1: {
    id: 1,
    company: 'Google',
    reward: '$30,000',
    scope: 'V8 Engine, Chrome Browser',
    tier: 'CRITICAL',
    programs: 45,
    description: 'Google\'s bug bounty program rewards researchers for discovering and reporting security vulnerabilities in Google products and services.',
    inScope: [
      'V8 JavaScript Engine',
      'Chrome Browser',
      'Chromium OS',
      'Google Cloud Platform components',
      'Web APIs and extensions'
    ],
    outOfScope: [
      'Third-party services and applications',
      'Content hosted on Google platforms',
      'Social engineering',
      'Physical security issues'
    ],
    rules: [
      'Do not access user data or perform unauthorized testing',
      'Follow responsible disclosure practices',
      'Do not test on production systems without authorization',
      'Provide sufficient detail in your report for reproduction',
      'Report only one vulnerability per submission unless they are closely related'
    ],
    submissionGuidelines: [
      'Submit reports through the official Google VRP website',
      'Include clear reproduction steps',
      'Provide proof-of-concept code or screenshots',
      'Explain the potential impact',
      'Include your contact information'
    ]
  },
  2: {
    id: 2,
    company: 'Meta',
    reward: '$45,000',
    scope: 'WhatsApp, Instagram API',
    tier: 'CRITICAL',
    programs: 38,
    description: 'Meta\'s bug bounty program covers security research for Facebook, Instagram, WhatsApp, and related platforms.',
    inScope: [
      'WhatsApp application and services',
      'Instagram mobile and web apps',
      'Facebook platform APIs',
      'Meta business tools',
      'Integration services'
    ],
    outOfScope: [
      'Third-party integrations',
      'User-generated content',
      'Services operated by acquired companies',
      'Social engineering attacks'
    ],
    rules: [
      'Respect user privacy and data',
      'Do not perform denial-of-service tests',
      'Use test accounts for testing',
      'Allow 90 days for response before public disclosure',
      'Do not download or store user data'
    ],
    submissionGuidelines: [
      'Create a detailed vulnerability report',
      'Include steps to reproduce the issue',
      'Provide technical details and impact assessment',
      'Submit through Meta\'s security bug bounty portal',
      'Be available for follow-up questions'
    ]
  },
  3: {
    id: 3,
    company: 'Shopify',
    reward: '$10,000',
    scope: 'Payment Gateway',
    tier: 'HIGH',
    programs: 22,
    description: 'Shopify\'s bug bounty program focuses on security issues in their e-commerce platform and payment processing systems.',
    inScope: [
      'Shopify Admin API',
      'Payment Gateway',
      'Merchant onboarding',
      'Shop security features',
      'Data processing systems'
    ],
    outOfScope: [
      'Third-party Shopify apps',
      'Services not operated by Shopify',
      'Physical security',
      'Email phishing'
    ],
    rules: [
      'Report vulnerabilities responsibly',
      'Do not access other merchants\' data',
      'Test only on your own accounts',
      'Provide clear reproduction steps',
      'Do not publicly disclose before patching'
    ],
    submissionGuidelines: [
      'Report via Shopify\'s disclosure program',
      'Include CVSS score estimation',
      'Provide detailed technical analysis',
      'Include remediation suggestions if possible',
      'Be professional and courteous'
    ]
  },
  4: {
    id: 4,
    company: 'Tesla',
    reward: '$15,000',
    scope: 'Infotainment System',
    tier: 'HIGH',
    programs: 18,
    description: 'Tesla\'s security research program focuses on vulnerabilities in vehicle systems and related services.',
    inScope: [
      'Vehicle infotainment systems',
      'Mobile app APIs',
      'Website and portals',
      'Network connectivity',
      'Authentication mechanisms'
    ],
    outOfScope: [
      'Physical properties',
      'Third-party integrations',
      'Manufacturing systems',
      'Dealership systems'
    ],
    rules: [
      'Do not interfere with vehicle operation',
      'Report directly to Tesla security team',
      'Respect responsible disclosure',
      'Do not test on non-consenting vehicles',
      'Allow 120 days for patch development'
    ],
    submissionGuidelines: [
      'Contact Tesla security team directly',
      'Provide comprehensive technical details',
      'Include video demonstration if applicable',
      'Explain safety implications',
      'Maintain confidentiality'
    ]
  }
};

const getTierColor = (tier: string) => {
  switch (tier) {
    case 'CRITICAL':
      return { bg: '#7f1d1d', text: '#fca5a5', border: '#dc2626' };
    case 'HIGH':
      return { bg: '#7c2d12', text: '#fdba74', border: '#f97316' };
    default:
      return { bg: '#1e3a8a', text: '#93c5fd', border: '#3b82f6' };
  }
};

const BountyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const program = programs[parseInt(id || '1')];

  if (!program) {
    return (
      <div style={{ maxWidth: '1000px', textAlign: 'center', padding: '3rem' }}>
        <h1 style={{ color: '#ef4444' }}>Program Not Found</h1>
        <button
          onClick={() => navigate('/bounties')}
          style={{
            padding: '0.75rem 1.5rem',
            background: '#009B77',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          Back to Programs
        </button>
      </div>
    );
  }

  const tierColor = getTierColor(program.tier);

  return (
    <div style={{ maxWidth: '1000px' }}>
      <button
        onClick={() => navigate('/bounties')}
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
        ← Back to Programs
      </button>

      {/* Header Section */}
      <div style={{
        background: 'linear-gradient(135deg, #1B3A57 0%, #0C1A30 100%)',
        padding: '2rem',
        borderRadius: '0.75rem',
        border: '1px solid #009B77',
        marginBottom: '2rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: '800',
            color: '#FFFFFF',
            margin: 0
          }}>{program.company}</h1>
          <span style={{
            fontSize: '0.75rem',
            letterSpacing: '0.1em',
            fontWeight: '700',
            background: tierColor.bg,
            color: tierColor.text,
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem',
            border: `1px solid ${tierColor.border}`,
            textTransform: 'uppercase'
          }}>
            {program.tier}
          </span>
        </div>

        <p style={{ color: '#A2DFF7', fontSize: '1rem', margin: '0 0 1.5rem 0' }}>
          {program.description}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          <div>
            <p style={{ color: '#A2DFF7', fontSize: '0.85rem', fontWeight: '600', margin: '0 0 0.5rem 0' }}>MAX BOUNTY</p>
            <p style={{ color: '#009B77', fontSize: '2rem', fontWeight: '700', margin: 0 }}>{program.reward}</p>
          </div>
          <div>
            <p style={{ color: '#A2DFF7', fontSize: '0.85rem', fontWeight: '600', margin: '0 0 0.5rem 0' }}>ACTIVE PROGRAMS</p>
            <p style={{ color: '#FFFFFF', fontSize: '2rem', fontWeight: '700', margin: 0 }}>{program.programs}</p>
          </div>
        </div>
      </div>

      {/* In Scope Section */}
      <div style={{
        background: 'linear-gradient(135deg, #1B3A57 0%, #0C1A30 100%)',
        padding: '2rem',
        borderRadius: '0.75rem',
        border: '1px solid #009B77',
        marginBottom: '2rem'
      }}>
        <h2 style={{ color: '#A2DFF7', fontSize: '1.5rem', marginTop: 0, marginBottom: '1rem' }}>In Scope</h2>
        <p style={{ color: '#E0E0E0', marginBottom: '1rem' }}>The following areas are covered by this bounty program:</p>
        <ul style={{ color: '#FFFFFF', margin: 0, paddingLeft: '1.5rem' }}>
          {program.inScope.map((item: string, idx: number) => (
            <li key={idx} style={{ marginBottom: '0.5rem' }}>{item}</li>
          ))}
        </ul>
      </div>

      {/* Out of Scope Section */}
      <div style={{
        background: 'linear-gradient(135deg, #1B3A57 0%, #0C1A30 100%)',
        padding: '2rem',
        borderRadius: '0.75rem',
        border: '1px solid #009B77',
        marginBottom: '2rem'
      }}>
        <h2 style={{ color: '#A2DFF7', fontSize: '1.5rem', marginTop: 0, marginBottom: '1rem' }}>Out of Scope</h2>
        <p style={{ color: '#E0E0E0', marginBottom: '1rem' }}>The following items are NOT covered by this program:</p>
        <ul style={{ color: '#FFFFFF', margin: 0, paddingLeft: '1.5rem' }}>
          {program.outOfScope.map((item: string, idx: number) => (
            <li key={idx} style={{ marginBottom: '0.5rem' }}>{item}</li>
          ))}
        </ul>
      </div>

      {/* Rules Section */}
      <div style={{
        background: 'linear-gradient(135deg, #1B3A57 0%, #0C1A30 100%)',
        padding: '2rem',
        borderRadius: '0.75rem',
        border: '1px solid #009B77',
        marginBottom: '2rem'
      }}>
        <h2 style={{ color: '#A2DFF7', fontSize: '1.5rem', marginTop: 0, marginBottom: '1rem' }}>Program Rules</h2>
        <ol style={{ color: '#FFFFFF', margin: 0, paddingLeft: '1.5rem' }}>
          {program.rules.map((rule: string, idx: number) => (
            <li key={idx} style={{ marginBottom: '0.5rem' }}>{rule}</li>
          ))}
        </ol>
      </div>

      {/* Submission Guidelines */}
      <div style={{
        background: 'linear-gradient(135deg, #1B3A57 0%, #0C1A30 100%)',
        padding: '2rem',
        borderRadius: '0.75rem',
        border: '1px solid #009B77',
        marginBottom: '2rem'
      }}>
        <h2 style={{ color: '#A2DFF7', fontSize: '1.5rem', marginTop: 0, marginBottom: '1rem' }}>Submission Guidelines</h2>
        <ol style={{ color: '#FFFFFF', margin: 0, paddingLeft: '1.5rem' }}>
          {program.submissionGuidelines.map((guideline: string, idx: number) => (
            <li key={idx} style={{ marginBottom: '0.5rem' }}>{guideline}</li>
          ))}
        </ol>
      </div>

      {/* CTA Section */}
      <div style={{
        background: 'linear-gradient(135deg, #1B3A57 0%, #0C1A30 100%)',
        padding: '2rem',
        borderRadius: '0.75rem',
        border: '1px solid #009B77',
        textAlign: 'center'
      }}>
        <h2 style={{ color: '#FFFFFF', fontSize: '1.3rem', marginTop: 0, marginBottom: '1rem' }}>Ready to Participate?</h2>
        <p style={{ color: '#A2DFF7', marginBottom: '1.5rem' }}>
          Start hunting for vulnerabilities in {program.company}'s systems and earn bounties for your findings.
        </p>
        <button
          onClick={() => navigate(`/submit?bountyId=${program.id}`)}
          style={{
            padding: '0.75rem 2rem',
            background: '#009B77',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '1rem',
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
          Submit a Report
        </button>
      </div>
    </div>
  );
};

export default BountyDetail;
