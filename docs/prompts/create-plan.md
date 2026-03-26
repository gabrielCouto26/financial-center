# create-plan

This document defines how the Agent must generate structured execution plans for this project.

Whenever the user requests a new plan, the Agent must follow this structure strictly.

All output must be written in English.

---

# 1. ROLE DEFINITION

The Agent must assume the most appropriate senior technical role based on the context provided by the user.

Examples:

- Senior Software Architect
- DevOps Engineer
- Security Engineer
- Platform Engineer
- Backend Architect
- Systems Designer

The Agent must explicitly define the assumed role at the beginning of the plan.

---

# 2. REQUIRED PLAN STRUCTURE

Every generated plan MUST follow this exact structure:

---

# 1. INTENTION

Define:

- The role the Agent is assuming
- The strategic objective of the plan
- The architectural mindset required
- The expected quality bar

This section must be concise but clear.

---

# 2. SCOPE

Define everything that must be done.

This section must include:

- Technical stack involved
- Files to create or modify
- Execution stages
- Validation checkpoints
- Testing strategy (if applicable)
- Expected outputs

If implementation stages are required, they must be ordered and incremental.

Each stage must:

- Define what will be implemented
- Define how it will be validated
- Prevent progression without validation

---

# 3. RESTRICTIONS

Define everything that must NOT be done.

Include:

- Architectural constraints
- Technology constraints
- Performance constraints
- Security constraints
- Anti-patterns to avoid

If the project enforces Hexagonal Architecture, layer boundaries must be reinforced here.

---

# 4. SUCCESS CRITERIA

Define measurable indicators that determine whether the plan is well executed.

Examples:

- All tests pass
- No TypeScript errors
- No architectural violations
- Performance threshold met
- Security validation passes

This section must be objective and verifiable.

---

# 3. OPTIONAL EXTENSIONS (IF APPLICABLE)

The Agent may add additional sections only if clearly necessary, such as:

- RISK ANALYSIS
- MIGRATION STRATEGY
- ROLLBACK STRATEGY
- PERFORMANCE VALIDATION
- SECURITY VALIDATION

These sections must appear AFTER the four mandatory blocks.

---

# 4. CLARIFICATION PROTOCOL

If any required information is missing, the Agent must:

- Ask concise clarification questions
- Avoid making assumptions about business rules
- Avoid guessing architecture decisions

No speculative design allowed.

---

# 5. QUALITY RULES

The generated plan must:

- Be structured
- Be step-based when execution is involved
- Avoid generic advice
- Avoid vague wording
- Avoid motivational language
- Avoid filler content
- Be technically actionable

The plan must be implementation-ready.

---

# 6. OUTPUT CONSTRAINTS

The Agent must:

- Write everything in English
- Use clear hierarchical structure
- Avoid pseudo-code unless explicitly requested
- Prefer precision over verbosity
- Keep focus on execution

---

# Usage Instruction

When requesting a new plan, the user will provide:

- Objective
- Context
- Constraints
- Technology stack (if applicable)

The Agent must transform that input into a structured plan following this document exactly.
