import {WishlistModel} from "@/app/models/Wishlist";
import {withAuth} from "@workos-inc/authkit-nextjs";
import mongoose from "mongoose";
import {NextRequest} from "next/server";

export async function GET(req: NextRequest) {
  const {user} = await withAuth();
  const jobId = req.nextUrl.searchParams.get('jobId');

  if (!user || !jobId) {
    return Response.json({wishlisted: false});
  }

  await mongoose.connect(process.env.MONGODB_URI!);
  const existing = await WishlistModel.findOne({userId: user.id, jobId});
  return Response.json({wishlisted: !!existing});
}

export async function POST(req: NextRequest) {
  const {user} = await withAuth();
  if (!user) {
    return Response.json({error: 'Not logged in'}, {status: 401});
  }

  const {jobId} = await req.json();
  await mongoose.connect(process.env.MONGODB_URI!);

  const existing = await WishlistModel.findOne({userId: user.id, jobId});
  if (existing) {
    await WishlistModel.deleteOne({_id: existing._id});
    return Response.json({wishlisted: false});
  } else {
    await WishlistModel.create({userId: user.id, jobId});
    return Response.json({wishlisted: true});
  }
}