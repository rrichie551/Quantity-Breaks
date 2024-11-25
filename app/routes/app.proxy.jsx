import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import prisma from "../db.server";

export const loader = async ({ request }) => {
  const { session } = await authenticate.public.appProxy(request);
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }
  console.log("This is the id: ",session.id);
  const sessions = await prisma.session.findUnique({
    where: {
        id: session.id
      },
    include: {
        volumes: true,
        combos: true
    }
  });
  return json({ message: sessions });
};

export const action = async ({ request, params }) => {
  const { session } = await authenticate.public.appProxy(request);

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  return json({ message: "Hello from action proxy!" });
};