import { authenticate } from "../server/shopify.server";

export const loader = async ({ request }) => {
  await authenticate.admin(request);

  return null;
};
