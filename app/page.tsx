import { Button } from "@/components/ui/button";
import { Features } from "@/components/homepage/features";
import {
  CalendarClock,
  Link as LinkIcon,
  Video,
  CreditCard,
  CheckCircle,
} from "lucide-react";

export interface FeatureData {
  id: number;
  icon: React.ElementType;
  title: string;
  description: string;
  bulletPoints: string[];
  visual: {
    icon: React.ElementType;
    gradient: string;
    color: string;
  };
  direction: "left" | "right";
}

export default function Home() {
  const featuresData: FeatureData[] = [
    {
      id: 1,
      icon: CalendarClock,
      title: "Schedule in Seconds",
      description:
        "Easily set up your online workshop. Just pick a date, time, duration, and price. We handle the rest.",
      bulletPoints: [
        "Intuitive scheduling interface",
        "Set your own price and capacity",
        "Automated reminders (optional)",
      ],
      visual: {
        icon: CalendarClock,
        gradient:
          "from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50",
        color: "text-blue-500",
      },
      direction: "right",
    },
    {
      id: 2,
      icon: LinkIcon,
      title: "Share Your Link & Get Paid",
      description:
        "Generate a unique link for your workshop. Share it anywhere – social media, email, your website. Students click, pay securely, and are registered.",
      bulletPoints: [
        "Unique, shareable workshop link",
        "Secure payment processing via Stripe",
        "Automatic attendee list management",
      ],
      visual: {
        icon: CreditCard,
        gradient:
          "from-green-100 to-teal-100 dark:from-green-900/50 dark:to-teal-900/50",
        color: "text-green-500",
      },
      direction: "left",
    },
    {
      id: 3,
      icon: Video,
      title: "Host with Integrated Video",
      description:
        "No need for external tools. Launch your live workshop directly within Edushop using our built-in, reliable video conferencing.",
      bulletPoints: [
        "One-click start for your session",
        "Screen sharing & participant management",
        "Stable and secure video calls",
      ],
      visual: {
        icon: Video,
        gradient:
          "from-yellow-100 to-orange-100 dark:from-yellow-900/50 dark:to-orange-900/50",
        color: "text-yellow-500",
      },
      direction: "right",
    },
  ];

  return (
    <div className="w-full overflow-hidden">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 py-16 md:py-24">
          <div className="flex flex-col gap-6 max-w-2xl">
            <div className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 mb-2 w-fit border border-blue-200 dark:border-blue-800">
              ✨ The easiest way to sell your knowledge
            </div>
            <h1 className="text-5xl sm:text-6xl font-extrabold leading-tight tracking-tight">
              Sell online workshops
              <br /> with{" "}
              <span className="bg-blue-700 text-white dark:bg-blue-600 dark:text-white px-2 rounded-md underline decoration-yellow-500 decoration-2 decoration-wavy underline-offset-4">
                Edushop
              </span>
            </h1>
            <p className="text-muted-foreground text-xl leading-relaxed">
              Edushop empowers educators to create, sell, and host engaging
              online workshops. You set the prices, and we handle the
              rest—payments, attendees, and delivery.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-2">
              <Button
                size="lg"
                className="w-full sm:w-fit px-8 py-6 text-lg font-medium"
              >
                Get started for free
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-fit px-8 py-6 text-lg font-medium"
              >
                Learn more
              </Button>
            </div>
            <div className="flex items-center gap-2 mt-4 text-muted-foreground">
              <span className="text-green-500">✓</span> No credit card required
              <span className="mx-2">•</span>
              <span className="text-green-500">✓</span> Free plan available
            </div>
          </div>
          <div className="relative w-full max-w-lg h-[400px] rounded-2xl overflow-hidden shadow-2xl">
            <div className="w-full h-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex flex-col items-center justify-center p-8">
              <div className="w-full bg-card rounded-lg shadow-lg p-4 mb-4">
                <div className="h-4 w-24 bg-muted-foreground/20 rounded mb-3"></div>
                <div className="flex gap-2 mb-4">
                  <div className="h-8 w-8 rounded-full bg-blue-500"></div>
                  <div className="flex flex-col justify-center">
                    <div className="h-3 w-20 bg-muted-foreground/20 rounded mb-1"></div>
                    <div className="h-2 w-16 bg-muted-foreground/10 rounded"></div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 mb-3">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="h-16 rounded bg-muted-foreground/10 flex items-center justify-center"
                    >
                      <div className="h-6 w-6 rounded-full bg-blue-500/40"></div>
                    </div>
                  ))}
                </div>
                <div className="h-3 w-full bg-muted-foreground/10 rounded mb-2"></div>
                <div className="h-3 w-4/5 bg-muted-foreground/10 rounded"></div>
              </div>
              <div className="w-3/4 bg-card rounded-lg shadow-lg p-3">
                <div className="flex justify-between items-center mb-3">
                  <div className="h-3 w-20 bg-muted-foreground/20 rounded"></div>
                  <div className="h-6 w-16 bg-blue-500 rounded-md"></div>
                </div>
                <div className="h-2 w-full bg-muted-foreground/10 rounded mb-2"></div>
                <div className="h-2 w-full bg-muted-foreground/10 rounded mb-2"></div>
                <div className="h-2 w-3/4 bg-muted-foreground/10 rounded"></div>
              </div>
              <div className="absolute bottom-4 right-4 text-lg font-semibold text-blue-700 dark:text-blue-300">
                Workshop Dashboard
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section - Pass featuresData as prop */}
      <Features featuresData={featuresData} />

      {/* Footer */}
      <footer className="border-t mt-24 py-12 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h2 className="text-2xl font-bold">Edushop</h2>
              <p className="text-muted-foreground mt-2">
                Empowering educators worldwide
              </p>
            </div>
            <div className="flex gap-8">
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                About
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Features
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Pricing
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Contact
              </a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-muted-foreground text-sm">
            Made with ❤️ by{" "}
            <a
              href="https://github.com/atharvadeosthale"
              className="hover:text-foreground transition-colors"
            >
              Atharva Deosthale
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
