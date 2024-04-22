/**
 *
 * @param {Creep[]} creeps
 * @param {{source_flag:string,spawn:string,construction_order:[string]}} flags
 */
function builder_flag_run(creeps, flags) {
  let { source_flag, spawn, construction_order } = flags;
  let _source_flag = Game.flags[source_flag];
  if (!_source_flag) {
    console.log(`[-] flag: ${source_flag} not found`);
  }
  creeps.forEach((creep) => {
    creep.say("🔨");
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
      if (spawn) {
        room = Game.spawns[spawn].room;
      }
      let targets = [];
      let constructions = room.find(FIND_CONSTRUCTION_SITES);
      if (!construction_order) {
        construction_order = [STRUCTURE_EXTENSION, STRUCTURE_ROAD];
      }

      for (let i = 0; i < constructions.length; i++) {
        let site = constructions[i];
        for (let j = 0; j < construction_order.length; j++) {
          if (site.structureType == construction_order[j]) {
            targets.push(site);
            constructions.splice(i, 1);
            break;
          }
        }
      }

      targets = targets.concat(constructions);

      if (targets.length) {
        if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
          creep.moveTo(targets[0], {
            visualizePathStyle: { stroke: "#0000FF   " },
          });
        }
      }
    } else {
      try {
        let source = _source_flag.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
        let n = creep.harvest(source);
        if (n == ERR_NOT_IN_RANGE) {
          creep.moveTo(source, { visualizePathStyle: { stroke: "#ffaa00" } });
        } else if (n != 0) {
          console.log(`[-] builder_flag_run(harvest):[${creep.name}] ${n}`);
        }
      } catch (error) {
        creep.say(`Move to ${source_flag}`);
        creep.moveTo(_source_flag.pos, {
          visualizePathStyle: { stroke: "#FF0000" },
        });
      }
    }
  });
}

module.exports.builder_flag_run = builder_flag_run;
