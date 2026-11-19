# AMG-Web-V3
Aiwa Media Group website renovation v3.

Bootstrapped with [Next.js](https://nextjs.org) (App Router), [Tailwind CSS](https://tailwindcss.com), and [shadcn/ui](https://ui.shadcn.com).

## Getting Started

First, install dependencies and run the development server:

```bash
npm run dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Tech Stack & Architecture

- **Framework**: [Next.js](https://nextjs.org/) (App Router, React 19)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Themes**: [next-themes](https://github.com/pacocoursey/next-themes) (Light / Dark mode)

## Project Structure

```
├── src/
│   ├── app/
│   │   ├── globals.css          # Theme tokens & Tailwind directives
│   │   ├── layout.tsx           # Root layout with ThemeProvider
│   │   └── page.tsx             # Boilerplate showcase page
│   ├── components/
│   │   ├── mode-toggle.tsx      # Dark/Light mode switcher
│   │   ├── theme-provider.tsx   # NextThemes provider
│   │   └── ui/                  # shadcn/ui components
│   └── lib/
│       └── utils.ts             # Utility functions (cn helper)
├── components.json              # shadcn/ui configuration
└── package.json
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
