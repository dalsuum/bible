/**

 * Bible
 * @param {any} req
 * @example
 * node run cite
 * node run cite test
 * node run cite task
 */
export default async function main(req) {
  switch (req.params.task) {
    case "test":
      return (await import("./test.js")).default(req);
    case "task":
      return (await import("./task.js")).default(req);
    case "search":
      return (await import("./search.js")).default(req);
    default:
      return noTask(req);
  }
}

/**
 * @param {any} req
 */
function noTask(req) {
  if (req.params.task) {
    return `Wow has no such task '${req.params.task}' name!`;
  }
  return `Provide a task name for Wow!`;
}

/**
 * @param {any} req
 */
function noName(req) {
  return `What to ${req.params.task} from ${req.params.name} of Wow?`;
}
