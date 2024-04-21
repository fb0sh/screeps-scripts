const utils = require("utils");
const flag = require("flag");
const role_harvester = require("role.harvester");
const role_upgrader = require("role.upgrader");
const role_builder = require("role.builder");

const need_mine = false;
const need_upgrade = true;
const need_build = true;

module.exports.loop = () => {
  utils.clear_creeps();

  utils.watch_spawn("s1", "harvester", 0, [WORK, MOVE, CARRY]);
  utils.watch_spawn("s1", "builder", 0, [WORK, MOVE, MOVE, CARRY]);
  utils.watch_spawn("s1", "upgrader", 24, [WORK, MOVE, MOVE, CARRY, CARRY]);

  let harvesters = utils.get_creeps("s1", "harvester");
  let builders = utils.get_creeps("s1", "builder");
  let upgraders = utils.get_creeps("s1", "upgrader");

  if (need_mine) {
    flag.run(
      harvesters,
      [
        [4, ["es1"]],
        [3, ["es2"]],
      ],
      role_harvester.harvester_flag_run
    );
  }

  if (need_upgrade) {
    flag.run(
      upgraders,
      [
        [3, ["es1", "c1"]],
        [4, ["es2", "c1"]],
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

  //   utils.transAll(harvesters, "upgrader");
  //   utils.transAll(builders, "upgrader");
  //   utils.transFulled(harvesters, "builder");
  //   utils.transPart(upgraders, "harvester", 2);
  //   utils.transFree(harvesters, "builder");

  console.log(
    `total_energy: ${utils.get_room_energy("s1")} | harvesters: ${
      harvesters.length
    } | upgrader: ${upgraders.length} | builder: ${
      builders.length
    } | flags: ${flag.get_flags()}`
  );
};
