const utils = require("utils");
const flag = require("flag");
const role_harvester = require("role.harvester");
const role_upgrader = require("role.upgrader");
const role_builder = require("role.builder");

function run() {
  const SPAWN_NAME = "s1";
  let = WATCH_QUEUE = [];
  let harvesters = utils.getCreepsBySpawn(SPAWN_NAME, "harvester");
  let upgraders = utils.getCreepsBySpawn(SPAWN_NAME, "upgrader");
  let builders = utils.getCreepsBySpawn(SPAWN_NAME, "builder");

  // ================================== 手动操作区 ==================================
  const need_harvest = true;
  const need_build = true;
  const need_upgrade = true;

  WATCH_QUEUE.push([
    SPAWN_NAME,
    "harvester",
    2,
    [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
  ]);
  WATCH_QUEUE.push([SPAWN_NAME, "upgrader", 1, [WORK, MOVE, MOVE, CARRY]]);
  WATCH_QUEUE.push([SPAWN_NAME, "builder", 35, [WORK, MOVE, MOVE, CARRY]]);

  const HARVESTER_GROUP = [
    {
      number: 2,
      flags: {
        source_flag: "e1",
      },
    },
  ];
  const BUILDER_GROUP = [
    {
      number: 2,
      flags: {
        source_flag: "e1",
      },
    },
    {
      number: 8,
      flags: {
        source_flag: "e6",
      },
    },
    {
      number: 8,
      flags: {
        source_flag: "e10",
      },
    },
    {
      number: 9,
      flags: {
        source_flag: "e3",
      },
    },
    {
      number: 8,
      flags: {
        source_flag: "e4",
        controller_flag: "c1",
      },
    },
  ];

  const UPGRADER_GROUP = [
    {
      number: 1,
      flags: {
        source_flag: "e1",
      },
    },
  ];

  // utils.recoverLastCategory(upgraders, "builder");
  // utils.transAll(builders, "upgrader");

  // utils.transAll(builders, "harvester");
  // utils.transAll(upgraders, "builder");
  // utils.transFulled(harvesters, "upgrader");
  // utils.transPart(upgraders, "harvester", 2);
  // utils.transFree(harvesters, "builder");

  // ================================== 手动操作区 ==================================

  utils.watchCreeps(WATCH_QUEUE);

  if (need_harvest) {
    flag.run(harvesters, HARVESTER_GROUP, role_harvester.harvester_flag_run);
  }

  if (need_build) {
    flag.run(builders, BUILDER_GROUP, role_builder.builder_flag_run);
  }

  if (need_upgrade) {
    flag.run(upgraders, UPGRADER_GROUP, role_upgrader.upgrader_flag_run);
  }

  let spawn_energy = utils.get_room_spawn_energy(SPAWN_NAME);
  let spawn_extension_energy =
    utils.get_room_spawn_extension_energy(SPAWN_NAME);

  return {
    name: SPAWN_NAME,
    spawn_energy: spawn_energy,
    spawn_extension_energy: spawn_extension_energy,
    harvesters: harvesters,
    builders: builders,
    upgraders: upgraders,
  };
}

module.exports.run = run;
