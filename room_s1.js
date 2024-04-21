const utils = require("utils");
const flag = require("flag");
const role_harvester = require("role.harvester");
const role_upgrader = require("role.upgrader");
const role_builder = require("role.builder");

function run() {
  const SPAWN_NAME = "s1";
  const need_harvest = true;
  const need_upgrade = true;
  const need_build = true;

  utils.watch_spawn(SPAWN_NAME, "harvester", 5, [WORK, MOVE, CARRY]);
  utils.watch_spawn(SPAWN_NAME, "builder", 20, [WORK, MOVE, CARRY]);
  utils.watch_spawn(SPAWN_NAME, "upgrader", 20, [WORK, MOVE, CARRY]);

  let harvesters = utils.get_creeps(SPAWN_NAME, "harvester");
  let builders = utils.get_creeps(SPAWN_NAME, "builder");
  let upgraders = utils.get_creeps(SPAWN_NAME, "upgrader");

  if (need_harvest) {
    flag.run(harvesters, [[5, ["e1"]]], role_harvester.harvester_flag_run);
  }

  if (need_upgrade) {
    flag.run(
      upgraders,
      [
        [1, ["e1", "c1"]],
        [9, ["e3", "c1"]],
        [10, ["e4", "c1"]],
      ],
      role_upgrader.upgrader_flag_run
    );
  }
  if (need_build) {
    flag.run(
      builders,
      [
        [5, ["e1"]],
        [8, ["e5"]],
        [7, ["e2"]],
      ],
      role_builder.builder_flag_run
    );
  }

  // utils.transAll(builders, "harvester");
  // utils.transAll(upgraders, "builder");
  // utils.transFulled(harvesters, "upgrader");
  //   utils.transPart(upgraders, "harvester", 2);
  //   utils.transFree(harvesters, "builder");

  let spawn_energy = utils.get_room_spawn_energy(SPAWN_NAME);
  console.log(
    `(${SPAWN_NAME}) spawn_energy: ${spawn_energy} | harvesters: ${harvesters.length} | upgrader: ${upgraders.length} | builder: ${builders.length} |`
  );
  return {
    name: SPAWN_NAME,
    spawn_energy: spawn_energy,
    harvesters: harvesters,
    builders: builders,
    upgraders: upgraders,
  };
}

module.exports.run = run;
