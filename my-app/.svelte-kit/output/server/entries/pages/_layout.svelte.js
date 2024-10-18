import { c as create_ssr_component } from "../../chunks/ssr.js";
const css = {
  code: ".mainContainer.svelte-19pst64{min-height:100vh;background:linear-gradient(to right, #000428, #000046);color:white;position:relative;display:flex;flex-direction:column}",
  map: '{"version":3,"file":"+layout.svelte","sources":["+layout.svelte"],"sourcesContent":["<div class=\\"mainContainer\\">\\n\\t<slot/>\\n</div>\\n\\n<style>\\n\\t\\n\\t.mainContainer {\\n\\t\\tmin-height: 100vh;\\n\\t\\tbackground: linear-gradient(to right, #000428, #000046);\\n\\t\\tcolor: white;\\n\\t\\tposition: relative;\\n\\t\\tdisplay: flex;\\n\\t\\tflex-direction: column;\\n\\t}\\n\\n</style>"],"names":[],"mappings":"AAMC,6BAAe,CACd,UAAU,CAAE,KAAK,CACjB,UAAU,CAAE,gBAAgB,EAAE,CAAC,KAAK,CAAC,CAAC,OAAO,CAAC,CAAC,OAAO,CAAC,CACvD,KAAK,CAAE,KAAK,CACZ,QAAQ,CAAE,QAAQ,CAClB,OAAO,CAAE,IAAI,CACb,cAAc,CAAE,MACjB"}'
};
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `<div class="mainContainer svelte-19pst64">${slots.default ? slots.default({}) : ``} </div>`;
});
export {
  Layout as default
};
