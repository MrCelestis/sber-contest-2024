import db from '../../mock-server/db.json';

//this is dev api only, should be disabled in prod build
export default defineEventHandler((event) => {
  return db['category-metadata'];
});
