# AI Agent Instructions

This project uses an Astro + Tailwind CSS v4 boilerplate for local business brochure websites.

## Before coding anything

1. Read `SETUP.md` fully
2. Follow the onboarding checklist in order
3. Do NOT write any code or modify any files until the setup checklist is complete
4. After setup, verify with `npm run build`

## Rules

- Use `node scripts/setup.mjs --config <file.json>` for non-interactive config generation (preferred for AI agents)
- Use `node scripts/setup.mjs` for interactive mode (if the user prefers a wizard)
- Use `node scripts/process-images.mjs <folder>` for image optimization
- Only write content to `src/data/` and `public/` during setup
- Do NOT modify components, layouts, or styles during setup
- After setup, the site must build without errors (`npm run build`)
- After setup, walk the user through `POST-SETUP.md` for remaining manual tasks

## Starting the dev server

Use `npm run dev:bg` to start the dev server in the background. This uses `scripts/dev.sh` which:

- Binds to **0.0.0.0** (accessible on the network, not just localhost)
- Uses **`setsid` + `disown`** so the process survives shell session exit
- Uses the project's **local `node_modules/.bin/astro`** (not `npx`, which may pull the wrong version)
- Writes logs to `/tmp/astro-dev.log`
- Kills any existing process on port 4321 before starting

One-shot command (preferred):

```bash
bash scripts/dev.sh
```

Or via npm:

```bash
npm run dev:bg
```

To stop the server:

```bash
kill $(lsof -ti :4321)
```

> **Why not `npm run dev`?** In environments where the AI runs commands via a shell tool (opencode, Cursor, etc.), background processes started with `&` get killed when the command finishes because the shell sends SIGHUP to child processes. `setsid` detaches the process into a new session, and `disown` removes it from the shell's job table, keeping it alive.
