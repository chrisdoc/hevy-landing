# Hevy MCP Landing Page CRO Audit

**Review date:** 2026-07-20
**Page type:** Homepage / product landing page with embedded setup documentation
**Primary goal:** Move visitors from landing-page visit to successful Hevy MCP activation

## Initial assessment

### Primary conversion goal

A visitor should connect Hevy through browser sign-in and complete the first successful profile query.

Secondary conversions:

- Configure Direct HTTPS.
- Configure local stdio.
- Copy the first read-only question.
- Visit the GitHub repository.

### Traffic context

Traffic sources are currently unknown. [INFERENCE] Likely sources include GitHub referrals, MCP and AI communities, direct links, and organic search.

Source-specific message matching should wait until traffic sources are measurable.

## Diagnosis

The page is credible and technically thorough, but it asks visitors to understand too much before taking the first step.

The largest adoption risks are:

1. The headline describes access to data, not the outcome users want.
2. `Connect Hevy` sounds immediate, but actually scrolls to a long setup section.
3. The page does not clearly state that Hevy MCP is free.
4. Browser sign-in, Direct HTTPS, and local mode receive almost equal prominence even though browser sign-in is recommended.
5. The optional API-key checker looks like a required first step.
6. There is no visible customer proof despite an established user base.
7. The animated hero demo initially displays a mostly empty dark panel.
8. No analytics instrumentation was found in `src/` or `public/`, so the funnel cannot currently be measured.

## What is already working

- Strong visual identity and clear above-fold layout.
- One clear product category: Hevy data connected to AI assistants.
- Concrete supported clients: Claude, Cursor, Codex, and others.
- Repeated CTA placement in the header, hero, and final section.
- Sticky header keeps the CTA available while scrolling.
- 25 focused tools, 3 connection methods, 18-second demo, and MIT license provide useful proof.
- Setup includes copyable commands and a read-only first question.
- FAQ handles major objections: PRO requirement, key handling, mutations, compatibility, and independent status.
- No email form or unnecessary registration friction.

## Quick wins

### 1. State the free model next to the primary CTA

Current copy says:

> Hevy PRO API access is required.

That can sound like Hevy MCP itself has a paid plan.

Use:

> **Free and open source. Hevy PRO is required for API access.**

Add this directly below the primary CTA or in a small trust strip:

```text
Free and open source · No install for browser sign-in · Hevy PRO required
```

### 2. Make the primary CTA describe the next step

Current:

```text
Connect Hevy
Run Hevy MCP locally
```

Recommended:

```text
Start browser setup
Set up local mode
```

Use `Start browser setup` as the filled primary button. Make `Set up local mode` an outlined button or text link so the recommended path is unmistakable.

### 3. Add a first-success promise above the fold

The user does not only want to connect. They want a useful result.

Add:

> Connect in a few minutes, then ask: “Which Hevy account is connected?”

Or:

> Connect Hevy, then get your first training answer in one question.

### 4. Make the API-key checker explicitly optional

The setup currently presents key verification as step `01`, which can make it look mandatory.

Change the heading to:

> **Optional: verify your Hevy API key**

Add:

> You can skip this check and continue directly to setup. The browser sends the key to Hevy, not to this site.

Consider placing the checker after the visitor chooses a connection method.

### 5. Fix the initial hero-demo blank state

The current animated demo starts with no visible chat content for the first stage. Render the first user question by default, then enhance it into the animation after JavaScript loads.

The hero should never look like an empty product panel during the first impression.

### 6. Add a CTA after proof sections

The Demo section currently ends with “Watch the recorded session.” Add:

```text
Ready to try it?
Start browser setup →
```

Add the same CTA after the capability cards. Visitors who are convinced before reaching the setup section should not need to continue scrolling.

### 7. Move independent-project clarification closer to conversion

The page currently explains independence in the hero and footer, but “not affiliated with Hevy” is primarily below the fold.

Near the free/PRO trust strip, add:

> Independent open-source project. Not affiliated with Hevy.

This reduces brand confusion before visitors share a credential.

## High-impact changes

### 1. Reframe the hero around the outcome

The current headline is:

> Talk to your Hevy data from your AI assistant.

It is clear, but abstract. It describes the interface rather than the result.

Recommended hero structure:

```text
Ask your AI assistant what changed in your training.

Hevy MCP connects Claude, Codex, Cursor, and other MCP clients to your Hevy history—so you can understand progress, find routines, and log changes without digging through workouts.

[Start browser setup] [Set up local mode]

Free and open source · Hevy PRO required for API access
```

This keeps the product category while making the benefit concrete.

### 2. Make the recommended path visually dominant

The current setup contains nested transport tabs and client tabs. That is flexible, but it creates decision load.

Start with three clear cards:

```text
1. Browser sign-in — Recommended
   No install. Best for most people.

2. Direct HTTPS
   For clients that accept a fixed API key.

3. Run locally
   For local control or clients without remote HTTP.
```

Then show client-specific instructions after the user selects a method.

The current tabs can remain as the implementation, but the information architecture should make the recommendation obvious before showing configuration detail.

### 3. Add real adoption proof

A polished testimonial is not required before adding proof.

Use verified signals in this order:

1. Active or connected user count.
2. Total users or successful connections.
3. Repeat usage or tool-call volume.
4. GitHub stars, forks, and npm downloads.
5. Short approved user quotes.
6. Longer case studies later.

