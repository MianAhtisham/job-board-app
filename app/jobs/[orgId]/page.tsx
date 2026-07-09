import Jobs from "@/app/components/Jobs";
import { addOrgAndUserData, JobModel } from "@/app/models/Job";
import { withAuth } from "@workos-inc/authkit-nextjs";
import { WorkOS } from "@workos-inc/node";
import mongoose from "mongoose";

type PageProps = {
  params: Promise<{
    orgId: string;
  }>;
};

export default async function CompanyJobsPage(
  props: PageProps
) {
  const { orgId } = await props.params;

  const workos = new WorkOS(process.env.WORKOS_API_KEY!);

  let org;
  try {
    org = await workos.organizations.getOrganization(orgId);
  } catch (err) {
    return (
      <div className="container my-8">
        <p className="text-gray-500">This company no longer exists.</p>
      </div>
    );
  }

  const { user } = await withAuth();

  await mongoose.connect(
    process.env.MONGODB_URI!
  );

  let jobsDocs = JSON.parse(
    JSON.stringify(await JobModel.find({ orgId }))
  );

  jobsDocs = await addOrgAndUserData(
    jobsDocs,
    user
  );

  return (
    <div>
      <div className="container">
        <div className="my-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {org.name}
          </h1>
          <p className="text-gray-500 mt-1">
            Explore open positions at {org.name}
          </p>
        </div>
      </div>

      <Jobs
        jobs={jobsDocs}
        header={"Jobs posted by " + org.name}
      />
    </div>
  );
}