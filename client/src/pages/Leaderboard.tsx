const Leaderboard = () => {
  // Expanded mock data for a more complete leaderboard
  const hackers = [
    { rank: 1, name: 'CyberWraith', bugs: 112, avatar: 'https://i.pravatar.cc/150?u=CyberWraith' },
    { rank: 2, name: 'DataDragon', bugs: 98, avatar: 'https://i.pravatar.cc/150?u=DataDragon' },
    { rank: 3, name: 'HexHammer', bugs: 85, avatar: 'https://i.pravatar.cc/150?u=HexHammer' },
    { rank: 4, name: 'Glitch', bugs: 72, avatar: 'https://i.pravatar.cc/150?u=Glitch' },
    { rank: 5, name: 'Phant0m', bugs: 68, avatar: 'https://i.pravatar.cc/150?u=Phant0m' },
    { rank: 6, name: 'ZeroCool', bugs: 65, avatar: 'https://i.pravatar.cc/150?u=ZeroCool' },
    { rank: 7, name: 'Nyx', bugs: 59, avatar: 'https://i.pravatar.cc/150?u=Nyx' },
    { rank: 8, name: 'ShadowByte', bugs: 52, avatar: 'https://i.pravatar.cc/150?u=ShadowByte' },
    { rank: 9, name: 'Cable', bugs: 48, avatar: 'https://i.pravatar.cc/150?u=Cable' },
    { rank: 10, name: 'Proxy', bugs: 45, avatar: 'https://i.pravatar.cc/150?u=Proxy' },
  ];

  const topThree = hackers.slice(0, 3);
  const rest = hackers.slice(3);

  const cardBaseStyle = {
    background: 'linear-gradient(145deg, #1e2a3a, #101822)',
    borderRadius: '12px',
    padding: '2rem',
    textAlign: 'center',
    color: '#fff',
    border: '1px solid transparent',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  };
  
  const rankColors = {
    1: '#ffd700', // Gold
    2: '#c0c0c0', // Silver
    3: '#cd7f32', // Bronze
  };

  return (
    <div style={{ padding: '2rem', color: '#e0e0e0' }}>
      <h1 style={{ textAlign: 'center', fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem' }}>Hacker Leaderboard</h1>
      <p style={{ textAlign: 'center', fontSize: '1.2rem', color: '#a0a0a0', marginBottom: '3rem' }}>
        The top security researchers who have made our platform safer.
      </p>

      {/* Top 3 Hackers in Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '2rem',
        marginBottom: '4rem',
      }}>
        {topThree.map(hacker => (
          <div key={hacker.rank} style={{
            ...cardBaseStyle,
            border: `2px solid ${rankColors[hacker.rank]}`,
            boxShadow: `0 0 20px 5px ${rankColors[hacker.rank]}33`,
            transform: hacker.rank === 1 ? 'scale(1.05)' : 'none',
          }}>
            <div style={{ marginBottom: '1rem', fontSize: '2.5rem', fontWeight: 'bold', color: rankColors[hacker.rank] }}>
              Rank #{hacker.rank}
            </div>
            <img src={hacker.avatar} alt={`${hacker.name}'s avatar`} style={{ width: '100px', height: '100px', borderRadius: '50%', border: `3px solid ${rankColors[hacker.rank]}`, margin: '0 auto 1rem' }} />
            <h2 style={{ fontSize: '1.8rem', margin: '0 0 0.5rem 0' }}>{hacker.name}</h2>
            <div style={{ fontSize: '1.5rem', color: '#4caf50', fontWeight: 'bold' }}>
              {hacker.bugs} <span style={{ fontSize: '1rem', color: '#a0a0a0' }}>Bugs Resolved</span>
            </div>
          </div>
        ))}
      </div>

      {/* Rest of the Leaderboard in a Table */}
      <h2 style={{ textAlign: 'center', fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem', borderTop: '1px solid #333', paddingTop: '2rem' }}>Top 10 Researchers</h2>
      <div style={{ background: '#101822', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#1e2a3a' }}>
              <th style={{ padding: '1rem', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '1px' }}>Rank</th>
              <th style={{ padding: '1rem', textAlign: 'left', textTransform: 'uppercase', letterSpacing: '1px' }}>Hacker</th>
              <th style={{ padding: '1rem', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '1px' }}>Bugs Resolved</th>
            </tr>
          </thead>
          <tbody>
            {rest.map(hacker => (
              <tr key={hacker.rank} style={{ borderBottom: '1px solid #1e2a3a', transition: 'background-color 0.2s' }} 
                  onMouseOver={e => e.currentTarget.style.backgroundColor = '#1e2a3a'}
                  onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                <td style={{ padding: '1.5rem', textAlign: 'center', fontWeight: 'bold', fontSize: '1.2rem' }}>{hacker.rank}</td>
                <td style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <img src={hacker.avatar} alt={`${hacker.name}'s avatar`} style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                  <span style={{ fontWeight: 'bold' }}>{hacker.name}</span>
                </td>
                <td style={{ padding: '1.5rem', textAlign: 'center', fontWeight: 'bold', color: '#4caf50', fontSize: '1.2rem' }}>{hacker.bugs}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;
