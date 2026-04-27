import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import { ShieldCheck, Globe, ExternalLink } from 'lucide-react';

interface Program {
  id: number; programName: string; programDescription?: string;
  website?: string; rewardCritical?: number; rewardHigh?: number;
  rewardMedium?: number; rewardLow?: number; rewardInformational?: number;
}

interface CompanyPage {
  handle: string; displayName: string; legalName: string;
  description?: string; isVerified: boolean; createdAt: string;
  programs: Program[];
}

const TIERS = [
  { key: 'rewardCritical', label: 'Critical', color: '#ef4444', bg: '#FEF2F2' },
  { key: 'rewardHigh',     label: 'High',     color: '#f97316', bg: '#FFF7ED' },
  { key: 'rewardMedium',   label: 'Medium',   color: '#eab308', bg: '#FEFCE8' },
  { key: 'rewardLow',      label: 'Low',      color: '#22c55e', bg: '#F0FDF4' },
  { key: 'rewardInformational', label: 'Info', color: '#6B7280', bg: '#F9FAFB' },
] as const;

const topReward = (p: Program) => {
  for (const t of TIERS) {
    const v = p[t.key as keyof Program] as number | undefined;
    if (v != null) return v;
  }
  return null;
};

const PublicCompanyPage = () => {
  const { handle } = useParams<{ handle: string }>();
  const [data, setData] = useState<CompanyPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    axiosInstance.get(`/public/company/${handle}`)
      .then(res => setData(res.data))
      .catch(err => { if (err.response?.status === 404) setNotFound(true); })
      .finally(() => setLoading(false));
  }, [handle]);

  if (loading) return <div style={{ padding: '4rem', textAlign: 'center', color: '#6B7280' }}>Loading…</div>;

  if (notFound || !data) return (
    <div style={{ padding: '4rem 2rem', textAlign: 'center', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      <Globe size={48} color="#D1D5DB" style={{ marginBottom: '1rem' }} />
      <h2 style={{ color: '#111', margin: '0 0 0.5rem' }}>Company not found</h2>
      <p style={{ color: '#6B7280', margin: '0 0 1.5rem' }}>No company with handle <strong>{handle}</strong> exists.</p>
      <Link to="/bounties" style={{ color: '#3F3AFC', textDecoration: 'none', fontWeight: 600 }}>Browse Programs</Link>
    </div>
  );

  const initial = data.displayName.charAt(0).toUpperCase();

  return (
    <div style={{ padding: '2rem 1rem', maxWidth: '860px', margin: '0 auto', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      {/* Company header */}
      <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #E5E7EB', padding: '2rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: data.description ? '1rem' : 0 }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '12px', background: 'linear-gradient(135deg, #E81C79, #3F3AFC)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '1.5rem', flexShrink: 0 }}>
            {initial}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, color: '#111' }}>{data.displayName}</h1>
              {data.isVerified && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', background: '#F0FDF9', color: '#009B77', border: '1px solid #009B77', borderRadius: '20px', padding: '2px 10px', fontSize: '0.72rem', fontWeight: 700 }}>
                  <ShieldCheck size={11} /> Verified
                </span>
              )}
            </div>
            <p style={{ margin: '0.15rem 0 0', color: '#9CA3AF', fontSize: '0.82rem' }}>
              {data.programs.length} active program{data.programs.length !== 1 ? 's' : ''}
              {' · '}Member since {new Date(data.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
            </p>
          </div>
        </div>
        {data.description && <p style={{ margin: 0, color: '#374151', fontSize: '0.93rem', lineHeight: 1.6 }}>{data.description}</p>}
      </div>

      {/* Programs */}
      <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#111', margin: '0 0 1rem' }}>Active Programs</h2>

      {data.programs.length === 0 ? (
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E5E7EB', padding: '3rem', textAlign: 'center' }}>
          <Globe size={36} color="#D1D5DB" style={{ marginBottom: '0.75rem' }} />
          <p style={{ color: '#6B7280', margin: 0 }}>No active programs at this time.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {data.programs.map(p => {
            const top = topReward(p);
            const activeTiers = TIERS.filter(t => p[t.key as keyof Program] != null);
            return (
              <div key={p.id} style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E5E7EB', padding: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#111' }}>{p.programName}</h3>
                      {p.website && (
                        <a href={p.website.startsWith('http') ? p.website : `https://${p.website}`} target="_blank" rel="noopener noreferrer" style={{ color: '#6B7280', display: 'inline-flex', alignItems: 'center' }}>
                          <ExternalLink size={13} />
                        </a>
                      )}
                    </div>
                    {p.programDescription && <p style={{ margin: '0 0 0.75rem', color: '#6B7280', fontSize: '0.87rem', lineHeight: 1.5 }}>{p.programDescription}</p>}
                    {activeTiers.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                        {activeTiers.map(t => (
                          <span key={t.key} style={{ background: t.bg, color: t.color, borderRadius: '6px', padding: '2px 8px', fontSize: '0.75rem', fontWeight: 600 }}>
                            {t.label}: ${(p[t.key as keyof Program] as number).toLocaleString()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem', flexShrink: 0 }}>
                    {top != null && (
                      <p style={{ margin: 0, fontWeight: 800, color: '#ef4444', fontSize: '1.1rem' }}>Up to ${top.toLocaleString()}</p>
                    )}
                    <Link to={`/bounties/${p.id}`} style={{ padding: '0.45rem 1.1rem', background: '#3F3AFC', color: '#fff', borderRadius: '7px', textDecoration: 'none', fontWeight: 700, fontSize: '0.85rem' }}>
                      View Program
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PublicCompanyPage;
