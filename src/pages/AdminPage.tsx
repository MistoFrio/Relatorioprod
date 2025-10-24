import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { User, userService } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { LogOut, UserPlus, Pencil, Trash2, Shield, RefreshCw } from 'lucide-react';
import UserModal from '@/components/UserModal';
import LinkPreview from '@/components/LinkPreview';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    console.log('AdminPage - currentUser:', currentUser); // Debug log
    if (currentUser && currentUser.is_admin) {
      loadUsers();
    }
  }, [currentUser]);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const usersData = await userService.getAllUsers();
      setUsers(usersData);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os usuários.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddUser = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleDeleteUser = async (userId: string | undefined) => {
    if (!userId) return;

    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
      try {
        const success = await userService.deleteUser(userId);
        
        if (success) {
          setUsers(users.filter(u => u.id !== userId));
          toast({
            title: 'Sucesso',
            description: 'Usuário excluído com sucesso.',
          });
        } else {
          toast({
            title: 'Erro',
            description: 'Não foi possível excluir o usuário.',
            variant: 'destructive',
          });
        }
      } catch (error) {
        console.error('Erro ao excluir usuário:', error);
        toast({
          title: 'Erro',
          description: 'Erro ao excluir usuário.',
          variant: 'destructive',
        });
      }
    }
  };

  const handleSaveUser = async (userData: Omit<User, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      if (editingUser) {
        // Atualizar usuário existente
        const updatedUser = await userService.updateUser(editingUser.id!, userData);
        
        if (updatedUser) {
          setUsers(users.map(u => u.id === editingUser.id ? updatedUser : u));
          toast({
            title: 'Sucesso',
            description: 'Usuário atualizado com sucesso.',
          });
        } else {
          toast({
            title: 'Erro',
            description: 'Não foi possível atualizar o usuário.',
            variant: 'destructive',
          });
        }
      } else {
        // Criar novo usuário
        const newUser = await userService.createUser(userData);
        
        if (newUser) {
          setUsers([newUser, ...users]);
          toast({
            title: 'Sucesso',
            description: 'Usuário criado com sucesso.',
          });
        } else {
          toast({
            title: 'Erro',
            description: 'Não foi possível criar o usuário.',
            variant: 'destructive',
          });
        }
      }
      
      setIsModalOpen(false);
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao salvar usuário.',
        variant: 'destructive',
      });
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const maskPassword = (password: string) => {
    return '•'.repeat(password.length);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-teal-500 to-emerald-600 p-3 rounded-full">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Painel Administrativo</h1>
              <p className="text-slate-600">Gerenciamento de usuários do sistema</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={loadUsers} disabled={isLoading}>
              <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>

        <Alert className="mb-6 border-teal-200 bg-teal-50/50">
          <AlertDescription>
            <strong>Sistema integrado com Supabase:</strong> Os usuários estão sendo gerenciados através do banco de dados Supabase.
          </AlertDescription>
        </Alert>

        <Card className="shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Usuários Cadastrados</CardTitle>
                <CardDescription>
                  Total de {users.length} usuário(s) no sistema
                </CardDescription>
              </div>
              <Button onClick={handleAddUser} className="bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white">
                <UserPlus className="mr-2 h-4 w-4" />
                Adicionar Usuário
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>CPF</TableHead>
                    <TableHead>Senha</TableHead>
                    <TableHead>Link de Destino</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Criado em</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-slate-500 py-8">
                        <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
                        Carregando usuários...
                      </TableCell>
                    </TableRow>
                  ) : users.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-slate-500 py-8">
                        Nenhum usuário cadastrado
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.nome}</TableCell>
                        <TableCell className="font-mono text-sm">{user.cpf}</TableCell>
                        <TableCell className="font-mono text-sm">
                          {maskPassword(user.senha)}
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <div className="flex items-center gap-2">
                            <span className="truncate text-teal-600">
                              {user.link_destino}
                            </span>
                            {user.link_destino && user.link_destino.startsWith('http') && (
                              <LinkPreview url={user.link_destino} userName={user.nome} />
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {user.is_admin ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800">
                              Admin
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                              Usuário
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-slate-500">
                          {user.created_at ? new Date(user.created_at).toLocaleDateString('pt-BR') : '-'}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditUser(user)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteUser(user.id)}
                              disabled={user.is_admin && users.filter(u => u.is_admin).length === 1}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <UserModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveUser}
          user={editingUser}
        />
      </div>
    </div>
  );
}
