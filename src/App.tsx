/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Landing } from './pages/Landing';
import { useTheme } from './hooks/useTheme';
import { SessionProvider } from './contexts/SessionContext';
import { ErrorBoundary } from './components/ErrorBoundary';

// Lazy load heavy pages
const CreateSession = lazy(() => import('./pages/CreateSession').then(module => ({ default: module.CreateSession })));
const EditSession = lazy(() => import('./pages/EditSession').then(module => ({ default: module.EditSession })));
const SessionDetail = lazy(() => import('./pages/SessionDetail').then(module => ({ default: module.SessionDetail })));
const Settings = lazy(() => import('./pages/Settings').then(module => ({ default: module.Settings })));
const Pricing = lazy(() => import('./pages/Pricing').then(module => ({ default: module.Pricing })));
const UpgradeSuccess = lazy(() => import('./pages/UpgradeSuccess').then(module => ({ default: module.UpgradeSuccess })));
const Login = lazy(() => import('./pages/Login').then(module => ({ default: module.Login })));
const Signup = lazy(() => import('./pages/Signup').then(module => ({ default: module.Signup })));
const SecurityPolicy = lazy(() => import('./pages/SecurityPolicy').then(module => ({ default: module.SecurityPolicy })));
const AnalyticsDashboard = lazy(() => import('./pages/AnalyticsDashboard').then(module => ({ default: module.AnalyticsDashboard })));
const HowItWorks = lazy(() => import('./pages/HowItWorks').then(module => ({ default: module.HowItWorks })));
const Outcomes = lazy(() => import('./pages/Outcomes').then(module => ({ default: module.Outcomes })));
const Privacy = lazy(() => import('./pages/Privacy').then(module => ({ default: module.Privacy })));
const Terms = lazy(() => import('./pages/Terms').then(module => ({ default: module.Terms })));

// Loading fallback
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
  </div>
);

function AppContent() {
  useTheme(); // Initialize theme

  return (
    <ErrorBoundary>
      <HashRouter>
        <SessionProvider>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/outcomes" element={<Outcomes />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/security" element={<SecurityPolicy />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              
              <Route element={<Layout />}>
                <Route path="/dashboard" element={<Home />} />
                <Route path="/create" element={<CreateSession />} />
                <Route path="/edit/:id" element={<EditSession />} />
                <Route path="/session/:id" element={<SessionDetail />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/analytics" element={<AnalyticsDashboard />} />
                <Route path="/upgrade-success" element={<UpgradeSuccess />} />
              </Route>
            </Routes>
          </Suspense>
        </SessionProvider>
      </HashRouter>
    </ErrorBoundary>
  );
}

export default function App() {
  return <AppContent />;
}

