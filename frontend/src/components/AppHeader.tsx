import { Link } from "@tanstack/react-router";
import { CarFront } from "lucide-react";

export function AppHeader() {
  const cls = "rounded-md px-3 py-2 text-sm font-medium text-primary-foreground/80 hover:text-primary-foreground";
  return (
    <header className="bg-hero">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link to="/" className="flex items-center gap-2 text-primary-foreground">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-accent text-accent-foreground">
            <CarFront className="h-5 w-5" />
          </span>
          <span className="font-display text-lg font-bold">Vaga Certa</span>
        </Link>
        <nav className="flex gap-1">
          <Link to="/" className={cls} activeOptions={{ exact: true }} activeProps={{ className: "bg-primary-foreground/10 text-primary-foreground" }}>Reservar</Link>
          <Link to="/reservas" className={cls} activeProps={{ className: "bg-primary-foreground/10 text-primary-foreground" }}>Minhas reservas</Link>
        </nav>
      </div>
      <div className="lane-stripes h-1 opacity-80" />
    </header>
  );
}
