/**
 *
 * @param {Creep[]} creeps
 * @param {source_flag:string, controller_flag} flags
 */
function upgrader_flag_run(creeps, flags) {
  let { source_flag, controller_flag } = flags;
  let _source_flag = Game.flags[source_flag];
  if (!_source_flag) {
    console.log(
      `[-] (upgrader_flag_run) source_flag: ${source_flag} not found`
    );
  }

  let _controller_flag = Game.flags[controller_flag];
  if (!_controller_flag) {
    console.log(
      `[-] (upgrader_flag_run) controller_flag: ${controller_flag} not found`
    );
  }

  creeps.forEach((creep) => {
    creep.memory.es = source_flag;
    creep.say("⏫️");
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
      let controller = _controller_flag.room.controller;

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
        let source = _source_flag.pos.findClosestByRange(FIND_SOURCES_ACTIVE);
        let n = creep.harvest(source);
        if (n == ERR_NOT_IN_RANGE) {
          creep.moveTo(source, {
            visualizePathStyle: { stroke: "#ffffff" },
          });
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
module.exports.upgrader_flag_run = upgrader_flag_run;
