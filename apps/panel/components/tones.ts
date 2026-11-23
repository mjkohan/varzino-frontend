import type { CompetitionStatus, PersonStatus } from "@varzino/demo-data";
import type { Tone } from "@varzino/ui/components/badge";

export const statusTone: Record<CompetitionStatus, Tone> = {
  draft: "neutral",
  registration: "info",
  scheduled: "accent",
  live: "negative",
  finished: "neutral",
};

export const personStatusTone: Record<PersonStatus, Tone> = {
  active: "positive",
  pending: "warning",
  suspended: "negative",
  expired: "neutral",
};
