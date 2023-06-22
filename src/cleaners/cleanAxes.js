export default async (axisNode, axisDirection) => {
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
}