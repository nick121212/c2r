import "reflect-metadata";
import chalk from "chalk";
import fs from "fs-extra";

import create from "./create";

export default async (configPath: string) => {
	try {
		const config = fs.readJSONSync(configPath);

		if (!config.products) {
			return;
		}

		while (config.products.length) {
			const p = config.products.pop();

			await create(p.source || "RAP", {
				path: p.path,
				nameSpace: p.nameSpace,
				productId: p.productId,
				config: p.config,
				rapPath: p.rapPath || config.rapPath,
				mpPath: config.mpPath
			}).then((d) => {
				console.log(d);
			});
		}

	} catch (e) {
		console.error(chalk.redBright(e));

		process.exit();
	}
}