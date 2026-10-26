import { posts, campaigns, chartSeries, channelShares, metricSets } from "./data.js";
import { formatNumber, formatCompact, formatPercent, formatDate, toCsv, filterPosts } from "./utils.js";

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const state = { view: "overview", platform: "all", dateRange: 30, chartMetric: "reach", contentStatus: "all", contentPlatform: "all", search: "" };
const viewTitles = { overview: "Overview", content: "Content", campaigns: "Campaigns", audience: "Audience", settings: "Settings" };
const statusClass = { Published: "published", Scheduled: "scheduled", Draft: "draft", Active: "active", Completed: "completed", Planned: "planned" };

function showToast(title, message = "") {
  const toast = document.createElement("div");
  toast.className = "toast";
  const icon = document.createElement("span");
  icon.className = "toast-icon";
  icon.textContent = "✦";
  const copy = document.createElement("div");
  const strong = document.createElement("strong");
  strong.textContent = title;
  copy.append(strong);
  if (message) {
    const detail = document.createElement("p");
    detail.textContent = message;
    copy.append(detail);
  }
  toast.append(icon, copy);
  $("#toast-region").append(toast);
  window.setTimeout(() => toast.remove(), 3600);
}

function openDialog(title, description, primary = "Got it") {
  $("#dialog-title").textContent = title;
  $("#dialog-description").textContent = description;
  $("#dialog-primary").textContent = primary;
  const dialog = $("#action-dialog");
  if (typeof dialog.showModal === "function") dialog.showModal();
  else showToast(title, description);
}

function showView(view) {
  if (!viewTitles[view]) return;
  state.view = view;
  $$(".view-section").forEach((section) => {
    const active = section.id === `view-${view}`;
    section.classList.toggle("active", active);
    section.hidden = !active;
  });
  $$("[data-view]").forEach((button) => button.classList.toggle("active", button.dataset.view === view));
  $("#breadcrumb-current").textContent = viewTitles[view];
  $("#sidebar").classList.remove("open");
  $("#mobile-menu").setAttribute("aria-expanded", "false");
  renderAll();
}

function activeMetrics() {
  const base = metricSets[state.platform] || metricSets.all;
  const scale = state.dateRange === 7 ? 0.31 : state.dateRange === 90 ? 2.17 : 1;
  return { ...base, reach: Math.round(base.reach * scale), interactions: Math.round(base.interactions * scale) };
}

function renderMetrics() {
  const metrics = activeMetrics();
  $("#metric-followers").textContent = formatCompact(metrics.followers);
  $("#metric-engagement").innerHTML = `${metrics.engagement.toFixed(2)}<span class="value-unit">%</span>`;
  $("#metric-reach").textContent = formatCompact(metrics.reach);
  $("#metric-interactions").textContent = formatCompact(metrics.interactions);
  const labels = { reach: ["Total reach", metrics.reach], engagement: ["Engagement rate", metrics.engagement], interactions: ["Total interactions", metrics.interactions] };
  const [label, value] = labels[state.chartMetric];
  $("#chart-label").textContent = label;
  $("#chart-total").textContent = state.chartMetric === "engagement" ? formatPercent(value, 2) : formatNumber(value);
  $(".chart-change").innerHTML = `↗ ${metrics.reachChange.toFixed(1)}% <small>vs. previous period</small>`;
  renderChart();
}

function renderChart() {
  const series = chartSeries[state.dateRange] || chartSeries[30];
  const platformAdjustment = state.platform === "all" ? 1 : ({ Instagram: 0.46, TikTok: 0.30, YouTube: 0.16, X: 0.08 }[state.platform] || 1);
  const multiplier = state.chartMetric === "engagement" ? 0.72 : state.chartMetric === "interactions" ? 0.53 : 1;
  const values = series.map((value) => value * platformAdjustment * multiplier);
  const max = Math.max(...values) * 1.15;
  const width = 720;
  const height = 200;
  const points = values.map((value, index) => {
    const x = values.length === 1 ? width / 2 : (index / (values.length - 1)) * width;
    const y = height - (value / max) * (height - 20) - 5;
    return [Number(x.toFixed(1)), Number(y.toFixed(1))];
  });
  const pointText = points.map(([x, y]) => `${x},${y}`).join(" ");
  const areaPath = `M${points.map(([x, y]) => `${x} ${y}`).join(" L")} L${width} ${height + 20} L0 ${height + 20} Z`;
  $("#chart-line").setAttribute("points", pointText);
  $("#chart-area").setAttribute("d", areaPath);
  const date = new Date("2026-10-26T12:00:00");
  const count = state.dateRange === 7 ? 7 : state.dateRange === 30 ? 6 : 6;
  const labels = [];
  for (let i = 0; i < count; i += 1) {
    const daysAgo = Math.round((state.dateRange - 1) * (1 - i / (count - 1)));
    const d = new Date(date);
    d.setDate(d.getDate() - daysAgo);
    labels.push(formatDate(d.toISOString().slice(0, 10)));
  }
  $("#chart-x-labels").innerHTML = labels.map((label) => `<span>${label}</span>`).join("");
  $("#performance-chart").setAttribute("aria-label", `Illustrative ${state.chartMetric} chart for the last ${state.dateRange} days`);
}

