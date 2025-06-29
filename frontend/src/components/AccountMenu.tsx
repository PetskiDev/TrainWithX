import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@frontend/context/AuthContext';
import './AccountMenu.css';

function AccountMenu() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigator = useNavigate();
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener('click', handler);
    return () => window.removeEventListener('click', handler);
  }, []);

  return (
    <div className="account-menu" ref={ref}>
      <button className="account-trigger" onClick={() => setOpen((o) => !o)}>
        {user ? user.username : 'Account'} ▾
      </button>

      {open && (
        <div className="account-dropdown">
          {!user ? (
            <>
              <Link to="/login" onClick={() => setOpen(false)}>
                Login
              </Link>
              <Link to="/register" onClick={() => setOpen(false)}>
                Register
              </Link>
            </>
          ) : (
            <>
              <button
                className="dropdown-username"
                onClick={() => {
                  navigator('/me');
                  setOpen(false);
                }}
              >
                {user.username}
              </button>
              <button onClick={logout}>Logout</button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default AccountMenu;
