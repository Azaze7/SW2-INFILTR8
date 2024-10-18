

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/dashboard/logs/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/4.D3iArKtg.js","_app/immutable/chunks/scheduler.Dl6cgSXR.js","_app/immutable/chunks/index.9kEH5mB3.js","_app/immutable/chunks/each.D6YF6ztN.js","_app/immutable/chunks/Sidebar.BZtV_aCC.js"];
export const stylesheets = ["_app/immutable/assets/4.Df4CPK1B.css","_app/immutable/assets/Sidebar.BR6K__ZP.css"];
export const fonts = [];
