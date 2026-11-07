/**
 * Netlify build plugin: proxy /clinicianportal to the private clinician app.
 *
 * Runs during the normal Netlify build (the site build command stays `true`).
 * When CLINICIAN_PORTAL_ORIGIN is unset, this plugin adds nothing and the
 * existing `/*` → /404.html rule still applies.
 *
 * Set that variable in the Netlify UI before the door will proxy:
 *   - Key: CLINICIAN_PORTAL_ORIGIN
 *   - Value: the private app's https origin only (no path, no userinfo)
 *   - Scope: Builds
 *   - Contexts: Production, plus Deploy Previews if a preview should open the door
 *   - Mark it secret so the host is masked in build logs
 * Then start a new deploy. This plugin reads the value at build time and does
 * not print it.
 *
 * The private app must serve itself under the /clinicianportal base path and
 * should link and redirect with path-absolute URLs (/clinicianportal/...).
 * Netlify's proxy does not rewrite Location headers. Do not enable Netlify
 * site-wide password protection for this; the private app's own login is the
 * gate. A proxy to a Netlify site on a different team is rejected by Netlify;
 * a same-team site must be addressed by its *.netlify.app hostname.
 */

import { installClinicianPortalProxy } from "./proxy-rules.js";

export const onPreBuild = function onPreBuild({ netlifyConfig, utils }) {
  if (!Array.isArray(netlifyConfig.redirects)) netlifyConfig.redirects = [];

  const result = installClinicianPortalProxy(
    netlifyConfig.redirects,
    process.env.CLINICIAN_PORTAL_ORIGIN,
  );

  if (!result.ok) {
    const message = result.error;
    if (typeof utils?.build?.failBuild === "function") {
      utils.build.failBuild(message);
      return;
    }
    throw new Error(message);
  }

  if (result.reason === "unset") {
    console.log(
      "Clinician portal: CLINICIAN_PORTAL_ORIGIN is not set. " +
        "/clinicianportal is not proxied and will 404 until that Netlify build " +
        "variable is set and the site is redeployed.",
    );
    return;
  }

  if (result.reason === "already") {
    console.log("Clinician portal: /clinicianportal proxy rules are already present.");
    return;
  }

  console.log(
    "Clinician portal: installed a status-200 proxy for /clinicianportal ahead of the catch-all.",
  );
};
