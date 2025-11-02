# PDF Background Theme Testing Guide

## Testing Date: 2025-10-17

This document provides a comprehensive guide to test all 4 background themes for the printable calendar PDF generator.

## Test Configuration

**Test URL**: `http://localhost:3000/de/mondkalender-2026-zum-ausdrucken`

**Common Test Parameters**:
- Region: Germany (Deutschland)
- Template: Minimal (Minimalistisch)
- Activities: Haarschnitt, Aussaat (2 activities for testing highlights)
- Year: 2026

## Theme 1: Dark Theme 🌑

### Configuration
```typescript
background: 'dark'
```

### Expected Color Palette
- **Page Background**: `#1a1a1a` (Very dark gray)
- **Cell Background**: `#2a2a2a` (Dark gray)
- **Header Background**: `#3a3a3a` (Medium dark gray)
- **Text Color**: `#e0e0e0` (Light gray)
- **Accent Color**: `#fbbf24` (Yellow/Gold)

### Visual Verification Checklist
- [ ] Title page has dark background (#1a1a1a)
- [ ] Title text is visible in light gray (#e0e0e0)
- [ ] Month headers have dark gray background (#3a3a3a)
- [ ] Month names are white or light colored for contrast
- [ ] Calendar cells have dark gray background (#2a2a2a)
- [ ] Day numbers are visible in light gray (#e0e0e0)
- [ ] Highlighted activity dates show yellow accent (#fbbf24)
- [ ] Moon emojis are visible
- [ ] Illumination percentages are readable
- [ ] Legend page uses same dark theme
- [ ] Brand watermark is visible in yellow accent color
- [ ] Overall dark space aesthetic is maintained

### Testing Steps
1. Select "Dunkel" background
2. Generate PDF
3. Verify preview shows dark theme
4. Download PDF
5. Open in PDF viewer
6. Check all months (January - December)
7. Verify legend page colors
8. Check print preview (should still be readable when printed)

---

## Theme 2: Kraft Theme 📜

### Configuration
```typescript
background: 'kraft'
```

### Expected Color Palette
- **Page Background**: `#d4a574` (Kraft paper brown)
- **Cell Background**: `#e8c9a1` (Light kraft)
- **Header Background**: `#b88a5a` (Dark kraft)
- **Text Color**: `#3a2f26` (Dark brown)
- **Accent Color**: `#8b4513` (Saddle brown)

### Visual Verification Checklist
- [ ] Title page has kraft paper texture color (#d4a574)
- [ ] Text is dark brown (#3a2f26) for good contrast
- [ ] Month headers have darker kraft color (#b88a5a)
- [ ] Month names are white for contrast on dark kraft header
- [ ] Calendar cells have light kraft background (#e8c9a1)
- [ ] Day numbers are dark brown and readable
- [ ] Highlighted dates show saddle brown accent (#8b4513)
- [ ] Overall vintage/paper aesthetic
- [ ] Legend matches kraft theme
- [ ] Warm, natural color palette throughout

### Testing Steps
1. Select "Kraftpapier" background
2. Generate PDF
3. Verify warm brown tones in preview
4. Download PDF
5. Check paper-like aesthetic
6. Verify text contrast
7. Confirm vintage appearance

---

## Theme 3: Traditional Theme 📄

### Configuration
```typescript
background: 'traditional'
```

### Expected Color Palette
- **Page Background**: `#ffffff` (White)
- **Cell Background**: `#f9fafb` (Very light gray)
- **Header Background**: `#374151` (Dark gray)
- **Text Color**: `#111827` (Almost black)
- **Accent Color**: `#059669` (Green)

### Visual Verification Checklist
- [ ] Title page has clean white background (#ffffff)
- [ ] Title text is dark and crisp (#111827)
- [ ] Month headers have dark gray background (#374151)
- [ ] Month names are white for contrast
- [ ] Calendar cells have subtle light gray (#f9fafb)
- [ ] Day numbers are dark and clear
- [ ] Highlighted dates show green accent (#059669)
- [ ] Clean, professional appearance
- [ ] High print quality expected
- [ ] Classic calendar aesthetic

### Testing Steps
1. Select "Traditionell" background
2. Generate PDF
3. Verify clean white background
4. Check text clarity
5. Download and view in PDF reader
6. Verify green activity highlights
7. Test print preview (should be very print-friendly)

---

## Theme 4: Modern Theme 🎨

### Configuration
```typescript
background: 'modern'
```

### Expected Color Palette
- **Page Background**: `#f3f4f6` (Light gray)
- **Cell Background**: `#ffffff` (White)
- **Header Background**: `#6366f1` (Indigo)
- **Text Color**: `#111827` (Almost black)
- **Accent Color**: `#4f46e5` (Indigo)

### Visual Verification Checklist
- [ ] Title page has modern light gray background (#f3f4f6)
- [ ] Text is dark and modern (#111827)
- [ ] Month headers have vibrant indigo (#6366f1)
- [ ] Month names are white on indigo headers
- [ ] Calendar cells are pure white (#ffffff)
- [ ] Subtle contrast between page and cells
- [ ] Highlighted dates show indigo accent (#4f46e5)
- [ ] Contemporary, clean design
- [ ] Professional tech-forward aesthetic
- [ ] Legend uses indigo accents

### Testing Steps
1. Select "Modern" background
2. Generate PDF
3. Verify indigo accents
4. Check modern aesthetic
5. Download PDF
6. Verify clean, contemporary look
7. Check color vibrancy

---

## Comprehensive Testing Matrix

| Theme | Page BG | Cell BG | Header BG | Text | Accent | Status |
|-------|---------|---------|-----------|------|--------|--------|
| Dark | #1a1a1a | #2a2a2a | #3a3a3a | #e0e0e0 | #fbbf24 | ⏳ |
| Kraft | #d4a574 | #e8c9a1 | #b88a5a | #3a2f26 | #8b4513 | ⏳ |
| Traditional | #ffffff | #f9fafb | #374151 | #111827 | #059669 | ⏳ |
| Modern | #f3f4f6 | #ffffff | #6366f1 | #111827 | #4f46e5 | ⏳ |

## Common Elements to Test Across All Themes

### Title Page (Page 1)
- [ ] Year title "Mondkalender 2026" centered
- [ ] Template name displayed
- [ ] Brand watermark at bottom
- [ ] Consistent color scheme

### Month Pages (Pages 2-7)
- [ ] Month header with correct background color
- [ ] Weekday abbreviations (Mo, Di, Mi, Do, Fr, Sa, So)
- [ ] Calendar grid with proper cell colors
- [ ] Day numbers in correct position
- [ ] Moon phase emojis visible
- [ ] Illumination percentages readable
- [ ] Activity highlights showing accent color
- [ ] Proper text contrast for readability

### Legend Page (Last Page)
- [ ] "Legende" title
- [ ] Selected activities listed
- [ ] Activity color boxes match accent color
- [ ] Activity descriptions readable

## Known Expected Behaviors

1. **Dark Theme**: Month header text should be white/light because header is very dark
2. **Kraft Theme**: Month header text should be white because kraft header is medium-dark
3. **Traditional**: Month header text should be white on dark gray header
4. **Modern**: Month header text should be white on indigo header

## Test Results Summary

### Dark Theme Results
- **Status**: ⏳ Pending
- **Issues Found**:
- **Notes**:

### Kraft Theme Results
- **Status**: ⏳ Pending
- **Issues Found**:
- **Notes**:

### Traditional Theme Results
- **Status**: ⏳ Pending
- **Issues Found**:
- **Notes**:

### Modern Theme Results
- **Status**: ⏳ Pending
- **Issues Found**:
- **Notes**:

## Browser Compatibility Testing

Test PDF preview and download in:
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (if available)

## PDF Viewer Testing

Test downloaded PDF in:
- [ ] Browser built-in PDF viewer
- [ ] Adobe Acrobat Reader
- [ ] Windows PDF viewer
- [ ] macOS Preview (if available)

## Accessibility Notes

All themes should maintain:
- Sufficient color contrast for text readability (WCAG AA: 4.5:1 minimum)
- Clear visual hierarchy
- Readable font sizes
- Distinguishable interactive elements

### Contrast Ratios (Estimated)

| Theme | Background vs Text | Status |
|-------|-------------------|--------|
| Dark | #1a1a1a vs #e0e0e0 | ✅ High contrast |
| Kraft | #e8c9a1 vs #3a2f26 | ✅ Good contrast |
| Traditional | #ffffff vs #111827 | ✅ Excellent contrast |
| Modern | #ffffff vs #111827 | ✅ Excellent contrast |

## Next Steps After Testing

1. ✅ Document any visual issues found
2. ✅ Fix color contrast problems
3. ✅ Optimize for print if needed
4. ✅ Update theme descriptions in UI if necessary
5. ✅ Consider adding theme preview thumbnails
