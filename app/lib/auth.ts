import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

// Next.js dev hot-reload-এ বারবার new client তৈরি হয়ে connection pool শেষ হয় — তাই global cache
const globalForMongo = globalThis as unknown as { mongoClient?: MongoClient };

const client =
  globalForMongo.mongoClient ??

  new MongoClient(process.env.BETTER_AUTH_DB_URL!);

globalForMongo.mongoClient = client;

const db = client.db("bazardor");

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET, // এটাও .env-এ যোগ করুন
  emailAndPassword: { enabled: true },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },
  database: mongodbAdapter(db), // local/standalone হলে {client} বাদ
  // Atlas (replica set) হলে: mongodbAdapter(db, { client })
});