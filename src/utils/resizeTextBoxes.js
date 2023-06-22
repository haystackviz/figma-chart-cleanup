export default async (vizFrame) => {
    const textNodes = vizFrame.findAll(node => node.type === "TEXT");
    if (textNodes.length > 0) {
        textNodes.forEach(textNode => {
            textNode.textAutoResize = "WIDTH_AND_HEIGHT";
        });
    }
}