export default async (frame, options) => {
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
}