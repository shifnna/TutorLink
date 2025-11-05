import cron from "node-cron";
import { TYPES } from "../types/types";
import container from "../container/inversify.config";
import { ISlotService } from "../services/interfaces/ISlotService";
import { SlotRuleModel } from "../models/slotRule";


//// Run every day at midnight
cron.schedule("0 0 * * *", async () => {
  console.log("Running daily slot regeneration job...");
  const rules = await SlotRuleModel.find();
  for (const rule of rules) {
    try {
      const slotService = container.get<ISlotService>(TYPES.ISlotService);
      await slotService.generateSlotsFromRule(rule);
      console.log(`Updated slots for tutor: ${rule.tutorId}`);
    } catch (err) {
      console.error(`Error updating slots for tutor ${rule.tutorId}:`, err);
    }
  }
});
