import { useUser } from '../context/UserContext';

const Settings = () => {
  useUser(); // Hook for future use

  return (
    <div style={{ maxWidth: '1000px' }}>
      <h1 style={{
        fontSize: '2.2rem',
        fontWeight: '800',
        marginBottom: '0.75rem',
        letterSpacing: '-0.02em',
        color: '#FFFFFF'
      }}>Settings &amp; Preferences</h1>
      <p style={{
        color: '#A2DFF7',
        fontSize: '1rem',
        marginBottom: '2rem',
        fontWeight: '500'
      }}>Manage your account preferences and privacy settings</p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '1.5rem'
      }}>
        {/* General Settings */}
        <div style={{
          background: 'linear-gradient(135deg, #1B3A57 0%, #0C1A30 100%)',
          padding: '1.5rem',
          borderRadius: '0.75rem',
          border: '1px solid #1B3A57'
        }}>
          <h2 style={{ margin: '0 0 1.5rem 0', color: '#FFFFFF', fontSize: '1.1rem', fontWeight: '700' }}>General</h2>
          
          <SettingItem label="Email Notifications" description="Receive updates via email" />
          <SettingItem label="Two-Factor Authentication" description="Add extra security to your account" />
          <SettingItem label="Data Backup" description="Automatically backup your data" />
        </div>

        {/* Privacy Settings */}
        <div style={{
          background: 'linear-gradient(135deg, #1B3A57 0%, #0C1A30 100%)',
          padding: '1.5rem',
          borderRadius: '0.75rem',
          border: '1px solid #1B3A57'
        }}>
          <h2 style={{ margin: '0 0 1.5rem 0', color: '#FFFFFF', fontSize: '1.1rem', fontWeight: '700' }}>Privacy &amp; Security</h2>
          
          <SettingItem label="Profile Visibility" description="Control who can see your profile" />
          <SettingItem label="Activity Log" description="Monitor your account activity" />
          <SettingItem label="Connected Apps" description="Manage third-party integrations" />
        </div>
      </div>

      {/* Notification Preferences */}
      <div style={{
        background: 'linear-gradient(135deg, #1B3A57 0%, #0C1A30 100%)',
        padding: '1.5rem',
        borderRadius: '0.75rem',
        border: '1px solid #1B3A57',
        marginTop: '1.5rem'
      }}>
        <h2 style={{ margin: '0 0 1.5rem 0', color: '#FFFFFF', fontSize: '1.1rem', fontWeight: '700' }}>Notifications</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <SettingItem label="Bounty Updates" description="Get notified of new bounties" />
          <SettingItem label="Payment Alerts" description="Receive payment notifications" />
          <SettingItem label="Community" description="Receive community updates" />
          <SettingItem label="Marketing" description="Receive promotional emails" />
        </div>
      </div>
    </div>
  );
};

const SettingItem = ({ label, description }: { label: string; description: string }) => (
  <div style={{
    padding: '1rem 0',
    borderBottom: '1px solid #1B3A57',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  }}>
    <div>
      <p style={{ margin: 0, color: '#FFFFFF', fontWeight: '600', marginBottom: '0.25rem' }}>{label}</p>
      <p style={{ margin: 0, color: '#A2DFF7', fontSize: '0.85rem' }}>{description}</p>
    </div>
    <input
      type="checkbox"
      style={{
        cursor: 'pointer',
        width: '20px',
        height: '20px',
        accentColor: '#009B77'
      }}
      defaultChecked
    />
  </div>
);

export default Settings;
