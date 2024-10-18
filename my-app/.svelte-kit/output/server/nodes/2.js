import * as universal from '../entries/pages/_page.ts.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+page.ts";
export const imports = ["_app/immutable/nodes/2.BTgJkPXy.js","_app/immutable/chunks/scheduler.Dl6cgSXR.js","_app/immutable/chunks/index.9kEH5mB3.js"];
export const stylesheets = ["_app/immutable/assets/2.CGKvyk09.css"];
export const fonts = [];
