import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('call_feedback', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('gen_random_uuid()'));
    table.uuid('call_session_id').notNullable().references('id').inTable('call_sessions');
    table.uuid('user_id').notNullable().references('id').inTable('users');
    table.integer('rating').notNullable();
    table.text('feedback');
    table.timestamp('created_at').notNullable().defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable('call_feedback');
} 