import { useState } from "react";
import type { Dict } from "@/i18n";

export function WaitlistForm({ t }: { t: Dict }) {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  return (
    <form
      className="mt-4"
      onSubmit={(e) => {
        e.preventDefault();
        console.log("waitlist signup", email);
        setDone(true);
      }}
    >
      <label htmlFor="waitlist-email" className="field-label">
        {t.pricing.emailLabel}
      </label>
      <div className="flex gap-2">
        <input
          id="waitlist-email"
          type="email"
          required
          className="field-input rounded-full px-5"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="name@example.com"
        />
        <button
          type="submit"
          className="pill-primary shrink-0"
        >
          {t.pricing.joinWaitlist}
        </button>
      </div>
      {done && <p className="mt-2 text-sm text-foreground">{t.pricing.thanks}</p>}
    </form>
  );
}
