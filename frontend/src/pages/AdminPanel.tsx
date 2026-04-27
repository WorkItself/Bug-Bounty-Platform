import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import axiosInstance from '../utils/axiosInstance';
import {
  LayoutDashboard, Users, Building2, HeadphonesIcon,
  ShieldCheck, Search, ChevronRight, TrendingUp,
  Pencil, Trash2, Check, X, ShieldOff, FileText,
} from 'lucide-react';

interface PendingCompany {
  id: number; userName: string; email: string;
  legalName: string; legalAddress: string; city: string; country: string;
  website?: string; registeredOn: string;
}

interface PlatformUser {
  id: number; userName: string; email: string; role: string;
  registeredOn: string; isVerified: boolean; isApproved: boolean;
}

type Section = 'overview' | 'users' | 'pending' | 'reports';

const C = {
  sidebarBg: '#ffffff', sidebarBorder: '#E5E7EB', contentBg: '#F7F9FC',
  headerBg: '#ffffff', text: '#111827', muted: '#6B7280',
  active: '#009B77', activeBg: '#F0FDF9', activeBorder: '#009B77', hover: '#F9FAFB',
  roleBg:   { User: '#EEF2FF', Company: '#FFF0F6', Admin: '#FFFBEB' },
  roleText: { User: '#3F3AFC', Company: '#E81C79', Admin: '#D97706' },
};

function SidebarSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '0.5rem' }}>
      <p style={{ margin: '0.75rem 0.75rem 0.25rem', fontSize: '0.7rem', fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{title}</p>
      {children}
    </div>
  );
}

function SidebarItem({ icon, label, active, badge, onClick }: {
  icon: React.ReactNode; label: string; active: boolean; badge?: number; onClick: () => void;
}) {
  return (
    <button onClick={onClick} style={{
      width: '100%', display: 'flex', alignItems: 'center', gap: '0.6rem',
      padding: '0.5rem 0.75rem', borderRadius: '6px', border: 'none', cursor: 'pointer',
      background: active ? C.activeBg : 'transparent', color: active ? C.active : C.text,
      fontWeight: active ? 600 : 500, fontSize: '0.875rem', textAlign: 'left',
      borderLeft: active ? `2px solid ${C.activeBorder}` : '2px solid transparent',
    }}
      onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = C.hover; }}
      onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
    >
      <span style={{ flexShrink: 0, opacity: active ? 1 : 0.6 }}>{icon}</span>
      <span style={{ flex: 1 }}>{label}</span>
      {badge !== undefined && badge > 0 && (
        <span style={{ background: '#E81C79', color: '#fff', borderRadius: '10px', padding: '1px 7px', fontSize: '0.7rem', fontWeight: 700 }}>{badge}</span>
      )}
    </button>
  );
}

function RoleBadge({ role }: { role: string }) {
  const bg = (C.roleBg as Record<string, string>)[role] ?? '#F3F4F6';
  const color = (C.roleText as Record<string, string>)[role] ?? '#374151';
  return <span style={{ background: bg, color, borderRadius: '20px', padding: '2px 10px', fontSize: '0.72rem', fontWeight: 700 }}>{role}</span>;
}

