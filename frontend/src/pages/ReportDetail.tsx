import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import axiosInstance from '../utils/axiosInstance';

interface Report {
  id: number;
  title: string;
  description?: string;
  severity: number;
  status: number;
  programId: number;
  reporterId: number;
}

interface Comment {
  id: number;
  bugReportId: number;
  authorId: number;
  content: string;
  isInternal: boolean;
  createdAt: string;
}

const SEV: Record<number, { label: string; color: string; bg: string }> = {
  1: { label: 'Low',      color: '#16a34a', bg: '#F0FDF4' },
  2: { label: 'Medium',   color: '#d97706', bg: '#FFFBEB' },
  3: { label: 'High',     color: '#ea580c', bg: '#FFF7ED' },
  4: { label: 'Critical', color: '#dc2626', bg: '#FEF2F2' },
};

const STATUS: Record<number, { label: string; color: string }> = {
  1: { label: 'New',      color: '#6B7280' },
  2: { label: 'Triaged',  color: '#3b82f6' },
  3: { label: 'Accepted', color: '#16a34a' },
  4: { label: 'Fixed',    color: '#0ea5e9' },
  5: { label: 'Rewarded', color: '#8b5cf6' },
  6: { label: 'Rejected', color: '#dc2626' },
};

const fmt = (iso: string) =>
  new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });

const ReportDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useUser();
  const isCompany = user.type === 'company' || user.type === 'admin';

  const [report, setReport]     = useState<Report | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading]   = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [text, setText]         = useState('');
  const [sending, setSending]   = useState(false);
  const [sendError, setSendError] = useState('');

  const [statusSaving, setStatusSaving] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      axiosInstance.get(`/report?id=${id}`),
      axiosInstance.get(`/comment/${id}`),
    ])
      .then(([rRes, cRes]) => {
        setReport(rRes.data);
        setComments(cRes.data ?? []);
      })
      .catch(err => { if (err.response?.status === 404) setNotFound(true); })
      .finally(() => setLoading(false));
  }, [id]);

  const refreshComments = () =>
    axiosInstance.get(`/comment/${id}`).then(r => setComments(r.data ?? []));

  const handleSend = async () => {
    if (!text.trim() || !report) return;
    setSending(true);
    setSendError('');
    try {
      await axiosInstance.post('/comment', {
        bugReportId: report.id,
        authorId: parseInt(user.id ?? '0'),
        content: text.trim(),
        isInternal: false,
      });
      setText('');
      await refreshComments();
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    } catch {
      setSendError('Failed to send message.');
    } finally {
      setSending(false);
    }
  };

  const handleStatusChange = async (newStatus: number) => {
    if (!report) return;
    setStatusSaving(true);
    try {
      await axiosInstance.put('/report', { ...report, status: newStatus });
      setReport(prev => prev ? { ...prev, status: newStatus } : prev);
    } catch {}
    setStatusSaving(false);
  };

  if (loading) return <div style={{ padding: '4rem', textAlign: 'center', color: '#6B7280' }}>Loading…</div>;
  if (notFound || !report) return (
    <div style={{ padding: '4rem', textAlign: 'center' }}>
      <p style={{ color: '#ef4444', fontWeight: 600 }}>Report not found.</p>
      <button onClick={() => navigate(-1)} style={backBtn}>← Go back</button>
    </div>
  );

  const sev    = SEV[report.severity]    ?? { label: 'Unknown', color: '#6B7280', bg: '#F9FAFB' };
  const status = STATUS[report.status]   ?? { label: 'Unknown', color: '#6B7280' };
  const isOwnReport = parseInt(user.id ?? '-1') === report.reporterId;

  return (
    <div style={{ maxWidth: '820px', margin: '0 auto', padding: '1.5rem 1rem', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      <button onClick={() => navigate(-1)} style={backBtn}>← Back</button>

      {/* Report header */}
      <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '12px', padding: '1.75rem 2rem', marginBottom: '1.25rem', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
          <h1 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, color: '#111' }}>{report.title}</h1>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ padding: '0.25rem 0.75rem', borderRadius: '20px', background: sev.bg, color: sev.color, fontWeight: 700, fontSize: '0.78rem' }}>{sev.label}</span>
            <span style={{ padding: '0.25rem 0.75rem', borderRadius: '20px', background: '#F3F4F6', color: status.color, fontWeight: 700, fontSize: '0.78rem' }}>{status.label}</span>
          </div>
        </div>

        {report.description && (
          <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'inherit', fontSize: '0.92rem', color: '#374151', lineHeight: 1.7, background: '#F9FAFB', padding: '1rem', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
            {report.description}
          </pre>
        )}

        {/* Company status actions */}
        {isCompany && (
          <div style={{ marginTop: '1.25rem', display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
            {[
              { s: 2, label: 'Mark Triaged',  bg: '#3b82f6' },
              { s: 3, label: 'Accept',        bg: '#16a34a' },
              { s: 4, label: 'Mark Fixed',    bg: '#0ea5e9' },
              { s: 5, label: 'Mark Rewarded', bg: '#8b5cf6' },
              { s: 6, label: 'Reject',        bg: '#dc2626' },
            ].filter(a => a.s !== report.status).map(a => (
              <button key={a.s} disabled={statusSaving} onClick={() => handleStatusChange(a.s)}
                style={{ padding: '0.4rem 1rem', background: a.bg, color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer', opacity: statusSaving ? 0.6 : 1 }}>
                {a.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Feedback thread */}
      <div style={{ background: '#fff', border: '1px solid #E5E7EB', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #F3F4F6', background: '#F9FAFB' }}>
          <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: '#111' }}>Feedback & Messages</h2>
        </div>

        <div style={{ padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', minHeight: '80px', maxHeight: '420px', overflowY: 'auto' }}>
          {comments.length === 0 ? (
            <p style={{ margin: 'auto', color: '#9CA3AF', fontSize: '0.88rem', textAlign: 'center', padding: '1.5rem 0' }}>No messages yet.</p>
          ) : comments.map(c => {
            const fromReporter = c.authorId === report.reporterId;
            const mine = parseInt(user.id ?? '-1') === c.authorId;
            const alignRight = mine;

            return (
              <div key={c.id} style={{ display: 'flex', flexDirection: 'column', alignItems: alignRight ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '75%', padding: '0.65rem 1rem',
                  borderRadius: alignRight ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                  background: alignRight ? '#3F3AFC' : fromReporter ? '#F3F4F6' : '#EEF2FF',
                  color: alignRight ? '#fff' : '#111',
                  fontSize: '0.88rem', lineHeight: 1.5,
                }}>
                  <p style={{ margin: '0 0 0.25rem', fontWeight: 700, fontSize: '0.72rem', opacity: 0.7 }}>
                    {mine ? 'You' : fromReporter ? 'Reporter' : 'Company Feedback'}
                  </p>
                  <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{c.content}</p>
                </div>
                <span style={{ fontSize: '0.68rem', color: '#9CA3AF', marginTop: '0.2rem' }}>{fmt(c.createdAt)}</span>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        {/* Can company always comment? Yes. Can hacker comment on their own report? Yes. */}
        {(isCompany || isOwnReport) && (
          <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid #F3F4F6', background: '#FAFAFA' }}>
            {!isCompany && (
              <p style={{ margin: '0 0 0.5rem', fontSize: '0.78rem', color: '#6B7280' }}>Reply to company feedback or add more context to your report.</p>
            )}
            {isCompany && (
              <p style={{ margin: '0 0 0.5rem', fontSize: '0.78rem', color: '#6B7280' }}>Leave feedback for the reporter — they will see this message on their report.</p>
            )}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <textarea
                value={text}
                onChange={e => setText(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleSend(); }}
                placeholder={isCompany ? 'Write feedback for the hacker…' : 'Write a message…'}
                rows={3}
                style={{ flex: 1, padding: '0.6rem 0.85rem', border: '1px solid #D1D5DB', borderRadius: '8px', fontSize: '0.88rem', fontFamily: 'inherit', resize: 'vertical', outline: 'none' }}
              />
              <button onClick={handleSend} disabled={sending || !text.trim()}
                style={{ alignSelf: 'flex-end', padding: '0.6rem 1.25rem', background: sending || !text.trim() ? '#D1D5DB' : '#3F3AFC', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, fontSize: '0.88rem', cursor: sending || !text.trim() ? 'not-allowed' : 'pointer' }}>
                {sending ? '…' : 'Send'}
              </button>
            </div>
            {sendError && <p style={{ color: '#ef4444', fontSize: '0.8rem', margin: '0.3rem 0 0' }}>{sendError}</p>}
            <p style={{ margin: '0.3rem 0 0', fontSize: '0.72rem', color: '#9CA3AF' }}>Ctrl+Enter to send</p>
          </div>
        )}
      </div>
    </div>
  );
};

const backBtn: React.CSSProperties = {
  marginBottom: '1.25rem', padding: '0.4rem 1rem',
  background: 'transparent', color: '#3F3AFC',
  border: '1.5px solid #3F3AFC', borderRadius: '8px',
  cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem',
};

export default ReportDetail;
