import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, SlidersHorizontal, ArrowDownUp, ThumbsUp } from 'lucide-react';

const REPORTS = [
  {
    id: 1, upvotes: 3, program: 'curl', programIcon: '//', iconBg: '#1C1C1C',
    title: 'CURLOPT_UNRESTRICTED_AUTH Dangerous Default Documentation Gap',
    reporter: 'sabari_n', time: '3 hrs ago', category: 'Information Disclosure',
    severity: 'Low', severityColor: '#1091cc', status: 'Not applicable', statusColor: '#6b7280', statusDot: '#9ca3af',
  },
  {
    id: 2, upvotes: 12, program: 'AWS VDP', programIcon: 'AWS', iconBg: '#FF9900',
    title: 'Arbitrary Code Execution via Scanner Bypass in aws-diagram-mcp-server `exec()` Namespace',
    reporter: 'locus-x64', time: '21 hrs ago', category: '',
    severity: 'None', severityColor: '#6b7280', status: 'Informative', statusColor: '#6b7280', statusDot: '#9ca3af',
  },
  {
    id: 3, upvotes: 21, program: 'Lovable VDP', programIcon: '♥', iconBg: '#E81C79',
    title: 'Users can change project visibility which requires high subscription by just changing request body',
    reporter: 'hossam25', time: '23 hrs ago', category: 'Improper Access Control – Generic',
    severity: 'Medium', severityColor: '#d97706', status: 'Resolved', statusColor: '#16a34a', statusDot: '#22c55e',
    description: 'A Broken Access Control vulnerability was discovered that allowed users to change project visibility to higher subscription tiers by modifying the request body. The visibility was changed from the default setting to Personal or Workspace, bypassing subscription checks and enabling unauthorized access to premium functionality.',
  },
  {
    id: 4, upvotes: 9, program: 'curl', programIcon: '//', iconBg: '#1C1C1C',
    title: 'LM Challenge-Response Hash Always Sent in SMB Authentication',
    reporter: 'brewm4ster', time: 'about 1 day ago', category: 'Reversible One-Way Hash',
    severity: 'Medium', severityColor: '#d97706', status: 'Informative', statusColor: '#6b7280', statusDot: '#9ca3af',
  },
  {
    id: 5, upvotes: 11, program: 'curl', programIcon: '//', iconBg: '#1C1C1C',
    title: "In curl's SASL OAUTHBEARER authentication, including the SOH character (0x01) in the username corrupts the message structure.",
    reporter: 'y_security', time: '2 days ago', category: 'Value Delimiting Issues',
    severity: 'Medium', severityColor: '#d97706', status: 'Not applicable', statusColor: '#6b7280', statusDot: '#9ca3af',
  },
  {
    id: 6, upvotes: 5, program: 'Google VRP', programIcon: 'G', iconBg: '#4285F4',
    title: 'Stored XSS in cloud console project description field',
    reporter: 'hunter_zero', time: '3 days ago', category: 'Cross-site Scripting',
    severity: 'High', severityColor: '#ea580c', status: 'Resolved', statusColor: '#16a34a', statusDot: '#22c55e',
  },
  {
    id: 7, upvotes: 18, program: 'Meta Bug Bounty', programIcon: 'M', iconBg: '#1877F2',
    title: 'IDOR vulnerability allows reading private messages via user ID enumeration in messaging API',
    reporter: 'pr1vate_eye', time: '4 days ago', category: 'Insecure Direct Object Reference',
    severity: 'Critical', severityColor: '#dc2626', status: 'Resolved', statusColor: '#16a34a', statusDot: '#22c55e',
    description: 'An IDOR vulnerability was found in the messaging endpoint that allowed an authenticated attacker to read private messages of other users by iterating the user_id parameter.',
  },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'disclosed' | 'undisclosed'>('disclosed');
  const [search, setSearch] = useState('disclosed:true');

  return (
    <div style={{ width: '100%', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Hero Section */}
      <section style={{
        marginBottom: '3rem',
        padding: '3rem 2rem',
        background: 'linear-gradient(135deg, #1B3A57 0%, #0C1A30 100%)',
        borderRadius: '0.75rem',
        border: '1px solid #009B77',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'absolute', top: '-30px', right: '3%', opacity: 0.07, fontSize: '14rem', lineHeight: 1, userSelect: 'none', pointerEvents: 'none' }}>🛡</div>
        <h1 style={{
          fontSize: 'clamp(1.5rem, 3vw, 2.1rem)', fontWeight: 800,
          color: '#fff', lineHeight: 1.3, margin: 0, maxWidth: '640px',
          letterSpacing: '-0.02em',
        }}>
          The platform's leading dynamic repository<br />
          <span style={{
            background: '#E81C79', color: '#fff',
            padding: '0.05em 0.2em', borderRadius: '3px', fontStyle: 'italic',
          }}>for security vulnerabilities.</span>
        </h1>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        {/* Search bar */}
        <div style={{ marginBottom: '1.5rem' }}>
          <p style={{ margin: '0 0 0.6rem', fontWeight: 600, color: '#111', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            Search for reports <span style={{ width: '16px', height: '16px', borderRadius: '50%', border: '1.5px solid #9CA3AF', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', color: '#9CA3AF', cursor: 'default' }}>?</span>
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <div style={{
              flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem',
              border: '1px solid #D1D5DB', borderRadius: '6px', padding: '0.5rem 0.75rem',
              background: '#fff',
            }}>
              <Search size={15} color="#9CA3AF" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ border: 'none', outline: 'none', flex: 1, fontSize: '0.88rem', color: '#374151', fontFamily: 'monospace', background: 'transparent' }}
              />
            </div>
            <button style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', border: '1px solid #D1D5DB', borderRadius: '6px', background: '#fff', cursor: 'pointer', fontSize: '0.84rem', color: '#374151', fontWeight: 500 }}>
              <SlidersHorizontal size={14} /> Filter
            </button>
            <button style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', border: '1px solid #D1D5DB', borderRadius: '6px', background: '#fff', cursor: 'pointer', fontSize: '0.84rem', color: '#374151', fontWeight: 500 }}>
              <ArrowDownUp size={14} /> Sort
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '2px solid #E5E7EB', marginBottom: '0' }}>
          {(['disclosed', 'undisclosed'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: '0.55rem 1.2rem', border: 'none', cursor: 'pointer',
                background: tab === t ? '#3F3AFC' : 'transparent',
                color: tab === t ? '#fff' : '#6B7280',
                borderRadius: tab === t ? '6px 6px 0 0' : '6px 6px 0 0',
                fontWeight: 600, fontSize: '0.86rem',
                marginBottom: '-2px',
                transition: 'all 0.15s', textTransform: 'capitalize',
              }}
            >{t}</button>
          ))}
        </div>

        {/* Report list */}
        <div style={{ border: '1px solid #E5E7EB', borderTop: 'none', borderRadius: '0 0 8px 8px', overflow: 'hidden' }}>
          {REPORTS.map((r, idx) => (
            <div
              key={r.id}
              style={{
                padding: '1rem 0.9rem', display: 'flex', gap: '0.75rem',
                borderBottom: idx < REPORTS.length - 1 ? '1px solid #F3F4F6' : 'none',
                transition: 'background 0.1s', cursor: 'pointer',
              }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#F9FAFB'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'transparent'}
              onClick={() => navigate('/bounties')}
            >
              {/* Upvote */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1px', width: '24px', flexShrink: 0, paddingTop: '2px' }}>
                <ThumbsUp size={12} color="#9CA3AF" />
                <span style={{ fontSize: '0.72rem', color: '#6B7280', fontWeight: 600 }}>{r.upvotes}</span>
              </div>

              {/* Program icon */}
              <div style={{
                width: '28px', height: '28px', borderRadius: '5px',
                background: r.iconBg, border: '1px solid #E5E7EB',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.6rem', fontWeight: 700, color: '#fff', flexShrink: 0,
              }}>{r.programIcon}</div>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: '0.15rem' }}>{r.program}</span>
                    <div style={{
                      color: '#2563EB', fontSize: '0.88rem', fontWeight: 500, lineHeight: 1.4, marginBottom: '0.25rem',
                      overflow: 'hidden', display: '-webkit-box' as const,
                      WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const,
                    }}>• {r.title}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: '#6B7280', flexWrap: 'wrap' as const }}>
                      <span>Bug reported by <span style={{ color: '#2563EB' }}>{r.reporter}</span></span>
                      <span>was disclosed {r.time}</span>
                      {r.category && <><span>·</span><span>{r.category}</span></>}
                    </div>
                    {r.description && (
                      <p style={{ margin: '0.35rem 0 0', fontSize: '0.77rem', color: '#6B7280', lineHeight: 1.5, maxWidth: '640px' }}>{r.description}</p>
                    )}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.3rem', flexShrink: 0 }}>
                    <span style={{
                      background: r.severityColor + '18', color: r.severityColor,
                      fontSize: '0.7rem', fontWeight: 700, padding: '2px 8px',
                      borderRadius: '4px', border: `1px solid ${r.severityColor}44`,
                      whiteSpace: 'nowrap' as const,
                    }}>{r.severity}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', color: r.statusColor, whiteSpace: 'nowrap' as const }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: r.statusDot, display: 'inline-block', flexShrink: 0 }} />
                      {r.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;