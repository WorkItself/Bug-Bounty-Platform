const SubmitReport = () => {
  return (
    <div style={{ maxWidth: '1000px' }}>
      <h1 style={{
        fontSize: '2.2rem',
        fontWeight: '800',
        marginBottom: '0.75rem',
        letterSpacing: '-0.02em',
        color: '#FFFFFF'
      }}>Submit Vulnerability Report</h1>
      <p style={{
        color: '#A2DFF7',
        fontSize: '1rem',
        marginBottom: '2rem',
        fontWeight: '500'
      }}>Report a security vulnerability to our team securely.</p>

      <div style={{
        background: 'linear-gradient(135deg, #1B3A57 0%, #0C1A30 100%)',
        padding: '2rem',
        borderRadius: '0.75rem',
        border: '1px solid #009B77'
      }}>
        <p style={{ color: '#A2DFF7', marginBottom: '1rem' }}>Vulnerability submission form coming soon...</p>
      </div>
    </div>
  );
};

export default SubmitReport;
