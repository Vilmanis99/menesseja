/**
 * Client-safe types + display metadata for "senču gudrība" contributions.
 * No server imports here, so client components (the /iesutit page) can pull in
 * CONTRIBUTION_META without dragging the Neon driver into the browser bundle.
 * The server query functions live in `lib/neon/contributions.ts`.
 */

export type ContributionType = "recepte" | "ticejums" | "paraza";
export type ContributionStatus = "pending" | "approved" | "rejected";

export const CONTRIBUTION_META: Record<ContributionType, { label: string; icon: string }> = {
  recepte: { label: "Recepte", icon: "science" },
  ticejums: { label: "Ticējums", icon: "auto_stories" },
  paraza: { label: "Paraža", icon: "diversity_3" },
};

export interface ApprovedContribution {
  id: string;
  type: ContributionType;
  title: string;
  body: string;
  region: string | null;
  authorName: string | null;
  createdAt: string; // ISO UTC
}

export interface MyContribution {
  id: string;
  type: ContributionType;
  title: string;
  status: ContributionStatus;
}

export interface PendingContribution extends ApprovedContribution {
  status: ContributionStatus;
}
