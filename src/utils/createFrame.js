export default (name, w, h, x, y) => {
    const frame = figma.createFrame();

    frame.name = name;
    frame.x = x;
    frame.y = y;
    frame.resize(w, h);
    frame.clipsContent = false;
    frame.fills = [];

    return frame;
}