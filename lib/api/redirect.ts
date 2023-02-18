import prisma from "@/lib/prisma";
import { Session } from "next-auth";

export function createRedirect(domain: string, pattern: RegExp, targetUrl: string, session: Session) {
  const message = prisma.redirect.create({
    data: {
      domain: {
        connect: {
          domain: domain
        }
      },
      owner: {
        connect: {
          email: session.user.email as string
        }
      },
      pattern: pattern.source,
      targetUrl
    }
  })

  return message;
}

export function deleteRedirect(id: string) {
  const message = prisma.redirect.delete({
    where: {
      id
    }
  })

  return message;
}

export function updateRedirect(id: string, pattern: RegExp, targetUrl: string) {
  const message = prisma.redirect.update({
    where: {
      id
    },
    data: {
      pattern: pattern.source,
      targetUrl
    }
  })

  return message;
}

export function getRedirect(pattern: RegExp) {
  const message = prisma.redirect.findFirst({
    where: {
      pattern: pattern.source
    }
  })

  return message;
}

export function getRedirectsByDomain(domain: string) {
  const message = prisma.redirect.findMany({
    where: {
      domain: {
        domain
      }
    }
  })

  return message;
}

export function getRedirectsByOwner(email: string) {
  const message = prisma.redirect.findMany({
    where: {
      owner: {
        email
      }
    }
  })

  return message;
}
