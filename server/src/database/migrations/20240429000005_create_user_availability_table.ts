import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('user_availability', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('user_id').notNullable().references('id').inTable('users');
    table.boolean('is_available').notNullable().defaultTo(false);
    table.timestamp('last_updated').notNullable().defaultTo(knex.fn.now());
    table.jsonb('preferences').defaultTo('{}');
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('user_availability');
} 