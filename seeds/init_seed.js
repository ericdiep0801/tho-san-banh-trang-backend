const fs = require('fs');
const path = require('path');

const readData = (file) => {
  try {
    const data = fs.readFileSync(path.join(__dirname, '../data', file), 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('locations').del();

  const locations = readData('locations.json');

  // Stringify JSON array for locations.images to avoid mysql JSON mapping issues
  const mappedLocations = locations.map(loc => ({
    ...loc,
    images: JSON.stringify(loc.images || [])
  }));
  
  if (mappedLocations.length > 0) {
    await knex('locations').insert(mappedLocations);
  }
};
