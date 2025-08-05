import { useState, useEffect } from "react";
import {
  ArrowUp,
  FileText,
  Shield,
  CreditCard,
  UserCheck,
  AlertCircle,
  Globe,
  Mail,
  DollarSign,
  Gavel,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useSmartNavigate } from "@frontend/hooks/useSmartNavigate";

const CreatorAgreement = () => {
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
    { id: "eligibility", title: "Eligibility & Acceptance", icon: UserCheck },
    {
      id: "content-ownership",
      title: "Content Ownership & Licensing",
      icon: FileText,
    },
    { id: "revenue", title: "Revenue Share & Payouts", icon: DollarSign },
    { id: "taxes", title: "Taxes & Legal Responsibility", icon: CreditCard },
    {
      id: "content-standards",
      title: "Content Standards & Compliance",
      icon: AlertCircle,
    },
    { id: "platform-use", title: "Platform Use & Creator Pages", icon: Globe },
    { id: "termination", title: "Termination & Removal", icon: AlertCircle },
    { id: "liability", title: "Liability & Indemnification", icon: Shield },
    { id: "governing", title: "Governing Law & Disputes", icon: Gavel },
    { id: "contact", title: "Contact", icon: Mail },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold pb-4 bg-primary bg-clip-text text-transparent">
              Creator Agreement
            </h1>
            <div className="flex items-center justify-center gap-4 text-muted-foreground mb-6">
              <span className="font-semibold">Effective Date: 25/07/2025 </span>
              <Separator orientation="vertical" className="h-4" />
              <span className="font-semibold">Last Updated: 05/08/2025 </span>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              This Creator Agreement ("Agreement") governs your relationship with TrainWithX ("Platform"), operated by <strong>Petar Kovachovski</strong>, an individual based in North Macedonia. By uploading or offering any content on the Platform as a Creator, you ("Creator", "you") agree to the terms outlined below.
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
                  <section id="eligibility" className="mb-12">
                    <h2 className="text-2xl font-bold mb-4 text-foreground">
                      1. Eligibility & Acceptance
                    </h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      By participating as a Creator on TrainWithX, you confirm that:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                      <li>
                        You have read and agree to this Creator Agreement, our{" "}
                        <button
                          type="button"
                          onClick={() => goPublic("/terms-of-service")}
                          className="text-primary hover:underline bg-transparent border-none p-0 cursor-pointer"
                        >
                          Terms of Service
                        </button>
                        , and{" "}
                        <button
                          type="button"
                          onClick={() => goPublic("/privacy-policy")}
                          className="text-primary hover:underline bg-transparent border-none p-0 cursor-pointer"
                        >
                          Privacy Policy
                        </button>
                        .
                      </li>
                      <li>
                        You are at least 18 years old and legally able to enter into this agreement.
                      </li>
                      <li>
                        The information provided in your public profile is accurate and not misleading.
                      </li>
                      <li>
                        You understand that TrainWithX is <strong>not a marketplace</strong>. All training plans are licensed to and sold by <strong>Petar Kovachovski</strong> (the sole Paddle seller), not directly by you.
                      </li>
                    </ul>
                  </section>

                  <Separator className="my-8" />

                  <section id="content-ownership" className="mb-12">
                    <h2 className="text-2xl font-bold mb-4 text-foreground">
                      2. Content Ownership & Licensing
                    </h2>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
                      <li>
                        You <strong>retain full ownership</strong> of all training plans and media you create and upload.
                      </li>
                      <li>
                        By submitting content to TrainWithX, you grant <strong>Petar Kovachovski</strong> a <strong>non-exclusive, worldwide, royalty-free license</strong> to:
                      </li>
                    </ul>
                    <div className="ml-8 mb-4">
                      <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                        <li>
                          Display, distribute, market, promote, and deliver your content to customers through the Platform.
                        </li>
                        <li>
                          Modify titles, descriptions, and visual assets (e.g. thumbnails) for branding or formatting purposes.
                        </li>
                        <li>
                          Use your public profile (name, photo, bio) in marketing materials for your plans or the Platform.
                        </li>
                      </ul>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      This is a <strong>content licensing agreement</strong>, not a co-selling or reseller arrangement. You do not use Paddle or process transactions.
                    </p>
                  </section>

                  <Separator className="my-8" />

                  <section id="revenue" className="mb-12">
                    <h2 className="text-2xl font-bold mb-4 text-foreground">
                      3. Revenue Share & Payouts
                    </h2>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                      <li>
                        The <strong>standard revenue split</strong> is <strong>70% to Creator, 30% to Platform</strong>, unless a different written agreement exists.
                      </li>
                      <li>
                        Payouts are made <strong>manually by Petar Kovachovski</strong>, not via Paddle.
                      </li>
                      <li>
                        <strong>Payment conditions:</strong>
                      </li>
                    </ul>
                    <div className="ml-8 mb-4">
                      <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                        <li>
                          Paid monthly on the <strong>1st of each month</strong> for balances exceeding <strong>$50 USD</strong>.
                        </li>
                        <li>
                          Early payouts can be requested (if balance ≥ $50) via dashboard or email.
                        </li>
                      </ul>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      <strong>You are not entitled to refunds or chargeback amounts</strong>—all payment processing and refund policies are handled by TrainWithX.
                    </p>
                  </section>

                  <Separator className="my-8" />

                  <section id="taxes" className="mb-12">
                    <h2 className="text-2xl font-bold mb-4 text-foreground">
                      4. Taxes & Legal Responsibility
                    </h2>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                      <li>
                        You are solely responsible for reporting and paying any taxes related to your income from TrainWithX.
                      </li>
                      <li>
                        You are not an employee, agent, or partner of TrainWithX.
                      </li>
                      <li>
                        TrainWithX does not withhold or remit taxes on your behalf.
                      </li>
                    </ul>
                  </section>

                  <Separator className="my-8" />

                  <section id="content-standards" className="mb-12">
                    <h2 className="text-2xl font-bold mb-4 text-foreground">
                      5. Content Standards & Compliance
                    </h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      You agree that your content must:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
                      <li>
                        Be original, safe, and based on your own knowledge or experience
                      </li>
                      <li>
                        Avoid any false, unverified, or misleading health claims
                      </li>
                      <li>
                        Comply with all applicable laws and TrainWithX guidelines
                      </li>
                      <li>
                        Not violate Paddle's <a href="https://www.paddle.com/legal/acceptable-use-policy" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Acceptable Use Policy</a>
                      </li>
                    </ul>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      <strong>Prohibited content includes:</strong>
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
                      <li>
                        Copyright-infringing or plagiarized material
                      </li>
                      <li>
                        Content that promotes illegal activity or discriminatory views
                      </li>
                      <li>
                        Dangerous or deceptive health/nutrition advice
                      </li>
                    </ul>
                    <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-lg">
                      <p className="text-muted-foreground leading-relaxed">
                        <strong>TrainWithX reserves the right to remove your content or terminate your account</strong> if it violates these terms or harms the platform's reputation or compliance status.
                      </p>
                    </div>
                  </section>

                  <Separator className="my-8" />

                  <section id="platform-use" className="mb-12">
                    <h2 className="text-2xl font-bold mb-4 text-foreground">
                      6. Platform Use & Creator Pages
                    </h2>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                      <li>
                        You may have a <strong>public Creator page</strong> on TrainWithX (e.g. <code>creator.trainwithx.com</code>) to showcase your profile and plans. These pages are <strong>marketing tools only</strong>.
                      </li>
                      <li>
                        <strong>Customers purchase only from TrainWithX</strong>, not from you. You are not operating a separate storefront.
                      </li>
                    </ul>
                  </section>

                  <Separator className="my-8" />

                  <section id="termination" className="mb-12">
                    <h2 className="text-2xl font-bold mb-4 text-foreground">
                      7. Termination & Removal
                    </h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      We may suspend or permanently terminate your creator privileges at our sole discretion, including for:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
                      <li>
                        Violating this Agreement, our TOS, or Paddle's policies
                      </li>
                      <li>
                        Uploading low-quality or harmful content
                      </li>
                      <li>
                        Failing to meet our quality or professionalism standards
                      </li>
                    </ul>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      If terminated:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
                      <li>
                        Your plans will be unpublished or removed
                      </li>
                      <li>
                        Your user account may remain active (if you've purchased other plans)
                      </li>
                    </ul>
                    <p className="text-muted-foreground leading-relaxed">
                      You may request content removal or full termination at any time by contacting <a href="mailto:legal@trainwithx.com" className="text-primary hover:underline">legal@trainwithx.com</a>.
                    </p>
                  </section>

                  <Separator className="my-8" />

                  <section id="liability" className="mb-12">
                    <h2 className="text-2xl font-bold mb-4 text-foreground">
                      8. Liability & Indemnification
                    </h2>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
                      <li>
                        You are solely responsible for the content you upload and its impact.
                      </li>
                      <li>
                        You agree to <strong>indemnify and hold harmless</strong> Petar Kovachovski and TrainWithX from any claims, liabilities, or damages arising out of your content, profile, or conduct on the Platform.
                      </li>
                    </ul>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      TrainWithX is not liable for:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                      <li>
                        Inaccuracies in your training advice
                      </li>
                      <li>
                        Any injury or damage resulting from your plans
                      </li>
                      <li>
                        Third-party claims related to your content
                      </li>
                    </ul>
                  </section>

                  <Separator className="my-8" />

                  <section id="governing" className="mb-12">
                    <h2 className="text-2xl font-bold mb-4 text-foreground">
                      9. Governing Law & Disputes
                    </h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      This Agreement is governed by the laws of the <strong>Republic of North Macedonia</strong>.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      Any disputes will be resolved through <strong>binding arbitration</strong>, not in court.
                    </p>
                  </section>

                  <Separator className="my-8" />

                  <section id="contact" className="mb-12">
                    <h2 className="text-2xl font-bold mb-4 text-foreground">
                      10. Contact
                    </h2>
                    <div className="bg-primary/10 border border-primary/20 p-6 rounded-lg">
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        For questions or legal concerns, contact:
                      </p>
                      <p className="text-muted-foreground leading-relaxed mb-2">
                        <strong>Petar Kovachovski</strong>
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

export default CreatorAgreement;