function platformClass(platform) {
  return platform.toLowerCase() === "x" ? "x" : platform.toLowerCase();
}

function postCell(post) {
  return `<div class="post-cell"><span class="post-thumbnail ${post.color}" aria-hidden="true">${post.initials}</span><span class="post-title-wrap"><span class="post-title" title="${post.title}">${post.title}</span><span class="post-id">${post.id} · ${post.type}</span></span></div>`;
}

function platformCell(platform) {
  return `<span class="platform-label ${platformClass(platform)}">${platform}</span>`;
}

function statusCell(status) {
  return `<span class="status-pill ${statusClass[status] || "draft"}">${status}</span>`;
}

function noRows(columns, message) {
  return `<tr><td colspan="${columns}" class="empty-state"><strong>No matching records</strong>${message}</td></tr>`;
}

function getFilteredContent() {
  return filterPosts(posts, {
    query: state.search,
    platform: state.contentPlatform,
    status: state.contentStatus
  });
}

function renderOverviewPosts() {
  const filtered = filterPosts(posts, { query: state.search, platform: state.platform, status: "Published" })
    .sort((a, b) => b.reach - a.reach)
    .slice(0, 5);
  $("#overview-posts").innerHTML = filtered.length ? filtered.map((post) => `<tr><td>${postCell(post)}</td><td>${platformCell(post.platform)}</td><td>${formatDate(post.date)}</td><td>${formatNumber(post.reach)}</td><td>${formatPercent(post.engagement)}</td><td>${statusCell(post.status)}</td></tr>`).join("") : noRows(6, "Try a different search or channel filter.");
  $("#overview-table-count").textContent = `Showing ${filtered.length} of ${posts.filter((post) => post.status === "Published").length} published posts`;
}

function renderAllPosts() {
  const filtered = getFilteredContent();
  $("#all-posts").innerHTML = filtered.length ? filtered.map((post) => `<tr><td>${postCell(post)}</td><td>${platformCell(post.platform)}</td><td>${formatDate(post.date, { year: "numeric", month: "short", day: "numeric" })}</td><td>${post.reach ? formatNumber(post.reach) : "—"}</td><td>${post.likes ? formatNumber(post.likes) : "—"}</td><td>${post.engagement ? formatPercent(post.engagement) : "—"}</td><td>${statusCell(post.status)}</td></tr>`).join("") : noRows(7, "Change the status, channel, or search query to see more posts.");
  $("#content-count").textContent = `${filtered.length} of ${posts.length} sample posts`;
  $$("[data-content-status]").forEach((button) => button.classList.toggle("active", button.dataset.contentStatus === state.contentStatus));
}

function renderCampaigns() {
  $("#campaign-rows").innerHTML = campaigns.map((campaign) => {
    const icon = campaign.platform === "Instagram" ? "◎" : campaign.platform === "TikTok" ? "♪" : campaign.platform === "YouTube" ? "▶" : "𝕏";
    return `<tr><td><div class="campaign-cell"><span class="campaign-mark ${campaign.accent}">${icon}</span><span class="campaign-name">${campaign.name}<small>${campaign.id}</small></span></div></td><td>${platformCell(campaign.platform)}</td><td>${formatDate(campaign.start)} – ${formatDate(campaign.end)}</td><td>$${formatNumber(campaign.budget)}</td><td><div class="progress-cell"><div class="progress-meta"><span>Progress</span><strong>${campaign.progress}%</strong></div><div class="progress-track ${campaign.accent}"><span style="width:${campaign.progress}%"></span></div></div></td><td>${statusCell(campaign.status)}</td></tr>`;
  }).join("");
}

function renderAll() {
  renderMetrics();
  renderOverviewPosts();
  renderAllPosts();
  renderCampaigns();
  $$(".platform-pill").forEach((button) => button.classList.toggle("active", button.dataset.platform === state.platform));
}

