/* Personal Fat Threshold: deployment settings.
   Edit this file only; nothing here is sent anywhere.

   3D VIEW (V23)
   One compressed file holds the whole teaching model (skin with fat morph
   targets, decimated muscles and skeleton, abdominal organs). It downloads only
   when the reader taps 3D. Set models.skin/organs to null to hide the 3D button.

   2D FIGURE (V22)
   The default 2D figure is a set of pixel-aligned photoreal renders of the same
   anatomy (/pft/v35/assets/img/figure/*). See NOTICE.txt for sources and licences. */
window.PFT_CONFIG = {
  models: {
    anatomy: "/pft/v35/assets/models/pft-anatomy.glb",
    anatomyEmbedded: "/pft/v35/assets/models/pft-anatomy.glb.js", // same model as a classic script, used when opened from file://
    skin: "/pft/v35/assets/models/pft-anatomy.glb",     // required for the 3D button
    organs: "/pft/v35/assets/models/pft-anatomy.glb",   // required for the 3D button
    muscles: null,
    bones: null
  },
  art: {
    figure: null,
    heart: null,
    adipose: null
  },
  threeScript: "/pft/v35/assets/vendor/three-anatomy.min.js",
  anatomyScript: "/pft/v35/assets/js/anatomy-v23.js"
};
