import { Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from './components/domain/AppShell';
import { Toaster } from './components/ui/toast';
import { useAuthStore } from './lib/store';

// Pages
import { HomePage } from './app/HomePage';
import { CoursesPage } from './app/CoursesPage';
import { CoursePage } from './app/CoursePage';
import { LessonPage } from './app/LessonPage';
import { SearchPage } from './app/SearchPage';
import { ProfilePage } from './app/ProfilePage';
import { GalleryPage } from './app/GalleryPage';
import { LoginPage } from './app/auth/LoginPage';
import { RegisterPage } from './app/auth/RegisterPage';
import { ForgotPasswordPage } from './app/auth/ForgotPasswordPage';
import { ResetPasswordPage } from './app/auth/ResetPasswordPage';
import { AdminDashboard } from './app/admin/AdminDashboard';
import { NotFoundPage } from './app/NotFoundPage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuthStore();
  return isAuthenticated && user?.roles.includes('admin') ? (
    <>{children}</>
  ) : (
    <Navigate to="/" />
  );
}

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        <Route
          path="/*"
          element={
            <AppShell>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/courses" element={<CoursesPage />} />
                <Route path="/courses/:slug" element={<CoursePage />} />
                <Route path="/gallery" element={<GalleryPage />} />
                <Route
                  path="/lessons/:id"
                  element={
                    <ProtectedRoute>
                      <LessonPage />
                    </ProtectedRoute>
                  }
                />
                <Route path="/search" element={<SearchPage />} />
                <Route
                  path="/profile"
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin/*"
                  element={
                    <AdminRoute>
                      <AdminDashboard />
                    </AdminRoute>
                  }
                />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </AppShell>
          }
        />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;

