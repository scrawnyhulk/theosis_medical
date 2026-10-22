# Credits and licenses (Body Composition Simulator v6)

## 3D figure and anatomy

| Part | Source | License |
|---|---|---|
| Body meshes (male / female) and base morph targets | MakeHuman hm08 base mesh and targets (makehuman.org) | **CC0 1.0** (public domain dedication); see `fig3d/LICENSE-MakeHuman-assets-CC0.md` |
| 3D engine | three.js r169 (bundled in `fig3d/fig3d.js`) | **MIT**; see `fig3d/LICENSE-three.js-MIT.txt` |
| Organs in the anatomy views: visceral fat (lobule cluster), gut loops (tube), liver (wedge), fat layer, muscle surface | **Procedural**: generated at run time by code in `fig3d-src/runtime/runtime.js` (spheres, a tube along a curve, noise displacement); no external mesh | Project's own code |
| Glycogen speckle, fatty-liver droplets, muscle-definition map, fat-layer peel | **Procedural shaders** in `runtime.js` | Project's own code |
| Smoothing (v6) | Laplacian diffusion of morph targets and Taubin display smoothing, written for this project (same approach as the PFT V25 model) | Project's own code |

**No Z-Anatomy content.** Z-Anatomy (CC BY-SA 4.0) meshes, textures or derivatives are not used or shipped. The
Personal Fat Threshold (PFT) model's anatomy file (`pft-anatomy.glb`) is derived from Z-Anatomy, so it was **not**
used. PFT was used only as a visual reference (soft frontal light in cutaways, label style, glycogen colour). No PFT
assets were copied. No CC BY-SA, CC BY-NC or unknown-license meshes are included.

## Other bundled components

## Evidence used by the v6 models (cited, no content copied)
- Diabetes / prediabetes HbA1c thresholds (6.5% / 5.7%): American Diabetes Association, Standards of Care 2025, Section 2.
- Liver-fat grades (MRI-PDFF): Tang A et al. *Radiology* 2013;267:422-31 (5% steatosis threshold; 17.4% and 22.1% grade cut-offs).
- Visceral fat lost first, faster than subcutaneous: Merlotti C et al. *Int J Obes* 2017; Smith SR, Zachwieja JJ. *Int J Obes* 1999; Hallgreen CE, Hall KD. *Int J Obes* 2008.
- Lifting energy cost: Ainsworth BE et al. *2011 Compendium of Physical Activities*, *Med Sci Sports Exerc* 2011;43:1575-81 (codes 02020-02054); EPOC magnitude: LaForgia J et al. *J Sports Sci* 2006.
- Training frequency and volume: Schoenfeld BJ et al. *Sports Med* 2016 (frequency) and *J Sports Sci* 2017 (volume); maintenance with reduced volume: Bickel CS et al. *Med Sci Sports Exerc* 2011.
- Minimum effective dose / rest-pause: Androulakis-Korakakis P et al. *Sports Med* 2020 (minimal-dose strength training); Prestes J et al. *J Strength Cond Res* 2019 (rest-pause).
- Glycogen (illustrative): muscle glycogen and carbohydrate intake (Burke LM et al. *J Sports Sci* 2011); impaired glycogen synthesis with insulin resistance (Shulman GI et al. *NEJM* 1990).
