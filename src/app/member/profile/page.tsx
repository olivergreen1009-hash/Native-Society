"use client";

import { FormEvent, useEffect, useState } from "react";
import { DEMO_MEMBER } from "@/lib/sample-data";
import type { MemberAccount } from "@/lib/types";

const PROFILE_KEY = "ns-member-profile";

export default function MemberProfilePage() {
  const [profile, setProfile] = useState<MemberAccount>(DEMO_MEMBER);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(PROFILE_KEY);
      if (raw) setProfile(JSON.parse(raw) as MemberAccount);
    } catch {
      /* keep default */
    }
  }, []);

  const onSave = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const next: MemberAccount = {
      ...profile,
      name: String(data.get("name") ?? profile.name),
      neighborhood: String(data.get("neighborhood") ?? profile.neighborhood),
      school: String(data.get("school") ?? profile.school),
      bio: String(data.get("bio") ?? profile.bio),
    };
    localStorage.setItem(PROFILE_KEY, JSON.stringify(next));
    setProfile(next);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="mx-auto max-w-2xl px-5 md:px-8">
      <p className="text-xs uppercase tracking-[0.3em] text-ns-gold">Your presence</p>
      <h1 className="font-heading mt-3 text-4xl text-ns-cream">Profile</h1>
      <p className="mt-4 text-sm text-ns-muted">
        Only curators and facilitated introductions see these details. Keep your tone
        discreet and true to how you move through the city.
      </p>
      <form onSubmit={onSave} className="mt-10 space-y-5">
        <Input label="Display name" name="name" defaultValue={profile.name} />
        <Input
          label="Neighborhood"
          name="neighborhood"
          defaultValue={profile.neighborhood}
        />
        <Input label="School lineage" name="school" defaultValue={profile.school} />
        <div>
          <label className="text-xs uppercase tracking-widest text-ns-muted">Bio</label>
          <textarea
            name="bio"
            rows={5}
            defaultValue={profile.bio}
            className="mt-2 w-full rounded border border-ns-border bg-ns-surface px-4 py-3 text-sm text-ns-cream outline-none focus:border-ns-gold"
          />
        </div>
        <button
          type="submit"
          className="rounded-full bg-ns-gold px-8 py-3 text-sm uppercase tracking-widest text-ns-bg hover:bg-ns-cream"
        >
          Save profile
        </button>
        {saved && (
          <p className="text-sm text-ns-gold">Saved for this device.</p>
        )}
      </form>
    </div>
  );
}

function Input({
  label,
  name,
  defaultValue,
}: {
  label: string;
  name: string;
  defaultValue: string;
}) {
  return (
    <div>
      <label className="text-xs uppercase tracking-widest text-ns-muted">{label}</label>
      <input
        name={name}
        defaultValue={defaultValue}
        className="mt-2 w-full rounded border border-ns-border bg-ns-surface px-4 py-3 text-sm text-ns-cream outline-none focus:border-ns-gold"
      />
    </div>
  );
}
