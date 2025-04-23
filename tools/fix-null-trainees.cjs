const TrainingClass = require('../models/TrainingClass');
const sequelize = require('../config/database');

(async () => {
  try {
    await sequelize.authenticate();
    const classes = await TrainingClass.findAll();

    for (const cls of classes) {
      if (!Array.isArray(cls.enrolledTrainees)) {
        console.log(`Fixing class: ${cls.id} - "${cls.title}"`);
        cls.enrolledTrainees = [];
        await cls.save();
      }
    }

    console.log("✅ All classes with null or invalid enrolledTrainees fixed.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Failed to fix classes:", err);
    process.exit(1);
  }
})();
