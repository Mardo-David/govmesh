import { useState } from 'react';
import { Send, Sparkles, FileText, Scale, Loader2, ExternalLink, CheckCircle, Lock } from 'lucide-react';
import { useGovMesh } from '@/contexts/GovMeshContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  fontes?: { titulo: string; url: string }[];
  timestamp: string;
}

const mockResponses = [
  {
    resposta: `**Argumento Auditado sobre Investimento em Saúde - Campanha José da Silva**

A alegação de que "não há investimento em saúde" é factualmente incorreta. Os dados oficiais da gestão José da Silva em Sergipe demonstram:

📊 **Dados Verificáveis:**
- R$ 45,2 milhões investidos em saúde pública em 2023 (aumento de 23% vs 2022)
- 15 novas Unidades Básicas de Saúde inauguradas em Sergipe
- 200.347 atendimentos realizados no último trimestre
- Tempo médio de espera reduzido de 45 para 18 dias

💡 **Sugestão de Resposta:**
"Entendo sua preocupação, mas os números da gestão José da Silva mostram outra realidade. Só este ano inauguramos 15 novas UBS e investimos mais de R$ 45 milhões em Sergipe. Quer que eu te mostre as obras mais próximas da sua região?"`,
    fontes: [
      { titulo: 'Portal da Transparência SE - Relatório Saúde 2023', url: 'https://transparencia.se.gov.br/saude-2023.pdf' },
      { titulo: 'TCE-SE - Auditoria de Gastos Públicos', url: 'https://tce.se.gov.br/auditoria-2023.pdf' },
      { titulo: 'Diário Oficial SE - Decreto de Investimentos', url: 'https://diariooficial.se.gov.br/decreto-saude.pdf' },
    ]
  },
  {
    resposta: `**Argumento Auditado sobre Segurança Pública - Campanha José da Silva**

A percepção de insegurança é válida, mas os dados da gestão José da Silva mostram melhorias significativas em Sergipe:

📊 **Dados Verificáveis:**
- Redução de 18% em crimes contra o patrimônio
- 500 novas câmeras de monitoramento instaladas
- 3 novas bases comunitárias da PM inauguradas
- Programa Ilumina Sergipe: 12.000 pontos de LED

💡 **Sugestão de Resposta:**
"A segurança é prioridade absoluta para José da Silva. Os dados mostram queda de 18% nos crimes. Instalamos 500 câmeras e 12 mil pontos de iluminação. Qual município de Sergipe você gostaria de saber mais?"`,
    fontes: [
      { titulo: 'SSP-SE - Estatísticas de Segurança 2023', url: 'https://ssp.se.gov.br/estatisticas-2023.pdf' },
      { titulo: 'Governo de Sergipe - Relatório Ilumina Sergipe', url: 'https://sergipe.gov.br/ilumina-sergipe.pdf' },
    ]
  },
];

