import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LogIn, MessageCircleQuestion } from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleFAQ = () => {
    window.open('https://docs.google.com/forms', '_blank');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-2 sm:p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-800 mb-4">
            Bem-vindo
          </h1>
          <p className="text-base sm:text-lg text-slate-600">
            Escolha uma opção para continuar
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <Card
            className="shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-teal-400 bg-white/80 backdrop-blur-sm"
            onClick={handleLogin}
          >
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 bg-gradient-to-br from-teal-500 to-emerald-600 p-4 sm:p-6 rounded-2xl w-fit">
                <LogIn className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
              </div>
              <CardTitle className="text-xl sm:text-2xl text-slate-800">Fazer Login</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Acesse sua conta com CPF e senha
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center pb-6">
              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white shadow-md"
              >
                Entrar no Sistema
              </Button>
            </CardContent>
          </Card>

          <Card
            className="shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-cyan-400 bg-white/80 backdrop-blur-sm"
            onClick={handleFAQ}
          >
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 bg-gradient-to-br from-cyan-500 to-teal-600 p-4 sm:p-6 rounded-2xl w-fit">
                <MessageCircleQuestion className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
              </div>
              <CardTitle className="text-xl sm:text-2xl text-slate-800">Tire sua Dúvida</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Envie suas perguntas através do formulário
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center pb-6">
              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700 text-white shadow-md"
              >
                Acessar Formulário
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
