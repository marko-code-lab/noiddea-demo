import { Cron } from "croner";
import { HTTPError } from "h3";
import { scheduledTasks, tasks } from "#nitro/virtual/tasks";
/** @experimental */
export function defineTask(def) {
	if (typeof def.run !== "function") {
		def.run = () => {
			throw new TypeError("Task must implement a `run` method!");
		};
	}
	return def;
}
const __runningTasks__ = {};
/** @experimental */
export async function runTask(name, { payload = {}, context = {} } = {}) {
	if (__runningTasks__[name]) {
		return __runningTasks__[name];
	}
	if (!(name in tasks)) {
		throw new HTTPError({
			message: `Task \`${name}\` is not available!`,
			status: 404
		});
	}
	if (!tasks[name].resolve) {
		throw new HTTPError({
			message: `Task \`${name}\` is not implemented!`,
			status: 501
		});
	}
	const handler = await tasks[name].resolve();
	const taskEvent = {
		name,
		payload,
		context
	};
	__runningTasks__[name] = handler.run(taskEvent);
	try {
		const res = await __runningTasks__[name];
		return res;
	} finally {
		delete __runningTasks__[name];
	}
}
/** @experimental */
export function startScheduleRunner() {
	if (!scheduledTasks || scheduledTasks.length === 0 || process.env.TEST) {
		return;
	}
	const payload = { scheduledTime: Date.now() };
	for (const schedule of scheduledTasks) {
		new Cron(schedule.cron, async () => {
			await Promise.all(schedule.tasks.map((name) => runTask(name, {
				payload,
				context: {}
			}).catch((error) => {
				console.error(`Error while running scheduled task "${name}"`, error);
			})));
		});
	}
}
/** @experimental */
export function getCronTasks(cron) {
	return (scheduledTasks || []).find((task) => task.cron === cron)?.tasks || [];
}
/** @experimental */
export function runCronTasks(cron, ctx) {
	return Promise.all(getCronTasks(cron).map((name) => runTask(name, ctx)));
}
