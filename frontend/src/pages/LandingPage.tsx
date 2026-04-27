import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSupport } from '../context/SupportContext';
import { useUser } from '../context/UserContext';
import {
  Bug, FileText, ShieldCheck, Trophy, BarChart2,
  Medal, ArrowUpCircle, Twitter, Linkedin, Github,
} from 'lucide-react';

/* ─────────────── colour tokens (HackerOne-ish palette) ─────────────── */
const C = {
  navBg:      '#1C1F35',
  heroBg:     '#1C1F35',
  trustedBlue:'#3F3AFC',
  trustedBlueHover:'#2F2AEC',
  pink:       '#E81C79',
  teal:       '#20BA8E',
  purple:     '#8046F2',
  mutedPink:  '#C43BF6',
  red:        '#F92D4F',
  deepBlue:   '#542BEC',
  textWhite:  '#FFFFFF',
  textMuted:  '#A0A3B8',
  borderMuted:'#2E3150',
  sectionLight:'#F7F9FC',
  sectionGray:'#EAECF4',
  cardBg:     '#252848',
};

/* ─────────────── tiny helpers ─────────────── */
const btn = (bg: string, _hover?: string): React.CSSProperties => ({
  display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
  padding: '0.65rem 1.4rem',
  background: bg, color: '#fff',
  border: 'none', borderRadius: '999px',
  fontWeight: 600, fontSize: '0.92rem', cursor: 'pointer',
  transition: 'background 0.2s ease, transform 0.15s ease',
  textDecoration: 'none',
});

/* ─────────────── feature card data ─────────────── */
const features = [
  { color: C.pink,     title: 'Bug Bounty Programs',     desc: 'Discover active programs and earn rewards by responsibly reporting vulnerabilities.', link: '/bounties',    icon: Bug },
  { color: C.purple,   title: 'Submit Reports',           desc: 'File detailed vulnerability reports directly to security teams using standardised templates.', link: '/submit',      icon: FileText },
  { color: C.teal,     title: 'Vulnerability Disclosure', desc: 'Coordinated response programs that let researchers disclose bugs safely and responsibly.', link: '/bounties',    icon: ShieldCheck },
  { color: C.mutedPink, title: 'Leaderboard',             desc: 'Compete with the best security researchers and build your reputation in the community.', link: '/leaderboard', icon: Trophy },
  { color: C.deepBlue, title: 'Analytics & Insights',    desc: 'Track program performance, submission trends, and payout statistics in real time.', link: '/bounties',   icon: BarChart2 },
];

const stats = [
  { value: '$2.4M+', label: 'Bounties paid', sub: 'to security researchers' },
  { value: '12,900+', label: 'Vulnerabilities fixed', sub: 'and more found every day' },
  { value: '482',    label: 'Active programs', sub: 'across all industries' },
  { value: '8,500+', label: 'Registered researchers', sub: 'from 90+ countries' },
];

