import { getServerSession } from "next-auth/next";

import { authOptions } from "./auth/[...nextauth]";
import { HttpMethod } from "@/types";

import type { NextApiRequest, NextApiResponse } from "next";
import { checkVercelDomain, createDatabaseDomain, createVercelDomain, deleteDatabaseDomain, getDatabaseDomain, getVercelDomain, verifyVercelDomain } from "@/lib/api";

export default async function domain(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) return res.status(401).end();

  const domain = req.query.domain as string;

  switch (req.method) {
    case HttpMethod.POST:
      return res.status(200).json({ db: await createDatabaseDomain(domain, session), vercel: await createVercelDomain(domain) });

    case HttpMethod.DELETE:
      return res.status(200).json({ db: await deleteDatabaseDomain(domain), vercel: await getVercelDomain(domain) });

    case HttpMethod.GET:
      const check = !!req.query.check;
      const verify = !!req.query.verify;

      if (check) {
        return res.status(200).json(await checkVercelDomain(domain));
      }

      if (verify) {
        return res.status(200).json(await verifyVercelDomain(domain));
      }

      return res.status(200).json({ db: await getDatabaseDomain(domain), vercel: await getVercelDomain(domain) });

    default:
      res.setHeader("Allow", [HttpMethod.POST, HttpMethod.DELETE, HttpMethod.GET]);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
