import { useEffect, useState } from "react";
import EmailVerificationRequired from "@/components/EmailVerificationRequired";
import VerifyEmail from "@/components/VerifyEmail";

const EmailVerificationPage = () => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const tokenFromUrl = new URLSearchParams(window.location.search).get("token");
    setToken(tokenFromUrl);
  }, []);

  return token ? <VerifyEmail token={token} /> : <EmailVerificationRequired />;
};

export default EmailVerificationPage;
