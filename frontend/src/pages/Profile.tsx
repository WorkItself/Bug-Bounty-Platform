import { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import axiosInstance from '../utils/axiosInstance';

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '0.65rem 0.85rem',
  background: '#fff', border: '1.5px solid #D1D5DB',
  borderRadius: '8px', color: '#111', fontSize: '0.92rem',
  fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
  transition: 'border-color 0.2s',
};

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '0.82rem', fontWeight: 600,
  color: '#374151', marginBottom: '0.3rem',
};

const cardStyle: React.CSSProperties = {
  background: '#fff', borderRadius: '12px',
  border: '1px solid #E5E7EB',
  padding: '1.75rem',
  boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
  marginBottom: '1.25rem',
};

const sectionTitle: React.CSSProperties = {
  fontSize: '1rem', fontWeight: 700, color: '#111',
  margin: '0 0 1.25rem', paddingBottom: '0.6rem',
  borderBottom: '1px solid #F3F4F6',
};

const btnPrimary = (disabled: boolean): React.CSSProperties => ({
  padding: '0.6rem 1.5rem', background: disabled ? '#9CA3AF' : '#E81C79',
  color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700,
  fontSize: '0.9rem', cursor: disabled ? 'not-allowed' : 'pointer',
  transition: 'background 0.2s',
});

