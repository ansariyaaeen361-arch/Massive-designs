import dns from 'node:dns';
import mongoose from 'mongoose';

// Some local/VPN DNS resolvers don't handle SRV record lookups (used by
// mongodb+srv:// URIs), which times out or refuses the query even though
// normal A/AAAA lookups work fine. Falling back to public resolvers avoids
// that class of connection failure.
dns.setServers(['8.8.8.8', '1.1.1.1']);

export async function connectDb() {
  const uri = process.env.MONGODB_URI;
  await mongoose.connect(uri);
  console.log('MongoDB connected');
}
