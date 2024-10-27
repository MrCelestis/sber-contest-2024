import db from '../../mock-server/db.json';

//this is dev api only, should be disabled in prod build
export default defineEventHandler((event) => {
  event.node.res.setHeader('access-control-allow-origin', '*');
  return db['category-metadata'];
});
