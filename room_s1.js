const utils = require("utils");
const flag = require("flag");
const role_harvester = require("role.harvester");
const role_upgrader = require("role.upgrader");
const role_builder = require("role.builder");

function run() {
  const SPAWN_NAME = "s1";
  let = WATCH_QUEUE = [];

  if (Memory.spawnTicks[SPAWN_NAME]) {
    Memory.spawnTicks[SPAWN_NAME] = false;
  }

  let harvesters = utils.getCreepsBySpawn(SPAWN_NAME, "harvester");
  let upgraders = utils.getCreepsBySpawn(SPAWN_NAME, "upgrader");
  let builders = utils.getCreepsBySpawn(SPAWN_NAME, "builder");

  // ================================== 手动操作区 ==================================
  const need_harvest = true;
  const need_build = false;
  const need_upgrade = true;

  WATCH_QUEUE.push([
    SPAWN_NAME,
    "harvester",
    10,
    [WORK, WORK, CARRY, CARRY, MOVE],
  ]);
  WATCH_QUEUE.push([SPAWN_NAME, "builder", 0, [WORK, MOVE, MOVE, CARRY]]);
  WATCH_QUEUE.push([SPAWN_NAME, "upgrader", 30, [WORK, MOVE, MOVE, CARRY]]);

  const HARVESTER_GROUP = [
    {
      number: 5,
      flags: {
        source_flag: "e1",
      },
    },
    {
      number: 5,
      flags: {
        source_flag: "e8",
        structures_order: [STRUCTURE_STORAGE],
      },
    },
  ];
  const BUILDER_GROUP = [
    {
      number: 6,
      flags: {
        source_flag: "e7",
      },
    },

    {
      number: 14,
      flags: {
        source_flag: "e8",
      },
    },
  ];

  const UPGRADER_GROUP = [
    {
      number: 10,
      flags: {
        source_flag: "e4",
        controller_flag: "c1",
      },
    },
    {
      number: 4,
      flags: {
        source_flag: "e3",
        controller_flag: "c1",
      },
    },
    {
      number: 6,
      flags: {
        source_flag: "e6",
        controller_flag: "c1",
      },
    },
    {
      number: 10,
      flags: {
        source_flag: "e5",
        controller_flag: "c1",
      },
    },
    {
      number: 10,
      flags: {
        source_flag: "e9",
        controller_flag: "c1",
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
