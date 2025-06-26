import './NotFoundPage.css';
import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div className="notfound-wrapper">
      <h1 className="notfound-title">404</h1>
      <p className="notfound-text">
        The page you’re looking for doesn’t exist.
      </p>
      <Link to="/" className="notfound-button">
        Go back home
      </Link>
    </div>
  );
}

export default NotFoundPage;
