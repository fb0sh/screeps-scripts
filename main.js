const utils = require("utils");
const flag = require("flag");
const role_miner = require("role.miner");
const role_upgrader = require("role.upgrader");
const role_builder = require("role.builder");

const need_mine = true;
const need_upgrade = true;
const need_build = true;

module.exports.loop = () => {
  utils.clear_creeps();

  utils.watch_spawn("s1", "miner", 7, [WORK, MOVE, CARRY]);
  utils.watch_spawn("s1", "builder", 0, [WORK, MOVE, MOVE, CARRY]);
  utils.watch_spawn("s1", "upgrader", 24, [WORK, MOVE, MOVE, CARRY, CARRY]);

  let miners = utils.get_creeps("s1", "miner");
  let builders = utils.get_creeps("s1", "builder");
  let upgraders = utils.get_creeps("s1", "upgrader");

  if (need_mine) {
    flag.run(
      miners,
      [
        [4, ["es1"]],
        [3, ["es2"]],
      ],
      role_miner.miner_flag_run
    );
  }

  if (need_upgrade) {
    flag.run(
      upgraders,
      [
        [2, ["es3", "c1"]],
        [4, ["es4", "c1"]],
        [4, ["es5", "c1"]],
        [4, ["es6", "c1"]],
        [5, ["es7", "c1"]],
        [5, ["es8", "c1"]],
      ],
      role_upgrader.upgrader_flag_run
    );
  }
  if (need_build) {
    role_builder.run(builders);
  }

  //   utils.transAll(builders, "upgrader");
  //   utils.transFulled(miners, "builder");
  //   utils.transPart(upgraders, "miner", 2);
  console.log(
    `total_energy: ${utils.get_room_energy("s1")} | miners: ${
      miners.length
    } | upgrader: ${upgraders.length} | builder: ${
      builders.length
    } | flags: ${flag.get_flags()}`
  );
};
