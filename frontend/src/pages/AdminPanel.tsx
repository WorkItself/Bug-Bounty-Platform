import { useState, useEffect } from 'react';
import { useUser } from '../context/UserContext';
import axiosInstance from '../utils/axiosInstance';
import {
  LayoutDashboard, Users, Building2, HeadphonesIcon,
  ShieldCheck, Search, ChevronRight, TrendingUp,
} from 'lucide-react';

interface PendingCompany {
  id: number; userName: string; email: string;
  legalName: string; legalAddress: string; city: string; country: string;
  website?: string; registeredOn: string;
}

interface PlatformUser {
  id: number; userName: string; email: string; role: string; registeredOn: string;
}

type Section = 'overview' | 'users' | 'pending';

/* ── Palette ─────────────────────────────────────────────── */
const C = {
  sidebarBg: '#ffffff',
  sidebarBorder: '#E5E7EB',
  contentBg: '#F7F9FC',
  headerBg: '#ffffff',
  text: '#111827',
  muted: '#6B7280',
  active: '#009B77',
  activeBg: '#F0FDF9',
  activeBorder: '#009B77',
  hover: '#F9FAFB',
  roleBg: { User: '#EEF2FF', Company: '#FFF0F6', Admin: '#FFFBEB' },
  roleText: { User: '#3F3AFC', Company: '#E81C79', Admin: '#D97706' },
};

/* ── Sub-components ──────────────────────────────────────── */
function SidebarSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '0.5rem' }}>
      <p style={{ margin: '0.75rem 0.75rem 0.25rem', fontSize: '0.7rem', fontWeight: 700,
        color: C.muted, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
        {title}
      </p>
      {children}
    </div>
  );
}

function SidebarItem({ icon, label, active, badge, onClick }: {
  icon: React.ReactNode; label: string; active: boolean;
  badge?: number; onClick: () => void;
}) {
  return (
    <button onClick={onClick} style={{
      width: '100%', display: 'flex', alignItems: 'center', gap: '0.6rem',
      padding: '0.5rem 0.75rem', borderRadius: '6px', border: 'none', cursor: 'pointer',
      background: active ? C.activeBg : 'transparent',
      color: active ? C.active : C.text,
      fontWeight: active ? 600 : 500, fontSize: '0.875rem',
      textAlign: 'left', transition: 'background 0.15s',
      borderLeft: active ? `2px solid ${C.activeBorder}` : '2px solid transparent',
    }}
      onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = C.hover; }}
      onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
    >
      <span style={{ flexShrink: 0, opacity: active ? 1 : 0.6 }}>{icon}</span>
      <span style={{ flex: 1 }}>{label}</span>
      {badge !== undefined && badge > 0 && (
        <span style={{
          background: '#E81C79', color: '#fff', borderRadius: '10px',
          padding: '1px 7px', fontSize: '0.7rem', fontWeight: 700,
        }}>{badge}</span>
      )}
    </button>
  );
}

