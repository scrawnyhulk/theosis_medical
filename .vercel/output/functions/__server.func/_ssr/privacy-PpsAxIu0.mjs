import { i as require_jsx_runtime } from "../_libs/@radix-ui/react-label+[...].mjs";
import { n as SiteShell } from "./site-shell-BhbP4dfN.mjs";
//#region ../wt-lbfix/node_modules/.nitro/vite/services/ssr/assets/privacy-PpsAxIu0.js
var import_jsx_runtime = require_jsx_runtime();
var privacy_default = "# Privacy Notice — Theosis Medical LLC\n**Effective date:** October 23, 2026\n\nTheosis Medical LLC (\"we,\" \"us\") runs theosismedical.com from Danville, Illinois. This notice covers **this website only**.\n\n**Clinical care is not covered here.** Medical records from care Nick Holwey, PA-C provides are kept by the hospitals, clinics, and organizations where that care happens. Each one handles them under its own HIPAA Notice of Privacy Practices.\n\n## What we collect and why\n- **Contact forms.** When you send a form, we receive your name, email, and message, and use them only to reply. Forms are delivered through a third-party form service, FormSubmit (formsubmit.co), to our email inbox. A short copy of the message also goes to our phone as a text alert through a mobile carrier's email-to-text service. These services aren't designed for health information. **Please don't include medical information about yourself or anyone else.** The forms show the same reminder. The site isn't monitored for emergencies. In an emergency, call 911.\n- **Email.** If you email us, the message is stored by our email provider, Microsoft 365, which we use through GoDaddy.\n- **Traffic stats.** Netlify, our web host, gives us **aggregate, cookieless** site statistics, such as page views, visitor counts, top pages, and referring sites. They're built from its server logs. We use them only to understand overall site use. They don't identify you, and we don't build individual profiles.\n- **Hosting logs.** Like any web server, Netlify automatically records basic technical data, such as IP address, browser type, and pages requested, to deliver and secure the site. Netlify keeps these logs under its own retention practices.\n- **Fonts.** The site loads fonts from Google Fonts, so your browser sends your IP address to Google to download them. Google handles that data under its own privacy policy.\n- **Video thumbnails.** Some articles show a YouTube video preview image, so your browser contacts YouTube (Google) to load it. If you play a video, YouTube's own privacy policy applies.\n\n## Copy saved in your browser\nWhen you fill out a form, your browser saves a copy of what you typed, such as your name, email, and message, in its own local storage on your device. That way you don't lose it. This copy stays on your device and isn't sent to us. To remove it, clear this site's data in your browser settings, for example: Settings, then Privacy, then Site data, then theosismedical.com, then Clear. Using a private or incognito window also works.\n\n## Cookies, logins, ads\nThe site has no user accounts or logins. We use **no cookies, advertising, tracking pixels, session replay, or third-party trackers**.\n\n## Sharing\nWe don't sell personal information or share it for advertising. The service providers named above (FormSubmit, the mobile carrier's text service, Microsoft 365/GoDaddy, Netlify, Google Fonts, and YouTube) handle it only as needed to provide their services. We don't otherwise disclose it unless the law requires us to.\n\n## How long we keep it\n- Contact-form messages: up to **2 years**, then deleted.\n- Emails: up to **3 years**, then deleted.\n- Text alerts are deleted from the phone on the same schedule.\n- Host logs and analytics: kept under Netlify's retention practices.\n\n## Your choices\nYou can ask to see or delete the messages we have from you by emailing nick@theosismedical.com. We'll respond within 45 days. We protect what we receive with reasonable safeguards, including encrypted connections (HTTPS), but no internet transmission is completely secure.\n\n## Children\nThis site isn't directed to children under 13, and we don't knowingly collect their information.\n\n## Changes\nWhen we update this notice, we'll post the new version here and change the effective date.\n\n## Contact\nTheosis Medical LLC · Danville, Illinois · nick@theosismedical.com\n";
/** Renders the small markdown subset used by the legal text: # / ## headings, - bullets, **bold**. */
function inline(text) {
	return text.split(/(\*\*[^*]+\*\*)/).map((part, i) => part.startsWith("**") && part.endsWith("**") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
		className: "font-semibold text-fg",
		children: part.slice(2, -2)
	}, i) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: part }, i));
}
function renderMarkdown(md) {
	const out = [];
	let list = [];
	const flush = () => {
		if (list.length) {
			const items = list;
			out.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-4 list-disc space-y-3 pl-6",
				children: items.map((li, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: inline(li) }, i))
			}, `ul${out.length}`));
			list = [];
		}
	};
	for (const raw of md.split("\n")) {
		const line = raw.trimEnd();
		if (line.startsWith("- ")) {
			list.push(line.slice(2));
			continue;
		}
		flush();
		if (!line) continue;
		if (line.startsWith("## ")) out.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "mt-10 font-display text-2xl font-semibold tracking-wide text-fg",
			children: line.slice(3)
		}, out.length));
		else if (line.startsWith("# ")) out.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-4xl font-semibold tracking-wide text-fg sm:text-5xl",
			children: line.slice(2)
		}, out.length));
		else out.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-4",
			children: inline(line)
		}, out.length));
	}
	flush();
	return out;
}
function PrivacyPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("article", {
		className: "mx-auto max-w-3xl px-5 py-16 text-lg leading-relaxed text-muted sm:px-8 lg:py-24",
		children: renderMarkdown(privacy_default)
	}) });
}
//#endregion
export { PrivacyPage as component };
