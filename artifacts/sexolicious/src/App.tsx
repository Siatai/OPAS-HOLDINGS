import React, { useState, useEffect } from "react";
import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { wagmiConfig } from "@/lib/wagmi";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { WalletProvider } from "@/components/WalletContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Home from "@/pages/Home";
import CityPage from "@/pages/CityPage";
import Portfolio from "@/pages/Portfolio";
import Marketplace from "@/pages/Marketplace";
import Dashboard from "@/pages/Dashboard";
import Withdraw from "@/pages/Withdraw";
import Pitch from "@/pages/Pitch";
import AssetDetail from "@/pages/AssetDetail";
import NotFound from "@/pages/not-found";
import LoaderScreen from "@/components/LoaderScreen";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LockKeyhole } from "lucide-react";

const queryClient = new QueryClient();
const ACCESS_PASSWORD = "Saturday1!1";

function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (password === ACCESS_PASSWORD) {
      onUnlock();
      return;
    }

    setError(true);
    setPassword("");
  }

  return (
    <main className="dark relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-5 text-foreground">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,hsl(var(--primary)/0.14),transparent_42%)]" />
      <div className="relative w-full max-w-md rounded-xl border border-white/10 bg-card/90 p-7 shadow-2xl backdrop-blur-xl sm:p-10">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 flex size-12 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary">
            <LockKeyhole className="size-5" aria-hidden="true" />
          </div>
          <p className="mb-3 text-xs uppercase tracking-[0.35em] text-primary">Private access</p>
          <h1 className="font-display text-3xl tracking-wide">OPAS Holdings</h1>
          <p className="mt-3 text-sm text-muted-foreground">Enter the password to continue.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="site-password" className="mb-2 block text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Password
            </label>
            <Input
              id="site-password"
              type="password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                if (error) setError(false);
              }}
              autoComplete="current-password"
              autoFocus
              required
              aria-invalid={error}
              aria-describedby={error ? "password-error" : undefined}
              className="h-12 border-white/10 bg-black/20 px-4"
            />
            {error && (
              <p id="password-error" role="alert" className="mt-2 text-sm text-destructive">
                Incorrect password. Please try again.
              </p>
            )}
          </div>
          <Button type="submit" className="h-12 w-full uppercase tracking-[0.16em]">
            Enter
          </Button>
        </form>
      </div>
    </main>
  );
}

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [location]);
  return null;
}

function Shell() {
  const [location] = useLocation();
  const immersive = location.replace(/\/+$/, "") === "/pitch";
  return (
    <>
      <ScrollToTop />
      {!immersive && <Navbar />}
      <main className="flex-1 w-full min-w-0 max-w-full overflow-x-hidden">
        <Router />
      </main>
      {!immersive && <Footer />}
    </>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/city/:cityId" component={CityPage} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/portfolio" component={Portfolio} />
      <Route path="/marketplace" component={Marketplace} />
      <Route path="/asset/:assetId" component={AssetDetail} />
      <Route path="/withdraw" component={Withdraw} />
      <Route path="/pitch" component={Pitch} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [unlocked, setUnlocked] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (loaded) window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [loaded]);

  if (!unlocked) {
    return <PasswordGate onUnlock={() => setUnlocked(true)} />;
  }

  return (
    <WagmiProvider config={wagmiConfig}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WalletProvider>
          <>
            <div style={{ visibility: loaded ? 'visible' : 'hidden', opacity: loaded ? 1 : 0, transition: 'opacity 0.3s' }} className="dark min-h-screen w-full max-w-full overflow-x-hidden bg-background text-foreground flex flex-col selection:bg-primary/30 selection:text-primary-foreground">
              <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
                <Shell />
              </WouterRouter>
            </div>
            {!loaded && <LoaderScreen onComplete={() => setLoaded(true)} />}
            <Toaster />
          </>
        </WalletProvider>
      </TooltipProvider>
    </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
