import { c as create_ssr_component, h as each, f as add_attribute, e as escape, v as validate_component } from "../../../../chunks/ssr.js";
const css = {
  code: ".analysis-screen.svelte-sbimdf{padding:20px}.summary-section.svelte-sbimdf{margin-top:20px;border:1px solid #ccc;padding:10px}.scrollable.svelte-sbimdf{max-height:200px;overflow-y:auto}.analysis-progress.svelte-sbimdf{margin-bottom:10px}progress.svelte-sbimdf{width:100%}",
  map: '{"version":3,"file":"TestingScreen.svelte","sources":["TestingScreen.svelte"],"sourcesContent":["<script>\\n    let projects = [\\"Project A\\", \\"Project B\\", \\"Project C\\"];\\n    let selectedProject = projects[0];\\n  \\n    let entryPointTypes = [\\"Type 1\\", \\"Type 2\\", \\"Type 3\\"];\\n    let selectedEntryPoint = entryPointTypes[0];\\n  \\n    let startTimes = [\\"Now\\", \\"In 1 hour\\", \\"Tomorrow\\"];\\n    let selectedStartTime = startTimes[0];\\n  \\n    let analysisData = [\\n      { name: \\"Analysis 1\\", progress: 50 },\\n      { name: \\"Analysis 2\\", progress: 80 }\\n    ];\\n  \\n    let overallProgress = 60;\\n  <\/script>\\n  \\n  <div class=\\"analysis-screen\\">\\n    <h1>Analysis</h1>\\n  \\n    <label for=\\"project-select\\">Select Project:</label>\\n    <select bind:value={selectedProject} id=\\"project-select\\">\\n      {#each projects as project}\\n        <option>{project}</option>\\n      {/each}\\n    </select>\\n  \\n    <div class=\\"summary-section\\">\\n      <h2>Summary</h2>\\n      <div class=\\"scrollable\\">\\n        {#each analysisData as analysis}\\n          <div class=\\"analysis-progress\\">\\n            <label>{analysis.name}</label>\\n            <progress value={analysis.progress} max=\\"100\\"></progress>\\n          </div>\\n        {/each}\\n      </div>\\n      <label>Overall Progress</label>\\n      <progress value={overallProgress} max=\\"100\\"></progress>\\n      <p>{overallProgress}% Completed</p>\\n    </div>\\n  \\n    <div class=\\"schedule-analysis\\">\\n      <h2>Schedule Analysis</h2>\\n  \\n      <label for=\\"entry-point\\">Entry Points:</label>\\n      <select bind:value={selectedEntryPoint} id=\\"entry-point\\">\\n        {#each entryPointTypes as type}\\n          <option>{type}</option>\\n        {/each}\\n      </select>\\n  \\n      <label for=\\"start-time\\">Start-Time:</label>\\n      <select bind:value={selectedStartTime} id=\\"start-time\\">\\n        {#each startTimes as time}\\n          <option>{time}</option>\\n        {/each}\\n      </select>\\n  \\n      <button on:click={() => console.log(\\"View Result\\")}>View Result</button>\\n    </div>\\n  </div>\\n  \\n  <style>\\n    .analysis-screen {\\n      padding: 20px;\\n    }\\n  \\n    .summary-section {\\n      margin-top: 20px;\\n      border: 1px solid #ccc;\\n      padding: 10px;\\n    }\\n  \\n    .scrollable {\\n      max-height: 200px;\\n      overflow-y: auto;\\n    }\\n  \\n    .analysis-progress {\\n      margin-bottom: 10px;\\n    }\\n  \\n    progress {\\n      width: 100%;\\n    }\\n  </style>\\n  "],"names":[],"mappings":"AAiEI,8BAAiB,CACf,OAAO,CAAE,IACX,CAEA,8BAAiB,CACf,UAAU,CAAE,IAAI,CAChB,MAAM,CAAE,GAAG,CAAC,KAAK,CAAC,IAAI,CACtB,OAAO,CAAE,IACX,CAEA,yBAAY,CACV,UAAU,CAAE,KAAK,CACjB,UAAU,CAAE,IACd,CAEA,gCAAmB,CACjB,aAAa,CAAE,IACjB,CAEA,sBAAS,CACP,KAAK,CAAE,IACT"}'
};
let overallProgress = 60;
const TestingScreen = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let projects = ["Project A", "Project B", "Project C"];
  projects[0];
  let entryPointTypes = ["Type 1", "Type 2", "Type 3"];
  entryPointTypes[0];
  let startTimes = ["Now", "In 1 hour", "Tomorrow"];
  startTimes[0];
  let analysisData = [{ name: "Analysis 1", progress: 50 }, { name: "Analysis 2", progress: 80 }];
  $$result.css.add(css);
  return `<div class="analysis-screen svelte-sbimdf"><h1 data-svelte-h="svelte-3d5w6y">Analysis</h1> <label for="project-select" data-svelte-h="svelte-ao85o1">Select Project:</label> <select id="project-select">${each(projects, (project) => {
    return `<option${add_attribute("value", project, 0)}>${escape(project)}</option>`;
  })}</select> <div class="summary-section svelte-sbimdf"><h2 data-svelte-h="svelte-1yu8q5y">Summary</h2> <div class="scrollable svelte-sbimdf">${each(analysisData, (analysis) => {
    return `<div class="analysis-progress svelte-sbimdf"><label>${escape(analysis.name)}</label> <progress${add_attribute("value", analysis.progress, 0)} max="100" class="svelte-sbimdf"></progress> </div>`;
  })}</div> <label data-svelte-h="svelte-kjbtd4">Overall Progress</label> <progress${add_attribute("value", overallProgress, 0)} max="100" class="svelte-sbimdf"></progress> <p>${escape(overallProgress)}% Completed</p></div> <div class="schedule-analysis"><h2 data-svelte-h="svelte-w56kdh">Schedule Analysis</h2> <label for="entry-point" data-svelte-h="svelte-14h0xxg">Entry Points:</label> <select id="entry-point">${each(entryPointTypes, (type) => {
    return `<option${add_attribute("value", type, 0)}>${escape(type)}</option>`;
  })}</select> <label for="start-time" data-svelte-h="svelte-1kmet44">Start-Time:</label> <select id="start-time">${each(startTimes, (time) => {
    return `<option${add_attribute("value", time, 0)}>${escape(time)}</option>`;
  })}</select> <button data-svelte-h="svelte-7lltd2">View Result</button></div> </div>`;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${validate_component(TestingScreen, "TestingScreen").$$render($$result, {}, {}, {})}`;
});
export {
  Page as default
};
