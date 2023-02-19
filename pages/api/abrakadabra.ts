import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { domain } = req.query

  console.log(domain)

  const db = await prisma.redirect.findMany({
    where: {
      domain: {
        domain: domain as string
      }
    }
  })

  console.log(db)

  if (!db) {
    return res.redirect(301, '/')
  }

  return res.redirect(301, db[0]?.targetUrl as string)
}
