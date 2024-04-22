const utils = require("utils");
const flag = require("flag");
const role_harvester = require("role.harvester");
const role_upgrader = require("role.upgrader");
const role_builder = require("role.builder");

function run() {
  const SPAWN_NAME = "s1";
  const need_harvest = true;
  const need_build = true;
  const need_upgrade = true;

  const harvest_number = 10;
  const builder_number = 10;
  const upgrader_number = 20;
  WATCH_QUEUE = [];

  WATCH_QUEUE.push([SPAWN_NAME, "harvester", 10, [WORK, MOVE, CARRY]]);
  WATCH_QUEUE.push([SPAWN_NAME, "builder", 10, [WORK, MOVE, CARRY]]);
  WATCH_QUEUE.push([SPAWN_NAME, "upgrader", 20, [WORK, MOVE, CARRY]]);

  console.log(WATCH_QUEUE);

  let harvesters = utils.getCreepsBySpawn(SPAWN_NAME, "harvester");
  let builders = utils.getCreepsBySpawn(SPAWN_NAME, "builder");
  let upgraders = utils.getCreepsBySpawn(SPAWN_NAME, "upgrader");

  if (harvesters.length != harvest_number) {
    utils.watchSpawn(SPAWN_NAME, "harvester", harvest_number, [
      WORK,
      MOVE,
      CARRY,
    ]);
  } else {
    if (builders.length != builder_number) {
      utils.watchSpawn(SPAWN_NAME, "builder", builder_number, [
        WORK,
        MOVE,
        CARRY,
      ]);
    } else {
      if (upgraders.length != upgrader_number) {
        utils.watchSpawn(SPAWN_NAME, "upgrader", upgrader_number, [
          WORK,
          MOVE,
          CARRY,
        ]);
      }
    }
  }

  if (need_harvest) {
    flag.run(
      harvesters,
      [
        [5, ["e1"]],
        [5, ["e2"]],
      ],
      role_harvester.harvester_flag_run
    );
  }

  if (need_build) {
    flag.run(
      builders,
      [
        [5, ["e2"]],
        [5, ["e5"]],
      ],
      role_builder.builder_flag_run
    );
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

  // utils.transAll(builders, "harvester");
  // utils.transAll(upgraders, "builder");
  // utils.transFulled(harvesters, "upgrader");
  //   utils.transPart(upgraders, "harvester", 2);
  //   utils.transFree(harvesters, "builder");

  let spawn_energy = utils.get_room_spawn_energy(SPAWN_NAME);
  console.log(
    `(${SPAWN_NAME}) spawn_energy: ${spawn_energy} | harvesters: ${harvesters.length} | builder: ${builders.length} | upgrader: ${upgraders.length} |`
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
