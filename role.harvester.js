/**
 *
 * @param {Creep[]} creeps
 * @param {string[]} flags
 */
function harvester_flag_run(creeps, flags) {
  let source_flag = Game.flags[flags[0]];
  if (!source_flag) {
    console.log(`[-] flag: ${flags[0]} not found`);
  }

  creeps.forEach((creep) => {
    creep.say("🪓");
    if (creep.store.getFreeCapacity() > 0) {
      try {
        let source = source_flag.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
        let n = creep.harvest(source);
        if (n == ERR_NOT_IN_RANGE) {
          creep.moveTo(source, { visualizePathStyle: { stroke: "#ffaa00" } });
        } else if (n != 0) {
          console.log(`[-] harvester_flag_run(harvest):[${creep.name}] ${n}`);
        }
      } catch (error) {
        creep.say(`Move to ${flags[0]}`);
        creep.moveTo(source_flag.pos, {
          visualizePathStyle: { stroke: "#FF0000" },
        });
      }
    } else {
      // 收集完资源去哪个spawn 的room保存 默认是创建它的spawn所在room
      let room = Game.spawns[creep.memory.spawn].room;
      if (flags[1]) {
        room = Game.spawns[flags[1]].room;
      }

      let targets = room.find(FIND_STRUCTURES, {
        filter: (structure) => {
          return (
            (structure.structureType == STRUCTURE_EXTENSION ||
              structure.structureType == STRUCTURE_SPAWN ||
              structure.structureType == STRUCTURE_CONTAINER) &&
            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
          );
        },
      });
      if (targets.length > 0) {
        let n = creep.transfer(targets[0], RESOURCE_ENERGY);
        if (n == ERR_NOT_IN_RANGE) {
          creep.moveTo(targets[0], {
            visualizePathStyle: { stroke: "#ffffff" },
          });
        } else if (n != 0 || n != -4) {
          console.log(`[-] harvester_flag_run(transfer):[${creep.name}] ${n}`);
        }
      }
    }
  });
}

module.exports.harvester_flag_run = harvester_flag_run;
