// 'use client'
// import dbConnect from '@/lib/dbConnect'
// import Product from '@/lib/models/ProductModel'
// import { NextApiRequest, NextApiResponse } from 'next'
// import { useSession } from 'next-auth/react'

// const handler = async (req: NextApiRequest, res: NextApiResponse) => {
//   const { data: session } = useSession()

//   if (
//     !session ||
//     (session.user.role !== 'admin' && session.user.role !== 'moderator')
//   ) {
//     return res.status(403).json({ message: 'Access denied' })
//   }
// }

// export default handler
