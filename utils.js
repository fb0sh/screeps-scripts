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
 */
function get_creeps(spawn, category) {
  let creeps = _.filter(
    Game.creeps,
    (creep) => creep.memory.role == category && creep.memory.spawn == spawn
  );
  return creeps.sort();
}

/**
 *
 * @param {string} spawn
 */
function get_room_energy(spawn) {
  let theSpawn = Game.spawns[spawn];
  let energy_structures = theSpawn.room.find(FIND_STRUCTURES, {
    filter: (structure) => {
      return (
        structure.structureType == STRUCTURE_EXTENSION ||
        structure.structureType == STRUCTURE_SPAWN
      );
    },
  });
  let room_total_energy = 0;
  energy_structures.forEach((structure) => {
    room_total_energy += structure.store.energy;
  });
  return room_total_energy;
}

/**
 *
 * @param {string} spawn
 * @param {string} category
 * @param {number} number
 * @param { BodyPartConstant[]} body
 */
function watch_spawn(spawn, category, number, body) {
  // 拿到传进来的 spawn
  let theSpawn = Game.spawns[spawn];
  let creeps = get_creeps(category);
  let cost = count_cost(body);

  if (creeps.length < number) {
    let name = category + Game.time;
    // 看能量是否可以 创建新的 creep
    let room_total_energy = get_room_energy(spawn);
    if (room_total_energy > cost) {
      let status = theSpawn.spawnCreep(body, name, {
        memory: { role: category, spawn: spawn },
      });
      console.log(
        `(${status}) Spawning new ${category} creep: ${name}, cost: ${cost}`
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
}
/**
 *
 * @param {Creep} creep
 * @param {string} category
 */
function trans2(creep, category) {
  creep.say(`${creep.memory.role}->${category}`);
  creep.memory.role = category;
  let new_name = creep.name.replace(creep.memory.role, category);
  creep.name = new_name;
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
 * @param {number} number
 */
function transPart(creeps, category, number) {
  let cs = [];
  for (let i = 0; i < number && i < creeps.length; i++) {
    cs.push(creeps[i]);
  }
  transAll(cs, category);
}

module.exports = {
  clear_creeps: clear_creeps,
  watch_spawn: watch_spawn,
  get_creeps: get_creeps,
  count_cost: count_cost,
  trans2: trans2,
  transAll: transAll,
  transFulled: transFulled,
  transPart: transPart,
  get_room_energy: get_room_energy,
};
