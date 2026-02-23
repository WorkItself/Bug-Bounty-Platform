import { useState } from 'react';
import { useUser } from '../context/UserContext';

interface PlatformUser {
  id: string;
  name: string;
  type: string;
  email: string;
  isBanned: boolean;
  warnings: Array<{ id: string; reason: string; date: string }>;
  dateJoined: string;
}

const AdminPanel = () => {
  const { user, getAllUsers, searchUsers, banUser, unbanUser, warnUser } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<PlatformUser | null>(null);
  const [warnReason, setWarnReason] = useState('');
  const [showWarnForm, setShowWarnForm] = useState(false);
  const [users, setUsers] = useState<PlatformUser[]>(getAllUsers());

  if (!user.isLoggedIn || user.type !== 'admin') {
    return (
      <div style={{
        textAlign: 'center',
        padding: '3rem 2rem'
      }}>
        <h1 style={{ color: '#ef4444', fontSize: '2rem', marginBottom: '1rem' }}>Access Denied</h1>
        <p style={{ color: '#A2DFF7' }}>This area is restricted to administrators only.</p>
      </div>
    );
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      const results = searchUsers(query);
      setUsers(results);
    } else {
      setUsers(getAllUsers());
    }
    setSelectedUser(null);
  };

  const handleSelectUser = (u: PlatformUser) => {
    setSelectedUser(u);
    setShowWarnForm(false);
  };

  const handleBanUser = () => {
    if (selectedUser) {
      banUser(selectedUser.id);
      setUsers(getAllUsers());
      setSelectedUser({ ...selectedUser, isBanned: true });
    }
  };

  const handleUnbanUser = () => {
    if (selectedUser) {
      unbanUser(selectedUser.id);
      setUsers(getAllUsers());
      setSelectedUser({ ...selectedUser, isBanned: false });
    }
  };

  const handleWarnUser = () => {
    if (selectedUser && warnReason.trim()) {
      warnUser(selectedUser.id, warnReason);
      setUsers(getAllUsers());
      const updatedUser = getAllUsers().find(u => u.id === selectedUser.id);
      if (updatedUser) {
        setSelectedUser(updatedUser);
      }
      setWarnReason('');
      setShowWarnForm(false);
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
      <h1 style={{
        fontSize: '2.2rem',
        fontWeight: '800',
        marginBottom: '0.75rem',
        letterSpacing: '-0.02em',
        color: '#FFFFFF'
      }}>Admin Control Panel</h1>
      <p style={{
        color: '#A2DFF7',
        fontSize: '1rem',
        marginBottom: '2rem',
        fontWeight: '500'
      }}>System administration, user management, and oversight.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Left Panel - User Search */}
        <div>
          <div style={{
            background: 'linear-gradient(135deg, #1B3A57 0%, #0C1A30 100%)',
            padding: '1.5rem',
            borderRadius: '0.75rem',
            border: '1px solid #009B77'
          }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '1rem', color: '#FFFFFF' }}>
              User Search & Management
            </h2>

            <input
              type="text"
              placeholder="Search by name, email, or ID..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '0.5rem',
                border: '1px solid #009B77',
                background: '#0C1A30',
                color: '#FFFFFF',
                marginBottom: '1.5rem',
                fontSize: '1rem'
              }}
            />

            <div style={{
              maxHeight: '500px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}>
              {users.map((u) => (
                <div
                  key={u.id}
                  onClick={() => handleSelectUser(u)}
                  style={{
                    padding: '0.75rem',
                    background: selectedUser?.id === u.id ? '#009B77' : '#1e2a3a',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    border: `1px solid ${selectedUser?.id === u.id ? '#00FF7F' : '#333'}`,
                    transition: 'all 0.2s ease',
                    color: selectedUser?.id === u.id ? '#000000' : '#FFFFFF'
                  }}
                  onMouseEnter={(e) => {
                    if (selectedUser?.id !== u.id) {
                      (e.currentTarget as HTMLElement).style.background = '#0c1a2e';
                      (e.currentTarget as HTMLElement).style.borderColor = '#009B77';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedUser?.id !== u.id) {
                      (e.currentTarget as HTMLElement).style.background = '#1e2a3a';
                      (e.currentTarget as HTMLElement).style.borderColor = '#333';
                    }
                  }}
                >
                  <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>{u.name}</div>
                  <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>{u.email}</div>
                  <div style={{ fontSize: '0.8rem', marginTop: '0.25rem' }}>
                    Type: {u.type} {u.isBanned && <span style={{ color: '#ff4d4d' }}>❌ BANNED</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel - User Details & Actions */}
        <div>
          {selectedUser ? (
            <div style={{
              background: 'linear-gradient(135deg, #1B3A57 0%, #0C1A30 100%)',
              padding: '1.5rem',
              borderRadius: '0.75rem',
              border: '1px solid #009B77'
            }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '1rem', color: '#FFFFFF' }}>
                User Details
              </h2>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ color: '#A2DFF7', display: 'block', marginBottom: '0.25rem' }}>
                  Username
                </label>
                <div style={{ color: '#FFFFFF', fontSize: '1.1rem', fontWeight: '600' }}>
                  {selectedUser.name}
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ color: '#A2DFF7', display: 'block', marginBottom: '0.25rem' }}>
                  Email
                </label>
                <div style={{ color: '#FFFFFF' }}>{selectedUser.email}</div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ color: '#A2DFF7', display: 'block', marginBottom: '0.25rem' }}>
                  User Type
                </label>
                <div style={{ color: '#FFFFFF' }}>{selectedUser.type}</div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ color: '#A2DFF7', display: 'block', marginBottom: '0.25rem' }}>
                  Account Status
                </label>
                <div style={{ color: selectedUser.isBanned ? '#ff4d4d' : '#4caf50', fontSize: '1.1rem', fontWeight: '600' }}>
                  {selectedUser.isBanned ? '🚫 BANNED' : '✓ ACTIVE'}
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ color: '#A2DFF7', display: 'block', marginBottom: '0.25rem' }}>
                  Warnings ({selectedUser.warnings.length})
                </label>
                {selectedUser.warnings.length > 0 ? (
                  <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
                    {selectedUser.warnings.map((warn) => (
                      <div key={warn.id} style={{
                        background: '#0C1A30',
                        padding: '0.5rem',
                        borderRadius: '0.25rem',
                        marginBottom: '0.5rem',
                        borderLeft: '3px solid #ffaa00',
                        color: '#FFFFFF',
                        fontSize: '0.9rem'
                      }}>
                        <div style={{ fontWeight: '600' }}>{warn.reason}</div>
                        <div style={{ fontSize: '0.8rem', color: '#A2DFF7' }}>{warn.date}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ color: '#A2DFF7' }}>No warnings</div>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <button
                  onClick={() => (selectedUser.isBanned ? handleUnbanUser() : handleBanUser())}
                  style={{
                    padding: '0.75rem',
                    background: selectedUser.isBanned ? '#4caf50' : '#ff4d4d',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    fontWeight: '600',
                    transition: 'opacity 0.2s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.opacity = '0.8'}
                  onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.opacity = '1'}
                >
                  {selectedUser.isBanned ? '🔓 Unban User' : '🔒 Ban User'}
                </button>

                <button
                  onClick={() => setShowWarnForm(!showWarnForm)}
                  style={{
                    padding: '0.75rem',
                    background: '#ffaa00',
                    color: '#000000',
                    border: 'none',
                    borderRadius: '0.5rem',
                    cursor: 'pointer',
                    fontWeight: '600',
                    transition: 'opacity 0.2s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.opacity = '0.8'}
                  onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.opacity = '1'}
                >
                  ⚠️ Issue Warning
                </button>

                {showWarnForm && (
                  <div style={{
                    background: '#0C1A30',
                    padding: '1rem',
                    borderRadius: '0.5rem',
                    border: '1px solid #ffaa00'
                  }}>
                    <textarea
                      placeholder="Enter warning reason..."
                      value={warnReason}
                      onChange={(e) => setWarnReason(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        borderRadius: '0.25rem',
                        border: '1px solid #009B77',
                        background: '#1e2a3a',
                        color: '#FFFFFF',
                        marginBottom: '0.5rem',
                        minHeight: '80px',
                        resize: 'vertical'
                      }}
                    />
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={handleWarnUser}
                        style={{
                          flex: 1,
                          padding: '0.5rem',
                          background: '#ffaa00',
                          color: '#000000',
                          border: 'none',
                          borderRadius: '0.25rem',
                          cursor: 'pointer',
                          fontWeight: '600'
                        }}
                      >
                        Send Warning
                      </button>
                      <button
                        onClick={() => setShowWarnForm(false)}
                        style={{
                          flex: 1,
                          padding: '0.5rem',
                          background: '#666',
                          color: '#FFFFFF',
                          border: 'none',
                          borderRadius: '0.25rem',
                          cursor: 'pointer'
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div style={{
              background: 'linear-gradient(135deg, #1B3A57 0%, #0C1A30 100%)',
              padding: '1.5rem',
              borderRadius: '0.75rem',
              border: '1px solid #009B77',
              textAlign: 'center',
              color: '#A2DFF7'
            }}>
              <p>Select a user from the list to view and manage their account.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;

