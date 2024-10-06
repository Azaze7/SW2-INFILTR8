

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.B1bHxEjQ.js","_app/immutable/chunks/scheduler.DHNv_ntZ.js","_app/immutable/chunks/index.NMdoImha.js","_app/immutable/chunks/entry.BmbyiWwz.js"];
export const stylesheets = [];
export const fonts = [];
