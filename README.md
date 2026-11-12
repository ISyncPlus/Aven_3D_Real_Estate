# Aven Residences

A cinematic real-time property experience for Aven, Lagos. All source, 3D geometry, materials, reference footage, and project assets live in this folder.

## Run

Node 20.9+ is required; this project was built with Node 24.

```sh
npm install
npm run dev
```

Open http://127.0.0.1:3000. For production:

```sh
npm run build
npm start
```

This is a Next.js application with a Node server, not a file you can double-click. A server is required for viewing requests.

## Checks

```sh
npm run check
npm test
```

With the local server running, `node tests/api-smoke.mjs` checks request validation, strict origin protection, reserved homes, private enquiry storage, and confirmation references. Its own disposable enquiry record is removed after the check.

## The experience

- Procedural eight-level apartment building with recessed balconies, glazing, interior details, timber screens, a branded entrance, and a furnished roof garden.
- Eight detailed surrounding buildings, planted streets, lighting, and parking.
- Cinematic introduction, three building viewpoints, pointer parallax, day/dusk lighting, and reduced-motion support.
- Floor and bedroom filters, available/reserved homes, geometry-anchored hover panels, keyboard selection, and residence price/details panels.
- Furnished one-, two-, and three-bedroom cutaways with timber flooring, layered bedding, upholstery, fitted kitchen and bathroom, and terrace furniture.
- Responsive desktop, tablet, and phone compositions with native accessible dialogs.

## Enquiries

Viewing requests are validated on the server and saved as individual private JSON files in `data/enquiries/`. Successful requests return an `AVN-…` reference. This directory is not served publicly and is excluded from Git. The operating system restricts enquiry files to the owner.

No email provider or CRM account was supplied. Enquiries are recorded for manual sales follow-up; email notifications are not automatically sent. Multi-server or ephemeral hosting needs a persistent database or storage service and a sales notification integration before launch.

## Commercial content

The final name is Aven. Lagos and NGN were confirmed by the client. The residence prices, areas, availability, amenities, and sales positioning were authored for the business presentation and need owner sign-off before commercial launch. No real street address, telephone number, sales email, planning approval, delivery date, named partner, customer review, or payment terms were fabricated.

## Assets

All geometry is authored in the project. PBR material maps and interior HDR lighting are locally hosted CC0 Poly Haven assets. Credits and source links are in `public/materials/CREDITS.md`. The Manrope font is locally hosted under the SIL Open Font License, included in `public/fonts/OFL.txt`. No runtime third-party image or font request is required.

The supplied `real estate reference.mp4` is retained unchanged. Reference observations and design decisions are in `DESIGN.md`; QA notes are in `QA.md`.
