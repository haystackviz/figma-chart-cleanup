export default async (currentSelection, chartType) => {
    // clone the selected node and place it 80px to the right
	const chart = currentSelection[0].clone();
	chart.x = currentSelection[0].x + currentSelection[0].width + 80;
	chart.name = `Cleaned ${chartType} chart`;

	return chart;
}