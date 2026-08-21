// ---------------------------------------------------------------------------
// Gerrit Wrapped data
// Replace the fake numbers below with real data when you have it.
// ---------------------------------------------------------------------------

export type UserStats = {
  name: string;
  commits: number;
  merges: number;
  linesAdded: number;
  mostEditedFile: string;
  mostUsedAiTag: string;
  mostTargetedJiraTicket: string;
};

export const users: UserStats[] = [
  {
    name: "Adam",
    commits: 92,
    merges: 43,
    linesAdded: 101635,
    mostEditedFile: "14 chatbot/frontend/src/main.js",
    mostUsedAiTag: "77 [AI:H]",
    mostTargetedJiraTicket: "22 PRARAP-47",
  },
  {
    name: "Christian",
    commits: 110,
    merges: 22,
    linesAdded: 278375,
    mostEditedFile: "13 README.md",
    mostUsedAiTag: "49 [AI:H]",
    mostTargetedJiraTicket: "23 PRARAP-44",
  },
  {
    name: "Nima",
    commits: 92,
    merges: 20,
    linesAdded: 86379,
    mostEditedFile: "10 chatbot/frontend/src/main.js",
    mostUsedAiTag: "66 [AI:H]",
    mostTargetedJiraTicket: "26 PRARAP-47",
  },
  {
    name: "Dilan",
    commits: 37,
    merges: 1,
    linesAdded: 6264,
    mostEditedFile: "17 frontend/src/views/project/SwatDashboardPage.vue",
    mostUsedAiTag: "23 [AI:H]",
    mostTargetedJiraTicket: "19 ONECI-63",
  },
  {
    name: "Theo",
    commits: 65,
    merges: 3,
    linesAdded: 585169,
    mostEditedFile: "14 .kiro/prompts/setup.md",
    mostUsedAiTag: "41 [AI:H]",
    mostTargetedJiraTicket: "3 ONECI-18",
  },
];

export type NumericMetricKey = "commits" | "merges" | "linesAdded";
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
];

export const textMetrics: { key: TextMetricKey; label: string }[] = [
  { key: "mostEditedFile", label: "Most edited file" },
  { key: "mostUsedAiTag", label: "Most used AI tag" },
  { key: "mostTargetedJiraTicket", label: "Most targeted Jira ticket" },
];

export const getUser = (name: string) =>
  users.find((u) => u.name.toLowerCase() === name.toLowerCase());

export const formatNumber = (n: number) => n.toLocaleString("en-US");
