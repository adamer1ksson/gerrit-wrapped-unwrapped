// ---------------------------------------------------------------------------
// Gerrit Wrapped data
// Replace the fake numbers below with real data when you have it.
// ---------------------------------------------------------------------------

export type UserStats = {
  name: string;
  commits: number;
  merges: number;
  linesAdded: number;
  reviewsMade: number;
  mostEditedFile: string;
  mostUsedAiTag: string;
  mostTargetedJiraTicket: string;
};

export const users: UserStats[] = [
  {
    name: "Adam",
    commits: 105,
    merges: 43,
    linesAdded: 152025,
    reviewsMade: 80,
    mostEditedFile: "14 chatbot/frontend/src/main.js",
    mostUsedAiTag: "89 [AI:H]",
    mostTargetedJiraTicket: "22 PRARAP-47",
  },
  {
    name: "Christian",
    commits: 156,
    merges: 22,
    linesAdded: 343643,
    reviewsMade: 35,
    mostEditedFile: "13 README.md",
    mostUsedAiTag: "91 [AI:H]",
    mostTargetedJiraTicket: "23 PRARAP-44",
  },
  {
    name: "Nima",
    commits: 98,
    merges: 20,
    linesAdded: 105054,
    reviewsMade: 52,
    mostEditedFile: "10 chatbot/frontend/src/main.js",
    mostUsedAiTag: "71 [AI:H]",
    mostTargetedJiraTicket: "26 PRARAP-47",
  },
  {
    name: "Dilan",
    commits: 37,
    merges: 1,
    linesAdded: 6264,
    reviewsMade: 0,
    mostEditedFile: "17 frontend/src/views/project/SwatDashboardPage.vue",
    mostUsedAiTag: "23 [AI:H]",
    mostTargetedJiraTicket: "19 ONECI-63",
  },
  {
    name: "Theo",
    commits: 67,
    merges: 3,
    linesAdded: 590848,
    reviewsMade: 4,
    mostEditedFile: "14 .kiro/prompts/setup.md",
    mostUsedAiTag: "43 [AI:H]",
    mostTargetedJiraTicket: "3 ONECI-18",
  },
];

export type NumericMetricKey = "commits" | "merges" | "linesAdded" | "reviewsMade";
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
  { key: "reviewsMade", label: "Reviews made", accent: "amber" },
];

export const textMetrics: { key: TextMetricKey; label: string }[] = [
  { key: "mostEditedFile", label: "Most edited file" },
  { key: "mostUsedAiTag", label: "Most used AI tag" },
  { key: "mostTargetedJiraTicket", label: "Most targeted Jira ticket" },
];

export const getUser = (name: string) =>
  users.find((u) => u.name.toLowerCase() === name.toLowerCase());

export const formatNumber = (n: number) => n.toLocaleString("en-US");
