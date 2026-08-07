"use client";

import React from "react";

import {
  ArrowLeft,
  Info,
  Calendar,
  Star,
  RefreshCw,
  Shield,
  Smartphone,
  Globe,
  Book,
  MessageCircle,
  Mail,
  Code,
  Heart,
  Coffee,
  Scale,
  ExternalLink,
  CheckCircle,
  Folder,
  FileText,
  Search,
} from "lucide-react";

import { Folder as FolderType, Note } from "@/utils/zipHelper";

interface AboutScreenProps {
  folders: FolderType[];
  notes: Note[];
  theme: "light" | "dark" | "amoled";
  onBack: () => void;
}

export function AboutScreen({
  folders,
  notes,
  theme,
  onBack,
}: AboutScreenProps) {
  const getThemeStyles = () => {
    if (theme === "amoled") {
      return {
        bg: "bg-black text-white",
        header: "bg-black border-b border-zinc-900 text-white",
        card: "bg-zinc-950 border border-zinc-900",
        title: "text-white",
        text: "text-zinc-300",
        subtext: "text-zinc-500",
        border: "border-zinc-900",
        accent: "text-lime-400",
        badge: "bg-lime-500/10 text-lime-400 border border-lime-500/20",
        button:
          "bg-zinc-950 border border-zinc-900 hover:bg-zinc-900 text-white",
      };
    }

    if (theme === "dark") {
      return {
        bg: "bg-zinc-900 text-white",
        header: "bg-zinc-900 border-b border-zinc-800 text-white",
        card: "bg-zinc-800 border border-zinc-700",
        title: "text-white",
        text: "text-zinc-300",
        subtext: "text-zinc-400",
        border: "border-zinc-700",
        accent: "text-lime-400",
        badge: "bg-lime-500/10 text-lime-400 border border-lime-500/20",
        button:
          "bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 text-white",
      };
    }

    return {
      bg: "bg-gray-50 text-gray-900",
      header: "bg-white border-b border-gray-200 text-gray-900",
      card: "bg-white border border-gray-200",
      title: "text-gray-900",
      text: "text-gray-700",
      subtext: "text-gray-500",
      border: "border-gray-200",
      accent: "text-lime-600",
      badge: "bg-lime-50 text-lime-700 border border-lime-200",
      button:
        "bg-white border border-gray-200 hover:bg-gray-100 text-gray-900",
    };
  };

  const styles = getThemeStyles();

  const APP = {
    name: "Apptency",
    tagline: "Offline Markdown Notes",
    version: "v1.0.0",
    build: "001",
    releaseDate: "05 August 2026",
    description: "Apptency is a lightweight offline-first Markdown notes application built for fast writing, clean organization and complete privacy.",
    developer: "SquiralDot",
    website: "#",
    github: "#",
    supportEmail: "support@example.com",
  };

  const features = [
    {
      icon: FileText,
      title: "Markdown Notes",
    },
    {
      icon: Folder,
      title: "Folder Organization",
    },
    {
      icon: Smartphone,
      title: "Offline First",
    },
    {
      icon: RefreshCw,
      title: "ZIP Backup",
    },
    {
      icon: Shield,
      title: "Privacy Focused",
    },
    {
      icon: Globe,
      title: "Cross Platform",
    },
    {
      icon: Star,
      title: "AMOLED Theme",
    },
    {
      icon: Search,
      title: "Fast Search",
    },
  ];

  const ReactLogo = () => (
  <svg
    viewBox="0 0 256 256"
    className="h-9 w-9"
    fill="none"
    stroke="currentColor"
    strokeWidth="10"
  >
    <circle cx="128" cy="128" r="18" fill="currentColor" />
    <ellipse cx="128" cy="128" rx="90" ry="36" />
    <ellipse
      cx="128"
      cy="128"
      rx="90"
      ry="36"
      transform="rotate(60 128 128)"
    />
    <ellipse
      cx="128"
      cy="128"
      rx="90"
      ry="36"
      transform="rotate(120 128 128)"
    />
  </svg>
);

  const NextLogo = () => (
  <svg
    viewBox="0 0 180 180"
    className="h-9 w-9"
    fill="currentColor"
  >
    <circle cx="90" cy="90" r="82" fill="none" stroke="currentColor" strokeWidth="10"/>
    <path d="M60 55v70h10V78l48 47h12V55h-10v47L72 55z"/>
  </svg>
);

  const TypeScriptLogo = () => (
  <svg
    viewBox="0 0 128 128"
    className="h-9 w-9"
    fill="currentColor"
  >
    <rect width="128" height="128" rx="18" />
    <text
      x="64"
      y="84"
      textAnchor="middle"
      fontSize="54"
      fontWeight="700"
      fill="white"
    >
      TS
    </text>
  </svg>
);

  const TailwindLogo = () => (
  <svg
    viewBox="0 0 48 48"
    className="h-9 w-9"
    fill="currentColor"
  >
    <path d="M24 14c-5 0-8 2-10 6 3-2 5-2 8-1 2 1 3 4 5 5 3 2 7 1 11-4-2 6-6 9-11 9-5 0-7-3-9-5-2-2-4-3-8 1 2-6 7-11 14-11z"/>
  </svg>
);

  const CapacitorLogo = () => (
  <svg
    viewBox="0 0 64 64"
    className="h-9 w-9"
    fill="currentColor"
  >
    <path d="M17 18h9l6 8 6-8h9L37 32l10 14h-9l-6-8-6 8h-9l10-14z"/>
  </svg>
);

  const LucideLogo = () => (
  <svg
    viewBox="0 0 64 64"
    className="h-9 w-9"
    fill="none"
    stroke="currentColor"
    strokeWidth="5"
  >
    <circle cx="32" cy="32" r="22"/>
    <path d="M32 10v44"/>
    <path d="M10 32h44"/>
  </svg>
);

  const JSZipLogo = () => (
  <svg
    viewBox="0 0 64 64"
    className="h-9 w-9"
    fill="currentColor"
  >
    <path d="M22 8h20v10h-4v6h4v6h-4v6h4v6h-4v14H22z"/>
  </svg>
);

  const openSourceLibraries = [
  {
    name: "React",
    logo: ReactLogo,
  },
  {
    name: "Next.js",
    logo: NextLogo,
  },
  {
    name: "TypeScript",
    logo: TypeScriptLogo,
  },
  {
    name: "Tailwind CSS",
    logo: TailwindLogo,
  },
  {
    name: "Capacitor",
    logo: CapacitorLogo,
  },
  {
    name: "Lucide",
    logo: LucideLogo,
  },
  {
    name: "JSZip",
    logo: JSZipLogo,
  },
];

  return (
    <div className={`absolute inset-0 overflow-y-auto ${styles.bg}`}>

      {/* Header */}

      <header
        className={`sticky top-0 z-20 flex items-center gap-3 px-4 py-3 ${styles.header}`}
      >
        <button
          onClick={onBack}
          className={`rounded-xl p-2 transition ${styles.button}`}
        >
          <ArrowLeft size={20} />
        </button>

        <div>
          <h1 className="text-lg font-bold">About</h1>
          <p className={`text-xs ${styles.subtext}`}>
            Learn more about Apptency
          </p>
        </div>
      </header>

      <div className="space-y-5 p-4">

        {/* ===============================
            APP INFORMATION
        ================================ */}

        <section
          className={`rounded-3xl p-5 shadow-sm ${styles.card}`}
        >
          <div className="flex items-center gap-3">

            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-lime-500 text-2xl font-bold text-black">
              A
            </div>

            <div className="flex-1">
              <h2 className={`text-2xl font-bold ${styles.title}`}>
                {APP.name}
              </h2>

              <p className={`mt-1 text-sm ${styles.subtext}`}>
                {APP.tagline}
              </p>

              <div
                className={`mt-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${styles.badge}`}
              >
                <CheckCircle size={14} />
                Stable Release
              </div>
            </div>
          </div>

          <div className={`my-5 border-t ${styles.border}`} />

          <div className="grid gap-4 sm:grid-cols-3">

            <div className="flex items-start gap-3">
              <Info
                size={18}
                className={`mt-0.5 ${styles.accent}`}
              />

              <div>
                <p className={`text-xs ${styles.subtext}`}>
                  Version
                </p>

                <p className="font-semibold">
                  {APP.version}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Info
                size={18}
                className={`mt-0.5 ${styles.accent}`}
              />

              <div>
                <p className={`text-xs ${styles.subtext}`}>
                  Build
                </p>

                <p className="font-semibold">
                  {APP.build}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar
                size={18}
                className={`mt-0.5 ${styles.accent}`}
              />

              <div>
                <p className={`text-xs ${styles.subtext}`}>
                  Release Date
                </p>

                <p className="font-semibold">
                  {APP.releaseDate}
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* ===============================
            ABOUT APPTENCY
        ================================ */}

        <section
          className={`rounded-3xl p-5 shadow-sm ${styles.card}`}
        >

          <div className="mb-4 flex items-center gap-3">
            <Info className={styles.accent} size={20} />

            <h3 className={`text-lg font-semibold ${styles.title}`}>
              About Apptency
            </h3>
          </div>

          <p className={`leading-7 ${styles.text}`}>
            Apptency is a clean, distraction-free Markdown notes
            application designed for people who prefer writing,
            organizing and managing notes completely offline.
            Everything stays on your device, giving you full
            control over your data without ads, tracking or
            mandatory accounts.
          </p>

        </section>

        {/* ===============================
            FEATURES
        ================================ */}

        <section
          className={`rounded-3xl p-5 shadow-sm ${styles.card}`}
        >

          <div className="mb-5 flex items-center gap-3">
            <Star className={styles.accent} size={20} />

            <h3 className={`text-lg font-semibold ${styles.title}`}>
              Features
            </h3>
          </div>

          <div className="grid gap-3">

            {features.map((feature) => {
  const Icon = feature.icon;

  return (
    <div
      key={feature.title}
      className={`flex items-center gap-3 rounded-2xl border p-3 ${styles.border}`}
    >
      <Icon
        size={18}
        className={styles.accent}
      />

      <span>{feature.title}</span>
    </div>
  );
})}

          </div>

        </section>

                {/* ===============================
            WHAT'S NEW
        ================================ */}

        <section
          className={`rounded-3xl p-5 shadow-sm ${styles.card}`}
        >
          <div className="mb-5 flex items-center gap-3">
            <RefreshCw className={styles.accent} size={20} />

            <h3 className={`text-lg font-semibold ${styles.title}`}>
              What's New
            </h3>
          </div>

          <div className="space-y-3">

            {[
              "Brand new Apptency branding.",
              "Improved Markdown editing experience.",
              "Better folder management.",
              "Improved search performance.",
              "Enhanced ZIP backup & restore.",
              "General bug fixes and performance improvements.",
            ].map((item) => (
              <div
                key={item}
                className={`flex items-start gap-3 rounded-2xl border p-3 ${styles.border}`}
              >
                <CheckCircle
                  size={18}
                  className={`mt-0.5 ${styles.accent}`}
                />

                <span className={styles.text}>
                  {item}
                </span>
              </div>
            ))}

          </div>
        </section>

        {/* ===============================
            APP STATISTICS
        ================================ */}

        <section
          className={`rounded-3xl p-5 shadow-sm ${styles.card}`}
        >
          <div className="mb-5 flex items-center gap-3">
            <Book className={styles.accent} size={20} />

            <h3 className={`text-lg font-semibold ${styles.title}`}>
              App Statistics
            </h3>
          </div>

          <div className="grid grid-cols-2 gap-4">

            <div
              className={`rounded-2xl border p-4 text-center ${styles.border}`}
            >
              <p className={`text-xs ${styles.subtext}`}>
                Total Notes
              </p>

              <p className="mt-2 text-3xl font-bold">
                {notes.length}
              </p>
            </div>

            <div
              className={`rounded-2xl border p-4 text-center ${styles.border}`}
            >
              <p className={`text-xs ${styles.subtext}`}>
                Total Folders
              </p>

              <p className="mt-2 text-3xl font-bold">
                {folders.length}
              </p>
            </div>

          </div>
        </section>

                {/* ===============================
            UPDATES
        ================================ */}

        <section
          className={`rounded-3xl p-5 shadow-sm ${styles.card}`}
        >
          <div className="mb-5 flex items-center gap-3">
            <RefreshCw className={styles.accent} size={20} />

            <h3 className={`text-lg font-semibold ${styles.title}`}>
              Updates
            </h3>
          </div>

          <div className="space-y-4">

            <div
              className={`rounded-2xl border p-4 ${styles.border}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-xs ${styles.subtext}`}>
                    Current Version
                  </p>

                  <p className="mt-1 font-semibold">
                    {APP.version}
                  </p>
                </div>

                <Info
                  size={22}
                  className={styles.accent}
                />
              </div>
            </div>

            <div
              className={`rounded-2xl border p-4 ${styles.border}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-xs ${styles.subtext}`}>
                    Latest Version
                  </p>

                  <p className="mt-1 font-semibold">
                    {APP.version}
                  </p>
                </div>

                <CheckCircle
                  size={22}
                  className="text-green-500"
                />
              </div>
            </div>

            <div
              className={`rounded-2xl border p-4 ${styles.border}`}
            >
              <p className={`text-xs ${styles.subtext}`}>
                Update Status
              </p>

              <p className="mt-2 font-medium text-green-500">
                You're using the latest version.
              </p>
            </div>

            <button
              className={`flex w-full items-center justify-center gap-2 rounded-2xl py-3 font-medium transition ${styles.button}`}
            >
              <RefreshCw size={18} />
              Check for Updates
            </button>

          </div>
        </section>

        {/* ===============================
            DEVICE INFORMATION
        ================================ */}

        <section
          className={`rounded-3xl p-5 shadow-sm ${styles.card}`}
        >
          <div className="mb-5 flex items-center gap-3">
            <Smartphone
              className={styles.accent}
              size={20}
            />

            <h3 className={`text-lg font-semibold ${styles.title}`}>
              Device Information
            </h3>
          </div>

          <div className="space-y-3">

            <div
              className={`flex items-center justify-between rounded-2xl border p-3 ${styles.border}`}
            >
              <span className={styles.subtext}>
                Platform
              </span>

              <span className="font-medium">
                Android
              </span>
            </div>

            <div
              className={`flex items-center justify-between rounded-2xl border p-3 ${styles.border}`}
            >
              <span className={styles.subtext}>
                Storage
              </span>

              <span className="font-medium">
                Local Storage
              </span>
            </div>

            <div
              className={`flex items-center justify-between rounded-2xl border p-3 ${styles.border}`}
            >
              <span className={styles.subtext}>
                Notes
              </span>

              <span className="font-medium">
                {notes.length}
              </span>
            </div>

            <div
              className={`flex items-center justify-between rounded-2xl border p-3 ${styles.border}`}
            >
              <span className={styles.subtext}>
                Folders
              </span>

              <span className="font-medium">
                {folders.length}
              </span>
            </div>

          </div>
        </section>

        {/* ===============================
            OFFICIAL LINKS
        ================================ */}

        <section
          className={`rounded-3xl p-5 shadow-sm ${styles.card}`}
        >
          <div className="mb-5 flex items-center gap-3">
            <Globe
              className={styles.accent}
              size={20}
            />

            <h3 className={`text-lg font-semibold ${styles.title}`}>
              Official Links
            </h3>
          </div>

          <div className="space-y-3">

            {[
              {
                icon: Globe,
                title: "GitHub",
                subtitle: "Source Code & Releases",
              },
              {
                icon: Globe,
                title: "Website",
                subtitle: "Official Website",
              },
              {
                icon: Book,
                title: "Documentation",
                subtitle: "User Guide",
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <button
                  key={item.title}
                  className={`flex w-full items-center justify-between rounded-2xl border p-4 transition ${styles.border}`}
                >
                  <div className="flex items-center gap-3">

                    <Icon
                      size={20}
                      className={styles.accent}
                    />

                    <div className="text-left">
                      <p className="font-medium">
                        {item.title}
                      </p>

                      <p
                        className={`text-xs ${styles.subtext}`}
                      >
                        {item.subtitle}
                      </p>
                    </div>

                  </div>

                  <ExternalLink
                    size={18}
                    className={styles.subtext}
                  />
                </button>
              );
            })}

          </div>
        </section>

        {/* ===============================
            FEEDBACK
        ================================ */}

        <section
          className={`rounded-3xl p-5 shadow-sm ${styles.card}`}
        >
          <div className="mb-5 flex items-center gap-3">
            <MessageCircle
              className={styles.accent}
              size={20}
            />

            <h3 className={`text-lg font-semibold ${styles.title}`}>
              Feedback
            </h3>
          </div>

          <div className="space-y-3">

            {[
              {
                icon: MessageCircle,
                title: "Report a Bug",
              },
              {
                icon: Star,
                title: "Request a Feature",
              },
              {
                icon: Mail,
                title: "Contact Support",
              },
            ].map((item) => {
              const Icon = item.icon;

              return (
                <button
                  key={item.title}
                  className={`flex w-full items-center justify-between rounded-2xl border p-4 transition ${styles.border}`}
                >
                  <div className="flex items-center gap-3">

                    <Icon
                      size={20}
                      className={styles.accent}
                    />

                    <span>{item.title}</span>

                  </div>

                  <ExternalLink
                    size={18}
                    className={styles.subtext}
                  />
                </button>
              );
            })}

          </div>
        </section>

                {/* ===============================
            PRIVACY
        ================================ */}

        <section
          className={`rounded-3xl p-5 shadow-sm ${styles.card}`}
        >
          <div className="mb-5 flex items-center gap-3">
            <Shield
              className={styles.accent}
              size={20}
            />

            <h3 className={`text-lg font-semibold ${styles.title}`}>
              Privacy
            </h3>
          </div>

          <div className="space-y-3">

            {[
              "Your notes never leave your device.",
              "No account is required.",
              "No advertisements.",
              "No analytics or tracking.",
              "Offline-first experience.",
              "You own your data."
            ].map((item) => (
              <div
                key={item}
                className={`flex items-start gap-3 rounded-2xl border p-3 ${styles.border}`}
              >
                <Shield
                  size={18}
                  className={`mt-0.5 ${styles.accent}`}
                />

                <span className={styles.text}>
                  {item}
                </span>
              </div>
            ))}

          </div>
        </section>

        {/* ===============================
            OPEN SOURCE
        ================================ */}

        <section
          className={`rounded-3xl p-5 shadow-sm ${styles.card}`}
        >
          <div className="mb-5 flex items-center gap-3">
            <Code
              className={styles.accent}
              size={20}
            />

            <h3 className={`text-lg font-semibold ${styles.title}`}>
              Open Source Libraries
            </h3>
          </div>

          <div className="overflow-hidden">

    <div className="opensource-slider">

        {[...openSourceLibraries, ...openSourceLibraries].map((item, index) => {

          const Logo = item.logo;

          return (
            
            <div
                key={index}
                className={`opensource-card ${styles.border} ${styles.accent}`}
            >
              <Logo />
            </div>
            
            );
          
        })}

    </div>

