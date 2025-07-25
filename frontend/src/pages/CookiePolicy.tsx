import { useState, useEffect } from "react";
import {
  ArrowUp,
  FileText,
  Shield,
  Users,
  AlertCircle,
  Mail,
  Settings,
  Database,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const CookiePolicy = () => {
  const [activeSection, setActiveSection] = useState("");
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 300);

      // Update active section based on scroll position
      const sections = document.querySelectorAll("section[id]");
      let current = "";

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 100 && rect.bottom >= 100) {
          current = section.id;
        }
      });

      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const tableOfContents = [
    { id: "what-are-cookies", title: "What Are Cookies?", icon: FileText },
    { id: "what-cookies-we-use", title: "What Cookies We Use", icon: Database },
    {
      id: "no-third-party-tracking",
      title: "No Third-Party Tracking Cookies",
      icon: Shield,
    },
    { id: "managing-cookies", title: "Managing Cookies", icon: Settings },
    { id: "legal-basis", title: "Legal Basis (for EU users)", icon: Users },
    {
      id: "changes-to-policy",
      title: "Changes to This Policy",
      icon: AlertCircle,
    },
    { id: "contact", title: "Contact", icon: Mail },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-4 bg-primary bg-clip-text text-transparent">
              Cookie Policy
            </h1>
            <div className="flex items-center justify-center gap-4 text-muted-foreground mb-6">
              <span className="font-semibold">Effective Date: 25/07/2025</span>
              <Separator orientation="vertical" className="h-4" />
              <span className="font-semibold">Last Updated: 25/07/2025</span>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              This Cookie Policy explains how TrainWithX, operated by Petar
              Kovachovski, uses cookies and similar technologies to enhance your
              experience on our platform.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex gap-8 max-w-7xl mx-auto">
          {/* Table of Contents - Fixed Sidebar */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-24">
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle className="text-lg">Contents</CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                  {tableOfContents.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => scrollToSection(item.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg transition-colors hover:bg-accent ${
                          activeSection === item.id
                            ? "bg-accent text-accent-foreground"
                            : "text-muted-foreground"
                        }`}
                      >
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        <span className="text-sm font-medium">
                          {index + 1}. {item.title}
                        </span>
                      </button>
                    );
                  })}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 max-w-4xl">
            <Card className="border-primary/20">
              <CardContent className="p-8 md:p-12">
                <div className="prose prose-lg max-w-none">
                  <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                    By continuing to use the platform, you agree to our use of
                    cookies as described below. You can manage or delete cookies
                    through your browser settings at any time.
                  </p>

                  <section id="what-are-cookies" className="mb-12">
                    <h2 className="text-2xl font-bold mb-4 text-foreground">
                      1. What Are Cookies?
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                      Cookies are small text files stored on your device when
                      you visit a website. They allow websites to remember your
                      preferences and activity, enabling a smoother and more
                      personalized user experience.
                    </p>
                  </section>

                  <Separator className="my-8" />

                  <section id="what-cookies-we-use" className="mb-12">
                    <h2 className="text-2xl font-bold mb-4 text-foreground">
                      2. What Cookies We Use
                    </h2>
                    <p className="text-muted-foreground leading-relaxed mb-6">
                      TrainWithX uses only essential cookies, specifically for:
                    </p>

                    <div className="space-y-6">
                      <div className="bg-accent/50 p-4 rounded-lg">
                        <h3 className="font-semibold text-foreground mb-2">
                          2.1. Authentication
                        </h3>
                        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                          <li>
                            We use cookies to store your login session using{" "}
                            <strong>JWT (JSON Web Token)</strong>.
                          </li>
                          <li>
                            This enables you to stay logged in securely across
                            sessions.
                          </li>
                        </ul>
                      </div>

                      <div className="bg-accent/50 p-4 rounded-lg">
                        <h3 className="font-semibold text-foreground mb-2">
                          2.2. Cross-Domain Session Sharing
                        </h3>
                        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                          <li>
                            We use cookies to allow session continuity between
                            subdomains (e.g., <code>trainwithx.com</code> and{" "}
                            <code>creator.trainwithx.com</code>) for a better
                            user experience.
                          </li>
                        </ul>
                      </div>
                    </div>
                  </section>

                  <Separator className="my-8" />

                  <section id="no-third-party-tracking" className="mb-12">
                    <h2 className="text-2xl font-bold mb-4 text-foreground">
                      3. No Third-Party Tracking Cookies
                    </h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      We <strong>do not use</strong>:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                      <li>Advertising cookies</li>
                      <li>Behavioral tracking cookies</li>
                      <li>Third-party retargeting or marketing cookies</li>
                    </ul>
                    <p className="text-muted-foreground leading-relaxed mt-4">
                      If this changes in the future (e.g., for analytics or
                      ads), we will update this policy and request user consent
                      where required.
                    </p>
                  </section>

                  <Separator className="my-8" />

                  <section id="managing-cookies" className="mb-12">
                    <h2 className="text-2xl font-bold mb-4 text-foreground">
                      4. Managing Cookies
                    </h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      You can control and delete cookies through your browser
                      settings:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                      <li>Block all cookies</li>
                      <li>Clear cookies after each session</li>
                      <li>Whitelist only trusted websites</li>
                    </ul>
                    <p className="text-muted-foreground leading-relaxed mt-4">
                      <strong>Note:</strong> Disabling cookies may affect the
                      functionality of TrainWithX, including login and content
                      access.
                    </p>
                  </section>

                  <Separator className="my-8" />

                  <section id="legal-basis" className="mb-12">
                    <h2 className="text-2xl font-bold mb-4 text-foreground">
                      5. Legal Basis (for EU users)
                    </h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      Under the General Data Protection Regulation (GDPR), we
                      rely on:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                      <li>
                        <strong>Legitimate interest</strong> for cookies
                        essential to site operation (e.g., authentication)
                      </li>
                      <li>
                        <strong>Consent</strong> only if we ever introduce
                        non-essential cookies (e.g., analytics)
                      </li>
                    </ul>
                  </section>

                  <Separator className="my-8" />

                  <section id="changes-to-policy" className="mb-12">
                    <h2 className="text-2xl font-bold mb-4 text-foreground">
                      6. Changes to This Policy
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                      We may update this Cookie Policy from time to time. If we
                      introduce new types of cookies, you will be notified and
                      asked to consent where required.
                    </p>
                  </section>

                  <Separator className="my-8" />

                  <section id="contact" className="mb-12">
                    <h2 className="text-2xl font-bold mb-4 text-foreground">
                      7. Contact
                    </h2>
                    <div className="bg-primary/10 border border-primary/20 p-6 rounded-lg">
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        For questions about this Cookie Policy, contact:
                      </p>
                      <p className="text-muted-foreground mb-2">
                        <strong>Email:</strong>{" "}
                        <a
                          href="mailto:legal@trainwithx.com"
                          className="text-primary hover:underline"
                        >
                          legal@trainwithx.com
                        </a>
                      </p>
                      <p className="text-muted-foreground mb-2">
                        <strong>Operator:</strong> Petar Kovachovski
                      </p>
                      <p className="text-muted-foreground">
                        <strong>Jurisdiction:</strong> Republic of North
                        Macedonia
                      </p>
                    </div>
                  </section>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      {showBackToTop && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-50 h-12 w-12 rounded-full shadow-lg"
          size="icon"
        >
          <ArrowUp className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
};

export default CookiePolicy;
