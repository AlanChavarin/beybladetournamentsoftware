// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql, InferSelectModel } from "drizzle-orm";
import {
  index,
  pgEnum,
  pgTableCreator,
  serial,
  timestamp,
  varchar
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `beybladetournamentsoftware_${name}`);

// export const posts = createTable(
//   "post",
//   {
//     id: serial("id").primaryKey(),
//     name: varchar("name", { length: 256 }),
//     createdAt: timestamp("created_at", { withTimezone: true })
//       .default(sql`CURRENT_TIMESTAMP`)
//       .notNull(),
//     updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
//       () => new Date()
//     ),
//   },
//   (example) => ({
//     nameIndex: index("name_idx").on(example.name),
//   })
// )

const deckListRequirementEnum = pgEnum("deck_list_requirement", ["top4", "topCut", "allPlayers"]);

export const events = createTable(
  "event",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }),
    format: varchar("format", { length: 256 }),
    date: timestamp("date", { withTimezone: true }),
    location: varchar("location", { length: 256 }),
    time: timestamp("time", { withTimezone: true }),
    checkInTime: timestamp("check_in_time", { withTimezone: true }),
    deckListRequirement: deckListRequirementEnum("deck_list_requirement"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date()
    ),
  },
  (example) => ({
    nameIndex: index("name_idx").on(example.name),
  })
)

export type EventType = InferSelectModel<typeof events>

