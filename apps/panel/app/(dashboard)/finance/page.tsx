import { settlementStatusLabel, txKindLabel } from "@varzino/demo-data";
import { Legend, TrendChart } from "@varzino/ui/charts/charts";
import { StatusBadge, type Tone } from "@varzino/ui/components/badge";
import { Button } from "@varzino/ui/components/button";
import { Card, CardBody, CardHeader } from "@varzino/ui/components/card";
import { BarList, PageHeader, Stat, Table, TD, TH, THead, TR } from "@varzino/ui/components/data-display";
import { formatDate, formatNumber, formatPercent, formatToman, formatTomanCompact, toPersianDigits } from "@varzino/utils";
import { ArrowDownLeft, Download } from "lucide-react";
import type { Metadata } from "next";
import { LogoMark } from "@varzino/shared/logo";
import { TransactionsTable } from "@/components/transactions-table";
import { getData } from "@/lib/session";

export const metadata: Metadata = { title: "مالی و کیف پول" };

const settlementTone: Record<string, Tone> = { paid: "positive", scheduled: "info", "awaiting-docs": "warning" };

/** The wallet as an object: an account card with the balance as the figure. */
async function WalletCard() {
  const { wallet } = await getData();
  return (
    <div
      className="relative flex min-h-56 flex-col justify-between overflow-hidden rounded-panel p-6 text-white"
      style={{
        background: "linear-gradient(150deg, #0f6b50 0%, #0a4f3b 100%)",
        boxShadow: "0 14px 32px -12px rgb(10 79 59 / 0.45), inset 0 1px 0 rgb(255 255 255 / 0.12)",
      }}
    >
      <svg aria-hidden className="absolute -bottom-10 -end-10 size-56 opacity-[0.08]" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="48" fill="none" stroke="#fff" strokeWidth="1.5" />
        <circle cx="50" cy="50" r="30" fill="none" stroke="#fff" strokeWidth="1.5" />
        <line x1="2" y1="50" x2="98" y2="50" stroke="#fff" strokeWidth="1.5" />
      </svg>
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-sm text-white/70">موجودی کیف پول فدراسیون</p>
          <p className="tabular mt-2 text-3xl font-medium">{formatToman(wallet.balance, false)}</p>
          <p className="text-sm text-white/70">تومان</p>
        </div>
        <LogoMark size={30} className="[&_rect:first-child]:fill-white/15" />
      </div>
      <div className="relative flex items-end justify-between gap-4 text-sm">
        <div>
          <p className="text-white/60">شبا</p>
          <bdi dir="ltr" className="tabular text-white/90">
            {toPersianDigits(wallet.iban)}
          </bdi>
        </div>
        <div className="text-end">
          <p className="text-white/60">در انتظار تسویه</p>
          <p className="tabular text-white/90">{formatTomanCompact(wallet.pendingSettlement)}</p>
        </div>
      </div>
    </div>
  );
}

export default async function FinancePage() {
  const { cashflow, incomeBySource, settlements, wallet } = await getData();
  const totalIncome = incomeBySource.reduce((s, i) => s + i.amount, 0);
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="مالی و کیف پول"
        description="دریافت‌ها، پرداخت‌ها و تسویه سهم هیئت‌ها"
        actions={
          <>
            <Button variant="secondary">
              <Download />
              گزارش ماهانه
            </Button>
            <Button>
              <ArrowDownLeft />
              تسویه با هیئت‌ها
            </Button>
          </>
        }
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,4fr)_minmax(0,8fr)]">
        <WalletCard />
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          <Stat
            label="دریافتی آبان"
            value={formatTomanCompact(wallet.incomeThisMonth)}
            change={{ value: ((wallet.incomeThisMonth - wallet.incomeLastMonth) / wallet.incomeLastMonth) * 100, against: "مهر" }}
          />
          <Stat label="پرداختی آبان" value={formatTomanCompact(wallet.outgoingThisMonth)} hint="بیشترین: تسویه هیئت‌ها" />
          <Stat label="پرداخت ناموفق" value={formatNumber(14)} hint="۲٫۱٪ تراکنش‌های درگاه" className="col-span-2 lg:col-span-1" />
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,8fr)_minmax(0,4fr)]">
        <Card>
          <CardHeader
            title="جریان نقدی"
            description="دریافت و پرداخت، ۱۲ ماه اخیر"
            className="flex-col sm:flex-row"
            action={
              <Legend
                series={[
                  { key: "income", label: "دریافت" },
                  { key: "outgoing", label: "پرداخت", emphasis: false },
                ]}
              />
            }
          />
          <CardBody>
            <TrendChart
              data={cashflow}
              xKey="month"
              height={280}
              valueFormat="toman"
              series={[
                { key: "income", label: "دریافت" },
                { key: "outgoing", label: "پرداخت", emphasis: false },
              ]}
            />
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="دریافتی به تفکیک منبع" description={`امسال، مجموع ${formatTomanCompact(totalIncome)}`} />
          <CardBody>
            <BarList
              highlightFirst
              format={(n) => formatPercent((n / totalIncome) * 100)}
              items={incomeBySource.map((i) => ({ key: i.kind, label: txKindLabel[i.kind], value: i.amount }))}
            />
          </CardBody>
        </Card>
      </div>

      <TransactionsTable />

      <Card>
        <CardHeader title="تسویه با هیئت‌ها" description="سهم ۳۰ درصدی هیئت از ورودیه، حق عضویت و شهریه، آبان ۱۴۰۵" />
        <Table className="mt-4">
          <THead>
            <TH>هیئت</TH>
            <TH>دوره</TH>
            <TH numeric>سهم</TH>
            <TH>سررسید</TH>
            <TH>وضعیت</TH>
            <TH numeric>مبلغ (تومان)</TH>
          </THead>
          <tbody>
            {settlements.map((s) => (
              <TR key={s.id}>
                <TD className="font-medium">{s.board}</TD>
                <TD className="text-fg-secondary">{s.period}</TD>
                <TD numeric className="text-fg-secondary">
                  {formatPercent(s.share)}
                </TD>
                <TD className="text-fg-secondary">{formatDate(s.dueDate)}</TD>
                <TD>
                  <StatusBadge tone={settlementTone[s.status]}>{settlementStatusLabel[s.status]}</StatusBadge>
                </TD>
                <TD numeric className="font-medium">
                  {formatToman(s.amount, false)}
                </TD>
              </TR>
            ))}
          </tbody>
        </Table>
      </Card>
    </div>
  );
}
