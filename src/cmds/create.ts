import "reflect-metadata";
import fs from "fs-extra";
import chalk from "chalk";
import inquirer from "inquirer";
import nodePath from "path";

import {container} from "../container";
import {ModelProxy} from "modelproxy";
import {generate} from "../sources/generate";
import template from "art-template";
import {BaseSource} from "../sources/base";

export interface CreateModel {
	productId: number;
	nameSpace: string;
	path: string;
	config: string;
	rapPath: string;
	mpPath: string;
}

export default async (source: string, info: CreateModel) => {
	const sourceInContainer: BaseSource = container.get(source.toUpperCase());

	if (!sourceInContainer) {
		throw new Error("没有发现对应的源！");
	}

	const {productId, nameSpace, path, config, rapPath, mpPath} = info;
	const finalPath = (ext: string) => nodePath.join(path, `${nameSpace}.${ext}`);

	console.log(chalk.cyanBright("开始处理..."));

	try {
		const exists = fs.pathExistsSync(finalPath("ts"));

		// 判断路径是否存在
		if (exists) {
			const {conf} = await inquirer.prompt([{
				name: 'conf',
				type: 'confirm',
				default: true,
				message: '已经存在目录，是否清空目录下的所有文件？',
			}]);

			if (!conf) {
				throw new Error("用户放弃操作！");
			}
		}

		fs.mkdirSync(path, {
			recursive: true
		});

		let mpConfig = {};

		try {
			if (config) {
				mpConfig = JSON.parse(config);

			}
		} catch (e) {
			throw e;
		}

		const d = await sourceInContainer.analysis(rapPath, productId, mpConfig);
		const api = await generate(nameSpace, new ModelProxy().loadConfig(d));

		fs.writeFileSync(finalPath("d.ts"), api);
		fs.writeFileSync(finalPath("json"), JSON.stringify(d));
		fs.writeFileSync(finalPath("ts"), template(`${__dirname}/../../temps/index.ts.art`, {
			mpPath: mpPath,
			key: nameSpace
		}));

		return chalk.cyanBright(nameSpace, "处理完成");
	} catch (e) {
		console.error(chalk.redBright(e));

		process.exit();
	}
}