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

const pages = ["Script", "Captions", "Shot List", "Storyboard", "Video Prompt", "Voiceover", "Next Steps"] as const;
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

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
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

  const storyboard = [
    { time: "Scene 1", title: "Hook", visual: `3D title card, floating shapes, and bold text: ${name}.`, overlay: hooks[versionIndex] },
    { time: "Scene 2", title: "Need", visual: `Show ${audience} looking for a clear solution.`, overlay: `Made for ${audience}` },
    { time: "Scene 3", title: "Offer", visual: `Feature ${offer} with close-ups, motion cards, and benefit labels.`, overlay: `Now offering: ${offer}` },
    { time: "Scene 4", title: "Trust", visual: "Add icons for fast service, quality, convenience, reviews, or local support.", overlay: "Clear. Helpful. Easy to trust." },
    { time: "Scene 5", title: "Call to Action", visual: `End card with website/contact information and ${name} branding.`, overlay: cta }
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

  return { title, script, shotList, storyboard, captions, prompt, voiceover, site };
}

export default function VideoStudioPage() {
  const [form, setForm] = useState<FormState>(starterForm);
  const [generated, setGenerated] = useState(false);
  const [version, setVersion] = useState(0);
  const [activePage, setActivePage] = useState<OutputPage>("Script");
  const [downloadMessage, setDownloadMessage] = useState("");

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
      "STORYBOARD",
      kit.storyboard.map((scene, index) => `${index + 1}. ${scene.title} — ${scene.visual} Overlay: ${scene.overlay}`).join("\n"),
      "",
      "VOICEOVER",
      kit.voiceover,
      "",
      "AI VIDEO PROMPT",
      kit.prompt,
      "",
      `Suggested website link: ${kit.site}`,
      "",
      "NOTE",
      "This is a creative video kit. It does not create an MP4 video until a paid AI video API is connected."
    ].join("\n");
  }

  function kitHtml() {
    const scenes = kit.storyboard.map((scene, index) => `
      <article class="scene">
        <span>Scene ${index + 1}</span>
        <h3>${escapeHtml(scene.title)}</h3>
        <p><strong>Visual:</strong> ${escapeHtml(scene.visual)}</p>
        <p><strong>Text overlay:</strong> ${escapeHtml(scene.overlay)}</p>
      </article>
    `).join("");

    const script = kit.script.map((line) => `<li><strong>${escapeHtml(line.label)}:</strong> ${escapeHtml(line.text)}</li>`).join("");
    const shots = kit.shotList.map((line) => `<li>${escapeHtml(line)}</li>`).join("");
    const captions = escapeHtml(kit.captions).replace(/\n/g, "<br />");

    return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(kit.title)}</title>
  <style>
    body{margin:0;font-family:Arial,sans-serif;background:#160d23;color:#1b1028;}
    .wrap{max-width:980px;margin:0 auto;padding:34px;}
    .hero{background:linear-gradient(135deg,#ffca77,#ff6ea8,#7247ff);color:#fff;border-radius:32px;padding:34px;box-shadow:0 24px 60px rgba(0,0,0,.3)}
    .hero h1{font-size:42px;line-height:.98;margin:12px 0}.tag{letter-spacing:.14em;text-transform:uppercase;font-weight:900;color:#fff4d8}
    section{background:#fff;border-radius:24px;padding:24px;margin:20px 0;box-shadow:0 18px 50px rgba(0,0,0,.22)}
    h2{margin-top:0;font-size:28px}.scene{border:1px solid #eadcf7;border-radius:20px;padding:18px;margin:12px 0;background:linear-gradient(135deg,#fff8eb,#f4edff)}
    .scene span{font-size:12px;letter-spacing:.12em;text-transform:uppercase;font-weight:900;color:#c46a2d}.box{white-space:pre-wrap;background:#110b1d;color:#fff7e8;border-radius:18px;padding:18px;line-height:1.55}
    li{margin:10px 0}.note{border:2px dashed #c46a2d;background:#fff7ec}.footer{color:#fff;opacity:.8;text-align:center;padding:16px}
  </style>
</head>
<body>
  <main class="wrap">
    <div class="hero">
      <p class="tag">Cookie AI Video Studio</p>
      <h1>${escapeHtml(kit.title)}</h1>
      <p>Platform: ${escapeHtml(form.platform)} • Length: ${escapeHtml(form.length)} • Style: ${escapeHtml(form.vibe)} • Voice: ${escapeHtml(form.voice)}</p>
    </div>
    <section><h2>Script</h2><ul>${script}</ul></section>
    <section><h2>Storyboard</h2>${scenes}</section>
    <section><h2>Shot List</h2><ol>${shots}</ol></section>
    <section><h2>Captions</h2><div class="box">${captions}</div></section>
    <section><h2>Voiceover</h2><div class="box">${escapeHtml(kit.voiceover)}</div></section>
    <section><h2>AI Video Prompt</h2><div class="box">${escapeHtml(kit.prompt)}</div></section>
    <section class="note"><h2>Next step</h2><p>This download is the creative kit. To generate a real MP4 video, Cookie Digital Creations must connect a paid AI video API such as Runway, Luma, Replicate, or HeyGen.</p><p>Suggested website link: ${escapeHtml(kit.site)}</p></section>
    <p class="footer">Generated by Cookie Mini Website Builder Pro</p>
  </main>
</body>
</html>`;
  }

  function downloadFile(contents: string, filename: string, type: string) {
    const blob = new Blob([contents], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    setDownloadMessage(`Downloaded ${filename}. Open it from your browser Downloads folder.`);
  }

  function downloadTextKit() {
    downloadFile(allKitText(), `${slug(form.businessName || "cookie-video-kit")}.txt`, "text/plain");
  }

  function downloadKit() {
    downloadFile(kitHtml(), `${slug(form.businessName || "cookie-video-kit")}-full-video-kit.html`, "text/html");
  }

  function openPrintableKit() {
    const win = window.open("", "_blank");
    if (!win) {
      alert("Please allow pop-ups to open the printable kit.");
      return;
    }
    win.document.open();
    win.document.write(kitHtml());
    win.document.close();
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
            {generated && <button className={css.secondary} onClick={downloadKit}>Download Full Kit</button>}
          </div>

          {!generated ? (
            <div className={css.empty}>
              <div>✨</div>
              <p>Fill in the video details, choose your options, then click Generate Video Kit.</p>
            </div>
          ) : (
            <>
              {downloadMessage && <p className={css.notice}>{downloadMessage}</p>}
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

              {activePage === "Storyboard" && (
                <div className={css.sectionBlock}>
                  <h3>Storyboard Cards</h3>
                  <div className={css.storyboardGrid}>
                    {kit.storyboard.map((scene, index) => (
                      <article className={css.storyCard} key={scene.title}>
                        <span>Scene {index + 1}</span>
                        <h4>{scene.title}</h4>
                        <p><strong>Visual:</strong> {scene.visual}</p>
                        <p><strong>Overlay:</strong> {scene.overlay}</p>
                      </article>
                    ))}
                  </div>
                  <button className={css.secondary} onClick={() => copyText(kit.storyboard.map((scene, index) => `${index + 1}. ${scene.title}: ${scene.visual} Overlay: ${scene.overlay}`).join("\n"))}>Copy Storyboard</button>
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
                    <button onClick={downloadKit}>Download Full HTML Kit</button>
                    <button onClick={downloadTextKit}>Download Text Kit</button>
                    <button onClick={openPrintableKit}>Open Printable Kit</button>
                    <a href="/builder">Back to Website Builder</a>
                    <a href="/customer">Open Customer Dashboard</a>
                  </div>
                  <div className={css.lockedVideoBox}>
                    <strong>Real AI video generation coming later</strong>
                    <p>
                      This page now downloads a full creative video kit, not an MP4 video. Real video generation can be connected later through Runway, Luma, Replicate, or HeyGen with monthly Cookie Credits by plan.
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
