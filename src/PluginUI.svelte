<script>
  //import Global CSS from the svelte boilerplate
  //contains Figma color vars, spacing vars, utility classes and more
  import { GlobalCSS } from "figma-plugin-ds-svelte";
  import "./app.css";

  // import d3
  import * as d3 from "d3";

  //import some Svelte Figma UI components
  import {
    Button,
    Checkbox,
    IconArrowLeftRight,
    IconCaretRight,
    IconLayoutGridRows,
    Input,
    Label,
    SelectMenu,
  } from "figma-plugin-ds-svelte";
  import Textarea from "./components/inputs/Textarea.svelte";

  let disabled = true,
    notReady = true,
    data,
    width = 800,
    leftMargin = 166,
    showXAxis = true,
    showHeader = true,
    showValues = true;

  $: disabled = data === null;

  $: formattedData = data && d3.tsvParse(data, d3.autoType).length > 0 ? d3.tsvParse(data, d3.autoType) : null;
  $: columns = formattedData ? Object.keys(formattedData[0]) : null;

  $: menuItems = formattedData
    ? [
        ...columns.map((column, i) => ({
          value: column,
          label: column,
          group: null,
          selected: false,
          type: formattedData[0][column] ? typeof formattedData[0][column] : null,
        })),
      ]
    : null;

  $: stringColumns = menuItems ? menuItems.filter((item) => item.type === "string") : null;
  $: numberColumns = menuItems ? menuItems.filter((item) => item.type === "number") : null;

  let bars, size;

  $: notReady = formattedData && bars && size ? false : true;

  // use d3 to get tick values for the x axis
  $: ticks =
    formattedData && size
      ? d3
          .scaleLinear()
          .domain([0, d3.max(formattedData, (d) => d[size.value])])
          .nice()
          .ticks(5)
      : null;

  function draw() {
    parent.postMessage(
      {
        pluginMessage: {
          type: "draw",
          data: formattedData,
          bars: bars.value,
          size: size.value,
          width: width,
          leftMargin: leftMargin,
          ticks: ticks,
          showXAxis: showXAxis,
          showHeader: showHeader,
          showValues: showValues,
        },
      },
      "*"
    );
  }

  function cancel() {
    parent.postMessage({ pluginMessage: { type: "cancel" } }, "*");
  }

  function clearData() {
    data = null;
  }
</script>

<div class="wrapper p-xxsmall">
  <div class="flex items-center justify-between w-full my-2">
    <Label>Data</Label>
    {#if data}
      <Button on:click={clearData} {disabled} variant="tertiary">Clear</Button>
    {/if}
  </div>
  {#if !formattedData}
    <Textarea placeholder="Copy and paste your TSV data from Excel or Google Sheets." bind:value={data} />
  {:else}
    <div class="h-16 my-2 overflow-scroll table-container">
      <table class="w-full border-collapse border-spacing-0 text-xs font-normal leading-normal rounded-[4px]">
        <thead>
          <tr>
            <th class="text-xs sticky -top-[1px] font-bold text-left py-2 px-4 whitespace-nowrap number">&nbsp;</th>
            {#each Object.keys(formattedData[0]) as key}
              <th class="text-xs sticky -top-[1px] font-bold text-left py-2 px-4 whitespace-nowrap">{key}</th>
            {/each}
          </tr>
        </thead>
        <tbody>
          {#each formattedData as row, i}
            <tr>
              <td class="text-xs number">{i + 1}</td>
              {#each Object.values(row) as value}
                <td class="text-xs">{value}</td>
              {/each}
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}

  {#if !disabled}
    {#if menuItems}
      <div class="flex items-start w-full gap-2">
        <div class="w-full my-2">
          <Label>Bars</Label>
          <SelectMenu
            iconName={IconLayoutGridRows}
            placeholder="Column"
            bind:menuItems={stringColumns}
            bind:value={bars}
            class="mb-xxsmall"
          />
        </div>
        <div class="w-full my-2">
          <Label>Size</Label>
          <SelectMenu
            iconName={IconArrowLeftRight}
            placeholder="Column"
            bind:menuItems={numberColumns}
            bind:value={size}
            class="mb-xxsmall"
          />
        </div>
        <!-- <div class="w-full my-2">
          <Label>Colour</Label>
          <SelectMenu
            iconName={IconEyedropper}
            placeholder="Column"
            bind:menuItems
            bind:value={color}
            class="mb-xxsmall"
          />
        </div> -->
      </div>
      <div class="flex w-full gap-2 my-2">
        <div>
          <Label>Width</Label>
          <Input iconName={IconArrowLeftRight} bind:value={width} placeholder="Chart width" />
        </div>
        <div>
          <Label>Left margin</Label>
          <Input iconName={IconCaretRight} bind:value={leftMargin} placeholder="Left margin" />
        </div>
      </div>
      <div class="flex items-center w-full gap-2">
        <Checkbox bind:checked={showHeader}>Include header?</Checkbox>
        <Checkbox bind:checked={showXAxis}>Show X axis?</Checkbox>
        <Checkbox bind:checked={showValues}>Show values?</Checkbox>
      </div>
    {/if}

    <div class="flex p-xxsmall mb-xsmall">
      <Button on:click={cancel} variant="secondary" class="mr-xsmall">Cancel</Button>
      <Button on:click={draw} bind:disabled={notReady}>Draw</Button>
    </div>
  {/if}
</div>

<style>
  :global(svg, .icon-component *) {
    fill: var(--figma-color-text) !important;
  }

  .table-container {
    height: 100px;
    overflow: scroll;
    font-size: 10px !important;
    border: 1px solid var(--figma-color-border);
  }

  table {
    border: 1px solid var(--figma-color-border);
    color: var(--figma-color-text);
  }

  table thead th {
    background-color: var(--figma-color-bg-secondary);
    color: var(--figma-color-text);
  }

  table tbody {
    background-color: var(--figma-color-bg);
  }

  table tbody tr:not(:last-of-type) {
    border-bottom: 1px solid var(--figma-color-border);
  }

  table tbody td {
    padding: 12px 16px;
    min-width: 100px;
  }

  table tbody td:not(:last-of-type) {
    border-right: 1px solid var(--figma-color-border);
  }

  table tbody td:last-child {
    padding-right: 16px;
  }

  table tbody td.number,
  table thead th.number {
    text-align: center;
    width: 40px;
    min-width: unset;
  }
</style>
