import open from 'open';
import waitOn, { type WaitOnOptions } from 'wait-on';
import chalk from 'chalk';

const SECOND = 1 * 1000;
const MINUTE = 60 * SECOND;

const waitOnOptions: WaitOnOptions = {
	resources: ['http-get://localhost:8080', 'http-get://localhost:3000/health/version'],
	timeout: MINUTE,
	validateStatus: (status) => status === 200,
	headers: { accept: 'text/html' },
};

console.log(chalk.blueBright('Waiting services to be ready and open in browser...'));

try {
	await waitOn(waitOnOptions);
	await open('http://localhost:8080');
} catch (error) {
	console.error(chalk.bold.redBright('Failed to open services in browser', JSON.stringify(error, null, 2)));

	process.exit(1);
}

console.log(chalk.bold.greenBright('Successfully opened portal'));
