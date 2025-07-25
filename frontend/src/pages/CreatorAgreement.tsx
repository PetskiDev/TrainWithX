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
      title: "Content Ownership & License",
      icon: FileText,
    },
    { id: "revenue", title: "Revenue Share & Payouts", icon: DollarSign },
    { id: "taxes", title: "Taxes & Legal Responsibility", icon: CreditCard },
    {
      id: "content-standards",
      title: "Content Standards & Prohibited Activities",
      icon: AlertCircle,
    },
    { id: "termination", title: "Termination", icon: AlertCircle },
    { id: "platform-access", title: "Platform Access & Rights", icon: Globe },
    { id: "liability", title: "Liability & Indemnity", icon: Shield },
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
              <span className="font-semibold">Last Updated: 25/07/2025 </span>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              This Creator Agreement governs your relationship with TrainWithX
              as a Creator. By uploading content on the Platform, you agree to
              these terms.
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
                      By using TrainWithX as a Creator:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                      <li>
                        You agree to this Creator Agreement, our{" "}
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
                        You confirm that all information on your public profile
                        is accurate.
                      </li>
                      <li>
                        You acknowledge that TrainWithX is a{" "}
                        <strong>non-exclusive</strong> platform — you may
                        publish and sell your content elsewhere.
                      </li>
                    </ul>
                  </section>

                  <Separator className="my-8" />

                  <section id="content-ownership" className="mb-12">
                    <h2 className="text-2xl font-bold mb-4 text-foreground">
                      2. Content Ownership & License
                    </h2>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
                      <li>
                        You retain full ownership of all training plans and
                        related materials you upload.
                      </li>
                      <li>
                        By submitting content to TrainWithX, you grant Petar
                        Kovachovski a{" "}
                        <strong>
                          non-exclusive, worldwide, royalty-free license
                        </strong>{" "}
                        to:
                      </li>
                    </ul>
                    <div className="ml-8 mb-4">
                      <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                        <li>
                          Display, distribute, market, promote, and deliver the
                          content through the Platform.
                        </li>
                        <li>
                          Edit plan titles, descriptions, or media (e.g.
                          thumbnails) for formatting or branding purposes.
                        </li>
                      </ul>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      You remain fully liable for the accuracy, legality, and
                      originality of your content.
                    </p>
                  </section>

                  <Separator className="my-8" />

                  <section id="revenue" className="mb-12">
                    <h2 className="text-2xl font-bold mb-4 text-foreground">
                      3. Revenue Share & Payouts
                    </h2>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                      <li>
                        <strong>Standard revenue split:</strong> 70% to Creator,
                        30% to Platform (unless otherwise agreed in writing).
                      </li>
                      <li>
                        Payouts are processed <strong>monthly</strong>, on the{" "}
                        <strong>1st of each month</strong>, if your balance
                        exceeds <strong>$50 USD</strong>.
                      </li>
                      <li>
                        You may also request an early payout via your dashboard
                        or by email if your balance exceeds $50.
                      </li>
                      <li>
                        Payments are processed through <strong>Paddle</strong>,
                        which first sends all funds to Petar Kovachovski, who
                        then distributes Creator payouts.
                      </li>
                    </ul>
                  </section>

                  <Separator className="my-8" />

                  <section id="taxes" className="mb-12">
                    <h2 className="text-2xl font-bold mb-4 text-foreground">
                      4. Taxes & Legal Responsibility
                    </h2>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                      <li>
                        You are <strong>fully responsible</strong> for reporting
                        and paying any taxes related to your income from
                        TrainWithX.
                      </li>
                      <li>
                        You are not considered an employee, agent, or partner of
                        TrainWithX.
                      </li>
                    </ul>
                  </section>

                  <Separator className="my-8" />

                  <section id="content-standards" className="mb-12">
                    <h2 className="text-2xl font-bold mb-4 text-foreground">
                      5. Content Standards & Prohibited Activities
                    </h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      You may not upload content that is:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
                      <li>
                        Plagiarized, copied from others, or violates copyright
                        laws
                      </li>
                      <li>
                        Unsafe, misleading, or makes unverified health claims
                      </li>
                      <li>Discriminatory, offensive, or illegal in any form</li>
                    </ul>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      You are solely responsible for all content you upload and
                      any consequences arising from its use.
                    </p>
                    <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-lg">
                      <p className="text-muted-foreground leading-relaxed">
                        <strong>
                          TrainWithX reserves the right to remove any content or
                          ban creators at its sole discretion
                        </strong>
                        , especially for:
                      </p>
                      <ul className="list-disc pl-6 space-y-1 text-muted-foreground mt-2">
                        <li>Violating these standards</li>
                        <li>Receiving multiple complaints</li>
                        <li>
                          Uploading low-quality, unsafe, or deceptive materials
                        </li>
                      </ul>
                    </div>
                  </section>

                  <Separator className="my-8" />

                  <section id="termination" className="mb-12">
                    <h2 className="text-2xl font-bold mb-4 text-foreground">
                      6. Termination
                    </h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      We may suspend or permanently terminate your creator
                      privileges at any time. If terminated:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                      <li>
                        Your training plans will be removed from the platform.
                      </li>
                      <li>
                        Your regular user account (with previously purchased
                        plans) may remain active unless otherwise stated.
                      </li>
                    </ul>
                  </section>

                  <Separator className="my-8" />

                  <section id="platform-access" className="mb-12">
                    <h2 className="text-2xl font-bold mb-4 text-foreground">
                      7. Platform Access & Rights
                    </h2>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                      <li>
                        You understand that the Platform may change, update, or
                        discontinue features at any time.
                      </li>
                      <li>
                        This agreement does not entitle you to ownership of or
                        compensation for platform technology or branding.
                      </li>
                      <li>
                        We may feature your profile, plans, or reviews in
                        marketing materials unless you opt out in writing.
                      </li>
                    </ul>
                  </section>

                  <Separator className="my-8" />

                  <section id="liability" className="mb-12">
                    <h2 className="text-2xl font-bold mb-4 text-foreground">
                      8. Liability & Indemnity
                    </h2>
                    <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                      <li>
                        TrainWithX is not liable for any harm, loss, or damages
                        resulting from your content.
                      </li>
                      <li>
                        You agree to indemnify and hold harmless Petar
                        Kovachovski and TrainWithX from any claims, losses, or
                        liabilities arising out of your content, profile, or
                        activity on the Platform.
                      </li>
                    </ul>
                  </section>

                  <Separator className="my-8" />

                  <section id="governing" className="mb-12">
                    <h2 className="text-2xl font-bold mb-4 text-foreground">
                      9. Governing Law & Disputes
                    </h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">
                      This Agreement is governed by the laws of the{" "}
                      <strong>Republic of North Macedonia</strong>.
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      Any disputes will be resolved through{" "}
                      <strong>binding arbitration</strong>, not in court.
                    </p>
                  </section>

                  <Separator className="my-8" />

                  <section id="contact" className="mb-12">
                    <h2 className="text-2xl font-bold mb-4 text-foreground">
                      10. Contact
                    </h2>
                    <div className="bg-primary/10 border border-primary/20 p-6 rounded-lg">
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        For support or legal inquiries, contact:
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
