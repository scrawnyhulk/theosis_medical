# 3D anatomy model (V31)

`pft-anatomy.glb` (meshopt-compressed with gltfpack) and its base64 copy `pft-anatomy.glb.js` (for file:// use).

Objects: Skin (+ subq / mass / belly / hyper morphs, fat weights packed in vertex colour), Muscles (+ belly / mass / hyper),
Bones (+ mass / hyper), Arteries (+ mass / hyper), Heart, Liver, Gallbladder, Stomach, Pancreas, Duodenum, Jejunum,
Ascending / Transverse / Descending / Sigmoid colon, Greater omentum (+ visc), Spleen, Kidneys, Urinary bladder.

## Source and licence
- Body surface: MakeHuman hm08 base mesh and macro targets, **CC0 1.0** (MakeHuman team), reposed, reproportioned
  and given fat-distribution morphs by Theosis Medical (scripts in the build sources: v31/skin_mh.py, fields_v31.py).
- All organs, muscles, skeleton and arteries: modelled procedurally by Theosis Medical (signed-distance fields,
  swept tubes, scripts v31/organs.py, organs_b.py, bones.py, muscles.py, arteries.py). No third-party meshes.
- See ../../CREDITS.md. No share-alike or non-commercial assets are used.
