import { Suspense, lazy } from "react";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { HashRouter, Routes, Route } from "react-router-dom";

// Fallback loading component
const PageLoading = () => (
  <div className="flex h-screen w-full items-center justify-center">
    <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-900 border-t-transparent"></div>
  </div>
);

// Компонент для отображения ошибок
const ErrorFallback = ({ error }: { error: Error }) => (
  <div className="flex h-screen w-full items-center justify-center">
    <div className="text-center">
      <h2 className="text-2xl font-bold text-red-600">Что-то пошло не так</h2>
      <p className="mt-2 text-gray-600">{error.message}</p>
      <button
        onClick={() => window.location.reload()}
        className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
      >
        Перезагрузить страницу
      </button>
    </div>
  </div>
);

// Lazy-load all route components with error handling
const lazyLoad = (Component: React.LazyExoticComponent<any>) => (
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <Suspense fallback={<PageLoading />}>
      <Component />
    </Suspense>
  </ErrorBoundary>
);

// Lazy-load all route components with retry
const lazyLoadWithRetry = (importFn: () => Promise<any>, retries = 3) => {
  return lazy(async () => {
    try {
      return await importFn();
    } catch (error) {
      if (retries > 0) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return lazyLoadWithRetry(importFn, retries - 1);
      }
      throw error;
    }
  });
};

// Lazy-load all route components
const Index = lazyLoadWithRetry(() => import("./pages/Index"));
const Team = lazyLoadWithRetry(() => import("./pages/Team"));
const News = lazyLoadWithRetry(() => import("./pages/News"));
const Matches = lazyLoadWithRetry(() => import("./pages/Matches"));
const Tournaments = lazyLoadWithRetry(() => import("./pages/Tournaments"));
const Media = lazyLoadWithRetry(() => import("./pages/Media"));
const Contacts = lazyLoadWithRetry(() => import("./pages/Contacts"));
const NotFound = lazyLoadWithRetry(() => import("./pages/NotFound"));

// Admin routes
const AdminDashboard = lazyLoadWithRetry(() => import("./pages/admin/Dashboard"));
const AdminHome = lazyLoadWithRetry(() => import("./pages/admin/AdminHome"));
const PlayersManagement = lazyLoadWithRetry(() => import("./pages/admin/PlayersManagement"));
const CoachesManagement = lazyLoadWithRetry(() => import("./pages/admin/CoachesManagement"));
const TeamsManagement = lazyLoadWithRetry(() => import("./pages/admin/TeamsManagement"));

// Always use HashRouter for compatibility with GitHub Pages
const App = () => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <HashRouter>
          <Suspense fallback={<PageLoading />}>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={lazyLoad(Index)} />
              <Route path="/team" element={lazyLoad(Team)} />
              <Route path="/news" element={lazyLoad(News)} />
              <Route path="/matches" element={lazyLoad(Matches)} />
              <Route path="/tournaments" element={lazyLoad(Tournaments)} />
              <Route path="/tournaments/:id" element={lazyLoad(Tournaments)} />
              <Route path="/media" element={lazyLoad(Media)} />
              <Route path="/contacts" element={lazyLoad(Contacts)} />
              
              {/* Admin routes */}
              <Route path="/admin" element={lazyLoad(AdminDashboard)}>
                <Route index element={lazyLoad(AdminHome)} />
                <Route path="players" element={lazyLoad(PlayersManagement)} />
                <Route path="coaches" element={lazyLoad(CoachesManagement)} />
                <Route path="teams" element={lazyLoad(TeamsManagement)} />
              </Route>
              
              {/* 404 */}
              <Route path="*" element={lazyLoad(NotFound)} />
            </Routes>
          </Suspense>
        </HashRouter>
      </TooltipProvider>
    </ErrorBoundary>
  );
};

export default App;
