figma.showUI(__html__, { themeColors: true, width: 500, height: 300 });

let data,
	bars,
	size,
	width,
	leftMargin,
	ticks,
	showXAxis,
	showHeader,
	showValues;

// define colours: black, white, gray, blue
const black = [
	{ type: 'SOLID', color: { r: 0, g: 0, b: 0 } }
];
const white = [
	{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }
];
const gray = [
	{ type: 'SOLID', color: { r: 0.5, g: 0.5, b: 0.5 } }
];
const blue = [
	{ type: 'SOLID', color: { r: 0, g: 0.5, b: 1 } }
];

let chartPadding = {
	top: 24,
	right: 24,
	bottom: 24,
	left: 24
}, chartSpacing = 24,
	headerSpacing = 8;

let titleSize = 24,
	subtitleSize = 16,
	labelSize = 16,
	valueSize = 14;

let rowSpacing = 8;

let barHeight = 32,
	barContainerPadding = {
		top: 8,
		bottom: 8
	},
	barPadding = {
		top: 4,
		right: 8,
		bottom: 4,
		left: 8
	};

const drawChart = async () => {
	await figma.loadFontAsync({ family: "Inter", style: "Regular" });
	await figma.loadFontAsync({ family: "Inter", style: "Bold" });

	// get the max value in the data
	const max = Math.max(...data.map(d => d[size]));

	// create new nodes
	const nodes: SceneNode[] = [];
	const chart = figma.createFrame();
	chart.name = 'Chart';

	// resize chart node using specified width
	chart.resizeWithoutConstraints(width, 300);

	// set to autolayout with spacing and padding
	chart.layoutMode = 'VERTICAL';
	chart.itemSpacing = chartSpacing;
	chart.paddingTop = chartPadding.top;
	chart.paddingRight = chartPadding.right;
	chart.paddingBottom = chartPadding.bottom;
	chart.paddingLeft = chartPadding.left;

	// set y to 0 and x to the right of the furthest existing node
	chart.x = figma.currentPage.selection.length > 0 ? figma.currentPage.selection[figma.currentPage.selection.length - 1].x + figma.currentPage.selection[figma.currentPage.selection.length - 1].width + 80 : 0;

	// if showHeader, create an autolayout header frame, full width, with a title in bold + black at 24px and a subtitle in gray at 16px, fill them with lorem ipsum
	if (showHeader) {
		const header = figma.createFrame();
		header.name = 'Header';
		header.layoutMode = 'VERTICAL';
		header.layoutAlign = 'STRETCH';
		header.itemSpacing = headerSpacing;

		const title = figma.createText();
		title.name = 'Title';
		title.characters = 'Lorem ipsum dolor sit amet';
		title.fontSize = titleSize;
		title.fontName = { family: 'Inter', style: 'Bold' };
		title.layoutAlign = 'STRETCH';
		title.fills = black;

		const subtitle = figma.createText();
		subtitle.name = 'Subtitle';
		subtitle.characters = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit';
		subtitle.fontSize = subtitleSize;
		subtitle.fontName = { family: 'Inter', style: 'Regular' };
		subtitle.layoutAlign = 'STRETCH';
		subtitle.fills = gray;

		header.appendChild(title);
		header.appendChild(subtitle);
		chart.appendChild(header);
	}

	// create a frame for the viz
	const viz = figma.createFrame();
	viz.name = 'Viz';
	viz.layoutMode = 'VERTICAL';
	viz.layoutAlign = 'STRETCH';
	viz.itemSpacing = 0;
	viz.itemReverseZIndex = true;
	viz.clipsContent = false;
	viz.fills = [];

	let valueWidths = [];
	data.forEach(d => {
		let valueLabel = figma.createText();
		valueLabel.characters = d[size].toString();
		valueLabel.fontSize = valueSize;
		valueLabel.fontName = { family: 'Inter', style: 'Bold' };
		valueWidths.push(valueLabel.width);
		valueLabel.remove();
	});

	let maxValueWidth = Math.max(...valueWidths);

	// create a row for each row in the data
	for (let i = 0; i < data.length; i++) {
		const row = figma.createFrame();
		row.name = 'Row';
		row.layoutMode = 'HORIZONTAL';
		row.counterAxisAlignItems = 'CENTER';
		row.layoutAlign = 'STRETCH';
		row.primaryAxisSizingMode = 'FIXED'
		row.counterAxisSizingMode = 'AUTO';
		row.itemSpacing = rowSpacing;
		row.fills = [];
		// row.resizeWithoutConstraints(viz.width, 40);

		// create a text frame for the "bar" column
		const label = figma.createText();
		label.name = 'Label';
		label.characters = data[i][bars];
		label.fontSize = labelSize;
		label.fontName = { family: 'Inter', style: 'Regular' };
		label.fills = black;
		label.textAlignHorizontal = 'RIGHT';
		label.textAlignVertical = 'CENTER';
		label.textAutoResize = "TRUNCATE";
		label.resize(leftMargin, barHeight + barPadding.top + barPadding.bottom);

		row.appendChild(label);

		// create a frame to contain the bar and label
		const barContainer = figma.createFrame();
		barContainer.name = 'Bar Container';
		barContainer.layoutMode = 'HORIZONTAL';
		barContainer.counterAxisAlignItems = 'CENTER';
		barContainer.layoutGrow = 1;
		barContainer.primaryAxisSizingMode = 'FIXED';
		barContainer.counterAxisSizingMode = 'AUTO';
		barContainer.fills = [];

		barContainer.itemSpacing = rowSpacing;
		barContainer.paddingTop = barContainerPadding.top;
		barContainer.paddingBottom = barContainerPadding.bottom;
		barContainer.strokes = black;
		barContainer.strokeLeftWeight = 2;
		barContainer.strokeAlign = 'CENTER';

		// create a frame for the bar within barContainer, height of 32px, fill of blue, width based on the value in the data, where max is equal to the width of barContainer
		const bar = figma.createFrame();
		bar.name = 'Bar';
		bar.layoutMode = 'HORIZONTAL';
		bar.counterAxisAlignItems = 'CENTER';
		bar.primaryAxisAlignItems = 'MAX';
		bar.itemSpacing = headerSpacing;
		bar.resize((chart.width - chartPadding.right - chartPadding.left - leftMargin - rowSpacing - (showValues ? maxValueWidth + rowSpacing : 0)) * data[i][size] / max, 32);
		bar.fills = blue;
		bar.paddingTop = barPadding.top;
		bar.paddingRight = barPadding.right;
		bar.paddingBottom = barPadding.bottom;
		bar.paddingLeft = barPadding.left;

		// create a text frame for the value column, if showValue
		if (showValues) {
			const value = figma.createText();
			value.name = 'Value';
			value.characters = data[i][size].toString();
			value.fontSize = valueSize;
			value.fontName = { family: 'Inter', style: 'Bold' };
			value.fills = black;
			value.strokes = white;
			value.strokeWeight = 2;
			value.strokeJoin = 'ROUND';
			value.strokeAlign = 'OUTSIDE';
			value.textAlignHorizontal = 'CENTER';
			value.textAlignVertical = 'CENTER';

			// if width of bar is less then width of value + 8, append value to bar, else append value to barContainer
			// if (bar.width < value.width + barPadding.right + barPadding.left) {
			// 	bar.appendChild(value);
			// 	barContainer.appendChild(bar);
			// } else {
			barContainer.appendChild(bar);
			barContainer.appendChild(value);
			// }
		} else {
			barContainer.appendChild(bar);
		}

		// append barContainer to row
		row.appendChild(barContainer);

		// append row to viz
		viz.appendChild(row);
	}

	// if showXAxis, create a frame for the x axis, full width, with a label in gray at 16px, fill them with lorem ipsum
	if (showXAxis) {
		const tickFrame = figma.createFrame();
		tickFrame.name = 'Ticks';
		tickFrame.layoutMode = 'HORIZONTAL';
		tickFrame.counterAxisAlignItems = 'MIN';
		tickFrame.primaryAxisAlignItems = "SPACE_BETWEEN"
		// tickFrame.layoutAlign = 'STRETCH';
		tickFrame.primaryAxisSizingMode = 'FIXED'
		tickFrame.counterAxisSizingMode = 'AUTO';
		tickFrame.paddingLeft = leftMargin + rowSpacing;
		tickFrame.clipsContent = false;
		tickFrame.fills = [];
		tickFrame.resize((chart.width - chartPadding.right - chartPadding.left - leftMargin - rowSpacing - (showValues ? maxValueWidth + rowSpacing : 0)) * ticks[ticks.length - 1] / max + leftMargin + rowSpacing, 16);

		// create a vertical autolayout frame for each xTick, with a width of 1
		for (let i = 0; i < ticks.length; i++) {
			const tick = figma.createFrame();
			tick.name = 'Tick';
			tick.layoutMode = 'VERTICAL';
			tick.itemSpacing = 4;
			tick.primaryAxisAlignItems = 'MAX';
			tick.counterAxisAlignItems = 'CENTER';
			tick.clipsContent = false;
			tick.resize(1, 16);

			// append a line to each tick, 1px stroke in gray, with a height equal to the length of the data * 40px
			const line = figma.createLine();
			line.name = 'Line';
			line.resize(data.length * (barHeight + barContainerPadding.top + barContainerPadding.bottom), 0);
			line.rotation = 90;
			line.strokes = gray;
			line.strokeWeight = 1;
			line.strokeAlign = 'CENTER';

			tick.appendChild(line);

			// append a label to each tick, 10px in gray
			const label = figma.createText();
			label.name = 'Label';
			label.characters = ticks[i].toString();
			label.fontSize = 10;
			label.fontName = { family: 'Inter', style: 'Regular' };
			label.fills = gray;
			label.textAlignHorizontal = 'CENTER';

			tick.appendChild(label);
			tickFrame.appendChild(tick);
		}

		viz.appendChild(tickFrame);

		const axisLabelFrame = figma.createFrame();
		axisLabelFrame.name = 'Axis Label Container';
		axisLabelFrame.layoutMode = 'HORIZONTAL';
		axisLabelFrame.layoutAlign = 'STRETCH';
		axisLabelFrame.primaryAxisSizingMode = 'FIXED'
		axisLabelFrame.counterAxisSizingMode = 'AUTO';
		axisLabelFrame.primaryAxisAlignItems = 'CENTER';
		axisLabelFrame.paddingLeft = leftMargin + rowSpacing;
		axisLabelFrame.fills = [];

		const axisLabel = figma.createText();
		axisLabel.characters = size;
		axisLabel.fontSize = 12;
		axisLabel.fills = gray;
		axisLabel.fontName = { family: 'Inter', style: 'Regular' };

		axisLabelFrame.appendChild(axisLabel);
		viz.appendChild(axisLabelFrame);
	}

	// append viz to chart
	chart.appendChild(viz);

	figma.currentPage.appendChild(chart);
	nodes.push(chart);

	figma.currentPage.selection = nodes;
	figma.viewport.scrollAndZoomIntoView(nodes);
}

figma.ui.onmessage = async msg => {
	if (msg.type === 'draw') {
		data = msg.data;
		bars = msg.bars;
		size = msg.size;
		width = +msg.width;
		leftMargin = +msg.leftMargin;
		ticks = msg.ticks;
		showXAxis = msg.showXAxis;
		showHeader = msg.showHeader;
		showValues = msg.showValues;

		await drawChart();
	}

	// Make sure to close the plugin when you're done. Otherwise the plugin will
	// keep running, which shows the cancel button at the bottom of the screen.
	figma.closePlugin();
};
