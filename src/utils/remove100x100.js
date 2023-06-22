export default async (children) => {
    children.forEach(child => {
				if ((child.width === 100 && child.height === 100) || child.visible === false) {
					child.remove();
				} else {
					if (child.children) {
						child.children.forEach(child => {
							if ((child.width === 100 && child.height === 100) || child.visible === false) {
								child.remove();
							} else {
								if (child.children) {
									child.children.forEach(child => {
										if ((child.width === 100 && child.height === 100) || child.visible === false) {
											child.remove();
										}
									});
								}
							}
						});
					}
				}
			});
}