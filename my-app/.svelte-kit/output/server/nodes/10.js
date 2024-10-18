

export const index = 10;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/reports/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/10.C57TDDej.js","_app/immutable/chunks/scheduler.Dl6cgSXR.js","_app/immutable/chunks/index.9kEH5mB3.js","_app/immutable/chunks/each.D6YF6ztN.js","_app/immutable/chunks/TestSidebar.ByvwKvIe.js","_app/immutable/chunks/TestTopRight.DGZ4x_mB.js"];
export const stylesheets = ["_app/immutable/assets/10.BIv-D6xr.css"];
export const fonts = [];
