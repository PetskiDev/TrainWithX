import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@frontend/components/ui/button";
import { useSmartNavigate } from "@frontend/hooks/useSmartNavigate";
import {
  ChevronDown,
  Users,
  ShoppingCart,
  Package,
  GraduationCap,
  Shield,
  Settings,
  MessageCircle,
} from "lucide-react";
import { useState } from "react";

const HelpCenter = () => {
  const { goPublic } = useSmartNavigate();
  const [openSections, setOpenSections] = useState<string[]>([]);

  const toggleSection = (sectionId: string) => {
    setOpenSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const helpSections = [
    {
      id: "account",
      title: "Account & Login",
      icon: Users,
      questions: [
        {
          question: "Can I use Google to log in?",
          answer:
            "Yes! You can sign up or log in using your Google account. We never store your Google password — we only access your email, name, and profile picture (if available) to create your account.",
        },
        {
          question: "I signed up with Google, can I use a password later?",
          answer:
            "No. Accounts created with Google login don't support password login for security and consistency. If you wish to switch, please contact support.",
        },
        {
          question: "Why do I need to verify my email?",
          answer:
            "Email verification helps ensure that you own the email address you registered with and allows us to send you important account and purchase-related emails.",
        },
        {
          question:
            "I didn't receive the verification email. What should I do?",
          answer:
            "Check your spam or promotions folder. You can also request another verification email (just try logging in with your credentials). If the problem persists, contact support using the contact form.",
        },
      ],
    },
    {
      id: "purchasing",
      title: "Purchasing & Payments",
      icon: ShoppingCart,
      questions: [
        {
          question: "How do I purchase a training plan?",
          answer:
            "You can purchase any training plan through our secure Paddle-hosted checkout. After payment, the plan will be immediately available in your account.",
        },
        {
          question: "Do I need to create an account to buy a plan?",
          answer:
            "Yes. An account is required so we can securely give you access to your purchased content and track your progress.",
        },
        {
          question: "What payment methods are accepted?",
          answer:
            "Paddle accepts all major credit/debit cards and some local payment methods, depending on your region.",
        },
        {
          question: "Do you offer refunds?",
          answer:
            "Refunds are not offered by default. For exceptions (e.g. accidental duplicate purchases), please contact support.",
        },
      ],
    },
    {
      id: "after-purchase",
      title: "After Purchase",
      icon: Package,
      questions: [
        {
          question: "Where can I find the plans I bought?",
          answer:
            'Log in to your account, and you\'ll see all your purchased plans under the "My Plans" section.',
        },
        {
          question: "Will I lose access to the plan over time?",
          answer:
            "No. Your purchase gives you lifetime access to the plan, unless the platform is shut down or the creator removes the plan (very rare, and you'll be notified in advance).",
        },
        {
          question: "Can I download the training plans?",
          answer:
            "Not currently. All content is accessible via the web only to ensure a consistent experience and to prevent misuse.",
        },
      ],
    },
    {
      id: "creators",
      title: "For Creators",
      icon: GraduationCap,
      questions: [
        {
          question: "How do I become a creator?",
          answer:
            "Submit an application through the platform. If approved, you'll be able to claim a custom subdomain, upload plans, and start earning from day one.",
        },
        {
          question: "How much do creators earn?",
          answer:
            "Creators earn 70% of the revenue from every sale (after Paddle's cut). TrainWithX retains 30% to cover hosting, email, legal, and platform costs.",
        },
        {
          question: "How and when do I get paid?",
          answer:
            "Payouts are sent monthly (on the 1st) for creators who've earned over $50. You can also request a payout early if your balance exceeds $50.",
        },
        {
          question: "Can I sell my plan elsewhere?",
          answer:
            "Yes! You retain full ownership of your content and can sell it on other platforms. We only ask that you don't violate any third-party terms.",
        },
        {
          question: "Can my plan be edited by TrainWithX?",
          answer:
            "We may edit the title, description, or thumbnail slightly for consistency and better presentation — but your workouts, meals, and structure remain untouched.",
        },
        {
          question: "What happens if I violate the rules?",
          answer:
            "Your account may be suspended or terminated. This includes uploading plagiarized content, violating laws, or misrepresenting your expertise.",
        },
      ],
    },
    {
      id: "privacy",
      title: "Privacy & Security",
      icon: Shield,
      questions: [
        {
          question: "What personal data do you collect?",
          answer:
            "We collect only the information necessary to operate the platform — such as your email, name, login info, and purchase data. We do not collect or store payment details (Paddle handles all of that).",
        },
        {
          question: "Do you use cookies?",
          answer:
            "Yes, but only essential cookies are used — mainly to store your login session (JWT token) and temporary redirect info for Google login.",
        },
        {
          question: "Do you sell my data?",
          answer:
            "Never. We do not sell or share your personal data with third parties for advertising or marketing.",
        },
        {
          question: "Can I delete my account?",
          answer:
            "Yes. Contact support to request data deletion. Some data related to purchases may be retained for legal reasons.",
        },
      ],
    },
    {
      id: "technical",
      title: "Technical Questions",
      icon: Settings,
      questions: [
        {
          question: "Is TrainWithX still in beta?",
          answer:
            "Yes. We're currently in our MVP (Minimum Viable Product) phase, which means the platform is still improving. You may occasionally encounter bugs, but we're working hard to improve every day.",
        },
      ],
    },
    {
      id: "support",
      title: "Support & Contact",
      icon: MessageCircle,
      questions: [
        {
          question: "What should I do if I see something inappropriate?",
          answer:
            "Please report any violations, inappropriate content, or technical bugs via the contact form.",
        },
        {
          question: "How can I contact you?",
          answer:
            "Use the contact form on the site — we typically reply within 24 hours.",
        },
      ],
    },
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4"> Help Center </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find answers for questions about TrainWithX. Can't find what you're
            looking for?
            <button
              type="button"
              onClick={() => goPublic("/contact")}
              className="text-primary hover:underline ml-1 bg-transparent border-none p-0 cursor-pointer"
            >
              Contact us
            </button>
            .
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle className="text-lg">Quick Navigation</CardTitle>
                <CardDescription>Jump to a section</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {helpSections.map((section) => {
                  const Icon = section.icon;
                  return (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors text-left"
                    >
                      <Icon size={16} />
                      <span className="text-sm">{section.title}</span>
                    </button>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {helpSections.map((section) => {
              const Icon = section.icon;
              return (
                <Card key={section.id} id={section.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <Icon size={24} />
                      {section.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {section.questions.map((q, index) => (
                      <Collapsible
                        key={index}
                        open={openSections.includes(`${section.id}-${index}`)}
                        onOpenChange={() =>
                          toggleSection(`${section.id}-${index}`)
                        }
                      >
                        <CollapsibleTrigger className="w-full">
                          <div className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent/50 transition-colors">
                            <h3 className="font-medium text-left">
                              {q.question}
                            </h3>
                            <ChevronDown
                              size={16}
                              className={`transition-transform ${
                                openSections.includes(`${section.id}-${index}`)
                                  ? "rotate-180"
                                  : ""
                              }`}
                            />
                          </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <div className="p-4 pt-2 text-muted-foreground">
                            {q.answer}
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    ))}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Footer CTA */}
        <div className="mt-16 text-center">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Still have questions?</CardTitle>
              <CardDescription>
                We're here to help! Reach out to our support team and we'll get
                back to you within 24 hours.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => goPublic("/contact")}
                className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-8 py-2 font-medium transition-colors"
              >
                Contact Support
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HelpCenter;
