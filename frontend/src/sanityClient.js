import { createClient } from '@sanity/client';

export const client = createClient({
  projectId: 'r5e8x9gi',
  dataset: 'production',
  useCdn: true,
  apiVersion: '2026-03-01',
});

// Fixes the exact 'sanityClient is not exported' compilation crash
export const sanityClient = client;
export default client;
