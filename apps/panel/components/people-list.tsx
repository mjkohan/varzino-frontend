"use client";

import { clubById, people, provinceById, roleLabel, statusLabel, type PersonRole } from "@varzino/demo-data";
import { StatusBadge } from "@varzino/ui/components/badge";
import { Card } from "@varzino/ui/components/card";
import { CodeChip } from "@varzino/ui/components/code-chip";
import { EmptyState, Table, TD, TH, THead, TR } from "@varzino/ui/components/data-display";
import { NativeSelect } from "@varzino/ui/components/input";
import { Avatar } from "@varzino/ui/components/misc";
import { formatNumber, toPersianDigits } from "@varzino/utils";
import { UserRoundSearch } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { FilterTabs, Pagination, SearchInput, Toolbar } from "./list-toolbar";
import { personStatusTone } from "./tones";


const PAGE = 12;

export function PeopleList() {
  const [role, setRole] = useState<string>("all");
  const [province, setProvince] = useState<string>("all");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(0);
  const router = useRouter();

  const filtered = useMemo(() => {
    const term = q.trim();
    return people.filter(
      (p) =>
        (role === "all" || p.role === role) &&
        (province === "all" || p.provinceId === province) &&
        (!term || p.fullName.includes(term) || toPersianDigits(p.code).includes(toPersianDigits(term))),
    );
  }, [role, province, q]);

  const pageCount = Math.ceil(filtered.length / PAGE);
  const rows = filtered.slice(page * PAGE, page * PAGE + PAGE);
  const provincesInData = [...new Set(people.map((p) => p.provinceId))];
  const roles: PersonRole[] = ["athlete", "coach", "referee"];

  return (
    <Card>
      <Toolbar>
        <FilterTabs
          label="نقش"
          value={role}
          onChange={(v) => {
            setRole(v);
            setPage(0);
          }}
          options={[{ value: "all", label: "همه", count: people.length }, ...roles.map((r) => ({ value: r, label: roleLabel[r], count: people.filter((p) => p.role === r).length }))]}
        />
        <div className="flex flex-col gap-2 sm:flex-row">
          <NativeSelect
            aria-label="استان"
            value={province}
            onChange={(e) => {
              setProvince(e.target.value);
              setPage(0);
            }}
            className="sm:w-44 [&_select]:h-9 [&_select]:text-sm"
          >
            <option value="all">همه استان‌ها</option>
            {provincesInData.map((id) => (
              <option key={id} value={id}>
                {provinceById[id]?.name}
              </option>
            ))}
          </NativeSelect>
          <SearchInput
            value={q}
            onChange={(v) => {
              setQ(v);
              setPage(0);
            }}
            placeholder="نام یا کد عضویت"
          />
        </div>
      </Toolbar>
      {rows.length === 0 ? (
        <EmptyState icon={<UserRoundSearch />} title="کسی با این مشخصات پیدا نشد" description="نام را کوتاه‌تر بنویسید یا فیلتر استان را بردارید." />
      ) : (
        <Table>
          <THead>
            <TH>نام</TH>
            <TH>کد عضویت</TH>
            <TH>نقش</TH>
            <TH>باشگاه و استان</TH>
            <TH>درجه / کمربند</TH>
            <TH>وضعیت</TH>
          </THead>
          <tbody>
            {rows.map((p) => (
              <TR key={p.id} onClick={() => router.push(`/people/${p.id}`)}>
                <TD>
                  <Link href={`/people/${p.id}`} className="flex items-center gap-3">
                    <Avatar name={p.fullName} size={32} />
                    <span>
                      <span className="block font-medium text-fg hover:underline">{p.fullName}</span>
                      <span className="block text-xs text-fg-muted">
                        {formatNumber(p.age)} ساله، {p.ageGroup}
                      </span>
                    </span>
                  </Link>
                </TD>
                <TD>
                  <CodeChip value={p.code} />
                </TD>
                <TD className="text-fg-secondary">{roleLabel[p.role]}</TD>
                <TD className="text-fg-secondary">
                  {clubById[p.clubId]?.name}
                  <span className="block text-xs text-fg-muted">{provinceById[p.provinceId]?.name}</span>
                </TD>
                <TD className="text-fg-secondary">{p.grade ?? p.belt}</TD>
                <TD>
                  <StatusBadge tone={personStatusTone[p.status]}>{statusLabel[p.status]}</StatusBadge>
                </TD>
              </TR>
            ))}
          </tbody>
        </Table>
      )}
      <Pagination page={page} pageCount={pageCount} total={filtered.length} onPage={setPage} />
    </Card>
  );
}
