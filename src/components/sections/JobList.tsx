"use client";

import Link from "next/link";
import { useState } from "react";
import type { Job } from "@/lib/types";
import { ChevronDown } from "@/components/ui/icons";

function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={14}
      height={14}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

export function JobList({ jobs }: { jobs: Job[] }) {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const filtered = q
    ? jobs.filter((job) =>
        [job.title, job.team, job.location, job.type].some((v) =>
          v.toLowerCase().includes(q)
        )
      )
    : jobs;

  return (
    <>
      <div className="px-6 pb-10 md:px-10">
        <label className="flex h-10 w-full max-w-[400px] items-center gap-2.5 rounded-[12px] bg-surface px-3">
          <SearchIcon className="shrink-0 text-fg-faint" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search applications..."
            className="w-full bg-transparent text-sm font-medium text-fg outline-none placeholder:text-fg-faint"
          />
        </label>
      </div>
      <div>
        {filtered.map((job) => (
          <Link
            key={job.slug}
            href={`/careers/${job.slug}`}
            className="group grid grid-cols-[1fr_auto] items-center gap-y-1 border-t border-border px-6 py-4 transition-colors hover:bg-surface/60 md:h-[60px] md:grid-cols-[minmax(0,460px)_minmax(0,315px)_1fr_auto] md:px-10 md:py-0"
          >
            <span className="text-sm font-medium leading-5 text-fg-muted transition-colors group-hover:text-fg">
              {job.title}
            </span>
            <span className="col-start-1 text-sm font-medium leading-5 text-fg md:col-start-auto">
              {job.location}
            </span>
            <span className="col-start-1 text-sm font-medium leading-5 text-fg-faint md:col-start-auto">
              {job.type}
            </span>
            <ChevronDown
              width={14}
              height={14}
              className="col-start-2 row-start-1 -rotate-90 text-fg-faint transition-transform group-hover:translate-x-0.5 md:col-start-auto md:row-start-auto"
            />
          </Link>
        ))}
        {filtered.length === 0 && (
          <p className="border-t border-border px-6 py-8 text-sm text-fg-muted md:px-10">
            No open positions match your search.
          </p>
        )}
      </div>
    </>
  );
}
