# Product Marketing Context

**Document version:** v1
**Last updated:** 2026-07-20

## Product Overview

**One-liner:**
Connect your Hevy data to the AI assistant you already use.

**What it does:**
Hevy MCP is a free, open-source Model Context Protocol connector for the Hevy API. It lets compatible AI assistants read, analyze, create, and update workouts, routines, exercises, and measurements using plain-language requests.

It supports browser OAuth, direct HTTPS with an API key, and local stdio execution.

**Product category:**
AI data connector / MCP integration / fitness developer tool

**Product type:**
Open-source software with a hosted remote endpoint and local runtime

**Business model:**
Hevy MCP is free and MIT licensed. Users need a Hevy PRO membership in the Hevy app because Hevy API access requires PRO. There is no separate Hevy MCP fee documented.

## Target Audience

**Target companies:**
Not primarily B2B. The product is aimed at individual Hevy users, technical fitness enthusiasts, developers, and AI-tool power users.

**Decision-makers:**
Self-serve end users who choose their own AI assistant and connection method.

**Primary use case:**
Ask an AI assistant questions about Hevy training data and make controlled updates without manually searching through the Hevy app or writing API code.

**Jobs to be done:**

- Understand training progress across multiple weeks.
- Find routines, exercises, and workout history quickly.
- Create or update training data without guessing or manually entering every detail.

**Use cases:**

- Generate a six-week training summary grounded in specific workouts.
- Identify progression, consistency gaps, and frequently trained exercises.
- Search for a saved routine such as “push day.”
- Create or update workouts, routines, exercises, and measurements.
- Connect through Claude.ai, Codex, Claude Desktop, Cursor, or another MCP client.
- Run the connector locally when remote HTTP is unavailable or undesirable.

## Personas

This is not a traditional B2B buying committee. The main personas are self-serve users:

| Persona | Cares about | Challenge | Value we promise |
|---------|-------------|-----------|------------------|
| Technical Hevy user | Fast setup, useful answers, API-key safety | Training data is difficult to analyze manually | Ask questions in plain language and receive evidence-based answers |
| Developer / AI-tool power user | Transport compatibility, local control, configuration clarity | Different clients require different MCP setup methods | Choose OAuth, HTTPS, or stdio without building the integration |
| Privacy-conscious lifter | Credential handling and mutation control | Does not want an AI tool changing workouts unexpectedly | Transparent key handling and confirmation before mutations |

## Problems & Pain Points

**Core problem:**
Hevy contains useful training history, but answering multi-part questions requires opening old sessions, comparing numbers, and searching routines manually.

**Why alternatives fall short:**

- The Hevy UI is optimized for logging and browsing, not conversational analysis.
- Manual exports and spreadsheets require extra organization and interpretation.
- Generic AI assistants cannot access current Hevy data without a connector.
- DIY API scripts require technical setup and do not provide a conversational interface.
- A single connection method does not work for every MCP client.

**What it costs them:**
Time spent searching, comparing, and manually summarizing workouts. It also increases the risk of missing relevant sessions or entering incomplete training data.

**Emotional tension:**
Frustration with buried history, uncertainty about whether progress is real, and anxiety about sharing API credentials or allowing an AI assistant to modify workouts.

## Competitive Landscape

**Direct:**
No validated direct competitor list is documented yet. Potential direct alternatives include other Hevy MCP connectors, community integrations, or custom Hevy API assistants. Confirm before publishing competitor claims.

**Secondary:**
Hevy’s native app and API. They provide access to the underlying data but do not offer the same conversational, evidence-grounded workflow.

**Indirect:**
Spreadsheets, manual workout journals, exports, custom scripts, and generic AI assistants without live Hevy access.

**How alternatives fall short:**
They require more manual searching, lack grounded multi-week analysis, require custom technical work, or cannot combine multiple connection methods in one open-source connector.

## Differentiation

**Key differentiators:**

- Direct access to live Hevy data through MCP.
- Evidence-based answers tied to specific workout sessions.
- Three connection methods: browser OAuth, direct HTTPS, and local stdio.
- Focused tool set covering analysis, workouts, routines, exercises, measurements, and account data.
- Open-source MIT license.
- Support for both read operations and controlled mutations.
- Confirmation-aware workflow for changes.

**How we do it differently:**
Hevy MCP connects the existing Hevy account to the AI assistant the user already prefers, rather than requiring a separate training-analysis application.

**Why that’s better:**
Users can ask questions in natural language, use existing AI workflows, avoid manual data exports, and choose the connection model that fits their client and privacy preferences.

**Why customers choose us:**
Needs customer validation. Current likely reasons include the shortest path to useful answers, open-source transparency, flexible setup options, and less manual comparison of workout history.

## Objections

