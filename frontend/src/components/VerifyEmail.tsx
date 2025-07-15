import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrainWithXLogo } from "@/components/TrainWithXLogo";
import { AlertCircle, CheckCircle, Loader2, XCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function VerifyEmail({ token }: { token: string }) {
  const [status, setStatus] = useState<"idle" | "verifying" | "success" | "fail">("idle");
  const [message, setMessage] = useState("");

  const handleVerify = async () => {
    if (!token) return;
    setStatus("verifying");
    try {
      const res = await fetch("/api/v1/auth/email-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setStatus("success");
        setMessage("Your email has been confirmed! You can now log in.");
      } else {
        throw new Error(data.error || "Verification failed");
      }
    } catch (err: any) {
      setStatus("fail");
      setMessage(err.message);
    }
  };

  return (
    <div className="min-h-screen-navbar flex items-center justify-center bg-gradient-to-br from-background to-primary/5 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <TrainWithXLogo size="md" />
          </div>
          <div className="flex justify-center mb-4">
            <div
              className={`p-3 rounded-full ${status === "success"
                ? "bg-green-100"
                : status === "fail"
                  ? "bg-red-100"
                  : status === "verifying"
                    ? "bg-blue-100"
                    : "bg-yellow-100"
                }`}
            >
              {status === "success" ? (
                <CheckCircle className="h-8 w-8 text-green-600" />
              ) : status === "fail" ? (
                <XCircle className="h-8 w-8 text-red-600" />
              ) : status === "verifying" ? (
                <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
              ) : (
                <AlertCircle className="h-8 w-8 text-yellow-600" />
              )}
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">
            {status === "success"
              ? "Email Verified"
              : status === "fail"
                ? "Verification Failed"
                : "Confirm Your Email"}
          </CardTitle>
          <CardDescription>
            {status === "success"
              ? "You're all set!"
              : status === "fail"
                ? "Something went wrong. Please contact support."
                : "Click the button below to verify your email."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {status === "idle" && (
            <Button
              onClick={handleVerify}
              className="w-full gradient-bg text-white hover:opacity-90"
            >
              Confirm Email
            </Button>
          )}

          {status === "success" && (
            <Button className="w-full" asChild>
              <Link to="/login">Go to Login</Link>
            </Button>
          )}

          {status === "fail" && (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setStatus("idle");
                setMessage("");
              }}
            >
              Try Again
            </Button>
          )}

          {message && (
            <p
              className={`text-sm text-center ${status === "fail"
                ? "text-destructive"
                : status === "success"
                  ? "text-green-600"
                  : "text-muted-foreground"
                }`}
            >
              {message}
            </p>
          )}

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
}
