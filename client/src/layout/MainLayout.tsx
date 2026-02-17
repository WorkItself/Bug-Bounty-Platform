import { Link, Outlet, useLocation } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useUser } from '../context/UserContext';

const MainLayout = () => {
  const location = useLocation();
  const { user, logout } = useUser();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    };

    if (profileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileMenuOpen]);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0C1A30', color: '#FFFFFF', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      {/* Sidebar */}
      <nav style={{
        width: '280px',
        background: 'linear-gradient(180deg, #0C1A30 0%, #1B3A57 100%)',
        padding: '2rem 1.5rem',
        borderRight: '2px solid #009B77',
        display: 'flex',
        flexDirection: 'column',
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflowY: 'auto'
      }}>
        {/* Logo with Cybersec Theme */}
        <div style={{ marginBottom: '2.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid #009B77', opacity: 0.9 }}>
          <div style={{
            fontSize: '0.65rem',
            fontWeight: '900',
            letterSpacing: '0.2em',
            color: '#009B77',
            marginBottom: '0.5rem',
            fontFamily: 'monospace'
          }}>[ SECURE ]</div>
          <div style={{
            fontSize: '1.2rem',
            fontWeight: '900',
            color: '#FFFFFF',
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
              color: '#009B77',
              marginBottom: '1rem',
              textTransform: 'uppercase',
              fontFamily: 'monospace'
            }}>// NAVIGATION</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <SidebarLink to="/" label="Dashboard" isActive={location.pathname === '/'} />
              <SidebarLink to="/bounties" label="Bounty Programs" isActive={location.pathname === '/bounties'} />
              <SidebarLink to="/leaderboard" label="Leaderboard" isActive={location.pathname === '/leaderboard'} />
              <SidebarLink to="/kb" label="Resources" isActive={location.pathname === '/kb'} />
              {user.isLoggedIn && user.type !== 'admin' && (
                <SidebarLink to="/support" label="Contact Support" isActive={location.pathname === '/support'} />
              )}
            </div>
          </div>

          {/* Researcher Section */}
          {user.isLoggedIn && user.type === 'hacker' && (
            <div>
              <div style={{
                fontSize: '0.7rem',
                fontWeight: '900',
                letterSpacing: '0.15em',
                color: '#A2DFF7',
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
                color: '#A2DFF7',
                marginBottom: '1rem',
                textTransform: 'uppercase',
                fontFamily: 'monospace'
              }}>// COMPANY</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <SidebarLink to="/company/dashboard" label="Company Dashboard" isActive={location.pathname === '/company/dashboard'} />
                <SidebarLink to="/company/add-project" label="Add Bounty Program" isActive={location.pathname === '/company/add-project'} accent />
                <SidebarLink to="/company/reports" label="View Reports" isActive={location.pathname === '/company/reports'} />
              </div>
            </div>
          )}

          {/* Admin Section */}
          {user.isLoggedIn && user.type === 'admin' && (
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
                <SidebarLink to="/admin/support" label="Support Requests" isActive={location.pathname === '/admin/support'} danger />
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Layout */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Top Bar */}
        <div style={{
          background: 'linear-gradient(90deg, #1B3A57 0%, #0C1A30 100%)',
          borderBottom: '1px solid #1B3A57',
          padding: '1rem 2rem',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          position: 'relative'
        }}>
          {/* Profile Circle Menu */}
          <div ref={menuRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                background: user.isLoggedIn ? 'linear-gradient(135deg, #009B77 0%, #007A60 100%)' : '#1B3A57',
                color: '#FFFFFF',
                border: '2px solid #009B77',
                fontSize: '1.2rem',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.boxShadow = '0 0 15px rgba(0, 155, 119, 0.4)';
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
                background: 'linear-gradient(135deg, #0C1A30 0%, #1B3A57 100%)',
                border: '2px solid #009B77',
                borderRadius: '0.75rem',
                minWidth: '220px',
                boxShadow: '0 10px 25px rgba(0, 155, 119, 0.2)',
                zIndex: 1000
              }}>
                <div style={{ padding: '1rem', borderBottom: '1px solid #1B3A57' }}>
                  <p style={{ margin: '0 0 0.25rem 0', color: '#FFFFFF', fontWeight: '600', fontSize: '0.9rem' }}>
                    {user.isLoggedIn ? user.name : 'Guest'}
                  </p>
                  <p style={{
                    margin: 0,
                    color: '#A2DFF7',
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
                        color: '#A2DFF7',
                        textDecoration: 'none',
                        borderBottom: '1px solid #1B3A57',
                        transition: 'all 0.2s ease',
                        fontSize: '0.9rem'
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.background = '#009B77';
                        (e.currentTarget as HTMLElement).style.color = '#0C1A30';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.background = 'transparent';
                        (e.currentTarget as HTMLElement).style.color = '#A2DFF7';
                      }}
                      onClick={() => setProfileMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      to="/settings"
                      style={{
                        display: 'block',
                        padding: '0.75rem 1rem',
                        color: '#A2DFF7',
                        textDecoration: 'none',
                        borderBottom: '1px solid #1B3A57',
                        transition: 'all 0.2s ease',
                        fontSize: '0.9rem'
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.background = '#009B77';
                        (e.currentTarget as HTMLElement).style.color = '#0C1A30';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.background = 'transparent';
                        (e.currentTarget as HTMLElement).style.color = '#A2DFF7';
                      }}
                      onClick={() => setProfileMenuOpen(false)}
                    >
                      Settings
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
                        fontSize: '0.9rem',
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
                      color: '#009B77',
                      textDecoration: 'none',
                      fontWeight: '600',
                      transition: 'all 0.2s ease',
                      fontSize: '0.9rem'
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.background = '#009B77';
                      (e.currentTarget as HTMLElement).style.color = '#0C1A30';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background = 'transparent';
                      (e.currentTarget as HTMLElement).style.color = '#009B77';
                    }}
                    onClick={() => setProfileMenuOpen(false)}
                  >
                    Login
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <main style={{ flex: 1, padding: '2rem', background: '#0C1A30', overflowY: 'auto' }}>
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
  let color = '#A2DFF7';
  let borderLeft = '2px solid transparent';

  if (isActive) {
    backgroundColor = '#009B77';
    color = '#FFFFFF';
    borderLeft = '2px solid #009B77';
  } else if (accent) {
    color = '#A2DFF7';
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
        (e.currentTarget as HTMLElement).style.backgroundColor = '#1B3A57';
        if (danger) {
          (e.currentTarget as HTMLElement).style.borderLeftColor = '#ef4444';
        } else {
          (e.currentTarget as HTMLElement).style.borderLeftColor = '#009B77';
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