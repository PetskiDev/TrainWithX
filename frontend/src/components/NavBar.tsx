import { Link } from 'react-router-dom';
import './NavBar.css';
import AccountMenu from '@frontend/components/AccountMenu';

function NavBar() {
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

        <AccountMenu />
      </nav>

      <div style={{ height: '72px' }} />
    </>
  );
}

export default NavBar;
