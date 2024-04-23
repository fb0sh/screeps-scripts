/**
 *
 * @param {Creep} creep
 * @param {string} spawn
 * @param {[string]} structures_order
 */
function find_save_target_id(creep, spawn, structures_order) {
  // 收集完资源去哪个spawn 的room保存 默认是创建它的spawn所在room
  let room = Game.spawns[creep.memory.spawn].room;
  if (spawn) {
    room = Game.spawns[spawn];
  }
  if (!structures_order) {
    structures_order = [
      STRUCTURE_EXTENSION,
      STRUCTURE_SPAWN,
      STRUCTURE_STORAGE,
    ];
  }
  let targets = [];
  structures_order.forEach((structure_type) => {
    targets = targets.concat(
      room
        .find(FIND_STRUCTURES, {
          filter: (structure) => {
            return (
              structure.structureType == structure_type &&
              structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
            );
          },
        })
        .sort((a, b) => {
          let distA = creep.pos.getRangeTo(a);
          let distB = creep.pos.getRangeTo(b);
          return distA - distB;
        })
    );
  });

  return targets[0].id;
}

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

    if (creep.store.getFreeCapacity() == 0 && !creep.memory.saving) {
      creep.memory.saving = true;
      creep.say("saving");
    }

    if (creep.store[RESOURCE_ENERGY] == 0 && creep.memory.saving) {
      creep.memory.saving = false;
      creep.say("🔄 harvest");
    }

    if (creep.memory.saving && !creep.memory.save_target_id) {
      creep.memory.save_target_id = find_save_target_id(
        creep,
        spawn,
        structures_order
      );
    }

    if (!creep.memory.saving && creep.memory.save_target_id) {
      creep.memory.save_target_id = undefined;
    }

    if (creep.memory.saving) {
      let save_target = Game.getObjectById(creep.memory.save_target_id);
      let n = creep.transfer(save_target, RESOURCE_ENERGY);

      switch (n) {
        case OK:
          break;
        case ERR_NOT_IN_RANGE:
          creep.moveTo(save_target, {
            visualizePathStyle: { stroke: "#ffffff" },
          });
          break;
        case ERR_FULL:
          creep.memory.save_target_id = undefined;
          break;

        default:
          console.log(`[-] harvester_flag_run(transfer):[${creep.name}] ${n}`);
      }
    } else {
      try {
        // go to flag
        let source = _source_flag.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
        let n = creep.harvest(source);
        switch (n) {
          case OK:
            break;
          case ERR_NOT_IN_RANGE:
            creep.moveTo(source, { visualizePathStyle: { stroke: "#ffaa00" } });
          case ERR_NOT_OWNER:
            console.log(`[-] this room was invalid : ${creep.room}`);
          case ERR_BUSY:
            break;
          default:
            console.log(`[-] harvester_flag_run(harvest):[${creep.name}] ${n}`);
        }
      } catch (error) {
        creep.say(`Move to ${_source_flag}`);
        try {
          creep.moveTo(_source_flag.pos, {
            visualizePathStyle: { stroke: "#FF0000" },
          });
        } catch (err) {
          console.log(`${source_flag} not found in ${creep.room.name}`);
        }
      }
    }
  });
}

module.exports.harvester_flag_run = harvester_flag_run;
