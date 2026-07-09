import Hero from "@/app/components/Hero";
import Jobs from "@/app/components/Jobs";
import {addOrgAndUserData, JobModel} from "@/app/models/Job";
import {withAuth} from "@workos-inc/authkit-nextjs";
import mongoose from "mongoose";

export default async function Home() {
  const {user} = await withAuth ();
  await mongoose.connect(process.env.MONGODB_URI as string);
  const latestJobs = await addOrgAndUserData(
    await JobModel.find({},{},{limit:5,sort:'-createdAt'}),
    user,
  );
  return (
    <>
      <Hero />
      <Jobs header={''} jobs={latestJobs} />
    </>
  );
}