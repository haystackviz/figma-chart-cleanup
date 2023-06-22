export default async (chart, backgroundName) => {
    const background = chart.findOne(node => node.name === backgroundName); // yes, there's a typo in rawgraphs exports
	if (background) {
		chart.backgrounds = background.fills;
		background.remove();
	}
}