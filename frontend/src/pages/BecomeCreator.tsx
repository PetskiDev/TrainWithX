import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { TrainWithXLogo } from "@/components/TrainWithXLogo";
import { useAuth } from "@frontend/context/AuthContext";
import type { SendApplicationDTO } from "@shared/types/creator";
import { goPublic } from "@frontend/lib/nav";

const BecomeCreator = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState<SendApplicationDTO>({
    fullName: "",
    subdomain: "",
    specialization: "",
    experience: "",
    bio: "",
    certifications: "",
    socialMedia: "",
    agreeToTerms: false,
    email: "",
  });
  useEffect(() => {
    if (user?.email) {
      setFormData(prev => ({ ...prev, email: user.email }));
    }
  }, [user]);
  if (!user) {
    return <div className="p-4 text-center">
      <p className="text-2xl text-red-600 font-semibold mb-3">
        You must be logged in to apply for a creator.
      </p>
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={() => goPublic('/login')}
      >
        Login
      </button>
    </div>
  }
  if (user.isCreator) {
    return <div className="p-4 text-center">
      <p className="text-xl text-red-600 font-semibold mb-3">
        You are alrady a creator.
      </p>
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={() => goPublic('/me/creator')}
      >
        Go to Dashboard
      </button>
    </div>
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agreeToTerms) {

      toast({
        title: "Terms Required",
        description: "Please agree to the terms and conditions",
        variant: "destructive",
      });
      console.log("TOS")
      return;
    }

    try {
      const payload: SendApplicationDTO = formData;

      const res = await fetch("/api/v1/creators/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Unknown error');
      }

      toast({
        title: "Application Submitted!",
        description: "You'll get a notification once we review it.",
      });

      // reset form
      setFormData({
        ...payload,
        fullName: "",
        subdomain: "",
        specialization: "",
        experience: "",
        bio: "",
        certifications: "",
        socialMedia: "",
        agreeToTerms: false,
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen-navbar bg-gradient-to-br from-background to-muted/20 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <TrainWithXLogo size="lg" showText={false} />
          </div>
          <h1 className="text-4xl font-bold mb-4 text-gradient">Become a Creator</h1>
          <p className="text-lg text-muted-foreground">
            Join our community of fitness professionals and share your expertise with thousands of users
          </p>
        </div>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle>Creator Application</CardTitle>
            <CardDescription>
              Apply to become a TrainWithX creator. Your logged-in account will be reviewed for approval or rejection, and you'll receive notifications about the status.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subdomain">Wanted Subdomain *</Label>
                  <div className="relative">
                    <Input
                      id="subdomain"
                      value={formData.subdomain}
                      onChange={(e) => handleInputChange("subdomain", e.target.value)}
                      placeholder="yourname"
                      className="pr-32"
                      required
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-muted-foreground">
                      .trainwithx.com
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialization">Specialization *</Label>
                <Select onValueChange={(value) => handleInputChange("specialization", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your specialization" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="strength">Strength Training</SelectItem>
                    <SelectItem value="cardio">Cardio & Endurance</SelectItem>
                    <SelectItem value="yoga">Yoga & Flexibility</SelectItem>
                    <SelectItem value="pilates">Pilates</SelectItem>
                    <SelectItem value="crossfit">CrossFit</SelectItem>
                    <SelectItem value="bodybuilding">Bodybuilding</SelectItem>
                    <SelectItem value="powerlifting">Powerlifting</SelectItem>
                    <SelectItem value="calisthenics">Calisthenics</SelectItem>
                    <SelectItem value="martial-arts">Martial Arts</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience">Years of Experience *</Label>
                <Select onValueChange={(value) => handleInputChange("experience", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-2">1-2 years</SelectItem>
                    <SelectItem value="3-5">3-5 years</SelectItem>
                    <SelectItem value="6-10">6-10 years</SelectItem>
                    <SelectItem value="10+">10+ years</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Professional Bio *</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell us about your background, training philosophy, and what makes you unique as a fitness professional..."
                  value={formData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  className="min-h-[120px]"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="certifications">Certifications & Qualifications</Label>
                <Textarea
                  id="certifications"
                  placeholder="List your relevant certifications (e.g., NASM-CPT, ACSM, etc.)"
                  value={formData.certifications}
                  onChange={(e) => handleInputChange("certifications", e.target.value)}
                  className="min-h-[80px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="socialMedia">Social Media Links</Label>
                <Textarea
                  id="socialMedia"
                  placeholder="Share your Instagram, YouTube, TikTok, or website links"
                  value={formData.socialMedia}
                  onChange={(e) => handleInputChange("socialMedia", e.target.value)}
                  className="min-h-[80px]"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={formData.agreeToTerms}
                  onCheckedChange={(checked) =>
                    setFormData(prev => ({ ...prev, agreeToTerms: checked as boolean }))
                  }
                />
                <Label htmlFor="terms" className="text-sm">
                  I agree to the TrainWithX Creator Terms & Conditions and understand that my application will be reviewed *
                </Label>
              </div>

              <Button
                type="submit"
                className="w-full gradient-bg text-white hover:opacity-90"
                size="lg"
              >
                Submit Application
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BecomeCreator;