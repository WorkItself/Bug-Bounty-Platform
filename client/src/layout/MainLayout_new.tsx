import { Link, Outlet, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useUser } from '../context/UserContext';

const MainLayout = () => {
  const location = useLocation();
  const { user, logout, adminEnabled } = useUser();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0e27', color: '#e2e8f0', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      {/* Sidebar */}
      <nav style={{
        width: '280px',
        background: 'linear-gradient(180deg, #050810 0%, #0f1419 100%)',
        padding: '2rem 1.5rem',
        borderRight: '2px solid #0f9488',
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflowY: 'auto'
      }}>
        {/* Logo with Cybersec Theme */}
        <div style={{ marginBottom: '2.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid #0f9488', opacity: 0.7 }}>
          <div style={{
            fontSize: '0.65rem',
            fontWeight: '900',
            letterSpacing: '0.2em',
            color: '#14b8a6',
            marginBottom: '0.5rem',
            fontFamily: 'monospace'
          }}>[ SECURE ]</div>
          <div style={{
            fontSize: '1.2rem',
            fontWeight: '900',
            color: '#ffffff',
            letterSpacing: '0.05em',
            fontFamily: 'monospace'
          }}>BOUNTY OS</div>
        </div>
        
        {/* Navigation Sections */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          {/* Core Navigation */}
          <div>
            <div style={{
              fontSize: '0.7rem',
              fontWeight: '900',
              letterSpacing: '0.15em',
              color: '#0f9488',
              marginBottom: '1rem',
              textTransform: 'uppercase',
              fontFamily: 'monospace'
            }}>// NAVIGATION</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <SidebarLink to="/" label="Dashboard" isActive={location.pathname === '/'} />
              <SidebarLink to="/bounties" label="Bounty Programs" isActive={location.pathname === '/bounties'} />
              <SidebarLink to="/leaderboard" label="Leaderboard" isActive={location.pathname === '/leaderboard'} />
              <SidebarLink to="/kb" label="Resources" isActive={location.pathname === '/kb'} />
            </div>
          </div>

          {/* Researcher Section */}
          {user.isLoggedIn && (user.type === 'hacker' || user.type === 'admin') && (
            <div>
              <div style={{
                fontSize: '0.7rem',
                fontWeight: '900',
                letterSpacing: '0.15em',
                color: '#14b8a6',
                marginBottom: '1rem',
                textTransform: 'uppercase',
                fontFamily: 'monospace'
              }}>// RESEARCHER</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <SidebarLink to="/submit" label="Submit Report" isActive={location.pathname === '/submit'} accent />
                <SidebarLink to="/my-submissions" label="Submissions" isActive={location.pathname === '/my-submissions'} />
              </div>
            </div>
          )}

          {/* Company Section */}
          {user.isLoggedIn && user.type === 'company' && (
            <div>
              <div style={{
                fontSize: '0.7rem',
                fontWeight: '900',
                letterSpacing: '0.15em',
                color: '#14b8a6',
                marginBottom: '1rem',
                textTransform: 'uppercase',
                fontFamily: 'monospace'
              }}>// COMPANY</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <SidebarLink to="/submit" label="Create Program" isActive={location.pathname === '/submit'} accent />
                <SidebarLink to="/my-submissions" label="Reports" isActive={location.pathname === '/my-submissions'} />
              </div>
            </div>
          )}

          {/* Admin Section */}
          {adminEnabled && user.isLoggedIn && user.type === 'admin' && (
            <div>
              <div style={{
                fontSize: '0.7rem',
                fontWeight: '900',
                letterSpacing: '0.15em',
                color: '#ef4444',
                marginBottom: '1rem',
                textTransform: 'uppercase',
                fontFamily: 'monospace'
              }}>// SYSTEM</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <SidebarLink to="/admin" label="Admin Panel" isActive={location.pathname === '/admin'} danger />
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Layout */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Top Bar */}
        <div style={{
          background: 'linear-gradient(90deg, #0f1419 0%, #141b2f 100%)',
          borderBottom: '1px solid #1e293b',
          padding: '1rem 2rem',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          position: 'relative'
        }}>
          {/* Profile Circle Menu */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: user.isLoggedIn ? 'linear-gradient(135deg, #0f9488 0%, #14b8a6 100%)' : '#334155',
                color: '#ffffff',
                border: '2px solid #0f9488',
                fontSize: '1.2rem',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.boxShadow = '0 0 15px rgba(15, 148, 136, 0.4)';
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.boxShadow = 'none';
              }}
            >
              {user.isLoggedIn ? user.name?.charAt(0).toUpperCase() : 'G'}
            </button>

            {/* Dropdown Menu */}
            {profileMenuOpen && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '0.5rem',
                background: 'linear-gradient(135deg, #0f1419 0%, #1a202c 100%)',
                border: '1px solid #0f9488',
                borderRadius: '0.75rem',
                minWidth: '200px',
                boxShadow: '0 10px 25px rgba(15, 148, 136, 0.2)',
                zIndex: 1000
              }}>
                <div style={{ padding: '1rem', borderBottom: '1px solid #1e293b' }}>
                  <p style={{ margin: '0 0 0.25rem 0', color: '#e2e8f0', fontWeight: '600', fontSize: '0.9rem' }}>
                    {user.isLoggedIn ? user.name : 'Guest'}
                  </p>
                  <p style={{
                    margin: 0,
                    color: '#94a3b8',
                    fontSize: '0.8rem',
                    textTransform: 'capitalize'
                  }}>
                    {user.isLoggedIn ? (user.type === 'hacker' ? 'Bug Bounty Hunter' : user.type) : 'Not logged in'}
                  </p>
                </div>

                {user.isLoggedIn && (
                  <>
                    <Link
                      to="/profile"
                      style={{
                        display: 'block',
                        padding: '0.75rem 1rem',
                        color: '#cbd5e1',
                        textDecoration: 'none',
                        borderBottom: '1px solid #1e293b',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.background = '#0f9488';
                        (e.currentTarget as HTMLElement).style.color = '#ffffff';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.background = 'transparent';
                        (e.currentTarget as HTMLElement).style.color = '#cbd5e1';
                      }}
                    >
                      Profile Settings
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setProfileMenuOpen(false);
                      }}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        background: 'transparent',
                        color: '#ef4444',
                        border: 'none',
                        textAlign: 'left',
                        cursor: 'pointer',
                        fontSize: '0.95rem',
                        fontWeight: '600',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.background = '#7f1d1d';
                        (e.currentTarget as HTMLElement).style.color = '#fca5a5';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.background = 'transparent';
                        (e.currentTarget as HTMLElement).style.color = '#ef4444';
                      }}
                    >
                      Logout
                    </button>
                  </>
                )}

                {!user.isLoggedIn && (
                  <Link
                    to="/login"
                    style={{
                      display: 'block',
                      padding: '0.75rem 1rem',
                      color: '#14b8a6',
                      textDecoration: 'none',
                      fontWeight: '600',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.background = '#0f9488';
                      (e.currentTarget as HTMLElement).style.color = '#ffffff';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background = 'transparent';
                      (e.currentTarget as HTMLElement).style.color = '#14b8a6';
                    }}
                  >
                    Login
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <main style={{ flex: 1, padding: '2rem', background: '#0a0e27', overflowY: 'auto' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const SidebarLink = ({ to, label, isActive, accent, danger }: {
  to: string;
  label: string;
  isActive: boolean;
  accent?: boolean;
  danger?: boolean;
}) => {
  let backgroundColor = 'transparent';
  let color = '#cbd5e1';
  let borderLeft = '2px solid transparent';

  if (isActive) {
    backgroundColor = '#0f9488';
    color = '#ffffff';
    borderLeft = '2px solid #0f9488';
  } else if (accent) {
    color = '#14b8a6';
  } else if (danger) {
    color = '#ef4444';
    borderLeft = '2px solid #ef4444';
  }

  return (
    <Link to={to} style={{
      color,
      textDecoration: 'none',
      padding: '0.75rem 0.875rem',
      borderRadius: '0.4rem',
      fontSize: '0.9rem',
      fontWeight: '500',
      display: 'block',
      backgroundColor,
      transition: 'all 0.2s ease',
      cursor: 'pointer',
      borderLeft,
      fontFamily: 'monospace'
    }}
    onMouseEnter={(e) => {
      if (!isActive) {
        (e.currentTarget as HTMLElement).style.backgroundColor = '#0f1419';
        if (danger) {
          (e.currentTarget as HTMLElement).style.borderLeftColor = '#ef4444';
        } else {
          (e.currentTarget as HTMLElement).style.borderLeftColor = '#0f9488';
        }
      }
    }}
    onMouseLeave={(e) => {
      if (!isActive) {
        (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
        (e.currentTarget as HTMLElement).style.borderLeftColor = 'transparent';
      }
    }}
    >
      {label}
    </Link>
  );
};

export default MainLayout;
