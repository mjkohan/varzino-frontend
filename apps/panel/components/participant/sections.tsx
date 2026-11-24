"use client";

import { courseStatusLabel, me, myCourses, myDocuments, myPayments, myWallet, openCoursesForMe, provinceById, trackLabel, type Course } from "@varzino/demo-data";
import { StatusBadge } from "@varzino/ui/components/badge";
import { Button } from "@varzino/ui/components/button";
import { Card, CardBody, CardHeader } from "@varzino/ui/components/card";
import { CodeChip } from "@varzino/ui/components/code-chip";
import { Field, Input, Textarea } from "@varzino/ui/components/input";
import { Progress } from "@varzino/ui/components/misc";
import { Table, TD, TH, THead, TR } from "@varzino/ui/components/data-display";
import { MembershipCard } from "@varzino/shared/membership-card";
import { daysFromNow, formatDate, formatNumber, formatPercent, formatToman } from "@varzino/utils";
import { Download, Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

/* ---------------- Courses ---------------- */

export function MyCoursesView() {
  const [enrolled, setEnrolled] = useState<string[]>([]);
  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardHeader title="دوره‌های من" />
        <ul className="mt-2 flex flex-col px-5 pb-3">
          {myCourses.map((c) => (
            <li key={c.id} className="flex flex-col gap-2 border-b border-hairline py-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="font-medium text-fg">{c.title}</p>
                <p className="text-xs text-fg-muted">شروع {formatDate(c.date)}</p>
              </div>
              {c.status === "passed" ? (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-fg-secondary">نمره {formatNumber(c.score ?? 0)}</span>
                  <CodeChip value={c.serial ?? ""} />
                  <Button size="sm" variant="secondary" onClick={() => toast.success("فایل گواهی آماده دانلود است")}>
                    <Download />
                    گواهی
                  </Button>
                </div>
              ) : (
                <div className="flex w-full max-w-60 items-center gap-3">
                  <Progress value={c.progress ?? 0} label="پیشرفت دوره" />
                  <span className="tabular shrink-0 text-xs text-fg-secondary">{formatPercent(c.progress ?? 0)}</span>
                </div>
              )}
            </li>
          ))}
        </ul>
      </Card>

      <Card>
        <CardHeader title="دوره‌های قابل ثبت‌نام" description="دوره‌هایی که پیش‌نیاز آن را دارید یا برای همه آزاد است" />
        <ul className="mt-2 flex flex-col px-5 pb-3">
          {openCoursesForMe.map((c: Course) => {
            const done = enrolled.includes(c.id);
            return (
              <li key={c.id} className="flex flex-col gap-3 border-b border-hairline py-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="font-medium text-fg">{c.title}</p>
                  <p className="text-sm text-fg-muted">
                    {trackLabel[c.track]}، {c.mode}، {formatDate(c.startDate)}، {formatNumber(c.hours)} ساعت
                  </p>
                  <p className="text-xs text-fg-muted">
                    پیش‌نیاز: {c.prerequisite}، شهریه {c.fee ? formatToman(c.fee) : "رایگان"}
                  </p>
                </div>
                {done ? (
                  <StatusBadge tone="positive">ثبت‌نام شدید</StatusBadge>
                ) : c.status === "planned" ? (
                  <StatusBadge>{courseStatusLabel.planned}</StatusBadge>
                ) : (
                  <Button
                    className="shrink-0"
                    onClick={() => {
                      setEnrolled((e) => [...e, c.id]);
                      toast.success(c.fee ? `ثبت‌نام انجام شد و ${formatToman(c.fee)} از کیف پول کسر شد` : "ثبت‌نام انجام شد");
                    }}
                  >
                    ثبت‌نام
                  </Button>
                )}
              </li>
            );
          })}
        </ul>
      </Card>
    </div>
  );
}

/* ---------------- Membership card ---------------- */

