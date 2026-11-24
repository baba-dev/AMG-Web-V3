# Aiwa Editorial typography

Source baseline (before refactor; declaration counts include responsive rules, not computed styles):

```json
{
  "src/components/aiwa-hero.css": {
    "fontDeclarations": 94,
    "sha": "fc109261c4e4bcd11cdb3d63ff6b6dc541d80d5f"
  },
  "src/components/aiwa-specialisms.css": {
    "fontDeclarations": 39,
    "sha": "6961d43e71fc669f4b39522a7f5fa4cc032314cc"
  },
  "src/components/aiwa-about.css": {
    "fontDeclarations": 67,
    "sha": "0f73072256a07a4391bfb9f6bb04b374fb462ee2"
  },
  "src/components/aiwa-work.css": {
    "fontDeclarations": 28,
    "sha": "0e1e4cdeb7eb47f9038fe8c8a047a6298c54be5d"
  },
  "src/components/aiwa-footer.css": {
    "fontDeclarations": 28,
    "sha": "fb8037d7b5fd54dcac9cb61f27a1b19129c46461"
  },
  "src/components/aiwa-film-player.css": {
    "fontDeclarations": 6,
    "sha": "d9f88cc20b56acb7662b5d029459abb333548e0f"
  },
  "src/components/aiwa-route-transition.css": {
    "fontDeclarations": 16,
    "sha": "23d638e2c0a0418a5bc8961e061268d1955fa694"
  }
}
```

Anton 400: display; Barlow Condensed 900 italic: expressive emphasis; Space Grotesk 400–700: reading and interface; Geist Mono: technical metadata; Echo Kufi: Arabic artwork. Homepage and shared footer must not depend on private Roc availability. Other routes may retain licensed Roc. Keep motion transforms, geometry, content and navigation unchanged except type-related fit adjustments. Validate eight existing widths plus 1920, both themes, actual loaded fonts, all six service rows and footer links. Browser baseline screenshots and visual review require CI; source inventory alone does not establish rendered fidelity.
