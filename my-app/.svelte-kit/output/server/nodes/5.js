

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/dashboard/project/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/5.DY9srxB3.js","_app/immutable/chunks/scheduler.Dl6cgSXR.js","_app/immutable/chunks/index.9kEH5mB3.js","_app/immutable/chunks/each.D6YF6ztN.js","_app/immutable/chunks/Sidebar.BZtV_aCC.js"];
export const stylesheets = ["_app/immutable/assets/5.CkCFoFBI.css","_app/immutable/assets/Sidebar.BR6K__ZP.css"];
export const fonts = [];
