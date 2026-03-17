import { useState } from 'react';
import { useUser } from '../context/UserContext';
import { useSupport } from '../context/SupportContext';

const ContactSupport = () => {
  const { user } = useUser();
  const { submitRequest } = useSupport();
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  if (!user.isLoggedIn) {
    return <div style={{ padding: '2rem', color: '#A2DFF7' }}>Please log in to contact support.</div>;
  }

  if (user.type === 'admin') {
    return <div style={{ padding: '2rem', color: '#A2DFF7' }}>Admins should use the support requests dashboard.</div>;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    submitRequest(message.trim());
    setMessage('');
    setSent(true);
    setTimeout(() => setSent(false), 3500);
  };

  return (
    <div style={{ width: '100%', maxWidth: '1000px', margin: '0 auto' }}>
      <h1 style={{ color: '#FFFFFF', fontSize: '2rem' }}>Contact Support</h1>
      <p style={{ color: '#A2DFF7' }}>Describe your issue and our team will respond.</p>

      <form onSubmit={handleSubmit} style={{ marginTop: '1.25rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', color: '#A2DFF7', marginBottom: '0.5rem' }}>From</label>
          <div style={{ color: '#fff' }}>{user.name} — {(user as any).email ?? 'No email'}</div>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', color: '#A2DFF7', marginBottom: '0.5rem' }}>Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={{ width: '100%', minHeight: '140px', padding: '0.75rem', borderRadius: '8px', background: '#0C1A30', color: '#fff', border: '1px solid #1B3A57' }}
            placeholder="Describe the problem or question..."
            required
          />
        </div>

        <button type="submit" style={{ padding: '0.75rem 1.25rem', background: '#009B77', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Send</button>
        {sent && <span style={{ marginLeft: '1rem', color: '#92FE9D' }}>Request sent.</span>}
      </form>
    </div>
  );
};

export default ContactSupport;

