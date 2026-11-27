"use client";

import { getDataset, type Dataset, type FederationId } from "@varzino/demo-data";
import { createContext, useContext } from "react";
import type { SessionUser } from "@/lib/session";

type Ctx = { data: Dataset; user: SessionUser };

const DataContext = createContext<Ctx | null>(null);

/** Only the federation id crosses the server/client boundary; the data set is rebuilt deterministically here. */
export function DataProvider({ user, children }: { user: SessionUser; children: React.ReactNode }) {
  return <DataContext.Provider value={{ data: getDataset(user.federationId as FederationId), user }}>{children}</DataContext.Provider>;
}

function useCtx(): Ctx {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used inside <DataProvider>");
  return ctx;
}

/** Data set of the signed-in account's federation. */
export function useData(): Dataset {
  return useCtx().data;
}

export function useSessionUser(): SessionUser {
  return useCtx().user;
}
