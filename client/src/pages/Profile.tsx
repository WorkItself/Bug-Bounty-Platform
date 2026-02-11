import { useUser } from '../context/UserContext';

const Profile = () => {
  const { user } = useUser();

  if (!user.isLoggedIn) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '3rem 2rem'
      }}>
        <h1 style={{ color: '#A2DFF7' }}>Please log in to view your profile</h1>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1000px' }}>
      <h1 style={{
        fontSize: '2.2rem',
        fontWeight: '800',
        marginBottom: '0.75rem',
        letterSpacing: '-0.02em',
        color: '#FFFFFF'
      }}>Profile Settings</h1>

      <div style={{
        background: 'linear-gradient(135deg, #1B3A57 0%, #0C1A30 100%)',
        padding: '2rem',
        borderRadius: '0.75rem',
        border: '1px solid #009B77'
      }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <p style={{ color: '#A2DFF7', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Name</p>
          <p style={{ color: '#FFFFFF', fontSize: '1.1rem', margin: 0 }}>{user.name}</p>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <p style={{ color: '#A2DFF7', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Email</p>
          <p style={{ color: '#FFFFFF', fontSize: '1.1rem', margin: 0 }}>{user.email}</p>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <p style={{ color: '#A2DFF7', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Account Type</p>
          <p style={{ color: '#FFFFFF', fontSize: '1.1rem', margin: 0, textTransform: 'capitalize' }}>
            {user.type === 'hacker' ? 'Bug Bounty Hunter' : user.type}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
