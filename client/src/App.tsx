import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Cookbook from "@/pages/Cookbook";
import RegionalCuisine from "@/pages/RegionalCuisine";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/cookbook" component={Cookbook} />
      <Route path="/regional" component={RegionalCuisine} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
