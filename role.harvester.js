/**
 *
 * @param {Creep[]} creeps
 * @param {{source_flag:string,spawn:string,structures_order:[string]}} flags
 */
function harvester_flag_run(creeps, flags) {
  let { source_flag, spawn, structures_order } = flags;
  let _source_flag = Game.flags[source_flag];
  if (!_source_flag) {
    console.log(
      `[-] (harvester_flag_run) source_flag: ${source_flag} not found`
    );
  }

  creeps.forEach((creep) => {
    creep.say("🪓");
    if (creep.memory.saving && creep.store[RESOURCE_ENERGY] == 0) {
      creep.memory.saving = false;
      creep.say("🔄 harvest");
    }
    if (!creep.memory.saving && creep.store.getFreeCapacity() == 0) {
      creep.memory.saving = true;
      creep.say("saving");
    }

    if (creep.memory.saving) {
      // 收集完资源去哪个spawn 的room保存 默认是创建它的spawn所在room
      let room = Game.spawns[creep.memory.spawn].room;
      if (spawn) {
        room = Game.spawns[spawn].room;
      }

      let targets = [];
      if (!structures_order) {
        structures_order = [STRUCTURE_EXTENSION, STRUCTURE_SPAWN];
      }

      for (let i = 0; i < structures_order.length; i++) {
        let structure_type = structures_order[i];
        let structures = room.find(FIND_STRUCTURES, {
          filter: (structure) => {
            return (
              structure.structureType == structure_type &&
              structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
            );
          },
        });
        targets = targets.concat(
          structures.sort((a, b) => {
            let distA = _source_flag.pos.getRangeTo(a);
            let distB = _source_flag.pos.getRangeTo(b);
            return distA - distB;
          })
        );
      }

      if (targets.length > 0) {
        let n = creep.transfer(targets[0], RESOURCE_ENERGY);
        if (n == ERR_NOT_IN_RANGE) {
          creep.moveTo(targets[0], {
            visualizePathStyle: { stroke: "#ffffff" },
          });
        } else if (n != 0) {
          console.log(`[-] harvester_flag_run(transfer):[${creep.name}] ${n}`);
        }
      }
    } else {
      try {
        let source = _source_flag.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
        let n = creep.harvest(source);
        if (n == ERR_NOT_IN_RANGE) {
          creep.moveTo(source, { visualizePathStyle: { stroke: "#ffaa00" } });
        } else if (n != 0) {
          console.log(`[-] harvester_flag_run(harvest):[${creep.name}] ${n}`);
        }
      } catch (error) {
        creep.say(`Move to ${_source_flag}`);
        creep.moveTo(_source_flag.pos, {
          visualizePathStyle: { stroke: "#FF0000" },
        });
      }
    }
  });
}

module.exports.harvester_flag_run = harvester_flag_run;
