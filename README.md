# AIS Environmental website

Production site for [aisenvironmentalinc.com](https://aisenvironmentalinc.com), based on [Pac0mtz/AIS-web](https://github.com/Pac0mtz/AIS-web).

## Stack

- React + TypeScript
- Vite
- Tailwind CSS
- React Router

## Local development

```sh
npm ci
npm run dev
```

## Production

Coolify builds the multi-stage `Dockerfile` (Vite build → nginx on port 5000).
