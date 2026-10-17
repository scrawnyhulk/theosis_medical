# Personal fat threshold: how type 2 diabetes develops (V31)

Theosis Medical · Health Hacks · Nick Holwey, PA-C

This is a rebuild of `personal-fat-threshold-v20-ct-fuel-fixed.html` as a
small static site. The concept, the three-panel workbench (CT view, figure
with slider, stage text with meters), the fuel reserve, the blood view and
the accessibility features all carry over from v20.

## Files

```
index.html                      page markup
assets/css/pft.css              v20 styles + Theosis/mobile/accessibility layer (at the end)
assets/js/pft-config.js         ← the only file you normally edit (3D models, original art)
assets/js/pft.js                model engine (v20 engine, twin-cycle order)
assets/js/pft-extras.js         guided story, mobile dock, remission note, waist-to-height calculator
assets/js/pft-arteries.js       V25–V28 "In the bloodstream" section (cut-open artery, glucose/fat/insulin levels, V28 plaque)
assets/js/pft-glucose.js        V27 estimated average glucose meter (analog dial + digital readout) in that section
assets/js/pft-figure.js         rendered-figure crossfade, per-profile masks, glycogen overlay, Become/Reverse
assets/js/anatomy-v23.js        3D anatomy runtime (V23); lazy-loaded only when 3D is tapped
assets/js/anatomy-v22.js        V22 3D runtime (kept, no longer loaded)
assets/js/anatomy-pft.js        V21 3D code (kept, no longer loaded)
assets/vendor/three-anatomy.min.js  three.js subset + GLTF/meshopt loader (lazy)
assets/img/figure/              V26 figure frames: {profile}-{fuel}-{720|1080}.webp (24 states)
                                + mask-body-*/mask-muscle-*/mask-liver.webp (overlay masks)
assets/img/                     logo, grain, older stand-in heart/fat-texture art
assets/models/pft-anatomy.glb   3D anatomy (lazy, fetched over http/https)
assets/models/pft-anatomy.glb.js  same model as base64 in a classic script (used from file://)
NOTICE.txt / CREDITS.md         asset sources and licences (own anatomy, MakeHuman CC0, three.js MIT)
assets/models/README.md         how to add the 3D models
tools/extract-models.mjs        pulls the models and art out of the original v20 file
netlify.toml                    static hosting headers (no build step)
```

## Deploying

The site has no build step. Upload this folder as-is to Netlify (drag and
drop), or embed it in a page:

```html
<iframe src="https://YOUR-SITE/" title="Personal fat threshold: how type 2 diabetes develops"
        style="width:100%;height:100dvh;min-height:720px;border:0" loading="lazy" allowfullscreen></iframe>
```

When it is served from theosismedical.com at `/minutes/create-diabetic/`,
`/minutes/how-type-2-diabetes-develops/` or
`/minutes/personal-fat-threshold/`, the same-origin frame sizing from v20
still applies.

## V31: own anatomy

All Z-Anatomy (CC BY-SA) geometry has been replaced. The skin is the MakeHuman CC0 base mesh
(reposed and given our own fat-distribution morphs); organs, ~45 named muscle groups, the skeleton and the
arterial tree are modelled procedurally by build scripts (`v31/` in the build sources). The 2D frames, masks,
blood-flow centrelines and the 3D model were all regenerated from it, and the 3D Extreme shape now uses the V29
generalized hyperplasia distribution. A twin-cycle explainer (liver + pancreas fat, beta-cell recovery; Lim 2011,
Taylor 2018, DiRECT) sits above the sources.

## The figure (V26)

The 2D figure is a series of pixel-aligned Blender Cycles renders of one
body built by Theosis Medical (V31: MakeHuman CC0 surface, procedural organs/muscles/skeleton/arteries; see `CREDITS.md`): semi-transparent skin
over muscle and skeleton, heart, liver, gallbladder, stomach, pancreas,
intestines and omentum in an abdominal window. Each threshold profile has six
frames (fuel 0, 40, 55, 70, 85, 100); `pft-figure.js` crossfades the two
neighbouring frames as the slider moves and fades between profiles. Fat under
the skin, visceral fat, fatty liver and pancreas are baked into the frames;
callouts, blood flow, glycogen and the heart glow are SVG overlays.

V23 changes: a broad, firm, rounded visceral "apple" belly (max projection just
below the navel, from the costal margin to the pubis) in both 2D and 3D; more
fat at the lower and moderate levels; heavier arms are held slightly away from
the trunk so arm and torso never merge; an arterial tree is
rendered under the skin (2D) and included as a toggleable 3D layer; the
blood-flow markers follow those arteries; glycogen is a teal speckle overlay
on muscle and liver with a legend.

