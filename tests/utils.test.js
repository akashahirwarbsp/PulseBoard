import test from "node:test";
import assert from "node:assert/strict";
import { escapeCsvCell, filterPosts, formatDate, formatNumber, formatPercent, toCsv } from "../src/js/utils.js";

const samplePosts = [
  { id: "1", title: "A, post", platform: "Instagram", type: "Carousel", status: "Published" },
  { id: "2", title: "A \"quoted\" post", platform: "TikTok", type: "Video", status: "Scheduled" },
  { id: "3", title: "Quiet update", platform: "Instagram", type: "Text", status: "Draft" }
];

test("formatNumber adds grouping separators", () => {
  assert.equal(formatNumber(12345), "12,345");
  assert.equal(formatNumber(0), "0");
});

test("formatPercent handles fixed decimal places", () => {
  assert.equal(formatPercent(4.856, 2), "4.86%");
});

test("formatDate returns a readable date and safely handles invalid input", () => {
  assert.equal(formatDate("2026-10-26"), "Oct 26");
  assert.equal(formatDate("not-a-date"), "—");
});

test("escapeCsvCell quotes commas, quotes, and new lines", () => {
  assert.equal(escapeCsvCell("plain"), "plain");
  assert.equal(escapeCsvCell("one, two"), '"one, two"');
  assert.equal(escapeCsvCell('say "hello"'), '"say ""hello"""');
  assert.equal(escapeCsvCell("line 1\nline 2"), '"line 1\nline 2"');
});

test("toCsv builds a header and escaped rows", () => {
  assert.equal(toCsv([{ name: "A, B", status: "Published" }], [
    { key: "name", label: "Post name" }, { key: "status", label: "Status" }
  ]), 'Post name,Status\r\n"A, B",Published\r\n');
});

test("filterPosts combines case-insensitive search, platform, and status filters", () => {
  assert.deepEqual(filterPosts(samplePosts, { query: "QUOTED", platform: "TikTok", status: "Scheduled" }).map((post) => post.id), ["2"]);
  assert.deepEqual(filterPosts(samplePosts, { platform: "Instagram", status: "all" }).map((post) => post.id), ["1", "3"]);
  assert.deepEqual(filterPosts(samplePosts, { query: "no match" }), []);
});
