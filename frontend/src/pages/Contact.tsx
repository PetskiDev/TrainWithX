import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const ContactUs = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: "",
    reason: "",
    customReason: "",
    message: "",
  });

  const contactReasons = [
    "General Inquiry",
    "Technical Support",
    "Billing Question",
    "Report a Bug",
    "Creator Application",
    "Partnership Opportunity",
    "Other",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/v1/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to send message");

      toast({
        title: "Message Sent",
        description: "We'll get back to you within 24 hours.",
      });

      setFormData({
        email: "",
        reason: "",
        customReason: "",
        message: "",
      });
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="border-border/40">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              Contact Us
            </CardTitle>
            <CardDescription className="text-lg">
              Have a question or need help? We're here to assist you.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-base font-medium">
                  Email Address *
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                  className="h-12"
                />
                <p className="text-sm text-muted-foreground">
                  We'll use this email to respond to your inquiry.
                </p>
              </div>

              {/* Reason Dropdown */}
              <div className="space-y-2">
                <Label htmlFor="reason" className="text-base font-medium">
                  Reason for Contact *
                </Label>
                <Select
                  value={formData.reason}
                  onValueChange={(value) => handleInputChange("reason", value)}
                  required
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select a reason for your inquiry" />
                  </SelectTrigger>
                  <SelectContent>
                    {contactReasons.map((reason) => (
                      <SelectItem key={reason} value={reason}>
                        {reason}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Custom Reason Field */}
              {formData.reason === "Other" && (
                <div className="space-y-2">
                  <Label
                    htmlFor="customReason"
                    className="text-base font-medium"
                  >
                    Please Specify *
                  </Label>
                  <Input
                    id="customReason"
                    type="text"
                    placeholder="Brief description of your inquiry"
                    value={formData.customReason}
                    onChange={(e) =>
                      handleInputChange("customReason", e.target.value)
                    }
                    required={formData.reason === "Other"}
                    className="h-12"
                  />
                </div>
              )}

              {/* Message Field */}
              <div className="space-y-2">
                <Label htmlFor="message" className="text-base font-medium">
                  Message *
                </Label>
                <Textarea
                  id="message"
                  placeholder="Please provide details about your inquiry. The more information you provide, the better we can assist you."
                  value={formData.message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                  required
                  className="min-h-[120px] resize-y"
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full h-12 text-base font-medium"
                disabled={
                  !formData.email ||
                  !formData.reason ||
                  !formData.message ||
                  (formData.reason === "Other" && !formData.customReason)
                }
              >
                Send Message
              </Button>
            </form>

            {/* Contact Information */}
            <div className="mt-8 pt-8 border-t border-border/40">
              <div className="text-center space-y-4">
                <h3 className="text-lg font-semibold">
                  Other Ways to Reach Us
                </h3>
                <div className="space-y-2 text-muted-foreground">
                  <p>
                    <strong>Email:</strong>{" "}
                    <a
                      href="mailto:support@trainwithx.com"
                      className="text-primary hover:underline"
                    >
                      support@trainwithx.com
                    </a>
                  </p>
                  <p>
                    <strong>Legal Inquiries:</strong>{" "}
                    <a
                      href="mailto:legal@trainwithx.com"
                      className="text-primary hover:underline"
                    >
                      legal@trainwithx.com
                    </a>
                  </p>
                  <p className="text-sm">
                    We typically respond within 24 hours during business days.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ContactUs;
