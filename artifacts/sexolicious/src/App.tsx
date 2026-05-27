import React, { useState } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { WalletProvider } from "@/components/WalletContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Home from "@/pages/Home";
import NotFound from "@/pages/not-found";
import LoaderScreen from "@/components/LoaderScreen";
import { AnimatePresence } from "framer-motion";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [loaded, setLoaded] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WalletProvider>
          <>
            <div style={{ visibility: loaded ? 'visible' : 'hidden', opacity: loaded ? 1 : 0, transition: 'opacity 0.3s' }} className="dark min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/30 selection:text-primary-foreground">
              <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
                <Navbar />
                <main className="flex-1">
                  <Router />
                </main>
                <Footer />
              </WouterRouter>
            </div>
            {!loaded && <LoaderScreen onComplete={() => setLoaded(true)} />}
            <Toaster />
          </>
        </WalletProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
