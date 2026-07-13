"use client";

import { useMemo, useState } from "react";
import styles from "./page.module.css";

const videoTypes = [
  "Business Promo",
  "Restaurant/Food Promo",
  "Real Estate Promo",
  "Beauty Brand Promo",
  "Wellness Promo",
  "Digital Product Ad",
  "Grand Opening Announcement",
  "Customer Testimonial Style",
  "TikTok/Reels Hook Video"
];

const styleOptions = [
  "Professional",
  "Luxury",
  "Funny & Sassy",
  "Bold 3D Commercial",
  "Warm & Friendly",
  "Cinematic",
  "Colorful Social Media",
  "Clean Modern"
];

function buildScript({ businessName, offer, audience, videoType, vibe, cta }: Record<string, string>) {
  const name = businessName || "your business";
  const mainOffer = offer || "your services";
  const target = audience || "customers who need what you offer";
  const call = cta || "Visit our website today";

  const hook = vibe.includes("Funny")
    ? `Hold up — ${name} is not playing with this one.`
    : `Looking for ${mainOffer}? ${name} is here to help.`;

  return [
    {
      label: "0–3 seconds — Hook",
      text: hook
    },
    {
      label: "3–8 seconds — Problem / Need",
      text: `${target} need something clear, professional, and easy to trust.`
    },
    {
      label: "8–13 seconds — Offer",
      text: `${name} offers ${mainOffer} with a look and feel that helps people take action.`
    },
    {
      label: "13–15 seconds — Call to action",
      text: `${call}.`
    }
  ];
}

export default function VideoStudioPage() {
  const [businessName, setBusinessName] = useState("");
  const [offer, setOffer] = useState("");
  const [audience, setAudience] = useState("");
  const [videoType, setVideoType] = useState(videoTypes[0]);
  const [vibe, setVibe] = useState(styleOptions[0]);
  const [cta, setCta] = useState("Visit our website today");
  const [generated, setGenerated] = useState(false);

  const script = useMemo(
    () => buildScript({ businessName, offer, audience, videoType, vibe, cta }),
    [businessName, offer, audience, videoType, vibe, cta]
  );

  const prompt = useMemo(() => {
    const name = businessName || "the business";
    const mainOffer = offer || "the offer";
    return `Create a 15-second vertical 9:16 ${videoType.toLowerCase()} for ${name}. Style: ${vibe}. Show polished 3D-inspired visuals, clean motion graphics, bold text overlays, smooth camera movement, and a professional social-media ad look. Feature: ${mainOffer}. Audience: ${audience || "local customers and online buyers"}. End with this call to action: ${cta || "Visit our website today"}. No copyrighted logos or celebrity likenesses.`;
  }, [businessName, offer, audience, videoType, vibe, cta]);

  const captions = script.map((s) => s.text).join("\n");

  function copyText(text: string) {
    navigator.clipboard?.writeText(text);
    alert("Copied!");
  }

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div>
          <p className={styles.eyebrow}>Cookie AI Video Studio</p>
          <h1>Create a quick promo video script and AI video prompt.</h1>
          <p>
            This is the safe starter version for your website builder. It creates video scripts,
            captions, shot ideas, and prompts now. Later, a paid AI video API can be connected for real video generation.
          </p>
        </div>
        <div className={styles.orb}>🎬</div>
      </section>

      <section className={styles.grid}>
        <div className={`${styles.card} ${styles.form}`}>
          <h2>Video Details</h2>
          <label>
            Business name
            <input value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="Example: Da' Tadda Stop" />
          </label>
          <label>
            What are they promoting?
            <textarea value={offer} onChange={(e) => setOffer(e.target.value)} placeholder="Example: cold seafood trays, desserts, beauty services, real estate help..." />
          </label>
          <label>
            Target customer
            <input value={audience} onChange={(e) => setAudience(e.target.value)} placeholder="Example: busy families, local customers, new homeowners..." />
          </label>
          <label>
            Video type
            <select value={videoType} onChange={(e) => setVideoType(e.target.value)}>
              {videoTypes.map((type) => <option key={type}>{type}</option>)}
            </select>
          </label>
          <label>
            Style
            <select value={vibe} onChange={(e) => setVibe(e.target.value)}>
              {styleOptions.map((style) => <option key={style}>{style}</option>)}
            </select>
          </label>
          <label>
            Call to action
            <input value={cta} onChange={(e) => setCta(e.target.value)} placeholder="Example: Order today / Book now / Visit our website" />
          </label>
          <button className={styles.primary} onClick={() => setGenerated(true)}>Generate Video Kit</button>
        </div>

        <div className={styles.card}>
          <h2>Generated Video Kit</h2>
          {!generated ? (
            <div className={styles.empty}>
              <div>✨</div>
              <p>Fill in the video details and click generate.</p>
            </div>
          ) : (
            <>
              <h3>15-Second Script</h3>
              <div className={styles.script}>
                {script.map((line) => (
                  <article key={line.label}>
                    <strong>{line.label}</strong>
                    <p>{line.text}</p>
                  </article>
                ))}
              </div>
              <button className={styles.secondary} onClick={() => copyText(script.map(s => `${s.label}: ${s.text}`).join("\n"))}>Copy Script</button>

              <h3>Caption Text</h3>
              <pre className={styles.pre}>{captions}</pre>
              <button className={styles.secondary} onClick={() => copyText(captions)}>Copy Captions</button>

              <h3>AI Video Prompt</h3>
              <pre className={styles.pre}>{prompt}</pre>
              <button className={styles.secondary} onClick={() => copyText(prompt)}>Copy Video Prompt</button>
            </>
          )}
        </div>
      </section>

      <section className={styles.note}>
        <h2>Real video generation can be connected later.</h2>
        <p>
          This demo mode protects your budget while the website builder is being finished. When you are ready,
          this studio can connect to a paid AI video provider and use monthly video credits by plan.
        </p>
      </section>
    </main>
  );
}
