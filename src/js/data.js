/** Synthetic sample data for the PulseBoard demo. No real social accounts are connected. */
export const platforms = ["Instagram", "TikTok", "YouTube", "X"];

export const posts = [
  { id: "PB-1048", title: "5 small habits for a more creative week", platform: "Instagram", date: "2026-10-25", reach: 18420, likes: 1264, comments: 83, shares: 142, engagement: 8.1, status: "Published", type: "Carousel", color: "lavender", initials: "5H" },
  { id: "PB-1047", title: "Behind the scenes: our new workspace", platform: "TikTok", date: "2026-10-24", reach: 22680, likes: 1932, comments: 106, shares: 310, engagement: 10.3, status: "Published", type: "Short video", color: "mint", initials: "BS" },
  { id: "PB-1046", title: "A 60-second guide to better storytelling", platform: "YouTube", date: "2026-10-23", reach: 15640, likes: 872, comments: 74, shares: 95, engagement: 6.7, status: "Published", type: "Video", color: "peach", initials: "60" },
  { id: "PB-1045", title: "A question for our community: what inspires you?", platform: "X", date: "2026-10-22", reach: 9680, likes: 482, comments: 128, shares: 66, engagement: 7.0, status: "Published", type: "Text", color: "sky", initials: "Q?" },
  { id: "PB-1044", title: "Three design details you might have missed", platform: "Instagram", date: "2026-10-21", reach: 14210, likes: 1048, comments: 67, shares: 121, engagement: 8.7, status: "Published", type: "Carousel", color: "butter", initials: "3D" },
  { id: "PB-1043", title: "Quick tips for staying consistent", platform: "TikTok", date: "2026-10-28", reach: 0, likes: 0, comments: 0, shares: 0, engagement: 0, status: "Scheduled", type: "Short video", color: "mint", initials: "QT" },
  { id: "PB-1042", title: "Monthly roundup: ideas worth saving", platform: "YouTube", date: "2026-10-30", reach: 0, likes: 0, comments: 0, shares: 0, engagement: 0, status: "Scheduled", type: "Video", color: "peach", initials: "MR" },
  { id: "PB-1041", title: "Draft: what we learned this month", platform: "Instagram", date: "2026-10-31", reach: 0, likes: 0, comments: 0, shares: 0, engagement: 0, status: "Draft", type: "Carousel", color: "lavender", initials: "WL" }
];

export const campaigns = [
  { id: "CMP-01", name: "Fall content series", platform: "Instagram", start: "2026-10-01", end: "2026-10-31", budget: 900, progress: 82, status: "Active", accent: "purple" },
  { id: "CMP-02", name: "Creator notes", platform: "TikTok", start: "2026-10-05", end: "2026-11-05", budget: 650, progress: 64, status: "Active", accent: "green" },
  { id: "CMP-03", name: "How-to video playlist", platform: "YouTube", start: "2026-09-10", end: "2026-10-20", budget: 500, progress: 100, status: "Completed", accent: "orange" },
  { id: "CMP-04", name: "Community questions", platform: "X", start: "2026-11-01", end: "2026-11-30", budget: 400, progress: 12, status: "Planned", accent: "blue" }
];

export const chartSeries = {
  7:  [14600, 17400, 16900, 20400, 21800, 19200, 28120],
  30: [9200, 11300, 10100, 15700, 13900, 19400, 17200, 24600, 21900, 28120],
  90: [6800, 9300, 8300, 12100, 10900, 15300, 14700, 18700, 16900, 23000, 21500, 28120]
};

export const channelShares = [
  { name: "Instagram", share: 42, followers: 35399, className: "instagram-dot" },
  { name: "TikTok", share: 28, followers: 23601, className: "tiktok-dot" },
  { name: "YouTube", share: 19, followers: 16015, className: "youtube-dot" },
  { name: "X", share: 11, followers: 9275, className: "x-dot" }
];

export const metricSets = {
  all: { followers: 84290, engagement: 4.86, reach: 128420, interactions: 12684, reachChange: 12.4 },
  Instagram: { followers: 35399, engagement: 5.2, reach: 59210, interactions: 6230, reachChange: 14.1 },
  TikTok: { followers: 23601, engagement: 6.1, reach: 38280, interactions: 4176, reachChange: 16.8 },
  YouTube: { followers: 16015, engagement: 3.8, reach: 20410, interactions: 1522, reachChange: 8.4 },
  X: { followers: 9275, engagement: 2.9, reach: 10520, interactions: 756, reachChange: 4.2 }
};
