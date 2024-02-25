import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";
import { MAX_FREE_COUNTS } from "@/constants";

export const increaseApiLimit = async () => {
  const { userId } = auth()

  if (!userId) {
    return
  }

  const useApiLimit = await prismadb.userApiLimit.findUnique({
    where: {
      userId,
    }
  })

  if (useApiLimit) {
    await prismadb.userApiLimit.update({
      where: {
        userId,
      },
      data: {
        count: useApiLimit.count + 1
      }
    })
  } else {
    await prismadb.userApiLimit.create({
      data: {
        userId,
        count: 1
      }
    })
  }
}

export const checkApiLimit = async () => {
  const { userId } = auth()

  if (!userId) {
    return false
  }

  const useApiLimit = await prismadb.userApiLimit.findUnique({
    where: {
      userId,
    }
  })

  if (!useApiLimit || useApiLimit.count <= MAX_FREE_COUNTS) {
    return true
  } else {
    return false
  }
}