import cloneChart from './utils/cloneChart';
import createAutoLayout from './utils/createAutoLayout';
import createFrame from './utils/createFrame';
import loadFonts from './utils/loadFonts';
import remove100x100 from './utils/remove100x100';
import removeAll from './utils/removeAll';
import removeEmptyText from './utils/removeEmptyText';
import removeOne from './utils/removeOne';
import resizeTextBoxes from './utils/resizeTextBoxes';
import resizeToFit from './utils/resizeToFit';

import cleanAxes from './cleaners/cleanAxes';
import cleanBackground from './cleaners/cleanBackground';
import cleanDataLayer from './cleaners/cleanDataLayer';
import cleanLegend from './cleaners/cleanLegend';

let chartType,
	currentSelection = figma.currentPage.selection,
	isFrame = currentSelection[0] && currentSelection[0].type === "FRAME";

const cleanChart = async () => {
	// load fonts, just in case
	await loadFonts();

	// clone chart, leaving the original as is
	const chart = await cloneChart(currentSelection, chartType);

	if (chart.type === "FRAME") {
		// turn the chart into an autolayout. trust me, it'll be dope
		await createAutoLayout(chart, { "itemSpacing": 32 });
		chart.paddingTop = 32;
		chart.paddingRight = 32;
		chart.paddingBottom = 32;
		chart.paddingLeft = 32;

		// set background of frame and remove background rectangle
		await cleanBackground(chart, "backgorund") // yep. "backgorund".

		// check if there's a node called "legend", then redo it as an autolayout
		const legend = chart.findOne(node => node.name === "legend");
		if (legend) {
			const legendFrame = await cleanLegend(legend);
			chart.appendChild(legendFrame);
		}

		// check if there's a node called "viz", then work some magic
		const viz = chart.findOne(node => node.name === "viz");
		if (viz) {
			const vizFrame = createFrame("Viz", viz.width, viz.height, viz.x, viz.y);

			await remove100x100(viz.children);

			if (chartType === "bar") {
				// find data layer and clean it up
				const dataLayer = viz.children[0].children[0].findOne(node => node.name === "Group");
				if (dataLayer) {
					vizFrame.appendChild(dataLayer);
					await cleanDataLayer(dataLayer, chartType);
				}

				// find xAxis and yAxis, then clean them up
				const xAxis = viz.findOne(node => node.name === "xAxis");
				const yAxis = viz.findOne(node => node.name === "yAxis");

				if (xAxis) {
					vizFrame.appendChild(xAxis);
					await cleanAxes(xAxis, "X");
				}
				if (yAxis) {
					vizFrame.appendChild(yAxis);
					await cleanAxes(yAxis, "Y");
				}
			} else if (chartType === "line") {
				await removeOne(viz, "grid");
				await removeOne(viz, "serieClipPath");
				await removeEmptyText(viz);

				const chartContent = viz.children[0].children[0].children[0].children;

				if (chartContent.length > 0) {
					figma.group(chartContent, vizFrame);

					// find data layer and clean it up
					const dataLayer = chartContent.find(node => node.name === "viz");
					if (dataLayer) {
						await cleanDataLayer(dataLayer, chartType);
					}

					// find xAxis and yAxis, then clean them up
					const xAxis = chartContent.find(node => node.name === "axis").children[0];
					const yAxis = chartContent.find(node => node.name === "axis").children[1];

					chartContent.find(node => node.name === "axis").name = "Axes";

					if (xAxis) await cleanAxes(xAxis, "X");
					if (yAxis) await cleanAxes(yAxis, "Y");
				}
			} else if (chartType === "lineSeries") {
				await removeOne(viz, "grid");
				await removeAll(viz, "serieClipPath");

				vizFrame.appendChild(viz);

				// find all small multiples
				const series = vizFrame.children[0].children;

				if (series.length > 0) {
					series.forEach(child => {
						// turn each into an autolayout
						const seriesFrame = figma.createFrame();
						seriesFrame.name = `Series - ${child.name}`;

						createAutoLayout(seriesFrame, { "layoutMode": "VERTICAL", "itemSpacing": 8 })
						seriesFrame.x = child.x;
						seriesFrame.y = child.y;

						// add the title to the series frame
						seriesFrame.appendChild(child.children[1]);

						// create a frame for the viz and drop it in, at the same position
						const seriesVizFrame = createFrame("Viz", child.children[0].width, child.children[0].height, child.children[0].x, child.children[0].y);

						// move the viz into the frame
						seriesVizFrame.appendChild(child.children[0]);
						seriesVizFrame.children[0].x = 0;
						seriesVizFrame.children[0].y = 0;

						// find data layer and clean it up
						const dataLayer = seriesVizFrame.children[0].children[0].children.find(node => node.name === "viz");
						if (dataLayer) {
							cleanDataLayer(dataLayer, chartType);
						}

						// find xAxis and yAxis, then clean them up
						const xAxis = seriesVizFrame.children[0].children[0].children.find(node => node.name === "axis").children[0];
						const yAxis = seriesVizFrame.children[0].children[0].children.find(node => node.name === "axis").children[1];

						seriesVizFrame.children[0].children[0].children.find(node => node.name === "axis").name = "Axes";

						if (xAxis) cleanAxes(xAxis, "X");
						if (yAxis) cleanAxes(yAxis, "Y");

						// move everything back up
						seriesVizFrame.children[0].children[0].children.forEach(child => seriesVizFrame.appendChild(child));

						seriesFrame.appendChild(seriesVizFrame);
						vizFrame.appendChild(seriesFrame);
					});
				}
			} else if (chartType === "barSeries") {
				await removeOne(viz, "grid");

				vizFrame.appendChild(viz);

				// find all small multiples
				const series = vizFrame.findOne(node => node.name === "viz").children;

				if (series.length > 0) {
					series.forEach(child => {
						// turn each into an autolayout
						const seriesFrame = figma.createFrame();
						seriesFrame.name = `Series - ${child.name}`;

						createAutoLayout(seriesFrame, { "layoutMode": "VERTICAL", "itemSpacing": 8 })
						seriesFrame.x = child.x;
						seriesFrame.y = child.y;

						// add the title to the series frame
						seriesFrame.appendChild(child.children[1]);

						// create a frame for the viz and drop it in, at the same position
						const seriesVizFrame = createFrame("Viz", child.children[0].width, child.children[0].height, child.children[0].x, child.children[0].y);

						// move the viz into the frame
						seriesVizFrame.appendChild(child.children[0]);
						seriesVizFrame.children[0].x = 0;
						seriesVizFrame.children[0].y = 0;

						// find data layer and clean it up
						const dataLayer = seriesVizFrame.children[0].children.find(node => node.name === "Group");
						if (dataLayer) {
							cleanDataLayer(dataLayer, chartType);
						}

						// find xAxis and yAxis, then clean them up
						const xAxis = seriesVizFrame.children[0].children.find(node => node.name === "xAxis");
						const yAxis = seriesVizFrame.children[0].children.find(node => node.name === "yAxis");

						if (xAxis) cleanAxes(xAxis, "X");
						if (yAxis) cleanAxes(yAxis, "Y");

						// move everything back up
						seriesVizFrame.children[0].children.forEach(child => seriesVizFrame.appendChild(child));

						seriesFrame.appendChild(seriesVizFrame);
						vizFrame.appendChild(seriesFrame);
					})
				}
			}

			// resize viz frame to fit content
			await resizeToFit(vizFrame, chartType);

			// select all text nodes and set them to auto resize
			await resizeTextBoxes(vizFrame);

			chart.appendChild(vizFrame);
		}
	}

	figma.currentPage.selection = [chart];
	figma.viewport.scrollAndZoomIntoView([chart]);
}

// when selection changes, update the selection variable and send it to the UI
figma.on('selectionchange', () => {
	currentSelection = figma.currentPage.selection;
	isFrame = currentSelection[0] && currentSelection[0].type === "FRAME";

	figma.ui.postMessage({ type: 'selectionChanged', currentSelection: currentSelection, isFrame: isFrame });
});

const startUI = async () => {
	figma.showUI(__html__, { themeColors: true, width: 500, height: 300 });

	figma.ui.onmessage = async message => {
		switch (message.type) {
			case 'init': {
				figma.ui.postMessage({ type: 'load', currentSelection: currentSelection, isFrame: isFrame });
				break;
			}

			case 'cleanChart': {
				chartType = message.chartType;

				switch (chartType) {
					case 'bar': {
						await cleanChart();
						break;
					}

					case 'line': {
						await cleanChart();
						break;
					}

					case 'lineSeries': {
						await cleanChart();
						break;
					}

					case 'barSeries': {
						await cleanChart();
						break;
					}

				}

				figma.closePlugin();
				break;
			};
		};
	};
}

startUI();