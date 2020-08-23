const Bull = require("bull");
const redisConfig = require("../config/redis");

const jobs = require("../jobs");

const queues = Object.values(jobs).map((job) => ({
  bull: new Bull(job.key, redisConfig),
  name: job.key,
  handle: job.handle,
  options: job.options,
}));

const Queue = {
  queues,
  add(name, data) {
    const queue = this.queues.find((queue) => queue.name === name);

    return queue.bull.add(data, queue.options);
  },
  process() {
    return this.queues.forEach((queue) => {
      queue.bull.process(queue.handle);

      queue.bull.on("failed", (job, err) => {
        console.log("Job failed", queue.key, job.data);
        console.log(err);
      });
    });
  },
};

module.exports = Queue;
