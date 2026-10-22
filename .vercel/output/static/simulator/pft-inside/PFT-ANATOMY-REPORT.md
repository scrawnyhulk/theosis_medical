# PFT 3D model: anatomy accuracy pass (2026-10-21, America/Chicago)

I used Netter's Atlas, Gray's Anatomy and Moore's Clinically Oriented Anatomy only for anatomical facts such as
vertebral levels, relationships and proportions. No artwork was copied or traced. All new geometry is procedural
and built by Theosis (scripts in `tools-anatomy/`). I added no third-party meshes or textures, so there's no
share-alike content and the licence notes in NOTICE/CREDITS still hold.

## Where the work is and why it isn't live
- Finished build: `/workspace/bodysim/pft-anatomy-staging/`, a complete pft-inside folder that runs on its own.
- Untouched original: `/workspace/bodysim/backup-pft-inside-pre-anatomy/` (the pinned v32i build).
- **Blocker:** `app-src/build.py` deletes `app/pft-inside` on every simulator build and unpacks
  `/workspace/pft/personal-fat-threshold-v32i.zip` again. That happened at 00:15 tonight and wiped my first install. To
  avoid that, and to avoid changing the model halfway through the other worker's test run and push, the pass sits in
  staging. To make it live, run `pft-anatomy-staging/apply-to-app.sh` after a build. The script checks hashes and won't
  overwrite anything except the pristine v32i files. For it to stick, build.py (app-src, owned by the other worker)
  needs to call that script after it unpacks the zip.
- Changed files: `assets/models/pft-anatomy.glb`, `assets/models/pft-anatomy.glb.js`, `assets/js/anatomy-v23.js`
  (new roles and materials only) and `assets/js/pft.js` (CT drawing only). pft-embed.js didn't need any change:
  its callout anchors come from mesh bounding boxes at runtime, and mesh names, paths and the
  `window.PFTAtlas.setState/model/compartments/setView` API are all unchanged.

## How I set the levels
The procedural spine has evenly spaced vertebrae and no true vertebral identities, so I set levels from landmarks on
the model:
- Lowest posterior rib (rib 12) at T12, about y = 1.15 m.
- Iliac crest (supracristal plane) at L4, about 1.02.
- Transpyloric plane (halfway from the jugular notch, 1.41, to the pubic symphysis, 0.914) at about L1, 1.16.
- Sternum: jugular notch 1.41, xiphoid tip 1.17.

