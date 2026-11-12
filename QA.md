# Aven verification

## Checks

- TypeScript check passed.
- Five focused tests passed: residence identity and floor availability, architectural transforms, background-building geometry, accepted enquiry fields, and malformed/past/invalid enquiry rejection.
- Production Next.js build passed, including `/api/enquiries`.
- API integration check passed: exact scheme/host/port origin protection, invalid email rejection, reserved residence rejection, saved private enquiry, and unique confirmation reference. Its disposable record was removed.
- Browser submission reached the success confirmation with a saved `AVN-…` reference. Its disposable record was removed.
- Source design lint: zero failures and zero warnings.

## Browser review

Inspected the actual WebGL experience in the in-app browser at 1440×900, 768×1024, and 390×844. Reviewed desktop exterior, furnished cutaway, tablet architecture, mobile hero, and the complete mobile residence page. Tested floor selection, bedroom filtering, reserved homes, keyboard activation, entry/back navigation, day/dusk controls, native dialog validation, calendar selection, and viewing confirmation. No horizontal overflow was observed in the inspected layouts. The local Manrope font loaded successfully.

The video was reviewed as a frame sequence. The design follows its facade composition, left-hand headline, warm architectural palette, restrained UI, building camera move, and furnished cutaway sequence. The finished name is Aven, per the client's subsequent request.

A stale React Fast Refresh warning appeared while an effect dependency array was edited during development; the page was reloaded afterward. This was not a production error.

Reduced-motion CSS disables UI travel; the camera jumps directly to its composition and pointer parallax is disabled when the system preference is active. The browser interface did not expose media emulation, so OS-level reduced-motion switching and physical-device FPS were not benchmarked. WebGL fallback is implemented; GPU context-loss recovery was not forced.

The taste skill's standalone CDP inspector was not run because this session's browser policy requires CUA for browser interaction. Browser review and screenshots used CUA. User requirements deliberately override the skill's two-line headline and photographic-image count: the specified headline occupies three lines, and the architectural scene is real-time 3D.

## Final visual critique

Direction: The dark room, seed 1715158676. The explicit video/brief controls hero composition and palette.
Idea: Aven's eight residential levels become an architectural index, leading directly into a furnished home.
Design 8/10; usability 8/10; creativity 7/10; content 8/10. Weighted assessment: 7.8/10. This is a subjective internal critique, not an external award or performance claim.
Remaining limits: procedural geometry is not a surveyed architectural/BIM model; physical hardware performance is unmeasured; sales data needs business sign-off; enquiries require manual follow-up until a notification provider is connected.
