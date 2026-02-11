import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { login } = useUser();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', name: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.email && formData.name) {
      login('hacker', formData.name, formData.email);
      navigate('/');
    }
  };

  return (
    <div style={{
      maxWidth: '600px',
      margin: '0 auto',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 'calc(100vh - 200px)'
    }}>
      <div style={{
        width: '100%',
        background: 'linear-gradient(135deg, #1B3A57 0%, #0C1A30 100%)',
        padding: '2.5rem',
        borderRadius: '0.75rem',
        border: '2px solid #009B77'
      }}>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: '800',
          marginBottom: '0.5rem',
          letterSpacing: '-0.02em',
          color: '#FFFFFF'
        }}>Welcome Back</h1>
        <p style={{
          color: '#A2DFF7',
          marginBottom: '2rem',
          fontSize: '1rem'
        }}>Access your security research account</p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.9rem',
              fontWeight: '600',
              marginBottom: '0.5rem',
              color: '#FFFFFF'
            }}>Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              style={{
                width: '100%',
                padding: '0.75rem',
                background: '#0C1A30',
                border: '1px solid #1B3A57',
                borderRadius: '0.5rem',
                color: '#FFFFFF',
                fontSize: '1rem',
                fontFamily: 'inherit'
              }}
              placeholder="Your name"
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '0.9rem',
              fontWeight: '600',
              marginBottom: '0.5rem',
              color: '#FFFFFF'
            }}>Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              style={{
                width: '100%',
                padding: '0.75rem',
                background: '#0C1A30',
                border: '1px solid #1B3A57',
                borderRadius: '0.5rem',
                color: '#FFFFFF',
                fontSize: '1rem',
                fontFamily: 'inherit'
              }}
              placeholder="your@email.com"
            />
          </div>

          <button
            type="submit"
            style={{
              padding: '0.75rem 1.5rem',
              background: 'linear-gradient(135deg, #009B77 0%, #007A60 100%)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '0.5rem',
              fontWeight: '600',
              fontSize: '1rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.transform = 'translateY(-2px)';
              (e.target as HTMLElement).style.boxShadow = '0 4px 15px rgba(0, 155, 119, 0.3)';
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.transform = 'translateY(0)';
              (e.target as HTMLElement).style.boxShadow = 'none';
            }}
          >
            Login
          </button>
        </form>

        <div style={{ marginTop: '2rem', textAlign: 'center', borderTop: '1px solid #1B3A57', paddingTop: '2rem' }}>
          <p style={{ color: '#A2DFF7', marginBottom: '0.5rem' }}>New to our platform?</p>
          <a href="/register" style={{
            color: '#009B77',
            textDecoration: 'none',
            fontWeight: '600',
            transition: 'color 0.2s ease'
          }}
          onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.color = '#A2DFF7'}
          onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.color = '#009B77'}
          >
            Create an account
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
