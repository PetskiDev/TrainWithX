import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage/LandingPage';
import PlansPage from './pages/Plans/PlansPage';
import LoginPage from '@frontend/pages/LoginPage';
import NavBar from '@frontend/components/NavBar';
import RegisterPage from '@frontend/pages/RegisterPage';
import NotFoundPage from '@frontend/pages/NotFoundPage';

function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/plans" element={<PlansPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<NotFoundPage />} /> {/* 404 */}
      </Routes>
    </>
  );
}

export default App;
