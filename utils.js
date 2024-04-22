/**
 *
 * @param {BodyPartConstant[]} body
 */
function count_cost(body) {
  let cost = 0;
  for (let b in body) {
    switch (body[b]) {
      case MOVE:
        cost += 50;
        break;
      case WORK:
        cost += 100;
        break;
      case CARRY:
        cost += 50;
        break;
      case ATTACK:
        cost += 80;
        break;
      case RANGED_ATTACK:
        cost += 150;
        break;
      case HEAL:
        cost += 250;
        break;
      case CLAIM:
        cost += 600;
        break;
      case TOUGH:
        cost += 10;
        break;
      default:
        break;
    }
  }

  return cost;
}

function clear_creeps() {
  for (let name in Memory.creeps) {
    if (!Game.creeps[name]) {
      delete Memory.creeps[name];
      console.log("[*] Clear the creep: " + name);
    }
  }
}

/**
 * @param {string} spawn
 * @param {string} category
 * @returns {Creep[]} creeps
 * @returns {Creep[]}
 */
function getCreepsBySpawn(spawn, category, creeps) {
  let source_creeps = Game.creeps;
  if (creeps) {
    source_creeps = creeps;
  }
  let res_creeps = _.filter(source_creeps, (creep) => {
    if (category) {
      return creep.memory.role == category && creep.memory.spawn == spawn;
    } else {
      return creep.memory.spawn == spawn;
    }
  }).sort();
  return res_creeps;
}

/**
 *
 * @param {string} room_name
 * @param {string} category
 * @param {Creep[]} creeps
 * @returns {Creep[]}
 */
function getCreepsByRoom(room_name, category, creeps) {
  let room = Game.rooms[room_name];
  let source_creeps = Game.creeps;
  if (creeps) {
    source_creeps = creeps;
  }
  let res_creeps = _.filter(source_creeps, (creep) => {
    if (category) {
      return creep.memory.role == category && creep.room == room;
    } else {
      return creep.room == room;
    }
  }).sort();
  return res_creeps;
}

/**
 *
 * @param {string} category
 * @param {Creep[]} creeps
 * @returns {Creep[]}
 */
function getCreepsByCategory(category, creeps) {
  let source_creeps = Game.creeps;
  if (creeps) {
    source_creeps = creeps;
  }
  let res_creeps = _.filter(
    source_creeps,
    (creep) => creep.memory.role == category
  ).sort();
  return res_creeps;
}

/**
 *
 * @returns {Creep[]}
 */
function getCreeps() {
  let source_creeps = Game.creeps;
  let res_creeps = _.filter(source_creeps, (creep) => true).sort;
  return res_creeps;
}

/**
 *
 * @param {string} spawn
 */
function get_room_spawn_energy(spawn) {
  let theSpawn = Game.spawns[spawn];
  let energy_structures = theSpawn.room.find(FIND_STRUCTURES, {
    filter: (structure) => {
      return structure.structureType == STRUCTURE_SPAWN;
    },
  });
  let room_spawn_energy = 0;
  energy_structures.forEach((structure) => {
    room_spawn_energy += structure.store.energy;
  });
  return room_spawn_energy;
}

/**
 *
 * @param {string} spawn
 */
function get_room_spawn_extension_energy(spawn) {
  let theSpawn = Game.spawns[spawn];
  let energy_structures = theSpawn.room.find(FIND_STRUCTURES, {
    filter: (structure) => {
      return structure.structureType == STRUCTURE_EXTENSION;
    },
  });
  let room_spawn_energy = 0;
  energy_structures.forEach((structure) => {
    room_spawn_energy += structure.store.energy;
  });
  return room_spawn_energy;
}

/**
 *
 * @param {string} spawn
 * @param {string} category
 * @param {number} number
 * @param { BodyPartConstant[]} body
 * @returns {boolean}
 */
function watchSpawn(spawn, category, number, body) {
  // 拿到传进来的 spawn
  let theSpawn = Game.spawns[spawn];
  let creeps = getCreepsBySpawn(spawn, category);
  let cost = count_cost(body);

  if (creeps.length < number) {
    let name = category + Game.time;
    // 看能量是否可以 创建新的 creep
    let room_total_energy =
      get_room_spawn_energy(spawn) + get_room_spawn_extension_energy(spawn);
    if (room_total_energy >= cost) {
      let status = theSpawn.spawnCreep(body, name, {
        memory: { role: category, spawn: spawn },
      });

      console.log(
        `[*] (${status}) Spawning new ${category} creep: ${name}, cost: ${cost}`
      );
    }
  }

  if (theSpawn.spawning) {
    let spawningCreep = Game.creeps[theSpawn.spawning.name];
    theSpawn.room.visual.text(
      "🛠️" + spawningCreep.memory.role,
      theSpawn.pos.x + 1,
      theSpawn.pos.y,
      { align: "left", opacity: 0.8 }
    );
  }
  return getCreepsBySpawn(spawn, category).length >= number;
}