Example once measured:

```text
Used by 300+ Hevy lifters
25 focused tools · 3 connection methods · MIT licensed
```

Do not use “quite some users” publicly until it becomes a verified number.

For testimonials, search:

- GitHub issues and Discussions.
- Setup and support conversations.
- Private Discord or Slack messages.
- Users who returned with follow-up questions.
- Users who described a specific before/after experience.
- Repeat users visible in aggregate server data.

Ask for a story, not a testimonial:

```text
What were you trying to do with your Hevy data?
What did you do before Hevy MCP?
What changed after connecting it?
```

Draft the quote from their answer and send it back for approval.

### 4. Create source-specific setup pages

The homepage currently serves several different audiences:

- Claude.ai browser users.
- Codex remote users.
- Claude Desktop and Cursor local users.
- Developers using arbitrary MCP clients.

Create focused routes or landing variants:

```text
/docs/connect/browser
/docs/connect/https
/docs/connect/local
/docs/clients/claude-ai
/docs/clients/codex
/docs/clients/cursor
```

This improves message match for links from GitHub, search results, and community posts.

### 5. Instrument the adoption funnel

Recommended privacy-safe events:

```text
hero_cta_clicked
setup_section_reached
transport_selected
client_selected
config_copied
hevy_api_settings_opened
key_check_started
key_check_succeeded
key_check_failed
first_question_copied
demo_played
github_clicked
```

Never log API-key values.

The important activation events should be measured outside the landing page where possible:

```text
Landing visit
→ Hero CTA click
→ Connection method selected
→ Configuration copied
→ OAuth completed or client configured
→ get-user-info succeeds
→ User returns within 7 days
```

## Test ideas

Run these sequentially if traffic is limited.

| Test | Hypothesis | Primary metric |
|---|---|---|
| Outcome headline vs. current headline | A specific training outcome will produce more setup starts | Hero CTA click-through |
| `Start browser setup` vs. `Connect Hevy` | Describing the next step will reduce uncertainty | Hero CTA click-through |
| One primary CTA vs. two equal CTAs | Removing equal-weight local setup will focus most visitors on the recommended path | Browser setup starts |
| Free/PRO trust strip vs. current helper text | Clarifying pricing will reduce hesitation | Setup starts and key-check starts |
| Three setup cards vs. nested tabs | Simpler method selection will improve setup progression | Method selection to config copy |
| First-question CTA vs. generic connection CTA | Promising the first useful result will increase activation | First successful profile query |
| Static first hero frame vs. blank animation start | Immediate proof will improve above-fold engagement | Hero CTA click-through |
| Adoption proof near hero vs. no proof | Verified usage evidence will reduce trust anxiety | Setup starts |
| Testimonial near setup vs. FAQ-only proof | Social proof near the decision point will improve completion | Setup completion |

Do not run an A/B test on unmeasured traffic. First establish a baseline for:

- Hero CTA click rate.
- Setup method selection rate.
- Configuration copy rate.
- Key-check success rate.
- First successful connection rate.
- Seven-day repeat usage.

## Copy alternatives

### Recommended headline

> **Ask your AI assistant what changed in your training.**

Outcome-focused, concrete, and emotionally closer to the user’s goal.

### Alternative headline 2

> **Turn your Hevy history into answers—not another workout list.**

Directly contrasts the product with the current manual workflow.

### Alternative headline 3

> **See your training progress across weeks, straight from Hevy.**

Specific and accessible for users who do not know what MCP means.

### Recommended subheadline

> Hevy MCP connects Claude, Codex, Cursor, and other MCP clients to your Hevy history—so you can understand progress, find routines, and log changes without digging through workouts.

### CTA alternatives

#### Recommended

```text
Start browser setup
```

Sets an accurate expectation and emphasizes the recommended path.

#### Outcome-oriented

```text
Ask my first Hevy question
```

Best when the setup flow can clearly deliver the first profile response.

#### Client-specific

```text
Connect Hevy to Claude
```

Best for traffic arriving from a Claude-specific page or community post.

#### Secondary CTA

```text
Set up local mode
```

Clearer and shorter than “Run Hevy MCP locally.”

## Recommended implementation order

1. Add the free/PRO trust strip.
2. Change the hero CTA to `Start browser setup`.
3. Demote local setup visually.
4. Add the first-success promise.
5. Make API-key checking explicitly optional.
6. Fix the blank initial hero animation state.
7. Add setup CTAs after Demo and Capabilities.
8. Add privacy-safe funnel events.
9. Measure adoption and publish verified usage proof.
10. Simplify setup into three method cards and client-specific instructions.

The highest-leverage first change is not a visual redesign: clarify **“Hevy MCP is free”**, make browser setup the unmistakable primary path, and promise the user’s first useful answer.

## Measurement inputs needed

To prioritize future changes, collect:

- Sessions by traffic source.
- Hero CTA click-through rate.
- Setup-section reach rate.
- Connection-method selection by method.
- Configuration-copy rate by client.
- API-key check success and failure rates without storing keys.
- OAuth completion rate.
- First successful `get-user-info` response.
- Seven-day repeat usage.
- Current active-user and connected-user counts.
- Any existing user research, heatmaps, or session recordings.

No code changes were made as part of this audit.