V24 changes: smaller bellies at max fat for Lower (clearly the smallest) and
Moderate; the Extreme (hyperplasia) profile gains visibly more fat under the
skin as the slider rises, spread naturally over hips, thighs, calves, upper
arms, chest, flanks and back with a soft lower-abdominal apron (its visceral
fat stays flat); arms taper smoothly to the forearm; the fat layer no longer
stops in a band at the knees and elbows; stronger, irregular glycogen speckle (the 2D arm
glycogen follows the arms as they move out); softer, more matte skin in 3D
(no pale patch on the flanks).

V25 changes: smooth arms and body surface at high fat (the skin had hard
region-border creases and too few polygons on the arms; the 3D skin is now
subdivided, the arm abduction blends smoothly into the shoulder and the fat
grows along smoothed normals); no shadows in the Inside abdomen and Fat + muscle
3D views (soft frontal light instead), so liver fat and glycogen read clearly;
a new "In the bloodstream" section above the model: a cut-open thigh artery with
red cells, glucose, fat particles and insulin that rise and fall with the
slider and threshold, an arterial tree with flowing glucose/fat pulses, and
three level vials. It pauses when off-screen and is static with reduced motion.
Body surface lighting is softer (a gentle light from the viewer, weaker cool rim
lights) so skin reads more natural from every side; the 2D frames and overlay
masks were re-rendered from the smoothed model.