export function MyCardView() {
  const [renewed, setRenewed] = useState(false);
  const [insurance, setInsurance] = useState(false);
  const province = provinceById[me.provinceId];
  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <Card>
        <CardBody className="flex flex-col items-center gap-4">
          <MembershipCard
            title="کارت عضویت ورزشکار"
            name={me.fullName}
            code={me.code}
            validUntil={daysFromNow(renewed ? 683 : 318)}
            rows={[
              { label: "استان", value: province?.name ?? "" },
              { label: "کمربند", value: me.belt },
            ]}
          />
          <div className="grid w-full grid-cols-2 gap-2">
            <Button variant="secondary" onClick={() => toast.success("فایل کارت برای چاپ آماده شد")}>
              <Download />
              دریافت کارت
            </Button>
            <Button variant="secondary" onClick={() => toast("کد استعلام کارت کپی شد")}>
              کد استعلام
            </Button>
          </div>
          <p className="text-center text-xs leading-6 text-fg-muted">هر کسی می‌تواند اصالت کارت را با کد عضویت در صفحه استعلام فدراسیون بررسی کند.</p>
        </CardBody>
      </Card>

      <div className="flex flex-col gap-4">
        <Card>
          <CardHeader title="تمدید عضویت" description="عضویت سالانه، از تاریخ پرداخت یک سال" />
          <CardBody className="flex flex-col gap-4">
            <div className="flex items-baseline justify-between rounded-card bg-raised px-4 py-3">
              <span className="text-sm text-fg-secondary">حق عضویت ۱۴۰۶</span>
              <span className="tabular text-lg font-medium text-fg">{formatToman(3_000_000)}</span>
            </div>
            {renewed ? (
              <StatusBadge tone="positive">تمدید شد، کارت جدید صادر شد</StatusBadge>
            ) : (
              <Button
                onClick={() => {
                  setRenewed(true);
                  toast.success("عضویت تمدید شد و اعتبار کارت یک سال افزایش یافت");
                }}
              >
                پرداخت و تمدید
              </Button>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="بیمه ورزشی" description="بیمه ۱۴۰۵ شما ۴۵ روز دیگر منقضی می‌شود" />
          <CardBody className="flex flex-col gap-4">
            {insurance ? (
              <StatusBadge tone="info">بیمه‌نامه بارگذاری شد، در انتظار تأیید هیئت</StatusBadge>
            ) : (
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={() => {
                    setInsurance(true);
                    toast.success("بیمه‌نامه بارگذاری شد و برای تأیید به هیئت رفت");
                  }}
                >
                  <Upload />
                  بارگذاری بیمه‌نامه جدید
                </Button>
                <Button variant="secondary" onClick={() => toast("به سامانه صندوق بیمه ورزشی منتقل می‌شوید")}>
                  خرید بیمه
                </Button>
              </div>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="مدارک من" />
          <ul className="mt-2 flex flex-col px-5 pb-3">
            {myDocuments.map((d) => (
              <li key={d.id} className="flex items-center justify-between gap-3 border-b border-hairline py-3 last:border-b-0">
                <div>
                  <p className="text-sm text-fg">{d.title}</p>
                  <p className="text-xs text-fg-muted">به‌روزرسانی {formatDate(d.updated)}</p>
                </div>
                {d.status === "approved" ? <StatusBadge tone="positive">تأیید شده</StatusBadge> : <StatusBadge tone="warning">رو به انقضا</StatusBadge>}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}

/* ---------------- Payments ---------------- */

export function MyPaymentsView() {
  const [balance, setBalance] = useState(myWallet.balance);
  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardBody className="flex flex-col gap-3">
            <p className="text-sm text-fg-secondary">موجودی کیف پول</p>
            <p className="tabular text-3xl font-medium text-fg">{formatToman(balance)}</p>
            <div className="flex gap-2">
              {[2_000_000, 5_000_000].map((amt) => (
                <Button
                  key={amt}
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setBalance((b) => b + amt);
                    toast.success(`${formatToman(amt)} به کیف پول اضافه شد`);
                  }}
                >
                  افزایش {formatToman(amt)}
                </Button>
              ))}
            </div>
          </CardBody>
        </Card>
        <Card>
          <CardBody className="flex flex-col gap-3">
            <p className="text-sm text-fg-secondary">پرداخت‌های امسال</p>
            <p className="tabular text-3xl font-medium text-fg">
              {formatToman(myPayments.filter((p) => p.amount > 0).reduce((s, p) => s + p.amount, 0))}
            </p>
            <p className="text-sm text-fg-muted">ورودیه مسابقه، شهریه دوره و حق عضویت</p>
          </CardBody>
        </Card>
      </div>
      <Card>
        <Table>
          <THead>
            <TH>شرح</TH>
            <TH>تاریخ</TH>
            <TH>پیگیری</TH>
            <TH>وضعیت</TH>
            <TH numeric>مبلغ</TH>
            <TH />
          </THead>
          <tbody>
            {myPayments.map((p) => (
              <TR key={p.id}>
                <TD className="font-medium">{p.title}</TD>
                <TD className="text-fg-secondary">{formatDate(p.date)}</TD>
                <TD>
                  <CodeChip value={p.ref} />
                </TD>
                <TD>
                  <StatusBadge tone={p.status === "paid" ? "positive" : p.status === "pending" ? "warning" : "neutral"}>
                    {p.status === "paid" ? "موفق" : p.status === "pending" ? "در انتظار" : "بازگشت داده شد"}
                  </StatusBadge>
                </TD>
                <TD numeric>
                  <bdi dir="ltr">
                    {p.amount > 0 ? "−" : "+"}
                    {formatToman(Math.abs(p.amount), false)}
                  </bdi>
                </TD>
                <TD>
                  <Button size="sm" variant="ghost" onClick={() => toast.success("رسید پرداخت آماده دانلود است")}>
                    رسید
                  </Button>
                </TD>
              </TR>
            ))}
          </tbody>
        </Table>
        <p className="border-t border-hairline px-5 py-3 text-xs text-fg-muted">مبالغ به تومان</p>
      </Card>
    </div>
  );
}

/* ---------------- Profile edit ---------------- */

export function ProfileEdit() {
  const [phone, setPhone] = useState(me.phone);
  const [address, setAddress] = useState("خیابان آزادی، کوچه ۱۲، پلاک ۸");
  const [emergency, setEmergency] = useState("۰۹۱۲۳۴۵۶۷۸۹");
  return (
    <Card>
      <CardHeader title="اطلاعات تماس" description="نام، کد ملی و تاریخ تولد فقط با درخواست به هیئت تغییر می‌کند" />
      <CardBody>
        <form
          className="grid gap-5 sm:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault();
            toast.success("اطلاعات تماس ذخیره شد");
          }}
        >
          <Field label="تلفن همراه" htmlFor="phone">
            <Input id="phone" dir="ltr" className="text-end" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </Field>
          <Field label="تلفن اضطراری" htmlFor="em" hint="ولی یا یکی از نزدیکان">
            <Input id="em" dir="ltr" className="text-end" value={emergency} onChange={(e) => setEmergency(e.target.value)} />
          </Field>
          <Field label="نشانی" htmlFor="addr" className="sm:col-span-2">
            <Textarea id="addr" rows={2} value={address} onChange={(e) => setAddress(e.target.value)} />
          </Field>
          <div className="sm:col-span-2">
            <Button type="submit">ذخیره تغییرات</Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}
