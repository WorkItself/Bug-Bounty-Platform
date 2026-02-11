const Leaderboard = () => {
  const topHackers = [
    { rank: 1, name: 'SecurityNinja', earned: '$145,000', findings: 42 },
    { rank: 2, name: 'VulnHunter', earned: '$128,500', findings: 38 },
    { rank: 3, name: 'CodeBreaker', earned: '$105,200', findings: 31 }
  ];

  return (
    <div style={{ maxWidth: '1200px' }}>
      <h1 style={{
        fontSize: '2.2rem',
        fontWeight: '800',
        marginBottom: '0.75rem',
        letterSpacing: '-0.02em',
        color: '#FFFFFF'
      }}>Top Security Researchers</h1>
      <p style={{
        color: '#A2DFF7',
        fontSize: '1rem',
        marginBottom: '2rem',
        fontWeight: '500'
      }}>The most successful hackers on our platform.</p>

      <div style={{
        background: 'linear-gradient(135deg, #1B3A57 0%, #0C1A30 100%)',
        borderRadius: '0.75rem',
        border: '1px solid #009B77',
        overflow: 'hidden'
      }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse'
        }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #009B77', background: '#1B3A57' }}>
              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.9rem', fontWeight: '600', color: '#A2DFF7' }}>Rank</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.9rem', fontWeight: '600', color: '#A2DFF7' }}>Researcher</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.9rem', fontWeight: '600', color: '#A2DFF7' }}>Total Earned</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.9rem', fontWeight: '600', color: '#A2DFF7' }}>Findings</th>
            </tr>
          </thead>
          <tbody>
            {topHackers.map((hacker) => (
              <tr key={hacker.rank} style={{ borderBottom: '1px solid #009B77' }}>
                <td style={{ padding: '1rem', color: '#009B77', fontWeight: '700', fontSize: '1.1rem' }}>#{hacker.rank}</td>
                <td style={{ padding: '1rem', color: '#FFFFFF' }}>{hacker.name}</td>
                <td style={{ padding: '1rem', color: '#009B77', fontWeight: '600' }}>{hacker.earned}</td>
                <td style={{ padding: '1rem', color: '#A2DFF7' }}>{hacker.findings}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;
