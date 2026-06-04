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
import { AnimatePresence } from "framer-motion";

const queryClient = new QueryClient();

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
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (loaded) window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [loaded]);

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
