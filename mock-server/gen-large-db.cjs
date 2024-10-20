const fs = require("node:fs");
const db = require("./db.json");

const content = JSON.stringify(generateDataSet());

fs.writeFile("mock-server/large-db.json", content, (err) => {
  if (err) {
    console.error(err);
  }
});

function generateDataSet() {
  const count = 30;
  const transactions = [];
  const categoryMetadata = db["category-metadata"];
  const today = Date.UTC(2024, 11, 20);
  const msInOneDay = 24 * 60 * 60 * 1000;
  for (let i = 0; i < count; i++) {
    transactions.push({
      id: String(1000 + i),
      amount: -randomInt(20000),
      category: String(randomSample(categoryMetadata).id),
      timestamp: today - randomInt(150) * msInOneDay
    });
  }
  const largeDb = {
    "category-metadata": categoryMetadata,
    transactions,
  };
  return largeDb;
}

function randomInt(max) {
  return Math.trunc(Math.random() * max);
}

function randomSample(arr) {
  return arr[Math.trunc(arr.length * Math.random())];
}
