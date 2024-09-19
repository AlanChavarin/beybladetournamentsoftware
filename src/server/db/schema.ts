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
  json,
  uniqueIndex
} from "drizzle-orm/pg-core";
import { relations } from 'drizzle-orm';

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
    numOfGroups: integer("num_of_groups").default(0),
    howManyFromEachGroupAdvance: integer("how_many_from_each_group_advance").default(2),

  },
  (example) => ({
    nameIndex: index("name_idx").on(example.name),
  })
)

export type EventType = InferSelectModel<typeof events>


export const players = createTable(
  "player",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }),
    //eventId: integer("event_id").references(() => events.id),
    //groupId: integer("group_id").references(() => groups.id),
    numberOfWins: integer("number_of_wins").default(0),
    totalWeightOfWinsBasedOnOpponentWins: integer("total_weight_of_wins_based_on_opponent_wins").default(0),
    totalWeightOfWinsBasedOnScore: integer("total_weight_of_wins_based_on_score").default(0),
  }
)

export type PlayerType = InferSelectModel<typeof players>

// setup an event player relation
export const eventPlayers = createTable(
  "event_player",
  {
    id: serial("id").primaryKey(),
    eventId: integer("event_id").notNull().references(() => events.id),
    playerId: integer("player_id").notNull().references(() => players.id),
  },
  (table) => ({
    eventPlayerUnique: uniqueIndex("event_player_unique_idx").on(table.eventId, table.playerId),
  })
)

export const eventPlayersRelations = relations(eventPlayers, ({ one }) => ({
  player: one(players, {
    fields: [eventPlayers.playerId],
    references: [players.id],
  }),
  event: one(events, {
    fields: [eventPlayers.eventId],
    references: [events.id],
  }),
}));

export const playersRelations = relations(players, ({ many }) => ({
  eventPlayers: many(eventPlayers),
  groupPlayers: many(groupPlayers),
}));


export const matches = createTable(
  "match",
  {
    id: serial("id").primaryKey(),
    eventId: integer("event_id").references(() => events.id),
    groupId: integer("group_id").references(() => groups.id),
    player1: integer("player1_id").references(() => players.id),
    player2: integer("player2_id").references(() => players.id),
    player1Score: integer("player1_score").default(0),
    player2Score: integer("player2_score").default(0),
    // make this null by default
    // winner: integer("winner").references(() => players.id).default(sql`NULL`),
    round: integer("round"),
    table: integer("table"),

  }
)

export type MatchType = InferSelectModel<typeof matches>

export const matchesRelations = relations(matches, ({ one }) => ({
  eventId: one(events, {
    fields: [matches.eventId],
    references: [events.id],
  }),
  groupId: one(groups, {
    fields: [matches.groupId],
    references: [groups.id],
  }),
  player1: one(players, {
    fields: [matches.player1],
    references: [players.id],
  }),
  player2: one(players, {
    fields: [matches.player2],
    references: [players.id],
  }),
}));


export const groups = createTable(
  "group",
  {
    id: serial("id").primaryKey(),
    eventId: integer("event_id").references(() => events.id),
    groupLetter: varchar("group_letter", { length: 256 }),
    numOfPlayers: integer("num_of_players").default(0),
  }
)

export const groupPlayers = createTable(
  "group_player",
  {
    id: serial("id").primaryKey(),
    groupId: integer("group_id").notNull().references(() => groups.id),
    playerId: integer("player_id").notNull().references(() => players.id),
    eventId: integer("event_id").notNull().references(() => events.id),
  },
  (table) => ({
    groupPlayerUnique: uniqueIndex("group_player_unique_idx").on(table.groupId, table.playerId),
  })
)

export const groupPlayersRelations = relations(groupPlayers, ({ one }) => ({
  group: one(groups, {
    fields: [groupPlayers.groupId],
    references: [groups.id],
  }),
  player: one(players, {
    fields: [groupPlayers.playerId],
    references: [players.id],
  }),
  event: one(events, {
    fields: [groupPlayers.eventId],
    references: [events.id],
  }),
}));

export const groupsRelations = relations(groups, ({ many }) => ({
  groupPlayers: many(groupPlayers),
}));

export type GroupWithPlayersType = GroupType & {
  players: PlayerType[];
};

export type GroupType = InferSelectModel<typeof groups>