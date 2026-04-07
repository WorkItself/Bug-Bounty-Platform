import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSupport } from '../context/SupportContext';
import { Twitter, Linkedin, Github, ArrowUpCircle } from 'lucide-react';

const C = {
  navBg:      '#1C1F35',
  trustedBlue:'#3F3AFC',
  trustedBlueHover:'#2F2AEC',
  pink:       '#E81C79',
  teal:       '#20BA8E',
  textWhite:  '#FFFFFF',
  textMuted:  '#A0A3B8',
  borderMuted:'#2E3150',
  sectionLight:'#F7F9FC',
};

const SECURITY_OBJECTIVES = [
  'Reduce Attack Surface',
  'Comply with Regulations',
  'Protect Customer Data',
  'Continuous Security Testing',
  'Find Critical Vulnerabilities',
  'Other',
];

const COUNTRIES = [
  'United States','United Kingdom','Germany','France','Romania','Ukraine',
  'Netherlands','Canada','Australia','India','Brazil','Japan','Sweden',
  'Norway','Denmark','Finland','Poland','Spain','Italy','Moldova','Other',
];

const btn = (bg: string): React.CSSProperties => ({
  display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
  padding: '0.65rem 1.4rem',
  background: bg, color: '#fff',
  border: 'none', borderRadius: '999px',
  fontWeight: 600, fontSize: '0.92rem', cursor: 'pointer',
  transition: 'background 0.2s ease, transform 0.15s ease',
  textDecoration: 'none',
});

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '0.6rem 0.75rem',
  background: '#fff', border: '1.5px solid #D1D5DB',
  borderRadius: '6px', fontSize: '0.88rem', color: '#111',
  boxSizing: 'border-box', outline: 'none',
  transition: 'border-color 0.2s',
};

const selectStyle: React.CSSProperties = {
  ...inputStyle,
  appearance: 'auto',
};

const labelStyle: React.CSSProperties = {
  display: 'block', color: '#374151', fontSize: '0.82rem',
  fontWeight: 600, marginBottom: '0.35rem',
};

