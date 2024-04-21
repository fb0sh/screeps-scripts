/**
 *
 * @param {Creep[]} creeps
 * @param {string[]} flags
 */
function upgrader_flag_run(creeps, flags) {
  let source_flag = Game.flags[flags[0]];
  if (!source_flag) {
    console.log(`[-] flag: ${flags[0]} not found`);
  }

  let controller_flag = Game.flags[flags[1]];
  if (!controller_flag) {
    console.log(`[-] flag: ${flags[1]} not found`);
  }

  creeps.forEach((creep) => {
    creep.memory.es = flags[0];
    creep.say(creep.memory.es);
    // 切换状态
    if (creep.memory.upgrading && creep.store[RESOURCE_ENERGY] == 0) {
      creep.memory.upgrading = false;
      creep.say("🔄 harvest");
    }
    if (!creep.memory.upgrading && creep.store.getFreeCapacity() == 0) {
      creep.memory.upgrading = true;
      creep.say("⚡ upgrade");
    }
    if (creep.memory.upgrading) {
      let controller = controller_flag.room.controller;

      let n = creep.upgradeController(controller);
      if (n == ERR_NOT_IN_RANGE) {
        creep.moveTo(controller, {
          visualizePathStyle: { stroke: "#0000FF" },
        });
      } else if (n != OK) {
        console.log(`[-] upgrader_flag_run(controller):[${creep.name}] ${n}`);
      }
    } else {
      try {
        let source = source_flag.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
        let n = creep.harvest(source);
        if (n == ERR_NOT_IN_RANGE) {
          creep.moveTo(source, {
            visualizePathStyle: { stroke: "#ffffff" },
          });
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
module.exports.upgrader_flag_run = upgrader_flag_run;
