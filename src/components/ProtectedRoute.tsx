import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export default function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { currentUser, isLoading } = useAuth();

  console.log('ProtectedRoute - isLoading:', isLoading, 'currentUser:', currentUser, 'requireAdmin:', requireAdmin);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    console.log('ProtectedRoute - Usuário não autenticado, redirecionando para login');
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !currentUser.is_admin) {
    console.log('ProtectedRoute - Usuário não é admin, redirecionando para login');
    return <Navigate to="/login" replace />;
  }

  console.log('ProtectedRoute - Acesso autorizado');
  return <>{children}</>;
}
