"use client";

import Link from "next/link";
import { ModeToggle } from "@/components/mode-toggle";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  Layers,
  Palette,
  Sparkles,
  Zap,
} from "lucide-react";

function GithubIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-lg shadow">
              A
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base leading-tight tracking-tight">
                AMG-Web-V3
              </span>
              <span className="text-xs text-muted-foreground">
                Aiwa Media Group
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="https://github.com/baba-dev/AMG-Web-V3"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub repository"
              className={buttonVariants({ variant: "ghost", size: "icon" })}
            >
              <GithubIcon className="h-4 w-4" />
            </Link>
            <ModeToggle />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="relative overflow-hidden py-16 md:py-24 border-b">
          <div className="container mx-auto max-w-6xl px-4 sm:px-6">
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="flex flex-wrap items-center justify-center gap-2">
                <Badge variant="outline" className="px-3 py-1 font-medium gap-1">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  Boilerplate Ready
                </Badge>
                <Badge variant="secondary" className="px-3 py-1 font-medium">
                  Next.js App Router
                </Badge>
                <Badge variant="default" className="px-3 py-1 font-medium">
                  shadcn/ui
                </Badge>
              </div>

              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl max-w-3xl">
                Modern Web Foundation for{" "}
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Aiwa Media Group
                </span>
              </h1>

              <p className="max-w-2xl text-lg text-muted-foreground sm:text-xl">
                A high-performance web platform configured with Next.js, Tailwind CSS v4,
                TypeScript, accessible shadcn/ui components, and theme switching.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                <Link
                  href="https://github.com/baba-dev/AMG-Web-V3"
                  target="_blank"
                  rel="noreferrer"
                  className={buttonVariants({ size: "lg", className: "gap-2" })}
                >
                  <GithubIcon className="h-4 w-4" />
                  View Repository
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="https://ui.shadcn.com/docs"
                  target="_blank"
                  rel="noreferrer"
                  className={buttonVariants({
                    variant: "outline",
                    size: "lg",
                    className: "gap-2",
                  })}
                >
                  shadcn/ui Docs
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Cards Showcase */}
        <section className="py-16 bg-muted/40">
          <div className="container mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mb-10 text-center space-y-2">
              <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Installed Architecture & Stack
              </h2>
              <p className="text-muted-foreground text-sm sm:text-base">
                Everything is configured and ready for rapid feature development.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 mb-2">
                    <Zap className="h-5 w-5" />
                  </div>
                  <CardTitle>Next.js App Router</CardTitle>
                  <CardDescription>
                    React Server Components, modern routing, and Turbopack support.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span>Next.js 16 + React 19</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span>TypeScript strict typing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span>Turbopack dev bundling</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 mb-2">
                    <Palette className="h-5 w-5" />
                  </div>
                  <CardTitle>Tailwind & shadcn/ui</CardTitle>
                  <CardDescription>
                    Pre-configured design tokens, animations, and accessible primitives.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span>Tailwind CSS v4 inline themes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span>Button, Card, Input, Badge, Dropdown</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span>Dark & Light mode via next-themes</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 mb-2">
                    <Layers className="h-5 w-5" />
                  </div>
                  <CardTitle>Git & Remote Synced</CardTitle>
                  <CardDescription>
                    Directly linked to your GitHub repository with clean history.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span>origin/main tracking</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span>Preserved LICENSE & README</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    <span>Clean src/ directory structure</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Interactive Components Demo */}
            <div className="mt-12">
              <Card className="max-w-2xl mx-auto">
                <CardHeader>
                  <CardTitle>Interactive Component Test</CardTitle>
                  <CardDescription>
                    Test the shadcn Input and Button components below.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input placeholder="Enter your email or query..." />
                    <Button>Submit</Button>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-2">
                    <Button variant="default" size="sm">
                      Default
                    </Button>
                    <Button variant="secondary" size="sm">
                      Secondary
                    </Button>
                    <Button variant="outline" size="sm">
                      Outline
                    </Button>
                    <Button variant="destructive" size="sm">
                      Destructive
                    </Button>
                  </div>
                </CardContent>
                <CardFooter className="text-xs text-muted-foreground border-t pt-4">
                  Theme switching is active via the top-right toggle.
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-6 md:py-8 bg-background">
        <div className="container mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6">
          <p className="text-center text-sm text-muted-foreground sm:text-left">
            &copy; 2026 Aiwa Media Group. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link
              href="https://github.com/baba-dev/AMG-Web-V3"
              className="hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </Link>
            <span>•</span>
            <Link
              href="https://nextjs.org"
              className="hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              Next.js
            </Link>
            <span>•</span>
            <Link
              href="https://ui.shadcn.com"
              className="hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              shadcn/ui
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
