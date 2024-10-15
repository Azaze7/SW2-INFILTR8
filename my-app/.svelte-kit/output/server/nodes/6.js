

export const index = 6;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/dashboard/reports/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/6.DdZAtauS.js","_app/immutable/chunks/scheduler.Dl6cgSXR.js","_app/immutable/chunks/index.9kEH5mB3.js","_app/immutable/chunks/each.D6YF6ztN.js","_app/immutable/chunks/Sidebar.BZtV_aCC.js","_app/immutable/chunks/TestSidebar.ByvwKvIe.js"];
export const stylesheets = ["_app/immutable/assets/6.Bj-6qjb-.css","_app/immutable/assets/Sidebar.BR6K__ZP.css"];
export const fonts = [];
