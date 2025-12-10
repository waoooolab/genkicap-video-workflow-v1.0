# Script Writing Output Template (Mode 1)
> This template is for the output file `stages/draft.md` in Phase 4 (Script Writing) of Mode 1.

---

## 1. Template Structure
# Video Script Draft: 《[Video Title]》

[Opening description based on actual context, e.g.: "Based on the outline, I have completed the full script for you..."]

---
## I. [Section 1 Name] (Target: [X] Words)
[Complete script content paragraphs...]
**Actual Word Count**: Approximately [X] words

---
## II. [Section 2 Name] (Target: [X] Words)
[Complete script content paragraphs...]
**Actual Word Count**: Approximately [X] words

---
## III. [Section 3 Name] (Target: [X] Words)
[Complete script content paragraphs...]
**Actual Word Count**: Approximately [X] words

---
## IV. [Section 4 Name] (Target: [X] Words)
[Complete script content paragraphs...]
**Actual Word Count**: Approximately [X] words

---
## V. [Closing Section Name] (Target: [X] Words)
[Complete script content paragraphs...]
**Actual Word Count**: Approximately [X] words

---
Does this script meet your expectations? Which part needs adjustment?

---

## 2. Generation Strategy
Intelligently determine the generation method based on video duration and context capacity:

### 1. Short Videos (≤ 3 minutes, approx. ≤ 500 words)
- Strategy: Generate the complete script in one go
- Output: Full script + word count statistics

### 2. Medium-length Videos (3-10 minutes, approx. 500-1800 words)
- Strategy: Generate in one go if within context limits; otherwise generate in segments
- Output: Full script + word count statistics

### 3. Long Videos (> 10 minutes, approx. > 1800 words)
- Strategy: Generate in one go if within context limits; otherwise generate in segments and confirm with user after each segment
- Segment Output Template:
# Video Script Draft: 《[Video Title]》

[Opening description based on actual context, e.g.: "Since this is a long video, we will generate it in segments. Let's start with the first part..."]

---
## I. [Section 1 Name] (Target: [X] Words)
[Content...]
**Actual Word Count**: Approximately [X] words

---
Does this opening meet your expectations? Do you need to adjust the tone or add/remove content?
[Proceed to next segment after user confirmation...]

---

## 3. Example Reference (One-time Generation Version)
# Video Script Draft: 《Your Design Team Might Be Obsolete》
Based on the outline, I have completed the full script for you.

---
## I. Outdated Workflows (Target: 100 Words)
Did you know? 80% of the work most design teams do today may be worthless in the AI era.

I'm not talking about AI "assisting" designers—AI is directly replacing repetitive design execution tasks: generating 100 button variants, adjusting responsive layouts, and batch-exporting assets. Tasks that once took designers hours can now be completed by AI in minutes.

But the core issue isn't the change in tools; it's the misalignment of design teams' value positioning. If your team still focuses on "execution-oriented" work—competing on who can create designs faster or revise drafts more—it might truly be obsolete. Because the AI era demands "strategy-oriented" design teams.
**Actual Word Count**: Approximately 180 words

---
## II. What AI Can Automate Now (Target: 400 Words)
Let me break down exactly which design tasks AI can take over today.

First: UI variants and design system components. Previously, creating 10 button variants (different sizes, states, and themes) manually could take half a day. Now, AI plugins can generate them with one click and automatically sync to design system specifications. Designers no longer need to spend time on such mechanical adjustments.

Second: Asset production and basic layout. For example, adapting icon assets for multiple platforms or automatically adjusting card layouts based on content. These tasks take AI minutes to complete, while manual work could take hours.

What are the hidden costs of this repetitive labor? Extended iteration cycles (revising assets takes 2 hours manually vs. 5 minutes with AI) and delayed feedback loops (designers get stuck in execution and can't respond quickly to stakeholder adjustments).

After AI replaces these tasks, designers can save 4 hours per day. What can they do with this time? User research, experience strategy, product vision planning—these are truly high-value tasks.

However, freeing up time doesn't solve the problem. This freed-up time creates both the challenge of "team role restructuring" and the opportunity for "value upgrading." How can designers shift from "executors" to "strategists"? That's what we'll discuss next.
**Actual Word Count**: Approximately 420 words

---
## III. New Design Strategy Requirements (Target: 500 Words)
[Complete content...]
**Actual Word Count**: Approximately 480 words

---
## IV. Implementing an AI-Driven Design Framework (Target: 500 Words)
[Complete content...]
**Actual Word Count**: Approximately 450 words

---
## V. Strategic Necessity (Target: 100 Words)
[Complete content...]
**Actual Word Count**: Approximately 90 words

---
Does this script meet your expectations? Which part needs adjustment?

---

## 4. Next Steps Confirmation Template
# Script Draft Completed: 《[Video Title]》

[Description based on actual context, e.g.: "The first draft of the script is complete! Let's review the overall details..."]

**Title**: 《[Video Title]》
**Target Duration**: [X] minutes
**Total Actual Word Count**: [XXXX] words (Target: [XXXX] words, approx. [X] min [X] sec)

**Actual Word Count by Section**:
- I. [Section 1]: [X] words (Target: [X] words, approx. [X] min [X] sec, [over/under] [X] words)
- II. [Section 2]: [X] words (Target: [X] words, approx. [X] min [X] sec)
- III. [Section 3]: [X] words (Target: [X] words, approx. [X] min [X] sec)
- IV. [Section 4]: [X] words (Target: [X] words, approx. [X] min [X] sec)
- V. [Section 5]: [X] words (Target: [X] words, approx. [X] min [X] sec)

**Notes**: [Explanation of word count deviations, e.g.: "The first section slightly exceeds the target word count and can be streamlined during editing; other sections meet the target."]

## Next Steps
You can choose:
1. **Proceed to Editing & Optimization** → Streamline content, adjust tone, refine expression
2. **Adjust a Specific Section** → Rewrite or expand the designated section
3. **Supplement Background Information** → Add more context to enrich content
4. **Export Final Script Directly** → Skip editing and save as the final version

---

## 5. Usage Instructions
### 1. Output Timing
- Based on the outline structure in `stages/outline.md`
- After writing the complete script according to the word count allocation and core points for each section
- Maintain colloquial expression that aligns with video narration style

### 2. Mandatory Elements
- ✅ Complete video script content (structured per outline)
- ✅ Actual word count statistics for each section
- ✅ Next-step guidance

### 3. Key Rules
#### Script Writing Rules
- Use colloquial language suitable for video narration
- Avoid formal written language and complex sentence structures
- Maintain moderate information density and smooth pacing
- Ensure clear logic and natural transitions

#### Word Count Control
- Keep each section within ±10% of the target word count
- Total word count must match the target video duration
- Explain any deviations in the "Next Steps Confirmation" section

### 4. File Management
- Current Version: `stages/draft.md`
- Historical Versions: `_archive/draft_v01.md`, `_archive/draft_v02.md`
- When users request modifications/regeneration, move old versions to the `_archive/` directory
- Continue updating this file during the optimization/editing phase (increment version numbers)

### 5. User Feedback Handling
- Confirm script → Proceed to next steps confirmation
- Modify a specific section → Regenerate content for the designated section
- Request additional explanations → Provide verbal/written clarification