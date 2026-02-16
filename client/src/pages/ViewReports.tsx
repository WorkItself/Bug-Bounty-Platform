import React, { useState } from 'react';

const ViewReports = () => {
  const initialReports = [
    { id: 1, title: 'Cross-Site Scripting (XSS) in User Profile', researcher: 'Glitch', severity: 'High', status: 'Pending' },
    { id: 2, title: 'Insecure Direct Object Reference on /api/orders', researcher: 'Phant0m', severity: 'High', status: 'Pending' },
    { id: 3, title: 'SQL Injection via Search Parameter', researcher: 'CyberWraith', severity: 'Critical', status: 'Pending' },
    { id: 4, title: 'Outdated jQuery Version with Known Vulnerability', researcher: 'ZeroCool', severity: 'Medium', status: 'Pending' },
    { id: 5, title: 'Missing CSRF Token in Settings Form', researcher: 'Nyx', severity: 'High', status: 'Pending' },
    { id: 6, title: 'Verbose Error Message Reveals Server Path', researcher: 'ShadowByte', severity: 'Low', status: 'Pending' },
  ];

  const [reports, setReports] = useState(initialReports);
  const [filter, setFilter] = useState('Pending');

  const handleStatusChange = (id: number, newStatus: 'Accepted' | 'Declined') => {
    setReports(reports.map(report => 
      report.id === id ? { ...report, status: newStatus } : report
    ));
  };

  const severityColors = {
    'Critical': '#ff4d4d',
    'High': '#ff8c1a',
    'Medium': '#ffcc00',
    'Low': '#52c41a',
  };

  const filteredReports = reports.filter(report => filter === 'All' || report.status === filter);

  return (
    <div style={{ padding: '2rem', color: '#e0e0e0' }}>
      <h1 style={{ textAlign: 'center', fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem' }}>
        Submitted Bug Reports
      </h1>
      <p style={{ textAlign: 'center', fontSize: '1.2rem', color: '#a0a0a0', marginBottom: '2rem' }}>
        Review and triage submissions from security researchers.
      </p>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
        {['Pending', 'Accepted', 'Declined', 'All'].map(status => (
          <button key={status} onClick={() => setFilter(status)} style={{
            padding: '0.5rem 1.5rem',
            background: filter === status ? 'linear-gradient(90deg, #00C9FF 0%, #92FE9D 100%)' : '#1e2a3a',
            color: filter === status ? '#101822' : '#e0e0e0',
            border: '1px solid #333',
            borderRadius: '20px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}>{status}</button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {filteredReports.map(report => (
          <div key={report.id} style={{
            background: 'linear-gradient(145deg, #1e2a3a, #101822)',
            borderRadius: '12px',
            padding: '1.5rem',
            display: 'grid',
            gridTemplateColumns: '1fr auto auto',
            alignItems: 'center',
            gap: '1rem',
            borderLeft: `5px solid ${severityColors[report.severity]}`,
          }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{report.title}</h3>
              <p style={{ margin: '0.25rem 0 0', color: '#a0a0a0' }}>
                Submitted by: <span style={{ fontWeight: 'bold' }}>{report.researcher}</span>
              </p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{
                padding: '0.3rem 0.8rem',
                borderRadius: '6px',
                background: severityColors[report.severity],
                color: '#101822',
                fontWeight: 'bold',
                fontSize: '0.9rem',
              }}>
                {report.severity}
              </div>
            </div>
            {report.status === 'Pending' ? (
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button onClick={() => handleStatusChange(report.id, 'Accepted')} style={{ padding: '0.5rem 1rem', background: '#4caf50', border: 'none', borderRadius: '6px', color: '#fff', cursor: 'pointer' }}>Accept</button>
                <button onClick={() => handleStatusChange(report.id, 'Declined')} style={{ padding: '0.5rem 1rem', background: '#f44336', border: 'none', borderRadius: '6px', color: '#fff', cursor: 'pointer' }}>Decline</button>
              </div>
            ) : (
              <div style={{ fontWeight: 'bold', color: report.status === 'Accepted' ? '#4caf50' : '#f44336' }}>
                {report.status.toUpperCase()}
              </div>
            )}
          </div>
        ))}
        {filteredReports.length === 0 && (
          <p style={{ textAlign: 'center', color: '#a0a0a0', padding: '2rem' }}>No reports found for this category.</p>
        )}
      </div>
    </div>
  );
};

export default ViewReports;
