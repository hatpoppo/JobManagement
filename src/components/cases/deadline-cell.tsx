import { cn } from "@/lib/utils";

function getDeadlineStatus(deadline: string | null) {
  if (!deadline) return "normal";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(deadline);
  const diff = Math.floor((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  if (diff < 0) return "overdue";
  if (diff === 0) return "today";
  if (diff <= 3) return "soon";
  return "normal";
}

export function DeadlineCell({ deadline }: { deadline: string | null }) {
  if (!deadline) return <span className="text-muted-foreground">-</span>;

  const status = getDeadlineStatus(deadline);
  const formatted = new Date(deadline).toLocaleDateString("ja-JP");

  return (
    <span
      className={cn(
        "font-medium rounded px-1.5 py-0.5",
        (status === "today" || status === "overdue") && "text-red-600 bg-red-50",
        status === "soon" && "text-yellow-600 bg-yellow-50",
      )}
    >
      {formatted}
      {status === "today" && " ⚠️"}
      {status === "overdue" && " ⚠️"}
      {status === "soon" && " !"}
    </span>
  );
}
