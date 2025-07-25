import { useState, useEffect } from "react";
import {
  ArrowUp,
  FileText,
  Shield,
  Users,
  CreditCard,
  UserCheck,
  AlertCircle,
  Scale,
  Globe,
  Mail,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const TermsOfService = () => {
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
    {
      id: "eligibility",
      title: "Eligibility and Age Requirements",
      icon: UserCheck,
    },
    { id: "registration", title: "Account Registration", icon: Users },
    { id: "account-types", title: "Account Types", icon: Shield },
    { id: "purchases", title: "Purchases and Payment", icon: CreditCard },
    { id: "content", title: "Content Ownership and Licensing", icon: FileText },
    { id: "conduct", title: "User Conduct", icon: AlertCircle },
    { id: "health", title: "Health Disclaimer", icon: AlertCircle },
    {
      id: "availability",
      title: "Availability and Modifications",
      icon: Globe,
    },
    { id: "privacy", title: "Privacy and Data", icon: Shield },
    { id: "third-party", title: "Third-Party Services", icon: Globe },
    { id: "termination", title: "Termination", icon: AlertCircle },
    {
      id: "disclaimers",
      title: "Disclaimers and Limitation of Liability",
      icon: Scale,
    },
    { id: "disputes", title: "Dispute Resolution", icon: Scale },
    { id: "governing", title: "Governing Law", icon: Scale },
    { id: "contact", title: "Contact", icon: Mail },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-4 bg-primary bg-clip-text text-transparent">
              Terms of Service
            </h1>
            <div className="flex items-center justify-center gap-4 text-muted-foreground mb-6">
              <span className="font-semibold">Effective Date: 25/07/2025</span>
              <Separator orientation="vertical" className="h-4" />
              <span className="font-semibold">Last Updated: 25/07/2025</span>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              These Terms of Service govern your access to and use of the
              TrainWithX platform. By using the Platform, you agree to these
              Terms.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="flex gap-8 max-w-7xl mx-auto">
          {/* Table of Contents - Fixed Sidebar */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <div className="top-24">
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
                  <section id="eligibility" className="mb-12">
                    <h2 className="text-2xl font-bold mb-4 text-foreground">
                      1. Eligibility and Age Requirements
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                      You may use TrainWithX if you are at least{" "}
                      <strong>13 years old</strong>. If you are under 18, you
                      may only make purchases or access paid content with the{" "}
                      <strong>
                        involvement and consent of a parent or legal guardian
                      </strong>
                      . By using the Platform, you confirm that you meet these
                      requirements.
                    </p>
                  </section>

                  <Separator className="my-8" />

                  <section id="registration" className="mb-12">
                    <h2 className="text-2xl font-bold mb-4 text-foreground">
                      2. Account Registration
                    </h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      To access certain features, you must create an account.
                      You agree to:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                      <li>
                        Provide accurate and complete information during
                        registration
                      </li>
                      <li>Keep your login credentials secure</li>
                      <li>
                        Be responsible for all activity under your account
                      </li>
                    </ul>
                    <p className="text-muted-foreground leading-relaxed mt-4">
                      You may delete your account at any time by contacting us
                      at{" "}
                      <strong>
                        <a
                          href="mailto:legal@trainwithx.com"
                          className="text-primary hover:underline"
                        >
                          legal@trainwithx.com
                        </a>
                      </strong>
                      . Upon deletion, all personal data will be removed except
                      purchase history, which we retain for accounting purposes.
                    </p>
                  </section>

                  <Separator className="my-8" />

                  <section id="account-types" className="mb-12">
                    <h2 className="text-2xl font-bold mb-4 text-foreground">
                      3. Account Types
                    </h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      There are two types of users on TrainWithX:
                    </p>
                    <div className="space-y-4">
                      <div className="bg-accent/50 p-4 rounded-lg">
                        <h3 className="font-semibold text-foreground mb-2">
                          Regular Users:
                        </h3>
                        <p className="text-muted-foreground">
                          Can browse training plans, make purchases, leave
                          reviews, and upload an avatar.
                        </p>
                      </div>
                      <div className="bg-accent/50 p-4 rounded-lg">
                        <h3 className="font-semibold text-foreground mb-2">
                          Creators:
                        </h3>
                        <p className="text-muted-foreground">
                          Verified users with elevated privileges. Creators can
                          create and upload training plans, manage their own
                          public profile, and are subject to a separate{" "}
                          <strong>Creator Agreement</strong>, which governs
                          compensation, rights, and responsibilities.
                        </p>
                      </div>
                    </div>
                  </section>

                  <Separator className="my-8" />

                  <section id="purchases" className="mb-12">
                    <h2 className="text-2xl font-bold mb-4 text-foreground">
                      4. Purchases and Payment
                    </h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      All purchases made on TrainWithX are{" "}
                      <strong>one-time payments</strong>. Users retain access to
                      purchased content{" "}
                      <strong>
                        for as long as the Platform remains operational
                      </strong>
                      .
                    </p>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      Payments are securely processed by <strong>Paddle</strong>
                      , a third-party payment provider. TrainWithX{" "}
                      <strong>
                        does not store or process any payment information
                        directly
                      </strong>
                      .
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      <strong>
                        All sales are final. No refunds are offered.
                      </strong>
                    </p>
                  </section>

                  <Separator className="my-8" />

                  <section id="content" className="mb-12">
                    <h2 className="text-2xl font-bold mb-4 text-foreground">
                      5. Content Ownership and Licensing
                    </h2>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                      <li>
                        <strong>Creators retain full ownership</strong> of their
                        training plans and uploaded content. TrainWithX acts as
                        a distribution platform only.
                      </li>
                      <li>
                        <strong>Users retain ownership</strong> of their profile
                        and uploaded avatar.
                      </li>
                      <li>
                        By submitting content (e.g. reviews), you grant
                        TrainWithX a non-exclusive, worldwide, royalty-free
                        license to use, display, and reproduce your content for
                        promotional and operational purposes.
                      </li>
                    </ul>
                    <p className="text-muted-foreground leading-relaxed mt-4">
                      You may remove your content at any time through your
                      account settings or by request.
                    </p>
                  </section>

                  <Separator className="my-8" />

                  <section id="conduct" className="mb-12">
                    <h2 className="text-2xl font-bold mb-4 text-foreground">
                      6. User Conduct
                    </h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      By using TrainWithX, you agree not to:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                      <li>Violate any laws or regulations</li>
                      <li>Upload harmful, illegal, or misleading content</li>
                      <li>Infringe on intellectual property rights</li>
                      <li>
                        Use bots, scrapers, or reverse-engineering tools on the
                        Platform
                      </li>
                      <li>
                        Attempt unauthorized access to other accounts or systems
                      </li>
                    </ul>
                    <p className="text-muted-foreground leading-relaxed mt-4">
                      We reserve the right to suspend or terminate accounts that
                      violate these Terms.
                    </p>
                  </section>

                  <Separator className="my-8" />

                  <section id="health" className="mb-12">
                    <h2 className="text-2xl font-bold mb-4 text-foreground">
                      7. Health Disclaimer
                    </h2>
                    <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-lg">
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        TrainWithX does not provide medical, fitness, or
                        nutritional advice. All training content is created and
                        offered by independent Creators. You should consult a
                        healthcare professional before beginning any exercise or
                        nutrition plan. Use of the Platform is{" "}
                        <strong>at your own risk</strong>, and you agree that
                        TrainWithX is{" "}
                        <strong>
                          not liable for any injury, health issue, or adverse
                          effect
                        </strong>{" "}
                        that may result.
                      </p>
                    </div>
                  </section>

                  <Separator className="my-8" />

                  <section id="availability" className="mb-12">
                    <h2 className="text-2xl font-bold mb-4 text-foreground">
                      8. Availability and Modifications
                    </h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      We may modify or discontinue any aspect of the Platform at
                      any time, including removing features or restricting
                      access. We may also update these Terms, and when we do, we
                      will notify users via email or in-app notice.
                    </p>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      Continued use of TrainWithX after changes are made
                      constitutes your acceptance of the revised Terms.
                    </p>

                    <h3 className="font-semibold text-foreground mb-2">
                      Platform Status (MVP Notice)
                    </h3>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      TrainWithX is currently in its early development phase
                      (Minimum Viable Product). While we aim to provide a
                      reliable experience, the Platform may occasionally
                      experience bugs, incomplete features, or downtime.
                    </p>

                    <p className="text-muted-foreground leading-relaxed">
                      By using the Platform, you acknowledge and accept these
                      limitations during this stage.
                    </p>
                  </section>

                  <Separator className="my-8" />

                  <section id="privacy" className="mb-12">
                    <h2 className="text-2xl font-bold mb-4 text-foreground">
                      9. Privacy and Data
                    </h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      Your use of the Platform is subject to our{" "}
                      <strong>Privacy Policy</strong> (to be provided), which
                      explains what personal data we collect, how we use it, and
                      your rights under applicable law.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      We also use cookies to enhance user experience. Our use of
                      cookies will be detailed in a separate{" "}
                      <strong>Cookie Policy</strong>.
                    </p>
                  </section>

                  <Separator className="my-8" />

                  <section id="third-party" className="mb-12">
                    <h2 className="text-2xl font-bold mb-4 text-foreground">
                      10. Third-Party Services
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                      We use <strong>Paddle</strong> as our payment processor.
                      By making a purchase, you also agree to Paddle's{" "}
                      <a
                        href="https://www.paddle.com/legal/checkout-buyer-terms"
                        className="text-primary hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Terms and Conditions
                      </a>{" "}
                      and privacy practices.
                    </p>
                  </section>

                  <Separator className="my-8" />

                  <section id="termination" className="mb-12">
                    <h2 className="text-2xl font-bold mb-4 text-foreground">
                      11. Termination
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                      We reserve the right to suspend or terminate your access
                      to the Platform at our sole discretion, with or without
                      notice, for any violation of these Terms or applicable
                      laws.
                    </p>
                  </section>

                  <Separator className="my-8" />

                  <section id="disclaimers" className="mb-12">
                    <h2 className="text-2xl font-bold mb-4 text-foreground">
                      12. Disclaimers and Limitation of Liability
                    </h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      To the fullest extent permitted by law:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                      <li>TrainWithX is provided "as is" and "as available"</li>
                      <li>
                        We make no guarantees about accuracy, availability, or
                        fitness for a particular purpose
                      </li>
                      <li>
                        We disclaim all liability for user or creator content,
                        and for any harm resulting from reliance on the Platform
                      </li>
                    </ul>
                    <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-lg mt-4">
                      <p className="text-foreground font-semibold">
                        You use TrainWithX at your own risk.
                      </p>
                    </div>
                  </section>

                  <Separator className="my-8" />

                  <section id="disputes" className="mb-12">
                    <h2 className="text-2xl font-bold mb-4 text-foreground">
                      13. Dispute Resolution
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                      Any disputes arising from these Terms or your use of the
                      Platform will be resolved through{" "}
                      <strong>binding arbitration</strong>, and not in court,
                      unless otherwise required by law. You waive any right to a
                      class action or jury trial.
                    </p>
                  </section>

                  <Separator className="my-8" />

                  <section id="governing" className="mb-12">
                    <h2 className="text-2xl font-bold mb-4 text-foreground">
                      14. Governing Law
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                      These Terms are governed by the laws of the{" "}
                      <strong>Republic of North Macedonia</strong>, without
                      regard to its conflict of law provisions. Any legal action
                      must be brought in the courts of North Macedonia, unless
                      arbitration applies.
                    </p>
                  </section>

                  <Separator className="my-8" />

                  <section id="contact" className="mb-12">
                    <h2 className="text-2xl font-bold mb-4 text-foreground">
                      15. Contact
                    </h2>
                    <div className="bg-primary/10 border border-primary/20 p-6 rounded-lg">
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        If you have any questions about these Terms, contact us
                        at:
                      </p>
                      <a
                        href="mailto:legal@trainwithx.com"
                        className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
                      >
                        <Mail className="w-4 h-4" />
                        legal@trainwithx.com
                      </a>
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

export default TermsOfService;
