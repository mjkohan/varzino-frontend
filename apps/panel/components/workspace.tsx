"use client";

import { type WsField, type WsRecord } from "@varzino/demo-data";
import { StatusBadge } from "@varzino/ui/components/badge";
import { Button } from "@varzino/ui/components/button";
import { Card, CardHeader } from "@varzino/ui/components/card";
import { CodeChip } from "@varzino/ui/components/code-chip";
import { DescriptionList, EmptyState, Stepper, Table, TD, TH, THead, TR } from "@varzino/ui/components/data-display";
import { Field, Input, NativeSelect, Textarea } from "@varzino/ui/components/input";
import { Avatar, Progress } from "@varzino/ui/components/misc";
import { Dialog, DialogContent } from "@varzino/ui/components/overlays";
import { formatPercent, toPersianDigits } from "@varzino/utils";
import { Inbox, Plus, ShieldCheck } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { FilterTabs, SearchInput, Toolbar } from "./list-toolbar";
import { useData } from "@/components/data-provider";

function toLatin(s: string) {
  return s.replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d)));
}

function CellContent({ kind, value }: { kind?: string; value: string }) {
  if (!value) return <span className="text-fg-muted">—</span>;
  switch (kind) {
    case "code":
      return <CodeChip value={value} />;
    case "person":
      return (
        <span className="flex items-center gap-3">
          <Avatar name={value} size={28} />
          <span className="font-medium text-fg">{value}</span>
        </span>
      );
    case "title":
      return <span className="font-medium text-fg">{value}</span>;
    case "progress": {
      const n = Number(toLatin(value)) || 0;
      return (
        <span className="flex items-center gap-3">
          <Progress value={n} className="w-20" tone={n >= 70 ? "accent" : n >= 45 ? "muted" : "warning"} label="پیشرفت" />
          <span className="tabular text-xs text-fg-secondary">{formatPercent(n)}</span>
        </span>
      );
    }
    case "muted":
      return <span className="text-fg-secondary">{value}</span>;
    default:
      return <>{value}</>;
  }
}

