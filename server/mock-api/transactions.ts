import db from '../../mock-server/db.json';

export default defineEventHandler((event) => {
  console.log('MOCK API: transactions', event.toJSON());
  return db.transactions;
});
