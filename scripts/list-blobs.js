import { list } from "@vercel/blob";

async function main() {
  const { blobs } = await list();
  for (const blob of blobs) {
    console.log(`pathname: ${blob.pathname}`);
    console.log(`url: ${blob.url}`);
    console.log(`---`);
  }
}

main().catch(console.error);
