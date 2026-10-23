import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'

import { ThemeProvider } from '@/contexts/ThemeContext'
import { AuthProvider } from '@/contexts/AuthContext'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { LandingLayout } from '@/layouts/LandingLayout'
import { AuthLayout } from '@/layouts/AuthLayout'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { ProtectedRoute, GuestRoute } from '@/routes/ProtectedRoute'
import { LandingPage } from '@/pages/landing/LandingPage'
import {
  LoginPage,
  RegisterPage,
  ForgotPasswordPage,
  ResetPasswordPage,
  EmailVerificationPage,
} from '@/pages/auth'
import { NotFoundPage } from '@/pages/errors/ErrorPages'
import { DashboardOverview } from '@/modules/dashboard/DashboardOverview'
import { ProjectsPage } from '@/modules/projects/ProjectsPage'
import { ProjectDetailsPage } from '@/modules/projects/ProjectDetailsPage'
import { AnalyticsPage } from '@/modules/analytics/AnalyticsPage'
import { AiAutomationPage } from '@/modules/ai-automation/AiAutomationPage'
import { CalendarPage } from '@/modules/calendar/CalendarPage'
import { CompanySettingsPage } from '@/modules/settings/CompanySettingsPage'
import { ProfileSettingsPage } from '@/modules/settings/ProfileSettingsPage'
import { SecuritySettingsPage } from '@/modules/settings/SecuritySettingsPage'
import { ModulePage } from '@/modules/shared/ModulePage'
import { modules } from '@/constants/navigation'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 30_000,
    },
  },
})

const specialModuleIds = new Set(['projects', 'analytics', 'calendar', 'ai-automation'])

function ModuleRoutes() {
  return modules
    .filter((mod) => !specialModuleIds.has(mod.id))
    .map((mod) => (
      <Route
        key={mod.id}
        path={mod.path.replace('/dashboard/', '')}
        element={<ModulePage moduleId={mod.id} />}
      />
    ))
}

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <BrowserRouter>
              <Routes>
                <Route element={<LandingLayout />}>
                  <Route index element={<LandingPage />} />
                </Route>

                <Route element={<GuestRoute />}>
                  <Route path="auth" element={<AuthLayout />}>
                    <Route index element={<Navigate to="login" replace />} />
                    <Route path="login" element={<LoginPage />} />
                    <Route path="register" element={<RegisterPage />} />
                    <Route path="forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="reset-password" element={<ResetPasswordPage />} />
                    <Route path="verify-email" element={<EmailVerificationPage />} />
                  </Route>
                </Route>

                <Route element={<ProtectedRoute />}>
                  <Route path="dashboard" element={<DashboardLayout />}>
                    <Route index element={<DashboardOverview />} />
                    <Route path="projects" element={<ProjectsPage />} />
                    <Route path="projects/:id" element={<ProjectDetailsPage />} />
                    <Route path="analytics" element={<AnalyticsPage />} />
                    <Route path="ai-automation" element={<AiAutomationPage />} />
                    <Route path="calendar" element={<CalendarPage />} />
                    <Route path="settings/company" element={<CompanySettingsPage />} />
                    <Route path="settings/profile" element={<ProfileSettingsPage />} />
                    <Route path="settings/security" element={<SecuritySettingsPage />} />
                    {ModuleRoutes()}
                  </Route>
                </Route>

                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </BrowserRouter>
            <Toaster richColors position="top-right" closeButton />
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App
