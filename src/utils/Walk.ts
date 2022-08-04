import * as fs from "fs";
import path from "path";

const walk = (dir: string) => {

	const paths: string[] = [];

	const run = (dir: string) => {
		fs.readdirSync(dir).forEach(file => {
			const filePath = path.join(dir, file);
			const fileStat = fs.statSync(filePath);

			if (fileStat.isDirectory()) {
				run(filePath);
			} else {
				paths.push(filePath);
			}
		});
	};

	run(dir);
	return paths;
};

export default walk;