function StatCard({ label, value, sub, color }: { label: string; value: number | string; sub?: string; color: string }) {
  return (
    <div style={{
      background: '#fff', borderRadius: '10px', border: '1px solid #E5E7EB',
      padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem',
    }}>
      <p style={{ margin: 0, fontSize: '0.78rem', fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
      <p style={{ margin: 0, fontSize: '2rem', fontWeight: 800, color, lineHeight: 1.2 }}>{value}</p>
      {sub && <p style={{ margin: 0, fontSize: '0.78rem', color: C.muted }}>{sub}</p>}
    </div>
  );
}

function RoleBadge({ role }: { role: string }) {
  const bg = (C.roleBg as Record<string, string>)[role] ?? '#F3F4F6';
  const color = (C.roleText as Record<string, string>)[role] ?? '#374151';
  return (
    <span style={{ background: bg, color, borderRadius: '20px', padding: '2px 10px', fontSize: '0.72rem', fontWeight: 700 }}>
      {role}
    </span>
  );
}

/* ── Main component ──────────────────────────────────────── */
const AdminPanel = () => {
  const { user } = useUser();
  const [section, setSection] = useState<Section>('overview');
  const [users, setUsers] = useState<PlatformUser[]>([]);
  const [filtered, setFiltered] = useState<PlatformUser[]>([]);
  const [search, setSearch] = useState('');
  const [usersLoading, setUsersLoading] = useState(true);
  const [pending, setPending] = useState<PendingCompany[]>([]);
  const [pendingLoading, setPendingLoading] = useState(false);
  const [verifyMsg, setVerifyMsg] = useState<{ id: number; msg: string; ok: boolean } | null>(null);

  useEffect(() => {
    axiosInstance.get('/users')
      .then(res => { setUsers(res.data ?? []); setFiltered(res.data ?? []); })
      .catch(() => {})
      .finally(() => setUsersLoading(false));
    axiosInstance.get('/company/pending')
      .then(res => setPending(res.data ?? []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (section !== 'pending') return;
    setPendingLoading(true);
    axiosInstance.get('/company/pending')
      .then(res => setPending(res.data ?? []))
      .catch(() => {})
      .finally(() => setPendingLoading(false));
  }, [section]);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(users.filter(u => u.userName.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)));
  }, [search, users]);

  const handleApprove = async (company: PendingCompany) => {
    try {
      await axiosInstance.patch(`/company/approve/${company.id}`);
      setPending(prev => prev.filter(c => c.id !== company.id));
    } catch {}
  };

  if (!user.isLoggedIn || user.type !== 'admin') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', flexDirection: 'column', gap: '1rem' }}>
        <ShieldCheck size={48} color='#ef4444' />
        <h1 style={{ color: '#ef4444', margin: 0 }}>Access Denied</h1>
        <p style={{ color: C.muted, margin: 0 }}>This area is restricted to administrators only.</p>
      </div>
    );
  }

  const sectionTitle: Record<Section, string> = {
    overview: 'Overview', users: 'All Users', pending: 'Pending Companies',
  };
  const sectionCrumbs: Record<Section, string[]> = {
    overview: ['Admin', 'Overview'],
    users: ['Admin', 'Management', 'All Users'],
    pending: ['Admin', 'Management', 'Pending Companies'],
  };

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 38px)', background: C.contentBg }}>

      {/* ── Secondary Sidebar ─────────────────────────────── */}
      <aside style={{
        width: '220px', flexShrink: 0, background: C.sidebarBg,
        borderRight: `1px solid ${C.sidebarBorder}`,
        position: 'sticky', top: 0, height: 'calc(100vh - 38px)',
        display: 'flex', flexDirection: 'column', overflowY: 'auto',
      }}>
        {/* Brand header */}
        <div style={{ padding: '1rem 0.75rem', borderBottom: `1px solid ${C.sidebarBorder}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '28px', height: '28px', borderRadius: '6px',
              background: 'linear-gradient(135deg, #009B77, #007A60)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <ShieldCheck size={14} color='#fff' />
            </div>
            <div>
              <p style={{ margin: 0, fontWeight: 700, fontSize: '0.85rem', color: C.text }}>Admin Panel</p>
              <p style={{ margin: 0, fontSize: '0.7rem', color: C.muted }}>BountyOS</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '0.5rem 0.25rem' }}>
          <SidebarSection title="Overview">
            <SidebarItem icon={<LayoutDashboard size={15} />} label="Dashboard" active={section === 'overview'} onClick={() => setSection('overview')} />
          </SidebarSection>

          <SidebarSection title="Management">
            <SidebarItem icon={<Users size={15} />} label="All Users" active={section === 'users'} onClick={() => setSection('users')} />
            <SidebarItem icon={<Building2 size={15} />} label="Pending Companies" active={section === 'pending'} onClick={() => setSection('pending')} badge={pending.length} />
          </SidebarSection>

          <SidebarSection title="Support">
            <SidebarItem icon={<HeadphonesIcon size={15} />} label="Support Requests" active={false} onClick={() => window.location.href = '/admin/support'} />
          </SidebarSection>
        </nav>

        {/* Footer */}
        <div style={{ padding: '0.75rem', borderTop: `1px solid ${C.sidebarBorder}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              width: '30px', height: '30px', borderRadius: '50%',
              background: '#f59e0b', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: '0.8rem', flexShrink: 0,
            }}>A</div>
            <div style={{ overflow: 'hidden' }}>
              <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: 600, color: C.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user.name || 'Admin'}
              </p>
              <p style={{ margin: 0, fontSize: '0.7rem', color: C.muted }}>Administrator</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main Content ──────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

        {/* Page header */}
        <div style={{
          background: C.headerBg, borderBottom: `1px solid ${C.sidebarBorder}`,
          padding: '0.75rem 1.5rem',
        }}>
          {/* Breadcrumbs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.25rem' }}>
            {sectionCrumbs[section].map((crumb, i, arr) => (
              <span key={crumb} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ fontSize: '0.75rem', color: i === arr.length - 1 ? C.text : C.muted, fontWeight: i === arr.length - 1 ? 600 : 400 }}>
                  {crumb}
                </span>
                {i < arr.length - 1 && <ChevronRight size={12} color={C.muted} />}
              </span>
            ))}
          </div>
          <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, color: C.text }}>
            {sectionTitle[section]}
          </h1>
        </div>

        {/* Content */}
        <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }}>
          {section === 'overview' && <OverviewSection users={users} pending={pending} />}
          {section === 'users' && (
            <UsersSection
              users={filtered} loading={usersLoading} search={search}
              onSearch={setSearch} verifyMsg={verifyMsg} setVerifyMsg={setVerifyMsg}
            />
          )}
          {section === 'pending' && (
            <PendingSection pending={pending} loading={pendingLoading} onApprove={handleApprove} />
          )}
        </div>
      </div>
    </div>
  );
};

