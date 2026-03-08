const cron = require("node-cron");
const Item = require("../models/Item");

// Run every hour
cron.schedule("0 * * * *", async () => {
  try {
    const now = new Date();
    const threshold = new Date(now - 24 * 60 * 60 * 1000); // 24 hours ago

    const result = await Item.deleteMany({
      status: "sold",
      updatedAt: { $lt: threshold }
    });

    console.log(`Cleanup job ran. Deleted ${result.deletedCount} sold items.`);
  } catch (err) {
    console.error("Cleanup job error:", err);
  }
});