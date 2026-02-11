import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const { login } = useUser();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', userType: 'hacker' as 'hacker' | 'company' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.email && formData.name) {
      login(formData.userType, formData.name, formData.email);
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
        }}>Create Account</h1>
        <p style={{
          color: '#A2DFF7',
          marginBottom: '2rem',
          fontSize: '1rem'
        }}>Join the bug bounty platform today</p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.9rem',
              fontWeight: '600',
              marginBottom: '0.5rem',
              color: '#FFFFFF'
            }}>Full Name</label>
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
              placeholder="Enter your full name"
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

          {/* Fancy Side-by-Side Radio Buttons */}
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.9rem',
              fontWeight: '600',
              marginBottom: '1rem',
              color: '#FFFFFF'
            }}>Account Type</label>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '1rem'
            }}>
              {/* Bounty Hunter Option */}
              <label style={{
                cursor: 'pointer',
                position: 'relative'
              }}>
                <input
                  type="radio"
                  name="userType"
                  value="hacker"
                  checked={formData.userType === 'hacker'}
                  onChange={(e) => setFormData({ ...formData, userType: e.target.value as any })}
                  style={{ display: 'none' }}
                />
                <div style={{
                  padding: '1.5rem',
                  borderRadius: '0.75rem',
                  border: formData.userType === 'hacker' ? '2px solid #009B77' : '2px solid #1B3A57',
                  background: formData.userType === 'hacker' ? 'rgba(0, 155, 119, 0.1)' : '#0C1A30',
                  transition: 'all 0.3s ease',
                  textAlign: 'center'
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = '#009B77';
                  (e.currentTarget as HTMLElement).style.background = 'rgba(0, 155, 119, 0.05)';
                }}
                onMouseLeave={(e) => {
                  if (formData.userType !== 'hacker') {
                    (e.currentTarget as HTMLElement).style.borderColor = '#1B3A57';
                    (e.currentTarget as HTMLElement).style.background = '#0C1A30';
                  }
                }}
                >
                  <div style={{
                    fontSize: '2rem',
                    marginBottom: '0.5rem',
                    color: '#009B77'
                  }}>🎯</div>
                  <h3 style={{
                    margin: '0.5rem 0 0.25rem 0',
                    color: '#FFFFFF',
                    fontSize: '1rem',
                    fontWeight: '700'
                  }}>Bug Bounty Hunter</h3>
                  <p style={{
                    margin: 0,
                    color: '#A2DFF7',
                    fontSize: '0.85rem',
                    lineHeight: '1.4'
                  }}>Find vulnerabilities and earn rewards</p>
                </div>
              </label>

              {/* Company Option */}
              <label style={{
                cursor: 'pointer',
                position: 'relative'
              }}>
                <input
                  type="radio"
                  name="userType"
                  value="company"
                  checked={formData.userType === 'company'}
                  onChange={(e) => setFormData({ ...formData, userType: e.target.value as any })}
                  style={{ display: 'none' }}
                />
                <div style={{
                  padding: '1.5rem',
                  borderRadius: '0.75rem',
                  border: formData.userType === 'company' ? '2px solid #009B77' : '2px solid #1B3A57',
                  background: formData.userType === 'company' ? 'rgba(0, 155, 119, 0.1)' : '#0C1A30',
                  transition: 'all 0.3s ease',
                  textAlign: 'center'
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = '#009B77';
                  (e.currentTarget as HTMLElement).style.background = 'rgba(0, 155, 119, 0.05)';
                }}
                onMouseLeave={(e) => {
                  if (formData.userType !== 'company') {
                    (e.currentTarget as HTMLElement).style.borderColor = '#1B3A57';
                    (e.currentTarget as HTMLElement).style.background = '#0C1A30';
                  }
                }}
                >
                  <div style={{
                    fontSize: '2rem',
                    marginBottom: '0.5rem',
                    color: '#A2DFF7'
                  }}>🏢</div>
                  <h3 style={{
                    margin: '0.5rem 0 0.25rem 0',
                    color: '#FFFFFF',
                    fontSize: '1rem',
                    fontWeight: '700'
                  }}>Company</h3>
                  <p style={{
                    margin: 0,
                    color: '#A2DFF7',
                    fontSize: '0.85rem',
                    lineHeight: '1.4'
                  }}>Create a bounty program</p>
                </div>
              </label>
            </div>
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
            Create Account
          </button>
        </form>

        <div style={{ marginTop: '2rem', textAlign: 'center', borderTop: '1px solid #1B3A57', paddingTop: '2rem' }}>
          <p style={{ color: '#A2DFF7', marginBottom: '0.5rem' }}>Already have an account?</p>
          <a href="/login" style={{
            color: '#009B77',
            textDecoration: 'none',
            fontWeight: '600',
            transition: 'color 0.2s ease'
          }}
          onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.color = '#007A60'}
          onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.color = '#009B77'}
          >
            Login here
          </a>
        </div>
      </div>
    </div>
  );
};

export default Register;
