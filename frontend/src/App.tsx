import { BrowserRouter, Routes, Route } from 'react-router-dom';

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
import Resources from './pages/Resources';
import SubmitReport from './pages/SubmitReport';
import MySubmissions from './pages/MySubmissions';
import CompanyDashboard from './pages/CompanyDashboard';
import AddProject from './pages/AddProject';
import ViewReports from './pages/ViewReports';
import AdminPanel from './pages/AdminPanel';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Notifications from './pages/Notifications';
import Messages from './pages/Messages';
import Analytics from './pages/Analytics';
import ContactSupport from './pages/ContactSupport';
import SupportRequests from './pages/SupportRequests';
import BugBountyBasics from './pages/BugBountyBasics';
import VulnerabilityReporting from './pages/VulnerabilityReporting';
import ToolsUtilities from './pages/ToolsUtilities';
import ForgotPassword from './pages/ForgotPassword';
import ContactUs from './pages/ContactUs';
import ChooseRole from './pages/ChooseRole';
import CompanyApply from './pages/CompanyApply';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/register" element={<Register />} />
        <Route path="/choose-role" element={<ChooseRole />} />
        <Route path="/company/apply" element={<CompanyApply />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/bounties" element={<BountyList />} />
          <Route path="/bounties/:id" element={<BountyDetail />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/kb" element={<Resources />} />
          <Route path="/resources/bug-bounty-basics" element={<BugBountyBasics />} />
          <Route path="/resources/vulnerability-reporting" element={<VulnerabilityReporting />} />
          <Route path="/resources/tools" element={<ToolsUtilities />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/analytics" element={<Analytics />} />

            {/* Hacker Routes */}
            <Route element={<RoleBasedRoute allowedRoles={['user']} />}>
              <Route path="/submit" element={<SubmitReport />} />
              <Route path="/my-submissions" element={<MySubmissions />} />
            </Route>

            {/* Company Routes */}
            <Route element={<RoleBasedRoute allowedRoles={['company']} />}>
              <Route path="/company/dashboard" element={<CompanyDashboard />} />
              <Route path="/company/add-project" element={<AddProject />} />
              <Route path="/company/reports" element={<ViewReports />} />
            </Route>

            {/* Admin Routes */}
            <Route element={<RoleBasedRoute allowedRoles={['admin']} />}>
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/admin/support" element={<SupportRequests />} />
            </Route>
            <Route path="/support" element={<ContactSupport />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