function downloadCsv(filename, content) {
  const blob = new Blob(["\uFEFF", content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.style.display = "none";
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function exportCurrentView() {
  let csv;
  let filename;
  if (state.view === "campaigns") {
    csv = toCsv(campaigns, [
      { key: "id", label: "Campaign ID" }, { key: "name", label: "Campaign" }, { key: "platform", label: "Channel" },
      { key: "start", label: "Start date" }, { key: "end", label: "End date" }, { key: "budget", label: "Sample budget USD" },
      { key: "progress", label: "Progress percent" }, { key: "status", label: "Status" }
    ]);
    filename = "pulseboard-demo-campaigns.csv";
  } else {
    const filtered = state.view === "overview"
      ? filterPosts(posts, { query: state.search, platform: state.platform, status: "Published" })
      : getFilteredContent();
    csv = toCsv(filtered, [
      { key: "id", label: "Post ID" }, { key: "title", label: "Post title" }, { key: "platform", label: "Channel" },
      { key: "date", label: "Date" }, { key: "type", label: "Format" }, { key: "reach", label: "Reach (sample)" },
      { key: "likes", label: "Likes (sample)" }, { key: "comments", label: "Comments (sample)" },
      { key: "shares", label: "Shares (sample)" }, { key: "engagement", label: "Engagement rate (sample %)" }, { key: "status", label: "Status" }
    ]);
    filename = "pulseboard-demo-content.csv";
  }
  downloadCsv(filename, csv);
  showToast("Export ready", "Your sample data CSV has been downloaded to this device.");
}

// Navigation and filter controls.
$$("[data-view]").forEach((button) => button.addEventListener("click", () => showView(button.dataset.view)));
$$("[data-open-view]").forEach((button) => button.addEventListener("click", () => showView(button.dataset.openView)));
$$(".platform-pill").forEach((button) => button.addEventListener("click", () => {
  state.platform = button.dataset.platform;
  renderAll();
}));
$("#date-range").addEventListener("change", (event) => {
  state.dateRange = Number(event.target.value) || 30;
  renderMetrics();
});
$("#global-search").addEventListener("input", (event) => {
  state.search = event.target.value;
  renderOverviewPosts();
  renderAllPosts();
});
$("#content-platform").addEventListener("change", (event) => {
  state.contentPlatform = event.target.value;
  renderAllPosts();
});
$$("[data-content-status]").forEach((button) => button.addEventListener("click", () => {
  state.contentStatus = button.dataset.contentStatus;
  renderAllPosts();
}));
$("#export-button").addEventListener("click", exportCurrentView);

const chartMetricOptions = ["reach", "engagement", "interactions"];
$("#chart-metric-toggle").addEventListener("click", () => {
  const currentIndex = chartMetricOptions.indexOf(state.chartMetric);
  state.chartMetric = chartMetricOptions[(currentIndex + 1) % chartMetricOptions.length];
  const title = state.chartMetric.charAt(0).toUpperCase() + state.chartMetric.slice(1);
  $("#chart-metric-toggle").innerHTML = `${title} <span aria-hidden="true">⌄</span>`;
  $(".chart-legend").innerHTML = `<span><i class="legend-dot reach-dot"></i>${title}</span><span class="chart-footnote">Illustrative data · not connected to live accounts</span>`;
  renderMetrics();
});

$("#dismiss-banner").addEventListener("click", () => $(".demo-banner").remove());
$("#notifications-button").addEventListener("click", () => showToast("You're all caught up", "Notifications are disabled in this local demo."));
$("#new-post-button").addEventListener("click", () => openDialog("Create a draft", "This demo has no publishing backend, so new drafts are not saved. In a production app, this would open the post editor.", "Understood"));
$("#new-campaign-button").addEventListener("click", () => openDialog("Create a campaign", "Campaign creation is presented as a UI example. No campaign is created or sent to an advertising platform.", "Understood"));
$("#mobile-menu").addEventListener("click", () => {
  const sidebar = $("#sidebar");
  const open = sidebar.classList.toggle("open");
  $("#mobile-menu").setAttribute("aria-expanded", String(open));
});

const themeToggle = $("#theme-toggle");
const compactToggle = $("#compact-toggle");
try {
  themeToggle.checked = localStorage.getItem("pulseboard-theme") === "dark";
  compactToggle.checked = localStorage.getItem("pulseboard-compact") === "true";
} catch {
  // The app still works in browsers that disable storage.
}
function applyTheme(enabled) {
  document.body.classList.toggle("theme-dark", enabled);
  try { localStorage.setItem("pulseboard-theme", enabled ? "dark" : "light"); } catch { /* Optional preference only. */ }
}
function applyCompact(enabled) {
  document.body.classList.toggle("compact-tables", enabled);
  try { localStorage.setItem("pulseboard-compact", String(enabled)); } catch { /* Optional preference only. */ }
}
themeToggle.addEventListener("change", () => applyTheme(themeToggle.checked));
compactToggle.addEventListener("change", () => applyCompact(compactToggle.checked));
applyTheme(themeToggle.checked);
applyCompact(compactToggle.checked);

// Close the mobile navigation when the user clicks outside it.
document.addEventListener("click", (event) => {
  const sidebar = $("#sidebar");
  if (sidebar.classList.contains("open") && !sidebar.contains(event.target) && !$("#mobile-menu").contains(event.target)) {
    sidebar.classList.remove("open");
    $("#mobile-menu").setAttribute("aria-expanded", "false");
  }
});

renderAll();
