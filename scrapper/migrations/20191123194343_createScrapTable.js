/**
 * @param {import('knex')} knex
 */
exports.up = (knex) =>
  knex.schema.createTableIfNotExists('scrap', (table) => {
    table.bigIncrements('id').unsigned();
    table
      .bigInteger('sallerId')
      .unsigned()
      .references('id')
      .inTable('saller');
    table.string('cep').notNullable();
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
exports.down = (knex) => knex.schema.dropTable('scrap');
