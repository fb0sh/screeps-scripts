/**
 *
 * @param {Creep[]} creeps
 * @param {string[]} flags
 */
function builder_flag_run(creeps, flags) {
  let source_flag = Game.flags[flags[0]];
  if (!source_flag) {
    console.log(`[-] flag: ${flags[0]} not found`);
  }
  creeps.forEach((creep) => {
    if (creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
      creep.memory.building = false;
      creep.say("🔄 harvest");
    }
    if (!creep.memory.building && creep.store.getFreeCapacity() == 0) {
      creep.memory.building = true;
      creep.say("🚧 build");
    }

    if (creep.memory.building) {
      // 可指定 去 其他spawn的room 建设
      let room = Game.spawns[creep.memory.spawn].room;
      if (flags[1]) {
        room = Game.spawns[flags[1]].room;
      }
      var targets = room.find(FIND_CONSTRUCTION_SITES, {
        filter: (structure) => {
          // 调整优先级
          return (
            structure.structureType == STRUCTURE_EXTENSION ||
            structure.structureType == STRUCTURE_ROAD ||
            true
          );
        },
      });
      if (targets.length) {
        if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
          creep.moveTo(targets[0], {
            visualizePathStyle: { stroke: "#0000FF   " },
          });
        }
      }
    } else {
      try {
        let source = source_flag.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
        let n = creep.harvest(source);
        if (n == ERR_NOT_IN_RANGE) {
          creep.moveTo(source, { visualizePathStyle: { stroke: "#ffaa00" } });
        } else if (n != 0) {
          console.log(`[-] builder_flag_run(harvest):[${creep.name}] ${n}`);
        }
      } catch (error) {
        creep.say(`Move to ${flags[0]}`);
        creep.moveTo(source_flag.pos, {
          visualizePathStyle: { stroke: "#FF0000" },
        });
      }
    }
  });
}

module.exports.builder_flag_run = builder_flag_run;
