---
target: "http://127.0.0.1:4321/#setup"
total_score: 25
p0_count: 0
p1_count: 3
timestamp: 2026-07-20T09-21-26Z
slug: src-components-setupguide-astro
---
⚠️ DEGRADED: single-context (design-review sub-agent stalled twice; Assessment B remained isolated, Assessment A was completed inline from source)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 2 | Selected tabs and the temporary “Copied” label provide local feedback, but there is no actual connection-test or completion state. |
| 2 | Match System / Real World | 3 | “Browser sign-in” and the numbered flow are approachable; OAuth 2.1, bearer credentials, Streamable HTTP, environment variables, and stdio still leak implementation language. |
| 3 | User Control and Freedom | 3 | Users can switch transport and client freely and reveal advanced options, but there is no contextual route back from failed setup or credential mistakes. |
| 4 | Consistency and Standards | 4 | Both tab systems use coherent labels, ARIA relationships, roving tabindex, and consistent active/focus patterns. |
| 5 | Error Prevention | 2 | Copyable snippets include key placeholders without a prominent replace/do-not-commit warning, and the flow does not validate prerequisites before users leave the page. |
| 6 | Recognition Rather Than Recall | 2 | The correct snippets are visible, but users must independently find the Hevy key page and their client’s connector/configuration screen. |
| 7 | Flexibility and Efficiency | 3 | Three transports, client-specific snippets, copy controls, and keyboard tab navigation serve experienced users well; deep links and one-click verification are missing. |
| 8 | Aesthetic and Minimalist Design | 3 | The active panel, numbered sequence, and restrained code treatment are focused; three equally large transport choices give advanced paths more weight than most visitors need. |
| 9 | Error Recovery | 1 | Clipboard failure changes the label to “Select text” without selecting it; troubleshooting is generic and hidden, with no inline recovery for common connection failures. |
| 10 | Help and Documentation | 2 | A full guide and troubleshooting exist behind “More setup options,” but help is not placed beside the risky key and client-configuration steps. |
| **Total** | | **25/40** | **Acceptable — significant improvements needed before users are happy** |

## Anti-Patterns Verdict

**LLM assessment:** This does not read as obvious AI slop. The numbered markers describe a real sequence, the layout avoids card-grid repetition, and the dark code artifact is functional rather than decorative. The mild template tell is the familiar landing-page cadence of a small context label, oversized split heading, tab rail, and generic “Connect once / ask better questions” promise. The Hevy-specific copy and blue/yellow system keep it from feeling anonymous, but the trust and completion moments need more product-specific character.

**Deterministic scan:** The detector returned zero findings for `src/components/SetupGuide.astro` (`[]`, exit 0). It found no banned patterns or source-level rule violations. There were therefore no false positives to dismiss.

**Visual overlays:** No reliable user-visible overlay is available. The browser runtime reported `No browser is available`, and the live URL was unreachable from the critique environment (`curl` exit 7 / HTTP 000). Mutable injection, viewport screenshots, and console overlays could not be attempted. Visual conclusions below are explicitly source-backed rather than screenshot-verified.

## Overall Impression

This is a disciplined setup section with a sound semantic and responsive skeleton. Its single biggest opportunity is to turn a documentation viewer into a closed-loop setup assistant: get the key, place the configuration, test it, recover if it fails, and celebrate success without making users infer any of those transitions.

## What’s Working

1. **The information architecture is fundamentally right.** Transport choice → key → client → first prompt matches the real task, and the ordered 01/02/03 markers are earned rather than decorative.
2. **Progressive disclosure contains a technically broad product.** Only one transport and one client panel are active, while Bun, Docker, security details, and troubleshooting stay behind a details disclosure.
3. **The interaction implementation is unusually thoughtful for a landing page.** Semantic tab roles, `aria-controls`, roving tabindex, arrow/Home/End handling, strong focus styling, reduced-motion handling, and a no-JS fallback all point to a real system rather than a static mockup.

## Priority Issues

### [P1] Step 01 does not actually help users obtain the required key

- **Why it matters:** “Bring a Hevy API key” is the first dependency, but the section provides no direct path to create one. A first-timer must leave, search, remember the setup state, and return. The security reassurance is also hidden until after the moment of maximum concern.
- **Fix:** Add a clear “Open Hevy API settings” action beside Step 01, state the PRO requirement there, and place the one-sentence OAuth storage/revocation reassurance immediately beneath it. Preserve the selected transport on return.
- **Suggested command:** `$impeccable clarify`

