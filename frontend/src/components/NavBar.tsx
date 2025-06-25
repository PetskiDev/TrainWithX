import { useAuth } from '@frontend/context/AuthContext';
import { Link } from 'react-router-dom';
import './NavBar.css';

function NavBar() {
  const { username, logout } = useAuth();      // include logout if you have it

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="logo">
          <img src="/logo/logo_whiteX.png" alt="TrainWithX Logo" />
        </Link>

        <div className="nav-links">
          <Link to="/plans">Plans</Link>
          <Link to="/">Creators</Link>
        </div>

        {!username ? (
          <Link to="/login" className="login-btn">
            Login
          </Link>
        ) : (
          <button className="user-btn" onClick={logout}>
            {username}
          </button>
        )}
      </nav>

      <div style={{ height: '72px' }} />
    </>
  );
}

export default NavBar;
