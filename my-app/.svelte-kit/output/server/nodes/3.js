

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/dashboard/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/3.uY_LWrQ5.js","_app/immutable/chunks/scheduler.DHNv_ntZ.js","_app/immutable/chunks/index.NMdoImha.js","_app/immutable/chunks/each.D6YF6ztN.js","_app/immutable/chunks/Sidebar.eD2Jgeob.js"];
export const stylesheets = ["_app/immutable/assets/3.CbAPgtw5.css","_app/immutable/assets/ProjectScreen.CkCFoFBI.css","_app/immutable/assets/Sidebar.BR6K__ZP.css"];
export const fonts = [];
