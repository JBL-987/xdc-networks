"use client";

import React, { createContext, useEffect, useState } from "react";
import NavbarComponents from "@/components/layouts/NavbarComponents";
import { Magic, MagicUserMetadata } from "magic-sdk";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";


const magicApiKey = process.env.NEXT_PUBLIC_MAGIC_API_KEY;
if (!magicApiKey) {
  throw new Error("NEXT_PUBLIC_MAGIC_API_KEY is not defined");
}
const magic = new Magic(magicApiKey);

const signinPage = () => {
  const [user, setUser] = useState<MagicUserMetadata | null>(null);
  const [isMagicReady, setIsMagicReady] = useState(false);
  const [email, setEmail] = useState("");
  const router = useRouter();

  useEffect(() => {
    const initializeMagic = async () => {
      try {
        await magic.preload();
        setIsMagicReady(true);
        const isLoggedIn = await magic.user.isLoggedIn();
        if (isLoggedIn) {
          const userInfo = await magic.user.getInfo();
          setUser(userInfo);
          await authenticateWithBackend(userInfo);
          router.push("/dashboard");
        }
      } catch (err) {
        console.error("Error initializing Magic:", err);
      }
    };
    initializeMagic();
  }, []);

  const handleLogin = async () => {
    if (!isMagicReady) {
      console.error("Magic modal not ready yet. Please wait.");
      return;
    }

    if (!email) {
      alert("Please enter a valid email address.");
      return;
    }

    try {
      // Show alert to check email
      alert("Please check your email to verify.");

      const didToken = await magic.auth.loginWithMagicLink({ email });
      const userInfo = await magic.user.getInfo();
      setUser(userInfo);

      console.log("Logged in with DID token:", didToken);
      await authenticateWithBackend(userInfo);
      router.push("/dashboard");
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  const handleLogout = async () => {
    try {
      await magic.user.logout();
      setUser(null);
      console.log("User logged out");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const authenticateWithBackend = async (userInfo: MagicUserMetadata) => {
    try {
      const didToken = await magic.user.getIdToken();
      const response = await axios.post("http://localhost:5001/auth/verify", {
        email: userInfo.email,
        didToken: didToken
      });
      console.log("Backend authentication response:", response.data);
    } catch (err) {
      console.error("Backend authentication failed:", err);
    }
  };

  return (
    <section>
      <NavbarComponents />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="py-12 md:py-20">
          <div className="mx-auto max-w-[400px]">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-center">
                Welcome Back
              </CardTitle>
            </CardHeader>
            <Card>
              <CardContent>
                <div className="space-y-5 py-5">
                  <div>
                    <Label className="mb-1 block text-sm font-medium">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      className="form-input w-full"
                      placeholder="Your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  {user ? (
                    <Button
                      variant="default"
                      onClick={handleLogout}
                      className="w-full"
                    >
                      Sign out
                    </Button>
                  ) : (
                    <Button
                      variant="default"
                      onClick={handleLogin}
                      className="w-full"
                    >
                      Sign in
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default signinPage;
