# TELOS framework — source notes

> Vendored from `temp/telos-info.md` (gitignored scratch) so fresh clones keep the reference. Summary of NetworkChuck's video on Daniel Miessler's TELOS framework.

--- 

In this video, **[got AI anxiety? Do this RIGHT NOW!](https://www.youtube.com/watch?v=3BXE0e3QZ4U)**, NetworkChuck breaks down cybersecurity practitioner Daniel Miessler's **TELOS framework**—a structured Markdown-based personal context file designed to help you clarify your direction and feed structured context into AI models for coaching, red-teaming, and blind-spot analysis.

---

### Linked Timestamp: Narrative & The Elevator Pitch [[08:44](https://www.google.com/search?q=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D3BXE0e3QZ4U%26t%3D524)]

The link drops directly into the discussion on crafting your **Narrative**:

* **Beyond Job Titles:** Most people define themselves strictly by their current job or daily routines [[09:15](https://www.google.com/search?q=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D3BXE0e3QZ4U%26t%3D555)]. In an AI-accelerated job market, your identity needs to be anchored to what you are building and solving, not just a static company role.
* **Variable-Length Pitches:** You should have multi-tier versions of your story prepared—an 8-second quick answer, a 15-second elevator pitch, and a 30-second conversation starter [[08:46](https://www.google.com/search?q=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D3BXE0e3QZ4U%26t%3D526)].
* **Connecting to Mission:** The narrative translates the preceding sections (the problem you care about and the mission you have undertaken) into a compelling personal story [[08:36](https://www.google.com/search?q=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D3BXE0e3QZ4U%26t%3D516)].

---

### Core Structure of the TELOS File

The framework organizes your life context into a single `telos.md` file using four primary foundational blocks, followed by deep context sections:

| Section | Role | Timestamp |
| --- | --- | --- |
| **Problems** | External problems or societal inefficiencies you want to solve. | [[05:46](https://www.google.com/search?q=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D3BXE0e3QZ4U%26t%3D346)] |
| **Missions** | Your direct countermeasure to those problems, connected using the core unifying sentence: *"I think one of the biggest problems in the world is [X], which is why I'm [Y]."* | [[07:45](https://www.google.com/search?q=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D3BXE0e3QZ4U%26t%3D465)] |
| **Narratives** | Concise 8-, 15-, and 30-second identity pitches explaining who you are and where you are going. | [[08:36](https://www.google.com/search?q=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D3BXE0e3QZ4U%26t%3D516)] |
| **Goals** | SMART, time-bound milestones required to execute the mission. | [[11:22](https://www.google.com/search?q=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D3BXE0e3QZ4U%26t%3D682)] |

#### Additional Context Layers

* **History [[12:44](https://www.google.com/search?q=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D3BXE0e3QZ4U%26t%3D764)]:** Key formative background, pivotal past failures, and trajectory milestones that inform current behavior patterns.
* **Challenges & Insecurities [[14:05](https://www.google.com/search?q=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D3BXE0e3QZ4U%26t%3D845)]:** Brutally honest documentation of personal bottlenecks, skills deficits, or confidence hurdles [[15:19](https://www.google.com/search?q=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D3BXE0e3QZ4U%26t%3D919)].
* **Strategies & Projects [[14:56](https://www.google.com/search?q=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D3BXE0e3QZ4U%26t%3D896)]:** Systems, daily routines, and active builds designed to overcome challenges.
* **Daily Journal / Logs [[15:59](https://www.google.com/search?q=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D3BXE0e3QZ4U%26t%3D959)]:** Timestamped entries appended at the bottom to record daily activities, friction, and mood oscillations.

---

### AI Integration: "Pentesting" Your Mind

NetworkChuck highlights piping the raw Markdown file into CLI tools like Fabric or standard LLM prompts to run specific evaluations [[18:08](https://www.google.com/search?q=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D3BXE0e3QZ4U%26t%3D1088)]:

* **Red Team Thinking:** Auditing daily logs against stated goals to flag productive procrastination, avoidance patterns, or misalignment [[18:48](https://www.google.com/search?q=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D3BXE0e3QZ4U%26t%3D1128)].
* **Blind Spot Identification:** Surfacing contradictions between your articulated principles and documented behaviors [[19:32](https://www.google.com/search?q=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D3BXE0e3QZ4U%26t%3D1172)].
* **Narrative Optimization:** Refining concise opening statements tailored for interviews, collaborations, or networking [[19:22](https://www.google.com/search?q=https%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3D3BXE0e3QZ4U%26t%3D1162)].

---

### Implementation Checklist

To build and deploy a baseline `telos.md` file immediately:

1. **Create `telos.md`:** Set up a root file in your personal notes or repository using the standard schema:
```markdown
# TELOS

## Problems
- [Core external problem or structural issue you aim to solve]

## Missions
- [Your actionable countermeasure / unifying sentence]

## Narratives
- **8-Second:** [Quick identification pitch]
- **30-Second:** [Context, mission, and current trajectory]

## Goals
- [ ] [Measurable, time-bound milestone 1]
- [ ] [Measurable, time-bound milestone 2]

## History & Context
- Key background facts, career shifts, and technical foundations.

## Challenges & Insecurities
- Documented operational bottlenecks and skill gaps.

## Logs
- **YYYY-MM-DD:** [Daily reflection bullet]

```


2. **Draft the Unifying Sentence:** Draft your mission statement using the template: *"I think one of the biggest problems is [X], which is why I am focusing on [Y]."*
3. **Establish a Daily Append Routine:** Add a 1–2 sentence log entry each evening noting what you accomplished, friction encountered, and deviations from plan.
4. **Run a Red-Team Prompt:** Once you have 7–14 days of logged entries, feed `telos.md` into an LLM with the prompt:
> *"Review my stated missions and goals against my daily logs. Identify my top three blind spots, rationalize where I am confusing busywork with actual progress, and highlight where my execution contradicts my stated priorities."*
> 
>
