# UI & Accessibility Standards (20-ui-accessibility.md)

1. Calculator-First UX: The functional calculator interface must be positioned above the fold.
2. WCAG 2.2 AA Compliance:
   - All interactive controls must have accessible labels (`aria-label`, `<label for="...">`).
   - Visible focus indicators (minimum 2px offset, contrast >= 4.5:1).
   - Complete keyboard operability (Tab, Enter, Space, Arrow keys).
   - Screen-reader friendly aria-live announcements for dynamic calculation updates.
   - Non-color reliant statuses (use icons and clear text in addition to color).
3. Performance & JavaScript Budget:
   - Initial JavaScript budget: <= 75KB gzipped per calculator page.
   - Astro static HTML shell by default; interactive islands hydrated via `client:visible` or `client:idle`.
   - Zero render-blocking external scripts or fonts.
