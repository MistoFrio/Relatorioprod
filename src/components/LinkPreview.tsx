import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ExternalLink, Eye, Globe, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface LinkPreviewProps {
  url: string;
  userName: string;
}

export default function LinkPreview({ url, userName }: LinkPreviewProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isValidUrl, setIsValidUrl] = useState(true);

  const handlePreview = () => {
    try {
      new URL(url);
      setIsValidUrl(true);
      setIsOpen(true);
    } catch {
      setIsValidUrl(false);
      setIsOpen(true);
    }
  };

  const handleOpenLink = () => {
    try {
      new URL(url);
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch {
      alert('URL inválida: ' + url);
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={handlePreview}
        className="h-8 w-8 p-0"
        title="Visualizar link de destino"
      >
        <Eye className="h-4 w-4" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Link de Destino
            </DialogTitle>
            <DialogDescription>
              Preview do link para {userName}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {!isValidUrl ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  URL inválida: {url}
                </AlertDescription>
              </Alert>
            ) : (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">URL:</label>
                  <div className="p-3 bg-slate-50 rounded-md border">
                    <code className="text-sm break-all">{url}</code>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Preview:</label>
                  <div className="p-4 bg-white rounded-md border-2 border-dashed border-slate-200">
                    <div className="flex items-center gap-3">
                      <Globe className="h-5 w-5 text-slate-400" />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-slate-900">
                          {(() => {
                            try {
                              return new URL(url).hostname;
                            } catch {
                              return 'URL inválida';
                            }
                          })()}
                        </div>
                        <div className="text-xs text-slate-500">
                          {url}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button onClick={handleOpenLink} className="flex-1">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Abrir Link
                  </Button>
                  <Button variant="outline" onClick={() => setIsOpen(false)}>
                    Fechar
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
