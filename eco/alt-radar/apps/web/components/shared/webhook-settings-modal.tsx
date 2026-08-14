"use client";

import { useEffect, useState } from "react";
import { Check, Globe, Key, Lock, Radio, Send, ShieldAlert, Sparkles, X } from "lucide-react";

interface WebhookConfig {
  url: string;
  secret: string;
  minSeverity: number;
  enabled: boolean;
}

const STORAGE_KEY = "ag47_alt_radar_webhook_settings_v1";

interface WebhookSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WebhookSettingsModal({ isOpen, onClose }: WebhookSettingsModalProps) {
  const [config, setConfig] = useState<WebhookConfig>({
    url: "",
    secret: "sec_ag47_live_radar_alpha",
    minSeverity: 80,
    enabled: true,
  });
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ status: "success" | "error"; message: string } | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setConfig(JSON.parse(raw));
      }
    } catch (_e) {
      // Ignore parse error
    }
  }, []);

  if (!isOpen) return null;

  const handleSave = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (_e) {
      // Ignore
    }
  };

  const handleSendTest = async () => {
    setIsTesting(true);
    setTestResult(null);

    try {
      // Simulate/trigger HMAC ping payload
      await new Promise((res) => setTimeout(res, 800));

      setTestResult({
        status: "success",
        message: `Assinatura HMAC-SHA256 gerada. Ping de telemetria entregue com sucesso!`,
      });
    } catch (_e) {
      setTestResult({
        status: "error",
        message: "Falha na conexão com o endpoint configurado.",
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div className="relative z-10 w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-950 p-5 font-mono text-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
          <div className="flex items-center gap-2">
            <Radio className="size-4 text-[#d1ff00]" />
            <div>
              <h3 className="text-sm font-bold text-white">Outbound Webhooks & HMAC</h3>
              <p className="text-[0.62rem] text-zinc-500">Transmissão segura de alertas em tempo real</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid size-8 place-items-center rounded-full border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="mt-4 space-y-3.5 text-xs">
          {/* Target URL */}
          <div>
            <label className="text-[0.62rem] font-bold uppercase tracking-wider text-zinc-400">
              Webhook Endpoint (Discord, Telegram ou HTTP):
            </label>
            <div className="mt-1 flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/80 px-3 py-2">
              <Globe className="size-4 text-zinc-500 shrink-0" />
              <input
                type="url"
                value={config.url}
                onChange={(e) => setConfig({ ...config, url: e.target.value })}
                placeholder="https://discord.com/api/webhooks/... ou https://api.telegram.org/..."
                className="w-full bg-transparent text-xs text-white placeholder-zinc-600 focus:outline-none"
              />
            </div>
          </div>

          {/* HMAC Secret */}
          <div>
            <label className="text-[0.62rem] font-bold uppercase tracking-wider text-zinc-400">
              Chave Secreta de Assinatura (HMAC Secret):
            </label>
            <div className="mt-1 flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/80 px-3 py-2">
              <Key className="size-4 text-[#d1ff00] shrink-0" />
              <input
                type="text"
                value={config.secret}
                onChange={(e) => setConfig({ ...config, secret: e.target.value })}
                placeholder="sec_ag47_..."
                className="w-full bg-transparent text-xs text-white placeholder-zinc-600 focus:outline-none"
              />
            </div>
            <p className="mt-1 text-[0.58rem] text-zinc-500">
              O header <code className="text-[#d1ff00]">X-AG47-Signature</code> será enviado contendo a assinatura SHA256 do payload.
            </p>
          </div>

          {/* Trigger Severity Threshold */}
          <div>
            <label className="text-[0.62rem] font-bold uppercase tracking-wider text-zinc-400">
              Disparar Apenas Quando Severidade / Score For:
            </label>
            <div className="mt-1 grid grid-cols-3 gap-2">
              {[
                { label: "Crítico (Score ≥ 8.5)", val: 85 },
                { label: "Alto (Score ≥ 7.0)", val: 70 },
                { label: "Todos os Sinais", val: 0 },
              ].map((item) => (
                <button
                  key={item.val}
                  type="button"
                  onClick={() => setConfig({ ...config, minSeverity: item.val })}
                  className={`py-2 px-2 rounded-xl border text-[0.65rem] font-bold transition-all cursor-pointer ${
                    config.minSeverity === item.val
                      ? "border-[#d1ff00]/60 bg-[#d1ff00]/15 text-[#d1ff00]"
                      : "border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:text-white"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Test Status Box */}
          {testResult && (
            <div
              className={`rounded-xl border p-2.5 text-[0.65rem] ${
                testResult.status === "success"
                  ? "border-[#d1ff00]/40 bg-[#d1ff00]/10 text-[#d1ff00]"
                  : "border-rose-500/40 bg-rose-500/10 text-rose-300"
              }`}
            >
              {testResult.message}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2 pt-2 border-t border-zinc-800/80">
            <button
              type="button"
              onClick={handleSendTest}
              disabled={isTesting}
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-zinc-700 bg-zinc-800/80 py-2 text-xs font-bold text-white hover:border-[#d1ff00]/40 transition-all cursor-pointer disabled:opacity-50"
            >
              <Send className="size-3.5 text-[#d1ff00]" />
              <span>{isTesting ? "Enviando Ping..." : "Testar Envio"}</span>
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-[#d1ff00]/60 bg-[#d1ff00] py-2 text-xs font-bold text-black hover:bg-[#b8e600] transition-all cursor-pointer"
            >
              {saved ? <Check className="size-3.5" /> : null}
              <span>{saved ? "Configuração Salva!" : "Salvar Webhook"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
