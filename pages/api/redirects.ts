import { getServerSession } from "next-auth/next";

import { authOptions } from "./auth/[...nextauth]";
import { HttpMethod } from "@/types";

import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { getVercelDomain } from "@/lib/api";

export default async function redirects(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) return res.status(401).end();

  switch (req.method) {
    case HttpMethod.GET:
      const db = await prisma.redirect.findMany({
        where: {
          owner: {
            email: session?.user?.email as string
          }
        }
      })

      return res.status(200).json(db);

    default:
      res.setHeader("Allow", [HttpMethod.GET]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
