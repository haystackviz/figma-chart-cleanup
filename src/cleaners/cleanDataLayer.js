export default async (dataNode, chartType) => {
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
}