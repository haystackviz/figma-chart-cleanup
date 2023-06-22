'use strict';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

var cloneChart = async (currentSelection, chartType) => {
    // clone the selected node and place it 80px to the right
	const chart = currentSelection[0].clone();
	chart.x = currentSelection[0].x + currentSelection[0].width + 80;
	chart.name = `Cleaned ${chartType} chart`;

	return chart;
};

var createAutoLayout = async (frame, options) => {
    let layoutMode = "HORIZONTAL", counterAlign = "MIN", itemSpacing = 4;

	if (options) {
		if (options.layoutMode) layoutMode = options.layoutMode;
		if (options.counterAlign) counterAlign = options.counterAlign;
		if (options.itemSpacing) itemSpacing = options.itemSpacing;
	}

	frame.layoutMode = layoutMode;
	frame.counterAxisSizingMode = "AUTO";
	frame.primaryAxisSizingMode = "AUTO";
	frame.counterAxisAlignItems = counterAlign;
	frame.itemSpacing = itemSpacing;
	frame.fills = [];
	frame.clipsContent = false;
};

var createFrame = (name, w, h, x, y) => {
    const frame = figma.createFrame();

    frame.name = name;
    frame.x = x;
    frame.y = y;
    frame.resize(w, h);
    frame.clipsContent = false;
    frame.fills = [];

    return frame;
};

var loadFonts = async () => {
    await figma.loadFontAsync({ family: "Inter", style: "Regular" });
	await figma.loadFontAsync({ family: "Inter", style: "Bold" });
	await figma.loadFontAsync({ family: "Arial", style: "Bold" });
};

var remove100x100 = async (children) => {
    children.forEach(child => {
				if ((child.width === 100 && child.height === 100) || child.visible === false) {
					child.remove();
				} else {
					if (child.children) {
						child.children.forEach(child => {
							if ((child.width === 100 && child.height === 100) || child.visible === false) {
								child.remove();
							} else {
								if (child.children) {
									child.children.forEach(child => {
										if ((child.width === 100 && child.height === 100) || child.visible === false) {
											child.remove();
										}
									});
								}
							}
						});
					}
				}
			});
};

var removeAll = async (frame, name) => {
    const nodes = frame.findAll(node => node.name === name);
    if (nodes.length > 0) {
        nodes.forEach(node => node.remove());
    }
};

var removeEmptyText = async (frame) => {
    const nodes = frame.findAll(node => node.type === "TEXT" && node.characters === "");
    if (nodes.length > 0) {
        nodes.forEach(node => node.remove());
    }
};

var removeOne = async (frame, name) => {
    const node = frame.findOne(node => node.name === name);
    if (node) node.remove();
};

var resizeTextBoxes = async (vizFrame) => {
    const textNodes = vizFrame.findAll(node => node.type === "TEXT");
    if (textNodes.length > 0) {
        textNodes.forEach(textNode => {
            textNode.textAutoResize = "WIDTH_AND_HEIGHT";
        });
    }
};

var resizeToFit = async (vizFrame, chartType) => {
    if (chartType === "bar" || chartType === "lineSeries" || "barSeries") figma.group(vizFrame.children, vizFrame);
    vizFrame.children[0].x = 0;
    vizFrame.children[0].y = 0;
    vizFrame.resize(vizFrame.children[0].width, vizFrame.children[0].height);
    vizFrame.children[0].children.forEach(child => vizFrame.appendChild(child));
};

var cleanAxes = async (axisNode, axisDirection) => {
    axisNode.name = `${axisDirection} Axis`;

    // baseline
    const baseline = axisNode.findOne(node => node.type === "VECTOR" && (axisDirection === "X" ? node.width > 0 : node.height > 0));
    if (baseline) {
        baseline.name = "Baseline";
        if (axisDirection === "X") baseline.resize(baseline.width, 0.00001);
        else {
            baseline.resize(0.00001, baseline.height);
            baseline.x = baseline.x + baseline.width;
        }
        axisNode.appendChild(baseline);
    }

    // labels
    const labels = axisNode.findAll(node => node.type === "TEXT");
    if (labels.length > 0) {
        labels.forEach(label => label.textAlignVertical = "CENTER");
        const labelsGroup = figma.group(labels, axisNode);
        labelsGroup.name = "Labels";
    }

    // ticks
    const ticks = axisNode.findAll(node => node.type === "VECTOR" && (axisDirection === "X" ? node.width === 0 : node.height === 0));
    if (ticks.length > 0) {
        ticks.forEach(tick => tick.name = "Tick");
        const ticksGroup = figma.group(ticks, axisNode);
        ticksGroup.name = "Ticks";
    }

    // axis title
    const axisTitle = axisNode.findOne(node => node.type === "TEXT" && node.fontName.family === "Arial" && node.fontName.style === "Bold" && node.fontSize === 12);
    if (axisTitle) {
        axisNode.appendChild(axisTitle);
    }
};

