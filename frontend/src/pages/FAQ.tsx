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
import { useSmartNavigate } from "@frontend/hooks/useSmartNavigate";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const FAQ = () => {
  const { goPublic } = useSmartNavigate();
  const [openQuestions, setOpenQuestions] = useState<number[]>([]);

  const toggleQuestion = (index: number) => {
    setOpenQuestions((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const faqs = [
    {
      question: "How do I sign up or log in?",
      answer:
        "You can register with your email and password or use your Google account to log in quickly and securely.",
    },
    {
      question: "I didn't receive the verification email. What should I do?",
      answer:
        "Check your spam folder first. If it's not there, you can request a new verification email or contact support.",
    },
    {
      question: "Can I use Google login and still set a password?",
      answer:
        "No. Accounts created with Google login do not support password-based login.",
    },
    {
      question: "What payment methods are accepted?",
      answer:
        "We accept all major credit/debit cards and some local payment methods via our secure partner, Paddle.",
    },
    {
      question: "Can I get a refund?",
      answer:
        "We do not offer refunds by default. For special cases (e.g. accidental duplicate purchase), please refer to our Refund Policy or contact us.",
    },
    {
      question: "Where can I find the plans I bought?",
      answer:
        'Log in and go to the "My Plans" section. All your purchased plans are there.',
    },
    {
      question: "Will I lose access to the plans I've purchased?",
      answer:
        "No. You have lifetime access to the training plans you purchase.",
    },
    {
      question: "Can I download the plans?",
      answer:
        "Not at the moment. All plans are accessed through the platform for consistency and security.",
    },
    {
      question: "How do I contact support?",
      answer:
        "Use the contact form on our site. We usually reply within 24 hours.",
    },
    {
      question: "I found a bug or issue. What should I do?",
      answer:
        "Please report it using the contact form, and we'll take care of it.",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Quick answers to common questions about TrainWithX. Need more help?
            <button
              type="button"
              onClick={() => goPublic("/contact")}
              className="text-primary hover:underline ml-1 bg-transparent border-none p-0 cursor-pointer"
            >
              Contact us
            </button>{" "}
            or visit our
            <button
              type="button"
              onClick={() => goPublic("/help-center")}
              className="text-primary hover:underline ml-1 bg-transparent border-none p-0 cursor-pointer"
            >
              Help Center
            </button>
            .
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <Card key={index}>
              <Collapsible
                open={openQuestions.includes(index)}
                onOpenChange={() => toggleQuestion(index)}
              >
                <CollapsibleTrigger className="w-full">
                  <CardHeader className="hover:bg-accent/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-left text-lg font-medium">
                        {faq.question}
                      </CardTitle>
                      <ChevronDown
                        size={20}
                        className={`transition-transform flex-shrink-0 ml-4 ${
                          openQuestions.includes(index) ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-0">
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="mt-16 text-center">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Still have questions?</CardTitle>
              <CardDescription>
                Check our comprehensive Help Center or reach out to our support
                team.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex gap-4 justify-center">
              <button
                type="button"
                onClick={() => goPublic("/help-center")}
                className="inline-flex items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-8 py-2 font-medium transition-colors"
              >
                Help Center
              </button>

              <button
                type="button"
                onClick={() => goPublic("/contact")}
                className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-8 py-2 font-medium transition-colors"
              >
                Contact Support
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
