import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('call_queue', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').notNullable().references('id').inTable('users');
    table.uuid('group_id').notNullable().references('id').inTable('groups');
    table.timestamp('joined_at').notNullable().defaultTo(knex.fn.now());
    table.timestamp('matched_at').nullable();
    table.integer('priority').notNullable().defaultTo(0);
    table.jsonb('preferences').defaultTo('{}');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('call_queue');
} 