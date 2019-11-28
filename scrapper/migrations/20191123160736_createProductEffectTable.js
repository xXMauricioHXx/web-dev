/**
 * @param {import('knex')} knex
 */
exports.up = (knex) =>
  knex.schema.createTable('productEffect', (table) => {
    table.bigIncrements('id').unsigned();
    table
      .bigInteger('productId')
      .unsigned()
      .references('id')
      .inTable('product');
    table
      .bigInteger('effectId')
      .unsigned()
      .references('id')
      .inTable('effect');
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
exports.down = (knex) => knex.schema.dropTable('productEffect');
