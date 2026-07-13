"use client";

import { useMemo, useState } from "react";
import css from "./page.module.css";

const videoTypes = [
  "Business Promo",
  "Restaurant / Food Promo",
  "Real Estate Promo",
  "Beauty Brand Promo",
  "Wellness Promo",
  "Digital Product Ad",
  "Grand Opening Announcement",
  "Customer Testimonial Style",
  "TikTok / Reels Hook Video"
];

const vibeOptions = [
  "Professional",
  "Luxury",
  "Funny & Sassy",
  "Bold 3D Commercial",
  "Warm & Friendly",
  "Cinematic",
  "Colorful Social Media",
  "Clean Modern"
];

const platformOptions = ["TikTok / Reels", "YouTube Short", "Facebook Ad", "Website Hero Video", "Instagram Story"];
const lengthOptions = ["15 seconds", "30 seconds", "45 seconds"];
const musicOptions = ["Upbeat pop", "Luxury lounge", "Hip-hop bounce", "Clean corporate", "Island / tropical", "Emotional cinematic"];
const voiceOptions = ["Warm female voice", "Bold sassy female voice", "Professional narrator", "High-energy creator", "Calm luxury voice"];

const pages = ["Script", "Captions", "Shot List", "Video Prompt", "Voiceover", "Next Steps"] as const;
type OutputPage = (typeof pages)[number];

type FormState = {
  businessName: string;
  offer: string;
  audience: string;
  videoType: string;
  vibe: string;
  platform: string;
  length: string;
  music: string;
  voice: string;
  cta: string;
};

const starterForm: FormState = {
  businessName: "",
  offer: "",
  audience: "",
  videoType: videoTypes[0],
  vibe: vibeOptions[0],
  platform: platformOptions[0],
  length: lengthOptions[0],
  music: musicOptions[0],
  voice: voiceOptions[0],
  cta: "Visit our website today"
};

function slug(text: string) {
  return text.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "my-business";
}

function buildKit(form: FormState, version: number) {
  const name = form.businessName.trim() || "your business";
  const offer = form.offer.trim() || "your services";
  const audience = form.audience.trim() || "customers who need what you offer";
  const cta = form.cta.trim() || "Visit our website today";
  const tone = form.vibe;
  const versionIndex = version % 3;

  const hooks = tone.includes("Funny")
    ? [
        `Hold up — ${name} is not playing with this one.`,
        `Baby, if you need ${offer}, ${name} just made it easy.`,
        `Stop scrolling — ${name} has something your timeline needs.`
      ]
    : tone.includes("Luxury")
    ? [
        `${name} brings a polished experience made to stand out.`,
        `A cleaner, sharper way to present ${offer}.`,
        `Elevate the way customers see ${name}.`
      ]
    : [
        `Looking for ${offer}? ${name} is here to help.`,
        `${name} makes it easier to find ${offer} you can trust.`,
        `Here is why local customers are choosing ${name}.`
      ];

  const script = [
    { label: "0–3 seconds — Hook", text: hooks[versionIndex] },
    { label: "3–8 seconds — Problem / Need", text: `${audience} need something clear, helpful, and easy to trust.` },
    { label: "8–13 seconds — Offer", text: `${name} offers ${offer} with a style that helps people take action.` },
    { label: "13–15 seconds — Call to action", text: `${cta}.` }
  ];

  if (form.length !== "15 seconds") {
    script.splice(3, 0, {
      label: "Extra scene — Trust builder",
      text: `Show reviews, finished work, product details, or a quick before-and-after moment so viewers understand why ${name} is the right choice.`
    });
  }

  const shotList = [
    `Opening visual: bold 3D title card with ${name}.`,
    `Show the main offer: ${offer}.`,
    `Add quick text overlays for the biggest benefit and who it helps.`,
    `Use motion graphics, product/service close-ups, and clean transitions.`,
    `End screen: ${cta} with website/contact callout.`
  ];

  const captions = [
    `${name} is ready to help.`,
    `Need ${offer}? This is your sign.`,
    `Made for ${audience}.`,
    `${cta}.`
  ].join("\n");

  const prompt = `Create a ${form.length} vertical 9:16 ${form.videoType.toLowerCase()} for ${name}. Platform: ${form.platform}. Style: ${form.vibe}. Music feel: ${form.music}. Voiceover style: ${form.voice}. Show polished 3D-inspired visuals, realistic depth, floating cards, bold text overlays, smooth camera movement, clean lighting, and a professional social-media ad look. Feature: ${offer}. Audience: ${audience}. End with this call to action: ${cta}. Avoid copyrighted logos, celebrity likenesses, or protected brand assets.`;

  const voiceover = script.map((line) => line.text).join(" ");
  const title = `${name} ${form.videoType} Kit`;
  const site = `https://${slug(name)}.cookiesdigitalcreations.com`;

  return { title, script, shotList, captions, prompt, voiceover, site };
}