export default function AssistPage() {
  const { userProfile, addLog, addArgumento, isLocked, isSystemLocked } = useGovMesh();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const isBlocked = isLocked || isSystemLocked;

  const handleGenerate = async () => {
    if (!input.trim() || isBlocked) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      type: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString('pt-BR'),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    addLog({
      acao: 'Argumento gerado',
      usuario: userProfile,
      detalhes: `Pergunta: "${input.substring(0, 50)}..."`,
      modulo: 'GovMesh Assist',
    });

    // Simulate AI response delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const mockResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];

    const assistantMessage: Message = {
      id: `msg-${Date.now()}`,
      type: 'assistant',
      content: mockResponse.resposta,
      fontes: mockResponse.fontes,
      timestamp: new Date().toLocaleTimeString('pt-BR'),
    };

    setMessages(prev => [...prev, assistantMessage]);
    setIsLoading(false);
  };

  const handleRequestReview = (message: Message) => {
    if (message.type !== 'assistant') return;

    addArgumento({
      pergunta: messages.find(m => m.type === 'user')?.content || '',
      resposta: message.content,
      fontes: message.fontes || [],
      status: 'pendente_revisao',
    });

    addLog({
      acao: 'Revisão jurídica solicitada',
      usuario: userProfile,
      detalhes: 'Argumento enviado para aprovação do Jurídico',
      modulo: 'GovMesh Assist',
    });

    toast.success('Revisão Solicitada!', {
      description: 'O argumento foi enviado para a equipe jurídica.',
    });
  };

  const canRequestReview = userProfile !== 'Apoiador';

  const generateButton = (
    <Button
      onClick={handleGenerate}
      disabled={!input.trim() || isLoading || isBlocked}
      className={cn(
        'px-6',
        !isBlocked && 'bg-gradient-to-r from-primary to-accent hover:opacity-90 glow-primary'
      )}
    >
      {isLoading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : isBlocked ? (
        <>
          <Lock className="w-4 h-4 mr-2" />
          Bloqueado
        </>
      ) : (
        <>
          <Sparkles className="w-4 h-4 mr-2" />
          Gerar
        </>
      )}
    </Button>
  );

  return (
    <AppLayout>
      <div className="h-[calc(100vh-7rem)] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-primary" />
              GovMesh Assist
            </h1>
            <p className="text-muted-foreground mt-1">
              Gere argumentos auditados para responder ao eleitorado
            </p>
          </div>
          <div className={cn(
            'flex items-center gap-2 px-3 py-1.5 rounded-full border',
            isBlocked 
              ? 'bg-destructive/10 border-destructive/20' 
              : 'bg-primary/10 border-primary/20'
          )}>
            <div className={cn(
              'w-2 h-2 rounded-full',
              isBlocked ? 'bg-destructive' : 'bg-primary animate-pulse'
            )} />
            <span className={cn(
              'text-sm font-medium',
              isBlocked ? 'text-destructive' : 'text-primary'
            )}>
              {isBlocked ? 'IA Bloqueada' : 'IA Ativa'}
            </span>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className={cn(
                'w-20 h-20 rounded-2xl flex items-center justify-center mb-4',
                isBlocked 
                  ? 'bg-destructive/20' 
                  : 'bg-gradient-to-br from-primary/20 to-accent/20 animate-pulse-glow'
              )}>
                {isBlocked ? (
                  <Lock className="w-10 h-10 text-destructive" />
                ) : (
                  <Sparkles className="w-10 h-10 text-primary" />
                )}
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2">
                {isBlocked ? 'Geração Bloqueada' : 'Como posso ajudar?'}
              </h2>
              <p className="text-muted-foreground max-w-md">
                {isBlocked 
                  ? 'O Protocolo de Emergência está ativo. A geração de argumentos está temporariamente bloqueada.'
                  : 'Digite o que o eleitor disse ou perguntou e eu vou gerar um argumento baseado em dados oficiais e auditáveis.'
                }
              </p>
              {!isBlocked && (
                <div className="flex flex-wrap gap-2 mt-6 max-w-lg justify-center">
                  {[
                    '"O governo não investe em segurança"',
                    '"O HUSE está abandonado"',
                    '"Cadê as obras nas rodovias?"',
                  ].map((example) => (
                    <button
                      key={example}
                      onClick={() => setInput(example)}
                      className="px-3 py-2 rounded-lg bg-secondary/50 border border-border/50 text-sm text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex',
                message.type === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              <div
                className={cn(
                  'max-w-[80%] rounded-2xl p-4 animate-fade-in',
                  message.type === 'user'
                    ? 'bg-primary text-primary-foreground rounded-br-md'
                    : 'glass-card border-border/50 rounded-bl-md'
                )}
              >
                {message.type === 'assistant' && (
                  <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border/30">
                    <Sparkles className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium text-primary">Argumento Auditado</span>
                  </div>
                )}

                <div className={cn(
                  'prose prose-sm max-w-none',
                  message.type === 'user' ? 'prose-invert' : 'prose-invert'
                )}>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
                </div>

                {/* Sources */}
                {message.fontes && message.fontes.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-border/30">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-4 h-4 text-accent" />
                      <span className="text-xs font-medium text-accent">Fontes e Evidências</span>
                    </div>
                    <div className="space-y-2">
                      {message.fontes.map((fonte, idx) => (
                        <a
                          key={idx}
                          href={fonte.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 p-2 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors group"
                        >
                          <FileText className="w-4 h-4 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground group-hover:text-foreground flex-1">
                            {fonte.titulo}
                          </span>
                          <ExternalLink className="w-3 h-3 text-muted-foreground" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions for assistant messages */}
                {message.type === 'assistant' && canRequestReview && (
                  <div className="mt-4 pt-3 border-t border-border/30">
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-secondary/50 border-border/50 hover:border-primary/50 hover:bg-primary/10"
                      onClick={() => handleRequestReview(message)}
                    >
                      <Scale className="w-4 h-4 mr-2" />
                      Pedir Revisão Jurídica
                    </Button>
                  </div>
                )}

                <div className="mt-2 text-xs text-muted-foreground/50 text-right">
                  {message.timestamp}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="glass-card border-border/50 rounded-2xl rounded-bl-md p-4">
                <div className="flex items-center gap-3">
                  <Loader2 className="w-5 h-5 text-primary animate-spin" />
                  <span className="text-sm text-muted-foreground">Analisando dados oficiais...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className={cn(
          'glass-card rounded-xl p-4 border-border/50',
          isBlocked && 'opacity-70'
        )}>
          <div className="flex gap-3">
            <Textarea
              placeholder={isBlocked ? "Geração de IA bloqueada pelo Protocolo de Emergência" : "Digite o que o eleitor disse ou perguntou..."}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleGenerate();
                }
              }}
              disabled={isBlocked}
              className="flex-1 min-h-[60px] max-h-[120px] bg-secondary/50 border-border/50 focus:border-primary/50 resize-none"
            />
            {isBlocked ? (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span>{generateButton}</span>
                  </TooltipTrigger>
                  <TooltipContent 
                    side="top" 
                    className="bg-destructive text-destructive-foreground border-destructive"
                  >
                    <div className="flex items-center gap-2">
                      <Lock className="w-3 h-3" />
                      <span>Ação bloqueada pelo Protocolo de Emergência</span>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : (
              generateButton
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {isBlocked 
              ? '⚠️ Protocolo de Emergência ativo - Geração de IA desabilitada'
              : 'Pressione Enter para enviar ou Shift+Enter para nova linha'
            }
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
