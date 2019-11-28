/**
 * @param {import('knex')} knex
 */
exports.up = (knex) =>
  knex.schema.createTable('user', (table) => {
    table.bigIncrements('id').unsigned();
    table
      .string('name')
      .notNullable()
      .unique('user_name');
    table
      .string('email')
      .notNullable()
      .unique('user_email');
    table.string('password').notNullable();
    table.string('cep').nullable();
    table
      .dateTime('createdAt')
      .notNullable()
      .defaultTo(knex.raw('CURRENT_TIMESTAMP'));
    table
      .dateTime('updatedAt')
      .notNullable()
      .defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
  });

/**
 * @param {import('knex')} knex
 */
exports.down = (knex) => knex.schema.dropTable('user');
