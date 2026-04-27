import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import MainLayout from './layout/MainLayout';

// Guards
import ProtectedRoute from './components/ProtectedRoute';
import RoleBasedRoute from './components/RoleBasedRoute';

// Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import BountyList from './pages/BountyList';
import BountyDetail from './pages/BountyDetail';
import Leaderboard from './pages/Leaderboard';
import SubmitReport from './pages/SubmitReport';
import MySubmissions from './pages/MySubmissions';
import CompanyDashboard from './pages/CompanyDashboard';
import AddProject from './pages/AddProject';
import ViewReports from './pages/ViewReports';
import AdminPanel from './pages/AdminPanel';
import Profile from './pages/Profile';
import ContactSupport from './pages/ContactSupport';
import SupportRequests from './pages/SupportRequests';
import ChooseRole from './pages/ChooseRole';
import CompanyApply from './pages/CompanyApply';
import CompanyProfilePage from './pages/CompanyProfilePage';
import PublicUserProfile from './pages/PublicHackerProfile';
import PublicCompanyPage from './pages/PublicCompanyPage';
import ReportDetail from './pages/ReportDetail';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/choose-role" element={<ChooseRole />} />
        <Route path="/company/apply" element={<CompanyApply />} />
        <Route path="/contact-us" element={<Navigate to="/support" replace />} />
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Navigate to="/bounties" replace />} />
          <Route path="/activity" element={<Dashboard />} />
          <Route path="/bounties" element={<BountyList />} />
          <Route path="/bounties/:id" element={<BountyDetail />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          {/* Public profile routes */}
          <Route path="/u/:username" element={<PublicUserProfile />} />
          <Route path="/programs/:handle" element={<PublicCompanyPage />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/support" element={<ContactSupport />} />
            <Route path="/report/:id" element={<ReportDetail />} />

            {/* User Routes */}
            <Route element={<RoleBasedRoute allowedRoles={['user']} />}>
              <Route path="/submit" element={<SubmitReport />} />
              <Route path="/my-submissions" element={<MySubmissions />} />
            </Route>

            {/* Company Routes */}
            <Route element={<RoleBasedRoute allowedRoles={['company']} />}>
              <Route path="/company/dashboard" element={<CompanyDashboard />} />
              <Route path="/company/profile" element={<CompanyProfilePage />} />
              <Route path="/company/add-project" element={<AddProject />} />
              <Route path="/company/reports" element={<ViewReports />} />
            </Route>

            {/* Admin Routes */}
            <Route element={<RoleBasedRoute allowedRoles={['admin']} />}>
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/admin/support" element={<SupportRequests />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
