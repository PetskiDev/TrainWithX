import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import PlansPage from './pages/PlansPage';
import LoginPage from '@frontend/pages/LoginPage';
import RegisterPage from '@frontend/pages/RegisterPage';
import NotFoundPage from '@frontend/pages/NotFoundPage';
import Me from '@frontend/pages/Me';
import Creators from '@frontend/pages/Creators';
import Creator from '@frontend/pages/Creator';
import { getCreatorSubdomain } from '@frontend/lib/getCreatorSubdomain';
import PlanContentPage from '@frontend/pages/PlanContent';
import CreatePlan from '@frontend/pages/CreatePlan';
import PlanPreview from '@frontend/pages/PlanPreview';
import CreatorDashboard from '@frontend/pages/CreatorDashboard';
import BecomeCreator from '@frontend/pages/BecomeCreator';
import EmailVerificationPage from '@frontend/pages/EmailVerificationPage';
import AdminDashboard from '@frontend/pages/AdminDashboard';

function PublicRoutes() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/plans" element={<PlansPage />} />
        <Route path="/creators" element={<Creators />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/become-creator" element={<BecomeCreator />} />
        <Route path="/email-verification" element={<EmailVerificationPage />} />
        <Route path="/me" element={<Me />} />
        <Route path="/me/creator" element={<CreatorDashboard />} />
        <Route path="/me/creator/create-plan" element={<CreatePlan />} />
        <Route path="*" element={<NotFoundPage />} /> {/* 404 */}
      </Routes>
    </>
  );
}

function CreatorRoutes({ sub }: { sub: string | null }) {
  return (
    <Routes>
      <Route path="/" element={<Creator subdomain={sub} />} />
      <Route path="/:slug" element={<PlanPreview subdomain={sub} />} />{' '}
      <Route
        path="/:slug/content"
        element={<PlanContentPage subdomain={sub} />}
      />
      <Route path="*" element={<h1>{sub}: CREATOR not found</h1>} />
    </Routes>
  );
}

export default function RootRouter() {
  console.log('ROUTER');
  const sub = getCreatorSubdomain();
  return sub ? <CreatorRoutes sub={sub} /> : <PublicRoutes />;
}
