"use client";

import {
  licenseRequests,
  licenseStageLabel,
  licenseStages,
  licenseTypeLabel,
  personById,
  provinceById,
  type LicenseRequest,
  type LicenseStage,
} from "@varzino/demo-data";
import { StatusBadge, type Tone } from "@varzino/ui/components/badge";
import { Button } from "@varzino/ui/components/button";
import { Card } from "@varzino/ui/components/card";
import { CodeChip } from "@varzino/ui/components/code-chip";
import { DescriptionList, EmptyState, Stepper, Table, TD, TH, THead, TR } from "@varzino/ui/components/data-display";
import { Dialog, DialogContent } from "@varzino/ui/components/overlays";
import { daysFromNow, formatDate, formatNumber, formatRelative } from "@varzino/utils";
import { CircleAlert, Inbox } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { MembershipCard } from "@varzino/shared/membership-card";
import { FilterTabs, SearchInput, Toolbar } from "./list-toolbar";

const stageTone: Record<LicenseStage, Tone> = {
  submitted: "neutral",
  board: "info",
  federation: "warning",
  issued: "positive",
  rejected: "negative",
};

export function LicensesView() {
  const [items, setItems] = useState<LicenseRequest[]>(licenseRequests);
  const [stage, setStage] = useState("pending");
  const [q, setQ] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const open = items.find((i) => i.id === openId) ?? null;

  const rows = useMemo(
    () =>
      items.filter(
        (r) =>
          (stage === "all" ||
            (stage === "pending" ? r.stage === "submitted" || r.stage === "board" || r.stage === "federation" : r.stage === stage)) &&
          (!q.trim() || r.applicant.includes(q.trim())),
      ),
    [items, stage, q],
  );

  const pendingCount = items.filter((r) => ["submitted", "board", "federation"].includes(r.stage)).length;

  function approve(r: LicenseRequest) {
    const nextStage: LicenseStage = r.stage === "submitted" ? "board" : r.stage === "board" ? "federation" : "issued";
    setItems((all) => all.map((x) => (x.id === r.id ? { ...x, stage: nextStage, missing: undefined, validUntil: nextStage === "issued" ? daysFromNow(365) : x.validUntil } : x)));
    toast.success(nextStage === "issued" ? `${licenseTypeLabel[r.type]} صادر شد` : `درخواست به مرحله «${licenseStageLabel[nextStage]}» رفت`);
  }

  function reject(r: LicenseRequest) {
    setItems((all) => all.map((x) => (x.id === r.id ? { ...x, stage: "rejected", missing: x.missing ?? "مدارک ناقص" } : x)));
    toast("درخواست رد شد و به متقاضی اطلاع داده شد");
  }

  const person = open && open.type !== "club" ? personById[open.subjectId] : undefined;
  const currentIndex = open ? (open.stage === "rejected" ? 1 : licenseStages.indexOf(open.stage)) : 0;

  return (
    <Card>
      <Toolbar>
        <FilterTabs
          label="مرحله"
          value={stage}
          onChange={setStage}
          options={[
            { value: "pending", label: "در جریان", count: pendingCount },
            { value: "issued", label: "صادر شده", count: items.filter((r) => r.stage === "issued").length },
            { value: "rejected", label: "رد شده", count: items.filter((r) => r.stage === "rejected").length },
            { value: "all", label: "همه", count: items.length },
          ]}
        />
        <SearchInput value={q} onChange={setQ} placeholder="نام متقاضی" />
      </Toolbar>
      {rows.length === 0 ? (
        <EmptyState icon={<Inbox />} title="درخواستی در این مرحله نیست" description="درخواست‌های جدید هیئت‌ها اینجا نمایش داده می‌شود." />
      ) : (
        <Table>
          <THead>
            <TH>شماره</TH>
            <TH>متقاضی</TH>
            <TH>نوع</TH>
            <TH>استان</TH>
            <TH>ثبت</TH>
            <TH>مرحله</TH>
          </THead>
          <tbody>
            {rows.map((r) => (
              <TR key={r.id} onClick={() => setOpenId(r.id)}>
                <TD>
                  <CodeChip value={r.number} />
                </TD>
                <TD>
                  <button type="button" className="cursor-pointer text-start font-medium text-fg hover:underline" onClick={() => setOpenId(r.id)}>
                    {r.applicant}
                  </button>
                  {r.missing && r.stage !== "rejected" ? (
                    <p className="flex items-center gap-1 text-xs text-warning">
                      <CircleAlert aria-hidden className="size-3.5" />
                      {r.missing}
                    </p>
                  ) : null}
                </TD>
                <TD className="text-fg-secondary">{licenseTypeLabel[r.type]}</TD>
                <TD className="text-fg-secondary">{provinceById[r.provinceId]?.name}</TD>
                <TD className="text-fg-secondary">{formatRelative(r.submittedAt)}</TD>
                <TD>
                  <StatusBadge tone={stageTone[r.stage]}>{licenseStageLabel[r.stage]}</StatusBadge>
                </TD>
              </TR>
            ))}
          </tbody>
        </Table>
      )}

      <Dialog open={!!open} onOpenChange={(v) => !v && setOpenId(null)}>
        {open ? (
          <DialogContent side="end" title={licenseTypeLabel[open.type]} description={`درخواست ${open.number}، ${formatDate(open.submittedAt)}`}>
            <div className="flex flex-col gap-6">
              <Stepper
                current={open.stage === "issued" ? licenseStages.length : currentIndex}
                failed={open.stage === "rejected"}
                steps={licenseStages.map((s) => ({ label: licenseStageLabel[s] }))}
              />
              {open.stage === "rejected" ? (
                <div className="rounded-card border border-negative/20 bg-negative-soft p-4 text-sm text-negative">دلیل رد: {open.missing}</div>
              ) : open.missing ? (
                <div className="rounded-card border border-warning/20 bg-warning-soft p-4 text-sm text-warning">کمبود مدرک: {open.missing}</div>
              ) : null}

              <DescriptionList
                items={[
                  { term: "متقاضی", value: open.applicant },
                  { term: "استان", value: provinceById[open.provinceId]?.name ?? "—" },
                  { term: "بررسی‌کننده فعلی", value: open.reviewer ?? "—" },
                  { term: "اعتبار", value: open.validUntil ? `تا ${formatDate(open.validUntil)}` : "پس از صدور، یک سال" },
                ]}
              />

              {person ? (
                <div>
                  <p className="mb-3 text-sm font-medium text-fg">پیش‌نمایش کارت</p>
                  <MembershipCard
                    title={licenseTypeLabel[open.type]}
                    name={person.fullName}
                    code={person.code}
                    validUntil={open.validUntil ?? daysFromNow(365)}
                    rows={[
                      { label: "استان", value: provinceById[person.provinceId]?.name ?? "" },
                      { label: person.grade ? "درجه" : "کمربند", value: person.grade ?? person.belt },
                    ]}
                  />
                </div>
              ) : (
                <div className="rounded-card border border-hairline p-4 text-sm text-fg-secondary">
                  پروانه فعالیت باشگاه پس از بازدید بازرس هیئت و تأیید استاندارد ایمنی سالن صادر می‌شود. آخرین بازدید: {formatNumber(12)} روز پیش.
                </div>
              )}

              {open.stage !== "issued" && open.stage !== "rejected" ? (
                <div className="flex gap-2">
                  <Button onClick={() => approve(open)}>{open.stage === "federation" ? "تأیید و صدور" : "تأیید و ارسال به مرحله بعد"}</Button>
                  <Button variant="secondary" onClick={() => reject(open)}>
                    رد درخواست
                  </Button>
                </div>
              ) : null}
            </div>
          </DialogContent>
        ) : null}
      </Dialog>
    </Card>
  );
}
