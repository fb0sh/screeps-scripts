/**
 *
 * @param {Creep} creep
 * @param {string} spawn
 * @param {[string]} construction_order
 * @param {string} broken  已被其他creep占领的target
 */
function find_build_target_id(creep, spawn, construction_order, broken) {
  // 可指定 去 其他spawn的room 建设
  let room = Game.spawns[creep.memory.spawn].room;
  if (spawn) {
    room = Game.spawns[spawn].room;
  }
  if (!construction_order) {
    construction_order = [
      STRUCTURE_EXTENSION,
      STRUCTURE_ROAD,
      STRUCTURE_STORAGE,
      STRUCTURE_CONTAINER,
      STRUCTURE_RAMPART,
    ];
  }
  let targets = [];
  construction_order.forEach((construction_type) => {
    targets = targets.concat(
      room
        .find(FIND_CONSTRUCTION_SITES, {
          filter: (construction) => {
            return construction.structureType == construction_type;
          },
        })
        .sort((a, b) => {
          let distA = creep.pos.getRangeTo(a);
          let distB = creep.pos.getRangeTo(b);
          return distA - distB;
        })
    );
  });

  if (broken) {
    let temp = [];
    for (let i = 0; i < targets.length; i++) {
      if (targets[i].id != broken) {
        temp.push(targets[i]);
      }
    }
    targets = temp;
  }

  if (targets[0]) {
    return targets[0].id;
  } else {
    return undefined;
  }
}

/**
 *
 * @param {Creep[]} creeps
 * @param {{source_flag:string,spawn:string,construction_order:[string]}} flags
 */
function builder_flag_run(creeps, flags) {
  let { source_flag, spawn, construction_order } = flags;
  let _source_flag = Game.flags[source_flag];
  if (!_source_flag) {
    console.log(`[-] (builder_flag_run) source_flag: ${source_flag} not found`);
  }

  creeps.forEach((creep) => {
    creep.say("🔨");

    if (creep.store.getFreeCapacity() == 0 && !creep.memory.building) {
      creep.memory.building = true;
      creep.say("🚧 build");
    }

    if (creep.store[RESOURCE_ENERGY] == 0 && creep.memory.building) {
      creep.memory.building = false;
      creep.say("🔄 harvest");
    }

    if (creep.memory.building && !creep.memory.build_target_id) {
      creep.memory.build_target_id = find_build_target_id(
        creep,
        spawn,
        construction_order
      );
    }
    if (!creep.memory.building && creep.memory.build_target_id) {
      creep.memory.build_target_id = undefined;
    }

    if (creep.memory.building) {
      let build_target = Game.getObjectById(creep.memory.build_target_id);
      let n = creep.build(build_target);

      switch (n) {
        case OK:
          break;
        case ERR_NOT_IN_RANGE:
          creep.moveTo(build_target, {
            visualizePathStyle: { stroke: "#0000FF" },
          });
          break;
        case ERR_INVALID_TARGET:
          creep.memory.build_target_id = undefined;
          break;

        default:
          console.log(`[-] builder_flag_run(build):[${creep.name}] ${n}`);
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
            break;
          case ERR_NOT_OWNER:
            console.log(`[-] this room was invalid : ${creep.room}`);
            break;
          case ERR_BUSY:
            break;
          default:
            console.log(`[-] builder_flag_run(harvest):[${creep.name}] ${n}`);
        }
      } catch (error) {
        creep.say(`Move to ${source_flag}`);
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

module.exports.builder_flag_run = builder_flag_run;
