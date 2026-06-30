// No-op shim for the v0-injected build step.
//
// The Vercel project's saved Build Command is:
//   node .v0/inject-built-with-v0.mjs && next build
// That command was created by v0 and references this file, which only ever
// existed inside v0's internal repo — so every build here failed with
// MODULE_NOT_FOUND and the dashboard 404'd.
//
// This shim exists purely so `node .v0/inject-built-with-v0.mjs` exits 0 and
// the `&& next build` that follows actually runs. It intentionally does nothing.
process.exit(0);
