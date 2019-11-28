/**
 * @param {import('knex')} knex
 */
exports.up = (knex) =>
  knex.schema.createTable('scrapCategory', (table) => {
    table.bigIncrements('id').unsigned();
    table
      .bigInteger('scrapId')
      .unsigned()
      .references('id')
      .inTable('scrap');
    table
      .bigInteger('categoryId')
      .unsigned()
      .references('id')
      .inTable('category');
    table.integer('start').unsigned();
    table.integer('end').unsigned();
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
exports.down = (knex) => knex.schema.dropTable('scrapCategory');
