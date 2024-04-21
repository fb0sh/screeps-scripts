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
 *
 * @param {string} category
 * @returns {Creep[]} creeps
 */
function get_creeps(category) {
  let creeps = _.filter(Game.creeps, (creep) => creep.memory.role == category);
  return creeps.sort();
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
    if (theSpawn.store.energy > cost) {
      let status = theSpawn.spawnCreep(body, name, {
        memory: { role: category },
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
  creep.say(`Frome ${creep.memory.role} to ${category}`);
  creep.memory.role = category;
  let new_name = creep.name.replace(creep.memory.role, category + "_");
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

module.exports = {
  clear_creeps: clear_creeps,
  watch_spawn: watch_spawn,
  get_creeps: get_creeps,
  count_cost: count_cost,
  trans2: trans2,
  transAll: transAll,
};
