import Link from "next/link";
import { NoirtableMark } from "@/components/NoirtableMark";

type MobileNavLink = {
  href: string;
  label: string;
};

export function MobileNav({ links }: { links: MobileNavLink[] }) {
  return (
    <header className="fixed left-0 right-0 top-0 z-[70] border-b border-[#2d261f]/15 bg-[#e7dfd2]/95 px-4 py-3 backdrop-blur lg:hidden">
      <div className="flex items-center justify-between gap-4">
        <Link
          href="/"
          className="flex items-center gap-3 text-[9px] font-semibold uppercase tracking-[0.34em] text-[#11100d]"
        >
          <NoirtableMark className="h-5 w-5" />
          Noirtable
        </Link>
        <nav className="flex max-w-[58vw] items-center gap-4 overflow-x-auto whitespace-nowrap text-[8px] font-semibold uppercase tracking-[0.28em] text-[#11100d]/72">
          {links.map((link) => (
            <Link key={`${link.href}-${link.label}`} href={link.href}>
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
