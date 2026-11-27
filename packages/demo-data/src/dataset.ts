import { buildCompetitions } from "./competitions";
import { buildDashboard } from "./dashboard";
import { buildEducation } from "./education";
import type { FederationId, FederationProfile } from "./federations";
import { buildFinance } from "./finance";
import { buildLicenses } from "./licenses";
import { buildOrganizations } from "./organizations";
import { buildOverviews } from "./overviews";
import { buildParticipant } from "./participant";
import { buildPeople } from "./people";
import { assoc } from "./profiles/assoc";
import { para } from "./profiles/para";
import { buildProvinces } from "./provinces";
import { buildRanking } from "./ranking";
import { buildConversations, buildWorkspaces } from "./workspaces";

export const federations: Record<FederationId, FederationProfile> = { para, assoc };

export function createDataset(profile: FederationProfile) {
  const provinces = buildProvinces(profile.scale, profile.seed);
  const people = buildPeople(profile, provinces.provinces);
  const competitions = buildCompetitions(profile, people.people);
  const ranking = buildRanking(profile, people.people);
  const education = buildEducation(profile);
  const licenses = buildLicenses(people.people, people.clubs, profile.scale);
  const finance = buildFinance(profile, competitions.competitions, people.clubs, education.courses);
  const organizations = buildOrganizations(profile, provinces.provinces, people.clubs);
  const dashboard = buildDashboard(profile);
  const participant = buildParticipant(profile, people.people, competitions.competitions, education.courses);
  return {
    profile,
    ...provinces,
    ...people,
    ...competitions,
    ...ranking,
    ...education,
    ...licenses,
    ...finance,
    ...organizations,
    ...dashboard,
    ...participant,
    overviews: buildOverviews(profile),
    workspaces: buildWorkspaces(profile),
    conversations: buildConversations(profile),
  };
}

export type Dataset = ReturnType<typeof createDataset>;

const cache = new Map<FederationId, Dataset>();

/** One memoized data set per federation; identical on server and client. */
export function getDataset(id: FederationId): Dataset {
  let d = cache.get(id);
  if (!d) {
    d = createDataset(federations[id]);
    cache.set(id, d);
  }
  return d;
}

export function isFederationId(id: unknown): id is FederationId {
  return id === "para" || id === "assoc";
}