| Objection | Response |
|-----------|----------|
| Is this an official Hevy product? | No. Hevy MCP is an independent open-source project and is not affiliated with or endorsed by Hevy. |
| Do I need Hevy PRO? | Yes. A Hevy PRO membership is required because Hevy API access requires PRO. |
| Is my API key stored or exposed? | Handling depends on the connection method. The optional browser check sends the key directly to Hevy; browser OAuth stores it encrypted inside the OAuth grant; direct HTTPS validates it per request; local mode passes it through the local process environment. |
| Can the AI assistant change my workouts? | Yes. Mutation tools can create or update data. Compatible clients can request confirmation before changes run. |
| Do I need to install anything? | No for browser sign-in. Direct HTTPS also requires no local process. Local mode uses Node.js, Bun, or Docker. |
| Will my AI client work? | The setup supports Claude.ai, Codex, Claude Desktop, Cursor, and compatible MCP clients. The available method depends on client transport support. |

**Anti-persona:**
Users without Hevy API access or a Hevy PRO membership; people looking for an official Hevy product or official Hevy support; users who do not use an MCP-compatible AI assistant; users seeking a standalone workout-tracking app; and users uncomfortable with any third-party open-source integration.

## Switching Dynamics

**Push:**
Manual searching through workout history, comparing sessions, finding saved routines, and entering updates by hand.

**Pull:**
Plain-language questions, grounded answers, direct access to current Hevy data, multiple connection methods, and open-source transparency.

**Habit:**
Users already rely on the Hevy app, existing AI assistants, spreadsheets, or manual notes.

**Anxiety:**
API-key exposure, AI-generated inaccuracies, unintended mutations, the Hevy PRO requirement, unsupported clients, and uncertainty about an independent project.

## Customer Language

The phrases below come from current site copy and are not yet validated as customer research.

**How they describe the problem:**

- “Your Hevy data is useful. Getting answers from it should be easier.”
- “Find what you saved.”
- “Log without guessing.”
- “Instead of opening and comparing individual workouts…”

**How they describe us:**

- “Talk to your Hevy data from your AI assistant.”
- “Start with one useful question.”
- “Turn your training log into a useful conversation.”
- “Grounded in specific sessions.”

**Words to use:**
Hevy data, AI assistant, browser sign-in, direct HTTPS, run locally, evidence-based, specific sessions, plain language, open source, review before creating, connection method, read-only question.

**Words to avoid:**
Official Hevy product, magic, guaranteed progress, automated coaching, medical advice, “AI knows your body,” and unqualified security claims.

**Glossary:**

| Term | Meaning |
|------|---------|
| Hevy MCP | The open-source connector between Hevy and MCP-compatible AI assistants |
| MCP | Model Context Protocol, a standard for connecting AI assistants to external tools and data |
| Browser sign-in | OAuth-based connection through a hosted MCP endpoint |
| Direct HTTPS | Remote MCP connection using a fixed bearer credential |
| Local stdio | Running the MCP server locally as a child process |
| Transport | The connection mechanism used between the client and MCP server |
| Mutation | An operation that creates or updates data |
| Hevy API key | Credential required for Hevy API access |
| Hevy PRO | Hevy app membership currently required for API access |

## Brand Voice

**Tone:**
Clear, direct, technical, trustworthy, and calm.

**Style:**
Conversational enough for everyday lifters, precise enough for developers. Explain security and setup details plainly. Prefer concrete examples over abstract claims.

**Personality:**
Evidence-based, independent, practical, transparent, and helpful.

## Proof Points

**Metrics:**

- 25 focused MCP tools.
- 3 connection methods.
- 18-second recorded demo.
- MIT licensed.
- Established user base, currently unquantified.
- Current site includes an anonymized example based on a real Hevy MCP analysis.

**Customers:**
Hevy MCP has a meaningful existing user base, but no public customer list or quantified adoption metric is documented yet.

**Testimonials:**
No approved testimonials yet. Look first in GitHub issues and discussions, private user conversations, support interactions, and among repeat users. Ask permission before quoting private messages. Drafted quotes must be sent back to the user for approval.

**Value themes:**

| Theme | Proof |
|-------|-------|
| Faster understanding | Six-week training summaries and progression analysis |
| Less manual searching | Search across workouts, routines, folders, and exercise templates |
| Safer changes | Mutation confirmation support |
| Flexible setup | OAuth, direct HTTPS, and local stdio |
| Transparency | Open-source MIT project and public GitHub repository |
| Credential clarity | Connection-specific API-key handling explanations |

## Goals

**Business goal:**
Increase adoption and successful activation of Hevy MCP.

**Conversion action:**
Primary: connect Hevy through browser sign-in. Secondary: configure direct HTTPS or local mode. Activation event: ask “Which Hevy account is connected?” and receive a valid profile response.

**Current metrics:**
Exact user count, active users, connection rate, repeat usage, and activation rate are not documented yet.

## Changelog

*Newest first. One line per revision: what changed and why.*

- v1 (2026-07-20) — Initial context drafted from the codebase and updated with the confirmed free pricing model, Hevy PRO requirement, and current user-adoption and testimonial status.
