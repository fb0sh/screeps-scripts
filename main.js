const utils = require("utils");
const room_s1 = require("room_s1");

module.exports.loop = () => {
  utils.clear_creeps();
  room_s1.run();
};