## Checked and already correct (no change)
- **Liver:** right upper quadrant under the right dome (top at 1.256, level with the heart's lower border). The inferior
  edge sits at the right costal margin. Left lobe reaches the left midclavicular line.
- **Pancreas:** head inside the duodenal C-loop at L2. Body crosses L1 in front of the aorta. Tail rises to T12 at the
  splenic hilum (Moore: pancreas at L1–L2, head in the C-loop, tail in the splenorenal ligament).
- **Duodenum:** D1 at L1, D3 at L3 (Moore).
- **Kidneys:** left T12–L3. Right sits about 1.5–2 cm lower because the liver is above it (Netter/Moore).
- **Heart position against the sternum:** base behind the 3rd costal cartilage area, inferior border just above the
  xiphisternal joint. Aortic arch apex about 2 cm below the jugular notch, at the mid-manubrium (Moore: arch at
  T4/sternal angle level).
- **Aortic bifurcation:** at about L4 (Moore: L4, just left of midline).
- **Fat compartments (already correct, kept as is):**
  - Subcutaneous fat is a shell over the muscle wall (skin morphs and fat layer).
  - Visceral fat sits inside the peritoneum as the greater omentum (from the transverse colon over the bowel) plus
    mesenteric fat along the loops.
  - Liver fat is inside the parenchyma (diffuse, patchy steatosis shader with swelling, no surface blobs).
  - Pancreatic fat is intra- and interlobular in the pancreas shader.

## Corrections made (3D model)
| # | Problem | Fix | Reference fact |
|---|---|---|---|
| 1 | The abdominal and lower thoracic aorta ran **through the vertebral bodies**: its centreline sat 2–3 cm behind their anterior surface. | Moved forward (up to 4.5 cm) onto the anterolateral-left surface of the bodies (about 1.1 cm left of midline in the abdomen, about 1.8 cm left in the lower chest), blending smoothly into the arch above and the iliacs below. Branches (celiac, SMA, renals) follow with smooth falloff. | Abdominal aorta lies on the anterior/left side of the vertebral bodies, entering through the aortic hiatus at T12 (Moore; Gray's). |
| 2 | No IVC. | Added one, with common iliac veins, from L5 up the right of the aorta, through the caval groove of the liver, to the right atrium. Deoxygenated blue, and it hides with the Arteries toggle. | IVC forms at L5, lies right of the aorta, passes through the caval opening at T8 (Moore). |
| 3 | No diaphragm. | Added a smooth domed sheet. It rests on the liver (right), stomach and spleen (left) and the heart (central tendon, paler colour). The rim sits at the costal margin, and there's a posterior opening for the crura, aorta and spine. Semi-transparent. | Domes at about 5th rib (right) and 5th intercostal space (left); heart on the central tendon; crura on L1–L3 (Netter/Moore). |
| 4 | No lungs. | Added two smooth lungs inside the rib cage, with bases on the diaphragm, apices about 2.5 cm above the medial clavicle and a mediastinal gap (heart, great vessels, trachea and oesophagus band). The left lung has a natural cardiac notch where it clears the heart. Pale pink and see-through, so the heart still reads. | Cervical pleura/apex 2–3 cm above the medial third of the clavicle; cardiac notch of the left lung; bases on the domes (Moore). |
| 5 | **Liver, spleen and stomach poked through the ribs to the skin** laterally (they reached the skin surface). Colon and jejunum came within about 7 mm of the skin. | Soft radial containment: in the rib zone they now stay inside the inner rib surface. Below the costal margin there's an abdominal wall of about 1.6 cm (lean state). The mapping is smooth and monotonic, so organ contacts and order are kept, and the omentum and mesentery get the same mapping. The diaphragmatic surfaces of the liver and spleen now follow the chest wall. | Liver and spleen lie deep to ribs 7–11 (spleen along ribs 9–11) and are moulded by the diaphragm; the anterolateral abdominal wall has skin, fat and three muscle layers (Moore). |
| 6 | Heart width was about 0.63 of this slim model's inner chest width (it would read as cardiomegaly), and it was 12.6 cm deep. | Scaled 0.85 about the aortic root. Width is now about 10 cm (cardiothoracic ratio about 0.5) and the lower border is at about 1.244. Coronary arteries were scaled with it so they stay on the surface. | Normal cardiothoracic ratio < 0.5; heart about 12 × 8.5 × 6 cm in an average adult with a broader chest (Moore; standard radiology). |
| 7 | Spleen sat about 1.5 cm low. | Raised 1.5 cm to the ribs 9–11 band (T10–T12 posteriorly). | Spleen lies along ribs 9–11, with its long axis along rib 10 (Moore/Netter). |
| 8 | The kidneys' medial borders overlapped the vertebral bodies and transverse processes. | Moved 8 mm laterally (ureters taper back to their original course) so they rest on psoas and quadratus lumborum. | Hilum about 5 cm from the midline; kidneys lie in the paravertebral gutters on psoas/QL (Moore). |

## Corrections made (CT view, axial at L1)
- **Psoas:** shrunk to about 60%. At L1 the psoas is just starting (it arises T12–L5 and gets bigger lower down), so it
  had been drawn too large for this level.
- **Spleen:** moved posterolaterally, behind the stomach and lateral to the left kidney, to match its 3D position.
- **Diaphragmatic crura:** added on each side of the aorta (right crus larger), as seen on a real L1 slice.
- **Already correct and kept:** liver on the right, stomach front-left, pancreas across the front of the aorta and
  SMA, aorta front-left of the vertebra, IVC on the right, kidneys with hila facing anteromedially, and the
  subcutaneous and visceral fat compartments.

## Behaviour, labels, performance
- Sliders, threshold profiles, modes, Become/Reverse, picking and the state hooks are unchanged. Picking now also
  names "Lungs", "Diaphragm" and "Inferior vena cava".
- The 3D label anchors (the cross-section label on the liver/upper-abdomen window, visceral fat, the skin/fat
  label) still sit on the right structures after the moves, so their coordinates didn't need changing. The embed's
  anchors follow the meshes automatically.
- **Size and load:** the model is +233 KB (2.65 → 2.88 MB) and has about 21k more vertices (+9%). The new transparent
  meshes are drawn without depth writes. Phone 3D at 390 px loaded and rendered with no errors, and no page errors
  showed up in any run.
- The phone layout already overlaps (zoom buttons over the Hide muscles button, and the hint text over the speckle
  card) in both the before and after shots. That predates this pass, and I didn't change any CSS.

## Limitations
- **2D figure not updated:** the 2D figure frames (Blender Cycles renders) and their masks weren't regenerated,
  because Blender isn't installed on the box. The 2D view therefore still shows the old organ layout: aorta inside
  the spine, liver and spleen reaching the skin, no lungs or diaphragm. Only the 3D model and the CT view changed.
- **Vertebral levels are approximate.** They come from the landmarks above, because the spine has no individually
  identified vertebrae.
- **Domes nearly level:** the left dome is held up by the stomach fundus, so the right dome is only a few mm higher
  than the left. It should be 1–2 cm higher. Fixing that means lowering the fundus a little.
- **Slim chest:** the MakeHuman chest is narrow (about 25 cm wide), which limits lung volume. That's why the heart was
  scaled to keep the proportions right rather than left at absolute adult size.
- **Not modelled:** the gallbladder was left as it was. There are still no adrenals, oesophagus, renal or hepatic
  veins, or portal vein. From the front, the IVC shows through the existing gap in the liver's caudate area. In real
  anatomy it's mostly hidden behind the liver.
- **Not tested inside the simulator embed:** the simulator's embed (pft-embed.js inside app/) wasn't run against
  staging, because that would mean writing into app/pft-inside while the other worker is testing. Mesh names and
  the API are unchanged.
