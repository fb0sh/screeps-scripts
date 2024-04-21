function get_flags() {
  let flags = [];
  for (let name in Game.flags) {
    flags.push(name);
  }
  return flags.sort();
}

/**
 *
 * @param {Creep[]} creeps
 * @param {[[string,number]]} fn_list
 * @param {function(Creep[], string)} f
 *  [2, ["es1"]],
 */
function run(creeps, fn_list, f) {
  let idx = 0;
  fn_list.forEach((each) => {
    let each_creeps = [];
    let creep_number = each[0];
    let flags = each[1];

    for (i = 0; i < creep_number && idx < creeps.length; i++, idx++) {
      let creep = creeps[idx];
      each_creeps.push(creep);
    }

    f(each_creeps, flags);
  });
}

module.exports.run = run;
module.exports.get_flags = get_flags;
