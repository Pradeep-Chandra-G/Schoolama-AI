import {
  serial,
  integer,
  json,
  pgTable,
  varchar,
  boolean,
} from "drizzle-orm/pg-core";

export const USER_TABLE = pgTable("users", {
  id: serial().primaryKey(),
  userName: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  isMember: boolean().notNull().default(false),
});

export const STUDY_MATERIAL_TABLE = pgTable("studyMaterial", {
  id: serial().primaryKey(),
  courseId: varchar().notNull(),
  courseType: varchar().notNull(),
  topic: varchar().notNull(),
  difficultyLevel: varchar().default("Easy"),
  courseLayout: json(),
  createdBy: varchar().notNull(),
  status: varchar().default("Generating"),
});

export const CHAPTER_NOTES_TABLE = pgTable("chapterNotes", {
  id: serial().primaryKey(),
  courseId: varchar().notNull(),
  chapterId: integer().notNull(),
  notes: json(),
});

export const STUDY_TYPE_CONTENT = pgTable("studyTypeContent", {
  id: serial().primaryKey(),
  courseId: varchar().notNull(),
  content: json(),
  type: varchar().notNull(),
  status: varchar().default("Generating"),
});
