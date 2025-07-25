import { useState, useEffect } from "react";
import {
  ArrowUp,
  Shield,
  Users,
  Database,
  Eye,
  Globe,
  Lock,
  Mail,
  Cookie,
  FileX,
  Settings,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useSmartNavigate } from "@frontend/hooks/useSmartNavigate";

const PrivacyPolicy = () => {
  const { goPublic } = useSmartNavigate();
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
      const yOffset = -96; // scroll 80px above the element
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;

      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const tableOfContents = [
    { id: "who-we-are", title: "Who We Are", icon: Users },
    { id: "data-collect", title: "Data We Collect", icon: Database },
    { id: "how-we-use", title: "How We Use Your Data", icon: Eye },
    { id: "third-party", title: "Third-Party Services", icon: Globe },
    { id: "data-storage", title: "Where We Store Your Data", icon: Database },
    { id: "user-rights", title: "User Rights", icon: Shield },
    { id: "data-retention", title: "Data Retention", icon: FileX },
    { id: "cookies", title: "Cookies & Tracking", icon: Cookie },
    { id: "security", title: "Security", icon: Lock },
    { id: "changes", title: "Changes to This Policy", icon: Settings },
    { id: "contact", title: "Contact", icon: Mail },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold pb-4 bg-primary bg-clip-text text-transparent">
              Privacy Policy
            </h1>
            <div className="flex items-center justify-center gap-4 text-muted-foreground mb-6">
              <span className="font-semibold">Effective Date: 25/07/2025</span>
              <Separator orientation="vertical" className="h-4" />
              <span className="font-semibold">Last Updated: 25/07/2025</span>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              This Privacy Policy explains how TrainWithX collects, uses, and
              protects your personal data. We are committed to ensuring your
              privacy and handling your data transparently and securely.
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
                  <div className="mb-8">
                    <p className="text-lg text-muted-foreground leading-relaxed mb-4">
                      This Privacy Policy explains how{" "}
                      <strong>TrainWithX</strong>, operated by{" "}
                      <strong>Petar Kovachovski</strong>, collects, uses, and
                      protects your personal data when you use our platform. We
                      are committed to ensuring your privacy and handling your
                      data transparently and securely.
                    </p>
                    <p className="text-lg text-muted-foreground">
                      If you have any questions, contact us at:{" "}
                      <a
                        href="mailto:legal@trainwithx.com"
                        className="text-primary hover:underline font-semibold"
                      >
                        legal@trainwithx.com
                      </a>
                    </p>
                  </div>

                  <Separator className="my-8" />

                  <section id="who-we-are" className="mb-12">
                    <h2 className="text-2xl font-bold mb-4 text-foreground">
                      1. Who We Are
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                      TrainWithX is a fitness platform connecting users and
                      creators through training plans and personalized content.
                      The platform is operated by Petar Kovachovski, an
                      individual based in the Republic of North Macedonia.
                    </p>
                  </section>

                  <Separator className="my-8" />

                  <section id="data-collect" className="mb-12">
                    <h2 className="text-2xl font-bold mb-4 text-foreground">
                      2. Data We Collect
                    </h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      When you use TrainWithX, we may collect the following
                      information:
                    </p>

                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-3">
                          2.1. User Data
                        </h3>
                        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                          <li>
                            Email address (used for login and account
                            identification)
                          </li>
                          <li>Username (publicly displayed with reviews)</li>
                          <li>Password (only if not using Google login)</li>
                          <li>Avatar image (optional)</li>
                          <li>
                            Account status (active/verified/admin/creator)
                          </li>
                          <li>
                            IP address (logged for security and analytics)
                          </li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-3">
                          2.2. Creator Data
                        </h3>
                        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                          <li>
                            Bio, subdomain, profile image, Instagram handle
                          </li>
                          <li>Years of experience</li>
                          <li>Certifications, specialties, achievements</li>
                          <li>Creator applications and status</li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-3">
                          2.3. Activity Data
                        </h3>
                        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                          <li>
                            Purchases (amount, timestamp, Paddle order ID)
                          </li>
                          <li>Reviews and ratings</li>
                          <li>Workout completions</li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-3">
                          2.4. Authentication
                        </h3>
                        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                          <li>
                            Google OAuth identifier (if using Google login)
                          </li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-foreground mb-3">
                          2.5. Cookies
                        </h3>
                        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                          <li>Authentication cookies</li>
                          <li>
                            Cross-domain session cookies (for smoother user
                            experience)
                          </li>
                        </ul>
                      </div>
                    </div>
                  </section>

                  <Separator className="my-8" />

                  <section id="how-we-use" className="mb-12">
                    <h2 className="text-2xl font-bold mb-4 text-foreground">
                      3. How We Use Your Data
                    </h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      We use your personal data for the following purposes:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-6">
                      <li>
                        To provide access to your account and purchased content
                      </li>
                      <li>
                        To display creator and user profiles (where applicable)
                      </li>
                      <li>To show public reviews and ratings</li>
                      <li>
                        To send important platform notifications (e.g. terms
                        updates)
                      </li>
                      <li>
                        To analyze platform usage and improve functionality
                      </li>
                      <li>
                        To process payments and verify transactions via{" "}
                        <strong>
                          <a
                            href="https://www.paddle.com/legal/checkout-buyer-terms"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Paddle
                          </a>
                        </strong>
                      </li>
                      <li>To comply with tax and legal obligations</li>
                    </ul>

                    <div className="bg-accent/50 border border-accent/20 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold text-foreground mb-3">
                        Marketing & Promotion
                      </h3>
                      <p className="text-muted-foreground leading-relaxed mb-3">
                        We may use publicly visible content — such as user
                        reviews or creator profile information (e.g., name,
                        subdomain, avatar, bio, certifications) — for
                        promotional and marketing purposes, including on our
                        website, social media, or advertisements.
                      </p>
                      <p className="text-muted-foreground leading-relaxed mb-3">
                        We will <strong>never</strong> disclose private data,
                        payment information, or personal communications without
                        explicit consent.
                      </p>
                      <p className="text-muted-foreground leading-relaxed">
                        We do not otherwise use your data for marketing purposes
                        unless explicitly authorized.
                      </p>
                    </div>
                  </section>

                  <Separator className="my-8" />

                  <section id="third-party" className="mb-12">
                    <h2 className="text-2xl font-bold mb-4 text-foreground">
                      4. Third-Party Services
                    </h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      We may share necessary data with third parties for the
                      following purposes:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
                      <li>
                        <strong>Paddle</strong>: For secure payment processing
                        (email, order ID, price)
                      </li>
                      <li>
                        <strong>Google</strong>: For authentication (Google
                        OAuth ID)
                      </li>
                    </ul>
                    <p className="text-muted-foreground leading-relaxed">
                      We may integrate analytics or marketing tools in the
                      future. If we do, this policy will be updated.
                    </p>
                  </section>

                  <Separator className="my-8" />

                  <section id="data-storage" className="mb-12">
                    <h2 className="text-2xl font-bold mb-4 text-foreground">
                      5. Where We Store Your Data
                    </h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      Our backend and database are self-hosted on{" "}
                      <strong>EU-based servers</strong>, though this location
                      may change in the future. All reasonable efforts will be
                      made to keep data within the EU or jurisdictions with
                      adequate data protection.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      Some services (e.g., Paddle) may transfer data to the{" "}
                      <strong>United States</strong> or other jurisdictions. By
                      using TrainWithX, you consent to such international
                      transfers, where necessary, in accordance with applicable
                      data protection laws.
                    </p>
                  </section>

                  <Separator className="my-8" />

                  <section id="user-rights" className="mb-12">
                    <h2 className="text-2xl font-bold mb-4 text-foreground">
                      6. User Rights
                    </h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      You have the following rights regarding your personal
                      data:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
                      <li>
                        <strong>Access</strong> – Request a copy of your stored
                        data
                      </li>
                      <li>
                        <strong>Correction</strong> – Request updates or
                        corrections to your data
                      </li>
                      <li>
                        <strong>Deletion</strong> – Request deletion of your
                        account and personal data
                      </li>
                      <li>
                        <strong>Objection</strong> – Withdraw consent where
                        applicable (e.g., cookies)
                      </li>
                    </ul>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      To exercise these rights, contact us at:{" "}
                      <a
                        href="mailto:legal@trainwithx.com"
                        className="text-primary hover:underline font-semibold"
                      >
                        legal@trainwithx.com
                      </a>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Note: Purchase history may be retained indefinitely for
                      accounting and compliance.
                    </p>
                  </section>

                  <Separator className="my-8" />

                  <section id="data-retention" className="mb-12">
                    <h2 className="text-2xl font-bold mb-4 text-foreground">
                      7. Data Retention
                    </h2>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                      <li>
                        <strong>Purchase records</strong> are retained
                        indefinitely for tax/legal purposes
                      </li>
                      <li>
                        All other data (e.g., profile, reviews, avatar) is
                        deleted upon account deletion request
                      </li>
                    </ul>
                  </section>

                  <Separator className="my-8" />

                  <section id="cookies" className="mb-12">
                    <h2 className="text-2xl font-bold mb-4 text-foreground">
                      8. Cookies & Tracking
                    </h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      We use cookies strictly for:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
                      <li>Authentication</li>
                      <li>
                        Cross-domain session handling for smoother navigation
                      </li>
                    </ul>
                    <p className="text-muted-foreground leading-relaxed">
                      We do <strong>not</strong> use third-party tracking or
                      marketing cookies at this time.
                      <br />
                      <p className="text-muted-foreground leading-relaxed">
                        For more details, refer to{" "}
                        <span
                          onClick={() => goPublic("/cookie-policy")}
                          className="font-semibold underline cursor-pointer"
                        >
                          Cookie Policy
                        </span>
                        .
                      </p>
                    </p>
                  </section>

                  <Separator className="my-8" />

                  <section id="security" className="mb-12">
                    <h2 className="text-2xl font-bold mb-4 text-foreground">
                      9. Security
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                      We take reasonable technical and organizational measures
                      to protect your data against loss, misuse, or unauthorized
                      access. However, no system is fully secure. You are
                      responsible for keeping your login credentials
                      confidential.
                    </p>
                  </section>

                  <Separator className="my-8" />

                  <section id="changes" className="mb-12">
                    <h2 className="text-2xl font-bold mb-4 text-foreground">
                      10. Changes to This Policy
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                      We may update this Privacy Policy from time to time. When
                      we do, we will notify users via email or platform notice.
                      Continued use of the platform constitutes acceptance of
                      the updated policy.
                    </p>
                  </section>

                  <Separator className="my-8" />

                  <section id="contact" className="mb-12">
                    <h2 className="text-2xl font-bold mb-4 text-foreground">
                      11. Contact
                    </h2>
                    <div className="bg-primary/10 border border-primary/20 p-6 rounded-lg">
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        For privacy-related inquiries or data requests, contact:
                      </p>
                      <div className="space-y-2">
                        <p className="text-muted-foreground">
                          <strong>Email:</strong>{" "}
                          <a
                            href="mailto:legal@trainwithx.com"
                            className="text-primary hover:underline font-semibold"
                          >
                            legal@trainwithx.com
                          </a>
                        </p>
                        <p className="text-muted-foreground">
                          <strong>Operator:</strong> Petar Kovachovski
                        </p>
                        <p className="text-muted-foreground">
                          <strong>Jurisdiction:</strong> Republic of North
                          Macedonia
                        </p>
                      </div>
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
          className="fixed bottom-8 right-8 rounded-full w-12 h-12 shadow-lg z-50"
          size="icon"
        >
          <ArrowUp className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
};

export default PrivacyPolicy;
