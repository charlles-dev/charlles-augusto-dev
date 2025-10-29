import React, { Suspense } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { PageTransition } from "@/components/ui/page-transition";
import { NotificationProvider } from "@/components/ui/notification-system";
import { AdminRoute } from "@/components/AdminRoute";

// Lazy load pages for better performance
const Index = React.lazy(() => import("./pages/Index"));
const Auth = React.lazy(() => import("./pages/Auth"));
const Admin = React.lazy(() => import("./pages/Admin"));
const Blog = React.lazy(() => import("./pages/Blog"));
const BlogPost = React.lazy(() => import("./pages/BlogPost"));
const NotFound = React.lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const AppRoutes = () => (
  <ErrorBoundary>
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-bg flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    }>
      <Routes>
        <Route path="/" element={
          <PageTransition>
            <Index />
          </PageTransition>
        } />
        <Route path="/auth" element={
          <PageTransition>
            <Auth />
          </PageTransition>
        } />
        <Route path="/blog" element={
          <PageTransition>
            <Blog />
          </PageTransition>
        } />
        <Route path="/blog/:slug" element={
          <PageTransition>
            <BlogPost />
          </PageTransition>
        } />
        <Route path="/admin" element={
          <AdminRoute>
            <PageTransition>
              <Admin />
            </PageTransition>
          </AdminRoute>
        } />
        <Route path="*" element={
          <PageTransition>
            <NotFound />
          </PageTransition>
        } />
      </Routes>
    </Suspense>
  </ErrorBoundary>
);

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <NotificationProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </NotificationProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;