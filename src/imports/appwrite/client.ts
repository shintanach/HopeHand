import { Client, Account, Databases, Storage, Messaging } from "appwrite";
import { APPWRITE_ENDPOINT, APPWRITE_PROJECT_ID } from "./config";

// ── Singleton Client ──────────────────────────────────────
const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID);

// ── Service Instances ─────────────────────────────────────
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const messaging = new Messaging(client);

export default client;
