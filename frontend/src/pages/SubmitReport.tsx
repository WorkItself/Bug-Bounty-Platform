import { useSearchParams, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useUser } from '../context/UserContext';
import axiosInstance from '../utils/axiosInstance';
import { Upload, X, ShieldAlert, ChevronLeft, AlertTriangle, CheckCircle2 } from 'lucide-react';

const severityMap: Record<string, number> = { low: 1, medium: 2, high: 3, critical: 4 };

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB
const ALLOWED_TYPES = new Set([
  'image/png', 'image/jpeg', 'image/gif', 'image/webp',
  'application/pdf', 'text/plain', 'text/html',
  'video/mp4', 'video/webm',
]);

const SEVERITIES = [
  { key: 'low',      label: 'Low',      color: '#16a34a', bg: '#F0FDF4', border: '#bbf7d0', desc: 'Minor issues with low impact' },
  { key: 'medium',   label: 'Medium',   color: '#d97706', bg: '#FFFBEB', border: '#fde68a', desc: 'Moderate risk to users or data' },
  { key: 'high',     label: 'High',     color: '#ea580c', bg: '#FFF7ED', border: '#fed7aa', desc: 'Significant exposure or data loss' },
  { key: 'critical', label: 'Critical', color: '#dc2626', bg: '#FEF2F2', border: '#fecaca', desc: 'Severe, immediate risk to systems' },
] as const;

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '0.6rem 0.85rem',
  background: '#fff', border: '1.5px solid #E5E7EB',
  borderRadius: '8px', color: '#111', fontSize: '0.9rem',
  fontFamily: 'inherit', outline: 'none', boxSizing: 'border-box',
  transition: 'border-color 0.15s',
};

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '0.82rem', fontWeight: 700,
  color: '#374151', marginBottom: '0.35rem',
};

const sectionTitle: React.CSSProperties = {
  fontSize: '0.72rem', fontWeight: 700, color: '#9CA3AF',
  textTransform: 'uppercase', letterSpacing: '0.08em',
  margin: '0 0 1rem', paddingBottom: '0.6rem',
  borderBottom: '1px solid #F3F4F6',
};

interface FileError { name: string; reason: string; }