</div>
        </section>

        {/* ===============================
            CREDITS
        ================================ */}

        <section
          className={`rounded-3xl p-5 shadow-sm ${styles.card}`}
        >
          <div className="mb-5 flex items-center gap-3">
            <Heart
              className={styles.accent}
              size={20}
            />

            <h3 className={`text-lg font-semibold ${styles.title}`}>
              Credits
            </h3>
          </div>

          <div
            className={`rounded-2xl border p-5 text-center ${styles.border}`}
          >
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-lime-500 text-2xl font-bold text-black">
              S
            </div>

            <h4 className="text-xl font-semibold">
              SquiralDot
            </h4>

            <p className={`mt-2 ${styles.subtext}`}>
              Designed & Developed with ❤️
            </p>

            <p className={`mt-3 text-sm ${styles.text}`}>
              Thank you for using Apptency and
              supporting independent software
              development.
            </p>
          </div>
        </section>

        {/* ===============================
            SUPPORT DEVELOPMENT
        ================================ */}

        <section
          className={`rounded-3xl p-5 shadow-sm ${styles.card}`}
        >
          <div className="mb-5 flex items-center gap-3">
            <Coffee
              className={styles.accent}
              size={20}
            />

            <h3 className={`text-lg font-semibold ${styles.title}`}>
              Support Development
            </h3>
          </div>

          <div className="space-y-3">

            <button
              className={`flex w-full items-center justify-between rounded-2xl border p-4 transition ${styles.border}`}
            >
              <div className="flex items-center gap-3">
                <Coffee
                  size={20}
                  className={styles.accent}
                />

                <span>Buy Me a Coffee</span>
              </div>

              <ExternalLink
                size={18}
                className={styles.subtext}
              />
            </button>

            <button
              className={`flex w-full items-center justify-between rounded-2xl border p-4 transition ${styles.border}`}
            >
              <div className="flex items-center gap-3">
                <Heart
                  size={20}
                  className={styles.accent}
                />

                <span>Sponsor Project</span>
              </div>

              <ExternalLink
                size={18}
                className={styles.subtext}
              />
            </button>

          </div>
        </section>

        {/* ===============================
            LEGAL
        ================================ */}

        <section
          className={`rounded-3xl p-5 shadow-sm ${styles.card}`}
        >
          <div className="mb-5 flex items-center gap-3">
            <Scale
              className={styles.accent}
              size={20}
            />

            <h3 className={`text-lg font-semibold ${styles.title}`}>
              Legal
            </h3>
          </div>

          <div className="space-y-3">

            {[
              "Privacy Policy",
              "Terms of Service",
              "Open Source Licenses",
            ].map((item) => (
              <button
                key={item}
                className={`flex w-full items-center justify-between rounded-2xl border p-4 transition ${styles.border}`}
              >
                <span>{item}</span>

                <ExternalLink
                  size={18}
                  className={styles.subtext}
                />
              </button>
            ))}

          </div>
        </section>

        {/* ===============================
            FOOTER
        ================================ */}

        <div className="pb-8 pt-2 text-center">

          <p className={`text-sm ${styles.subtext}`}>
            © 2026 Apptency
          </p>

          <p className={`mt-2 text-xs ${styles.subtext}`}>
            Made with ❤️ by SquiralDot
          </p>

        </div>

      </div>
    </div>
  );
}

