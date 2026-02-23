import { useUser } from '../context/UserContext';
import { useState } from 'react';
import { RegisteredUser } from '../context/UserContext';

const AdminPanel = () => {
  const { user, getAllUsers, updateUserStatus } = useUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<RegisteredUser | null>(null);
  const [users, setUsers] = useState<RegisteredUser[]>(getAllUsers());

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

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleWarnUser = (userId: string) => {
    const updatedUsers = users.map(u => 
      u.id === userId 
        ? { ...u, warnings: u.warnings + 1 }
        : u
    );
    setUsers(updatedUsers);
    updateUserStatus(userId, 'warned', updatedUsers.find(u => u.id === userId)?.warnings || 0);
    
    const updatedUser = updatedUsers.find(u => u.id === userId);
    if (updatedUser) {
      setSelectedUser(updatedUser);
    }
  };

  const handleBanUser = (userId: string) => {
    const updatedUsers = users.map(u => 
      u.id === userId ? { ...u, status: 'banned' } : u
    );
    setUsers(updatedUsers);
    updateUserStatus(userId, 'banned', updatedUsers.find(u => u.id === userId)?.warnings || 0);
    
    const updatedUser = updatedUsers.find(u => u.id === userId);
    if (updatedUser) {
      setSelectedUser(updatedUser);
    }
  };

  const handleUnbanUser = (userId: string) => {
    const updatedUsers = users.map(u => 
      u.id === userId ? { ...u, status: 'active', warnings: 0 } : u
    );
    setUsers(updatedUsers);
    updateUserStatus(userId, 'active', 0);
    
    const updatedUser = updatedUsers.find(u => u.id === userId);
    if (updatedUser) {
      setSelectedUser(updatedUser);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return '#10b981';
      case 'warned':
        return '#f59e0b';
      case 'banned':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  return (
    <div style={{ maxWidth: '1400px' }}>
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
      }}>User management and system administration.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '2rem' }}>
        {/* User Search and List */}
        <div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '1rem', color: '#FFFFFF' }}>Search Users</h2>
          
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem',
              marginBottom: '1rem',
              background: '#0C1A30',
              border: '1px solid #009B77',
              borderRadius: '0.5rem',
              color: '#FFFFFF',
              fontSize: '1rem',
              boxSizing: 'border-box'
            }}
          />

          <div style={{
            background: 'linear-gradient(135deg, #1B3A57 0%, #0C1A30 100%)',
            borderRadius: '0.75rem',
            border: '1px solid #009B77',
            maxHeight: '600px',
            overflowY: 'auto'
          }}>
            {filteredUsers.length === 0 ? (
              <div style={{ padding: '1.5rem', textAlign: 'center', color: '#A2DFF7' }}>
                No users found
              </div>
            ) : (
              filteredUsers.map(u => (
                <div
                  key={u.id}
                  onClick={() => setSelectedUser(u)}
                  style={{
                    padding: '1rem',
                    borderBottom: '1px solid #0C1A30',
                    cursor: 'pointer',
                    background: selectedUser?.id === u.id ? '#0C1A30' : 'transparent',
                    transition: 'background-color 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    if (selectedUser?.id !== u.id) {
                      (e.currentTarget as HTMLElement).style.background = '#0C1A3080';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedUser?.id !== u.id) {
                      (e.currentTarget as HTMLElement).style.background = 'transparent';
                    }
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <p style={{ color: '#FFFFFF', fontWeight: '600', margin: 0 }}>{u.name}</p>
                    <div style={{
                      padding: '0.25rem 0.75rem',
                      background: getStatusColor(u.status),
                      color: '#FFFFFF',
                      borderRadius: '0.25rem',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      textTransform: 'uppercase'
                    }}>
                      {u.status}
                    </div>
                  </div>
                  <p style={{ color: '#A2DFF7', fontSize: '0.85rem', margin: 0 }}>{u.email}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* User Details */}
        <div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '1rem', color: '#FFFFFF' }}>User Management</h2>
          
          {selectedUser ? (
            <div style={{
              background: 'linear-gradient(135deg, #1B3A57 0%, #0C1A30 100%)',
              padding: '1.75rem',
              borderRadius: '0.75rem',
              border: '1px solid #009B77'
            }}>
              <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
                <img 
                  src={selectedUser.avatar} 
                  alt={`${selectedUser.name}'s avatar`}
                  style={{ width: '80px', height: '80px', borderRadius: '50%', marginBottom: '1rem' }}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <p style={{ color: '#A2DFF7', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Name</p>
                <p style={{ color: '#FFFFFF', fontSize: '1.1rem', margin: 0, fontWeight: '600' }}>{selectedUser.name}</p>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <p style={{ color: '#A2DFF7', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Email</p>
                <p style={{ color: '#FFFFFF', fontSize: '1.1rem', margin: 0 }}>{selectedUser.email}</p>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <p style={{ color: '#A2DFF7', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Account Type</p>
                <p style={{ color: '#FFFFFF', fontSize: '1.1rem', margin: 0, textTransform: 'capitalize' }}>
                  {selectedUser.type === 'hacker' ? 'Bug Bounty Hunter' : selectedUser.type}
                </p>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <p style={{ color: '#A2DFF7', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Status</p>
                <div style={{
                  padding: '0.5rem 1rem',
                  background: getStatusColor(selectedUser.status),
                  color: '#FFFFFF',
                  borderRadius: '0.5rem',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  textTransform: 'uppercase',
                  display: 'inline-block'
                }}>
                  {selectedUser.status}
                </div>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <p style={{ color: '#A2DFF7', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Warnings: <span style={{ color: '#FFFFFF', fontWeight: '600' }}>{selectedUser.warnings}</span></p>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', flexDirection: 'column' }}>
                {selectedUser.status === 'active' && (
                  <>
                    <button
                      onClick={() => handleWarnUser(selectedUser.id)}
                      style={{
                        padding: '0.75rem 1.5rem',
                        background: '#f59e0b',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '0.5rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        (e.target as HTMLElement).style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        (e.target as HTMLElement).style.transform = 'translateY(0)';
                      }}
                    >
                      Issue Warning
                    </button>
                    <button
                      onClick={() => handleBanUser(selectedUser.id)}
                      style={{
                        padding: '0.75rem 1.5rem',
                        background: '#ef4444',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '0.5rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        (e.target as HTMLElement).style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        (e.target as HTMLElement).style.transform = 'translateY(0)';
                      }}
                    >
                      Ban User
                    </button>
                  </>
                )}
                {selectedUser.status === 'banned' && (
                  <button
                    onClick={() => handleUnbanUser(selectedUser.id)}
                    style={{
                      padding: '0.75rem 1.5rem',
                      background: '#009B77',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '0.5rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      (e.target as HTMLElement).style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      (e.target as HTMLElement).style.transform = 'translateY(0)';
                    }}
                  >
                    Unban User
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div style={{
              background: 'linear-gradient(135deg, #1B3A57 0%, #0C1A30 100%)',
              padding: '2rem',
              borderRadius: '0.75rem',
              border: '1px solid #009B77',
              textAlign: 'center',
              color: '#A2DFF7'
            }}>
              <p>Select a user from the list to manage their account</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
