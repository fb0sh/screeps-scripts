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
 * @param {[{number:number:flags:group}]} fn_list
 * @param {function(Creep[], group)} f
 *
 */
function run(creeps, fn_list, f) {
  let idx = 0;
  fn_list.forEach((each) => {
    let each_creeps = [];
    let { number, flags } = each;

    for (i = 0; i < number && idx < creeps.length; i++, idx++) {
      let creep = creeps[idx];
      each_creeps.push(creep);
    }

    f(each_creeps, flags);
  });
}

module.exports.run = run;
module.exports.get_flags = get_flags;