var cleanBackground = async (chart, backgroundName) => {
    const background = chart.findOne(node => node.name === backgroundName); // yes, there's a typo in rawgraphs exports
	if (background) {
		chart.backgrounds = background.fills;
		background.remove();
	}
};

var cleanDataLayer = async (dataNode, chartType) => {
    dataNode.name = "Data";

    if (chartType === 'bar') {
        dataNode.children.forEach(dataNode => {
            dataNode.name = dataNode.name.replace("undefined - ", "");
            dataNode.name = dataNode.name.replace("undefined", "");
        });
    }

    if (chartType === "line" || chartType === "lineSeries") {
        dataNode.children.forEach(child => {
            const dots = child.findOne(node => node.name === "Group");
            if (dots) dots.name = "Dots";
        });
    }
};

var cleanLegend = async (legend) => {
    const legendFrame = figma.createFrame();
	legendFrame.name = "Legend";

	await createAutoLayout(legendFrame, { "layoutMode": "VERTICAL" });
	legendFrame.x = legend.x;
	legendFrame.y = legend.y;

	let legendTitle = legend.children[0].children[0].children[1],
		legendItems = legend.children[0].children[0].children[0].children;

	legendFrame.appendChild(legendTitle);

	legendItems.forEach(item => {
		const legendItemFrame = figma.createFrame();
		legendItemFrame.name = "Item";

		createAutoLayout(legendItemFrame, { "counterAlign": "CENTER" });
		legendItemFrame.x = item.x;
		legendItemFrame.y = item.y;

		item.findOne(node => node.name === "Vector").name = "Swatch";

		item.children.forEach(child => {
			legendItemFrame.appendChild(child);
		});

		legendFrame.appendChild(legendItemFrame);
	});

	return legendFrame;
};

