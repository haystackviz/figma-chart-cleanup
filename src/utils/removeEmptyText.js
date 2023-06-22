export default async (frame) => {
    const nodes = frame.findAll(node => node.type === "TEXT" && node.characters === "");
    if (nodes.length > 0) {
        nodes.forEach(node => node.remove());
    }
}