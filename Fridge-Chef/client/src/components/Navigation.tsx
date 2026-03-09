import { Link, useLocation } from "wouter";
import { UtensilsCrossed, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

export function Navigation() {
  const [location] = useLocation();

  return (
    <nav className="border-b-4 border-double border-primary/20 bg-[#FFFBF0] sticky top-0 z-50 shadow-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="bg-primary text-white p-2 rounded-full group-hover:bg-primary/90 transition-colors shadow-lg">
                <UtensilsCrossed className="h-6 w-6" />
              </div>
              <div className="flex flex-col">
                <span className="font-display text-2xl font-bold text-primary tracking-wide leading-none">
                  The Daily
                </span>
                <span className="font-display text-xl font-bold text-foreground tracking-widest uppercase text-xs mt-1">
                  Special
                </span>
              </div>
            </Link>
          </div>

          <div className="flex space-x-1 sm:space-x-4">
            <NavLink href="/" active={location === "/"} icon={<UtensilsCrossed className="w-4 h-4" />}>
              Chef's Table
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

function NavLink({ href, active, children, icon }: { href: string; active: boolean; children: React.ReactNode; icon: React.ReactNode }) {
  return (
    <Link href={href}>
      <div className={`
        relative px-4 py-2 rounded-md flex items-center gap-2 font-display font-medium text-sm sm:text-base cursor-pointer
        transition-all duration-300
        ${active ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}
      `}>
        {icon}
        {children}
        {active && (
          <motion.div
            layoutId="activeTab"
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-secondary"
            initial={false}
          />
        )}
      </div>
    </Link>
  );
}
