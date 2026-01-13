import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface PageShellProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  backHref?: string;
  rightElement?: React.ReactNode;
}

export function PageShell({
  title,
  subtitle,
  children,
  backHref = "/",
  rightElement,
}: PageShellProps) {
  return (
    <main className="min-h-screen gradient-bg grid-pattern">
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href={backHref}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm">Back</span>
          </Link>

          <div className="text-center">
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-white">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
            )}
          </div>

          <div className="w-16 flex justify-end">
            {rightElement}
          </div>
        </div>

        {children}
      </div>
    </main>
  );
}
