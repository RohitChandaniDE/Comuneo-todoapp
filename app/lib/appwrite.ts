import { Client, Account, Databases } from 'appwrite';

// Appwrite Configuration
const APPWRITE_ENDPOINT = import.meta.env.VITE_APPWRITE_ENDPOINT;
const APPWRITE_PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;

// Initialize Client
const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID);

// Initialize Services
export const account = new Account(client);
export const databases = new Databases(client);

// Database & Collection IDs
export const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
export const TODOS_COLLECTION_ID = import.meta.env.VITE_APPWRITE_TODOS_COLLECTION_ID;

export { client };
