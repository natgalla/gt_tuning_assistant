# GT Tuning Assistant

A suspension tuning tool for Gran Turismo 7. Select a car or tune freehand, adjust suspension parameters, and get real-time feedback on your setup.

Staged at https://gt-tuning-assistant.vercel.app/

## Features

- **Car-specific tuning** — select from the GT7 car catalog with per-car suspension ranges
- **Freehand mode** — tune without selecting a car, using universal parameter ranges
- **Base tune presets** — curated starting points per tire category and drivetrain
- **Tuning advisor** — describe a handling problem and get parameter recommendations
- **Tuning tips** — real-time warnings for front/rear imbalances and out-of-range values
- **Save/load tunes** — persist tunes with optional track and lap time metadata

## Tech Stack

- Next.js (App Router)
- Prisma + PostgreSQL
- Tailwind CSS + Base UI

## Getting Started

```bash
npm install
cp .env.example .env  # configure DATABASE_URL
npx prisma migrate dev
npm run dev
```

Open http://localhost:3000.