/* ── Overview section ────────────────────────────────────── */
function OverviewSection({ users, pending }: { users: PlatformUser[]; pending: PendingCompany[] }) {
  const hackers = users.filter(u => u.role === 'User').length;
  const companies = users.filter(u => u.role === 'Company').length;

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <StatCard label="Total Users" value={users.length} sub="Registered accounts" color={C.active} />
        <StatCard label="Pending" value={pending.length} sub="Awaiting approval" color="#E81C79" />
        <StatCard label="Researchers" value={hackers} sub="Active hunters" color="#3F3AFC" />
        <StatCard label="Companies" value={companies} sub="Approved orgs" color="#f59e0b" />
      </div>

      <div style={{ background: '#fff', borderRadius: '10px', border: '1px solid #E5E7EB', padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <TrendingUp size={16} color={C.active} />
          <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: C.text }}>Recent Registrations</h2>
        </div>
        {users.slice(0, 5).map(u => (
          <div key={u.id} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0.6rem 0', borderBottom: '1px solid #F3F4F6',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{
                width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
                background: (C.roleBg as Record<string, string>)[u.role] ?? '#F3F4F6',
                color: (C.roleText as Record<string, string>)[u.role] ?? '#374151',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 700, fontSize: '0.75rem',
              }}>
                {u.userName.charAt(0).toUpperCase()}
              </div>
              <div>
                <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 600, color: C.text }}>{u.userName}</p>
                <p style={{ margin: 0, fontSize: '0.75rem', color: C.muted }}>{u.email}</p>
              </div>
            </div>
            <RoleBadge role={u.role} />
          </div>
        ))}
        {users.length === 0 && <p style={{ color: C.muted, textAlign: 'center', margin: '1rem 0' }}>No users yet.</p>}
      </div>
    </div>
  );
}

