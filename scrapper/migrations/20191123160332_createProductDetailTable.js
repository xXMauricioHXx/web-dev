/**
 * @param {import('knex')} knex
 */
exports.up = (knex) =>
  knex.schema.createTable('productDetail', (table) => {
    table.bigIncrements('id').unsigned();
    table
      .bigInteger('productId')
      .unsigned()
      .references('id')
      .inTable('product');
    table
      .bigInteger('detailId')
      .unsigned()
      .references('id')
      .inTable('detail');
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
exports.down = (knex) => knex.schema.dropTable('productDetail');
