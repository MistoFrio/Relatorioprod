import { useState, useEffect } from 'react';
import { User, userService } from '@/lib/supabaseClient';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Key } from 'lucide-react';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: Omit<User, 'id' | 'created_at' | 'updated_at'>) => void;
  user: User | null;
}

export default function UserModal({ isOpen, onClose, onSave, user }: UserModalProps) {
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const [cargo, setCargo] = useState('');
  const [linkDestino, setLinkDestino] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [autoPassword, setAutoPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setNome(user.nome);
      setCpf(user.cpf);
      setSenha(user.senha);
      setCargo(user.cargo || '');
      setLinkDestino(user.link_destino);
      setIsAdmin(user.is_admin || false);
      setAutoPassword(false);
    } else {
      setNome('');
      setCpf('');
      setSenha('');
      setCargo('');
      setLinkDestino('');
      setIsAdmin(false);
      setAutoPassword(false);
    }
    setErrors({});
  }, [user, isOpen]);

  // useEffect para gerar senha automaticamente quando CPF e cargo estiverem preenchidos
  useEffect(() => {
    if (!user && cargo && cpf && cpf.replace(/\D/g, '').length === 11) {
      generateAutoPassword();
    }
  }, [cargo, cpf, user]);

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }
    return value;
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value);
    setCpf(formatted);
    
    // Limpar erro de CPF quando o usuário digitar
    if (errors.cpf) {
      setErrors(prev => ({ ...prev, cpf: '' }));
    }

    // Gerar senha automática se cargo já estiver selecionado e não for edição de usuário existente
    if (cargo && formatted.replace(/\D/g, '').length === 11 && !user) {
      generateAutoPassword();
    }
  };

  // Função para gerar senha automática baseada no cargo
  const generateAutoPassword = () => {
    if (cargo && cpf) {
      const cpfNumbers = cpf.replace(/\D/g, '');
      if (cpfNumbers.length === 11) {
        const generatedPassword = userService.generatePasswordByCargo(cpf, cargo);
        setSenha(generatedPassword);
        setAutoPassword(true);
      }
    }
  };

  const validateForm = async () => {
    const newErrors: { [key: string]: string } = {};

    if (!nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    } else if (nome.trim().length < 2) {
      newErrors.nome = 'Nome deve ter pelo menos 2 caracteres';
    }

    if (!cpf.trim()) {
      newErrors.cpf = 'CPF é obrigatório';
    } else if (cpf.replace(/\D/g, '').length !== 11) {
      newErrors.cpf = 'CPF deve ter 11 dígitos';
    }

    if (!cargo.trim()) {
      newErrors.cargo = 'Cargo é obrigatório';
    }

    if (!senha.trim()) {
      newErrors.senha = 'Senha é obrigatória';
    } else if (senha.length < 3) {
      newErrors.senha = 'Senha deve ter pelo menos 3 caracteres';
    }

    if (!linkDestino.trim()) {
      newErrors.linkDestino = 'Link de destino é obrigatório';
    } else {
      try {
        new URL(linkDestino);
      } catch {
        newErrors.linkDestino = 'Link deve ser uma URL válida';
      }
    }

    // Verificar se CPF já existe (apenas para novos usuários ou se CPF foi alterado)
    if (!newErrors.cpf && (!user || user.cpf !== cpf)) {
      try {
        const cpfExists = await userService.checkCPFExists(cpf, user?.id);
        if (cpfExists) {
          newErrors.cpf = 'Este CPF já está cadastrado';
        }
      } catch (error) {
        console.error('Erro ao verificar CPF:', error);
        newErrors.cpf = 'Erro ao verificar CPF';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsLoading(true);
    
    const isValid = await validateForm();
    
    if (isValid) {
      onSave({
        nome: nome.trim(),
        cpf,
        senha,
        cargo: cargo.trim(),
        link_destino: linkDestino,
        is_admin: isAdmin
      });
    }
    
    setIsLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{user ? 'Editar Usuário' : 'Adicionar Usuário'}</DialogTitle>
          <DialogDescription>
            {user
              ? 'Atualize as informações do usuário abaixo.'
              : 'Preencha os dados do novo usuário.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="modal-nome">Nome</Label>
              <Input
                id="modal-nome"
                type="text"
                placeholder="Digite o nome completo"
                value={nome}
                onChange={(e) => {
                  setNome(e.target.value);
                  if (errors.nome) {
                    setErrors(prev => ({ ...prev, nome: '' }));
                  }
                }}
                required
                disabled={isLoading}
              />
              {errors.nome && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors.nome}</AlertDescription>
                </Alert>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="modal-cpf">CPF</Label>
              <Input
                id="modal-cpf"
                type="text"
                placeholder="000.000.000-00"
                value={cpf}
                onChange={handleCPFChange}
                maxLength={14}
                required
                disabled={isLoading}
              />
              {errors.cpf && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors.cpf}</AlertDescription>
                </Alert>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="modal-cargo">Cargo</Label>
              <Select value={cargo} onValueChange={(value) => {
                setCargo(value);
                if (errors.cargo) {
                  setErrors(prev => ({ ...prev, cargo: '' }));
                }
                // Gerar senha automática quando cargo for selecionado
                if (value && cpf && !user) {
                  generateAutoPassword();
                }
              }} disabled={isLoading}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o cargo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Ajudante">Ajudante</SelectItem>
                  <SelectItem value="Operador">Operador</SelectItem>
                  <SelectItem value="Supervisor">Supervisor</SelectItem>
                  <SelectItem value="Gerente">Gerente</SelectItem>
                  <SelectItem value="Administrador">Administrador</SelectItem>
                </SelectContent>
              </Select>
              {errors.cargo && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors.cargo}</AlertDescription>
                </Alert>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="modal-senha">Senha</Label>
                {autoPassword && (
                  <div className="flex items-center gap-1 text-xs text-teal-600">
                    <Key className="h-3 w-3" />
                    <span>Gerada automaticamente</span>
                  </div>
                )}
              </div>
              <Input
                id="modal-senha"
                type="text"
                placeholder="Digite a senha"
                value={senha}
                onChange={(e) => {
                  setSenha(e.target.value);
                  setAutoPassword(false);
                  if (errors.senha) {
                    setErrors(prev => ({ ...prev, senha: '' }));
                  }
                }}
                required
                disabled={isLoading}
              />
              {autoPassword && (
                <p className="text-xs text-slate-500">
                  Senha gerada baseada no cargo: {cargo === 'Ajudante' ? '4 últimos dígitos do CPF' : cargo === 'Operador' ? '4 primeiros dígitos do CPF' : 'CPF completo'}
                </p>
              )}
              {errors.senha && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors.senha}</AlertDescription>
                </Alert>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="modal-link">Link de Destino</Label>
              <Input
                id="modal-link"
                type="url"
                placeholder="https://exemplo.com"
                value={linkDestino}
                onChange={(e) => {
                  setLinkDestino(e.target.value);
                  if (errors.linkDestino) {
                    setErrors(prev => ({ ...prev, linkDestino: '' }));
                  }
                }}
                required
                disabled={isLoading}
              />
              <p className="text-sm text-slate-500">
                URL para onde o usuário será redirecionado após o login
              </p>
              {errors.linkDestino && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors.linkDestino}</AlertDescription>
                </Alert>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="modal-admin"
                checked={isAdmin}
                onCheckedChange={(checked) => setIsAdmin(checked as boolean)}
                disabled={isLoading}
              />
              <Label
                htmlFor="modal-admin"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Usuário administrador
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Salvando...' : user ? 'Salvar Alterações' : 'Adicionar Usuário'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