function FieldInput({ f, value, onChange, error }: { f: WsField; value: string; onChange: (v: string) => void; error?: string }) {
  const id = `f-${f.key}`;
  return (
    <Field label={f.label} htmlFor={id} hint={f.hint} error={error} className={f.type === "textarea" ? "sm:col-span-2" : undefined}>
      {f.type === "select" ? (
        <NativeSelect id={id} value={value} onChange={(e) => onChange(e.target.value)}>
          {f.options?.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </NativeSelect>
      ) : f.type === "textarea" ? (
        <Textarea id={id} rows={4} value={value} onChange={(e) => onChange(e.target.value)} aria-invalid={!!error} />
      ) : (
        <Input
          id={id}
          value={value}
          placeholder={f.placeholder}
          inputMode={f.type === "number" ? "numeric" : undefined}
          dir={f.ltr || f.type === "number" ? "ltr" : undefined}
          className={f.ltr || f.type === "number" ? "text-end" : undefined}
          onChange={(e) => onChange(e.target.value)}
          aria-invalid={!!error}
        />
      )}
    </Field>
  );
}

/** Six-digit code step standing in for the digital-signature token. */
function SignatureDialog({ open, onClose, onSigned, subject }: { open: boolean; onClose: () => void; onSigned: () => void; subject: string }) {
  const [code, setCode] = useState("");
  const valid = toLatin(code).replace(/\D/g, "").length === 6;
  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) {
          setCode("");
          onClose();
        }
      }}
    >
      <DialogContent title="امضای دیجیتال" description={subject}>
        <div className="flex flex-col gap-5">
          <div className="flex items-start gap-3 rounded-card border border-hairline bg-raised/60 p-4 text-sm text-fg-secondary">
            <ShieldCheck aria-hidden className="mt-0.5 size-5 shrink-0 text-accent-ink" />
            کد شش‌رقمی به تلفن همراه امضاکننده ارسال شد.
          </div>
          <Field label="کد تأیید" htmlFor="otp">
            <Input
              id="otp"
              dir="ltr"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              className="tabular text-center text-lg tracking-[0.4em]"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </Field>
          <Button
            disabled={!valid}
            onClick={() => {
              setCode("");
              onSigned();
            }}
          >
            ثبت امضا
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function ModuleWorkspace({ id }: { id: string }) {
  const { workspaces } = useData();
  const ws = workspaces[id]!;
  const [records, setRecords] = useState<WsRecord[]>(ws.records);
  const [status, setStatus] = useState("all");
  const [q, setQ] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [signing, setSigning] = useState(false);
  const [form, setForm] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const open = records.find((x) => x.id === openId) ?? null;
  const wf = ws.workflow;

  const rows = useMemo(() => {
    const term = q.trim();
    return records.filter(
      (x) => (status === "all" || x.status === status) && (!term || Object.values(x.cells).some((v) => v.includes(term))),
    );
  }, [records, status, q]);

  const statusKeys = Object.keys(ws.statuses).filter((s) => records.some((x) => x.status === s));

  function advance(rec: WsRecord) {
    if (!wf) return;
    const next = (rec.stage ?? 0) + 1;
    const last = wf.stages.length - 1;
    const nextStatus = next >= last ? wf.doneStatus : (wf.stageStatus?.[next] ?? rec.status);
    setRecords((all) => all.map((x) => (x.id === rec.id ? { ...x, stage: Math.min(next, last), status: nextStatus } : x)));
    toast.success(next >= last ? `${ws.entity}: ${ws.statuses[wf.doneStatus]?.label}` : `${ws.entity} به مرحله «${wf.stages[next]}» رفت`);
  }

  function reject(rec: WsRecord) {
    if (!wf?.rejectStatus) return;
    const back = wf.rejectStatus === wf.stageStatus?.[0];
    setRecords((all) => all.map((x) => (x.id === rec.id ? { ...x, status: wf.rejectStatus!, stage: back ? 0 : x.stage } : x)));
    toast(`${wf.rejectLabel ?? "رد"} ثبت شد و به طرف مقابل اطلاع داده شد`);
  }

  function startCreate() {
    const init: Record<string, string> = {};
    ws.create.fields.forEach((f) => (init[f.key] = f.type === "select" ? (f.options?.[0] ?? "") : ""));
    setForm(init);
    setErrors({});
    setCreating(true);
  }

  function submitCreate() {
    const e: Record<string, string> = {};
    ws.create.fields.forEach((f) => {
      if (f.required && !form[f.key]?.trim()) e[f.key] = `${f.label} را وارد کنید`;
    });
    setErrors(e);
    if (Object.keys(e).length) return;
    const cells: Record<string, string> = {};
    ws.columns.forEach((c) => (cells[c.key] = form[c.key] ? toPersianDigits(form[c.key]!) : c.kind === "progress" ? "0" : "—"));
    if (ws.columns[0]?.kind === "code") cells[ws.columns[0].key] = `۱۴۰۵/جدید/${toPersianDigits(records.length + 1)}`;
    const extra: [string, string][] = ws.create.fields
      .filter((f) => !ws.columns.some((c) => c.key === f.key) && form[f.key])
      .map((f) => [f.label, toPersianDigits(form[f.key]!)]);
    const rec: WsRecord = { id: `new-${Date.now()}`, cells, status: ws.create.status, stage: wf ? 0 : undefined, extra };
    setRecords((all) => [rec, ...all]);
    setCreating(false);
    setStatus("all");
    toast.success(ws.create.success);
  }

  const titleCol = ws.columns.find((c) => c.kind === "title" || c.kind === "person") ?? ws.columns[0]!;
  const inFlow = !!wf && open?.stage !== undefined;
  const stageIndex = open?.stage ?? 0;
  const finished = !!open && !!wf && (open.status === wf.doneStatus || stageIndex >= wf.stages.length - 1);
  const rejected = !!open && !!wf?.rejectStatus && open.status === wf.rejectStatus && wf.rejectStatus !== wf.stageStatus?.[0];
  const needsSignature = !!wf && wf.signatureStage === stageIndex;

  return (
    <Card>
      <CardHeader
        title={ws.title}
        description={ws.description}
        className="flex-col sm:flex-row"
        action={
          <Button onClick={startCreate}>
            <Plus />
            {ws.create.label}
          </Button>
        }
      />
      <div className="mt-4">
        <Toolbar>
          <FilterTabs
            label="وضعیت"
            value={status}
            onChange={setStatus}
            options={[
              { value: "all", label: "همه", count: records.length },
              ...statusKeys.map((s) => ({ value: s, label: ws.statuses[s]!.label, count: records.filter((x) => x.status === s).length })),
            ]}
          />
          <SearchInput value={q} onChange={setQ} />
        </Toolbar>
      </div>

      {rows.length === 0 ? (
        <EmptyState icon={<Inbox />} title={`${ws.entity}ی با این مشخصات نیست`} description="فیلتر وضعیت را روی «همه» بگذارید یا عبارت دیگری جست‌وجو کنید." />
      ) : (
        <Table>
          <THead>
            {ws.columns.map((c) => (
              <TH key={c.key}>{c.label}</TH>
            ))}
            <TH>وضعیت</TH>
          </THead>
          <tbody>
            {rows.map((x) => (
              <TR key={x.id} onClick={() => setOpenId(x.id)}>
                {ws.columns.map((c, i) => (
                  <TD key={c.key}>
                    {i === ws.columns.indexOf(titleCol) ? (
                      <button type="button" className="cursor-pointer text-start hover:underline" onClick={() => setOpenId(x.id)}>
                        <CellContent kind={c.kind} value={x.cells[c.key] ?? ""} />
                      </button>
                    ) : (
                      <CellContent kind={c.kind} value={x.cells[c.key] ?? ""} />
                    )}
                  </TD>
                ))}
                <TD>
                  <StatusBadge tone={ws.statuses[x.status]?.tone}>{ws.statuses[x.status]?.label}</StatusBadge>
                </TD>
              </TR>
            ))}
          </tbody>
        </Table>
      )}

      {/* Detail sheet */}
      <Dialog open={!!open && !signing} onOpenChange={(v) => !v && setOpenId(null)}>
        {open ? (
          <DialogContent side="end" title={open.cells[titleCol.key] ?? ws.entity} description={ws.statuses[open.status]?.label}>
            <div className="flex flex-col gap-6">
              {wf && inFlow ? (
                <Stepper
                  steps={wf.stages.map((s) => ({ label: s }))}
                  current={finished ? wf.stages.length : stageIndex}
                  failed={rejected}
                />
              ) : null}

              {open.note ? <div className="rounded-card border border-warning/20 bg-warning-soft p-4 text-sm leading-7 text-warning">{open.note}</div> : null}

              <DescriptionList
                items={[
                  ...ws.columns
                    .filter((c) => c.key !== titleCol.key)
                    .map((c) => ({
                      term: c.label,
                      value: c.kind === "progress" ? formatPercent(Number(toLatin(open.cells[c.key] ?? "0")) || 0) : open.cells[c.key] || "—",
                    })),
                  ...(open.extra ?? []).map(([term, value]) => ({ term, value })),
                ]}
              />

              {wf && inFlow && !finished && !rejected ? (
                <div className="flex flex-wrap gap-2 border-t border-hairline pt-5">
                  {needsSignature ? (
                    <Button onClick={() => setSigning(true)}>
                      <ShieldCheck />
                      امضای دیجیتال
                    </Button>
                  ) : (
                    <Button onClick={() => advance(open)}>{wf.actions?.[stageIndex] ?? "تأیید و ارسال به مرحله بعد"}</Button>
                  )}
                  {wf.rejectStatus && open.status !== wf.rejectStatus ? (
                    <Button variant="secondary" onClick={() => reject(open)}>
                      {wf.rejectLabel ?? "رد"}
                    </Button>
                  ) : null}
                </div>
              ) : wf && inFlow ? (
                <p className="border-t border-hairline pt-5 text-sm text-fg-muted">
                  {rejected ? "این مورد بسته شده است." : `همه مراحل انجام شده است: ${wf.stages[wf.stages.length - 1]}.`}
                </p>
              ) : null}
            </div>
          </DialogContent>
        ) : null}
      </Dialog>

      {open ? (
        <SignatureDialog
          open={signing}
          subject={open.cells[titleCol.key] ?? ""}
          onClose={() => setSigning(false)}
          onSigned={() => {
            setSigning(false);
            advance(open);
          }}
        />
      ) : null}

      {/* Create */}
      <Dialog open={creating} onOpenChange={setCreating}>
        <DialogContent title={ws.create.title} description={ws.description} className="max-w-xl">
          <form
            noValidate
            className="grid gap-5 sm:grid-cols-2"
            onSubmit={(e) => {
              e.preventDefault();
              submitCreate();
            }}
          >
            {ws.create.fields.map((f) => (
              <FieldInput key={f.key} f={f} value={form[f.key] ?? ""} error={errors[f.key]} onChange={(v) => setForm((s) => ({ ...s, [f.key]: v }))} />
            ))}
            <div className="flex gap-2 sm:col-span-2">
              <Button type="submit">{ws.create.submit}</Button>
              <Button type="button" variant="ghost" onClick={() => setCreating(false)}>
                انصراف
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
