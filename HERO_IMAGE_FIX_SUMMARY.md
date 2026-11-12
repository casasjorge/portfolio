# Hero Image Full-Width Fix Summary

## Problem
The Columbia rocket CAD hero image (and other technical diagrams) displayed white/negative space on the left and right sides despite being set to `w-full`. The image didn't span the full viewport width edge-to-edge like it should.

## Root Cause Analysis
The issue stemmed from the component hierarchy and CSS constraints:

```
PageShell (min-h-screen flex flex-col)
  └── main (flex-1)
      └── ProjectHeroMedia (w-full - but only as wide as parent main)
          └── BlurImage (fill prop with object-contain)
```

The `w-full` class on ProjectHeroMedia only made it as wide as its parent `<main>` element. Even though it had `w-full`, it was constrained by the parent container structure, not by any explicit max-width—the issue was structural positioning.

The problem was that hero images were rendered as children of the `<main>` element, keeping them in the normal document flow with its constraints.

## Solution
Refactored the layout to support hero media outside the main content container:

### 1. Updated PageShell Component
Added optional `heroSlot` prop to render hero media at the root flex container level:

```tsx
interface PageShellProps {
  heroSlot?: ReactNode;  // New prop
}

return (
  <div className="min-h-screen flex flex-col">
    {topSlot && <div className="mt-[var(--nav-height)]">{topSlot}</div>}
    {heroSlot && <div className="w-full">{heroSlot}</div>}  {/* New */}
    <main className="flex-1">{children}</main>
    {/* Footer, Theme toggle, etc. */}
  </div>
);
```

### 2. Updated ProjectHeroMedia
- Simplified conditional logic for different image modes
- Added `w-full` class to ensure proper width
- Changed sizeClass for technical diagrams from `w-full h-[60vh]` to just `h-[60vh]` (width now handled by wrapper)

```tsx
const sizeClass = isTechnical
  ? 'h-[60vh] md:h-[55vh]'  // Simplified - no w-full here anymore
  : isPortrait
    ? 'mx-auto aspect-[4/5] w-full max-w-3xl'
    : 'h-80 w-full md:h-[430px]';

return (
  <div className={`relative overflow-hidden w-full ${sizeClass} ${frameClass}...`}>
    {/* Content */}
  </div>
);
```

### 3. Updated Project Detail Page
Changed how ProjectHeroMedia is passed to PageShell—now uses the `heroSlot` prop:

```tsx
<PageShell 
  rootStyle={accentVars(project.accentColor)}
  heroSlot={
    project.heroImage ? (
      <ProjectHeroMedia
        media={project.heroImage}
        alt={project.title}
        priority
        withTopOffset={!hasSubpageNav}
        onOpen={openLightboxBySrc}
        mode={project.heroImageMode}
      />
    ) : (
      <div className={`relative w-full h-80 md:h-[430px]...`}>
        {/* Placeholder */}
      </div>
    )
  }
>
  {/* Content rendered in main */}
</PageShell>
```

## Benefits
- **Technical diagrams**: Now span full viewport width edge-to-edge with no white space padding
- **Portrait images**: Continue to work as before (centered with max-width constraint)
- **Photo images**: Continue to work as before (full width with specific heights)
- **Backward compatible**: The `heroSlot` prop is optional, so existing uses of PageShell (home page, projects list, writing) remain unchanged
- **Clean separation**: Hero media is now properly positioned at the layout level rather than buried in content flow

## Files Changed
1. `src/components/PageShell.tsx` - Added heroSlot prop support
2. `src/components/ProjectHeroMedia.tsx` - Simplified logic and added w-full
3. `src/app/projects/[slug]/client.tsx` - Updated to use heroSlot

## Testing
- ✅ Build passes with no errors
- ✅ All 18 pages generate successfully (static, SSG routes)
- ✅ No TypeScript errors
- ✅ Backward compatible with existing pages

## Result
Technical diagram images now properly display at full viewport width without negative white space, while maintaining proper layout for other image types.
