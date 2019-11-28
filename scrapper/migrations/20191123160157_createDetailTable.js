/**
 * @param {import('knex')} knex
 */
exports.up = (knex) =>
  knex.schema.createTable('detail', (table) => {
    table.bigIncrements('id').unsigned();
    table.string('externalId').notNullable();
    table
      .float('price')
      .notNullable()
      .unsigned();
    table
      .float('oldPrice')
      .notNullable()
      .unsigned();
    table.string('description').notNullable();
    table
      .integer('installments')
      .nullable()
      .unsigned();
    table.string('imageUrl').notNullable();
    table.string('shippingPrice').nullable();

    table.string('link').notNullable();
    table.string('brand').notNullable();
    table
      .bigInteger('sallerId')
      .unsigned()
      .references('id')
      .inTable('saller');
    table.string('sku').nullable();
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
exports.down = (knex) => knex.schema.dropTable('detail');
