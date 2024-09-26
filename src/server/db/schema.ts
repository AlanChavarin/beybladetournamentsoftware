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

export const groups = createTable(
  "group",
  {
    id: serial("id").primaryKey(),
    eventId: integer("event_id").notNull().references(() => events.id),
    groupLetter: varchar("group_letter", { length: 256 }),
    numOfPlayers: integer("num_of_players").default(0),
  }
)

export const players = createTable(
  "player",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }),
    eventId: integer("event_id").notNull().references(() => events.id),
    groupId: integer("group_id").references(() => groups.id),
    numberOfWins: integer("number_of_wins").default(0),
    totalScore: integer("total_score").default(0),
  }
)

export type PlayerType = InferSelectModel<typeof players>

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
  event: one(events, {
    fields: [matches.eventId],
    references: [events.id],
  }),
  group: one(groups, {
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

export const groupsRelations = relations(groups, ({ one, many }) => ({
  event: one(events, {
    fields: [groups.eventId],
    references: [events.id],
  }),
  players: many(players),
  matches: many(matches),
}));

export const playersRelations = relations(players, ({ one }) => ({
  event: one(events, {
    fields: [players.eventId],
    references: [events.id],
  }),
  group: one(groups, {
    fields: [players.groupId],
    references: [groups.id],
  }),
}));


export type GroupWithPlayersType = GroupType & {
  players: PlayerType[];
};

export type MatchWithPlayersType = MatchType & {
  player1?: PlayerType;
  player2?: PlayerType;
};

export type GroupWithMatchesWithPlayersType = GroupType & {
  matches?: MatchWithPlayersType[];
};

export type formattedGroupWithMatchesWithPlayersType = GroupType & {
  matches?: MatchWithPlayersType[][];
};

export type GroupType = InferSelectModel<typeof groups>