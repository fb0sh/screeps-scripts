const utils = require("utils");
const flag = require("flag");
const role_miner = require("role.miner");
const role_upgrader = require("role.upgrader");
const role_builder = require("role.builder");

module.exports.loop = () => {
  utils.clear_creeps();

  utils.watch_spawn("s1", "miner", 5, [WORK, MOVE, CARRY, CARRY]);
  utils.watch_spawn("s1", "upgrader", 10, [WORK, MOVE, MOVE, CARRY]);
  utils.watch_spawn("s1", "builder", 3, [WORK, MOVE, MOVE, CARRY]);

  let miners = utils.get_creeps("miner");
  flag.run(
    miners,
    [
      [2, ["es1"]],
      [3, ["es2"]],
    ],
    role_miner.miner_flag_run
  );

  let upgraders = utils.get_creeps("upgrader");
  flag.run(
    upgraders,
    [
      [2, ["es3", "c1"]],
      [4, ["es6", "c1"]],
      [4, ["es4", "c1"]],
      [2, ["es5", "c1"]],
    ],
    role_upgrader.upgrader_flag_run
  );

  let builders = utils.get_creeps("builder");
  role_builder.run(builders);
  //   utils.transAll(miners, "builder");
  console.log(
    `miners: ${miners.length} | upgrader: ${upgraders.length} | builder: ${builders.length}`
  );
};
