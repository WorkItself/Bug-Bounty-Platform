import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
// Import your real pages here
import Dashboard from './pages/Dashboard'; 

// --- REMAINING PLACEHOLDERS ---
// We will move these to /pages one by one as we build them
const BountyList = () => <div style={{color: 'white'}}><h1>🎯 Active Bounties</h1><p>Browse programs and start hunting.</p></div>;
const SubmitReport = () => <div style={{color: 'white'}}><h1>🛡️ Submit Vulnerability</h1><p>Report a bug securely to the team.</p></div>;
const AdminPanel = () => <div style={{color: 'white'}}><h1>⚙️ Restricted Admin Panel</h1><p>Authorized access only.</p></div>;
const Leaderboard = () => <div style={{color: 'white'}}><h1>🏆 Top Hackers</h1><p>The best of the best.</p></div>;
const KnowledgeBase = () => <div style={{color: 'white'}}><h1>📚 Resources</h1><p>Learn how to hunt.</p></div>;
const Profile = () => <div style={{color: 'white'}}><h1>👤 My Profile</h1><p>Settings and earnings.</p></div>;
const Login = () => <div style={{color: 'white'}}><h1>🔐 Login</h1><p>Enter your credentials.</p></div>;

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="bounties" element={<BountyList />} />
          <Route path="leaderboard" element={<Leaderboard />} />
          <Route path="kb" element={<KnowledgeBase />} />
          <Route path="submit" element={<SubmitReport />} />
          <Route path="my-submissions" element={<div><h1>My Submissions</h1></div>} />
          <Route path="profile" element={<Profile />} />
          <Route path="login" element={<Login />} />
          <Route path="admin" element={<AdminPanel />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;