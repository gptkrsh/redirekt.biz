import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { domain } = req.query

  console.log(domain)

  const db = await prisma.redirect.findUnique({
    where: {
      domainUrl: domain as string
    }
  })

  if (!db) {
    return res.redirect('/')
  }

  return res.redirect(db.domainUrl)
}
