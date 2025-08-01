import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, Globe, Check } from "lucide-react";
import { TrainWithXLogo } from "@/components/TrainWithXLogo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SiInstagram, SiX, SiYoutube } from "react-icons/si";
import { useSmartNavigate } from "@frontend/hooks/useSmartNavigate";

export function Footer() {
  const { goPublic } = useSmartNavigate();

  return (
    <footer className="bg-muted/30 border-t pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4">
            <div className="flex justify-center md:justify-start">
              <TrainWithXLogo size="md" showText={true} />
            </div>
            <p className="text-sm text-muted-foreground text-center md:text-left">
              Transform your fitness journey with expert-designed training plans
              from top creators worldwide
            </p>
          </div>
          {/* Desktop layout */}
          <div className="hidden md:block">
            <h3 className="font-semibold mb-4">Platform</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <button
                  onClick={() => goPublic("/plans")}
                  className="hover:text-primary transition-colors"
                >
                  Browse Plans
                </button>
              </li>
              <li>
                <button
                  onClick={() => goPublic("/creators")}
                  className="hover:text-primary transition-colors"
                >
                  Find Creators
                </button>
              </li>
              <li>
                <button
                  onClick={() => goPublic("/become-creator")}
                  className="hover:text-primary transition-colors"
                >
                  Become a Creator
                </button>
              </li>
              <li>
                <button
                  onClick={() => goPublic("/register")}
                  className="hover:text-primary transition-colors"
                >
                  Sign Up
                </button>
              </li>
            </ul>
          </div>

          <div className="hidden md:block">
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <button
                  onClick={() => goPublic("/faq")}
                  className="hover:text-primary transition-colors bg-transparent border-none p-0 m-0 cursor-pointer text-left"
                >
                  FAQ
                </button>
              </li>
              <li>
                <button
                  onClick={() => goPublic("/help-center")}
                  className="hover:text-primary transition-colors bg-transparent border-none p-0 m-0 cursor-pointer text-left"
                >
                  Help Center
                </button>
              </li>
              <li>
                <button
                  onClick={() => goPublic("/contact")}
                  className="hover:text-primary transition-colors bg-transparent border-none p-0 m-0 cursor-pointer text-left"
                >
                  Contact Us
                </button>
              </li>
            </ul>
          </div>

          <div className="hidden md:block">
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    goPublic("/terms-of-service");
                  }}
                  className="hover:text-primary transition-colors cursor-pointer"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    goPublic("/privacy-policy");
                  }}
                  className="hover:text-primary transition-colors cursor-pointer"
                >
                  Privacy Policy
                </a>
              </li>

              <li>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    goPublic("/cookie-policy");
                  }}
                  className="hover:text-primary transition-colors cursor-pointer"
                >
                  Cookie Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    goPublic("/creator-agreement");
                  }}
                  className="hover:text-primary transition-colors cursor-pointer"
                >
                  Creator Agreement
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Mobile collapsible layout */}
        <div className="md:hidden space-y-4 mb-8">
          <Collapsible>
            <CollapsibleTrigger className="flex w-full justify-between items-center py-2 font-semibold">
              Platform
              <ChevronDown className="h-4 w-4" />
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-2">
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <button
                    onClick={() => goPublic("/plans")}
                    className="hover:text-primary transition-colors"
                  >
                    Browse Plans
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => goPublic("/creators")}
                    className="hover:text-primary transition-colors"
                  >
                    Find Creators
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => goPublic("/become-creator")}
                    className="hover:text-primary transition-colors"
                  >
                    Become a Creator
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => goPublic("/register")}
                    className="hover:text-primary transition-colors"
                  >
                    Sign Up
                  </button>
                </li>
              </ul>
            </CollapsibleContent>
          </Collapsible>

          <Collapsible>
            <CollapsibleTrigger className="flex w-full justify-between items-center py-2 font-semibold">
              Support
              <ChevronDown className="h-4 w-4" />
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-2">
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <button
                    onClick={() => goPublic("/faq")}
                    className="hover:text-primary transition-colors bg-transparent border-none p-0 m-0 cursor-pointer text-left"
                  >
                    FAQ
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => goPublic("/help-center")}
                    className="hover:text-primary transition-colors bg-transparent border-none p-0 m-0 cursor-pointer text-left"
                  >
                    Help Center
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => goPublic("/contact")}
                    className="hover:text-primary transition-colors bg-transparent border-none p-0 m-0 cursor-pointer text-left"
                  >
                    Contact Us
                  </button>
                </li>
              </ul>
            </CollapsibleContent>
          </Collapsible>

          <Collapsible>
            <CollapsibleTrigger className="flex w-full justify-between items-center py-2 font-semibold">
              Legal
              <ChevronDown className="h-4 w-4" />
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-2">
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      goPublic("/terms-of-service");
                    }}
                    className="hover:text-primary transition-colors cursor-pointer"
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      goPublic("/privacy-policy");
                    }}
                    className="hover:text-primary transition-colors cursor-pointer"
                  >
                    Privacy Policy
                  </a>
                </li>

                <li>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      goPublic("/cookie-policy");
                    }}
                    className="hover:text-primary transition-colors cursor-pointer"
                  >
                    Cookie Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      goPublic("/creator-agreement");
                    }}
                    className="hover:text-primary transition-colors cursor-pointer"
                  >
                    Creator Agreement
                  </a>
                </li>
              </ul>
            </CollapsibleContent>
          </Collapsible>
        </div>

        <div className="border-t pt-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center items-center gap-4 sm:gap-0">
            <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-1">
              <p className="text-sm text-foreground font-medium">
                © 2025 TrainWithX™. All rights reserved.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <a
                href="https://www.instagram.com/trainwithx_app"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <SiInstagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <SiYoutube className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <SiX className="h-5 w-5" />
              </a>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                  <Globe className="h-5 w-5" />
                  <span className="text-sm">English</span>
                  <ChevronDown className="h-3 w-3" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-background border border-border shadow-lg">
                  <DropdownMenuItem className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    English
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-muted-foreground">
                    Spanish
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-muted-foreground">
                    French
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-muted-foreground">
                    German
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
