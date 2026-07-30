import { CalendarDays, MapPin } from "lucide-react";
import hackathon from "@/assets/event-hackathon.jpg";
import seminar from "@/assets/event-seminar.jpg";
import expo from "@/assets/event-expo.jpg";

interface DeptEvent {
  id: string;
  title: string;
  image: string;
  date: string;
  venue: string;
  points: string;
}

const EVENTS: DeptEvent[] = [
  {
    id: "hack",
    title: "InnovateCSE 24-hour Hackathon",
    image: hackathon,
    date: "12 Aug 2026",
    venue: "Dept. Computer Lab",
    points: "Up to 20 pts",
  },
  {
    id: "seminar",
    title: "National Seminar on Embedded AI",
    image: seminar,
    date: "26 Aug 2026",
    venue: "Seminar Hall",
    points: "Up to 10 pts",
  },
  {
    id: "expo",
    title: "Department Project & Robotics Expo",
    image: expo,
    date: "09 Sep 2026",
    venue: "St.Francis Auditorum",
    points: "Up to 15 pts",
  },
];

export function EventsPanel() {
  return (
    <aside className="glass space-y-4 rounded-2xl p-5">
      <div className="flex min-w-0 items-center gap-2">
        <CalendarDays className="size-4 shrink-0 text-muted-foreground" />
        <h2 className="truncate text-sm font-semibold">Upcoming department events</h2>
      </div>

      <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
        {EVENTS.map((e) => (
          <li
            key={e.id}
            className="overflow-hidden rounded-xl border border-border/60 bg-background/40"
          >
            <img
              src={e.image}
              alt={e.title}
              loading="lazy"
              width={768}
              height={512}
              className="h-32 w-full object-cover"
            />
            <div className="space-y-1.5 p-3">
              <p className="text-sm font-semibold leading-snug">{e.title}</p>
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <CalendarDays className="size-3.5 shrink-0" />
                <span className="truncate">{e.date}</span>
              </p>
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <MapPin className="size-3.5 shrink-0" />
                <span className="truncate">{e.venue}</span>
              </p>
              <span className="inline-block rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                {e.points}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
}
