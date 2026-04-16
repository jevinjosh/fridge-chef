import { Link, useLocation } from "wouter";
import { UtensilsCrossed, BookOpen, Globe } from "lucide-react";
import { motion } from "framer-motion";

export function Navigation() {
  const [location] = useLocation();

  return (
    <nav
      className="sticky top-0 z-50"
      style={{
        background: "hsla(35,40%,97%,0.92)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid hsl(35,20%,88%)",
        boxShadow: "0 2px 20px hsla(20,25%,15%,0.06)",
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div
              className="p-2.5 rounded-xl transition-all group-hover:scale-105"
              style={{
                background: "linear-gradient(135deg, hsl(18,75%,48%), hsl(18,75%,38%))",
                boxShadow: "0 4px 14px hsla(18,75%,48%,0.4)",
              }}
            >
              <UtensilsCrossed className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col leading-none">
              <span
                className="text-xl font-bold tracking-wide"
                style={{ fontFamily: "var(--font-display)", color: "hsl(20,25%,15%)" }}
              >
                Fridge Chef
              </span>
              <span className="text-xs tracking-widest uppercase" style={{ color: "hsl(18,75%,48%)" }}>
                World Kitchen
              </span>
            </div>
          </Link>

          {/* Nav links */}
          <div className="flex space-x-1">
            <NavLink href="/" active={location === "/"} icon={<UtensilsCrossed className="w-4 h-4" />}>
              Chef's Table
            </NavLink>
            <NavLink href="/regional" active={location === "/regional"} icon={<Globe className="w-4 h-4" />}>
              World Kitchen
            </NavLink>
            <NavLink href="/cookbook" active={location === "/cookbook"} icon={<BookOpen className="w-4 h-4" />}>
              Cookbook
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavLink({
  href,
  active,
  children,
  icon,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
  icon: React.ReactNode;
}) {
  return (
    <Link href={href}>
      <div
        className="relative px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-medium cursor-pointer transition-all duration-200"
        style={{
          color: active ? "hsl(18,75%,48%)" : "hsl(20,15%,50%)",
          background: active ? "hsla(18,75%,48%,0.09)" : "transparent",
          border: active ? "1px solid hsla(18,75%,48%,0.2)" : "1px solid transparent",
        }}
        onMouseEnter={(e) => {
          if (!active) {
            (e.currentTarget as HTMLElement).style.color = "hsl(20,25%,20%)";
            (e.currentTarget as HTMLElement).style.background = "hsla(20,25%,15%,0.05)";
          }
        }}
        onMouseLeave={(e) => {
          if (!active) {
            (e.currentTarget as HTMLElement).style.color = "hsl(20,15%,50%)";
            (e.currentTarget as HTMLElement).style.background = "transparent";
          }
        }}
      >
        <span style={{ color: active ? "hsl(18,75%,48%)" : "inherit" }}>{icon}</span>
        <span style={{ fontFamily: "var(--font-display)" }}>{children}</span>
        {active && (
          <motion.div
            layoutId="activeTab"
            className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full"
            style={{ background: "hsl(18,75%,48%)" }}
            initial={false}
          />
        )}
      </div>
    </Link>
  );
}
