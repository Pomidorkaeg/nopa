import { Suspense, lazy, ErrorBoundary } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { HashRouter, Routes, Route } from "react-router-dom";

// Lazy-load all route components
const Index = lazy(() => import("./pages/Index"));
const Team = lazy(() => import("./pages/Team"));
const News = lazy(() => import("./pages/News"));
const Matches = lazy(() => import("./pages/Matches"));
const Tournaments = lazy(() => import("./pages/Tournaments"));
const Media = lazy(() => import("./pages/Media"));
const Contacts = lazy(() => import("./pages/Contacts"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Admin routes
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminHome = lazy(() => import("./pages/admin/AdminHome"));
const PlayersManagement = lazy(() => import("./pages/admin/PlayersManagement"));
const CoachesManagement = lazy(() => import("./pages/admin/CoachesManagement"));
const TeamsManagement = lazy(() => import("./pages/admin/TeamsManagement"));

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

// Always use HashRouter for compatibility with GitHub Pages
const App = () => {
  return (
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <HashRouter>
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
      </HashRouter>
    </TooltipProvider>
  );
};

export default App;
