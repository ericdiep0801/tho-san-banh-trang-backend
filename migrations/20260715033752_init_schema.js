/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  // Locations table ONLY
  await knex.schema.createTable('locations', table => {
    table.string('id').primary();
    table.string('name').notNullable();
    table.float('lat', 10, 6);
    table.float('lng', 10, 6);
    table.string('address');
    table.text('description');
    table.float('rating', 3, 1);
    table.json('images');
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('locations');
};
