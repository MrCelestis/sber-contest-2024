import db from '../../mock-server/db.json';

export default defineEventHandler((event) => {
  return db.transactions;
});
