import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import {
  LayoutDashboard, Globe, BarChart2, BookOpen,
  Shield, FileText, Users, Settings, ShieldAlert, Bell,
} from 'lucide-react';

const SB = {
  bg: '#1C1F35',
  active: '#1DBCA7',
  muted: '#A0A3B8',
  border: '#2E3150',
};

const MainLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useUser();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    };
    if (profileMenuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [profileMenuOpen]);

  const coreNav = [
    { icon: LayoutDashboard, to: '/dashboard',  label: 'Dashboard' },
    { icon: Globe,           to: '/bounties',   label: 'Programs' },
    { icon: BarChart2,       to: '/leaderboard',label: 'Leaderboard' },
    { icon: BookOpen,        to: '/kb',         label: 'Resources' },
  ];
  const hackerNav = user.isLoggedIn && user.type === 'user' ? [
    { icon: Shield,   to: '/submit',          label: 'Submit Report' },
    { icon: FileText, to: '/my-submissions',  label: 'My Submissions' },
  ] : [];
  const companyNav = user.isLoggedIn && user.type === 'company' ? [
    { icon: Users,           to: '/company/dashboard',   label: 'Company' },
    { icon: LayoutDashboard, to: '/company/add-project', label: 'Add Program' },
    { icon: FileText,        to: '/company/reports',     label: 'Reports' },
  ] : [];
  const adminNav = user.isLoggedIn && user.type === 'admin' ? [
    { icon: ShieldAlert, to: '/admin',         label: 'Admin Panel' },
    { icon: Settings,    to: '/admin/support', label: 'Support Requests' },
  ] : [];
  const allNav = [...coreNav, ...hackerNav, ...companyNav, ...adminNav];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>

      {/* ── Top announcement banner ── */}
      <div style={{
        height: '38px', background: '#EBF0FF', borderBottom: '1px solid #C7D2FE',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 1.25rem',
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
      }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
          <span style={{ fontSize: '0.8rem', color: '#4F46E5' }}>ⓘ</span>
          <span style={{ fontSize: '0.78rem', color: '#3730A3', fontWeight: 500 }}>
            Learn more about BountyOS — the trusted bug bounty platform
          </span>
        </div>
        {!user.isLoggedIn ? (
          <Link to="/login" style={{
            background: '#3F3AFC', color: '#fff', borderRadius: '4px',
            padding: '3px 14px', fontSize: '0.75rem', fontWeight: 600, textDecoration: 'none',
          }}>Log in</Link>
        ) : (
          <span style={{ fontSize: '0.75rem', color: '#3730A3', fontWeight: 600 }}>{user.name}</span>
        )}
      </div>

      <div style={{ display: 'flex', marginTop: '38px', minHeight: 'calc(100vh - 38px)' }}>

        {/* ── Icon-rail sidebar ── */}
        <nav style={{
          width: '52px', background: SB.bg, borderRight: `1px solid ${SB.border}`,
          position: 'fixed', top: '38px', left: 0, bottom: 0, zIndex: 100,
          display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px 0',
        }}>
          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none', marginBottom: '14px' }}>
            <div style={{
              width: '34px', height: '34px',
              background: 'linear-gradient(135deg, #3F3AFC, #E81C79)',
              borderRadius: '7px', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontWeight: 900, color: '#fff', fontSize: '15px',
            }}>B</div>
          </Link>

          {/* Nav icons */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', width: '100%' }}>
            {allNav.map(({ icon: Icon, to, label }) => {
              const isActive = location.pathname === to || (to !== '/dashboard' && location.pathname.startsWith(to));
              return (
                <NavIcon key={to} to={to} label={label} isActive={isActive}>
                  <Icon size={20} strokeWidth={isActive ? 2.1 : 1.7} />
                </NavIcon>
              );
            })}
          </div>

          {/* Divider */}
          <div style={{ width: '30px', height: '1px', background: SB.border, margin: '8px 0' }} />

          {/* Bell */}
          {user.isLoggedIn && (
            <NavIcon to="/notifications" label="Notifications" isActive={location.pathname === '/notifications'}>
              <Bell size={20} strokeWidth={1.7} />
            </NavIcon>
          )}

          {/* Profile avatar */}
          <div ref={menuRef} style={{ marginTop: 'auto', position: 'relative', paddingBottom: '8px' }}>
            <button
              onClick={() => setProfileMenuOpen(p => !p)}
              title={user.isLoggedIn ? user.name || 'Profile' : 'Guest'}
              style={{
                width: '34px', height: '34px', borderRadius: '50%',
                background: user.isLoggedIn ? SB.active : SB.border,
                color: '#fff', border: 'none', fontWeight: 700, fontSize: '0.82rem',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              {user.isLoggedIn ? (user.name?.charAt(0).toUpperCase() ?? 'U') : 'G'}
            </button>

            {profileMenuOpen && (
              <div style={{
                position: 'absolute', bottom: '100%', left: '52px',
                marginBottom: '4px', marginLeft: '-4px',
                background: SB.bg, border: `1px solid ${SB.border}`,
                borderRadius: '10px', minWidth: '200px',
                boxShadow: '0 8px 30px rgba(0,0,0,0.45)', zIndex: 1000,
              }}>
                <div style={{ padding: '0.75rem 1rem', borderBottom: `1px solid ${SB.border}` }}>
                  <p style={{ margin: 0, color: '#fff', fontWeight: 600, fontSize: '0.88rem' }}>
                    {user.isLoggedIn ? user.name : 'Guest'}
                  </p>
                  <p style={{ margin: '2px 0 0', color: SB.muted, fontSize: '0.75rem', textTransform: 'capitalize' }}>
                    {user.isLoggedIn ? (user.type === 'user' ? 'Bug Bounty Hunter' : user.type) : 'Not logged in'}
                  </p>
                </div>

                {user.isLoggedIn ? (
                  <>
                    {[
                      { label: 'Profile',       to: '/profile' },
                      { label: 'Settings',      to: '/settings' },
                      { label: 'Notifications', to: '/notifications' },
                      { label: 'Messages',      to: '/messages' },
                      { label: 'Analytics',     to: '/analytics' },
                    ].map(l => (
                      <Link key={l.label} to={l.to} onClick={() => setProfileMenuOpen(false)} style={{
                        display: 'block', padding: '0.55rem 1rem', color: SB.muted,
                        textDecoration: 'none', fontSize: '0.84rem', borderBottom: `1px solid ${SB.border}`,
                        transition: 'color 0.15s',
                      }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#fff'}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = SB.muted}
                      >{l.label}</Link>
                    ))}
                    <button
                      onClick={() => { logout(); setProfileMenuOpen(false); navigate('/'); }}
                      style={{
                        width: '100%', padding: '0.55rem 1rem', background: 'transparent',
                        color: '#ef4444', border: 'none', textAlign: 'left',
                        cursor: 'pointer', fontSize: '0.84rem', fontWeight: 600,
                      }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.08)'}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                    >Logout</button>
                  </>
                ) : (
                  <Link to="/login" onClick={() => setProfileMenuOpen(false)} style={{
                    display: 'block', padding: '0.55rem 1rem', color: SB.active,
                    textDecoration: 'none', fontWeight: 600, fontSize: '0.84rem',
                  }}>Login</Link>
                )}
              </div>
            )}
          </div>
        </nav>

        {/* ── Main content ── */}
        <main style={{
          marginLeft: '52px', flex: 1,
          background: '#F7F9FC',
          minHeight: 'calc(100vh - 38px)',
          overflowY: 'auto',
        }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

/* Reusable icon nav link */
function NavIcon({ to, label, isActive, children }: {
  to: string; label: string; isActive: boolean; children: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      title={label}
      style={{
        width: '40px', height: '40px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        borderRadius: '8px', textDecoration: 'none',
        background: isActive ? 'rgba(29,188,167,0.15)' : 'transparent',
        color: isActive ? '#1DBCA7' : '#A0A3B8',
        transition: 'all 0.15s ease',
        position: 'relative',
      }}
      onMouseEnter={e => {
        if (!isActive) {
          (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.07)';
          (e.currentTarget as HTMLElement).style.color = '#fff';
        }
      }}
      onMouseLeave={e => {
        if (!isActive) {
          (e.currentTarget as HTMLElement).style.background = 'transparent';
          (e.currentTarget as HTMLElement).style.color = '#A0A3B8';
        }
      }}
    >
      {isActive && (
        <span style={{
          position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)',
          width: '3px', height: '18px', background: '#1DBCA7', borderRadius: '0 2px 2px 0',
        }} />
      )}
      {children}
    </Link>
  );
}

export default MainLayout;
