import type { SpeechGateBlockedReason } from "@app/speech/evaluateSpeechGate";

export type BlockedMessageForParams = {
  readonly reason: SpeechGateBlockedReason;
};

export function blockedMessageFor(params: BlockedMessageForParams): string {
  const { reason } = params;

  if (reason === "missing-api") {
    return "Aquest navegador no admet la síntesi de veu o no està disponible. Per jugar cal un navegador amb suport per a veu en català (ca-ES).";
  }

  return "No s'ha trobat cap veu en català (ca-ES). Activa o instal·la una veu catalana al sistema i torna a provar.";
}
