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
      id: "platform-overview",
      title: "Platform Overview",
      icon: Globe,
    },
    { id: "eligibility", title: "Eligibility", icon: UserCheck },
    { id: "account-types", title: "Account Types", icon: Users },
    { id: "purchases", title: "Purchases and Payments", icon: CreditCard },
    { id: "content", title: "Content Ownership and Licensing", icon: FileText },
    { id: "support", title: "Support and Customer Service", icon: Shield },
    { id: "conduct", title: "User Conduct", icon: AlertCircle },
    { id: "health", title: "Health Disclaimer", icon: AlertCircle },
    { id: "taxes", title: "Taxes and Compliance", icon: Scale },
    { id: "privacy", title: "Privacy and Data", icon: Shield },
    { id: "termination", title: "Content Removal and Termination", icon: AlertCircle },
    {
      id: "platform-status",
      title: "Platform Status Notice",
      icon: Globe,
    },
    {
      id: "disclaimers",
      title: "Liability and Disclaimers",
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
              <span className="font-semibold">Last Updated: 05/08/2025</span>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              These Terms of Service ("Terms") govern your use of the TrainWithX platform ("TrainWithX", "Platform", "we", "us", or "our"), operated by <strong>Petar Kovachovski</strong>, an individual based in the Republic of North Macedonia.
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
                  <section id="platform-overview" className="mb-12">
                    <h2 className="text-2xl font-bold mb-4 text-foreground">
                      1. Platform Overview
                    </h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      TrainWithX provides access to premium fitness content in the form of training plans created by certified fitness professionals ("Creators"). All training plans are sold and fulfilled by TrainWithX.
                    </p>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      We are the <strong>sole vendor and Merchant of Record</strong> for all purchases made through the Platform. Customers interact <strong>only with TrainWithX</strong> when purchasing content.
                    </p>
                    <div className="bg-accent/50 p-4 rounded-lg">
                      <p className="text-muted-foreground">
                        <strong>TrainWithX is not a marketplace.</strong> Creators do not sell directly to users or receive payments from users. Instead, they license their content to TrainWithX, which handles all sales, fulfillment, and customer service.
                      </p>
                    </div>
                  </section>

                  <Separator className="my-8" />

                  <section id="eligibility" className="mb-12">
                    <h2 className="text-2xl font-bold mb-4 text-foreground">
                      2. Eligibility
                    </h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      You may use TrainWithX if you are at least <strong>13 years old</strong>. If you are under 18, you must use the Platform only with the involvement and consent of a parent or legal guardian.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      By using the Platform, you confirm that you meet these requirements.
                    </p>
                  </section>

                  <Separator className="my-8" />

                  <section id="account-types" className="mb-12">
                    <h2 className="text-2xl font-bold mb-4 text-foreground">
                      3. Account Types
                    </h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      There are two types of accounts on TrainWithX:
                    </p>
                    <div className="space-y-4">
                      <div className="bg-accent/50 p-4 rounded-lg">
                        <h3 className="font-semibold text-foreground mb-2">
                          Users:
                        </h3>
                        <p className="text-muted-foreground">
                          Can browse, purchase, and access training plans, leave reviews, and upload an avatar.
                        </p>
                      </div>
                      <div className="bg-accent/50 p-4 rounded-lg">
                        <h3 className="font-semibold text-foreground mb-2">
                          Creators:
                        </h3>
                        <p className="text-muted-foreground">
                          Verified professionals who license their content to TrainWithX under a separate <strong>Creator Agreement</strong>. Creators do not sell to users directly and are not vendors on the Platform.
                        </p>
                      </div>
                    </div>
                  </section>

                  <Separator className="my-8" />

                  <section id="purchases" className="mb-12">
                    <h2 className="text-2xl font-bold mb-4 text-foreground">
                      4. Purchases and Payments
                    </h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      All training plans on TrainWithX are sold by <strong>TrainWithX</strong> as the <strong>sole vendor</strong>.
                    </p>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      Purchases are processed securely by <strong>Paddle</strong>, our authorized payment processor and Merchant of Record. Paddle handles billing, invoicing, and tax collection on our behalf.
                    </p>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      By purchasing through our Platform, you also agree to Paddle's <a
                        href="https://www.paddle.com/legal/checkout-buyer-terms"
                        className="text-primary hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Checkout Buyer Terms
                      </a>.
                    </p>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      You will receive access to your purchased plan immediately after successful payment.
                    </p>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      All payments are <strong>one-time</strong>, and access is retained <strong>for as long as the Platform is operational</strong>.
                    </p>
                    <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-lg">
                      <p className="text-muted-foreground">
                        <strong>All sales are final. We do not offer refunds.</strong>
                      </p>
                    </div>
                  </section>

                  <Separator className="my-8" />

                  <section id="content" className="mb-12">
                    <h2 className="text-2xl font-bold mb-4 text-foreground">
                      5. Content Ownership and Licensing
                    </h2>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                      <li>
                        <strong>Creators retain full ownership</strong> of their original training content (e.g., videos, plans, instructions).
                      </li>
                      <li>
                        <strong>Creators grant TrainWithX a commercial license</strong> to sell and distribute their content under our brand.
                      </li>
                      <li>
                        <strong>TrainWithX is solely responsible</strong> for sales, delivery, and support.
                      </li>
                      <li>
                        <strong>Users are granted a non-transferable license</strong> to access purchased plans for personal use only.
                      </li>
                    </ul>
                    <p className="text-muted-foreground leading-relaxed mt-4">
                      You may not reproduce, share, or redistribute any content without permission.
                    </p>
                  </section>

                  <Separator className="my-8" />

                  <section id="support" className="mb-12">
                    <h2 className="text-2xl font-bold mb-4 text-foreground">
                      6. Support and Customer Service
                    </h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      All customer service is handled by <strong>TrainWithX</strong>.
                    </p>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      Creators are not responsible for handling user issues or processing refunds.
                    </p>
                    <div className="bg-primary/10 border border-primary/20 p-4 rounded-lg">
                      <p className="text-muted-foreground">
                        For support, contact: <a
                          href="mailto:support@trainwithx.com"
                          className="text-primary hover:underline"
                        >
                          support@trainwithx.com
                        </a>
                      </p>
                    </div>
                  </section>

                  <Separator className="my-8" />

                  <section id="conduct" className="mb-12">
                    <h2 className="text-2xl font-bold mb-4 text-foreground">
                      7. User Conduct
                    </h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      You agree not to:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                      <li>Violate any applicable laws</li>
                      <li>Upload or submit harmful, offensive, or illegal content</li>
                      <li>Infringe upon intellectual property rights</li>
                      <li>Attempt to disrupt the Platform or gain unauthorized access</li>
                      <li>Use bots, scrapers, or automated tools</li>
                    </ul>
                    <p className="text-muted-foreground leading-relaxed mt-4">
                      We reserve the right to suspend or terminate accounts that violate these Terms.
                    </p>
                  </section>

                  <Separator className="my-8" />

                  <section id="health" className="mb-12">
                    <h2 className="text-2xl font-bold mb-4 text-foreground">
                      8. Health Disclaimer
                    </h2>
                    <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-lg">
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        TrainWithX does not provide medical, fitness, or dietary advice.
                        All training plans are designed by independent professionals.
                      </p>
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        <strong>Always consult a qualified health professional before beginning any new fitness program.</strong>
                      </p>
                      <p className="text-muted-foreground leading-relaxed">
                        You use the Platform <strong>at your own risk</strong> and agree that TrainWithX is <strong>not liable for any injuries, health issues, or damages</strong> resulting from use of the content.
                      </p>
                    </div>
                  </section>

                  <Separator className="my-8" />

                  <section id="taxes" className="mb-12">
                    <h2 className="text-2xl font-bold mb-4 text-foreground">
                      9. Taxes and Compliance
                    </h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      All sales are subject to applicable taxes (e.g., VAT), which are collected and processed by <strong>Paddle</strong> as our Merchant of Record.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      TrainWithX complies with all relevant tax, consumer, and ecommerce regulations. Users are not responsible for any tax reporting on purchases made through the Platform.
                    </p>
                  </section>

                  <Separator className="my-8" />

                  <section id="privacy" className="mb-12">
                    <h2 className="text-2xl font-bold mb-4 text-foreground">
                      10. Privacy and Data
                    </h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      Your use of the Platform is governed by our <strong>Privacy Policy</strong> (to be provided), which describes how we collect, store, and use personal data. We also use cookies to improve user experience, as outlined in our <strong>Cookie Policy</strong> (to be provided).
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      We comply with applicable data protection laws and allow users to request data deletion at any time.
                    </p>
                  </section>

                  <Separator className="my-8" />

                  <section id="termination" className="mb-12">
                    <h2 className="text-2xl font-bold mb-4 text-foreground">
                      11. Content Removal and Termination
                    </h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      TrainWithX reserves the right to:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                      <li>Remove any content at our sole discretion</li>
                      <li>Suspend or terminate any account for violations of these Terms</li>
                      <li>Modify or discontinue the Platform at any time, without liability</li>
                    </ul>
                    <p className="text-muted-foreground leading-relaxed mt-4">
                      You may request deletion of your account and associated data (excluding purchase history) by contacting us at <a
                        href="mailto:legal@trainwithx.com"
                        className="text-primary hover:underline"
                      >
                        legal@trainwithx.com
                      </a>.
                    </p>
                  </section>

                  <Separator className="my-8" />

                  <section id="platform-status" className="mb-12">
                    <h2 className="text-2xl font-bold mb-4 text-foreground">
                      12. Platform Status Notice
                    </h2>
                    <div className="bg-accent/50 p-4 rounded-lg">
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        TrainWithX is currently in its <strong>Minimum Viable Product (MVP)</strong> stage.
                      </p>
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        While we aim for reliability, users may encounter occasional bugs or limited functionality.
                      </p>
                      <p className="text-muted-foreground leading-relaxed">
                        By using the Platform, you acknowledge and accept this status.
                      </p>
                    </div>
                  </section>

                  <Separator className="my-8" />

                  <section id="disclaimers" className="mb-12">
                    <h2 className="text-2xl font-bold mb-4 text-foreground">
                      13. Liability and Disclaimers
                    </h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      To the maximum extent permitted by law:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                      <li>TrainWithX is provided "as is" and "as available"</li>
                      <li>
                        We make no guarantees about the accuracy, availability, or performance of the Platform
                      </li>
                      <li>
                        We are not liable for any damages, losses, or injuries arising from your use of the Platform or content
                      </li>
                    </ul>
                  </section>

                  <Separator className="my-8" />

                  <section id="disputes" className="mb-12">
                    <h2 className="text-2xl font-bold mb-4 text-foreground">
                      14. Dispute Resolution
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                      All disputes shall be resolved via <strong>binding arbitration</strong>, unless otherwise required by law.
                      You waive your right to participate in any class action or jury trial.
                    </p>
                  </section>

                  <Separator className="my-8" />

                  <section id="governing" className="mb-12">
                    <h2 className="text-2xl font-bold mb-4 text-foreground">
                      15. Governing Law
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                      These Terms are governed by the laws of the <strong>Republic of North Macedonia</strong>.
                      All legal proceedings must be brought in North Macedonia unless arbitration applies.
                    </p>
                  </section>

                  <Separator className="my-8" />

                  <section id="contact" className="mb-12">
                    <h2 className="text-2xl font-bold mb-4 text-foreground">
                      16. Contact
                    </h2>
                    <div className="bg-primary/10 border border-primary/20 p-6 rounded-lg">
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        For questions, support, or legal matters, contact:
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
