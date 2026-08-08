# Locale Packs

`../chapters.json` contains stable gameplay rules only. Each file here supplies the player-visible copy for exactly the same chapter, line, and zone IDs.

## Files

- `manifest.json` declares supported locales and the default locale.
- `zh-CN.json` is the complete source-language reference.
- `en.json`, `de.json`, and `ru.json` are Beta adaptive localizations pending native review.

Do not change IDs, flags, `remainMode`, page bindings, or the order of zones in a locale file. Translate the visible text, then set an explicit UTF-16 `start` for every `zone.text` within its localized `raw` sentence. A zone may overlap another zone; this is intentional.

For a `remainMode: "mechanical"` zone, `remain` must equal the localized `raw` with exactly that contiguous range removed. For semantic zones, rewrite `remain`, `npc`, and `eat` so the choice still reads naturally in the target language.

All UI strings, live chat, scene metadata, audio labels, video captions, endings, and accessibility labels belong in the same locale file. Keep `nativeName` in the language's own script; Beta labels are rendered from the manifest.

Validate every change from the repository root:

```bash
node scripts/validate-chapters.mjs
npm run validate:locales
```

Use `/web/?lang=de&chapter=L3&line=L3_S04b` (replace `de`) for a focused browser check. Test desktop and a narrow mobile viewport before removing a locale's Beta status.
