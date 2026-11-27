"use client";

import { txKindLabel, txStatusLabel, type TxStatus } from "@varzino/demo-data";
import { StatusBadge, type Tone } from "@varzino/ui/components/badge";
import { Card } from "@varzino/ui/components/card";
import { CodeChip } from "@varzino/ui/components/code-chip";
import { Table, TD, TH, THead, TR } from "@varzino/ui/components/data-display";
import { cn } from "@varzino/ui/lib/cn";
import { formatDateTime, formatToman } from "@varzino/utils";
import { useMemo, useState } from "react";
import { FilterTabs, SearchInput, Toolbar } from "./list-toolbar";
import { useData } from "@/components/data-provider";

const tone: Record<TxStatus, Tone> = { paid: "positive", pending: "warning", failed: "negative", refunded: "neutral" };

export function TransactionsTable() {
  const { transactions } = useData();
  const [dir, setDir] = useState("all");
  const [q, setQ] = useState("");
  const rows = useMemo(
    () =>
      transactions.filter(
        (t) =>
          (dir === "all" || (dir === "in" ? t.amount > 0 : t.amount < 0)) &&
          (!q.trim() || t.title.includes(q.trim()) || t.party.includes(q.trim())),
      ),
    [transactions, dir, q],
  );
  return (
    <Card>
      <Toolbar>
        <FilterTabs
          label="جهت تراکنش"
          value={dir}
          onChange={setDir}
          options={[
            { value: "all", label: "همه" },
            { value: "in", label: "دریافت" },
            { value: "out", label: "پرداخت" },
          ]}
        />
        <SearchInput value={q} onChange={setQ} placeholder="شرح یا طرف حساب" />
      </Toolbar>
      <Table>
        <THead>
          <TH>شرح</TH>
          <TH>نوع</TH>
          <TH>طرف حساب</TH>
          <TH>زمان</TH>
          <TH>پیگیری</TH>
          <TH>وضعیت</TH>
          <TH numeric>مبلغ</TH>
        </THead>
        <tbody>
          {rows.map((t) => (
            <TR key={t.id}>
              <TD className="font-medium">{t.title}</TD>
              <TD className="text-fg-secondary">{txKindLabel[t.kind]}</TD>
              <TD className="text-fg-secondary">{t.party}</TD>
              <TD className="text-fg-secondary">{formatDateTime(t.date)}</TD>
              <TD>
                <CodeChip value={t.ref} />
              </TD>
              <TD>
                <StatusBadge tone={tone[t.status]}>{txStatusLabel[t.status]}</StatusBadge>
              </TD>
              <TD numeric className={cn("font-medium", t.amount > 0 ? "text-fg" : "text-fg-secondary")}>
                <bdi dir="ltr">
                  {t.amount > 0 ? "+" : "−"}
                  {formatToman(Math.abs(t.amount), false)}
                </bdi>
              </TD>
            </TR>
          ))}
        </tbody>
      </Table>
      <p className="border-t border-hairline px-5 py-3 text-xs text-fg-muted">مبالغ به تومان</p>
    </Card>
  );
}