export default function VideoStudioPage() {
  const [form, setForm] = useState<FormState>(starterForm);
  const [generated, setGenerated] = useState(false);
  const [version, setVersion] = useState(0);
  const [activePage, setActivePage] = useState<OutputPage>("Script");

  const kit = useMemo(() => buildKit(form, version), [form, version]);

  function updateField(field: keyof FormState, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function generateKit() {
    setGenerated(true);
    setActivePage("Script");
  }

  function copyText(text: string) {
    navigator.clipboard?.writeText(text);
    alert("Copied!");
  }

  function allKitText() {
    return [
      kit.title,
      "",
      "SCRIPT",
      kit.script.map((line) => `${line.label}: ${line.text}`).join("\n"),
      "",
      "CAPTIONS",
      kit.captions,
      "",
      "SHOT LIST",
      kit.shotList.map((line, index) => `${index + 1}. ${line}`).join("\n"),
      "",
      "VOICEOVER",
      kit.voiceover,
      "",
      "AI VIDEO PROMPT",
      kit.prompt,
      "",
      `Suggested website link: ${kit.site}`
    ].join("\n");
  }

  function downloadKit() {
    const blob = new Blob([allKitText()], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${slug(form.businessName || "cookie-video-kit")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className={css.page}>
      <section className={css.hero}>
        <div>
          <p className={css.eyebrow}>Cookie AI Video Studio</p>
          <h1>Create a full promo video kit.</h1>
          <p>
            Build scripts, captions, voiceover text, shot lists, and AI video prompts. This starter version protects your budget while the real paid video API is added later.
          </p>
        </div>
        <div className={css.orb}>🎬</div>
      </section>

      <section className={css.workspace}>
        <aside className={`${css.card} ${css.formCard}`}>
          <h2>Video Details</h2>
          <label>
            Business name
            <input value={form.businessName} onChange={(e) => updateField("businessName", e.target.value)} placeholder="Example: Da' Tadda Stop" />
          </label>
          <label>
            What are they promoting?
            <textarea value={form.offer} onChange={(e) => updateField("offer", e.target.value)} placeholder="Example: cold seafood trays, desserts, beauty services, real estate help..." />
          </label>
          <label>
            Target customer
            <input value={form.audience} onChange={(e) => updateField("audience", e.target.value)} placeholder="Example: busy families, local customers, new homeowners..." />
          </label>
          <div className={css.twoCol}>
            <label>
              Video type
              <select value={form.videoType} onChange={(e) => updateField("videoType", e.target.value)}>
                {videoTypes.map((type) => <option key={type}>{type}</option>)}
              </select>
            </label>
            <label>
              Platform
              <select value={form.platform} onChange={(e) => updateField("platform", e.target.value)}>
                {platformOptions.map((platform) => <option key={platform}>{platform}</option>)}
              </select>
            </label>
          </div>
          <div className={css.twoCol}>
            <label>
              Style
              <select value={form.vibe} onChange={(e) => updateField("vibe", e.target.value)}>
                {vibeOptions.map((style) => <option key={style}>{style}</option>)}
              </select>
            </label>
            <label>
              Length
              <select value={form.length} onChange={(e) => updateField("length", e.target.value)}>
                {lengthOptions.map((length) => <option key={length}>{length}</option>)}
              </select>
            </label>
          </div>
          <div className={css.twoCol}>
            <label>
              Music feel
              <select value={form.music} onChange={(e) => updateField("music", e.target.value)}>
                {musicOptions.map((music) => <option key={music}>{music}</option>)}
              </select>
            </label>
            <label>
              Voice style
              <select value={form.voice} onChange={(e) => updateField("voice", e.target.value)}>
                {voiceOptions.map((voice) => <option key={voice}>{voice}</option>)}
              </select>
            </label>
          </div>
          <label>
            Call to action
            <input value={form.cta} onChange={(e) => updateField("cta", e.target.value)} placeholder="Example: Order today / Book now / Visit our website" />
          </label>
          <button className={css.primary} onClick={generateKit}>Generate Video Kit</button>

          {generated && (
            <div className={css.quickActions}>
              <button onClick={() => setVersion((current) => current + 1)}>Regenerate New Version</button>
              <button onClick={() => updateField("vibe", "Funny & Sassy")}>Make It Funnier</button>
              <button onClick={() => updateField("vibe", "Luxury")}>Make It Luxury</button>
              <button onClick={() => updateField("vibe", "Bold 3D Commercial")}>Make It 3D</button>
            </div>
          )}
        </aside>

        <section className={`${css.card} ${css.outputCard}`}>
          <div className={css.outputHeader}>
            <div>
              <p className={css.eyebrowDark}>Generated Video Kit</p>
              <h2>{generated ? kit.title : "Your kit will appear here"}</h2>
            </div>
            {generated && <button className={css.secondary} onClick={downloadKit}>Download Kit</button>}
          </div>

          {!generated ? (
            <div className={css.empty}>
              <div>✨</div>
              <p>Fill in the video details, choose your options, then click Generate Video Kit.</p>
            </div>
          ) : (
            <>
              <div className={css.tabs}>
                {pages.map((page) => (
                  <button key={page} className={activePage === page ? css.activeTab : ""} onClick={() => setActivePage(page)}>{page}</button>
                ))}
              </div>

              {activePage === "Script" && (
                <div className={css.sectionBlock}>
                  <h3>15-Second Script</h3>
                  <div className={css.script}>
                    {kit.script.map((line) => (
                      <article key={line.label}>
                        <strong>{line.label}</strong>
                        <p>{line.text}</p>
                      </article>
                    ))}
                  </div>
                  <button className={css.secondary} onClick={() => copyText(kit.script.map((line) => `${line.label}: ${line.text}`).join("\n"))}>Copy Script</button>
                </div>
              )}

              {activePage === "Captions" && (
                <div className={css.sectionBlock}>
                  <h3>Caption Text</h3>
                  <pre className={css.pre}>{kit.captions}</pre>
                  <button className={css.secondary} onClick={() => copyText(kit.captions)}>Copy Captions</button>
                </div>
              )}

              {activePage === "Shot List" && (
                <div className={css.sectionBlock}>
                  <h3>Shot List</h3>
                  <ol className={css.list}>{kit.shotList.map((shot) => <li key={shot}>{shot}</li>)}</ol>
                  <button className={css.secondary} onClick={() => copyText(kit.shotList.map((line, index) => `${index + 1}. ${line}`).join("\n"))}>Copy Shot List</button>
                </div>
              )}

              {activePage === "Video Prompt" && (
                <div className={css.sectionBlock}>
                  <h3>AI Video Prompt</h3>
                  <pre className={css.pre}>{kit.prompt}</pre>
                  <button className={css.secondary} onClick={() => copyText(kit.prompt)}>Copy Video Prompt</button>
                </div>
              )}

              {activePage === "Voiceover" && (
                <div className={css.sectionBlock}>
                  <h3>Voiceover Text</h3>
                  <pre className={css.pre}>{kit.voiceover}</pre>
                  <button className={css.secondary} onClick={() => copyText(kit.voiceover)}>Copy Voiceover</button>
                </div>
              )}

              {activePage === "Next Steps" && (
                <div className={css.nextSteps}>
                  <h3>Next Options</h3>
                  <p>Use these buttons after generating the kit.</p>
                  <div className={css.actionGrid}>
                    <button onClick={() => copyText(allKitText())}>Copy Full Kit</button>
                    <button onClick={downloadKit}>Download Text Kit</button>
                    <a href="/builder">Back to Website Builder</a>
                    <a href="/customer">Open Customer Dashboard</a>
                  </div>
                  <div className={css.lockedVideoBox}>
                    <strong>Real AI video generation coming later</strong>
                    <p>
                      This demo creates all the creative pieces first. When you connect Runway, Luma, Replicate, or HeyGen later, this page can turn into a real video generator with monthly video credits by plan.
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </section>
      </section>
    </main>
  );
}
