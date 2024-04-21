const utils = require("utils");
const flag = require("flag");
const role_harvester = require("role.harvester");
const role_upgrader = require("role.upgrader");
const role_builder = require("role.builder");

function run() {
  const SPAWN_NAME = "s1";
  const need_harvest = true;
  const need_upgrade = false;
  const need_build = true;
  utils.watch_spawn(SPAWN_NAME, "harvester", 8, [WORK, MOVE, CARRY]);
  utils.watch_spawn(SPAWN_NAME, "builder", 20, [WORK, MOVE, MOVE, CARRY]);
  utils.watch_spawn(SPAWN_NAME, "upgrader", 0, [
    WORK,
    MOVE,
    MOVE,
    CARRY,
    CARRY,
  ]);

  let harvesters = utils.get_creeps(SPAWN_NAME, "harvester");
  let builders = utils.get_creeps(SPAWN_NAME, "builder");
  let upgraders = utils.get_creeps(SPAWN_NAME, "upgrader");

  if (need_harvest) {
    flag.run(
      harvesters,
      [
        [3, ["es3"]],
        [5, ["es6"]],
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
    // utils.moveToFlag(builders, "c1");
    role_builder.run(builders);
  }

  //   utils.transAll(harvesters, "upgrader");
  // utils.transAll(upgraders, "builder");
  //   utils.transFulled(harvesters, "builder");
  //   utils.transPart(upgraders, "harvester", 2);
  //   utils.transFree(harvesters, "builder");

  console.log(
    `(${SPAWN_NAME}) total_energy: ${utils.get_room_energy(
      SPAWN_NAME
    )} | harvesters: ${harvesters.length} | upgrader: ${
      upgraders.length
    } | builder: ${builders.length} | flags: ${flag.get_flags()}`
  );
}

module.exports.run = run;
