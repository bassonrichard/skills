---
name: drawio-diagram
description: Use when the user asks for an editable diagram in draw.io / diagrams.net — flowcharts, UML, ERD, cloud or network architecture, org charts, BPMN, wireframes. Generates the diagram and opens it in draw.io via a script-built link.
---

# draw.io diagram

1. **Pick the format.**
   - Mermaid: flowcharts, sequence, ERD, state, class, Gantt.
   - CSV: hierarchies such as org charts.
   - draw.io XML (`<mxGraphModel>`): precise layout, cloud icons, custom styling.
2. **Write the diagram** to a file in the scratchpad (or `/tmp` if there isn't one).
3. **Build and open the link:**

   ```bash
   python3 <this skill's folder>/scripts/drawio_url.py mermaid < diagram.mmd
   ```

   The script round-trip checks the encoding, prints the URL and opens it in the default browser. Add `--no-open` to only print it.
4. **Never retype or paste the URL in chat.** It is compressed base64, and one changed character breaks it. Tell the user it's open in their browser. If they want the link, give them the script's exact output, copied verbatim.

For a diagram that should live in the repo or a PR, prefer a Mermaid code block. GitHub renders it and it stays diffable.

## Format notes

- **CSV:** header directives come first, then data:

  ```
  # label: %name%
  # connect: {"from":"manager","to":"name","invert":true}
  # layout: auto
  name,manager
  CEO,
  CTO,CEO
  ```
- **XML:** cells `0` and `1` are required roots. Shapes are `<mxCell vertex="1" parent="1" style="rounded=1;…">` with an `<mxGeometry>`, and edges use `edge="1" source="…" target="…"`.
