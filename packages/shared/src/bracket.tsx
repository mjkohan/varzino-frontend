import { provinceById, roundLabel, type BracketMatch } from "@varzino/demo-data";
import { cn } from "@varzino/ui/lib/cn";
import { formatNumber, toPersianDigits } from "@varzino/utils";

function Side({ side, won, decided, compact }: { side: BracketMatch["a"]; won: boolean; decided: boolean; compact?: boolean }) {
  if (!side) return <div className="h-10" />;
  return (
    <div className={cn("relative flex h-10 items-center gap-2 px-3 text-sm", decided && !won && "text-fg-muted")}>
      {won ? <span aria-hidden className="absolute inset-y-2 start-0 w-0.5 rounded-full bg-accent" /> : null}
      <span className="tabular w-4 shrink-0 text-xs text-fg-muted">{side.seed ? formatNumber(side.seed) : ""}</span>
      <span className={cn("min-w-0 flex-1 truncate", won && "font-medium text-fg")}>{side.person.fullName}</span>
      <span className={cn("hidden shrink-0 text-xs text-fg-muted", !compact && "sm:inline")}>{provinceById[side.person.provinceId]?.name}</span>
      <span className={cn("tabular w-6 shrink-0 text-end", won ? "font-semibold text-fg" : "text-fg-muted")}>
        {side.score === undefined ? "–" : formatNumber(side.score)}
      </span>
    </div>
  );
}

function MatchCard({ match, compact }: { match: BracketMatch; compact?: boolean }) {
  const decided = !!match.winner;
  return (
    <div className="w-full rounded-[10px] border border-hairline bg-surface shadow-sm">
      <Side side={match.a} won={match.winner === "a"} decided={decided} compact={compact} />
      <div className="h-px bg-hairline" />
      <Side side={match.b} won={match.winner === "b"} decided={decided} compact={compact} />
      <div className="flex items-center justify-between border-t border-hairline px-3 py-1 text-[11px] text-fg-muted">
        <span>زمین {toPersianDigits(match.mat)}</span>
        <span className="tabular">{decided ? "پایان" : `ساعت ${match.time}`}</span>
      </div>
    </div>
  );
}

/** Rounds flow from the inline start (right in RTL) toward the final. */
export function Bracket({
  rounds,
  fromRound = 0,
  compact,
  className,
}: {
  rounds: BracketMatch[][];
  fromRound?: number;
  compact?: boolean;
  className?: string;
}) {
  const shown = rounds.slice(fromRound);
  return (
    <div className={cn("scrollbar-thin overflow-x-auto", className)}>
      <div className="flex min-w-[640px] gap-6">
        {shown.map((matches, i) => (
          <div key={roundLabel[i + fromRound] ?? i} className="flex flex-1 flex-col">
            <p className="mb-3 text-xs text-fg-muted">{roundLabel[i + fromRound]}</p>
            <div className="flex flex-1 flex-col justify-around gap-4">
              {matches.map((m) => (
                <MatchCard key={m.id} match={m} compact={compact} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
