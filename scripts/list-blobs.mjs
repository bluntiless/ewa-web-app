import { list } from '@vercel/blob';

async function main() {
  const { blobs } = await list();
  for (const blob of blobs) {
    console.log(`${blob.pathname} => ${blob.url}`);
  }
}

main().catch(console.error);
