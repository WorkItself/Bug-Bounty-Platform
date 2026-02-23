const Leaderboard = () => {
  const hackers = [
    { rank: 1, name: 'fsociety', bugs: 156, avatar: '/fsociety.jpg' },
    { rank: 2, name: 'CyberWraith', bugs: 112, avatar: 'https://i.pravatar.cc/150?img=32' },
    { rank: 3, name: 'DataDragon', bugs: 98, avatar: 'https://i.pravatar.cc/150?u=DataDragon' },
    { rank: 4, name: 'HexHammer', bugs: 85, avatar: 'https://i.pravatar.cc/150?u=HexHammer' },
    { rank: 5, name: 'Glitch', bugs: 72, avatar: 'https://i.pravatar.cc/150?u=Glitch' },
    { rank: 6, name: 'Phant0m', bugs: 68, avatar: 'https://i.pravatar.cc/150?u=Phant0m' },
    { rank: 7, name: 'ZeroCool', bugs: 65, avatar: 'https://i.pravatar.cc/150?u=ZeroCool' },
    { rank: 8, name: 'Nyx', bugs: 59, avatar: 'https://i.pravatar.cc/150?u=Nyx' },
    { rank: 9, name: 'ShadowByte', bugs: 52, avatar: 'https://i.pravatar.cc/150?u=ShadowByte' },
    { rank: 10, name: 'Cable', bugs: 48, avatar: 'https://i.pravatar.cc/150?u=Cable' },
  ];

  return (
    <div style={{ width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{
        fontSize: '2.2rem',
        fontWeight: '800',
        marginBottom: '0.75rem',
        letterSpacing: '-0.02em',
        color: '#FFFFFF'
      }}>Top 10 Researchers Leaderboard</h1>
      <p style={{
        color: '#A2DFF7',
        fontSize: '1rem',
        marginBottom: '2rem',
        fontWeight: '500'
      }}>The top security researchers who have made our platform safer.</p>

      {/* Top 10 Leaderboard in Simple List */}
      <div style={{ background: '#101822', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#1e2a3a' }}>
              <th style={{ padding: '1rem', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '1px', color: '#A2DFF7' }}>Rank</th>
              <th style={{ padding: '1rem', textAlign: 'left', textTransform: 'uppercase', letterSpacing: '1px', color: '#A2DFF7' }}>Hacker</th>
              <th style={{ padding: '1rem', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '1px', color: '#A2DFF7' }}>Bugs Resolved</th>
            </tr>
          </thead>
          <tbody>
            {hackers.map(hacker => (
              <tr key={hacker.rank} style={{ 
                borderBottom: '1px solid #1e2a3a', 
                transition: 'background-color 0.2s',
                fontWeight: hacker.rank === 1 ? 'bold' : 'normal'
              }} 
                  onMouseOver={e => e.currentTarget.style.backgroundColor = '#1e2a3a'}
                  onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}>
                <td style={{ padding: '1.5rem', textAlign: 'center', fontSize: '1.2rem', color: hacker.rank === 1 ? '#ffd700' : '#FFFFFF' }}>{hacker.rank}</td>
                <td style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', color: '#FFFFFF' }}>
                  <img src={hacker.avatar} alt={`${hacker.name}'s avatar`} style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                  <span>{hacker.name}</span>
                </td>
                <td style={{ padding: '1.5rem', textAlign: 'center', color: '#4caf50', fontSize: '1.2rem' }}>{hacker.bugs}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;
