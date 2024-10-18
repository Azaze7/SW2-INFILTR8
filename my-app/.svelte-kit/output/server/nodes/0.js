

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/0.CEu6orsq.js","_app/immutable/chunks/scheduler.Dl6cgSXR.js","_app/immutable/chunks/index.9kEH5mB3.js"];
export const stylesheets = ["_app/immutable/assets/0.B3Dd2lAi.css"];
export const fonts = [];
