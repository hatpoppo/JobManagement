import { Badge } from "@/components/ui/badge";
import { type phaseEnum } from "@/db/schema";

type Phase = (typeof phaseEnum.enumValues)[number];

const PHASE_LABELS: Record<Phase, string> = {
  new: "新規",
  negotiating: "商談中",
  proposed: "提案",
  won: "受注",
  lost: "失注",
};

const PHASE_VARIANTS: Record<Phase, "default" | "secondary" | "destructive" | "outline"> = {
  new: "secondary",
  negotiating: "default",
  proposed: "default",
  won: "outline",
  lost: "destructive",
};

export function PhaseBadge({ phase }: { phase: Phase }) {
  return (
    <Badge variant={PHASE_VARIANTS[phase]}>{PHASE_LABELS[phase]}</Badge>
  );
}
