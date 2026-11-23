"use client";

import { certificates, courses, courseStatusLabel, trackLabel, type Course, type CourseStatus } from "@varzino/demo-data";
import { StatusBadge, type Tone } from "@varzino/ui/components/badge";
import { Button } from "@varzino/ui/components/button";
import { Card, CardHeader } from "@varzino/ui/components/card";
import { CodeChip } from "@varzino/ui/components/code-chip";
import { DescriptionList, Table, TD, TH, THead, TR } from "@varzino/ui/components/data-display";
import { Progress } from "@varzino/ui/components/misc";
import { Dialog, DialogContent } from "@varzino/ui/components/overlays";
import { formatDate, formatNumber, formatToman } from "@varzino/utils";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { FilterTabs } from "./list-toolbar";

const tone: Record<CourseStatus, Tone> = { enrolling: "info", running: "accent", finished: "neutral", planned: "neutral" };

export function EducationView() {
  const [status, setStatus] = useState("all");
  const [open, setOpen] = useState<Course | null>(null);
  const rows = useMemo(() => courses.filter((c) => status === "all" || c.status === status), [status]);

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <div className="border-b border-hairline px-5 py-3">
          <FilterTabs
            label="وضعیت دوره"
            value={status}
            onChange={setStatus}
            options={[
              { value: "all", label: "همه", count: courses.length },
              ...(["enrolling", "running", "planned", "finished"] as CourseStatus[]).map((s) => ({
                value: s,
                label: courseStatusLabel[s],
                count: courses.filter((c) => c.status === s).length,
              })),
            ]}
          />
        </div>
        <Table>
          <THead>
            <TH>دوره</TH>
            <TH>حوزه</TH>
            <TH>شروع</TH>
            <TH>شیوه</TH>
            <TH className="w-48">ظرفیت</TH>
            <TH>وضعیت</TH>
          </THead>
          <tbody>
            {rows.map((c) => (
              <TR key={c.id} onClick={() => setOpen(c)}>
                <TD>
                  <button type="button" className="cursor-pointer text-start font-medium text-fg hover:underline" onClick={() => setOpen(c)}>
                    {c.title}
                  </button>
                  <p className="text-xs text-fg-muted">
                    {c.instructor}، {formatNumber(c.hours)} ساعت
                  </p>
                </TD>
                <TD className="text-fg-secondary">{trackLabel[c.track]}</TD>
                <TD className="text-fg-secondary">{formatDate(c.startDate)}</TD>
                <TD className="text-fg-secondary">
                  {c.mode}
                  {c.mode !== "مجازی" ? <span className="text-fg-muted">، {c.city}</span> : null}
                </TD>
                <TD>
                  <div className="flex items-center gap-3">
                    <Progress value={c.enrolled} max={c.capacity} className="w-24" tone={c.status === "enrolling" ? "accent" : "muted"} label="ظرفیت" />
                    <span className="tabular text-xs text-fg-secondary">
                      {formatNumber(c.enrolled)} از {formatNumber(c.capacity)}
                    </span>
                  </div>
                </TD>
                <TD>
                  <StatusBadge tone={tone[c.status]}>{courseStatusLabel[c.status]}</StatusBadge>
                </TD>
              </TR>
            ))}
          </tbody>
        </Table>
      </Card>

      <Card>
        <CardHeader title="گواهی‌های صادرشده اخیر" description="هر گواهی با شماره سریال، از صفحه استعلام عمومی قابل بررسی است" />
        <Table className="mt-4">
          <THead>
            <TH>شماره سریال</TH>
            <TH>دارنده</TH>
            <TH>دوره</TH>
            <TH>صدور</TH>
            <TH numeric>نمره</TH>
          </THead>
          <tbody>
            {certificates.map((c) => (
              <TR key={c.id}>
                <TD>
                  <CodeChip value={c.serial} />
                </TD>
                <TD className="font-medium">{c.holder}</TD>
                <TD className="text-fg-secondary">{c.course}</TD>
                <TD className="text-fg-secondary">{formatDate(c.issuedAt)}</TD>
                <TD numeric>{formatNumber(c.score)}</TD>
              </TR>
            ))}
          </tbody>
        </Table>
      </Card>

      <Dialog open={!!open} onOpenChange={(v) => !v && setOpen(null)}>
        {open ? (
          <DialogContent side="end" title={open.title} description={`${trackLabel[open.track]}، سطح ${open.level}`}>
            <div className="flex flex-col gap-6">
              <DescriptionList
                className="sm:grid-cols-2"
                items={[
                  { term: "مدرس", value: open.instructor },
                  { term: "شروع", value: formatDate(open.startDate) },
                  { term: "مدت", value: `${formatNumber(open.hours)} ساعت` },
                  { term: "شیوه برگزاری", value: open.mode === "مجازی" ? "مجازی" : `${open.mode}، ${open.city}` },
                  { term: "شهریه", value: open.fee ? formatToman(open.fee) : "رایگان" },
                  { term: "ظرفیت", value: `${formatNumber(open.enrolled)} از ${formatNumber(open.capacity)}` },
                ]}
              />
              <div className="rounded-card border border-hairline bg-raised/60 p-4">
                <p className="text-sm font-medium text-fg">پیش‌نیاز</p>
                <p className="mt-1 text-sm text-fg-secondary">{open.prerequisite}</p>
              </div>
              {open.passed !== undefined ? (
                <div>
                  <div className="flex items-baseline justify-between text-sm">
                    <span className="text-fg-secondary">قبولی</span>
                    <span className="tabular font-medium">
                      {formatNumber(open.passed)} از {formatNumber(open.enrolled)}
                    </span>
                  </div>
                  <Progress className="mt-2" value={open.passed} max={open.enrolled} label="نرخ قبولی" />
                </div>
              ) : null}
              <div className="flex gap-2">
                {open.status === "finished" ? (
                  <Button onClick={() => toast.success("گواهی‌ها برای صدور در صف قرار گرفت")}>صدور گواهی‌ها</Button>
                ) : (
                  <Button onClick={() => toast.success("لینک ثبت‌نام برای هیئت‌ها ارسال شد")}>ارسال فراخوان به هیئت‌ها</Button>
                )}
                <Button variant="secondary" onClick={() => toast("فهرست حضور و غیاب دانلود شد")}>
                  فهرست حضور و غیاب
                </Button>
              </div>
            </div>
          </DialogContent>
        ) : null}
      </Dialog>
    </div>
  );
}