/* ── Users section ───────────────────────────────────────── */
function UsersSection({ users, loading, search, onSearch, verifyMsg, setVerifyMsg }: {
  users: PlatformUser[]; loading: boolean; search: string;
  onSearch: (v: string) => void;
  verifyMsg: { id: number; msg: string; ok: boolean } | null;
  setVerifyMsg: (v: { id: number; msg: string; ok: boolean } | null) => void;
}) {
  const handleVerify = async (u: PlatformUser) => {
    try {
      await axiosInstance.patch(`/company/profile/${u.id}/verify`);
      setVerifyMsg({ id: u.id, msg: 'Company verified.', ok: true });
    } catch {
      setVerifyMsg({ id: u.id, msg: 'Verification failed.', ok: false });
    }
  };

  return (
    <div style={{ background: '#fff', borderRadius: '10px', border: '1px solid #E5E7EB', overflow: 'hidden' }}>
      {/* Toolbar */}
      <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: '320px' }}>
          <Search size={15} color={C.muted} style={{ position: 'absolute', left: '0.65rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            value={search} onChange={e => onSearch(e.target.value)}
            placeholder="Search by name or email…"
            style={{
              width: '100%', padding: '0.5rem 0.75rem 0.5rem 2rem',
              border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '0.85rem',
              background: '#F9FAFB', color: C.text, outline: 'none', boxSizing: 'border-box',
            }}
          />
        </div>
        <span style={{ fontSize: '0.8rem', color: C.muted }}>{users.length} result{users.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: C.muted }}>Loading…</div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ background: '#F9FAFB' }}>
              {['User', 'Email', 'Role', 'Registered', 'Actions'].map(h => (
                <th key={h} style={{ padding: '0.65rem 1.25rem', textAlign: 'left', fontWeight: 600,
                  color: C.muted, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em',
                  borderBottom: '1px solid #E5E7EB' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => (
              <tr key={u.id} style={{ borderBottom: '1px solid #F3F4F6', background: i % 2 === 0 ? '#fff' : '#FAFAFA' }}>
                <td style={{ padding: '0.75rem 1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <div style={{
                      width: '30px', height: '30px', borderRadius: '50%', flexShrink: 0,
                      background: (C.roleBg as Record<string, string>)[u.role] ?? '#F3F4F6',
                      color: (C.roleText as Record<string, string>)[u.role] ?? '#374151',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 700, fontSize: '0.8rem',
                    }}>
                      {u.userName.charAt(0).toUpperCase()}
                    </div>
                    <span style={{ fontWeight: 600, color: C.text }}>{u.userName}</span>
                  </div>
                </td>
                <td style={{ padding: '0.75rem 1.25rem', color: C.muted }}>{u.email}</td>
                <td style={{ padding: '0.75rem 1.25rem' }}><RoleBadge role={u.role} /></td>
                <td style={{ padding: '0.75rem 1.25rem', color: C.muted }}>
                  {new Date(u.registeredOn).toLocaleDateString()}
                </td>
                <td style={{ padding: '0.75rem 1.25rem' }}>
                  {u.role === 'Company' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <button onClick={() => handleVerify(u)} style={{
                        padding: '0.3rem 0.8rem', background: C.active, color: '#fff',
                        border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600,
                      }}
                        onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#007A60'}
                        onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = C.active}
                      >Verify</button>
                      {verifyMsg?.id === u.id && (
                        <span style={{ fontSize: '0.75rem', color: verifyMsg.ok ? C.active : '#ef4444' }}>
                          {verifyMsg.msg}
                        </span>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr><td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: C.muted }}>No users found.</td></tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

/* ── Pending companies section ───────────────────────────── */
function PendingSection({ pending, loading, onApprove }: {
  pending: PendingCompany[]; loading: boolean; onApprove: (c: PendingCompany) => void;
}) {
  if (loading) return <div style={{ textAlign: 'center', padding: '2rem', color: C.muted }}>Loading…</div>;

  if (pending.length === 0) {
    return (
      <div style={{
        background: '#fff', borderRadius: '10px', border: '1px solid #E5E7EB',
        padding: '3rem', textAlign: 'center',
      }}>
        <Building2 size={40} color='#D1D5DB' style={{ marginBottom: '0.75rem' }} />
        <p style={{ color: C.muted, margin: 0, fontWeight: 500 }}>No pending company applications.</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {pending.map(c => (
        <div key={c.id} style={{
          background: '#fff', borderRadius: '10px', border: '1px solid #E5E7EB',
          padding: '1.25rem 1.5rem',
          display: 'grid', gridTemplateColumns: '40px 1fr auto', gap: '1rem', alignItems: 'center',
        }}>
          {/* Avatar */}
          <div style={{
            width: '40px', height: '40px', borderRadius: '8px',
            background: '#FFF0F6', color: '#E81C79',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: '1rem', flexShrink: 0,
          }}>
            {c.legalName.charAt(0).toUpperCase()}
          </div>

          {/* Details */}
          <div>
            <p style={{ margin: '0 0 0.1rem', fontWeight: 700, fontSize: '0.95rem', color: C.text }}>{c.legalName}</p>
            <p style={{ margin: '0 0 0.2rem', fontSize: '0.82rem', color: C.muted }}>@{c.userName} · {c.email}</p>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#9CA3AF' }}>
              {c.legalAddress}, {c.city}, {c.country}
              {c.website && <span style={{ color: '#3F3AFC', marginLeft: '0.5rem' }}>{c.website}</span>}
            </p>
          </div>

          {/* Action */}
          <button onClick={() => onApprove(c)} style={{
            padding: '0.5rem 1.25rem', background: C.active, color: '#fff',
            border: 'none', borderRadius: '7px', cursor: 'pointer',
            fontWeight: 700, fontSize: '0.875rem', whiteSpace: 'nowrap',
          }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#007A60'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = C.active}
          >
            Approve
          </button>
        </div>
      ))}
    </div>
  );
}

export default AdminPanel;