let chartType, currentSelection = figma.currentPage.selection, isFrame = currentSelection[0] && currentSelection[0].type === "FRAME";
const cleanChart = () => __awaiter(void 0, void 0, void 0, function* () {
    // load fonts, just in case
    yield loadFonts();
    // clone chart, leaving the original as is
    const chart = yield cloneChart(currentSelection, chartType);
    if (chart.type === "FRAME") {
        // turn the chart into an autolayout. trust me, it'll be dope
        yield createAutoLayout(chart, { "itemSpacing": 32 });
        chart.paddingTop = 32;
        chart.paddingRight = 32;
        chart.paddingBottom = 32;
        chart.paddingLeft = 32;
        // set background of frame and remove background rectangle
        yield cleanBackground(chart, "backgorund"); // yep. "backgorund".
        // check if there's a node called "legend", then redo it as an autolayout
        const legend = chart.findOne(node => node.name === "legend");
        if (legend) {
            const legendFrame = yield cleanLegend(legend);
            chart.appendChild(legendFrame);
        }
        // check if there's a node called "viz", then work some magic
        const viz = chart.findOne(node => node.name === "viz");
        if (viz) {
            const vizFrame = createFrame("Viz", viz.width, viz.height, viz.x, viz.y);
            yield remove100x100(viz.children);
            if (chartType === "bar") {
                // find data layer and clean it up
                const dataLayer = viz.children[0].children[0].findOne(node => node.name === "Group");
                if (dataLayer) {
                    vizFrame.appendChild(dataLayer);
                    yield cleanDataLayer(dataLayer, chartType);
                }
                // find xAxis and yAxis, then clean them up
                const xAxis = viz.findOne(node => node.name === "xAxis");
                const yAxis = viz.findOne(node => node.name === "yAxis");
                if (xAxis) {
                    vizFrame.appendChild(xAxis);
                    yield cleanAxes(xAxis, "X");
                }
                if (yAxis) {
                    vizFrame.appendChild(yAxis);
                    yield cleanAxes(yAxis, "Y");
                }
            }
            else if (chartType === "line") {
                yield removeOne(viz, "grid");
                yield removeOne(viz, "serieClipPath");
                yield removeEmptyText(viz);
                const chartContent = viz.children[0].children[0].children[0].children;
                if (chartContent.length > 0) {
                    figma.group(chartContent, vizFrame);
                    // find data layer and clean it up
                    const dataLayer = chartContent.find(node => node.name === "viz");
                    if (dataLayer) {
                        yield cleanDataLayer(dataLayer, chartType);
                    }
                    // find xAxis and yAxis, then clean them up
                    const xAxis = chartContent.find(node => node.name === "axis").children[0];
                    const yAxis = chartContent.find(node => node.name === "axis").children[1];
                    chartContent.find(node => node.name === "axis").name = "Axes";
                    if (xAxis)
                        yield cleanAxes(xAxis, "X");
                    if (yAxis)
                        yield cleanAxes(yAxis, "Y");
                }
            }
            else if (chartType === "lineSeries") {
                yield removeOne(viz, "grid");
                yield removeAll(viz, "serieClipPath");
                vizFrame.appendChild(viz);
                // find all small multiples
                const series = vizFrame.children[0].children;
                if (series.length > 0) {
                    series.forEach(child => {
                        // turn each into an autolayout
                        const seriesFrame = figma.createFrame();
                        seriesFrame.name = `Series - ${child.name}`;
                        createAutoLayout(seriesFrame, { "layoutMode": "VERTICAL", "itemSpacing": 8 });
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
                        if (xAxis)
                            cleanAxes(xAxis, "X");
                        if (yAxis)
                            cleanAxes(yAxis, "Y");
                        // move everything back up
                        seriesVizFrame.children[0].children[0].children.forEach(child => seriesVizFrame.appendChild(child));
                        seriesFrame.appendChild(seriesVizFrame);
                        vizFrame.appendChild(seriesFrame);
                    });
                }
            }
            else if (chartType === "barSeries") {
                yield removeOne(viz, "grid");
                vizFrame.appendChild(viz);
                // find all small multiples
                const series = vizFrame.findOne(node => node.name === "viz").children;
                if (series.length > 0) {
                    series.forEach(child => {
                        // turn each into an autolayout
                        const seriesFrame = figma.createFrame();
                        seriesFrame.name = `Series - ${child.name}`;
                        createAutoLayout(seriesFrame, { "layoutMode": "VERTICAL", "itemSpacing": 8 });
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
                        if (xAxis)
                            cleanAxes(xAxis, "X");
                        if (yAxis)
                            cleanAxes(yAxis, "Y");
                        // move everything back up
                        seriesVizFrame.children[0].children.forEach(child => seriesVizFrame.appendChild(child));
                        seriesFrame.appendChild(seriesVizFrame);
                        vizFrame.appendChild(seriesFrame);
                    });
                }
            }
            // resize viz frame to fit content
            yield resizeToFit(vizFrame, chartType);
            // select all text nodes and set them to auto resize
            yield resizeTextBoxes(vizFrame);
            chart.appendChild(vizFrame);
        }
    }
    figma.currentPage.selection = [chart];
    figma.viewport.scrollAndZoomIntoView([chart]);
});
// when selection changes, update the selection variable and send it to the UI
figma.on('selectionchange', () => {
    currentSelection = figma.currentPage.selection;
    isFrame = currentSelection[0] && currentSelection[0].type === "FRAME";
    figma.ui.postMessage({ type: 'selectionChanged', currentSelection: currentSelection, isFrame: isFrame });
});
const startUI = () => __awaiter(void 0, void 0, void 0, function* () {
    figma.showUI(__html__, { themeColors: true, width: 500, height: 300 });
    figma.ui.onmessage = (message) => __awaiter(void 0, void 0, void 0, function* () {
        switch (message.type) {
            case 'init': {
                figma.ui.postMessage({ type: 'load', currentSelection: currentSelection, isFrame: isFrame });
                break;
            }
            case 'cleanChart':
                {
                    chartType = message.chartType;
                    switch (chartType) {
                        case 'bar': {
                            yield cleanChart();
                            break;
                        }
                        case 'line': {
                            yield cleanChart();
                            break;
                        }
                        case 'lineSeries': {
                            yield cleanChart();
                            break;
                        }
                        case 'barSeries': {
                            yield cleanChart();
                            break;
                        }
                    }
                    figma.closePlugin();
                    break;
                }
        }
    });
});
startUI();
