import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('call_sessions', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('caller_id').notNullable().references('id').inTable('users');
    table.uuid('receiver_id').notNullable().references('id').inTable('users');
    table.uuid('group_id').notNullable().references('id').inTable('groups');
    table.timestamp('started_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('ended_at');
    table.integer('duration');
    table.integer('quality_rating');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('call_sessions');
} 