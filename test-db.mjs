import { MongoClient } from "mongodb";

const uri = process.env.BETTER_AUTH_DB_URL;

if (!uri) {
  console.error(" BETTER_AUTH_DB_URL .env e NAI — variable name check korun!");
  process.exit(1);
}

const client = new MongoClient(uri);
try {
  await client.connect();
  await client.db("admin").command({ ping: 1 });
  console.log("MongoDB CONNECTED — connection thik ache!");
} catch (err) {
  console.error("MongoDB FAIL:", err.message);
} finally {
  await client.close();
}