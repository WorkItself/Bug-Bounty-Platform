const Notifications = () => {
  const notifications = [
    { id: 1, title: 'Bounty Accepted', description: 'Your submission for Google bounty was accepted', time: '2 hours ago', read: false },
    { id: 2, title: 'Payment Received', description: 'You received $2,500 for vulnerability report', time: '1 day ago', read: true },
    { id: 3, title: 'New Program Available', description: 'Meta launched a new bug bounty program', time: '2 days ago', read: true }
  ];

  return (
    <div style={{ maxWidth: '1200px' }}>
      <h1 style={{
        fontSize: '2.2rem',
        fontWeight: '800',
        marginBottom: '0.75rem',
        letterSpacing: '-0.02em',
        color: '#FFFFFF'
      }}>Notifications</h1>
      <p style={{
        color: '#A2DFF7',
        fontSize: '1rem',
        marginBottom: '2rem',
        fontWeight: '500'
      }}>Stay updated with your bounty activity</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {notifications.map((notif) => (
          <div
            key={notif.id}
            style={{
              background: notif.read ? 'linear-gradient(135deg, #0C1A30 0%, #1B3A57 100%)' : 'linear-gradient(135deg, #1B3A57 0%, #0C1A30 100%)',
              padding: '1.5rem',
              borderRadius: '0.75rem',
              border: `1px solid ${notif.read ? '#1B3A57' : '#009B77'}`,
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = '#009B77';
              (e.currentTarget as HTMLElement).style.transform = 'translateX(4px)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = notif.read ? '#1B3A57' : '#009B77';
              (e.currentTarget as HTMLElement).style.transform = 'translateX(0)';
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
              <h3 style={{ margin: 0, color: '#FFFFFF', fontWeight: '700' }}>{notif.title}</h3>
              <span style={{
                fontSize: '0.8rem',
                color: notif.read ? '#A2DFF7' : '#0C1A30',
                background: notif.read ? '#0C1A30' : '#009B77',
                padding: '0.25rem 0.75rem',
                borderRadius: '0.25rem'
              }}>
                {notif.time}
              </span>
            </div>
            <p style={{ margin: '0.5rem 0 0 0', color: '#A2DFF7' }}>{notif.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notifications;
