---
name: apply-claude-design
description: |
  Fetch a Claude Design handoff bundle (URL like https://api.anthropic.com/v1/design/h/<id>?open_file=...)
  and apply the design to the current codebase. Use when the user shares a claude.ai/design URL,
  an api.anthropic.com/v1/design/h/ URL, or asks to "implement this design", "apply the design file",
  or references a Claude Design handoff bundle.
allowed-tools: Bash, Read, Write, Edit, WebFetch, AskUserQuestion, ExitPlanMode, TodoWrite
---

Claude Design handoff URLs return a **gzipped tar archive**, not HTML. WebFetch will report it as
"corrupted binary data" and save the bytes to a `.bin` path — this is expected. Don't retry the URL.

## Steps

### 1. Fetch and extract

```bash
# WebFetch will print the saved path. Look for a line like:
#   "Binary content (application/gzip, NNNkB) also saved to /Users/.../webfetch-...bin"
# Pass that path here:
BIN="<path-from-webfetch-output>"
mkdir -p /tmp/design_bundle && tar -xzf "$BIN" -C /tmp/design_bundle
find /tmp/design_bundle -type f
```

The bundle contains:
- `README.md` — handoff instructions (read this first, in full)
- `chats/*.md` — transcripts of the design conversation. **Read every chat in order.**
  Intent lives here, not in the HTML output.
- `project/` — HTML prototypes + shared imports (CSS tokens, JSX components, per-page files)

### 2. Read the right files

The original URL contains `?open_file=<filename>`. That's the **primary design** the user wants
implemented. Read it top-to-bottom, then follow its imports (tokens.css, shared components,
per-page files). Don't skim — pixel-level details (radii, shadow recipes, easing curves, exact
oklch values) only show up in the source.

The README tells coding agents: **don't render in a browser, don't take screenshots.** Everything
needed is in the source.

### 3. Map design → project

The HTML/JSX is a **reference, not final code**. Recreate the visual output in the project's
actual stack (React/Vue/native/etc). Reuse existing components and tokens; don't copy the
prototype's inline styles or internal structure.

Plan the application area-by-area:
- Design tokens (colors, radii, shadows, motion) → `globals.css` or equivalent
- Shared primitives (chips, pins, sticker cards) → `components/ui/`
- Page-level layouts → existing route components

### 4. Identify scope gaps

The design may include features that don't exist in the current app yet (admin modes, status
banners, new flows). The DB schema sometimes already has placeholder columns for these. Before
planning, grep the schema/types for what's already wired vs what needs new APIs. Ask the user
explicitly which gaps to close — visual-only, visual + partial features, or full parity.

### 5. Plan, confirm, implement

Always go through plan mode for non-trivial design applications. Use AskUserQuestion early to
resolve ambiguities the chat transcripts don't settle (dark mode policy, scope of new features,
which existing sections to keep/replace). Get plan approval via ExitPlanMode before editing.

## Failure modes to avoid

- **Treating WebFetch's "corrupted binary" message as a real error.** It's a tarball; extract it.
- **Implementing without reading the chats.** The HTML is the output; the chats are why.
- **Copying prototype inline styles verbatim.** Map values to the project's token system instead.
- **Skipping the imports.** A page file alone won't show you the design system — read tokens and
  shared components too.
- **Adding dark mode tokens the design doesn't specify.** If the bundle is light-only, removing
  `.dark` blocks is correct; inventing dark values is a separate design decision.
