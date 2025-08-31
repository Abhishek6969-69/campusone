import { defineConfig } from "@prisma/config";
import * as dotenv from "dotenv";

dotenv.config({ path: "./.env" });

export default defineConfig({
  schema: "./prisma/schema.prisma",
  // 👇 Add seed block back
  // @ts-ignore - seed is available at runtime even if types complain
  seed: {
    run: async () => {
      await import("./prisma/seed");
    },
  },
});