V26 changes: in "In the bloodstream" insulin now keeps rising with the slider
until it is maxed out in the type 2 diabetes range ("Very high, not working
well"): insulin is high but cannot move more fuel in because fat cells, liver
and muscle are already full past the personal fat threshold (a small note
mentions that, years later, an overworked pancreas can make less insulin). The
section is more compact so the artery, the slider and the fuel stores fit a
1366x768 laptop screen. Liver fat now looks like steatosis (a paler, mottled,
slightly enlarged liver with fine fat droplets in the tissue) and visceral fat
looks like lobulated omental and mesenteric fat with fine vessels, in the 2D
frames, the 3D cutaways and the CT view. 3D gained panning when zoomed in
(see 3D controls).

V27 changes: an "Estimated average glucose (from A1c)" meter sits beside the
cut-open artery. It converts the same illustrative HbA1c the section shows
into average glucose with the ADAG equation (eAG mg/dL = 28.7 × HbA1c − 46.7;
mmol/L = mg/dL ÷ 18; Nathan et al., Diabetes Care 2008). An analog dial
(60–260 mg/dL; green below 117 = HbA1c under 5.7%, amber 117–139 = 5.7–6.4%,
red from 140 = 6.5% and above) and a digital readout ease to the new value as
the slider or threshold changes (instant with reduced motion). A mg/dL / mmol/L
switch is remembered in the browser. Screen readers get one polite update
after the value settles, never during slider drags or on page load. The section
is the same height as V26 on laptop screens; on phones the meter stacks under
the artery.

V28 changes: plaque in the cut-open thigh artery. From the prediabetes range
onward (strongest in the diabetes range; Lower and Moderate most, Larger less,
Extreme only a faint fatty streak) yellow fatty streaks with foam-cell
speckles appear on the artery lining, then grow into raised yellow-white
plaques (lipid core under a whitish fibrous cap) that bulge into and mildly
narrow the lumen; a few fat particles slip into the wall at active sites.
Plaque grows slowly with the slider. When the slider comes back down it
shrinks only partly (to about 60% of its peak for that threshold) and the
caption says real plaque only partly regresses; choosing another threshold
starts a new person with a clean artery. A label on the artery ("Thigh artery
wall: smooth / fatty streaks / plaques forming / plaques narrowing it / plaque
only partly shrinks") and a "Plaque" legend item were added; the section height
is unchanged on laptops. Plaque artwork is cached, so it adds very little per
frame; it is static with reduced motion.

**Become diabetic** / **Reverse diabetes** animate the slider to 100 / 0 over
about four seconds (instant with reduced motion; any slider input cancels).

The V21 option to restore the original v20 artwork (`art.figure` in
`pft-config.js`) still exists but would replace the rendered figure.

## Restoring the original v20 artwork (optional)

The v20 figure, heart and fat-texture images were embedded in the original
file, and the copy available to this rebuild was truncated, so
`assets/img/standin-*.webp` are stand-ins drawn for this build. To bring the
originals back:

1. `node tools/extract-models.mjs original.html extracted/`
2. Copy `extracted/uploaded-person.*`, `heart-source.*` and
   `adipose-source.*` into `assets/img/`.
3. Set `art.figure`, `art.heart` and `art.adipose` in `pft-config.js`.

## Turning on 3D

3D is configured in this build (`assets/models/pft-anatomy.glb`). See
`assets/models/README.md`. Nothing 3D is downloaded until 3D is tapped. When
the page is opened straight from disk (file://) browsers block fetching the
.glb, so the runtime loads `pft-anatomy.glb.js` (the same model embedded in a
classic script) instead. If 3D really cannot start (no WebGL, missing file) a
visible message explains why and the 2D figure stays.

3D controls: drag to orbit freely (left/right and over the top/under), flick
for inertia, scroll / trackpad pinch / two-finger pinch to zoom, double-click
to reset, arrow keys and +/− on the focused canvas.

V26 panning: once you zoom in, a plain drag moves the view (so the parts cut
off at the edges can be brought into view) and Shift-drag rotates. Right-drag
or middle-drag always moves, two fingers move on touch screens, and Shift +
arrow keys move from the keyboard. The − / + / Move / Reset buttons on the
figure zoom, switch between moving and rotating, and recenter the front view
(Reset, double-click, 0 or Home also recenter; zooming fully out recenters too).
V29 changes: the Extreme (hyperplasia) 2D figure was re-rendered at all six
slider frames. Fat is now spread in a smoother, more general pattern: thicker
upper back, flanks and upper arms, with less ballooning at the hips and thighs.
The inner-thigh bulges and the puff at the elbow are gone. The skin colour of
the head, neck, hands and feet matches the body, and the abdominal window has
a soft, lit edge where the fat layer is cut, with no dark rim. In Extreme the
green muscle tone now fades out after the glycogen prelude, so it no longer
covers the body like a flat sheet; the teal glycogen speckle during the
prelude is unchanged. Other profiles, the visceral track, crossfade, labels
and the 3D view are unchanged. The 3D model still uses the earlier body
shape.

V30 changes: plaque in the artery now follows the slider both ways. The amount
of plaque depends only on the current slider position and threshold (the V28
"keeps 60% of its peak" rule is gone), so moving the slider back down shrinks it
smoothly, the same way it grew, until the wall is smooth again. While it
shrinks, the label reads "Thigh artery wall: plaque shrinking" and the caption
says "Plaque shrinking as glucose and fats come down", with a short note that
real plaque usually shrinks only partly. The science notes say the same.
Everything else is unchanged.


V32a changes: 3D is now the primary view. The 2D Blender frames are chosen automatically
when WebGL is missing, Data Saver is on, or the device is low-power (under 3 GB memory or
fewer than 4 CPU cores). If 3D is still loading after 6 s, or runs below about 10 fps for 3 s,
the 3D pauses and shows "Having trouble loading? Try 2D view" with a one-tap switch. The 2D/3D
toggle remembers the choice. Overrides: ?view=2d or ?view=3d.

V32b: the 3D canvas now fills the stage and the default camera is closer, so the body is about 1.6x larger.

V32c: new liver (thin left lobe, falciform notch, gallbladder fossa, caudate lobe), pear-shaped gallbladder, smooth J-shaped stomach, pancreas with uncinate process, and a mesentery sheet. Modelled from the written descriptions and proportions in Gray's Anatomy (1918, public domain); all geometry is our own. The 2D fallback frames are still the V31 renders.

V32d: procedural organ surface shading in 3D (fine lobular mottling, micro-bump, wet serosa sheen; no image textures) and 74 more named arterial branches in 3D (120 vessels in total, up from 46). The 2D fallback is unchanged.

V32e: 47 named muscles in 3D (each muscle has its own tint and a dark seam at its borders; click one to name and highlight it); a "Hide muscles" button reveals the arteries and skeleton; the mesentery is a separate fatty-yellow visceral-fat sheet. Correction to the V32d note: the live 3D viewer is anatomy-v23.js, which already had procedural organ shading; the V32d shading edit was made in an unused file and has been reverted.

V32f: the 2D fallback frames are re-rendered with the V32 organs and mesentery. The new chest-wall arteries were shortened so they stay inside the rib cage.

V32g1: a more detailed 3D skeleton: separate carpal, metacarpal and phalanx bones; tarsal bones; C1-C7; a skull with a nasal opening, cheekbones, mastoids and jaw rami; a sacrum with coccyx; bony landmarks on the long bones. The glycogen speckle over muscle is lighter, so the muscles show at normal zoom. The armpit artery (lateral thoracic) was removed. The 2D frames will be re-rendered after the body-contour stage.
