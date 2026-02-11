import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import Dashboard from './pages/Dashboard'; 
import BountyList from './pages/BountyList';
import SubmitReport from './pages/SubmitReport';
import AdminPanel from './pages/AdminPanel';
import Leaderboard from './pages/Leaderboard';
import Resources from './pages/Resources';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import MySubmissions from './pages/MySubmissions';
import Notifications from './pages/Notifications';
import Messages from './pages/Messages';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="bounties" element={<BountyList />} />
          <Route path="leaderboard" element={<Leaderboard />} />
          <Route path="kb" element={<Resources />} />
          <Route path="submit" element={<SubmitReport />} />
          <Route path="my-submissions" element={<MySubmissions />} />
          <Route path="profile" element={<Profile />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="messages" element={<Messages />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="settings" element={<Settings />} />
          <Route path="admin" element={<AdminPanel />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;