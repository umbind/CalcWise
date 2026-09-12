---
name: production-incident
description: Governs defect reproduction, root cause analysis, containment, hotfix, and mandatory regression testing.
---

# Production Incident Skill

## Incident Workflow
1. DETECT -> CLASSIFY -> REPRODUCE -> CONTAIN -> FIX -> TEST -> DEPLOY -> VERIFY -> ROOT CAUSE -> ADD REGRESSION TEST -> DOCUMENT.
2. Mandatory rule: Never close a calculation defect without committing a permanent regression test in `/tests/unit/` or `/tests/golden/`.