const SubmitReport = () => {
  const [searchParams] = useSearchParams();
  const navigate       = useNavigate();
  const { user }       = useUser();
  const programId      = searchParams.get('programId');
  const fileInputRef   = useRef<HTMLInputElement>(null);

  const [programName, setProgramName] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    vulnerabilityType: '',
    severity: 'medium',
    description: '',
    stepsToReproduce: '',
    impact: '',
    proofOfConcept: '',
  });

  const [files,         setFiles]         = useState<File[]>([]);
  const [fileAddErrors, setFileAddErrors] = useState<string[]>([]);   // client-side validation on add
  const [loading,       setLoading]       = useState(false);
  const [reportError,   setReportError]   = useState('');             // POST /report failed
  const [fileErrors,    setFileErrors]    = useState<FileError[]>([]); // POST /upload failed per file
  const [partialSuccess, setPartialSuccess] = useState(false);         // report saved, but files partially failed
  const [dragOver,      setDragOver]      = useState(false);
  const [titleError,    setTitleError]    = useState('');             // inline error on the title field

  useEffect(() => {
    if (programId) {
      axiosInstance.get(`/program?id=${programId}`)
        .then(res => setProgramName(res.data?.programName ?? null))
        .catch(() => {});
    }
  }, [programId]);

  if (!user.isLoggedIn) {
    return (
      <div style={{ maxWidth: '480px', margin: '4rem auto', textAlign: 'center', padding: '2rem' }}>
        <ShieldAlert size={40} color="#E81C79" style={{ marginBottom: '1rem' }} />
        <h2 style={{ color: '#111', marginBottom: '0.5rem' }}>Login required</h2>
        <p style={{ color: '#6B7280', marginBottom: '1.5rem' }}>You need to be logged in to submit a vulnerability report.</p>
        <button onClick={() => navigate('/login')} style={{ padding: '0.65rem 1.5rem', background: '#3F3AFC', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}>
          Go to Login
        </button>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'title') setTitleError('');
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addFiles = (incoming: FileList | null) => {
    if (!incoming) return;
    const valid: File[]   = [];
    const errors: string[] = [];

    Array.from(incoming).forEach(f => {
      if (files.find(x => x.name === f.name && x.size === f.size)) return; // duplicate — skip silently
      if (f.size > MAX_FILE_SIZE) {
        errors.push(`"${f.name}" is too large — ${(f.size / 1024 / 1024).toFixed(1)} MB (max 20 MB)`);
      } else if (!ALLOWED_TYPES.has(f.type)) {
        errors.push(`"${f.name}" — file type not allowed (${f.type || 'unknown type'}). Allowed: PNG, JPG, GIF, WEBP, PDF, TXT, HTML, MP4, WEBM`);
      } else {
        valid.push(f);
      }
    });

    setFileAddErrors(errors);
    if (valid.length) setFiles(prev => [...prev, ...valid]);
  };

  const removeFile = (i: number) => {
    setFiles(prev => prev.filter((_, idx) => idx !== i));
    setFileAddErrors([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!programId) { setReportError('No program selected. Go back and open a program first.'); return; }

    // Reset all errors
    setReportError('');
    setTitleError('');
    setFileErrors([]);
    setPartialSuccess(false);
    setLoading(true);

    // ── Step 1: create the report ──────────────────────────────────────
    let reportId: number | null = null;
    try {
      const res = await axiosInstance.post('/report', {
        title:       formData.title,
        description: buildDescription(),
        severity:    severityMap[formData.severity],
        status:      1,
        programId:   parseInt(programId),
        reporterId:  parseInt(user.id ?? '0'),
      });
      reportId = res.data?.id ?? null;
    } catch (err: any) {
      const msg: string = err.response?.data?.message ?? err.response?.data ?? 'Failed to submit report.';
      // Surface duplicate-title error directly on the title field
      if (msg.toLowerCase().includes('same title')) {
        setTitleError('A report with this title already exists for this program. Please use a unique title.');
      } else {
        setReportError(msg);
      }
      setLoading(false);
      return;
    }

    // ── Step 2: upload attachments ─────────────────────────────────────
    if (reportId && files.length > 0) {
      const errors: FileError[] = [];

      for (const file of files) {
        try {
          const fd = new FormData();
          fd.append('file', file);
          await axiosInstance.post(`/upload/${reportId}`, fd, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
        } catch (err: any) {
          const raw: string = err.response?.data?.message ?? err.response?.data ?? 'Upload failed.';
          // Make backend messages more user-friendly
          let reason = raw;
          if (raw.toLowerCase().includes('exceeds maximum'))  reason = `File is too large (max 20 MB)`;
          if (raw.toLowerCase().includes('not allowed'))      reason = `File type is not supported. Allowed: PNG, JPG, GIF, WEBP, PDF, TXT, HTML, MP4, WEBM`;
          if (raw.toLowerCase().includes('no file'))          reason = `File was empty or missing`;
          errors.push({ name: file.name, reason });
        }
      }

      if (errors.length > 0) {
        setFileErrors(errors);
        setPartialSuccess(true); // report was saved — let user know
        setLoading(false);
        return;
      }
    }

    setLoading(false);
    navigate('/my-submissions');
  };

  const buildDescription = () =>
    [
      formData.description,
      formData.vulnerabilityType ? `\n\n**Type:** ${formData.vulnerabilityType}` : '',
      formData.stepsToReproduce  ? `\n\n**Steps to Reproduce:**\n${formData.stepsToReproduce}` : '',
      formData.impact            ? `\n\n**Impact:**\n${formData.impact}` : '',
      formData.proofOfConcept    ? `\n\n**Proof of Concept:**\n${formData.proofOfConcept}` : '',
    ].join('');

  const card: React.CSSProperties = {
    background: '#fff', border: '1px solid #E5E7EB',
    borderRadius: '12px', padding: '1.5rem',
    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
    marginBottom: '1rem',
  };

  // ── Partial-success state (report saved, some files failed) ──────────
  if (partialSuccess) {
    return (
      <div style={{ maxWidth: '600px', margin: '3rem auto', padding: '0 1rem', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
        <div style={{ ...card, textAlign: 'center', padding: '2rem' }}>
          <CheckCircle2 size={40} color="#16a34a" style={{ marginBottom: '0.75rem' }} />
          <h2 style={{ margin: '0 0 0.4rem', color: '#111' }}>Report submitted!</h2>
          <p style={{ margin: '0 0 1.5rem', color: '#6B7280', fontSize: '0.9rem' }}>Your report was saved successfully, but the following attachments could not be uploaded:</p>

          <div style={{ background: '#FFF7ED', border: '1px solid #fed7aa', borderRadius: '8px', padding: '1rem', textAlign: 'left', marginBottom: '1.5rem' }}>
            {fileErrors.map((fe, i) => (
              <div key={i} style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start', marginBottom: i < fileErrors.length - 1 ? '0.6rem' : 0 }}>
                <AlertTriangle size={15} color="#ea580c" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <p style={{ margin: '0 0 0.1rem', fontSize: '0.85rem', fontWeight: 700, color: '#111' }}>{fe.name}</p>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#ea580c' }}>{fe.reason}</p>
                </div>
              </div>
            ))}
          </div>

          <p style={{ margin: '0 0 1.25rem', fontSize: '0.82rem', color: '#9CA3AF' }}>You can add attachments later from the report detail page.</p>
          <button onClick={() => navigate('/my-submissions')} style={{ padding: '0.65rem 1.5rem', background: '#3F3AFC', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem' }}>
            View My Submissions
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '780px', margin: '0 auto', padding: '1.5rem 1rem', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>

      {/* Header */}
      <button onClick={() => navigate(-1)} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', marginBottom: '1.25rem', padding: '0.35rem 0.85rem', background: 'transparent', border: '1.5px solid #E5E7EB', borderRadius: '7px', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600, color: '#374151' }}>
        <ChevronLeft size={14} /> Back
      </button>

      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ margin: '0 0 0.25rem', fontSize: '1.5rem', fontWeight: 800, color: '#111', letterSpacing: '-0.02em' }}>
          Submit Vulnerability Report
        </h1>
        {programName ? (
          <p style={{ margin: 0, color: '#6B7280', fontSize: '0.9rem' }}>
            Reporting for program: <strong style={{ color: '#3F3AFC' }}>{programName}</strong>
          </p>
        ) : (
          <p style={{ margin: 0, color: '#6B7280', fontSize: '0.9rem' }}>Fill in all required fields carefully and honestly.</p>
        )}
      </div>

      <form onSubmit={handleSubmit}>

        {/* Section 1 — Basic Info */}
        <div style={card}>
          <p style={sectionTitle}>Basic Information</p>

          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>Vulnerability Title *</label>
            <input
              type="text" name="title" value={formData.title} onChange={handleChange}
              placeholder="e.g., SQL Injection in Login Form" required
              style={{ ...inputStyle, borderColor: titleError ? '#dc2626' : '#E5E7EB' }}
              onFocus={e => { if (!titleError) e.target.style.borderColor = '#3F3AFC'; }}
              onBlur={e =>  { if (!titleError) e.target.style.borderColor = '#E5E7EB'; }}
            />
            {titleError && (
              <p style={{ margin: '0.3rem 0 0', fontSize: '0.78rem', color: '#dc2626', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <AlertTriangle size={12} /> {titleError}
              </p>
            )}
          </div>

          <div>
            <label style={labelStyle}>Vulnerability Type *</label>
            <input
              type="text" name="vulnerabilityType" value={formData.vulnerabilityType} onChange={handleChange}
              placeholder="e.g., SQL Injection, XSS, IDOR, CSRF" required
              style={inputStyle}
              onFocus={e => (e.target.style.borderColor = '#3F3AFC')}
              onBlur={e =>  (e.target.style.borderColor = '#E5E7EB')}
            />
          </div>
        </div>

        {/* Section 2 — Severity */}
        <div style={card}>
          <p style={sectionTitle}>Severity Level *</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.6rem' }}>
            {SEVERITIES.map(s => {
              const active = formData.severity === s.key;
              return (
                <button key={s.key} type="button" onClick={() => setFormData(prev => ({ ...prev, severity: s.key }))}
                  style={{ padding: '0.75rem 0.5rem', border: `2px solid ${active ? s.color : s.border}`, borderRadius: '10px', cursor: 'pointer', textAlign: 'center', background: active ? s.bg : '#fff', transition: 'all 0.15s', boxShadow: active ? `0 0 0 3px ${s.color}22` : 'none' }}>
                  <p style={{ margin: '0 0 0.2rem', fontWeight: 800, fontSize: '0.88rem', color: s.color }}>{s.label}</p>
                  <p style={{ margin: 0, fontSize: '0.68rem', color: active ? s.color : '#9CA3AF', lineHeight: 1.3 }}>{s.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 3 — Technical Details */}
        <div style={card}>
          <p style={sectionTitle}>Technical Details</p>

          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>Description *</label>
            <p style={{ margin: '0 0 0.4rem', fontSize: '0.76rem', color: '#9CA3AF' }}>Explain what the vulnerability is and where it exists.</p>
            <textarea name="description" value={formData.description} onChange={handleChange}
              placeholder="Describe the vulnerability in detail…" required rows={4}
              style={{ ...inputStyle, resize: 'vertical' }}
              onFocus={e => (e.target.style.borderColor = '#3F3AFC')}
              onBlur={e =>  (e.target.style.borderColor = '#E5E7EB')} />
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={labelStyle}>Steps to Reproduce *</label>
            <p style={{ margin: '0 0 0.4rem', fontSize: '0.76rem', color: '#9CA3AF' }}>Numbered steps that allow the company to replicate the issue.</p>
            <textarea name="stepsToReproduce" value={formData.stepsToReproduce} onChange={handleChange}
              placeholder={'1. Navigate to…\n2. Enter…\n3. Observe…'} required rows={5}
              style={{ ...inputStyle, resize: 'vertical', fontFamily: 'monospace', fontSize: '0.84rem' }}
              onFocus={e => (e.target.style.borderColor = '#3F3AFC')}
              onBlur={e =>  (e.target.style.borderColor = '#E5E7EB')} />
          </div>

          <div>
            <label style={labelStyle}>Impact Assessment *</label>
            <p style={{ margin: '0 0 0.4rem', fontSize: '0.76rem', color: '#9CA3AF' }}>What data, systems, or users are at risk?</p>
            <textarea name="impact" value={formData.impact} onChange={handleChange}
              placeholder="An attacker could…" required rows={3}
              style={{ ...inputStyle, resize: 'vertical' }}
              onFocus={e => (e.target.style.borderColor = '#3F3AFC')}
              onBlur={e =>  (e.target.style.borderColor = '#E5E7EB')} />
          </div>
        </div>

        {/* Section 4 — PoC + Attachments */}
        <div style={card}>
          <p style={sectionTitle}>Proof of Concept & Attachments</p>

          <div style={{ marginBottom: '1.25rem' }}>
            <label style={labelStyle}>Proof of Concept <span style={{ fontWeight: 400, color: '#9CA3AF' }}>(optional)</span></label>
            <p style={{ margin: '0 0 0.4rem', fontSize: '0.76rem', color: '#9CA3AF' }}>Paste code, a crafted request, or step-by-step exploitation instructions.</p>
            <textarea name="proofOfConcept" value={formData.proofOfConcept} onChange={handleChange}
              placeholder={'curl -X POST https://target.com/login \\\n  -d "username=admin\' OR \'1\'=\'1"'}
              rows={6}
              style={{ ...inputStyle, resize: 'vertical', fontFamily: 'monospace', fontSize: '0.84rem' }}
              onFocus={e => (e.target.style.borderColor = '#3F3AFC')}
              onBlur={e =>  (e.target.style.borderColor = '#E5E7EB')} />
          </div>

          {/* File drop zone */}
          <div>
            <label style={labelStyle}>Attachments <span style={{ fontWeight: 400, color: '#9CA3AF' }}>(optional)</span></label>
            <p style={{ margin: '0 0 0.5rem', fontSize: '0.76rem', color: '#9CA3AF' }}>PNG, JPG, GIF, WEBP, PDF, TXT, HTML, MP4, WEBM — max 20 MB each.</p>
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={e => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files); }}
              style={{ border: `2px dashed ${dragOver ? '#3F3AFC' : '#D1D5DB'}`, borderRadius: '10px', padding: '1.5rem', textAlign: 'center', cursor: 'pointer', background: dragOver ? '#EEF2FF' : '#F9FAFB', transition: 'all 0.15s' }}>
              <Upload size={22} color={dragOver ? '#3F3AFC' : '#9CA3AF'} style={{ marginBottom: '0.4rem' }} />
              <p style={{ margin: '0 0 0.2rem', fontSize: '0.85rem', fontWeight: 600, color: dragOver ? '#3F3AFC' : '#374151' }}>Click to upload or drag & drop</p>
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#9CA3AF' }}>Max 20 MB per file</p>
              <input ref={fileInputRef} type="file" multiple
                accept="image/*,application/pdf,text/plain,text/html,video/mp4,video/webm"
                onChange={e => { addFiles(e.target.files); e.target.value = ''; }}
                style={{ display: 'none' }} />
            </div>

            {/* Client-side validation errors (shown immediately on file add) */}
            {fileAddErrors.length > 0 && (
              <div style={{ marginTop: '0.6rem', background: '#FEF2F2', border: '1px solid #fecaca', borderRadius: '8px', padding: '0.75rem 1rem' }}>
                {fileAddErrors.map((e, i) => (
                  <p key={i} style={{ margin: i > 0 ? '0.35rem 0 0' : 0, fontSize: '0.8rem', color: '#dc2626', display: 'flex', alignItems: 'flex-start', gap: '0.35rem' }}>
                    <AlertTriangle size={13} style={{ flexShrink: 0, marginTop: '2px' }} /> {e}
                  </p>
                ))}
              </div>
            )}

            {/* Accepted files list */}
            {files.length > 0 && (
              <div style={{ marginTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {files.map((f, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.45rem 0.75rem', background: '#F3F4F6', borderRadius: '7px' }}>
                    <span style={{ flex: 1, fontSize: '0.82rem', color: '#374151', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</span>
                    <span style={{ fontSize: '0.72rem', color: '#9CA3AF', flexShrink: 0 }}>{(f.size / 1024).toFixed(0)} KB</span>
                    <button type="button" onClick={() => removeFile(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', padding: '0', lineHeight: 1, flexShrink: 0 }}>
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* General report submission error */}
        {reportError && (
          <div style={{ padding: '0.85rem 1rem', background: '#FEF2F2', border: '1px solid #fecaca', borderRadius: '8px', marginBottom: '1rem', display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
            <AlertTriangle size={16} color="#dc2626" style={{ flexShrink: 0, marginTop: '2px' }} />
            <p style={{ margin: 0, color: '#dc2626', fontSize: '0.85rem', fontWeight: 600 }}>{reportError}</p>
          </div>
        )}

        {/* Submit */}
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button type="submit" disabled={loading}
            style={{ padding: '0.7rem 2rem', background: loading ? '#9CA3AF' : '#3F3AFC', color: '#fff', border: 'none', borderRadius: '9px', fontWeight: 700, fontSize: '0.95rem', cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 0.15s' }}>
            {loading ? (files.length > 0 ? 'Uploading…' : 'Submitting…') : 'Submit Report'}
          </button>
          <button type="button" onClick={() => navigate(-1)}
            style={{ padding: '0.7rem 1.25rem', background: 'transparent', color: '#6B7280', border: '1.5px solid #E5E7EB', borderRadius: '9px', fontWeight: 600, fontSize: '0.88rem', cursor: 'pointer' }}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default SubmitReport;
