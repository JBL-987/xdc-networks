"use client";
import { Button } from "@/components/ui/button";
import NavbarComponents from "@/components/layouts/NavbarComponents";
import { useAuth } from "@/context/AuthContext";
import { useUser } from "@/context/UserContext";


export default function HomePage() {
  const { handleConnect, isLoading } = useAuth();
  const { user } = useUser();

  return (
    <div className="flex flex-col min-h-screen">
      <NavbarComponents />
      <main className="min-h-[calc(100vh-57px-97px)] flex-1">
        <div className="container relative pb-10">
          <section className="mx-auto flex max-w-[980px] flex-col items-center gap-2 py-8 md:py-12 md:pb-8 lg:py-24 lg:pb-6">
            <h1 className="text-center text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:leading-[1.1]">
              Simplify Document Verification with Blockchain-Powered Security
            </h1>
            <span className="max-w-[750px] text-center text-lg font-light text-foreground">
              Say goodbye to fraud and inefficiencies. Experience instant,
              secure, and tamper-proof document verification with our blockchain
              solution
            </span>
            <div className="flex w-full items-center justify-center space-x-4 py-4 md:pb-6">
              <Button
                variant="default"
                onClick={() => {
                  if (!user) {
                    handleConnect();
                  } else {
                    window.location.href = "/create-docs";
                  }
                }}
                disabled={isLoading}
              >
                Create Doc
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  if (!user) {
                    handleConnect();
                  } else {
                    window.location.href = "/verify-docs";
                  }
                }}
                disabled={isLoading}
              >
                Verify Doc
              </Button>
            </div>
          </section>
        </div>
      </main>

      <footer className="py-6 md:py-0 border-t border-border/40">
        <div className="container flex flex-col items-center justify-center gap-4 md:h-24 md:flex-row">
          <p className="text-balance text-center text-sm leading-loose text-muted-foreground">
            &copy; 2024 XDC Network. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
