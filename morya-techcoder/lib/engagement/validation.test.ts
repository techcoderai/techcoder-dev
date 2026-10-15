// Run with `npm test` (Node's built-in runner; no extra dependencies).
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  COMMENT_MAX_LENGTH,
  isAcceptablePassword,
  isAllowedAvatarUrl,
  isPlausibleEmail,
  isSameOriginRequest,
  isUuid,
  isValidSlugFormat,
  normalizeCommentBody,
  normalizeDisplayName,
  normalizeReportReason,
  safeNextPath,
} from "./validation.ts";

test("safeNextPath keeps same-site paths and rejects open redirects", () => {
  assert.equal(safeNextPath("/blog/hello-world"), "/blog/hello-world");
  assert.equal(safeNextPath("/blog/hello-world#comments"), "/blog/hello-world#comments");
  assert.equal(safeNextPath("/auth/update-password?x=1"), "/auth/update-password?x=1");
  for (const bad of [
    "https://evil.example",
    "//evil.example",
    "/\\evil.example",
    "\\\\evil.example",
    "javascript:alert(1)",
    "/\nhttps://evil.example",
    "",
    null,
    undefined,
    42,
    "blog/relative",
  ]) {
    assert.equal(safeNextPath(bad), "/", `should reject ${String(bad)}`);
  }
  assert.equal(safeNextPath("https://evil.example", "/account"), "/account");
});

test("comment bodies are normalized and length-limited", () => {
  assert.deepEqual(normalizeCommentBody("  Great read!  "), { ok: true, value: "Great read!" });
  assert.deepEqual(normalizeCommentBody("a\r\nb\n\n\n\nc"), { ok: true, value: "a\nb\n\nc" });
  assert.deepEqual(normalizeCommentBody("zero\u0000width\u202Eflip"), { ok: true, value: "zerowidthflip" });
  assert.equal(normalizeCommentBody("   ").ok, false);
  assert.equal(normalizeCommentBody(undefined).ok, false);
  assert.equal(normalizeCommentBody({ body: "x" }).ok, false);
  assert.equal(normalizeCommentBody("a".repeat(COMMENT_MAX_LENGTH)).ok, true);
  assert.equal(normalizeCommentBody("a".repeat(COMMENT_MAX_LENGTH + 1)).ok, false);
  // HTML is kept as literal text — it is escaped at render time, never parsed.
  assert.deepEqual(normalizeCommentBody("<script>x</script>"), { ok: true, value: "<script>x</script>" });
});

test("display names are trimmed, collapsed and capped", () => {
  assert.deepEqual(normalizeDisplayName("  Ada   Lovelace "), { ok: true, value: "Ada Lovelace" });
  assert.equal(normalizeDisplayName("").ok, false);
  assert.equal(normalizeDisplayName("x".repeat(51)).ok, false);
  assert.equal(normalizeDisplayName(5).ok, false);
});

test("report reasons are optional and truncated", () => {
  assert.equal(normalizeReportReason(undefined), null);
  assert.equal(normalizeReportReason("   "), null);
  assert.equal(normalizeReportReason("x".repeat(900))?.length, 500);
});

test("slug and id formats match the database constraints", () => {
  assert.ok(isValidSlugFormat("hello-world"));
  assert.ok(isValidSlugFormat("gpt5-what-developers-need-to-know"));
  for (const bad of ["Hello", "a--b", "-a", "a-", "../etc", "a b", "", "a".repeat(201), 1]) {
    assert.equal(isValidSlugFormat(bad), false, `should reject ${String(bad)}`);
  }
  assert.ok(isUuid("aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa"));
  assert.equal(isUuid("1; drop table"), false);
});

test("same-origin check blocks cross-site mutations", () => {
  assert.ok(isSameOriginRequest("https://techcoder.tech", [null, "techcoder.tech"]));
  assert.ok(isSameOriginRequest("https://x.app.github.dev", ["x.app.github.dev", "localhost:3000"]));
  assert.ok(isSameOriginRequest("http://localhost:3000", [null, "localhost:3000"]));
  assert.equal(isSameOriginRequest("https://evil.example", [null, "techcoder.tech"]), false);
  assert.equal(isSameOriginRequest(null, ["techcoder.tech"]), false);
  assert.equal(isSameOriginRequest("null", ["techcoder.tech"]), false);
});

test("password rule mirrors the Supabase Auth policy", () => {
  assert.ok(isAcceptablePassword("reading42"));
  assert.equal(isAcceptablePassword("short1"), false);
  assert.equal(isAcceptablePassword("lettersonly"), false);
  assert.equal(isAcceptablePassword("12345678"), false);
});

test("email check catches obvious typos only", () => {
  assert.ok(isPlausibleEmail("reader@techcoder.tech"));
  assert.ok(isPlausibleEmail("a.b+tag@sub.example.co.uk"));
  for (const bad of ["", "reader", "reader@", "reader@host", "two words@example.com", "a@b@c.com"]) {
    assert.equal(isPlausibleEmail(bad), false, `should reject ${bad}`);
  }
});

test("only Google-hosted avatars are rendered", () => {
  assert.ok(isAllowedAvatarUrl("https://lh3.googleusercontent.com/a/abc"));
  assert.equal(isAllowedAvatarUrl("http://lh3.googleusercontent.com/a/abc"), false);
  assert.equal(isAllowedAvatarUrl("https://googleusercontent.com.evil.example/a"), false);
  assert.equal(isAllowedAvatarUrl("javascript:alert(1)"), false);
});
