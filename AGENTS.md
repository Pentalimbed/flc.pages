# Repository Agent Instructions

These instructions apply to the entire repository.

## Commands and verification

- Prefer finite commands such as `npm run build` for verification.
- Do not start `npm run dev`, `astro dev`, `vite`, `wrangler dev`, preview servers,
  file watchers, or other persistent processes unless live-server behavior is
  necessary for the task.
- Do not use detached launch methods such as `nohup`, `disown`, `setsid`, or a
  background process whose lifecycle cannot be tracked.
- If a persistent process is necessary:
  1. Tell the user that a test server is being started.
  2. Run it in a managed foreground/PTY session and record its PID or process group.
  3. Reuse that one server rather than starting additional instances.
  4. Stop it with `SIGINT` or `SIGTERM` as soon as testing is complete.
  5. Escalate to `SIGKILL` only for the exact tracked process if graceful shutdown
     fails. Never signal broad or unrelated process groups.
  6. Before ending the turn, verify that the tracked process and its children
     (`astro`, `vite`, `wrangler`, `workerd`, and `esbuild`) are gone and that its
     listening port is closed.
- Never leave a server running for the user unless the user explicitly asks for
  that outcome.
- Do not kill processes merely because their executable name matches. Confirm the
  full command line and repository path first.
- A zombie (`Z` or `<defunct>`) cannot be killed directly; inspect and terminate
  its confirmed repository-owned parent instead. Do not terminate `systemd --user`
  or another session manager to reap a zombie.

## Final handoff

- Report the files changed and the verification performed.
- If any spawned process could not be stopped, report its PID, PPID, state, full
  command, and the attempted cleanup. Do not describe the task as complete while
  silently leaving a process behind.
