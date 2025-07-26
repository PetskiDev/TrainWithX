import { Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";

// Eager load critical pages
import LandingPage from "./pages/LandingPage";
import PlansPage from "./pages/PlansPage";
import Creators from "@frontend/pages/Creators";
import Creator from "@frontend/pages/Creator";
import { getCreatorSubdomain } from "@frontend/lib/getCreatorSubdomain";

// Lazy loaded pages
const LoginPage = lazy(() => import("@frontend/pages/LoginPage"));
const RegisterPage = lazy(() => import("@frontend/pages/RegisterPage"));
const NotFoundPage = lazy(() => import("@frontend/pages/NotFoundPage"));
const Me = lazy(() => import("@frontend/pages/Me"));
const PlanContentPage = lazy(() => import("@frontend/pages/PlanContent"));
const PlanPreview = lazy(() => import("@frontend/pages/PlanPreview"));
const CreatorDashboard = lazy(() => import("@frontend/pages/CreatorDashboard"));
const CreatorEdit = lazy(() => import("@frontend/pages/CreatorEdit"));
const CreatePlanPage = lazy(() => import("@frontend/pages/CreatePlanPage"));
const EditPlanPage = lazy(() => import("@frontend/pages/EditPlanPage"));
const AuthRedirectPage = lazy(() => import("@frontend/pages/AuthRedirectPage"));
const EmailVerificationPage = lazy(
  () => import("@frontend/pages/EmailVerificationPage")
);
const BecomeCreator = lazy(() => import("@frontend/pages/BecomeCreator"));
const AdminDashboard = lazy(() => import("@frontend/pages/AdminDashboard"));
const TermsOfService = lazy(() => import("@frontend/pages/TermsOfService"));
const CreatorAgreement = lazy(() => import("@frontend/pages/CreatorAgreement"));
const PrivacyPolicy = lazy(() => import("@frontend/pages/PrivacyPolicy"));
const CookiePolicy = lazy(() => import("@frontend/pages/CookiePolicy"));
const ContactUs = lazy(() => import("@frontend/pages/Contact"));
const HelpCenter = lazy(() => import("@frontend/pages/HelpCenter"));
const FAQ = lazy(() => import("@frontend/pages/FAQ"));

function PublicRoutes() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/plans" element={<PlansPage />} />
        <Route path="/creators" element={<Creators />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/me" element={<Me />} />
        <Route path="/me/creator" element={<CreatorDashboard />} />
        <Route path="/me/creator/edit" element={<CreatorEdit />} />
        <Route path="/me/creator/create-plan" element={<CreatePlanPage />} />
        <Route path="/plans/edit/:planId" element={<EditPlanPage />} />
        <Route path="/auth-redirect" element={<AuthRedirectPage />} />
        <Route path="/email-verification" element={<EmailVerificationPage />} />
        <Route path="/become-creator" element={<BecomeCreator />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/creator-agreement" element={<CreatorAgreement />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/cookie-policy" element={<CookiePolicy />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/help-center" element={<HelpCenter />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}

function CreatorRoutes({ sub }: { sub: string | null }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<Creator subdomain={sub} />} />
        <Route path="/:slug" element={<PlanPreview subdomain={sub} />} />
        <Route
          path="/:slug/content"
          element={<PlanContentPage subdomain={sub} />}
        />
        <Route path="*" element={<h1>{sub}: CREATOR not found</h1>} />
      </Routes>
    </Suspense>
  );
}

export default function RootRouter() {
  const sub = getCreatorSubdomain();
  return sub ? <CreatorRoutes sub={sub} /> : <PublicRoutes />;
}
