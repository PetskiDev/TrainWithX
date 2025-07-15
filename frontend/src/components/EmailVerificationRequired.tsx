
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrainWithXLogo } from "@/components/TrainWithXLogo";
import { Mail, AlertCircle } from "lucide-react";

const EmailVerificationRequired = () => {

  return (
    <div className="min-h-screen-navbar flex items-center justify-center bg-gradient-to-br from-background to-primary/5 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <TrainWithXLogo size="md" />
          </div>
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-yellow-100 rounded-full">
              <AlertCircle className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Email Verification Required</CardTitle>
          <CardDescription>
            Please verify your email address to complete your registration and sign in to your account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <Mail className="h-12 w-12 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              We've sent a verification link to your email address. Please check your inbox and click the link to verify your account. Please wait for a few minutes before re-sending.
            </p>

            <p className="text-xs text-red-500">
              Didn’t receive it? Just try logging in again — we’ll resend the link automatically. And don’t forget to check your spam folder!
            </p>

          </div>

          <div className="space-y-3">

            <Button
              variant="outline"
              className="w-full"
              asChild
            >
              <Link to="/login">
                Back to Sign In
              </Link>
            </Button>
          </div>

          <div className="text-center text-sm">
            Need help?{" "}
            <Link to="/contact" className="text-primary hover:underline">
              Contact Support
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailVerificationRequired;