const Profile = () => {
  const { user } = useUser();

  const [profile, setProfile] = useState({ userName: '', email: '' });
  const [loadError, setLoadError] = useState('');

  const [accountForm, setAccountForm] = useState({ userName: '', email: '' });
  const [accountMsg, setAccountMsg] = useState('');
  const [accountError, setAccountError] = useState('');
  const [accountLoading, setAccountLoading] = useState(false);

  const [passForm, setPassForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passMsg, setPassMsg] = useState('');
  const [passError, setPassError] = useState('');
  const [passLoading, setPassLoading] = useState(false);

  useEffect(() => {
    if (!user.isLoggedIn) return;
    axiosInstance.get('/users/me')
      .then(res => {
        const d = res.data;
        setProfile({ userName: d.userName, email: d.email });
        setAccountForm({ userName: d.userName, email: d.email });
      })
      .catch(() => setLoadError('Failed to load profile.'));
  }, [user.isLoggedIn]);

  const focus = (e: React.FocusEvent<HTMLInputElement>) => e.currentTarget.style.borderColor = '#E81C79';
  const blur = (e: React.FocusEvent<HTMLInputElement>) => e.currentTarget.style.borderColor = '#D1D5DB';

  const handleAccountSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setAccountMsg(''); setAccountError(''); setAccountLoading(true);
    try {
      const res = await axiosInstance.put('/users/me', {
        userName: accountForm.userName || null,
        email: accountForm.email || null,
      });
      if (res.data?.isSuccess) {
        if (res.data.token) {
          localStorage.setItem('token', res.data.token);
          window.location.reload();
        }
        setAccountMsg('Profile updated successfully.');
        setProfile({ userName: accountForm.userName, email: accountForm.email });
      } else {
        setAccountError(res.data?.message ?? 'Update failed.');
      }
    } catch (err: any) {
      const d = err.response?.data;
      setAccountError(d?.message ?? d?.title ?? 'Update failed.');
    } finally { setAccountLoading(false); }
  };

  const handlePasswordSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passForm.newPassword !== passForm.confirmPassword) { setPassError('New passwords do not match.'); return; }
    setPassMsg(''); setPassError(''); setPassLoading(true);
    try {
      const res = await axiosInstance.put('/users/me', {
        currentPassword: passForm.currentPassword,
        newPassword: passForm.newPassword,
      });
      if (res.data?.isSuccess) {
        setPassMsg('Password changed successfully.');
        setPassForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setPassError(res.data?.message ?? 'Password change failed.');
      }
    } catch (err: any) {
      const d = err.response?.data;
      setPassError(d?.message ?? d?.title ?? 'Password change failed.');
    } finally { setPassLoading(false); }
  };

  if (!user.isLoggedIn) {
    return (
      <div style={{ padding: '3rem 2rem', textAlign: 'center' }}>
        <p style={{ color: '#6B7280', fontSize: '1rem' }}>Please log in to view your profile.</p>
      </div>
    );
  }

  const initials = (profile.userName || user.name || 'U').charAt(0).toUpperCase();

  return (
    <div style={{ padding: '2rem 1rem', maxWidth: '680px', margin: '0 auto', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#111', margin: '0 0 0.25rem' }}>Profile</h1>
      <p style={{ color: '#6B7280', fontSize: '0.9rem', margin: '0 0 1.75rem' }}>Manage your account details and security settings.</p>

      {loadError && <p style={{ color: '#ef4444', marginBottom: '1rem', fontSize: '0.9rem' }}>{loadError}</p>}

      {/* Identity card */}
      <div style={{ ...cardStyle, display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, #3F3AFC, #E81C79)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '1.5rem', flexShrink: 0 }}>
          {initials}
        </div>
        <div>
          <p style={{ margin: 0, fontWeight: 700, color: '#111', fontSize: '1.05rem' }}>{profile.userName || user.name}</p>
          <p style={{ margin: '2px 0 0', color: '#6B7280', fontSize: '0.85rem' }}>
            {user.type === 'user' ? 'Bug Bounty Hunter' : user.type === 'company' ? 'Company' : user.type === 'admin' ? 'Administrator' : ''}
          </p>
        </div>
      </div>

      {/* Account info */}
      <div style={cardStyle}>
        <p style={sectionTitle}>Account Information</p>
        <form onSubmit={handleAccountSave}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>Username</label>
            <input
              value={accountForm.userName}
              onChange={e => setAccountForm(p => ({ ...p, userName: e.target.value }))}
              onFocus={focus} onBlur={blur}
              placeholder="Your username"
              style={inputStyle}
            />
          </div>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              value={accountForm.email}
              onChange={e => setAccountForm(p => ({ ...p, email: e.target.value }))}
              onFocus={focus} onBlur={blur}
              placeholder="your@email.com"
              style={inputStyle}
            />
          </div>
          {accountError && <p style={{ color: '#ef4444', fontSize: '0.88rem', margin: '0 0 0.75rem' }}>{accountError}</p>}
          {accountMsg && <p style={{ color: '#10b981', fontSize: '0.88rem', margin: '0 0 0.75rem' }}>{accountMsg}</p>}
          <button type="submit" disabled={accountLoading} style={btnPrimary(accountLoading)}>
            {accountLoading ? 'Saving…' : 'Save Changes'}
          </button>
        </form>
      </div>

      {/* Password change */}
      <div style={cardStyle}>
        <p style={sectionTitle}>Change Password</p>
        <form onSubmit={handlePasswordSave}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>Current Password</label>
            <input
              type="password"
              value={passForm.currentPassword}
              onChange={e => setPassForm(p => ({ ...p, currentPassword: e.target.value }))}
              onFocus={focus} onBlur={blur}
              placeholder="Enter current password"
              required
              style={inputStyle}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
            <div>
              <label style={labelStyle}>New Password</label>
              <input
                type="password"
                value={passForm.newPassword}
                onChange={e => setPassForm(p => ({ ...p, newPassword: e.target.value }))}
                onFocus={focus} onBlur={blur}
                placeholder="Min 8 characters"
                required
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Confirm New Password</label>
              <input
                type="password"
                value={passForm.confirmPassword}
                onChange={e => setPassForm(p => ({ ...p, confirmPassword: e.target.value }))}
                onFocus={focus} onBlur={blur}
                placeholder="Repeat new password"
                required
                style={inputStyle}
              />
            </div>
          </div>
          {passError && <p style={{ color: '#ef4444', fontSize: '0.88rem', margin: '0 0 0.75rem' }}>{passError}</p>}
          {passMsg && <p style={{ color: '#10b981', fontSize: '0.88rem', margin: '0 0 0.75rem' }}>{passMsg}</p>}
          <button type="submit" disabled={passLoading} style={btnPrimary(passLoading)}>
            {passLoading ? 'Saving…' : 'Change Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
