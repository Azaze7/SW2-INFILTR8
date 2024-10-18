

export const index = 7;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/dashboard/testing/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/7.DJyDfXrx.js","_app/immutable/chunks/scheduler.Dl6cgSXR.js","_app/immutable/chunks/index.9kEH5mB3.js","_app/immutable/chunks/each.D6YF6ztN.js"];
export const stylesheets = ["_app/immutable/assets/7.D_MuJrtp.css"];
export const fonts = [];
