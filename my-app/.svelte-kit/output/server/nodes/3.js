

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/dashboard/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/3.BdTPGY_t.js","_app/immutable/chunks/scheduler.Dl6cgSXR.js","_app/immutable/chunks/index.9kEH5mB3.js","_app/immutable/chunks/TestSidebar.ByvwKvIe.js","_app/immutable/chunks/TestTopRight.DGZ4x_mB.js"];
export const stylesheets = ["_app/immutable/assets/3.C5iKWCqk.css"];
export const fonts = [];
