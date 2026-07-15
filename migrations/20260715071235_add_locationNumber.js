/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  const hasColumn = await knex.schema.hasColumn('locations', 'locationNumber');
  if (!hasColumn) {
    await knex.schema.alterTable('locations', table => {
      table.integer('locationNumber').notNullable().defaultTo(0);
    });
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  const hasColumn = await knex.schema.hasColumn('locations', 'locationNumber');
  if (hasColumn) {
    await knex.schema.alterTable('locations', table => {
      table.dropColumn('locationNumber');
    });
  }
};
