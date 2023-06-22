<script>
  import { onMount } from "svelte";
  import { writable } from "svelte/store";

  import BarChartIcon from "./icons/BarChart.svg";
  import BarChartSeriesIcon from "./icons/BarChartSeries.svg";
  import LineChartIcon from "./icons/LineChart.svg";
  import LineChartSeriesIcon from "./icons/LineChartSeries.svg";

  import { GlobalCSS } from "figma-plugin-ds-svelte";
  import "./app.css";

  //import some Svelte Figma UI components
  import {
    Button,
    Checkbox,
    Icon,
    IconArrowLeftRight,
    IconCaretRight,
    IconLayoutGridRows,
    Input,
    Label,
    SelectMenu,
  } from "figma-plugin-ds-svelte";

  let disabled = true,
    chartType;

  let chartTypes = [
    {
      name: "Bar chart",
      icon: BarChartIcon,
      value: "bar",
    },
    {
      name: "Bar chart (series)",
      icon: BarChartSeriesIcon,
      value: "barSeries",
    },
    {
      name: "Line chart",
      icon: LineChartIcon,
      value: "line",
    },
    {
      name: "Line chart (series)",
      icon: LineChartSeriesIcon,
      value: "lineSeries",
    },
  ];

  const currentSelection = writable([]);
  const isFrame = writable(false);

  $: disabled = $currentSelection.length < 1 || !$isFrame;
  $: notReady = chartType === undefined || disabled;

  window.onmessage = async (event) => {
    const message = event.data.pluginMessage;
    if (!message) return;

    switch (message.type) {
      case "load":
        currentSelection.set(message.currentSelection);
        isFrame.set(message.isFrame);
        break;
      case "selectionChanged":
        currentSelection.set(message.currentSelection);
        isFrame.set(message.isFrame);
        break;
    }
  };

  function cleanChart() {
    parent.postMessage(
      {
        pluginMessage: {
          type: "cleanChart",
          chartType: chartType,
        },
      },
      "*"
    );
  }

  function selectChartType(type) {
    chartType = type;
  }

  function cancel() {
    parent.postMessage({ pluginMessage: { type: "cancel" } }, "*");
  }

  onMount(() => {
    parent.postMessage({ pluginMessage: { type: "init" } }, "*");
  });
</script>

<div class="wrapper p-xxsmall">
  {#if disabled}
    <div class="flex items-center justify-center w-full my-2">
      <p class="note italic text-center text-xs">
        Drop your exported SVG onto the current page and select it to get started.
      </p>
    </div>
  {:else}
    <!-- <Label>Chart type</Label> -->
    <div class="flex items-stretch justify-center gap-2 w-full my-2">
      {#each chartTypes as chart}
        <div
          class="chart-choice h-full w-1/4 px-2 py-2 flex flex-col items-center justify-center gap-2 rounded-lg cursor-pointer"
          class:selected={chart.value === chartType}
          on:click={() => selectChartType(chart.value)}
        >
          <div class="flex items-center justify-center w-12 h-12 rounded-md bg-white chart-icon">
            {@html chart.icon}
          </div>
          <div class="flex w-full h-8 items-center justify-center">
            <p class="text-xs text-center grow leading-tight">{chart.name}</p>
          </div>
        </div>
      {/each}
    </div>
  {/if}

  <div class="flex justify-center p-xxsmall mb-xsmall">
    <Button on:click={cancel} variant="secondary" class="mr-xsmall">Cancel</Button>
    <Button on:click={cleanChart} bind:disabled={notReady}>Clean!</Button>
  </div>

  {#if !disabled}
    <div class="flex items-center justify-center w-full mt-12">
      <p class="note italic text-center text-xs">
        Want to see more chart types? Shoot me an email at <a href="mailto:sam@haystack.design">sam@haystack.design</a>
      </p>
    </div>
  {/if}
</div>

<style>
  :global(svg, .icon-component *) {
    fill: var(--figma-color-text) !important;
  }

  .chart-choice {
    border: 2px solid transparent;
  }

  .chart-choice.selected {
    border: 2px solid var(--figma-color-border-onsuccess);
  }

  .chart-choice:hover {
    border: 2px solid var(--figma-color-border-onselected);
  }

  .chart-icon {
    box-shadow: var(--shadow-hud);
  }

  p {
    color: var(--figma-color-text);
  }

  p.note {
    color: var(--figma-color-text-secondary);
  }
</style>
