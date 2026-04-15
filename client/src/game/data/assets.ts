export interface AssetManifest {
  textures: Array<{ key: string; path: string; note: string }>;
  audio: Array<{ key: string; path: string; note: string }>;
}

export const assetManifest: AssetManifest = {
  textures: [
    { key: "tank-body", path: "procedural://rect/28x16", note: "Placeholder procedural sprite" },
    { key: "projectile", path: "procedural://circle/6", note: "Placeholder projectile dot" },
    { key: "loot", path: "procedural://diamond/10", note: "Placeholder loot glyph" },
  ],
  audio: [
    { key: "shoot", path: "sfx/shoot_placeholder.wav", note: "Synth blip" },
    { key: "explosion", path: "sfx/explosion_placeholder.wav", note: "Noise burst" },
    { key: "adhesion-attach", path: "sfx/attach_placeholder.wav", note: "Mag clamp click" },
    { key: "adhesion-detach", path: "sfx/detach_placeholder.wav", note: "Snap release" },
    { key: "pickup", path: "sfx/pickup_placeholder.wav", note: "Arp tick" },
    { key: "hazard-warning", path: "sfx/hazard_warning_placeholder.wav", note: "Low pulse" },
    { key: "elimination", path: "sfx/elimination_placeholder.wav", note: "Falling tone" },
    { key: "ui-click", path: "sfx/ui_click_placeholder.wav", note: "Soft click" },
  ],
};
