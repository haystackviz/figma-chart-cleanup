export default async (vizFrame, chartType) => {
    if (chartType === "bar" || chartType === "lineSeries" || "barSeries") figma.group(vizFrame.children, vizFrame);
    vizFrame.children[0].x = 0;
    vizFrame.children[0].y = 0;
    vizFrame.resize(vizFrame.children[0].width, vizFrame.children[0].height);
    vizFrame.children[0].children.forEach(child => vizFrame.appendChild(child));
}