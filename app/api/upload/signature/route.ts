import { NextRequest, NextResponse } from 'next/server'
import { getUserIdFromRequest } from '@/lib/auth'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
})

export async function POST(req: NextRequest) {
  const userId = await getUserIdFromRequest(req)
  if (!userId) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { folder = 'boursedutemps' } = await req.json().catch(() => ({}))

  const timestamp = Math.round(Date.now() / 1000)
  const paramsToSign = { timestamp, folder }

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET!
  )

  return NextResponse.json({
    signature,
    timestamp,
    folder,
    api_key: process.env.CLOUDINARY_API_KEY!,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  })
}
