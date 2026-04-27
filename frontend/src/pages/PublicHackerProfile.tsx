import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import { ShieldCheck, Calendar, ChevronRight } from 'lucide-react';

interface RecentReport {
  id: number;
  title: string;
  severity: number;
  status: number;
  isPublic: boolean;
  programId: number;
  programName: string;
  resolvedAt: string;
}

interface UserProfile {
  id: number;
  userName: string;
  firstName: string;
  lastName: string;
  memberSince: string;
  submissionCount: number;
  acceptedCount: number;
  criticalCount: number;
  recentReports: RecentReport[];
}

const SEV: Record<number, { label: string; color: string; bg: string }> = {
  1: { label: 'Low',      color: '#16a34a', bg: '#DCFCE7' },
  2: { label: 'Medium',   color: '#d97706', bg: '#FEF3C7' },
  3: { label: 'High',     color: '#ea580c', bg: '#FFEDD5' },
  4: { label: 'Critical', color: '#dc2626', bg: '#FEE2E2' },
};

const STATUS: Record<number, string> = {
  3: 'Accepted', 4: 'Fixed', 5: 'Rewarded', 6: 'Rejected',
};

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });

const fmtMember = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'long' });

const PublicUserProfile = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    axiosInstance.get(`/public/user/${username}`)
      .then(res => setProfile(res.data))
      .catch(err => { if (err.response?.status === 404) setNotFound(true); })
      .finally(() => setLoading(false));
  }, [username]);

  if (loading) return (
    <div style={{ padding: '4rem 2rem', textAlign: 'center', color: '#6B7280', fontFamily: 'inherit' }}>Loading…</div>
  );

  if (notFound || !profile) return (
    <div style={{ padding: '4rem 2rem', textAlign: 'center', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      <ShieldCheck size={48} color="#D1D5DB" style={{ marginBottom: '1rem' }} />
      <h2 style={{ color: '#111', margin: '0 0 0.5rem' }}>User not found</h2>
      <p style={{ color: '#6B7280', margin: '0 0 1.5rem' }}>No researcher with username <strong>@{username}</strong> exists.</p>
      <Link to="/leaderboard" style={{ color: '#3F3AFC', textDecoration: 'none', fontWeight: 600 }}>View Leaderboard</Link>
    </div>
  );

  const initials = (profile.firstName?.charAt(0) ?? profile.userName.charAt(0)).toUpperCase();
  const fullName = [profile.firstName, profile.lastName].filter(Boolean).join(' ');

  const acceptRate = profile.submissionCount > 0
    ? Math.round((profile.acceptedCount / profile.submissionCount) * 100)
    : 0;

  return (
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>

      {/* ── Hero header (dark band) ── */}
      <div style={{
        background: 'linear-gradient(135deg, #1C1F35 0%, #2A2D4A 100%)',
        borderBottom: '1px solid #2E3150',
        padding: '2.5rem 1.5rem 0',
      }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1.5rem', flexWrap: 'wrap', paddingBottom: '1.75rem' }}>

            {/* Avatar */}
            <div style={{
              width: '88px', height: '88px', borderRadius: '50%', flexShrink: 0,
              background: 'linear-gradient(135deg, #3F3AFC, #E81C79)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontWeight: 800, fontSize: '2rem',
              border: '3px solid rgba(255,255,255,0.12)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
            }}>
              {initials}
            </div>

            {/* Identity */}
            <div style={{ flex: 1, minWidth: 0 }}>
              {fullName && (
                <p style={{ margin: '0 0 0.15rem', fontWeight: 700, color: '#fff', fontSize: '1.3rem', letterSpacing: '-0.01em' }}>
                  {fullName}
                </p>
              )}
              <p style={{ margin: '0 0 0.5rem', color: '#A0A3B8', fontSize: '1rem' }}>@{profile.userName}</p>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                  background: 'rgba(29,188,167,0.15)', border: '1px solid rgba(29,188,167,0.3)',
                  color: '#1DBCA7', fontSize: '0.75rem', fontWeight: 700,
                  padding: '2px 10px', borderRadius: '999px', letterSpacing: '0.04em',
                }}>
                  <ShieldCheck size={11} strokeWidth={2.5} /> Security Researcher
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: '#A0A3B8', fontSize: '0.78rem' }}>
                  <Calendar size={12} /> Member since {fmtMember(profile.memberSince)}
                </span>
              </div>
            </div>

            {/* Stats inline — top right */}
            <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-end', paddingBottom: '0.25rem' }}>
              {[
                { value: profile.submissionCount, label: 'Submitted' },
                { value: profile.acceptedCount,   label: 'Accepted'  },
                { value: profile.criticalCount,    label: 'Critical'  },
                { value: `${acceptRate}%`,         label: 'Accept rate' },
              ].map(({ value, label }) => (
                <div key={label} style={{ textAlign: 'center' }}>
                  <p style={{ margin: '0 0 0.1rem', fontSize: '1.5rem', fontWeight: 800, color: '#fff', lineHeight: 1 }}>{value}</p>
                  <p style={{ margin: 0, fontSize: '0.7rem', color: '#A0A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tab bar (purely visual for now) */}
          <div style={{ display: 'flex', gap: '0', borderTop: '1px solid #2E3150', marginTop: '0' }}>
            <div style={{ padding: '0.65rem 1rem', fontSize: '0.85rem', fontWeight: 600, color: '#1DBCA7', borderBottom: '2px solid #1DBCA7', marginBottom: '-1px' }}>
              Overview
            </div>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '1.75rem 1.5rem' }}>

        {/* Recent disclosed reports */}
        {profile.recentReports && profile.recentReports.length > 0 ? (
          <div>
            <h2 style={{ margin: '0 0 1rem', fontSize: '1rem', fontWeight: 700, color: '#111', letterSpacing: '-0.01em' }}>
              Recent Disclosures
            </h2>
            <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
              {profile.recentReports.map((r, i) => {
                const sev = SEV[r.severity] ?? { label: '?', color: '#6B7280', bg: '#F3F4F6' };
                const statusLabel = STATUS[r.status] ?? 'Resolved';
                const isLast = i === profile.recentReports.length - 1;
                return (
                  <div
                    key={r.id}
                    onClick={() => r.isPublic && navigate(`/report/${r.id}`)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '1rem',
                      padding: '0.9rem 1.25rem',
                      borderBottom: isLast ? 'none' : '1px solid #F3F4F6',
                      cursor: r.isPublic ? 'pointer' : 'default',
                      transition: 'background 0.1s',
                    }}
                    onMouseEnter={e => { if (r.isPublic) (e.currentTarget as HTMLElement).style.background = '#FAFAFA'; }}
                    onMouseLeave={e => { if (r.isPublic) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                  >
                    {/* Severity dot */}
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: sev.color, flexShrink: 0 }} />

                    {/* Content */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: '0 0 0.15rem', fontWeight: 600, fontSize: '0.88rem', color: r.isPublic ? '#111' : '#9CA3AF', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {r.isPublic ? r.title : 'Private disclosure'}
                      </p>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.75rem', color: '#9CA3AF' }}>
                        <span style={{ background: '#F3F4F6', color: '#374151', padding: '0px 6px', borderRadius: '3px', fontWeight: 600 }}>{r.programName}</span>
                        <span>·</span>
                        <span style={{ color: sev.color, fontWeight: 600 }}>{sev.label}</span>
                        <span>·</span>
                        <span>{statusLabel}</span>
                        <span>·</span>
                        <span>{fmtDate(r.resolvedAt)}</span>
                      </div>
                    </div>

                    {r.isPublic && <ChevronRight size={14} color="#D1D5DB" style={{ flexShrink: 0 }} />}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '3rem', textAlign: 'center' }}>
            <ShieldCheck size={36} color="#D1D5DB" style={{ marginBottom: '0.75rem' }} />
            <p style={{ margin: 0, color: '#9CA3AF', fontSize: '0.9rem' }}>No public disclosures yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicUserProfile;
