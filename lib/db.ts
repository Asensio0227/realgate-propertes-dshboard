import mongoose from 'mongoose';

declare global {
  var _mongooseConn: typeof mongoose | null;
  var _mongoosePromise: Promise<typeof mongoose> | null;
}

const MONGO_URI = process.env.MONGO_URL as string;

if (!MONGO_URI) throw new Error('MONGO_URI is not defined in .env.local');

let cached = global._mongooseConn;
let promise = global._mongoosePromise;

export async function connectDB(): Promise<typeof mongoose> {
  if (cached) return cached;

  if (!promise) {
    promise = mongoose.connect(MONGO_URI, {
      bufferCommands: false,
    });
    global._mongoosePromise = promise;
  }

  cached = await promise;
  global._mongooseConn = cached;
  return cached;
}
