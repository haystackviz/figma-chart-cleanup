export default async (frame, name) => {
    const nodes = frame.findAll(node => node.name === name);
    if (nodes.length > 0) {
        nodes.forEach(node => node.remove());
    }
}