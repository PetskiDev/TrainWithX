import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
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

import { useAuth } from '@/context/AuthContext';
import { goPublic } from '@frontend/lib/nav';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const handleNavClick = (path: string) => {
    goPublic(path);
    setIsSheetOpen(false);
  };

  const handleLogout = async () => {
    if (!logout) {
      console.error('Logout function is undefined!');
      return;
    }
    console.log('LOGGING OUT');
    await logout();
    goPublic('/');
  };

  const NavButton = ({
    path,
    children,
  }: {
    path: string;
    children: React.ReactNode;
  }) => (
    <Button
      variant={isActive(path) ? 'default' : 'ghost'}
      className={`px-5 py-0 rounded-full transition-all duration-300 ${
        isActive(path)
          ? 'gradient-bg text-white shadow-lg scale-101'
          : 'hover:gradient-bg hover:scale-101 hover:shadow-md bg-white/80 backdrop-blur-sm border border-purple-200'
      }`}
      onClick={() => handleNavClick(path)}
    >
      {children}
    </Button>
  );

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        {/* relative here gives the hamburger a positioning context */}
        <div className="flex h-16 items-center justify-between relative">
          {/* Logo (left) */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <TrainWithXLogo
                size="sm"
                showText // keep the word-mark for normal screens
                className="max-[370px]:[&>span]:text-sm" /* ⬅ hides text < 440 px */
              />
            </Link>
          </div>

          {/* Desktop nav (center, md+) */}
          <div className="hidden md:flex flex-1 absolute inset-0 left-5 justify-center items-center pointer-events-none">
            <div className="flex items-center space-x-2 pointer-events-auto">
              <NavButton path="/plans">Plans</NavButton>
              <NavButton path="/creators">Creators</NavButton>
            </div>
          </div>

          {/* Absolute wrapper keeps the hamburger PERFECTLY centered */}
          <div className="md:hidden pointer-events-none absolute inset-0 flex justify-center items-center">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 pointer-events-auto"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="top" className="w-full">
                <SheetHeader>
                  <SheetTitle>Navigation</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col space-y-4 mt-6 pointer-events-auto">
                  <NavButton path="/plans">Plans</NavButton>
                  <NavButton path="/creators">Creators</NavButton>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Auth / Sign-in (right) */}
          <div className="flex-shrink-0 w-[118px] flex justify-end z-20">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={user.avatarUrl}
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
                  <DropdownMenuItem onClick={() => goPublic('/me')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>My Plans</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => goPublic('/settings')}>
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
                <Button
                  className="max-[370px]:hidden"
                  variant="ghost"
                  onClick={() => goPublic('/login')}
                >
                  Sign In
                </Button>
                <Button
                  className="gradient-bg text-white hover:opacity-90"
                  onClick={() => goPublic('/register')}
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
