export default async (frame, name) => {
    const node = frame.findOne(node => node.name === name);
    if (node) node.remove();
}