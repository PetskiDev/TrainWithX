import { useState } from 'react';
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { User, Settings, LogOut, Menu } from 'lucide-react';

/* ★  Inject your real auth hook / context here ---------------------------- */
import { useAuth } from '@/context/AuthContext';
/* ------------------------------------------------------------------------ */

const Navbar = () => {
  const { user, logout } = useAuth(); // user is null | { … }
  const navigate = useNavigate();
  const location = useLocation();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  /* ---------- helpers --------------------------------------------------- */
  const isActive = (path: string) => location.pathname === path;

  const handleNavClick = (path: string) => {
    navigate(path);
    setIsSheetOpen(false); // close sheet on navigation (mobile)
  };

  const handleLogout = () => {
    logout?.();
    navigate('/');
  };

  /* ---------- NavButton ------------------------------------------------- */
  const NavButton = ({
    path,
    children,
  }: {
    path: string;
    children: React.ReactNode;
  }) => (
    <Button
      variant={isActive(path) ? 'default' : 'ghost'}
      className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
        isActive(path)
          ? 'gradient-bg text-white shadow-lg scale-105'
          : 'hover:gradient-bg hover:text-white hover:scale-105 hover:shadow-md bg-white/80 backdrop-blur-sm border border-purple-200'
      }`}
      onClick={() => handleNavClick(path)}
    >
      {children}
    </Button>
  );

  /* ---------- render ---------------------------------------------------- */
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <TrainWithXLogo size="sm" />
            </Link>
          </div>

          {/* Desktop Navigation Links - Hidden on mobile */}
          <div className="hidden md:flex flex-1 justify-center">
            <div className="flex items-center space-x-2">
              <NavButton path="/plans">Plans</NavButton>
              <NavButton path="/creators">Creators</NavButton>
            </div>
          </div>

          {/* Mobile Hamburger Menu - Centered */}
          <div className="flex md:hidden justify-center absolute left-1/2 transform -translate-x-1/2">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-10 w-10">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="top" className="w-full">
                <SheetHeader>
                  <SheetTitle>Navigation</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col space-y-4 mt-6">
                  <NavButton path="/plans">Plans</NavButton>
                  <NavButton path="/creators">Creators</NavButton>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Auth Section */}
          <div className="flex-shrink-0 w-[118px] flex justify-end">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={undefined}
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
