import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import { ShieldCheck } from 'lucide-react';

interface UserProfile {
  id: number;
  userName: string;
  firstName: string;
  lastName: string;
  memberSince: string;
  submissionCount: number;
  acceptedCount: number;
  criticalCount: number;
}

const PublicUserProfile = () => {
  const { username } = useParams<{ username: string }>();
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
      <Link to="/bounties" style={{ color: '#3F3AFC', textDecoration: 'none', fontWeight: 600 }}>Browse Programs</Link>
    </div>
  );

  const initials = (profile.firstName?.charAt(0) ?? profile.userName.charAt(0)).toUpperCase();
  const fullName = [profile.firstName, profile.lastName].filter(Boolean).join(' ');

  return (
    <div style={{ padding: '2rem 1rem', maxWidth: '720px', margin: '0 auto', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      {/* Header card */}
      <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #E5E7EB', padding: '2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'linear-gradient(135deg, #3F3AFC, #E81C79)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '1.75rem', flexShrink: 0 }}>
          {initials}
        </div>
        <div>
          {fullName && <p style={{ margin: '0 0 0.15rem', fontWeight: 700, color: '#111', fontSize: '1.15rem' }}>{fullName}</p>}
          <p style={{ margin: 0, color: '#6B7280', fontSize: '0.95rem' }}>@{profile.userName}</p>
          <p style={{ margin: '0.25rem 0 0', color: '#9CA3AF', fontSize: '0.8rem' }}>
            Security Researcher · Member since {new Date(profile.memberSince).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem' }}>
        {[
          { value: profile.submissionCount, label: 'Submitted',  color: '#3F3AFC' },
          { value: profile.acceptedCount,   label: 'Accepted',   color: '#16a34a' },
          { value: profile.criticalCount,   label: 'Critical',   color: '#dc2626' },
        ].map(({ value, label, color }) => (
          <div key={label} style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E5E7EB', padding: '1.25rem 1.5rem', textAlign: 'center' }}>
            <p style={{ margin: '0 0 0.25rem', fontSize: '2rem', fontWeight: 800, color }}>{value}</p>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#6B7280', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PublicUserProfile;
