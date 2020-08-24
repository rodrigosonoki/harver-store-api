const Bull = require("bull");
const redisConfig = require("../config/redis");

const jobs = require("../jobs");

const queues = Object.values(jobs).map((job) => ({
  bull: new Bull(job.key, redisConfig),
  name: job.key,
  options: job.options,
}));

const Queue = {
  queues,
  add(name, data) {
    const queue = this.queues.find((queue) => queue.name === name);
    return queue.bull.add(data, queue.options);
  },
};

module.exports = Queue;
