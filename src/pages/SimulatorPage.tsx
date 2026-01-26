// src/pages/SimulatorPage.tsx
import React, { useEffect, useMemo, useReducer, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Play, Pause, RotateCcw, ChevronRight, Zap } from "lucide-react";

// Ajuste os imports do shadcn/ui conforme seu projeto (ex: "@/components/ui/...")
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Separator } from "../components/ui/separator";

// -----------------------------
// 1) Helpers
// -----------------------------
function cn(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(" ");
}
function formatSeconds(s: number) {
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${String(r).padStart(2, "0")}`;
}

// -----------------------------
// 2) Types
// -----------------------------
type ScenarioId = "onboarding" | "kits" | "fake-news" | "ocr" | "fleet" | "goals";
type Actor = "user" | "agent";
type StepType = "typing" | "text" | "audio" | "forwarded" | "image" | "file" | "button";

type BackstageKey =
  | "crm-lookup"
  | "role-detection"
  | "lgpd-consent"
  | "audit-log"
  | "audio-transcription"
  | "intent-detection"
  | "approved-kits"
  | "native-send"
  | "viral-match"
  | "war-room-db"
  | "official-response"
  | "instant-reply"
  | "vision-ocr"
  | "field-extraction"
  | "crm-format"
  | "human-error-reduction"
  | "entity-categorization"
  | "resource-logistics"
  | "event-scheduling"
  | "gamification-progress"
  | "inactivity-trigger"
  | "crm-update";

type StepBase = {
  id: string;
  type: StepType;
  delayMs: number;
  backstageKeys?: BackstageKey[];
  blockUntilAction?: boolean;
};

type Step =
  | (StepBase & { type: "typing"; from: Actor })
  | (StepBase & { type: "text"; from: Actor; content: string })
  | (StepBase & { type: "audio"; from: Actor; meta: { seconds: number; label?: string } })
  | (StepBase & { type: "forwarded"; from: Actor; content: string })
  | (StepBase & { type: "image"; from: Actor; meta: { title: string; src: string } })
  | (StepBase & { type: "file"; from: Actor; meta: { filename: string; caption?: string; thumbSrc?: string } })
  | (StepBase & { type: "button"; from: Actor; meta: { label: string } });

type Scenario = {
  id: ScenarioId;
  title: string;
  subtitle: string;
  backstageSummary: string;
  backstageChips: { key: BackstageKey; label: string }[];
  steps: Step[];
};

// -----------------------------
// 3) Scenarios (assets in /public)
// -----------------------------
const scenarios: Scenario[] = [
  {
    id: "onboarding",
    title: "Onboarding & Segurança",
    subtitle: "Entrada fácil e protegida",
    backstageSummary:
      "Valida CPF no CRM em milissegundos e registra o aceite LGPD para auditoria futura.",
    backstageChips: [
      { key: "crm-lookup", label: "Consulta no CRM" },
      { key: "role-detection", label: "Perfil e Permissão" },
      { key: "lgpd-consent", label: "Aceite LGPD" },
      { key: "audit-log", label: "Registro p/ Auditoria" },
    ],
    steps: [
      { id: "o-1", type: "text", from: "user", content: "Oi, quero ajudar na campanha.", delayMs: 500 },
      { id: "o-2", type: "typing", from: "agent", delayMs: 450 },
      {
        id: "o-3",
        type: "text",
        from: "agent",
        content: "Olá! Sou a IA do Candidato Zé. Para liberar seu acesso, digite apenas o seu CPF.",
        delayMs: 650,
        backstageKeys: ["crm-lookup"],
      },
      { id: "o-4", type: "text", from: "user", content: "000.111.222-33", delayMs: 600 },
      { id: "o-5", type: "typing", from: "agent", delayMs: 500 },
      {
        id: "o-6",
        type: "text",
        from: "agent",
        content: "✅ Identifiquei você, Carlos (Capitão Regional).",
        delayMs: 650,
        backstageKeys: ["role-detection"],
      },
      {
        id: "o-7",
        type: "text",
        from: "agent",
        content: "Para continuar, você concorda com nossos termos de uso e LGPD?",
        delayMs: 650,
        backstageKeys: ["lgpd-consent"],
      },
      {
        id: "o-8",
        type: "button",
        from: "agent",
        meta: { label: "👍 LI E CONCORDO" },
        delayMs: 0,
        blockUntilAction: true,
        backstageKeys: ["audit-log"],
      },
      // Esse step aparece só depois do clique (porque o autoplay bloqueia no step do botão)
      { id: "o-9", type: "text", from: "user", content: "Li e concordo.", delayMs: 0 },
      { id: "o-10", type: "typing", from: "agent", delayMs: 350 },
      { id: "o-11", type: "text", from: "agent", content: "Acesso liberado! 🔓 O que vamos fazer hoje?", delayMs: 550 },
    ],
  },
  {
    id: "kits",
    title: "Entrega de Munição",
    subtitle: "Áudio, rápido e sem links",
    backstageSummary:
      "Transcreve o áudio, entende o tema, busca no banco de kits aprovados e envia arquivo nativo.",
    backstageChips: [
      { key: "audio-transcription", label: "Transcrição do áudio" },
      { key: "intent-detection", label: "Detecção de intenção" },
      { key: "approved-kits", label: "Kits aprovados" },
      { key: "native-send", label: "Envio nativo" },
    ],
    steps: [
      { id: "k-1", type: "audio", from: "user", meta: { seconds: 8, label: "Áudio" }, delayMs: 600 },
      { id: "k-2", type: "typing", from: "agent", delayMs: 450, backstageKeys: ["audio-transcription"] },
      {
        id: "k-3",
        type: "text",
        from: "agent",
        content: "Entendido, Carlos! 🏥",
        delayMs: 450,
        backstageKeys: ["intent-detection"],
      },
      { id: "k-4", type: "typing", from: "agent", delayMs: 450, backstageKeys: ["approved-kits"] },
      {
        id: "k-5",
        type: "text",
        from: "agent",
        content: "Aqui está o vídeo oficial aprovado pelo jurídico. Pode encaminhar!",
        delayMs: 550,
        backstageKeys: ["approved-kits"],
      },
      {
        id: "k-6",
        type: "file",
        from: "agent",
        meta: {
          filename: "video_hospital_versao_final.mp4",
          caption: "Saúde levada a sério! Compartilhe a verdade.",
          thumbSrc: "/video-hospital-thumb.jpg",
        },
        delayMs: 650,
        backstageKeys: ["native-send"],
      },
    ],
  },
  {
    id: "fake-news",
    title: "Combate a Boatos",
    subtitle: "Caça-fantasmas de Fake News",
    backstageSummary:
      "Reconhece o texto viral, cruza com a base do War Room e devolve a resposta oficial aprovada.",
    backstageChips: [
      { key: "viral-match", label: "Match com boato" },
      { key: "war-room-db", label: "Base do War Room" },
      { key: "official-response", label: "Resposta oficial" },
      { key: "instant-reply", label: "Retorno instantâneo" },
    ],
    steps: [
      { id: "f-1", type: "forwarded", from: "user", content: "Dizem que o Zé vai fechar a escola do bairro...", delayMs: 550 },
      { id: "f-2", type: "typing", from: "agent", delayMs: 450, backstageKeys: ["viral-match"] },
      { id: "f-3", type: "text", from: "agent", content: "🚨 Atenção! Isso é FAKE NEWS.", delayMs: 450, backstageKeys: ["war-room-db"] },
      { id: "f-4", type: "text", from: "agent", content: "Já analisamos esse boato. A verdade é que a escola será reformada.", delayMs: 550, backstageKeys: ["official-response"] },
      { id: "f-5", type: "image", from: "agent", meta: { title: "card_desmentido_escola.jpg", src: "/fake-vs-fato-card.png" }, delayMs: 650, backstageKeys: ["instant-reply"] },
      { id: "f-6", type: "text", from: "agent", content: "Mande esse card agora no grupo onde você viu a mentira!", delayMs: 500 },
    ],
  },
  {
    id: "ocr",
    title: "Cadastro via Foto",
    subtitle: "O fim da digitação",
    backstageSummary:
      "Extrai dados da imagem, ignora o fundo e formata o cadastro no CRM sem erro humano.",
    backstageChips: [
      { key: "vision-ocr", label: "Visão + OCR" },
      { key: "field-extraction", label: "Extração de campos" },
      { key: "crm-format", label: "Formatação CRM" },
      { key: "human-error-reduction", label: "Menos erro humano" },
    ],
    steps: [
      { id: "c-1", type: "text", from: "user", content: "Consegui mais um apoio aqui!", delayMs: 550 },
      { id: "c-2", type: "image", from: "user", meta: { title: "Foto do Título de Eleitor", src: "/titulo-eleitor-ocr.jpg" }, delayMs: 650 },
      { id: "c-3", type: "typing", from: "agent", delayMs: 450, backstageKeys: ["vision-ocr"] },
      { id: "c-4", type: "text", from: "agent", content: "Boa! Li os dados aqui:", delayMs: 400, backstageKeys: ["field-extraction"] },
      { id: "c-5", type: "text", from: "agent", content: "Nome: Maria da Silva\nZona: 123 / Seção: 045", delayMs: 500, backstageKeys: ["crm-format"] },
      { id: "c-6", type: "text", from: "agent", content: "Posso confirmar o cadastro dela na sua base de Lagarto?", delayMs: 500, backstageKeys: ["human-error-reduction"] },
      { id: "c-7", type: "text", from: "user", content: "Pode sim.", delayMs: 450 },
      { id: "c-8", type: "typing", from: "agent", delayMs: 350 },
      { id: "c-9", type: "text", from: "agent", content: "Fechado! Cadastro atualizado. ✅", delayMs: 450 },
    ],
  },
  {
    id: "fleet",
    title: "Logística",
    subtitle: "Organização de frota",
    backstageSummary:
      "Categorização do recurso, registro no perfil e preparação da logística do adesivaço.",
    backstageChips: [
      { key: "entity-categorization", label: "Entidade: Veículo" },
      { key: "resource-logistics", label: "Logística" },
      { key: "event-scheduling", label: "Agendamento" },
    ],
    steps: [
      { id: "l-1", type: "text", from: "user", content: "Tenho um carro pra adesivar.", delayMs: 550 },
      { id: "l-2", type: "typing", from: "agent", delayMs: 450, backstageKeys: ["entity-categorization"] },
      { id: "l-3", type: "text", from: "agent", content: "Show! Qual o modelo e cor? 🚗", delayMs: 500 },
      { id: "l-4", type: "text", from: "user", content: "É um Gol Prata.", delayMs: 550 },
      { id: "l-5", type: "typing", from: "agent", delayMs: 450, backstageKeys: ["resource-logistics"] },
      { id: "l-6", type: "text", from: "agent", content: "Anotado. Você prefere o adesivo do vidro traseiro todo (perfurado) ou só o lateral?", delayMs: 650 },
      { id: "l-7", type: "text", from: "user", content: "O vidro todo.", delayMs: 500 },
      { id: "l-8", type: "typing", from: "agent", delayMs: 400, backstageKeys: ["event-scheduling"] },
      { id: "l-9", type: "text", from: "agent", content: "Perfeito. Sábado teremos um Pit Stop na Praça da Matriz. Te aviso o horário!", delayMs: 650 },
      { id: "l-10", type: "image", from: "agent", meta: { title: "Logística e Frota", src: "/campanha-frota.png" }, delayMs: 650 },
    ],
  },
  {
    id: "goals",
    title: "Gerente de Metas",
    subtitle: "Follow-up e motivação",
    backstageSummary:
      "Monitora progresso, dispara conversa por inatividade e atualiza gamificação e CRM.",
    backstageChips: [
      { key: "gamification-progress", label: "Progresso XP" },
      { key: "inactivity-trigger", label: "Gatilho inatividade" },
      { key: "crm-update", label: "Atualização CRM" },
    ],
    steps: [
      { id: "g-1", type: "typing", from: "agent", delayMs: 500, backstageKeys: ["inactivity-trigger"] },
      { id: "g-2", type: "text", from: "agent", content: "E aí, Carlos! 👋", delayMs: 450 },
      { id: "g-3", type: "text", from: "agent", content: "Vi que faltam só 2 cadastros para você bater a meta da semana e ganhar +500 XP.", delayMs: 650, backstageKeys: ["gamification-progress"] },
      { id: "g-4", type: "text", from: "agent", content: "Conseguiu falar com aquele seu vizinho que estava indeciso?", delayMs: 600 },
      { id: "g-5", type: "text", from: "user", content: "Falei sim, ele garantiu o voto!", delayMs: 550 },
      { id: "g-6", type: "typing", from: "agent", delayMs: 400, backstageKeys: ["crm-update"] },
      { id: "g-7", type: "text", from: "agent", content: "Excelente! Já atualizei aqui. 🚀 Falta só 1 agora!", delayMs: 600 },
      { id: "g-8", type: "image", from: "agent", meta: { title: "Gamificação e Metas", src: "/gamificacao-metas.png" }, delayMs: 650 },
    ],
  },
];

// -----------------------------
// 4) Reducer State
// -----------------------------
type Status = "idle" | "playing" | "paused" | "finished";

type SimState = {
  selectedScenarioId: ScenarioId;
  status: Status;
  cursor: number; // quantos steps já estão visíveis
  speed: 1 | 1.5 | 2;
  blocked: boolean; // bloqueia autoplay quando o step exibido é button com blockUntilAction
};

type Action =
  | { type: "SET_SCENARIO"; id: ScenarioId }
  | { type: "PLAY" }
  | { type: "PAUSE" }
  | { type: "REPLAY" }
  | { type: "SET_SPEED"; speed: 1 | 1.5 | 2 }
  | { type: "ADVANCE"; stepsLen: number; nextStepIsBlocking: boolean }
  | { type: "RESOLVE_BLOCK" };

const initialState: SimState = {
  selectedScenarioId: "onboarding",
  status: "idle",
  cursor: 0,
  speed: 1,
  blocked: false,
};

function reducer(state: SimState, action: Action): SimState {
  switch (action.type) {
    case "SET_SCENARIO":
      return { ...state, selectedScenarioId: action.id, status: "idle", cursor: 0, blocked: false };
    case "PLAY":
      return { ...state, status: state.status === "finished" ? "finished" : "playing" };
    case "PAUSE":
      return { ...state, status: "paused" };
    case "REPLAY":
      return { ...state, status: "playing", cursor: 0, blocked: false };
    case "SET_SPEED":
      return { ...state, speed: action.speed };
    case "ADVANCE": {
      const nextCursor = Math.min(state.cursor + 1, action.stepsLen);
      const finished = nextCursor >= action.stepsLen;
      return {
        ...state,
        cursor: nextCursor,
        blocked: action.nextStepIsBlocking ? true : state.blocked,
        status: finished ? "finished" : state.status,
      };
    }
    case "RESOLVE_BLOCK":
      return { ...state, blocked: false, status: "playing" };
    default:
      return state;
  }
}

// -----------------------------
// 5) UI Components
// -----------------------------
function TypingDots() {
  return (
    <div className="flex items-center gap-1.5">
      <span className="h-2 w-2 rounded-full bg-white/60 animate-bounce [animation-delay:-0.2s]" />
      <span className="h-2 w-2 rounded-full bg-white/60 animate-bounce [animation-delay:-0.1s]" />
      <span className="h-2 w-2 rounded-full bg-white/60 animate-bounce" />
    </div>
  );
}

function ScenarioMenu({
  selected,
  onSelect,
}: {
  selected: ScenarioId;
  onSelect: (id: ScenarioId) => void;
}) {
  return (
    <Card className="bg-zinc-950/40 border-zinc-800 p-3">
      <div className="flex items-center justify-between px-1 pb-2">
        <div className="text-sm font-semibold text-zinc-100">Cenários</div>
        <Badge variant="secondary" className="bg-zinc-900 text-zinc-200 border border-zinc-800">
          Simulador
        </Badge>
      </div>

      <div className="space-y-2">
        {scenarios.map((sc) => {
          const is = sc.id === selected;
          return (
            <button
              key={sc.id}
              onClick={() => onSelect(sc.id)}
              className={cn(
                "w-full text-left rounded-lg border px-3 py-3 transition",
                is
                  ? "border-zinc-700 bg-zinc-900/70"
                  : "border-zinc-900 bg-zinc-950/30 hover:bg-zinc-900/40 hover:border-zinc-800"
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-sm font-semibold text-zinc-100">{sc.title}</div>
                  <div className="text-xs text-zinc-400 mt-0.5">{sc.subtitle}</div>
                </div>
                <ChevronRight className={cn("h-4 w-4 mt-0.5 text-zinc-500", is && "text-zinc-200")} />
              </div>
            </button>
          );
        })}
      </div>
    </Card>
  );
}

function PlayerControls({
  status,
  speed,
  onPlay,
  onPause,
  onReplay,
  onSpeed,
}: {
  status: Status;
  speed: 1 | 1.5 | 2;
  onPlay: () => void;
  onPause: () => void;
  onReplay: () => void;
  onSpeed: (s: 1 | 1.5 | 2) => void;
}) {
  const isPlaying = status === "playing";

  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant={isPlaying ? "secondary" : "default"}
          onClick={() => (isPlaying ? onPause() : onPlay())}
          className={cn(
            "border",
            isPlaying ? "bg-zinc-900 border-zinc-800 text-zinc-100" : "bg-white text-zinc-900 border-white"
          )}
        >
          {isPlaying ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
          {isPlaying ? "Pausar" : "Play"}
        </Button>

        <Button
          size="sm"
          variant="secondary"
          onClick={onReplay}
          className="bg-zinc-900 border border-zinc-800 text-zinc-100"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Replay
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <div className="text-xs text-zinc-400 hidden sm:block">Velocidade</div>
        {[1, 1.5, 2].map((v) => (
          <Button
            key={v}
            size="sm"
            variant="secondary"
            onClick={() => onSpeed(v as 1 | 1.5 | 2)}
            className={cn(
              "bg-zinc-900 border border-zinc-800 text-zinc-100",
              speed === v && "ring-1 ring-white/30"
            )}
          >
            {v}x
          </Button>
        ))}
      </div>
    </div>
  );
}

function MessageRenderer({
  step,
  onButtonClick,
}: {
  step: Step;
  onButtonClick: () => void;
}) {
  const isUser = "from" in step && step.from === "user";
  const align = isUser ? "justify-end" : "justify-start";
  const bubbleBase = "max-w-[82%] rounded-2xl px-3 py-2 text-sm leading-relaxed whitespace-pre-line";
  const bubbleStyle = isUser
    ? "bg-green-500 text-zinc-950"
    : "bg-zinc-900/80 border border-zinc-800 text-zinc-100";

  if (step.type === "typing") {
    return (
      <div className={cn("flex", align)}>
        <div className={cn(bubbleBase, bubbleStyle, "py-2")}>
          <TypingDots />
        </div>
      </div>
    );
  }

  if (step.type === "text") {
    return (
      <div className={cn("flex", align)}>
        <div className={cn(bubbleBase, bubbleStyle)}>{step.content}</div>
      </div>
    );
  }

  if (step.type === "forwarded") {
    return (
      <div className={cn("flex", align)}>
        <div className={cn(bubbleBase, bubbleStyle)}>
          <div className={cn("text-xs mb-1", isUser ? "text-zinc-800" : "text-zinc-400")}>
            Mensagem encaminhada ↪️
          </div>
          <div>{step.content}</div>
        </div>
      </div>
    );
  }

  if (step.type === "audio") {
    return (
      <div className={cn("flex", align)}>
        <div className={cn(bubbleBase, bubbleStyle)}>
          <div className="flex items-center gap-3">
            <div className={cn("h-8 w-8 rounded-full grid place-items-center", isUser ? "bg-black/10" : "bg-white/10")}>
              <Play className={cn("h-4 w-4", isUser ? "text-zinc-950" : "text-zinc-100")} />
            </div>
            <div className="flex-1">
              <div className={cn("h-1.5 rounded-full overflow-hidden", isUser ? "bg-black/10" : "bg-white/10")}>
                <div className={cn("h-full w-[38%] rounded-full", isUser ? "bg-black/30" : "bg-white/30")} />
              </div>
              <div className={cn("mt-1 text-xs", isUser ? "text-zinc-800" : "text-zinc-400")}>
                {step.meta.label ?? "Áudio"} • {formatSeconds(step.meta.seconds)}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step.type === "file") {
    return (
      <div className={cn("flex", align)}>
        <div className={cn(bubbleBase, bubbleStyle)}>
          <div className="flex gap-3">
            {step.meta.thumbSrc ? (
              <img
                src={step.meta.thumbSrc}
                alt="thumb"
                className="h-14 w-20 rounded-lg object-cover border border-zinc-800"
                loading="lazy"
              />
            ) : (
              <div className="h-14 w-20 rounded-lg bg-zinc-800/40 border border-zinc-800" />
            )}
            <div className="min-w-0">
              <div className={cn("text-xs", isUser ? "text-zinc-800" : "text-zinc-400")}>Arquivo</div>
              <div className="text-sm font-semibold break-all">{step.meta.filename}</div>
              {step.meta.caption && (
                <div className={cn("mt-1 text-xs", isUser ? "text-zinc-800" : "text-zinc-400")}>
                  {step.meta.caption}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step.type === "image") {
    return (
      <div className={cn("flex", align)}>
        <div className={cn(bubbleBase, bubbleStyle, "p-2")}>
          <img
            src={step.meta.src}
            alt={step.meta.title}
            className="w-full max-w-[280px] rounded-xl border border-zinc-800 object-cover"
            loading="lazy"
          />
          <div className={cn("mt-1 px-1 text-xs", isUser ? "text-zinc-800" : "text-zinc-400")}>
            {step.meta.title}
          </div>
        </div>
      </div>
    );
  }

  if (step.type === "button") {
    return (
      <div className={cn("flex", align)}>
        <div className={cn(bubbleBase, bubbleStyle, "p-2")}>
          <Button
            onClick={onButtonClick}
            className={cn(
              "w-full rounded-xl",
              isUser ? "bg-zinc-950 text-white hover:bg-zinc-900" : "bg-white text-zinc-900 hover:bg-zinc-100"
            )}
          >
            {step.meta.label}
          </Button>
        </div>
      </div>
    );
  }

  return null;
}

function MessageList({
  steps,
  onButtonClick,
}: {
  steps: Step[];
  onButtonClick: () => void;
}) {
  return (
    <div className="space-y-2">
      <AnimatePresence initial={false}>
        {steps.map((st) => (
          <motion.div
            key={st.id}
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
          >
            <MessageRenderer step={st} onButtonClick={onButtonClick} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

function PhoneStage({
  scenarioTitle,
  steps,
  blocked,
  onButtonClick,
  controls,
}: {
  scenarioTitle: string;
  steps: Step[];
  blocked: boolean;
  onButtonClick: () => void;
  controls: React.ReactNode;
}) {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [steps.length]);

  const last = steps[steps.length - 1];
  const showBlockHint = blocked && last?.type === "button";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-lg font-semibold text-zinc-100">Cérebro do WhatsApp</div>
          <div className="text-sm text-zinc-400">{scenarioTitle}</div>
        </div>
        <div className="hidden md:block">{controls}</div>
      </div>

      <Card className="bg-zinc-950/40 border-zinc-800 p-4">
        <div className="mx-auto max-w-[420px]">
          <div className="rounded-[32px] border border-zinc-800 bg-zinc-950 shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_25px_80px_rgba(0,0,0,0.55)] overflow-hidden">
            <div className="px-4 py-3 border-b border-zinc-900 bg-zinc-950/80">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-zinc-100">
                    GovMesh Assist <span className="text-green-400">✅</span>
                  </div>
                  <div className="text-xs text-zinc-400">Conta Comercial Oficial</div>
                </div>
                <Badge className="bg-zinc-900 border border-zinc-800 text-zinc-200">Online</Badge>
              </div>
            </div>

            <div className="h-[520px] bg-[radial-gradient(ellipse_at_top,rgba(34,197,94,0.10),transparent_50%),radial-gradient(ellipse_at_bottom,rgba(255,255,255,0.03),transparent_55%)]">
              <div ref={scrollRef} className="h-full overflow-y-auto px-3 py-4">
                <MessageList steps={steps} onButtonClick={onButtonClick} />

                {showBlockHint && (
                  <div className="mt-3 flex justify-center">
                    <div className="text-xs text-zinc-400 bg-zinc-950/70 border border-zinc-800 rounded-full px-3 py-1">
                      Clique no botão para continuar
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="px-3 py-3 border-t border-zinc-900 bg-zinc-950/80">
              <div className="h-10 rounded-full bg-zinc-900/60 border border-zinc-800 flex items-center px-4 text-sm text-zinc-500">
                Mensagem...
              </div>
            </div>
          </div>

          <div className="mt-3 md:hidden">{controls}</div>
        </div>
      </Card>
    </div>
  );
}

function BackstagePanel({
  summary,
  chips,
  activeKeys,
}: {
  summary: string;
  chips: { key: BackstageKey; label: string }[];
  activeKeys: Set<BackstageKey>;
}) {
  return (
    <Card className="bg-zinc-950/40 border-zinc-800 p-4">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold text-zinc-100">Nos Bastidores</div>
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <Zap className="h-4 w-4 text-green-400" />
          automação
        </div>
      </div>

      <div className="mt-3 text-sm text-zinc-300 leading-relaxed">{summary}</div>

      <Separator className="my-4 bg-zinc-900" />

      <div className="text-xs font-semibold text-zinc-200 mb-2">Etapas técnicas</div>
      <div className="flex flex-wrap gap-2">
        {chips.map((chip) => {
          const on = activeKeys.has(chip.key);
          return (
            <span
              key={chip.key}
              className={cn(
                "inline-flex items-center rounded-full border px-2.5 py-1 text-xs transition",
                on ? "bg-green-500/10 border-green-500/30 text-green-200" : "bg-zinc-950/30 border-zinc-800 text-zinc-400"
              )}
            >
              <span className={cn("mr-2 h-1.5 w-1.5 rounded-full", on ? "bg-green-400" : "bg-zinc-600")} />
              {chip.label}
            </span>
          );
        })}
      </div>

      <Separator className="my-4 bg-zinc-900" />

      <div className="text-xs text-zinc-500">Dica: use Play, Pause e Velocidade para ver a IA reagindo.</div>
    </Card>
  );
}

// -----------------------------
// 6) Page (with playback timer)
// -----------------------------
export default function SimulatorPage() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const scenario = useMemo(
    () => scenarios.find((x) => x.id === state.selectedScenarioId)!,
    [state.selectedScenarioId]
  );

  const steps = scenario.steps;
  const visibleSteps = useMemo(() => steps.slice(0, state.cursor), [steps, state.cursor]);

  const activeKeys = useMemo(() => {
    const keys = new Set<BackstageKey>();
    visibleSteps.forEach((st) => st.backstageKeys?.forEach((k) => keys.add(k)));
    return keys;
  }, [visibleSteps]);

  const timerRef = useRef<number | null>(null);

  // Playback engine
  useEffect(() => {
    if (timerRef.current) window.clearTimeout(timerRef.current);

    if (state.status !== "playing") return;
    if (state.blocked) return;
    if (state.cursor >= steps.length) return;

    const next = steps[state.cursor];
    const delay = (next.delayMs ?? 0) / state.speed;

    timerRef.current = window.setTimeout(() => {
      const nextStepIsBlocking = next.type === "button" && !!next.blockUntilAction;
      dispatch({ type: "ADVANCE", stepsLen: steps.length, nextStepIsBlocking });
    }, Math.max(0, delay));

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [state.status, state.blocked, state.cursor, state.speed, steps]);

  // Auto-start on first load
  useEffect(() => {
    dispatch({ type: "REPLAY" });
  }, []);

  const controls = (
    <PlayerControls
      status={state.status}
      speed={state.speed}
      onPlay={() => dispatch({ type: "PLAY" })}
      onPause={() => dispatch({ type: "PAUSE" })}
      onReplay={() => dispatch({ type: "REPLAY" })}
      onSpeed={(s) => dispatch({ type: "SET_SPEED", speed: s })}
    />
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-8">
          <div className="text-2xl font-semibold">Simulador Interativo</div>
          <div className="text-sm text-zinc-400 mt-1">
            Selecione um cenário e veja a conversa acontecendo. O painel da direita mostra o que a IA fez por trás.
          </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-3">
            <ScenarioMenu
              selected={state.selectedScenarioId}
              onSelect={(id) => {
                dispatch({ type: "SET_SCENARIO", id });
                dispatch({ type: "REPLAY" });
              }}
            />
          </div>

          <div className="col-span-12 lg:col-span-6">
            <PhoneStage
              scenarioTitle={scenario.title}
              steps={visibleSteps}
              blocked={state.blocked}
              onButtonClick={() => {
                // Clique resolve bloqueio e avança imediatamente para exibir o próximo step (geralmente confirmação do user)
                dispatch({ type: "RESOLVE_BLOCK" });

                // Avança 1 step imediatamente para mostrar "Li e concordo." ou próximo
                const next = steps[state.cursor];
                if (next) {
                  const nextStepIsBlocking = next.type === "button" && !!next.blockUntilAction;
                  dispatch({ type: "ADVANCE", stepsLen: steps.length, nextStepIsBlocking });
                }
              }}
              controls={controls}
            />
          </div>

          <div className="col-span-12 lg:col-span-3 space-y-4">
            <BackstagePanel summary={scenario.backstageSummary} chips={scenario.backstageChips} activeKeys={activeKeys} />

            <Card className="bg-zinc-950/40 border-zinc-800 p-4">
              <div className="text-sm font-semibold text-zinc-100">Assets em /public</div>
              <div className="text-xs text-zinc-500 mt-2">
                Garanta que estes arquivos existam no deploy:
                <div className="mt-2 grid gap-1">
                  <span className="text-zinc-400">/fake-vs-fato-card.png</span>
                  <span className="text-zinc-400">/titulo-eleitor-ocr.jpg</span>
                  <span className="text-zinc-400">/video-hospital-thumb.jpg</span>
                  <span className="text-zinc-400">/campanha-frota.png</span>
                  <span className="text-zinc-400">/gamificacao-metas.png</span>
                </div>
              </div>
              <Separator className="my-4 bg-zinc-900" />
              <div className="text-xs text-zinc-500">
                Estado: <span className="text-zinc-300">{state.status}</span>{" "}
                • Cursor: <span className="text-zinc-300">{state.cursor}</span> / {steps.length}
                {state.blocked ? <span className="text-zinc-300"> • aguardando clique</span> : null}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
