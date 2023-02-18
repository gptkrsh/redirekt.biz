import prisma from "@/lib/prisma";
import { HttpMethod } from "@/types";
import { Session } from "next-auth";

export async function createDatabaseDomain(
  domain: string,
  session: Session
) {
  const message = prisma.domain.create({
    data: {
      domain,
      user: {
        connect: {
          email: session?.user?.email as string
        }
      }
    }
  })

  return message;
}

export async function deleteDatabaseDomain(domain: string) {
  const message = prisma.domain.delete({
    where: {
      domain
    }
  })

  return message;
}

export async function getDatabaseDomain(domain: string) {
  const message = prisma.domain.findFirst({
    where: {
      domain
    }
  })

  return message;
}

export async function createVercelDomain(
  domain: string,
) {
  const response = await fetch(
    `https://api.vercel.com/v9/projects/${process.env.PROJECT_ID_VERCEL}/domains?teamId=${process.env.TEAM_ID_VERCEL}`,
    {
      body: `{\n  "name": "${domain}"\n}`,
      headers: {
        Authorization: `Bearer ${process.env.AUTH_BEARER_TOKEN}`,
        'Content-Type': 'application/json',
      },
      method: HttpMethod.POST,
    }
  )

  const data = await response.json()

  return data;
}

export async function deleteVercelDomain(
  domain: string,
) {
  const response = await fetch(`https://api.vercel.com/v9/projects/${process.env.PROJECT_ID_VERCEL}/domains/${domain}`, {
    "headers": {
      "Authorization": `Bearer ${process.env.AUTH_BEARER_TOKEN}`
    },
    "method": HttpMethod.DELETE
  })

  const data = await response.json()

  return data;
}

export async function getVercelDomain(
  domain: string,
) {
  const response = await fetch(`https://api.vercel.com/v9/projects/${process.env.PROJECT_ID_VERCEL}/domains/${domain}`, {
    "headers": {
      Authorization: `Bearer ${process.env.AUTH_BEARER_TOKEN}`,
      'Content-Type': 'application/json',
    },
    "method": HttpMethod.GET
  })

  const data = await response.json()

  return data;
}

export async function checkVercelDomain(
  domain: string,
) {
  const [configResponse, domainResponse] = await Promise.all([
    fetch(
      `https://api.vercel.com/v6/domains/${domain}/config?teamId=${process.env.TEAM_ID_VERCEL}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${process.env.AUTH_BEARER_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    ),
    await getVercelDomain(domain),
  ])

  const configJson = await configResponse.json()
  const domainJson = await domainResponse.json()
  if (domainResponse.status !== 200) {
    return domainJson
  }
  let verificationResponse = null
  if (!domainJson.verified) {
    const verificationRes = await fetch(
      `https://api.vercel.com/v9/projects/${process.env.PROJECT_ID_VERCEL}/domains/${domain}/verify?teamId=${process.env.TEAM_ID_VERCEL}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.AUTH_BEARER_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    )
    verificationResponse = await verificationRes.json()
  }

  if (verificationResponse && verificationResponse.verified) {
    return {
      configured: !configJson.misconfigured,
      ...verificationResponse,
    }
  }

  return {
    configured: !configJson.misconfigured,
    ...domainJson,
    ...(verificationResponse ? { verificationResponse } : {}),
  }
}

export async function verifyVercelDomain(
  domain: string,
) {
  const response = await fetch(
    `https://api.vercel.com/v9/projects/${process.env.PROJECT_ID_VERCEL}/domains/${domain}/verify?teamId=${process.env.TEAM_ID_VERCEL}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.AUTH_BEARER_TOKEN}`,
        'Content-Type': 'application/json',
      },
      method: 'POST',
    }
  )

  const data = await response.json()

  return data;
}