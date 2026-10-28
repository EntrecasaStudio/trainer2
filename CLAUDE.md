# Trainer2 — Project Guidelines

## Seed & Routines

- **SEED_VERSION stays at '2.73'** — NEVER bump unless explicitly asked.
- `userModified: true` on routines preserves user changes across reseeds.
- Seed only applies on first load or reset — existing routines with `userModified` are NOT affected by seed changes. Use migrations (in the "always run" section of `seedV2()`) to patch live routines.
- Single account: both Lean and Nat share `entrecasaestudio@gmail.com`. Routines are distinguished by name suffix ("— Lean" / "— Nat").

## Routine Analysis — always start from the user's saved data

**Every analysis must be based on the latest version saved by the account logged in as `entrecasaestudio@gmail.com`, never on the seed and never on a reference file taken on trust.** The seed is not the live data: the user edits routines from the app, those edits carry `userModified: true`, and some routines exist only in the live data (Nat's Press G and Pull G are in no version of `seed.js`). Counting off the wrong source has already produced two wrong analyses.

That data cannot be read from here — Firestore rejects unauthenticated reads (403), as it should. So it has to come out of the app:

**1. Bring in the live state.** Usuario tab → "Copiar rutinas", with the place selector on Casa, once per user. Paste each into a file, then:

```
python3 .claude/actualizar-referencia.py --importar lean.txt
python3 .claude/actualizar-referencia.py --importar nat.txt
```

This converts the app's export format into the reference files. It is the only way to capture edits made from the app.

**2. Replay what the seed does to that data.**

```
python3 .claude/actualizar-referencia.py            # applies and rewrites
python3 .claude/actualizar-referencia.py --dry-run  # shows what it would do
```

`.claude/rutinas-lean-casa-actual.md` and `.claude/rutinas-nat-casa-actual.md` do not update themselves, and every migration added to `PATCHES` keeps changing the real data while they stay as they were. This replays `RENAME_MAP` and then `PATCHES` over them in the order `seedV2()` uses, and is idempotent — a patch only fires while the old name still matches.

**Run step 2 after adding any migration or rename. Run step 1 whenever the analysis matters** — before proposing routine changes, counting how often an exercise appears, or checking the adjacency rule. The export is one tap; a stale count is worth less than nothing.

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