export default function ContactUs() {
  const { submitRequest } = useSupport();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [contactSent, setContactSent] = useState(false);
  const [contactLoading, setContactLoading] = useState(false);
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', company: '',
    jobTitle: '', objective: '', country: '', message: '',
  });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactLoading(true);
    setTimeout(() => {
      submitRequest(
        `Company contact inquiry from ${form.firstName} ${form.lastName}.\nCompany: ${form.company}\nJob Title: ${form.jobTitle}\nCountry: ${form.country}\nSecurity Objective: ${form.objective}\nMessage: ${form.message}\nEmail: ${form.email}`,
        { name: `${form.firstName} ${form.lastName}`, email: form.email, company: form.company, jobTitle: form.jobTitle, securityObjective: form.objective }
      );
      setContactLoading(false);
      setContactSent(true);
    }, 600);
  };

  return (
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif', color: '#111', background: '#fff' }}>

      {/* ══════════ NAVBAR ══════════ */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: C.navBg,
        borderBottom: scrolled ? `1px solid ${C.borderMuted}` : '1px solid transparent',
        transition: 'border-color 0.2s ease',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem', height: '64px', display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
            <div style={{ width: '28px', height: '28px', background: `linear-gradient(135deg, ${C.trustedBlue}, ${C.pink})`, borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 900, color: '#fff' }}>B</div>
            <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>BountyOS</span>
          </Link>

          <nav style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flex: 1 }} className="desktop-nav">
            {[
              { label: 'Bug Bounties', to: '/bounties' },
              { label: 'Leaderboard', to: '/leaderboard' },
              { label: 'Resources', to: '/kb' },
              { label: 'Researchers', to: '/register' },
            ].map(({ label, to }) => (
              <Link key={label} to={to} style={{
                padding: '0.4rem 0.9rem', color: C.textMuted, textDecoration: 'none',
                fontSize: '0.88rem', fontWeight: 500, borderRadius: '6px', transition: 'color 0.2s ease, background 0.2s ease',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#fff'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = C.textMuted; (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
              >{label}</Link>
            ))}
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
            <Link to="/login" style={{ color: C.textMuted, textDecoration: 'none', fontSize: '0.88rem', fontWeight: 500, padding: '0.4rem 0.75rem', transition: 'color 0.2s', borderRadius: '6px' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#fff'}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = C.textMuted}
            >Login</Link>
            <Link to="/register" style={{ ...btn(C.trustedBlue), fontSize: '0.88rem', padding: '0.5rem 1.2rem' }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = C.trustedBlueHover}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = C.trustedBlue}
            >Get Started →</Link>
          </div>

          <button onClick={() => setMobileOpen(o => !o)} style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: '0.4rem' }} className="hamburger-btn">
            <div style={{ width: '22px', height: '2px', background: '#fff', marginBottom: '5px', borderRadius: '2px' }} />
            <div style={{ width: '22px', height: '2px', background: '#fff', marginBottom: '5px', borderRadius: '2px' }} />
            <div style={{ width: '22px', height: '2px', background: '#fff', borderRadius: '2px' }} />
          </button>
        </div>

        {mobileOpen && (
          <div style={{
            position: 'absolute', top: '64px', left: 0, right: 0,
            background: C.navBg, borderTop: `1px solid ${C.borderMuted}`, borderBottom: `1px solid ${C.borderMuted}`,
            padding: '1rem 1.5rem 1.5rem', zIndex: 99, boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          }}>
            {[
              { label: 'Bug Bounties', to: '/bounties' },
              { label: 'Leaderboard', to: '/leaderboard' },
              { label: 'Resources', to: '/kb' },
              { label: 'Login', to: '/login' },
              { label: 'Get Started', to: '/register' },
            ].map(({ label, to }) => (
              <Link key={label} to={to} onClick={() => setMobileOpen(false)} style={{
                display: 'block', padding: '0.65rem 0', borderBottom: `1px solid ${C.borderMuted}`,
                color: '#fff', textDecoration: 'none', fontSize: '0.95rem',
              }}>{label}</Link>
            ))}
          </div>
        )}
      </header>

      {/* ══════════ HERO BANNER ══════════ */}
      <section style={{
        background: `linear-gradient(160deg, #12152B 0%, ${C.navBg} 50%, #161931 100%)`,
        paddingTop: '64px', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: '20%', left: '50%', width: '600px', height: '400px', background: `radial-gradient(ellipse, rgba(63,58,252,0.12) 0%, transparent 65%)`, pointerEvents: 'none' }} />
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '5rem 1.5rem 4rem', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(232,28,121,0.15)', border: '1px solid rgba(232,28,121,0.35)', borderRadius: '999px', padding: '0.3rem 0.8rem', marginBottom: '1.5rem' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: C.pink, display: 'inline-block' }} />
            <span style={{ fontSize: '0.78rem', color: '#F0A0C4', fontWeight: 600, letterSpacing: '0.03em' }}>FOR ORGANISATIONS</span>
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, lineHeight: 1.15, color: '#fff', letterSpacing: '-0.03em', marginBottom: '1rem' }}>
            Protect your business with<br />
            <span style={{ background: `linear-gradient(90deg, ${C.trustedBlue} 0%, ${C.pink} 100%)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>world-class security researchers</span>
          </h1>
          <p style={{ color: C.textMuted, fontSize: '1.05rem', lineHeight: 1.65, maxWidth: '520px', margin: '0 auto' }}>
            Get in touch with our team to launch a managed bug bounty program tailored to your organization's needs.
          </p>
        </div>
      </section>

      {/* ══════════ CONTACT FORM SECTION ══════════ */}
      <section style={{ background: C.sectionLight, padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '4rem', alignItems: 'start' }}>
          {/* Left: info */}
          <div>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: C.pink, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Get in touch</span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#1C1F35', marginTop: '0.4rem', letterSpacing: '-0.02em', lineHeight: 1.2 }}>Speak with our security team</h2>
            <p style={{ color: '#6B7280', fontSize: '1rem', marginTop: '0.75rem', lineHeight: 1.65, maxWidth: '400px' }}>
              Our experts will help you design a bug bounty program that fits your security needs and budget.
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: '2rem 0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                'Custom program design and scope definition',
                'Dedicated triage and response team',
                'Access to 8,500+ vetted security researchers',
                'Full analytics and compliance reporting',
                'Pay only for valid, verified findings',
              ].map(item => (
                <li key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', color: '#374151', fontSize: '0.95rem' }}>
                  <span style={{ color: C.teal, fontWeight: 700, marginTop: '1px', flexShrink: 0 }}>✓</span>
                  {item}
                </li>
              ))}
            </ul>
            <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '1.25rem', marginTop: '1rem' }}>
              <p style={{ fontSize: '0.88rem', color: '#6B7280', lineHeight: 1.6, margin: 0 }}>
                <strong style={{ color: '#111' }}>Trusted by 482+ organizations</strong> across finance, healthcare, e-commerce, and more.
              </p>
            </div>
          </div>

          {/* Right: form card */}
          <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '2rem', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
            {contactSent ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>✅</div>
                <h3 style={{ color: '#111', fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.5rem' }}>Message Sent!</h3>
                <p style={{ color: '#6B7280', fontSize: '0.95rem', marginBottom: '1.5rem' }}>Our team will get back to you within 24 hours.</p>
                <button
                  onClick={() => { setContactSent(false); setForm({ firstName: '', lastName: '', email: '', company: '', jobTitle: '', objective: '', country: '', message: '' }); }}
                  style={btn(C.trustedBlue)}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = C.trustedBlueHover}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = C.trustedBlue}
                >Send Another →</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#111', marginTop: 0, marginBottom: '1.5rem' }}>Tell us about your organization</h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={labelStyle}>First Name <span style={{ color: C.pink }}>*</span></label>
                    <input required value={form.firstName} onChange={e => setForm(p => ({ ...p, firstName: e.target.value }))} style={inputStyle}
                      onFocus={e => e.currentTarget.style.borderColor = C.trustedBlue}
                      onBlur={e => e.currentTarget.style.borderColor = '#D1D5DB'} />
                  </div>
                  <div>
                    <label style={labelStyle}>Last Name <span style={{ color: C.pink }}>*</span></label>
                    <input required value={form.lastName} onChange={e => setForm(p => ({ ...p, lastName: e.target.value }))} style={inputStyle}
                      onFocus={e => e.currentTarget.style.borderColor = C.trustedBlue}
                      onBlur={e => e.currentTarget.style.borderColor = '#D1D5DB'} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={labelStyle}>Business Email <span style={{ color: C.pink }}>*</span></label>
                    <input required type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} style={inputStyle}
                      onFocus={e => e.currentTarget.style.borderColor = C.trustedBlue}
                      onBlur={e => e.currentTarget.style.borderColor = '#D1D5DB'} />
                  </div>
                  <div>
                    <label style={labelStyle}>Company <span style={{ color: C.pink }}>*</span></label>
                    <input required value={form.company} onChange={e => setForm(p => ({ ...p, company: e.target.value }))} style={inputStyle}
                      onFocus={e => e.currentTarget.style.borderColor = C.trustedBlue}
                      onBlur={e => e.currentTarget.style.borderColor = '#D1D5DB'} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <label style={labelStyle}>Job Title <span style={{ color: C.pink }}>*</span></label>
                    <input required value={form.jobTitle} onChange={e => setForm(p => ({ ...p, jobTitle: e.target.value }))} style={inputStyle}
                      onFocus={e => e.currentTarget.style.borderColor = C.trustedBlue}
                      onBlur={e => e.currentTarget.style.borderColor = '#D1D5DB'} />
                  </div>
                  <div>
                    <label style={labelStyle}>Security Objective <span style={{ color: C.pink }}>*</span></label>
                    <select required value={form.objective} onChange={e => setForm(p => ({ ...p, objective: e.target.value }))}
                      style={{ ...selectStyle, color: form.objective ? '#111' : '#777' }}>
                      <option value="" disabled>Select...</option>
                      {SECURITY_OBJECTIVES.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={labelStyle}>Country <span style={{ color: C.pink }}>*</span></label>
                  <select required value={form.country} onChange={e => setForm(p => ({ ...p, country: e.target.value }))}
                    style={{ ...selectStyle, color: form.country ? '#111' : '#777' }}>
                    <option value="" disabled>Select...</option>
                    {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={labelStyle}>Message</label>
                  <textarea value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                    placeholder="Tell us more about your security needs..."
                    rows={4}
                    style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
                    onFocus={e => e.currentTarget.style.borderColor = C.trustedBlue}
                    onBlur={e => e.currentTarget.style.borderColor = '#D1D5DB'} />
                </div>

                <p style={{ color: '#9CA3AF', fontSize: '0.75rem', lineHeight: 1.55, marginBottom: '1.25rem' }}>
                  We will handle your contact details in line with our <Link to="/" style={{ color: '#3F3AFC', textDecoration: 'underline' }}>Privacy Policy</Link>.
                </p>

                <button type="submit" disabled={contactLoading}
                  style={{ ...btn(C.trustedBlue), fontSize: '0.92rem', padding: '0.65rem 1.5rem', opacity: contactLoading ? 0.7 : 1 }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = C.trustedBlueHover}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = C.trustedBlue}
                >
                  {contactLoading ? 'Sending…' : 'Submit Request'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ══════════ FOOTER ══════════ */}
      <footer style={{ background: C.navBg, padding: '4rem 1.5rem 0', borderTop: `1px solid ${C.borderMuted}` }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '3rem', marginBottom: '3rem' }}>
            <div>
              <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <div style={{ width: '26px', height: '26px', background: `linear-gradient(135deg, ${C.trustedBlue}, ${C.pink})`, borderRadius: '5px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#fff', fontSize: '13px' }}>B</div>
                <span style={{ fontWeight: 800, color: '#fff', fontSize: '1rem', letterSpacing: '-0.02em' }}>BountyOS</span>
                <ArrowUpCircle size={16} color={C.textMuted} style={{ marginLeft: '2px' }} />
              </button>
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff', letterSpacing: '0.06em', textTransform: 'capitalize', marginBottom: '1rem' }}>Platform</div>
              {[{ label: 'Bug Bounties', to: '/bounties' }, { label: 'Leaderboard', to: '/leaderboard' }, { label: 'Researchers', to: '/register' }].map(l => (
                <Link key={l.label} to={l.to} style={{ display: 'block', color: C.textMuted, textDecoration: 'none', fontSize: '0.88rem', marginBottom: '0.55rem', transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#fff'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = C.textMuted}
                >{l.label}</Link>
              ))}
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff', letterSpacing: '0.06em', textTransform: 'capitalize', marginBottom: '1rem' }}>Knowledge Center</div>
              {[{ label: 'Bug Bounty Basics', to: '/resources/bug-bounty-basics' }, { label: 'Vulnerability Reporting', to: '/resources/vulnerability-reporting' }, { label: 'Tools & Utilities', to: '/resources/tools' }].map(l => (
                <Link key={l.label} to={l.to} style={{ display: 'block', color: C.textMuted, textDecoration: 'none', fontSize: '0.88rem', marginBottom: '0.55rem', transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#fff'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = C.textMuted}
                >{l.label}</Link>
              ))}
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fff', letterSpacing: '0.06em', textTransform: 'capitalize', marginBottom: '1rem' }}>Company</div>
              {[{ label: 'Contact Us', to: '/contact-us' }, { label: 'Resources', to: '/kb' }].map(l => (
                <Link key={l.label} to={l.to} style={{ display: 'block', color: C.textMuted, textDecoration: 'none', fontSize: '0.88rem', marginBottom: '0.55rem', transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#fff'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = C.textMuted}
                >{l.label}</Link>
              ))}
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', alignItems: 'center' }}>
                {([
                  { label: 'X', icon: <Twitter size={14} />, href: '#' },
                  { label: 'LinkedIn', icon: <Linkedin size={14} />, href: '#' },
                  { label: 'GitHub', icon: <Github size={14} />, href: '#' },
                ] as { label: string; icon: React.ReactNode; href: string }[]).map(s => (
                  <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" style={{ width: '32px', height: '32px', borderRadius: '6px', background: 'rgba(255,255,255,0.07)', border: `1px solid ${C.borderMuted}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.textMuted, textDecoration: 'none', transition: 'all 0.2s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.14)'; (e.currentTarget as HTMLElement).style.color = '#fff'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.07)'; (e.currentTarget as HTMLElement).style.color = C.textMuted; }}
                  >{s.icon}</a>
                ))}
              </div>
            </div>
          </div>

          <div style={{ borderTop: `1px solid ${C.borderMuted}`, padding: '1.5rem 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              {[{ label: 'Terms', to: '/kb' }, { label: 'Privacy', to: '/kb' }, { label: 'Security', to: '/kb' }].map(l => (
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

      <style>{`
        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          .hamburger-btn { display: block !important; }
        }
      `}</style>
    </div>
  );
}
