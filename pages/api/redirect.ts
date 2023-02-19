import { getServerSession } from "next-auth/next";

import { authOptions } from "./auth/[...nextauth]";
import { HttpMethod } from "@/types";

import type { NextApiRequest, NextApiResponse } from "next";
import { checkVercelDomain, createDatabaseDomain, createRedirect, createVercelDomain, deleteDatabaseDomain, deleteRedirect, getDatabaseDomain, getVercelDomain, verifyVercelDomain } from "@/lib/api";

export default async function domain(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) return res.status(401).end();

  const domain = req.query.domain as string;
  const targetUrl = req.query.targetUrl as string

  switch (req.method) {
    case HttpMethod.POST:
      return res.status(200).json(await createRedirect(domain, new RegExp('.*'), targetUrl, session));

    default:
      res.setHeader("Allow", [HttpMethod.POST]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