/**
 *
 * @param {[[string, string, number,BodyPartConstant[] ]]} watch_queue
 */
function watchCreeps(watch_queue) {
  for (let i = 0; i < watch_queue.length; i++) {
    let spawn = watch_queue[i][0];
    let category = watch_queue[i][1];
    let number = watch_queue[i][2];
    let body = watch_queue[i][3];
    // console.log(category);
    if (!watchSpawn(spawn, category, number, body)) {
      break;
    }
  }
}

/**
 *
 * @param {Creep} creep
 */
function recover(creep) {
  if (creep.memory.last_role) {
    creep.say(`${creep.memory.role}->${creep.memory.last_role}`);
    creep.memory.role = creep.memory.last_role;
  }
}
/**
 *
 * @param {Creep[]} creeps
 */

function recoverAll(creeps) {
  creeps.forEach((creep) => {
    recover(creep);
  });
}

/**
 *
 * @param {Creep[]} creeps
 * @param {string} category
 */
function recoverLastCategory(creeps, category) {
  let cs = _.filter(creeps, (creep) => creep.last_role == category);
  recoverAll(cs);
}

/**
 *
 * @param {Creep} creep
 * @param {string} category
 */
function trans2(creep, category) {
  creep.say(`${creep.memory.role}->${category}`);
  creep.memory.last_role = creep.memory.role;
  creep.memory.role = category;
}
/**
 *
 * @param {Creep[]} creeps
 * @param {string} category
 */
function transAll(creeps, category) {
  creeps.forEach((creep) => {
    trans2(creep, category);
  });
}

/**
 *
 * @param {Creep[]} creeps
 * @param {string} category
 */
function transFulled(creeps, category) {
  let cs = [];
  creeps.forEach((creep) => {
    if (creep.store.getFreeCapacity() == 0) {
      cs.push(creep);
    }
  });
  transAll(cs, category);
}

/**
 *
 * @param {Creep[]} creeps
 * @param {string} category
 */
function transFree(creeps, category) {
  let cs = [];
  creeps.forEach((creep) => {
    if (creep.store.getUsedCapacity() == 0) {
      cs.push(creep);
    }
  });
  transAll(cs, category);
}

/**
 *
 * @param {Creep[]} creeps
 * @param {string} category
 * @param {number} number
 */
function transPart(creeps, category, number) {
  let cs = [];
  for (let i = 0; i < number && i < creeps.length; i++) {
    cs.push(creeps[i]);
  }
  transAll(cs, category);
}

/**
 *
 * @param {Creep[]} creeps
 * @param {string} flag
 */
function moveToFlag(creeps, flag) {
  let target = Game.flags[flag];
  if (!target) {
    console.log(`[-] flag: ${flag} not found`);
  }
  creeps.forEach((creep) => {
    let n = creep.moveTo(target.pos);
    if (n != 0) {
      console.log(`[-] ${creep.name} can't move to ${flag}`);
    }
  });
}

/**
 *
 * @param {Creep[]} creeps
 * @param {string} spawn
 */
function moveToSpawn(creeps, spawn) {
  let target = Game.spawns[spawn];
  if (!target) {
    console.log(`[-] spawn: ${spawn} not found`);
  }
  creeps.forEach((creep) => {
    let n = creep.moveTo(target.pos);
    if (n != 0) {
      console.log(`[-] ${creep.name} can't move to ${spawn}`);
    }
  });
}

/**
 *
 * @param {{name,spawn_energy,spawn_extension_energy,harvesters,builders,upgraders}} spawn_data
 */
function logSpawnStatus(spawn_data) {
  let {
    name,
    spawn_energy,
    spawn_extension_energy,
    harvesters,
    builders,
    upgraders,
  } = spawn_data;
  console.log(
    `(${name}) spawn_energy: ${spawn_energy} | spawn_extension_energy: ${spawn_extension_energy} | harvesters: ${harvesters.length} | builder: ${builders.length} | upgrader: ${upgraders.length} |`
  );
}

module.exports = {
  // get creeps
  getCreeps: getCreeps,
  getCreepsByCategory: getCreepsByCategory,
  getCreepsBySpawn: getCreepsBySpawn,
  getCreepsByRoom: getCreepsByRoom,
  // trans
  trans2: trans2,
  transAll: transAll,
  transFulled: transFulled,
  transPart: transPart,
  transFree: transFree,
  // move
  moveToFlag: moveToFlag,
  moveToSpawn: moveToSpawn,
  // recover
  recover: recover,
  recoverAll: recoverAll,
  recoverLastCategory: recoverLastCategory,
  //
  watchSpawn: watchSpawn,
  watchCreeps: watchCreeps,
  clear_creeps: clear_creeps,
  count_cost: count_cost,
  get_room_spawn_energy: get_room_spawn_energy,
  get_room_spawn_extension_energy: get_room_spawn_extension_energy,
  logSpawnStatus: logSpawnStatus,
};
