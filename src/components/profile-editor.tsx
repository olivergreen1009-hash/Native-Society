"use client";

import { FormEvent, useEffect, useState } from "react";
import { FormField, inputClassName } from "@/components/ui/form-field";
import type { GenderIdentity, Preferences, Profile } from "@/types/domain";

const emptyProfile = (userId: string): Profile => ({
  id: `profile-${userId}`,
  userId,
  firstName: "",
  age: 28,
  bio: "",
  photos: [
    { id: "ph-1", profileId: `profile-${userId}`, url: "", sortOrder: 0 },
    { id: "ph-2", profileId: `profile-${userId}`, url: "", sortOrder: 1 },
    { id: "ph-3", profileId: `profile-${userId}`, url: "", sortOrder: 2 },
  ],
  prompts: [
    { id: "pr-1", question: "A perfect evening in New York", answer: "" },
    { id: "pr-2", question: "What you're looking for", answer: "" },
  ],
  interests: [],
  schoolLine: "",
  neighborhood: "",
  discoverable: false,
  completedOnboarding: false,
  updatedAt: new Date().toISOString(),
});

const defaultPrefs = (userId: string): Preferences => ({
  userId,
  genders: ["man", "woman"],
  ageMin: 25,
  ageMax: 40,
  locationRadius: "nyc",
  relationshipIntention: ["long_term"],
});

export function ProfileEditor({ onboarding }: { onboarding?: boolean }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [prefs, setPrefs] = useState<Preferences | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    void (async () => {
      const res = await fetch("/api/profile");
      if (!res.ok) return;
      const json = (await res.json()) as {
        profile: Profile | null;
        preferences: Preferences | null;
        user: { id: string };
      };
      setProfile(json.profile ?? emptyProfile(json.user.id));
      setPrefs(json.preferences ?? defaultPrefs(json.user.id));
    })();
  }, []);

  const onSave = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!profile || !prefs) return;
    const data = new FormData(e.currentTarget);
    const interests = String(data.get("interests") ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      ...profile,
      interests,
      prompts: profile.prompts.map((p, i) => ({
        ...p,
        answer: String(data.get(`prompt-${i}`) ?? "") || p.answer,
      })),
    };

    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profile: payload, preferences: prefs }),
    });
    if (res.ok) {
      setSaved(true);
      if (onboarding) window.location.href = "/discover";
    }
  };

  if (!profile || !prefs) {
    return <p className="text-ns-muted">Loading profile…</p>;
  }

  return (
    <form onSubmit={onSave} className="mt-8 space-y-6">
      <FormField label="First name">
        <input
          className={inputClassName}
          value={profile.firstName}
          onChange={(ev) =>
            setProfile({ ...profile, firstName: ev.target.value })
          }
          required
        />
      </FormField>
      <FormField label="Age">
        <input
          type="number"
          min={18}
          className={inputClassName}
          value={profile.age}
          onChange={(ev) =>
            setProfile({ ...profile, age: Number(ev.target.value) })
          }
          required
        />
      </FormField>
      <FormField label="Neighborhood">
        <input
          className={inputClassName}
          value={profile.neighborhood}
          onChange={(ev) =>
            setProfile({ ...profile, neighborhood: ev.target.value })
          }
        />
      </FormField>
      <FormField label="School line (optional)">
        <input
          className={inputClassName}
          value={profile.schoolLine ?? ""}
          onChange={(ev) =>
            setProfile({ ...profile, schoolLine: ev.target.value })
          }
        />
      </FormField>
      <FormField label="Bio">
        <textarea
          className={inputClassName}
          rows={4}
          value={profile.bio}
          onChange={(ev) => setProfile({ ...profile, bio: ev.target.value })}
          required
        />
      </FormField>
      <div>
        <p className="text-xs uppercase tracking-widest text-ns-muted">
          Photos (placeholder URLs)
        </p>
        <div className="mt-3 space-y-2">
          {profile.photos.slice(0, 5).map((photo, index) => (
            <input
              key={photo.id}
              className={inputClassName}
              placeholder={`Photo slot ${index + 1}`}
              value={photo.url}
              onChange={(ev) => {
                const photos = [...profile.photos];
                photos[index] = { ...photos[index], url: ev.target.value };
                setProfile({ ...profile, photos });
              }}
            />
          ))}
        </div>
      </div>
      {profile.prompts.map((prompt, i) => (
        <FormField key={prompt.id} label={prompt.question}>
          <textarea
            name={`prompt-${i}`}
            className={inputClassName}
            rows={2}
            defaultValue={prompt.answer}
          />
        </FormField>
      ))}
      <FormField label="Interests (comma-separated)" name="interests">
        <input
          className={inputClassName}
          defaultValue={profile.interests.join(", ")}
        />
      </FormField>
      <fieldset className="rounded border border-ns-border p-4">
        <legend className="px-2 text-xs uppercase tracking-widest text-ns-gold">
          Preferences
        </legend>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <FormField label="Age min">
            <input
              type="number"
              className={inputClassName}
              value={prefs.ageMin}
              onChange={(ev) =>
                setPrefs({ ...prefs, ageMin: Number(ev.target.value) })
              }
            />
          </FormField>
          <FormField label="Age max">
            <input
              type="number"
              className={inputClassName}
              value={prefs.ageMax}
              onChange={(ev) =>
                setPrefs({ ...prefs, ageMax: Number(ev.target.value) })
              }
            />
          </FormField>
        </div>
        <p className="mt-4 text-xs text-ns-muted">Open to</p>
        <div className="mt-2 flex flex-wrap gap-3">
          {(["woman", "man", "non_binary"] as GenderIdentity[]).map((g) => (
            <label key={g} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={prefs.genders.includes(g)}
                onChange={(ev) => {
                  const genders = ev.target.checked
                    ? [...prefs.genders, g]
                    : prefs.genders.filter((x) => x !== g);
                  setPrefs({ ...prefs, genders });
                }}
              />
              {g}
            </label>
          ))}
        </div>
      </fieldset>
      <button
        type="submit"
        className="rounded-full bg-ns-gold px-10 py-3 text-sm uppercase tracking-widest text-ns-bg"
      >
        {onboarding ? "Finish onboarding" : "Save profile"}
      </button>
      {saved && !onboarding && (
        <p className="text-sm text-ns-gold">Saved.</p>
      )}
    </form>
  );
}