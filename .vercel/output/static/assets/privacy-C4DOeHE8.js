import{C as e}from"./minutes-DQpXyG4q.js";import{t}from"./site-shell-Cr1ltZOn.js";var n=`# Privacy Notice — Theosis Medical LLC
**Effective date:** October 23, 2026

Theosis Medical LLC ("we," "us") runs theosismedical.com from Danville, Illinois. This notice covers **this website only**.

**Clinical care is not covered here.** Medical records from care Nick Holwey, PA-C provides are kept by the hospitals, clinics, and organizations where that care happens. Each one handles them under its own HIPAA Notice of Privacy Practices.

## What we collect and why
- **Contact forms.** When you send a form, we receive your name, email, and message, and use them only to reply. Forms are delivered through a third-party form service, FormSubmit (formsubmit.co), to our email inbox. A short copy of the message also goes to our phone as a text alert through a mobile carrier's email-to-text service. These services aren't designed for health information. **Please don't include medical information about yourself or anyone else.** The forms show the same reminder. The site isn't monitored for emergencies. In an emergency, call 911.
- **Email.** If you email us, the message is stored by our email provider, Microsoft 365, which we use through GoDaddy.
- **Traffic stats.** Netlify, our web host, gives us **aggregate, cookieless** site statistics, such as page views, visitor counts, top pages, and referring sites. They're built from its server logs. We use them only to understand overall site use. They don't identify you, and we don't build individual profiles.
- **Hosting logs.** Like any web server, Netlify automatically records basic technical data, such as IP address, browser type, and pages requested, to deliver and secure the site. Netlify keeps these logs under its own retention practices.
- **Fonts.** The site loads fonts from Google Fonts, so your browser sends your IP address to Google to download them. Google handles that data under its own privacy policy.
- **Video thumbnails.** Some articles show a YouTube video preview image, so your browser contacts YouTube (Google) to load it. If you play a video, YouTube's own privacy policy applies.

## Copy saved in your browser
When you fill out a form, your browser saves a copy of what you typed, such as your name, email, and message, in its own local storage on your device. That way you don't lose it. This copy stays on your device and isn't sent to us. To remove it, clear this site's data in your browser settings, for example: Settings, then Privacy, then Site data, then theosismedical.com, then Clear. Using a private or incognito window also works.

## Cookies, logins, ads
The site has no user accounts or logins. We use **no cookies, advertising, tracking pixels, session replay, or third-party trackers**.

## Sharing
We don't sell personal information or share it for advertising. The service providers named above (FormSubmit, the mobile carrier's text service, Microsoft 365/GoDaddy, Netlify, Google Fonts, and YouTube) handle it only as needed to provide their services. We don't otherwise disclose it unless the law requires us to.

## How long we keep it
- Contact-form messages: up to **2 years**, then deleted.
- Emails: up to **3 years**, then deleted.
- Text alerts are deleted from the phone on the same schedule.
- Host logs and analytics: kept under Netlify's retention practices.

## Your choices
You can ask to see or delete the messages we have from you by emailing nick@theosismedical.com. We'll respond within 45 days. We protect what we receive with reasonable safeguards, including encrypted connections (HTTPS), but no internet transmission is completely secure.

## Children
This site isn't directed to children under 13, and we don't knowingly collect their information.

## Changes
When we update this notice, we'll post the new version here and change the effective date.

## Contact
Theosis Medical LLC · Danville, Illinois · nick@theosismedical.com
`,r=e();function i(e){return e.split(/(\*\*[^*]+\*\*)/).map((e,t)=>e.startsWith(`**`)&&e.endsWith(`**`)?(0,r.jsx)(`strong`,{className:`font-semibold text-fg`,children:e.slice(2,-2)},t):(0,r.jsx)(`span`,{children:e},t))}function a(e){let t=[],n=[],a=()=>{if(n.length){let e=n;t.push((0,r.jsx)(`ul`,{className:`mt-4 list-disc space-y-3 pl-6`,children:e.map((e,t)=>(0,r.jsx)(`li`,{children:i(e)},t))},`ul${t.length}`)),n=[]}};for(let o of e.split(`
`)){let e=o.trimEnd();if(e.startsWith(`- `)){n.push(e.slice(2));continue}a(),e&&(e.startsWith(`## `)?t.push((0,r.jsx)(`h2`,{className:`mt-10 font-display text-2xl font-semibold tracking-wide text-fg`,children:e.slice(3)},t.length)):e.startsWith(`# `)?t.push((0,r.jsx)(`h1`,{className:`font-display text-4xl font-semibold tracking-wide text-fg sm:text-5xl`,children:e.slice(2)},t.length)):t.push((0,r.jsx)(`p`,{className:`mt-4`,children:i(e)},t.length)))}return a(),t}function o(){return(0,r.jsx)(t,{children:(0,r.jsx)(`article`,{className:`mx-auto max-w-3xl px-5 py-16 text-lg leading-relaxed text-muted sm:px-8 lg:py-24`,children:a(n)})})}export{o as component};