function StatCard({ label, value, sub, color }: { label: string; value: number | string; sub?: string; color: string }) {
  return (
    <div style={{ background: '#fff', borderRadius: '10px', border: '1px solid #E5E7EB', padding: '1.25rem 1.5rem' }}>
      <p style={{ margin: '0 0 0.25rem', fontSize: '0.78rem', fontWeight: 600, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
      <p style={{ margin: '0 0 0.15rem', fontSize: '2rem', fontWeight: 800, color, lineHeight: 1.2 }}>{value}</p>
      {sub && <p style={{ margin: 0, fontSize: '0.78rem', color: C.muted }}>{sub}</p>}
    </div>
  );
}

const AdminPanel = () => {
  const { user } = useUser();
  const [section, setSection] = useState<Section>('overview');
  const [users, setUsers] = useState<PlatformUser[]>([]);
  const [filtered, setFiltered] = useState<PlatformUser[]>([]);
  const [search, setSearch] = useState('');
  const [usersLoading, setUsersLoading] = useState(true);
  const [pending, setPending] = useState<PendingCompany[]>([]);
  const [pendingLoading, setPendingLoading] = useState(false);

  const loadUsers = () => {
    axiosInstance.get('/users')
      .then(res => { setUsers(res.data ?? []); setFiltered(res.data ?? []); })
      .catch(() => {})
      .finally(() => setUsersLoading(false));
  };

  const loadPending = () => {
    setPendingLoading(true);
    axiosInstance.get('/company/pending')
      .then(res => setPending(res.data ?? []))
      .catch(() => {})
      .finally(() => setPendingLoading(false));
  };

  useEffect(() => { loadUsers(); loadPending(); }, []);
  useEffect(() => { if (section === 'pending') loadPending(); }, [section]);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(users.filter(u => u.userName.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)));
  }, [search, users]);

  const handleApprove = async (c: PendingCompany) => {
    await axiosInstance.patch(`/company/approve/${c.id}`).catch(() => {});
    setPending(prev => prev.filter(x => x.id !== c.id));
    loadUsers();
  };

  const handleDeny = async (c: PendingCompany) => {
    await axiosInstance.delete(`/company/deny/${c.id}`).catch(() => {});
    setPending(prev => prev.filter(x => x.id !== c.id));
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

  const crumbs: Record<Section, string[]> = {
    overview: ['Admin', 'Overview'],
    users: ['Admin', 'Management', 'All Users'],
    pending: ['Admin', 'Management', 'Pending Companies'],
    reports: ['Admin', 'Management', 'All Reports'],
  };
  const titles: Record<Section, string> = { overview: 'Overview', users: 'All Users', pending: 'Pending Companies', reports: 'All Reports' };

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 38px)', background: C.contentBg }}>
      {/* Sidebar */}
      <aside style={{ width: '220px', flexShrink: 0, background: C.sidebarBg, borderRight: `1px solid ${C.sidebarBorder}`, position: 'sticky', top: 0, height: 'calc(100vh - 38px)', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        <div style={{ padding: '1rem 0.75rem', borderBottom: `1px solid ${C.sidebarBorder}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'linear-gradient(135deg, #009B77, #007A60)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={14} color='#fff' />
            </div>
            <div>
              <p style={{ margin: 0, fontWeight: 700, fontSize: '0.85rem', color: C.text }}>Admin Panel</p>
              <p style={{ margin: 0, fontSize: '0.7rem', color: C.muted }}>BountyOS</p>
            </div>
          </div>
        </div>

        <nav style={{ flex: 1, padding: '0.5rem 0.25rem' }}>
          <SidebarSection title="Overview">
            <SidebarItem icon={<LayoutDashboard size={15} />} label="Dashboard" active={section === 'overview'} onClick={() => setSection('overview')} />
          </SidebarSection>
          <SidebarSection title="Management">
            <SidebarItem icon={<Users size={15} />} label="All Users" active={section === 'users'} onClick={() => setSection('users')} />
            <SidebarItem icon={<Building2 size={15} />} label="Pending Companies" active={section === 'pending'} onClick={() => setSection('pending')} badge={pending.length} />
            <SidebarItem icon={<FileText size={15} />} label="All Reports" active={section === 'reports'} onClick={() => setSection('reports')} />
          </SidebarSection>
          <SidebarSection title="Support">
            <SidebarItem icon={<HeadphonesIcon size={15} />} label="Support Requests" active={false} onClick={() => window.location.href = '/admin/support'} />
          </SidebarSection>
        </nav>
      </aside>

      {/* Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ background: C.headerBg, borderBottom: `1px solid ${C.sidebarBorder}`, padding: '0.75rem 1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.25rem' }}>
            {crumbs[section].map((crumb, i, arr) => (
              <span key={crumb} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span style={{ fontSize: '0.75rem', color: i === arr.length - 1 ? C.text : C.muted, fontWeight: i === arr.length - 1 ? 600 : 400 }}>{crumb}</span>
                {i < arr.length - 1 && <ChevronRight size={12} color={C.muted} />}
              </span>
            ))}
          </div>
          <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, color: C.text }}>{titles[section]}</h1>
        </div>

        <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto' }}>
          {section === 'overview' && <OverviewSection users={users} pending={pending} />}
          {section === 'users' && (
            <UsersSection users={filtered} loading={usersLoading} search={search} onSearch={setSearch} onRefresh={loadUsers} />
          )}
          {section === 'pending' && (
            <PendingSection pending={pending} loading={pendingLoading} onApprove={handleApprove} onDeny={handleDeny} />
          )}
          {section === 'reports' && <ReportsSection />}
        </div>
      </div>
    </div>
  );
};

/* ── Overview ────────────────────────────────────────────── */
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
          <div key={u.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid #F3F4F6' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0, background: (C.roleBg as Record<string, string>)[u.role] ?? '#F3F4F6', color: (C.roleText as Record<string, string>)[u.role] ?? '#374151', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.75rem' }}>
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
function UsersSection({ users, loading, search, onSearch, onRefresh }: {
  users: PlatformUser[]; loading: boolean; search: string;
  onSearch: (v: string) => void; onRefresh: () => void;
}) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({ userName: '', email: '' });
  const [actionMsg, setActionMsg] = useState<{ id: number; msg: string; ok: boolean } | null>(null);

  const startEdit = (u: PlatformUser) => {
    setEditingId(u.id);
    setEditForm({ userName: u.userName, email: u.email });
    setActionMsg(null);
  };

  const cancelEdit = () => { setEditingId(null); };

  const saveEdit = async (u: PlatformUser) => {
    try {
      await axiosInstance.put(`/users/${u.id}`, editForm);
      setActionMsg({ id: u.id, msg: 'Saved.', ok: true });
      setEditingId(null);
      onRefresh();
    } catch (err: any) {
      const msg = err.response?.data?.message ?? 'Update failed.';
      setActionMsg({ id: u.id, msg, ok: false });
    }
  };

  const deleteUser = async (u: PlatformUser) => {
    if (!confirm(`Delete user "${u.userName}"? This cannot be undone.`)) return;
    try {
      await axiosInstance.delete(`/users/${u.id}`);
      onRefresh();
    } catch {
      setActionMsg({ id: u.id, msg: 'Delete failed.', ok: false });
    }
  };

  const verify = async (u: PlatformUser) => {
    try {
      await axiosInstance.patch(`/company/profile/${u.id}/verify`);
      setActionMsg({ id: u.id, msg: 'Verified.', ok: true });
      onRefresh();
    } catch {
      setActionMsg({ id: u.id, msg: 'Verify failed.', ok: false });
    }
  };

  const revoke = async (u: PlatformUser) => {
    try {
      await axiosInstance.patch(`/company/profile/${u.id}/revoke`);
      setActionMsg({ id: u.id, msg: 'Revoked.', ok: true });
      onRefresh();
    } catch {
      setActionMsg({ id: u.id, msg: 'Revoke failed.', ok: false });
    }
  };

  const inputSt: React.CSSProperties = {
    padding: '0.3rem 0.5rem', border: '1px solid #D1D5DB', borderRadius: '5px',
    fontSize: '0.82rem', color: C.text, background: '#fff', outline: 'none',
  };

  return (
    <div style={{ background: '#fff', borderRadius: '10px', border: '1px solid #E5E7EB', overflow: 'hidden' }}>
      <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: '320px' }}>
          <Search size={15} color={C.muted} style={{ position: 'absolute', left: '0.65rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input value={search} onChange={e => onSearch(e.target.value)} placeholder="Search by name or email…"
            style={{ width: '100%', padding: '0.5rem 0.75rem 0.5rem 2rem', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '0.85rem', background: '#F9FAFB', color: C.text, outline: 'none', boxSizing: 'border-box' }} />
        </div>
        <span style={{ fontSize: '0.8rem', color: C.muted }}>{users.length} result{users.length !== 1 ? 's' : ''}</span>
      </div>

      {loading ? (
        <div style={{ padding: '2rem', textAlign: 'center', color: C.muted }}>Loading…</div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ background: '#F9FAFB' }}>
              {['User', 'Email', 'Role', 'Status', 'Registered', 'Actions'].map(h => (
                <th key={h} style={{ padding: '0.65rem 1rem', textAlign: 'left', fontWeight: 600, color: C.muted, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid #E5E7EB' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((u, i) => {
              const isEditing = editingId === u.id;
              return (
                <tr key={u.id} style={{ borderBottom: '1px solid #F3F4F6', background: i % 2 === 0 ? '#fff' : '#FAFAFA', verticalAlign: 'middle' }}>
                  {/* Username */}
                  <td style={{ padding: '0.65rem 1rem' }}>
                    {isEditing
                      ? <input value={editForm.userName} onChange={e => setEditForm(f => ({ ...f, userName: e.target.value }))} style={{ ...inputSt, width: '120px' }} />
                      : <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div style={{ width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0, background: (C.roleBg as Record<string, string>)[u.role] ?? '#F3F4F6', color: (C.roleText as Record<string, string>)[u.role] ?? '#374151', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.75rem' }}>
                            {u.userName.charAt(0).toUpperCase()}
                          </div>
                          <span style={{ fontWeight: 600, color: C.text }}>{u.userName}</span>
                        </div>
                    }
                  </td>
                  {/* Email */}
                  <td style={{ padding: '0.65rem 1rem', color: C.muted }}>
                    {isEditing
                      ? <input type="email" value={editForm.email} onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))} style={{ ...inputSt, width: '160px' }} />
                      : u.email
                    }
                  </td>
                  {/* Role */}
                  <td style={{ padding: '0.65rem 1rem' }}><RoleBadge role={u.role} /></td>
                  {/* Status */}
                  <td style={{ padding: '0.65rem 1rem' }}>
                    {u.role === 'Company' && (
                      <span style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: '10px', fontWeight: 600, background: u.isVerified ? '#DCFCE7' : '#FEF3C7', color: u.isVerified ? '#16A34A' : '#D97706' }}>
                        {u.isVerified ? 'Verified' : 'Unverified'}
                      </span>
                    )}
                  </td>
                  {/* Registered */}
                  <td style={{ padding: '0.65rem 1rem', color: C.muted, fontSize: '0.8rem' }}>
                    {new Date(u.registeredOn).toLocaleDateString()}
                  </td>
                  {/* Actions */}
                  <td style={{ padding: '0.65rem 1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                      {isEditing ? (
                        <>
                          <button onClick={() => saveEdit(u)} title="Save" style={{ padding: '0.25rem 0.5rem', background: C.active, color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                            <Check size={13} />
                          </button>
                          <button onClick={cancelEdit} title="Cancel" style={{ padding: '0.25rem 0.5rem', background: '#F3F4F6', color: C.muted, border: 'none', borderRadius: '5px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                            <X size={13} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => startEdit(u)} title="Edit" style={{ padding: '0.25rem 0.5rem', background: '#EEF2FF', color: '#3F3AFC', border: 'none', borderRadius: '5px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                            <Pencil size={13} />
                          </button>
                          <button onClick={() => deleteUser(u)} title="Delete" style={{ padding: '0.25rem 0.5rem', background: '#FEF2F2', color: '#ef4444', border: 'none', borderRadius: '5px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                            <Trash2 size={13} />
                          </button>
                          {u.role === 'Company' && u.isApproved && !u.isVerified && (
                            <button onClick={() => verify(u)} title="Verify company" style={{ padding: '0.25rem 0.6rem', background: '#F0FDF9', color: C.active, border: `1px solid ${C.active}`, borderRadius: '5px', cursor: 'pointer', fontSize: '0.72rem', fontWeight: 600 }}>
                              Verify
                            </button>
                          )}
                          {u.role === 'Company' && u.isApproved && u.isVerified && (
                            <button onClick={() => revoke(u)} title="Revoke verification" style={{ padding: '0.25rem 0.6rem', background: '#FFF7ED', color: '#ea580c', border: '1px solid #ea580c', borderRadius: '5px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.72rem', fontWeight: 600 }}>
                              <ShieldOff size={11} /> Revoke
                            </button>
                          )}
                        </>
                      )}
                      {actionMsg?.id === u.id && (
                        <span style={{ fontSize: '0.72rem', color: actionMsg.ok ? C.active : '#ef4444' }}>{actionMsg.msg}</span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
            {users.length === 0 && (
              <tr><td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: C.muted }}>No users found.</td></tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

/* ── Pending companies ───────────────────────────────────── */
function PendingSection({ pending, loading, onApprove, onDeny }: {
  pending: PendingCompany[]; loading: boolean;
  onApprove: (c: PendingCompany) => void; onDeny: (c: PendingCompany) => void;
}) {
  if (loading) return <div style={{ textAlign: 'center', padding: '2rem', color: C.muted }}>Loading…</div>;

  if (pending.length === 0) {
    return (
      <div style={{ background: '#fff', borderRadius: '10px', border: '1px solid #E5E7EB', padding: '3rem', textAlign: 'center' }}>
        <Building2 size={40} color='#D1D5DB' style={{ marginBottom: '0.75rem' }} />
        <p style={{ color: C.muted, margin: 0, fontWeight: 500 }}>No pending company applications.</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      {pending.map(c => (
        <div key={c.id} style={{ background: '#fff', borderRadius: '10px', border: '1px solid #E5E7EB', padding: '1.25rem 1.5rem', display: 'grid', gridTemplateColumns: '40px 1fr auto', gap: '1rem', alignItems: 'center' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#FFF0F6', color: '#E81C79', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1rem', flexShrink: 0 }}>
            {c.legalName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p style={{ margin: '0 0 0.1rem', fontWeight: 700, fontSize: '0.95rem', color: C.text }}>{c.legalName}</p>
            <p style={{ margin: '0 0 0.2rem', fontSize: '0.82rem', color: C.muted }}>@{c.userName} · {c.email}</p>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#9CA3AF' }}>
              {c.legalAddress}, {c.city}, {c.country}
              {c.website && <span style={{ color: '#3F3AFC', marginLeft: '0.5rem' }}>{c.website}</span>}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={() => onApprove(c)} style={{ padding: '0.5rem 1.1rem', background: C.active, color: '#fff', border: 'none', borderRadius: '7px', cursor: 'pointer', fontWeight: 700, fontSize: '0.875rem' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#007A60'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = C.active}
            >Approve</button>
            <button onClick={() => onDeny(c)} style={{ padding: '0.5rem 1.1rem', background: '#FEF2F2', color: '#ef4444', border: '1px solid #ef4444', borderRadius: '7px', cursor: 'pointer', fontWeight: 700, fontSize: '0.875rem' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#fee2e2'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = '#FEF2F2'}
            >Deny</button>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Admin Reports section ───────────────────────────────── */
interface AdminProgram { id: number; programName: string; ownerId: number; }
interface AdminReport {
  id: number; title: string; severity: number; status: number;
  reporterId: number; programId: number;
}

const SEV: Record<number, { label: string; color: string; bg: string }> = {
  1: { label: 'Low',      color: '#16a34a', bg: '#DCFCE7' },
  2: { label: 'Medium',   color: '#d97706', bg: '#FEF3C7' },
  3: { label: 'High',     color: '#ea580c', bg: '#FFEDD5' },
  4: { label: 'Critical', color: '#dc2626', bg: '#FEE2E2' },
};
const STATUS_LABEL: Record<number, { label: string; color: string }> = {
  1: { label: 'New',      color: '#6B7280' },
  2: { label: 'Triaged',  color: '#3b82f6' },
  3: { label: 'Accepted', color: '#16a34a' },
  4: { label: 'Fixed',    color: '#0ea5e9' },
  5: { label: 'Rewarded', color: '#8b5cf6' },
  6: { label: 'Rejected', color: '#dc2626' },
};

function ReportsSection() {
  const navigate = useNavigate();
  const [programs, setPrograms]               = useState<AdminProgram[]>([]);
  const [selectedProgram, setSelectedProgram] = useState<number | null>(null);
  const [reports, setReports]                 = useState<AdminReport[]>([]);
  const [search, setSearch]                   = useState('');
  const [statusFilter, setStatusFilter]       = useState<number | 'all'>('all');
  const [loadingPrograms, setLoadingPrograms] = useState(true);
  const [loadingReports, setLoadingReports]   = useState(false);

  useEffect(() => {
    axiosInstance.get('/program/getAll')
      .then(res => {
        const all = res.data ?? [];
        setPrograms(all);
        if (all.length > 0) setSelectedProgram(all[0].id);
      })
      .catch(() => {})
      .finally(() => setLoadingPrograms(false));
  }, []);

  useEffect(() => {
    if (!selectedProgram) return;
    setLoadingReports(true);
    axiosInstance.get(`/report/program/${selectedProgram}`)
      .then(res => setReports(res.data ?? []))
      .catch(() => setReports([]))
      .finally(() => setLoadingReports(false));
  }, [selectedProgram]);

  const filtered = reports
    .filter(r => statusFilter === 'all' || r.status === statusFilter)
    .filter(r => !search || r.title.toLowerCase().includes(search.toLowerCase()));

  const statusCounts = ([1,2,3,4,5,6] as number[]).reduce((acc, s) => {
    acc[s] = reports.filter(r => r.status === s).length;
    return acc;
  }, {} as Record<number, number>);

  return (
    <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
      {/* Left sidebar */}
      <div style={{ width: '200px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {/* Programs */}
        <div style={{ background: '#fff', borderRadius: '10px', border: '1px solid #E5E7EB' }}>
          <p style={{ margin: 0, padding: '0.75rem 1rem 0.4rem', fontSize: '0.7rem', fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.07em' }}>Program</p>
          {loadingPrograms ? (
            <p style={{ padding: '0.75rem 1rem', color: C.muted, fontSize: '0.82rem' }}>Loading…</p>
          ) : programs.length === 0 ? (
            <p style={{ padding: '0.75rem 1rem', color: C.muted, fontSize: '0.82rem' }}>No programs.</p>
          ) : programs.map(p => {
            const active = selectedProgram === p.id;
            return (
              <button key={p.id} onClick={() => setSelectedProgram(p.id)} style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.5rem 1rem', border: 'none', cursor: 'pointer', textAlign: 'left',
                background: active ? C.activeBg : 'transparent',
                color: active ? C.active : C.text,
                fontWeight: active ? 700 : 500, fontSize: '0.85rem',
                borderLeft: active ? `2px solid ${C.active}` : '2px solid transparent',
              }}
                onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = C.hover; }}
                onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
              >
                <div style={{ width: '22px', height: '22px', borderRadius: '5px', background: active ? C.active : '#E5E7EB', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.62rem', fontWeight: 800, color: active ? '#fff' : C.text }}>
                  {p.programName.charAt(0).toUpperCase()}
                </div>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.programName}</span>
              </button>
            );
          })}
          <div style={{ height: '0.5rem' }} />
        </div>

        {/* Status filter */}
        <div style={{ background: '#fff', borderRadius: '10px', border: '1px solid #E5E7EB' }}>
          <p style={{ margin: 0, padding: '0.75rem 1rem 0.4rem', fontSize: '0.7rem', fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.07em' }}>Status</p>
          {([{ value: 'all', label: 'All' }, { value: 1, label: 'New' }, { value: 2, label: 'Triaged' }, { value: 3, label: 'Accepted' }, { value: 4, label: 'Fixed' }, { value: 5, label: 'Rewarded' }, { value: 6, label: 'Rejected' }] as const).map(({ value, label }) => {
            const count = value === 'all' ? reports.length : (statusCounts[value as number] ?? 0);
            const active = statusFilter === value;
            return (
              <button key={value} onClick={() => setStatusFilter(value as any)} style={{
                width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '0.45rem 1rem', border: 'none', cursor: 'pointer',
                background: active ? C.activeBg : 'transparent',
                color: active ? C.active : C.text,
                fontWeight: active ? 700 : 500, fontSize: '0.85rem',
                borderLeft: active ? `2px solid ${C.active}` : '2px solid transparent',
              }}
                onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = C.hover; }}
                onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
              >
                <span>{label}</span>
                {count > 0 && (
                  <span style={{ background: active ? C.active : '#E5E7EB', color: active ? '#fff' : C.muted, borderRadius: '10px', padding: '1px 7px', fontSize: '0.68rem', fontWeight: 700 }}>{count}</span>
                )}
              </button>
            );
          })}
          <div style={{ height: '0.5rem' }} />
        </div>
      </div>

      {/* Table */}
      <div style={{ flex: 1, minWidth: 0, background: '#fff', borderRadius: '10px', border: '1px solid #E5E7EB', overflow: 'hidden' }}>
        <div style={{ padding: '0.875rem 1.25rem', borderBottom: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid #E5E7EB', borderRadius: '7px', padding: '0.45rem 0.75rem', background: '#F9FAFB' }}>
            <Search size={14} color={C.muted} style={{ flexShrink: 0 }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search reports…"
              style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '0.85rem', color: C.text, flex: 1 }} />
          </div>
          <span style={{ fontSize: '0.8rem', color: C.muted, whiteSpace: 'nowrap' }}>{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
        </div>

        {loadingReports ? (
          <p style={{ padding: '2rem', textAlign: 'center', color: C.muted, fontSize: '0.88rem' }}>Loading reports…</p>
        ) : !selectedProgram ? (
          <p style={{ padding: '2rem', textAlign: 'center', color: C.muted, fontSize: '0.88rem' }}>Select a program.</p>
        ) : filtered.length === 0 ? (
          <p style={{ padding: '2rem', textAlign: 'center', color: C.muted, fontSize: '0.88rem' }}>
            {search ? 'No reports match your search.' : 'No reports in this category.'}
          </p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ background: '#F9FAFB' }}>
                  {['Report', 'Severity', 'Status', ''].map(h => (
                    <th key={h} style={{ padding: '0.6rem 1rem', textAlign: 'left', fontSize: '0.7rem', fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em', borderBottom: '1px solid #E5E7EB', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((r, i) => {
                  const sev = SEV[r.severity] ?? { label: '?', color: C.muted, bg: '#F3F4F6' };
                  const st  = STATUS_LABEL[r.status] ?? { label: 'Unknown', color: C.muted };
                  return (
                    <tr key={r.id} style={{ borderBottom: i < filtered.length - 1 ? '1px solid #F9FAFB' : 'none' }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#FAFAFA'}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
                    >
                      <td style={{ padding: '0.85rem 1rem', maxWidth: '320px' }}>
                        <p style={{ margin: '0 0 0.1rem', fontWeight: 600, fontSize: '0.88rem', color: C.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.title}</p>
                        <p style={{ margin: 0, fontSize: '0.75rem', color: C.muted }}>Reporter #{r.reporterId}</p>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', whiteSpace: 'nowrap' }}>
                        <span style={{ padding: '2px 9px', borderRadius: '4px', background: sev.bg, color: sev.color, fontSize: '0.72rem', fontWeight: 700 }}>{sev.label}</span>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', whiteSpace: 'nowrap' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.78rem', fontWeight: 600, color: st.color }}>
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: st.color, display: 'inline-block' }} />
                          {st.label}
                        </span>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                        <button onClick={() => navigate(`/report/${r.id}`)}
                          style={{ padding: '0.3rem 0.8rem', background: 'transparent', border: '1px solid #D1D5DB', borderRadius: '6px', color: C.text, cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600, transition: 'all 0.1s' }}
                          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = C.activeBg; (e.currentTarget as HTMLElement).style.borderColor = C.active; (e.currentTarget as HTMLElement).style.color = C.active; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.borderColor = '#D1D5DB'; (e.currentTarget as HTMLElement).style.color = C.text; }}
                        >View →</button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminPanel;
