export default async () => {
    await figma.loadFontAsync({ family: "Inter", style: "Regular" });
	await figma.loadFontAsync({ family: "Inter", style: "Bold" });
	await figma.loadFontAsync({ family: "Arial", style: "Bold" });
}