### [P1] The flow presents instructions as verification but never verifies success

- **Why it matters:** The yellow check icon beside each verification paragraph visually implies completion before the user has configured anything. Step 03 then assumes the server works. Users can finish the page with no reliable answer to “Am I connected?”
- **Fix:** Replace the pre-checked treatment with an explicit “After saving” instruction. Where possible, add a real “Test connection” state with checking, success, and actionable failure messages. At minimum, make the verification command/action copyable and turn Step 03 into a clear completion checkpoint.
- **Suggested command:** `$impeccable onboard`

### [P1] Credential and clipboard failures lack guardrails

- **Why it matters:** Direct HTTPS and stdio snippets contain `your-hevy-api-key` placeholders that are easy to copy unchanged or place into committed configuration. When clipboard access fails, the label says “Select text” but the code does not select, leaving users stranded at the exact point they expected acceleration.
- **Fix:** Mark placeholders visually, add a concise “replace this; never commit your key” warning, prefer environment-variable examples where supported, announce copy status through an `aria-live` region, and make the failure path actually select/focus the code with manual-copy instructions.
- **Suggested command:** `$impeccable harden`

### [P2] Advanced transports compete too strongly with the recommended path

- **Why it matters:** The opening description recommends browser sign-in, but the UI immediately gives Browser sign-in, Direct HTTPS, and Local stdio three equal 5.25rem-wide choices. That makes novices evaluate concepts they were just told they can ignore; on mobile those controls stack into a long block before Step 01.
- **Fix:** Make Browser sign-in the dominant default path with “Recommended for most people.” Move HTTPS and stdio under a clear “Other connection methods” disclosure, or reduce their visual weight while preserving direct access for experts.
- **Suggested command:** `$impeccable distill`

## Cognitive Load

**Moderate: 2 of 8 checklist failures.** Chunking, grouping, visual hierarchy, minimal choices, and progressive disclosure are strong; no decision point exceeds four visible options. The failures are **single focus** (three equally prominent transport paths appear before the primary path begins) and **working memory** (users must leave to find a key and client settings, then return with that context). Technical jargon adds extraneous translation effort even though the number of choices stays manageable.

## Emotional Journey

- **Arrival:** Confident and calm. The headline and “Easiest” badge reduce intimidation.
- **Credential moment:** The emotional valley. Users are asked for a sensitive key without an adjacent source link, concise trust explanation, or revocation guidance.
- **Configuration:** Momentum improves because the exact URL/command is copyable and client-specific.
- **Ending:** Weak peak-end experience. A static check treatment and sample question imply success without confirming it, so the user leaves with uncertainty instead of earned confidence.

## Persona Red Flags

**Jordan (Confused First-Timer):** Jordan reaches “Bring a Hevy API key” and cannot see where to create it. The page then exposes OAuth 2.1, bearer credentials, Streamable HTTP, environment variables, and stdio without inline definitions. They are likely to abandon before choosing a client, despite the recommended default.

**Riley (Deliberate Stress Tester):** Riley blocks clipboard permission and gets “Select text,” but the interface does not select or focus the snippet. They also notice that the yellow check treatment is shown before any test has run and that troubleshooting is a generic README handoff instead of a precise recovery path.

**Casey (Distracted Mobile User):** Casey encounters three stacked transport buttons before the instructions, then must switch to Hevy and client settings while retaining the current mode and snippet. Horizontal code overflow is technically scrollable, but there is no visible cue that long commands continue off-screen; copy helps only when clipboard permission succeeds.

## Minor Observations

- “Easiest” is less decisive than “Recommended for most people.”
- The final sample prompt would benefit from its own copy action and a brief statement of what a successful response looks like.
- The active transport uses both a blue fill and a thick yellow marker. One strong selected-state treatment may be enough.
- The repeated page-level `context-line` motif is restrained, but varying the setup section’s cadence would make the landing page feel less templated.
- The no-JS fallback, reduced-motion rule, and keyboard tab implementation are genuine strengths worth preserving through any redesign.

## Questions to Consider

1. Should setup optimize first for **a non-technical Hevy user using browser sign-in**, **a mixed audience with equal transport access**, or **developers configuring clients manually**?
2. Is the desired completion experience **a real in-page connection test**, **client-specific verification instructions**, or **a lean docs-only flow with stronger links and recovery copy**?
3. Should the next pass cover **the top three P1 trust/completion issues**, **all four priority issues including transport hierarchy**, or **copy/accessibility fixes only**?
