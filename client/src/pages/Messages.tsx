const Messages = () => {
  const conversations = [
    { id: 1, with: 'Google Security Team', lastMessage: 'Please clarify the vulnerability report', time: '5 mins ago' },
    { id: 2, with: 'Jason Smith', lastMessage: 'Great work on finding that bug', time: '3 hours ago' },
    { id: 3, with: 'Platform Support', lastMessage: 'Your withdrawal has been processed', time: '1 day ago' }
  ];

  return (
    <div style={{ maxWidth: '1200px' }}>
      <h1 style={{
        fontSize: '2.2rem',
        fontWeight: '800',
        marginBottom: '0.75rem',
        letterSpacing: '-0.02em',
        color: '#FFFFFF'
      }}>Messages</h1>
      <p style={{
        color: '#A2DFF7',
        fontSize: '1rem',
        marginBottom: '2rem',
        fontWeight: '500'
      }}>Communicate with bounty programs and researchers</p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 2fr',
        gap: '1.5rem',
        minHeight: '500px'
      }}>
        {/* Conversations List */}
        <div style={{
          background: 'linear-gradient(135deg, #0C1A30 0%, #1B3A57 100%)',
          borderRadius: '0.75rem',
          border: '1px solid #1B3A57',
          overflow: 'hidden'
        }}>
          <div style={{ padding: '1rem', borderBottom: '1px solid #1B3A57' }}>
            <h2 style={{ margin: 0, color: '#FFFFFF', fontSize: '1rem', fontWeight: '700' }}>Conversations</h2>
          </div>
          {conversations.map((conv) => (
            <div
              key={conv.id}
              style={{
                padding: '1rem',
                borderBottom: '1px solid #1B3A57',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                background: 'transparent'
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = '#1B3A57';
                (e.currentTarget as HTMLElement).style.borderLeftColor = '#009B77';
                (e.currentTarget as HTMLElement).style.borderLeft = '3px solid #009B77';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = 'transparent';
                (e.currentTarget as HTMLElement).style.borderLeft = 'none';
              }}
            >
              <p style={{ margin: '0 0 0.25rem 0', color: '#FFFFFF', fontWeight: '600' }}>{conv.with}</p>
              <p style={{ margin: 0, color: '#A2DFF7', fontSize: '0.9rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {conv.lastMessage}
              </p>
            </div>
          ))}
        </div>

        {/* Chat Area */}
        <div style={{
          background: 'linear-gradient(135deg, #1B3A57 0%, #0C1A30 100%)',
          borderRadius: '0.75rem',
          border: '1px solid #1B3A57',
          padding: '2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center'
        }}>
          <div>
            <p style={{ color: '#A2DFF7', marginBottom: '0.5rem' }}>Select a conversation to view messages</p>
            <p style={{ color: '#1B3A57', fontSize: '0.9rem' }}>Chat feature coming soon</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
