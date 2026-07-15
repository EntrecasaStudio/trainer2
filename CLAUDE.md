# Trainer2 — Project Guidelines

## Seed & Routines

- **SEED_VERSION stays at '2.73'** — NEVER bump unless explicitly asked.
- `userModified: true` on routines preserves user changes across reseeds.
- Seed only applies on first load or reset — existing routines with `userModified` are NOT affected by seed changes. Use migrations (in the "always run" section of `seedV2()`) to patch live routines.
- Single account: both Lean and Nat share `entrecasaestudio@gmail.com`. Routines are distinguished by name suffix ("— Lean" / "— Nat").

## Exercise Distribution — Adjacency Rule

CASA rotation order: Press A → Pull A → Press B → Pull B → Press C → Pull C → Press D → Pull D → Press E → Pull E → Press F → Pull F

**When suggesting or placing exercises, check the FULL rotation sequence (both Press AND Pull), not just same-type routines.** Adjacent routines in the rotation alternate Press/Pull, so a Press D exercise repeats the next day if it also appears in Pull D.

- Before placing an exercise, check these 4 adjacent routines (example for Pull B):
  1. **Opposite-type neighbors** (distance 1): Press B and Press C — the Press on each side.
  2. **Same-type neighbors** (distance 2): Pull A and Pull C — skip one routine in each direction.
  Verify the exercise does not appear in ANY circuit of those 4 routines. An exercise in Press B C1 conflicts with Pull B C2 if it's the same exercise.
- Also check exercises with similar mechanics (e.g., "Extensión de tríceps con banda" ≈ "Banda triceps pushdown" — both are band pushdown movements).

## Deployment

- Push to `main` for GitHub Pages deploy (unless told otherwise).
- Always bump SW cache version (`sw.js` line 1) after any code change.
- Feature branch: `claude/river-workout-alternative-exercise-D5N4v` — merge to main for each push.

## Exercise Catalog

- Every exercise MUST have a `tags` field with the English name (e.g., `tags: "Farmer's walk, Farmer carry"`).
- The English name is used for YouTube video search — the `tags` first entry is what gets searched.
- Include the English name in parentheses at the end of the `descripcion` too (e.g., `"... (Farmer's Walk)"`).

## Code Conventions

- No build step — plain ES modules served as static files.
- localStorage + Firestore sync under single shared account.
- `RENAME_MAP` in seed.js maps old exercise names to new for progression history continuity.
