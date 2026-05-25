"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth/client";

type Props = { email: string; redirectTo: string };

type Status = "idle" | "submitting" | "resending";

export function VerifyEmailForm({ email, redirectTo }: Props) {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const handleVerify = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus("submitting");
    setError(null);
    setInfo(null);
    const { data, error: verifyError } = await authClient.emailOtp.verifyEmail({
      email,
      otp,
    });
    setStatus("idle");
    if (verifyError) {
      setError(verifyError.message ?? "Neplatný kód.");
      return;
    }
    if (data?.status) {
      router.replace(redirectTo);
      router.refresh();
    }
  };

  const handleResend = async () => {
    setStatus("resending");
    setError(null);
    setInfo(null);
    const { error: resendError } =
      await authClient.emailOtp.sendVerificationOtp({
        email,
        type: "email-verification",
      });
    setStatus("idle");
    if (resendError) {
      setError(resendError.message ?? "Nepodařilo se znovu odeslat kód.");
      return;
    }
    setInfo("Nový kód odeslán. Zkontroluj schránku.");
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Ověření emailu</CardTitle>
        <CardDescription>
          Zaslali jsme 6-místný kód na <strong>{email}</strong>. Zadej ho níže
          pro dokončení registrace.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleVerify} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="otp">Ověřovací kód</Label>
            <Input
              id="otp"
              name="otp"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={8}
              required
              value={otp}
              onChange={(event) => setOtp(event.target.value.trim())}
              placeholder="123456"
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          {info && <p className="text-sm text-muted-foreground">{info}</p>}
          <div className="flex items-center justify-between gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleResend}
              disabled={status !== "idle"}
            >
              {status === "resending" ? "Odesílám…" : "Odeslat znovu"}
            </Button>
            <Button
              type="submit"
              disabled={status !== "idle" || otp.length < 4}
            >
              {status === "submitting" ? "Ověřuji…" : "Ověřit"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
