import { SiteHeader } from "@/components/marketing/site-header"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import {
  Sparkles,
  Search,
  ReceiptText,
  ArrowRight,
  Check,
  Wand2,
  MapPin,
  Send,
} from "lucide-react"

const features = [
  {
    icon: Sparkles,
    title: "AI Website Builder",
    desc: "Describe the site you need and Foundry generates a complete, responsive landing page in seconds. Edit, preview, and ship.",
  },
  {
    icon: Search,
    title: "Lead Finder",
    desc: "Discover local businesses without a website in any city or niche. Save the best prospects straight to your pipeline.",
  },
  {
    icon: ReceiptText,
    title: "Finance & Invoicing",
    desc: "Build professional invoices with a guided wizard, track what's paid, and keep your freelance finances in one place.",
  },
]

const steps = [
  {
    icon: Wand2,
    title: "Generate",
    desc: "Prompt the AI builder and get a launch-ready website draft instantly.",
  },
  {
    icon: MapPin,
    title: "Prospect",
    desc: "Find local businesses that need a site and save them as leads.",
  },
  {
    icon: Send,
    title: "Get paid",
    desc: "Send polished invoices and track payments without leaving Foundry.",
  },
]

const plans = [
  {
    name: "Free",
    price: "$0",
    cadence: "forever",
    features: ["10 AI build credits", "Up to 3 projects", "Lead finder access", "Basic invoicing"],
    cta: "Start free",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$29",
    cadence: "per month",
    features: [
      "Unlimited AI credits",
      "Unlimited projects",
      "Lead exports",
      "Custom invoice branding",
      "Priority support",
    ],
    cta: "Go Pro",
    highlighted: true,
  },
  {
    name: "Agency",
    price: "$79",
    cadence: "per month",
    features: [
      "Everything in Pro",
      "Team seats",
      "Client workspaces",
      "Domain connection",
      "Dedicated manager",
    ],
    cta: "Contact sales",
    highlighted: false,
  },
]

export default function HomePage() {
  return (
    <div className="min-h-svh bg-background">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-6 pt-20 pb-12 text-center md:pt-28">
          <Badge
            variant="secondary"
            className="mb-6 gap-1.5 rounded-full border border-border bg-secondary/60 px-3 py-1 text-xs font-medium text-muted-foreground"
          >
            <Sparkles className="size-3.5 text-primary" />
            The all-in-one workspace for freelancers
          </Badge>
          <h1 className="mx-auto max-w-3xl text-balance text-4xl font-semibold tracking-tight md:text-6xl">
            Build sites, find clients, and get paid.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
            Foundry combines an AI website builder, a local lead finder, and
            invoicing into one calm, focused workspace — so you can spend less
            time on tools and more time on clients.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/auth/sign-up">
                Start building free
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <a href="#features">See how it works</a>
            </Button>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            No credit card required · 10 free AI credits
          </p>
        </div>

        <div className="mx-auto max-w-5xl px-6 pb-20">
          <div className="overflow-hidden rounded-xl border border-border bg-card shadow-2xl shadow-black/40">
            <Image
              src="/dashboard-preview.png"
              alt="Foundry dashboard showing projects, leads, and invoices"
              width={1600}
              height={900}
              className="h-auto w-full"
              priority
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t border-border/60 bg-card/30">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">
              Three tools. One workflow.
            </h2>
            <p className="mt-4 text-pretty text-muted-foreground">
              Everything a solo operator needs to win work and run the business,
              without juggling five subscriptions.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-xl border border-border bg-card p-6"
              >
                <span className="flex size-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  <f.icon className="size-5" />
                </span>
                <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="mx-auto max-w-6xl px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">
            From idea to invoice
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground">
            A simple loop that turns prospects into paying clients.
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <div key={s.title} className="relative rounded-xl border border-border bg-card p-6">
              <span className="text-sm font-mono text-muted-foreground">
                0{i + 1}
              </span>
              <span className="mt-3 flex size-10 items-center justify-center rounded-lg bg-secondary text-foreground">
                <s.icon className="size-5" />
              </span>
              <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="border-t border-border/60 bg-card/30">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-balance text-3xl font-semibold tracking-tight md:text-4xl">
              Simple, honest pricing
            </h2>
            <p className="mt-4 text-pretty text-muted-foreground">
              Start free. Upgrade when Foundry is paying for itself.
            </p>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`flex flex-col rounded-xl border bg-card p-6 ${
                  plan.highlighted
                    ? "border-primary ring-1 ring-primary"
                    : "border-border"
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{plan.name}</h3>
                  {plan.highlighted && <Badge>Popular</Badge>}
                </div>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-semibold tracking-tight">
                    {plan.price}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    /{plan.cadence}
                  </span>
                </div>
                <ul className="mt-6 flex flex-1 flex-col gap-3 text-sm">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-center gap-2">
                      <Check className="size-4 shrink-0 text-primary" />
                      <span className="text-muted-foreground">{feat}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  asChild
                  className="mt-6 w-full"
                  variant={plan.highlighted ? "default" : "secondary"}
                >
                  <Link href="/auth/sign-up">{plan.cta}</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="rounded-2xl border border-border bg-gradient-to-br from-card to-secondary/40 p-10 text-center md:p-16">
          <h2 className="mx-auto max-w-2xl text-balance text-3xl font-semibold tracking-tight md:text-4xl">
            Ready to run your freelance business from one place?
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-pretty text-muted-foreground">
            Join freelancers and small agencies building, prospecting, and
            invoicing with Foundry.
          </p>
          <Button asChild size="lg" className="mt-8">
            <Link href="/auth/sign-up">
              Create your free workspace
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/60">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 text-sm text-muted-foreground md:flex-row">
          <Logo />
          <p>© {new Date().getFullYear()} Foundry. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
