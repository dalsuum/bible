/**
 * Pools
 * @param {any} req
 * @example
 * node run pool lot
 * node run pool Ej
 * node run pool Vk
 * node run pool test
 *
 * node run task wbc scan
 * node run task lang generate
 * node run task see
 * node run task see khualtawng
 * node run task pools test

 */
export default async function main(req) {
  switch (req.params.task) {
    case "lot":
      return await doLot().then((e) => e.doDefault(req));
    case "Ej":
      return await doLot().then((e) => e.doEj(req));
    case "Vk":
      return await doLot().then((e) => e.doVk(req));
    case "test":
      return (await import("./test.js")).doDefault(req);
    default:
      return noTask(req);
  }
}

/**
 * @param {string} [name]
 */
async function doLot() {
  return await import("./lot.js");
}

/**
 * @param {any} req
 */
function noTask(req) {
  if (req.params.task) {
    return `Pool has no such task '${req.params.task}' name!`;
  }
  return `Provide a task name for Pool!`;
}
