/* ----------------------------------------
 *  src/components/Navbar.tsx               *
 * ------------------------------------- */

import { Link, useLocation, useNavigate } from 'react-router-dom';
import { TrainWithXLogo } from './TrainWithXLogo';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, Settings, LogOut } from 'lucide-react';

/* ★  Inject your real auth hook / context here ---------------------------- */
import { useAuth } from '@/context/AuthContext';
/* ------------------------------------------------------------------------ */

const Navbar = () => {
  const { user, logout } = useAuth(); // user is null | { … }
  const navigate = useNavigate();
  const location = useLocation();

  /* ---------- helpers --------------------------------------------------- */
  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    logout?.(); // in case logout is undefined
    navigate('/'); // send them home afterwards
  };

  /* ---------- render ---------------------------------------------------- */
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* --------- logo --------- */}
          <Link to="/" className="flex items-center">
            <TrainWithXLogo size="sm" />
          </Link>

          {/* --------- primary nav --------- */}
          <div className="hidden md:flex items-center space-x-2">
            <Link to="/plans">
              <Button
                variant={isActive('/plans') ? 'default' : 'ghost'}
                className={`${
                  isActive('/plans')
                    ? 'gradient-bg text-white'
                    : 'hover:gradient-bg hover:text-white'
                } transition-all duration-200`}
              >
                Plans
              </Button>
            </Link>
            <Link to="/creators">
              <Button
                variant={isActive('/creators') ? 'default' : 'ghost'}
                className={`${
                  isActive('/creators')
                    ? 'gradient-bg text-white'
                    : 'hover:gradient-bg hover:text-white'
                } transition-all duration-200`}
              >
                Creators
              </Button>
            </Link>
          </div>

          {/* --------- auth / profile --------- */}
          <div className="flex items-center">
            {user ? (
              /* Signed-in dropdown */
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={undefined} /* <- your field */
                        alt={user.username ?? 'User'}
                      />
                      <AvatarFallback>
                        {user.username?.slice(0, 2).toUpperCase() ?? 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.username ?? 'Account'}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground break-all">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem onClick={() => navigate('/me')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>My Plans</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={() => navigate('/settings')}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              /* Signed-out buttons */
              <div className="flex items-center space-x-2">
                <Button variant="ghost" onClick={() => navigate('/login')}>
                  Sign In
                </Button>
                <Button
                  className="gradient-bg text-white hover:opacity-90"
                  onClick={() => navigate('/register')}
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
