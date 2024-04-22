const utils = require("utils");
const flag = require("flag");
const room_s1 = require("room_s1");

module.exports.loop = () => {
  utils.clear_creeps();
  let room_s1_data = room_s1.run();
  utils.logSpawnStatus(room_s1_data);
  console.log(`[*] Flags : ${flag.get_flags()}`);
  // es6 ?
};
