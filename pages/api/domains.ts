import { getServerSession } from "next-auth/next";

import { authOptions } from "./auth/[...nextauth]";
import { HttpMethod } from "@/types";

import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";
import { getVercelDomain } from "@/lib/api";

export default async function domain(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) return res.status(401).end();

  switch (req.method) {
    case HttpMethod.GET:
      const db = await prisma.domain.findMany({
        where: {
          user: {
            email: session?.user?.email as string
          }
        }
      })

      let vercel: Array<Object> = []

      for (const row of db) {
        vercel = [...vercel, await getVercelDomain(row.domain)]
      }

      return res.status(200).json({
        db,
        vercel
      });

    default:
      res.setHeader("Allow", [HttpMethod.GET]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
