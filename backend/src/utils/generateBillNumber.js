const Counter = require(
  "../models/Counter"
);

const generateBillNumber =
  async () => {

    const counter =
      await Counter.findOneAndUpdate(
        {
          name: "bill",
        },
        {
          $inc: {
            sequence: 1,
          },
        },
        {
          new: true,
          upsert: true,
        }
      );

    return `AME-${new Date().getFullYear()}-${String(
      counter.sequence
    ).padStart(5, "0")}`;
  };

module.exports =
  generateBillNumber;