/* ─────────────── main component ─────────────── */
const SECURITY_OBJECTIVES = [
  'Reduce Attack Surface',
  'Comply with Regulations',
  'Protect Customer Data',
  'Continuous Security Testing',
  'Find Critical Vulnerabilities',
  'Other',
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { submitRequest } = useSupport();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [contactForm, setContactForm] = useState({ firstName: '', lastName: '', email: '', company: '', jobTitle: '', objective: '', country: '' });
  const [contactSent, setContactSent] = useState(false);
  const [contactLoading, setContactLoading] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactLoading(true);
    setTimeout(() => {
      submitRequest(
        `Contact form inquiry from ${contactForm.firstName} ${contactForm.lastName}.\nCompany: ${contactForm.company}\nJob Title: ${contactForm.jobTitle}\nCountry: ${contactForm.country}\nSecurity Objective: ${contactForm.objective}\nEmail: ${contactForm.email}`,
        { name: `${contactForm.firstName} ${contactForm.lastName}`, email: contactForm.email, company: contactForm.company, jobTitle: contactForm.jobTitle, securityObjective: contactForm.objective }
      );
      setContactLoading(false);
      setContactSent(true);
    }, 600);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif', color: C.textWhite, background: '#fff' }}>

      {/* ══════════ NAVBAR ══════════ */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: C.navBg,
        borderBottom: scrolled ? `1px solid ${C.borderMuted}` : '1px solid transparent',
        transition: 'border-color 0.2s ease',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem', height: '64px', display: 'flex', alignItems: 'center', gap: '2.5rem' }}>

          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
            <div style={{ width: '28px', height: '28px', background: `linear-gradient(135deg, ${C.trustedBlue}, ${C.pink})`, borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 900, color: '#fff' }}>B</div>
            <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>BountyOS</span>
          </Link>

          {/* Desktop nav links */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flex: 1 }} className="desktop-nav">
            {[
              { label: 'Bug Bounties', to: '/bounties'    },
              { label: 'Leaderboard',  to: '/leaderboard' },
            ].map(({ label, to }) => (
              <Link key={label} to={to} style={{
                padding: '0.4rem 0.9rem',
                color: C.textMuted, textDecoration: 'none',
                fontSize: '0.88rem', fontWeight: 500, borderRadius: '6px',
                transition: 'color 0.2s ease, background 0.2s ease',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#fff'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = C.textMuted; (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
              >{label}</Link>
            ))}
          </nav>

          {/* CTAs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
            {user.isLoggedIn ? (
              <>
                <Link to="/bounties" style={{ ...btn(C.trustedBlue, C.trustedBlueHover), fontSize: '0.88rem', padding: '0.5rem 1.2rem' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = C.trustedBlueHover}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = C.trustedBlue}
                >Go to Dashboard →</Link>
                <Link to="/profile" title={user.name ?? 'Profile'} style={{
                  width: '34px', height: '34px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #1DBCA7, #009B77)',
                  color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none', flexShrink: 0,
                  border: '2px solid rgba(255,255,255,0.15)', transition: 'border-color 0.2s',
                }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.5)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.15)'}
                >
                  {user.name?.charAt(0).toUpperCase() ?? 'U'}
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" style={{ color: C.textMuted, textDecoration: 'none', fontSize: '0.88rem', fontWeight: 500, padding: '0.4rem 0.75rem', transition: 'color 0.2s', borderRadius: '6px' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#fff'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = C.textMuted}
                >Login</Link>
                <Link to="/choose-role" style={{ ...btn(C.trustedBlue, C.trustedBlueHover), fontSize: '0.88rem', padding: '0.5rem 1.2rem' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = C.trustedBlueHover}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = C.trustedBlue}
                >Get Started →</Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button onClick={() => setMobileOpen(o => !o)} style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: '0.4rem' }} className="hamburger-btn">
            <div style={{ width: '22px', height: '2px', background: '#fff', marginBottom: '5px', borderRadius: '2px' }} />
            <div style={{ width: '22px', height: '2px', background: '#fff', marginBottom: '5px', borderRadius: '2px' }} />
            <div style={{ width: '22px', height: '2px', background: '#fff', borderRadius: '2px' }} />
          </button>
        </div>

        {/* Mobile menu — absolute so it overlays content instead of pushing it down */}
        {mobileOpen && (
          <div style={{
            position: 'absolute', top: '64px', left: 0, right: 0,
            background: C.navBg,
            borderTop: `1px solid ${C.borderMuted}`,
            borderBottom: `1px solid ${C.borderMuted}`,
            padding: '1rem 1.5rem 1.5rem',
            zIndex: 99,
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          }}>
            {[
              { label: 'Bug Bounties', to: '/bounties' },
              { label: 'Leaderboard',  to: '/leaderboard' },
              ...(user.isLoggedIn
                ? [{ label: 'Programs', to: '/bounties' }]
                : [{ label: 'Login', to: '/login' }, { label: 'Get Started', to: '/choose-role' }]
              ),
            ].map(({ label, to }) => (
              <Link key={label} to={to} onClick={() => setMobileOpen(false)} style={{
                display: 'block', padding: '0.65rem 0',
                borderBottom: `1px solid ${C.borderMuted}`,
                color: '#fff', textDecoration: 'none', fontSize: '0.95rem',
              }}>{label}</Link>
            ))}
          </div>
        )}
      </header>

      {/* ══════════ HERO ══════════ */}
      <section style={{
        minHeight: '100vh',
        background: `linear-gradient(160deg, #12152B 0%, ${C.heroBg} 50%, #161931 100%)`,
        display: 'flex', alignItems: 'center',
        paddingTop: '64px',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Subtle radial glow */}
        <div style={{ position: 'absolute', top: '20%', left: '55%', width: '600px', height: '500px', background: `radial-gradient(ellipse, rgba(63,58,252,0.12) 0%, transparent 65%)`, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '10%', left: '5%', width: '400px', height: '400px', background: `radial-gradient(ellipse, rgba(232,28,121,0.08) 0%, transparent 65%)`, pointerEvents: 'none' }} />

        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 1.5rem', width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
          {/* Left: copy */}
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(63,58,252,0.15)', border: `1px solid rgba(63,58,252,0.35)`, borderRadius: '999px', padding: '0.3rem 0.8rem', marginBottom: '1.5rem' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: C.trustedBlue, display: 'inline-block' }} />
              <span style={{ fontSize: '0.78rem', color: '#9CA3F0', fontWeight: 600, letterSpacing: '0.03em' }}>BUG BOUNTY PLATFORM</span>
            </div>
            <h1 style={{
              fontSize: 'clamp(2.2rem, 4.5vw, 3.4rem)',
              fontWeight: 800, lineHeight: 1.12,
              marginBottom: '1.25rem', color: '#fff',
              letterSpacing: '-0.03em',
            }}>
              Security research,<br />
              <span style={{ background: `linear-gradient(90deg, ${C.trustedBlue} 0%, ${C.pink} 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>rewarded at scale</span>
            </h1>
            <p style={{ color: C.textMuted, fontSize: '1.05rem', lineHeight: 1.65, marginBottom: '2rem', maxWidth: '480px' }}>
              Connect ethical hackers with organisations that care about security. Find vulnerabilities, submit reports, and get paid — all on one trusted platform.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
              {user.isLoggedIn ? (
                <button onClick={() => navigate('/bounties')} style={{ ...btn(C.trustedBlue, C.trustedBlueHover), fontSize: '0.95rem', padding: '0.7rem 1.6rem' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = C.trustedBlueHover; (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = C.trustedBlue; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
                >Go to Dashboard →</button>
              ) : (
                <button onClick={() => navigate('/choose-role')} style={{ ...btn(C.trustedBlue, C.trustedBlueHover), fontSize: '0.95rem', padding: '0.7rem 1.6rem' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = C.trustedBlueHover; (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = C.trustedBlue; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
                >Get Started →</button>
              )}
              <button onClick={() => navigate('/bounties')} style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '0.95rem', fontWeight: 500, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.7rem 0.5rem', transition: 'opacity 0.2s' }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.opacity = '0.75'}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.opacity = '1'}
              >View Programs →</button>
            </div>

            {/* trust row */}
            <div style={{ marginTop: '2.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ display: 'flex' }}>
                {['#E81C79','#8046F2','#20BA8E','#C43BF6'].map((c, i) => (
                  <div key={i} style={{ width: '28px', height: '28px', borderRadius: '50%', background: c, border: '2px solid #1C1F35', marginLeft: i === 0 ? 0 : '-8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700 }}>
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
              <span style={{ color: C.textMuted, fontSize: '0.82rem' }}>Trusted by <strong style={{ color: '#fff' }}>8,500+</strong> security researchers</span>
            </div>
          </div>

          {/* Right: visual panel */}
          <div style={{ position: 'relative' }}>
            <div style={{ background: C.cardBg, borderRadius: '16px', border: `1px solid ${C.borderMuted}`, overflow: 'hidden', boxShadow: '0 25px 60px rgba(0,0,0,0.4)' }}>
              {/* Mock window bar */}
              <div style={{ background: '#1A1D38', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: `1px solid ${C.borderMuted}` }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#F92D4F' }} />
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#FFB800' }} />
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#20BA8E' }} />
                <span style={{ marginLeft: '0.75rem', fontSize: '0.75rem', color: C.textMuted }}>bountyos.io / dashboard</span>
              </div>
              <div style={{ padding: '1.5rem' }}>
                {/* Recent submissions mock */}
                <div style={{ fontSize: '0.7rem', color: C.textMuted, fontWeight: 700, letterSpacing: '0.1em', marginBottom: '0.75rem', textTransform: 'uppercase' }}>Recent Submissions</div>
                {[
                  { sev: 'CRITICAL', color: '#F92D4F', title: 'SQL Injection in auth endpoint', reward: '$5,000', time: '2m ago' },
                  { sev: 'HIGH',     color: '#FFB800', title: 'XSS in profile updater',         reward: '$2,500', time: '15m ago' },
                  { sev: 'MEDIUM',   color: '#20BA8E', title: 'IDOR in file upload API',        reward: '$800',   time: '1h ago' },
                  { sev: 'LOW',      color: '#8046F2', title: 'Open redirect on login flow',    reward: '$200',   time: '3h ago' },
                ].map((r, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0.75rem', borderRadius: '8px', marginBottom: '0.4rem', background: 'rgba(255,255,255,0.03)', border: `1px solid rgba(255,255,255,0.06)`, transition: 'background 0.2s' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.07)'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)'}
                  >
                    <span style={{ background: r.color + '22', color: r.color, fontSize: '0.6rem', fontWeight: 800, padding: '2px 6px', borderRadius: '4px', letterSpacing: '0.05em', flexShrink: 0 }}>{r.sev}</span>
                    <span style={{ flex: 1, fontSize: '0.8rem', color: '#D0D3E8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.title}</span>
                    <span style={{ color: C.teal, fontWeight: 700, fontSize: '0.78rem', flexShrink: 0 }}>{r.reward}</span>
                    <span style={{ color: C.textMuted, fontSize: '0.7rem', flexShrink: 0 }}>{r.time}</span>
                  </div>
                ))}
                {/* Mini stats row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', marginTop: '1rem' }}>
                  {[{ v: '482', l: 'Programs' }, { v: '$2.4M', l: 'Paid Out' }, { v: '12k+', l: 'Fixed' }].map(s => (
                    <div key={s.l} style={{ background: 'rgba(63,58,252,0.1)', border: '1px solid rgba(63,58,252,0.2)', borderRadius: '8px', padding: '0.6rem', textAlign: 'center' }}>
                      <div style={{ fontSize: '1rem', fontWeight: 800, color: '#fff' }}>{s.v}</div>
                      <div style={{ fontSize: '0.68rem', color: C.textMuted }}>{s.l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ STATS BAND ══════════ */}
      <section style={{ background: C.sectionLight, borderTop: '1px solid #E0E4F0', borderBottom: '1px solid #E0E4F0' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '3rem 1.5rem', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
          {stats.map((s) => (
            <div key={s.label} style={{ padding: '1.25rem 1rem 1.25rem 1.5rem', borderLeft: `3px solid ${C.trustedBlue}22` }}>
              <div style={{ fontSize: '2.3rem', fontWeight: 800, color: '#1C1F35', letterSpacing: '-0.03em', lineHeight: 1.1 }}>{s.value}</div>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1C1F35', marginTop: '0.25rem' }}>{s.label}</div>
              <div style={{ fontSize: '0.78rem', color: '#6B7280', marginTop: '0.1rem' }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════ FEATURE CARDS ══════════ */}
      <section style={{ background: C.sectionLight, padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ marginBottom: '3rem' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: C.trustedBlue, letterSpacing: '0.1em', textTransform: 'uppercase' }}>The Platform</span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#1C1F35', marginTop: '0.4rem', letterSpacing: '-0.02em' }}>One platform for all your security needs</h2>
            <p style={{ color: '#6B7280', fontSize: '1rem', marginTop: '0.5rem', maxWidth: '520px', lineHeight: 1.6 }}>
              From finding programs to reporting vulns and earning rewards — everything you need in one place.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            {features.map((f) => (
              <FeatureCard key={f.title} {...f} navigate={navigate} />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ FOR RESEARCHERS ══════════ */}
      <section style={{ background: '#fff', padding: '6rem 1.5rem', overflow: 'hidden' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center' }}>
          {/* Visual left */}
          <div style={{ position: 'relative' }}>
            <div style={{ background: `linear-gradient(135deg, ${C.navBg} 0%, #252848 100%)`, borderRadius: '16px', padding: '2rem', border: `1px solid ${C.borderMuted}`, boxShadow: '0 20px 50px rgba(0,0,0,0.15)' }}>
              <div style={{ marginBottom: '1.25rem', fontSize: '0.72rem', color: C.textMuted, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Global Leaderboard</div>
              {[
                { rank: '#1', name: 'h4x0r_elite',  rep: '98,240',  badge: <Medal size={14} color='#FFB800' /> },
                { rank: '#2', name: 'vuln_hunter',   rep: '76,120',  badge: <Medal size={14} color='#C0C0C0' /> },
                { rank: '#3', name: 'sec_zero',      rep: '65,800',  badge: <Medal size={14} color='#CD7F32' /> },
                { rank: '#4', name: 'byte_breaker',  rep: '54,300',  badge: null },
                { rank: '#5', name: 'null_pointer',  rep: '48,990',  badge: null },
              ].map((r, i) => (
                <div key={r.rank} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0', borderBottom: i < 4 ? `1px solid ${C.borderMuted}` : 'none' }}>
                  <span style={{ width: '28px', fontSize: '0.78rem', color: i < 3 ? C.trustedBlue : C.textMuted, fontWeight: 700 }}>{r.rank}</span>
                  <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: `hsl(${200 + i * 30}, 70%, 45%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700, color: '#fff', flexShrink: 0 }}>{r.name[0].toUpperCase()}</div>
                  <span style={{ flex: 1, fontSize: '0.85rem', color: '#D0D3E8', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>{r.name}{r.badge}</span>
                  <span style={{ fontSize: '0.78rem', color: C.teal, fontWeight: 700 }}>{r.rep} pts</span>
                </div>
              ))}
            </div>
            {/* Floating accent */}
            <div style={{ position: 'absolute', bottom: '-20px', right: '-20px', background: C.trustedBlue, borderRadius: '12px', padding: '0.8rem 1.1rem', boxShadow: '0 8px 24px rgba(63,58,252,0.35)', fontSize: '0.85rem', fontWeight: 700, color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Trophy size={15} /> <span>Top 100 globally</span>
            </div>
          </div>

          {/* Right: copy */}
          <div>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: C.trustedBlue, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Security Researchers</span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#1C1F35', marginTop: '0.4rem', letterSpacing: '-0.02em', lineHeight: 1.2 }}>Hack for Good.<br />Get Paid Well.</h2>
            <p style={{ color: '#6B7280', fontSize: '1rem', marginTop: '0.75rem', lineHeight: 1.65, maxWidth: '420px' }}>
              Whether you're just starting out or a seasoned professional, BountyOS connects you with real programs that reward skilled researchers.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: '1.5rem 0', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                'Access 482+ active bug bounty programs',
                'Earn competitive rewards for valid reports',
                'Build reputation on the global leaderboard',
                'Submit reports and track your findings in real time',
              ].map(item => (
                <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', color: '#374151', fontSize: '0.95rem' }}>
                  <span style={{ color: C.teal, fontWeight: 700, marginTop: '1px', flexShrink: 0 }}>✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button onClick={() => navigate('/choose-role')} style={{ ...btn(C.trustedBlue, C.trustedBlueHover) }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = C.trustedBlueHover; (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = C.trustedBlue; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
              >Start Hacking →</button>
              <button onClick={() => navigate('/leaderboard')} style={{ background: 'transparent', border: `1.5px solid #D1D5DB`, color: '#374151', borderRadius: '999px', padding: '0.65rem 1.4rem', fontWeight: 600, fontSize: '0.92rem', cursor: 'pointer', transition: 'all 0.2s' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = C.trustedBlue; (e.currentTarget as HTMLElement).style.color = C.trustedBlue; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#D1D5DB'; (e.currentTarget as HTMLElement).style.color = '#374151'; }}
              >View Leaderboard →</button>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ FOR COMPANIES ══════════ */}
      <section style={{ background: C.sectionLight, padding: '6rem 1.5rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center' }}>
          {/* Left: copy */}
          <div>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: C.pink, letterSpacing: '0.1em', textTransform: 'uppercase' }}>For Organisations</span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#1C1F35', marginTop: '0.4rem', letterSpacing: '-0.02em', lineHeight: 1.2 }}>Protect what you've built with elite researchers</h2>
            <p style={{ color: '#6B7280', fontSize: '1rem', marginTop: '0.75rem', lineHeight: 1.65, maxWidth: '430px' }}>
              Launch a managed bug bounty program in minutes. Get continuous security testing from a global community of vetted researchers.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: '1.5rem 0', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                'Launch a program and define scope in minutes',
                'Receive triaged, actionable vulnerability reports',
                'Pay only for valid, verified findings',
                'Track metrics and remediation progress in real time',
              ].map(item => (
                <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', color: '#374151', fontSize: '0.95rem' }}>
                  <span style={{ color: C.pink, fontWeight: 700, marginTop: '1px', flexShrink: 0 }}>✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <button onClick={() => navigate('/choose-role')} style={{ ...btn(C.pink, '#C8195F') }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#C8195F'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = C.pink; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
            >Create a Program →</button>
          </div>

          {/* Right: visual */}
          <div>
            <div style={{ background: `linear-gradient(135deg, ${C.navBg} 0%, #252848 100%)`, borderRadius: '16px', padding: '1.75rem', border: `1px solid ${C.borderMuted}`, boxShadow: '0 20px 50px rgba(0,0,0,0.15)' }}>
              <div style={{ marginBottom: '1rem', fontSize: '0.72rem', color: C.textMuted, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Program Dashboard</div>
              {/* Mock chart bars */}
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '80px', marginBottom: '1.25rem' }}>
                {[40, 62, 55, 75, 48, 90, 68, 82, 59, 95, 70, 88].map((h, i) => (
                  <div key={i} style={{ flex: 1, height: `${h}%`, background: `linear-gradient(180deg, ${C.trustedBlue} 0%, rgba(63,58,252,0.3) 100%)`, borderRadius: '3px 3px 0 0', opacity: 0.85 + (i % 3) * 0.05 }} />
                ))}
              </div>
              {[
                { label: 'Open reports',    value: '12', color: C.trustedBlue },
                { label: 'Triaged today',   value: '5',  color: C.teal },
                { label: 'Resolved this week', value: '23', color: C.pink },
                { label: 'Total paid out',  value: '$48,320', color: '#FFB800' },
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: `1px solid ${C.borderMuted}`, fontSize: '0.84rem' }}>
                  <span style={{ color: C.textMuted }}>{row.label}</span>
                  <span style={{ color: row.color, fontWeight: 700 }}>{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ CTA SECTION ══════════ */}
      <section style={{
        background: `linear-gradient(135deg, #12152B 0%, ${C.navBg} 100%)`,
        padding: '6rem 1.5rem',
        textAlign: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '700px', height: '400px', background: `radial-gradient(ellipse, rgba(63,58,252,0.15) 0%, transparent 65%)`, pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '560px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: '1rem' }}>Ready to make the internet safer?</h2>
          <p style={{ color: C.textMuted, fontSize: '1rem', lineHeight: 1.65, marginBottom: '2rem' }}>
            Join thousands of security researchers and forward-thinking organisations already on BountyOS.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            {user.isLoggedIn ? (
              <button onClick={() => navigate('/bounties')} style={{ ...btn(C.trustedBlue, C.trustedBlueHover), fontSize: '0.98rem', padding: '0.75rem 1.8rem' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = C.trustedBlueHover; (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = C.trustedBlue; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
              >Go to Dashboard →</button>
            ) : (
              <button onClick={() => navigate('/choose-role')} style={{ ...btn(C.trustedBlue, C.trustedBlueHover), fontSize: '0.98rem', padding: '0.75rem 1.8rem' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = C.trustedBlueHover; (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = C.trustedBlue; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
              >Create Free Account →</button>
            )}
            <button onClick={() => navigate('/bounties')} style={{ background: 'transparent', border: '1.5px solid rgba(255,255,255,0.25)', color: '#fff', borderRadius: '999px', padding: '0.75rem 1.8rem', fontWeight: 600, fontSize: '0.98rem', cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.5)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.25)'; }}
            >Browse Programs →</button>
          </div>
        </div>
      </section>

      {/* ══════════ GET IN TOUCH ══════════ */}
      <section style={{ background: '#12152B', padding: '6rem 1.5rem', position: 'relative', overflow: 'hidden' }}>
        {/* Glow blobs */}
        <div style={{ position: 'absolute', top: 0, right: 0, width: '55%', height: '100%', background: `radial-gradient(ellipse at 80% 30%, rgba(196,59,246,0.22) 0%, transparent 50%), radial-gradient(ellipse at 90% 70%, rgba(32,186,142,0.15) 0%, transparent 45%), radial-gradient(ellipse at 60% 50%, rgba(63,58,252,0.12) 0%, transparent 55%)`, pointerEvents: 'none' }} />
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1.15fr', gap: '5rem', alignItems: 'center', position: 'relative', zIndex: 1 }}>
          {/* Left copy */}
          <div>
            <div style={{ color: C.pink, fontWeight: 700, fontSize: '0.85rem', marginBottom: '1rem', letterSpacing: '0.02em' }}>Get in touch</div>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: '1rem' }}>Speak with a<br />security expert</h2>
            <p style={{ color: C.textMuted, fontSize: '1rem', lineHeight: 1.65, maxWidth: '360px' }}>We can help you detect and resolve vulnerabilities before they are exploited.</p>
          </div>
          {/* Right form card */}
          <div style={{ background: 'rgba(28,31,53,0.85)', border: `1px solid ${C.borderMuted}`, borderRadius: '12px', padding: '2rem', backdropFilter: 'blur(10px)' }}>
            {contactSent ? (
              <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>✅</div>
                <h3 style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Message Sent!</h3>
                <p style={{ color: C.textMuted, fontSize: '0.9rem' }}>Our team will get back to you shortly.</p>
                <button onClick={() => { setContactSent(false); setContactForm({ firstName: '', lastName: '', email: '', company: '', jobTitle: '', objective: '', country: '' }); }} style={{ marginTop: '1.25rem', ...btn(C.trustedBlue) }}>Send Another →</button>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  {[{ label: 'First Name:', key: 'firstName', placeholder: '' }, { label: 'Last Name:', key: 'lastName', placeholder: '' }].map(f => (
                    <div key={f.key}>
                      <label style={{ display: 'block', color: '#D0D3E8', fontSize: '0.82rem', marginBottom: '0.35rem' }}>{f.label} <span style={{ color: C.pink }}>*</span></label>
                      <input required value={(contactForm as any)[f.key]} onChange={e => setContactForm(p => ({ ...p, [f.key]: e.target.value }))} style={{ width: '100%', padding: '0.6rem 0.75rem', background: '#fff', border: '1.5px solid #ccc', borderRadius: '5px', fontSize: '0.88rem', color: '#111', boxSizing: 'border-box', outline: 'none' }} />
                    </div>
                  ))}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  {[{ label: 'Business Email:', key: 'email', type: 'email' }, { label: 'Company:', key: 'company', type: 'text' }].map(f => (
                    <div key={f.key}>
                      <label style={{ display: 'block', color: '#D0D3E8', fontSize: '0.82rem', marginBottom: '0.35rem' }}>{f.label} <span style={{ color: C.pink }}>*</span></label>
                      <input required type={f.type} value={(contactForm as any)[f.key]} onChange={e => setContactForm(p => ({ ...p, [f.key]: e.target.value }))} style={{ width: '100%', padding: '0.6rem 0.75rem', background: '#fff', border: '1.5px solid #ccc', borderRadius: '5px', fontSize: '0.88rem', color: '#111', boxSizing: 'border-box', outline: 'none' }} />
                    </div>
                  ))}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', color: '#D0D3E8', fontSize: '0.82rem', marginBottom: '0.35rem' }}>Job Title: <span style={{ color: C.pink }}>*</span></label>
                    <input required value={contactForm.jobTitle} onChange={e => setContactForm(p => ({ ...p, jobTitle: e.target.value }))} style={{ width: '100%', padding: '0.6rem 0.75rem', background: '#fff', border: '1.5px solid #ccc', borderRadius: '5px', fontSize: '0.88rem', color: '#111', boxSizing: 'border-box', outline: 'none' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', color: '#D0D3E8', fontSize: '0.82rem', marginBottom: '0.35rem' }}>What is your security objective? <span style={{ color: C.pink }}>*</span></label>
                    <select required value={contactForm.objective} onChange={e => setContactForm(p => ({ ...p, objective: e.target.value }))} style={{ width: '100%', padding: '0.6rem 0.75rem', background: '#fff', border: '1.5px solid #ccc', borderRadius: '5px', fontSize: '0.88rem', color: contactForm.objective ? '#111' : '#777', boxSizing: 'border-box', outline: 'none' }}>
                      <option value="" disabled>Select...</option>
                      {SECURITY_OBJECTIVES.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                </div>
                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', color: '#D0D3E8', fontSize: '0.82rem', marginBottom: '0.35rem' }}>Country: <span style={{ color: C.pink }}>*</span></label>
                  <select required value={contactForm.country} onChange={e => setContactForm(p => ({ ...p, country: e.target.value }))} style={{ width: '100%', padding: '0.6rem 0.75rem', background: '#fff', border: '1.5px solid #ccc', borderRadius: '5px', fontSize: '0.88rem', color: contactForm.country ? '#111' : '#777', boxSizing: 'border-box', outline: 'none' }}>
                    <option value="" disabled>Select...</option>
                    {['United States','United Kingdom','Germany','France','Romania','Ukraine','Netherlands','Canada','Australia','India','Brazil','Japan','Sweden','Norway','Denmark','Finland','Poland','Spain','Italy','Other'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <p style={{ color: C.textMuted, fontSize: '0.75rem', lineHeight: 1.55, marginBottom: '1.25rem' }}>
                  We will handle your contact details in line with our <Link to="/" style={{ color: '#fff', textDecoration: 'underline' }}>Privacy Policy</Link>. If you prefer not to receive marketing emails, you can opt-out by contacting our support team.
                </p>
                <button type="submit" disabled={contactLoading} style={{ ...btn(C.trustedBlue), fontSize: '0.92rem', padding: '0.65rem 1.5rem', opacity: contactLoading ? 0.7 : 1 }}>
                  {contactLoading ? 'Sending…' : 'Submit ⊕'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ══════════ FOOTER ══════════ */}
      <footer style={{ background: C.navBg, padding: '4rem 1.5rem 0', borderTop: `1px solid ${C.borderMuted}` }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '3rem', marginBottom: '3rem' }}>
            {/* Brand col */}
            <div>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}
              >
                <div style={{ width: '26px', height: '26px', background: `linear-gradient(135deg, ${C.trustedBlue}, ${C.pink})`, borderRadius: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#fff', fontSize: '13px' }}>B</div>
                <span style={{ fontWeight: 800, color: '#fff', fontSize: '1rem', letterSpacing: '-0.02em' }}>BountyOS</span>
                <ArrowUpCircle size={16} color={C.textMuted} style={{ marginLeft: '2px' }} />
              </button>
            </div>
            {/* Platform col */}
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff', letterSpacing: '0.06em', textTransform: 'capitalize', marginBottom: '1rem' }}>Platform</div>
              {[{ label: 'Bug Bounties', to: '/bounties' }, { label: 'Leaderboard', to: '/leaderboard' }].map(l => (
                <Link key={l.label} to={l.to} style={{ display: 'block', color: C.textMuted, textDecoration: 'none', fontSize: '0.88rem', marginBottom: '0.55rem', transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#fff'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = C.textMuted}
                >{l.label}</Link>
              ))}
            </div>
            {/* Company col */}
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff', letterSpacing: '0.06em', textTransform: 'capitalize', marginBottom: '1rem' }}>Company</div>
              {[{ label: 'Leaderboard', to: '/leaderboard' }, { label: 'Support', to: '/support' }, { label: 'Contact Us', to: '/contact-us' }].map(l => (
                <Link key={l.label} to={l.to} style={{ display: 'block', color: C.textMuted, textDecoration: 'none', fontSize: '0.88rem', marginBottom: '0.55rem', transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#fff'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = C.textMuted}
                >{l.label}</Link>
              ))}
              {/* Social icons */}
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', alignItems: 'center' }}>
                {([
                  { label: 'X',        icon: <Twitter size={14} />,  href: '#' },
                  { label: 'LinkedIn', icon: <Linkedin size={14} />, href: '#' },
                  { label: 'GitHub',   icon: <Github size={14} />,   href: '#' },
                ] as { label: string; icon: React.ReactNode; href: string }[]).map(s => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" style={{ width: '32px', height: '32px', borderRadius: '6px', background: 'rgba(255,255,255,0.07)', border: `1px solid ${C.borderMuted}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.textMuted, textDecoration: 'none', fontSize: '0.72rem', fontWeight: 700, transition: 'all 0.2s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.14)'; (e.currentTarget as HTMLElement).style.color = '#fff'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.07)'; (e.currentTarget as HTMLElement).style.color = C.textMuted; }}
                  >{s.icon}</a>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div style={{ borderTop: `1px solid ${C.borderMuted}`, padding: '1.5rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              {[{ label: 'Contact', to: '/contact-us' }, { label: 'Support', to: '/support' }].map(l => (
                <Link key={l.label} to={l.to} style={{ color: C.textMuted, textDecoration: 'none', fontSize: '0.8rem', transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#fff'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = C.textMuted}
                >{l.label}</Link>
              ))}
            </div>
            <span style={{ color: C.textMuted, fontSize: '0.8rem' }}>©2026 BountyOS All rights reserved.</span>
          </div>
        </div>
      </footer>

      {/* ══════════ RESPONSIVE OVERRIDES ══════════ */}
      <style>{`
        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          .hamburger-btn { display: block !important; }
          section > div[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; }
          section > div[style*="grid-template-columns: 1fr 1.15fr"] { grid-template-columns: 1fr !important; }
          section > div[style*="grid-template-columns: repeat(4"] { grid-template-columns: repeat(2, 1fr) !important; }
          section > div[style*="grid-template-columns: repeat(3"] { grid-template-columns: 1fr 1fr !important; }
          footer > div > div[style*="grid-template-columns: 2fr 1fr 1fr"] { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 580px) {
          section > div[style*="grid-template-columns: repeat(3"] { grid-template-columns: 1fr !important; }
          section > div[style*="grid-template-columns: repeat(4"] { grid-template-columns: 1fr !important; }
          section > div[style*="grid-template-columns: 1fr 1.15fr"] { grid-template-columns: 1fr !important; }
          footer > div > div[style*="grid-template-columns: 2fr 1fr 1fr"] { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 420px) {
          footer > div > div[style*="grid-template-columns: 2fr"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

/* ─────────────── FeatureCard sub-component ─────────────── */
function FeatureCard({ color, title, desc, link, icon: Icon, navigate }: {
  color: string; title: string; desc: string; link: string; icon: React.ElementType; navigate: (p: string) => void;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={() => navigate(link)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? '#fff' : 'rgba(255,255,255,0.8)',
        border: `1px solid ${hovered ? color + '55' : '#E0E4F0'}`,
        borderRadius: hovered ? '12px 12px 24px 12px' : '12px',
        padding: '1.4rem',
        cursor: 'pointer',
        transition: 'all 0.25s ease',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: hovered ? `0 8px 30px ${color}18` : 'none',
      }}
    >
      {/* Color accent bars */}
      {hovered && <>
        <div style={{ position: 'absolute', left: '-1px', top: '15%', height: '70%', width: '2px', background: `linear-gradient(180deg, transparent, ${color}, transparent)` }} />
        <div style={{ position: 'absolute', right: '-1px', top: '15%', height: '60%', width: '2px', background: `linear-gradient(180deg, transparent, ${color}, transparent)` }} />
      </>}
      <div style={{ width: '40px', height: '40px', background: color + '18', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.85rem' }}>
        <Icon size={20} color={color} strokeWidth={1.8} />
      </div>
      <h3 style={{ fontSize: '0.97rem', fontWeight: 700, color: '#1C1F35', marginBottom: '0.4rem' }}>{title}</h3>
      <p style={{ fontSize: '0.82rem', color: '#6B7280', lineHeight: 1.55, margin: 0 }}>{desc}</p>
      <div style={{ marginTop: '0.75rem', fontSize: '0.78rem', color: color, fontWeight: 700, opacity: hovered ? 1 : 0, transition: 'opacity 0.25s ease' }}>Explore →</div>
    </div>
  );
}
