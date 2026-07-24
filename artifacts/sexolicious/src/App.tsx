import React, { useState, useEffect } from "react";
import "@/password-gate.css";
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
    <main className="password-gate dark">
      <div className="password-gate__glow" aria-hidden="true" />
      <div className="password-gate__grid" aria-hidden="true" />

      <section className="password-gate__panel" aria-labelledby="password-gate-title">
        <span className="password-gate__corner password-gate__corner--tl" aria-hidden="true" />
        <span className="password-gate__corner password-gate__corner--tr" aria-hidden="true" />
        <span className="password-gate__corner password-gate__corner--bl" aria-hidden="true" />
        <span className="password-gate__corner password-gate__corner--br" aria-hidden="true" />

        <div className="password-gate__header">
          <div className="password-gate__lock">
            <span className="password-gate__lock-inner">
              <LockKeyhole className="size-6" aria-hidden="true" />
            </span>
          </div>
          <div className="password-gate__emblem" aria-hidden="true">
            <img src="/opas-logo.png" alt="" />
          </div>
          <p className="password-gate__eyebrow">Private access</p>
          <h1 id="password-gate-title" className="password-gate__wordmark">
            <span>OPAS</span>
            <span>Holdings</span>
          </h1>
          <p className="password-gate__subtitle">Enter the password to continue.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="site-password" className="password-gate__label">
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
              className="password-gate__input"
            />
            {error && (
              <p id="password-error" role="alert" className="password-gate__error">
                Incorrect password. Please try again.
              </p>
            )}
          </div>
          <Button type="submit" className="password-gate__button">
            <span>Enter</span>
          </Button>
        </form>

        <div className="password-gate__footer" aria-hidden="true">
          <span />
          Secure access portal
          <span />
        </div>
      </section>
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
