// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql, InferSelectModel } from "drizzle-orm";
import {
  index,
  integer,
  pgEnum,
  pgTableCreator,
  serial,
  text,
  timestamp,
  varchar,
  json
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
    players: text('players').array().notNull().default(sql`'{}'::text[]`),
    numOfGroups: integer("num_of_groups").default(0),
    howManyFromEachGroupAdvance: integer("how_many_from_each_group_advance").default(2),

  },
  (example) => ({
    nameIndex: index("name_idx").on(example.name),
  })
)

export type EventType = InferSelectModel<typeof events>

export const matches = createTable(
  "match",
  {
    id: serial("id").primaryKey(),
    eventId: integer("event_id").references(() => events.id),
    player1: varchar("player1", { length: 256 }),
    player2: varchar("player2", { length: 256 }),
    player1Score: integer("player1_score").default(0),
    player2Score: integer("player2_score").default(0),
    winner: varchar("winner", { length: 256 }).default(""),
    round: integer("round"),
    table: integer("table"),
    weightOfWinBasedOnOpponentWins: integer("weight_of_win_based_on_opponent_wins").default(0),
    weightOfWinBasedOnScore: integer("weight_of_win_based_on_score").default(0),
  }
)

export type MatchType = InferSelectModel<typeof matches>

export const groups = createTable(
  "group",
  {
    id: serial("id").primaryKey(),
    eventId: integer("event_id").references(() => events.id),
    groupLetter: varchar("group_letter", { length: 256 }),
    players: text('players').array().notNull().default(sql`'{}'::text[]`),
  }
)

export type GroupType = InferSelectModel<typeof groups>

export const players = createTable(
  "player",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }),
    eventId: integer("event_id").references(() => events.id),
    groupId: integer("group_id").references(() => groups.id),
    numberOfWins: integer("number_of_wins").default(0),
    totalWeightOfWinsBasedOnOpponentWins: integer("total_weight_of_wins_based_on_opponent_wins").default(0),
    totalWeightOfWinsBasedOnScore: integer("total_weight_of_wins_based_on_score").default(0),
  }
)

export type PlayerType = InferSelectModel<typeof players>
