import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./configs/schema.js",
  dbCredentials: {
    url: 'postgresql://ailms_owner:npg_qtv5XhdI2wxP@ep-withered-lake-a8ginal8-pooler.eastus2.azure.neon.tech/ailms?sslmode=require'
  }
});
