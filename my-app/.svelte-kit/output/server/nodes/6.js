

export const index = 6;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/dashboard/testing/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/6.BiSwO3LB.js","_app/immutable/chunks/scheduler.DHNv_ntZ.js","_app/immutable/chunks/index.NMdoImha.js","_app/immutable/chunks/each.D6YF6ztN.js"];
export const stylesheets = ["_app/immutable/assets/6.D_MuJrtp.css"];
export const fonts = [];
