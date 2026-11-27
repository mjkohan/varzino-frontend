import { categoryLabel, getDataset } from "@varzino/demo-data";
import { Button } from "@varzino/ui/components/button";
import { daysFromNow, formatNumber } from "@varzino/utils";
import { Bracket } from "@varzino/shared/bracket";
import { MembershipCard } from "@varzino/shared/membership-card";
import { panelLoginUrl } from "@varzino/shared/urls";

function LiveDot() {
  return (
    <span className="relative inline-flex size-2">
      <span aria-hidden className="absolute inset-0 rounded-full bg-negative" />
    </span>
  );
}

/** Product view: the live national championship as the panel shows it. */
function LiveCompetitionView() {
  // The landing page shows the para federation's live championship.
  const { bracketFor, competitionById, disciplineName, me: athlete, medalTable, profile, provinceById } = getDataset("para");
  const live = competitionById["c-1"]!;
  const rounds = bracketFor(live.id);
  return (
    <div className="relative">
      <div className="overflow-hidden rounded-panel border border-hairline bg-surface shadow-float">
        {/* window bar */}
        <div className="flex items-center justify-between gap-3 border-b border-hairline bg-raised/60 px-4 py-2.5">
          <div className="flex items-center gap-2 text-sm">
            <LiveDot />
            <span className="font-medium">{live.title}</span>
            <span className="hidden text-fg-muted sm:inline">روز دوم، {live.venue}</span>
          </div>
          <span className="text-xs text-fg-muted">{categoryLabel(athlete.category)}</span>
        </div>

        <div className="grid gap-0 lg:grid-cols-[1fr_200px]">
          <div className="p-4">
            <Bracket rounds={rounds} fromRound={1} compact className="[&>div]:min-w-0" />
          </div>
          <aside className="hidden border-s border-hairline p-4 lg:block">
            <p className="mb-2 text-xs text-fg-muted">جدول مدال استان‌ها</p>
            <ol className="flex flex-col">
              {medalTable.slice(0, 5).map((row, i) => (
                <li key={row.provinceId} className="flex h-8 items-center gap-2 text-sm">
                  <span className="tabular w-3 text-xs text-fg-muted">{formatNumber(i + 1)}</span>
                  <span className="flex-1 truncate">{provinceById[row.provinceId]?.name}</span>
                  <span className="tabular flex items-center gap-1 text-xs text-fg-secondary">
                    <span aria-hidden className="size-1.5 rounded-full bg-gold" />
                    {formatNumber(row.gold)}
                  </span>
                </li>
              ))}
            </ol>
          </aside>
        </div>
      </div>

      {/* The physical moment: a membership card resting over the window edge */}
      <div className="pointer-events-none absolute -bottom-20 end-4 hidden w-[300px] -rotate-3 sm:block md:end-[-40px] lg:w-[320px]">
        <MembershipCard
          title="کارت عضویت ورزشکار"
          federation={profile.name}
          name={athlete.fullName}
          code={athlete.code}
          validUntil={daysFromNow(318)}
          rows={[
            { label: "استان", value: provinceById[athlete.provinceId]?.name ?? "" },
            { label: "رشته", value: disciplineName(athlete.disciplineId) },
          ]}
        />
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-[1200px] items-center gap-12 px-4 pb-24 pt-12 md:px-8 md:pt-20 lg:min-h-[min(calc(100dvh-64px),820px)] lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14 lg:pb-28 lg:pt-12">
        <div className="max-w-xl">
          <p className="enter mb-5 text-sm text-fg-secondary">برای فدراسیون‌ها، هیئت‌های استانی و باشگاه‌ها</p>
          <h1 className="enter text-[34px] font-semibold leading-[1.45] text-fg md:text-[44px] md:leading-[1.4]">
            از ثبت‌نام ورزشکار تا جدول مدال، کار فدراسیون در یک سامانه
          </h1>
          <p className="enter-2 mt-5 text-lg leading-[1.9] text-fg-secondary">
            ورزینو پرونده ورزشکاران، مسابقات و رنکینگ، دوره‌های آموزشی، کارت‌ها و مجوزها و حساب مالی هیئت‌ها را یکجا نگه می‌دارد،
            تا فدراسیون هر روز تصویر دقیق و به‌روز از ۳۱ استان داشته باشد.
          </p>
          <div className="enter-3 mt-8 flex flex-wrap items-center gap-3">
            <Button asChild size="xl">
              <a href={panelLoginUrl}>ورود به سامانه</a>
            </Button>
            <Button asChild size="xl" variant="secondary">
              <a href="#contact">درخواست جلسه معرفی</a>
            </Button>
          </div>
        </div>
        <div className="enter-2 min-w-0">
          <LiveCompetitionView />
        </div>
      </div>
    </section>
  );
}
