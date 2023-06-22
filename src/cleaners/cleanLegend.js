import createAutoLayout from "../utils/createAutoLayout.js";

export default async (legend) => {
    const legendFrame = figma.createFrame();
	legendFrame.name = "Legend";

	await createAutoLayout(legendFrame, { "layoutMode": "VERTICAL" })
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
}