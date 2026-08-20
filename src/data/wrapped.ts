// ---------------------------------------------------------------------------
// Gerrit Wrapped data
// Replace the fake numbers below with real data when you have it.
// ---------------------------------------------------------------------------

export type UserStats = {
  name: string;
  commits: number;
  merges: number;
  linesAdded: number;
  reviews: number;
  mostEditedFile: string;
  mostUsedAiTag: string;
  mostTargetedJiraTicket: string;
};

export const users: UserStats[] = [
  {
    name: "Adam",
    commits: 412,
    merges: 168,
    linesAdded: 38420,
    reviews: 231,
    mostEditedFile: "src/core/scheduler.ts",
    mostUsedAiTag: "ai-assisted",
    mostTargetedJiraTicket: "PLAT-1042",
  },
  {
    name: "Christian",
    commits: 287,
    merges: 201,
    linesAdded: 51230,
    reviews: 189,
    mostEditedFile: "services/auth/handler.go",
    mostUsedAiTag: "ai-generated",
    mostTargetedJiraTicket: "AUTH-318",
  },
  {
    name: "Nima",
    commits: 523,
    merges: 142,
    linesAdded: 27890,
    reviews: 344,
    mostEditedFile: "src/ui/Dashboard.tsx",
    mostUsedAiTag: "ai-reviewed",
    mostTargetedJiraTicket: "WEB-2207",
  },
  {
    name: "Dilan",
    commits: 198,
    merges: 96,
    linesAdded: 64110,
    reviews: 127,
    mostEditedFile: "infra/terraform/main.tf",
    mostUsedAiTag: "no-ai",
    mostTargetedJiraTicket: "INFRA-77",
  },
  {
    name: "Theo",
    commits: 341,
    merges: 233,
    linesAdded: 19075,
    reviews: 402,
    mostEditedFile: "packages/api/client.ts",
    mostUsedAiTag: "ai-assisted",
    mostTargetedJiraTicket: "API-905",
  },
];

export type NumericMetricKey = "commits" | "merges" | "linesAdded" | "reviews";
export type TextMetricKey =
  | "mostEditedFile"
  | "mostUsedAiTag"
  | "mostTargetedJiraTicket";

export const numericMetrics: {
  key: NumericMetricKey;
  label: string;
  accent: "lime" | "pink" | "sky" | "amber";
}[] = [
  { key: "commits", label: "Commits", accent: "lime" },
  { key: "merges", label: "Merges", accent: "pink" },
  { key: "linesAdded", label: "Lines added", accent: "sky" },
  { key: "reviews", label: "Reviews made", accent: "amber" },
];

export const textMetrics: { key: TextMetricKey; label: string }[] = [
  { key: "mostEditedFile", label: "Most edited file" },
  { key: "mostUsedAiTag", label: "Most used AI tag" },
  { key: "mostTargetedJiraTicket", label: "Most targeted Jira ticket" },
];

export const getUser = (name: string) =>
  users.find((u) => u.name.toLowerCase() === name.toLowerCase());

export const formatNumber = (n: number) => n.toLocaleString("en-US");
