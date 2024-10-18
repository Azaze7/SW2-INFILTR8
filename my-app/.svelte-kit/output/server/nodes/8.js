

export const index = 8;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/logs/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/8.CG4hC41v.js","_app/immutable/chunks/scheduler.Dl6cgSXR.js","_app/immutable/chunks/index.9kEH5mB3.js","_app/immutable/chunks/TestSidebar.ByvwKvIe.js","_app/immutable/chunks/TestTopRight.DGZ4x_mB.js"];
export const stylesheets = ["_app/immutable/assets/8.CEFk2TTr.css"];
export const fonts = [];
