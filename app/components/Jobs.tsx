import JobRow from "@/app/components/JobRow";
import type { Job } from "@/app/models/Job";

export default function Jobs({
  header,
  jobs,
}: {
  header: string;
  jobs: Job[];
}) {
  return (
    <div className="bg-slate-200 py-6 rounded-3xl">
      <div className="container mx-auto px-4">
        <h2 className="mb-4 text-xl font-bold">
          {header || "Recent jobs"}
        </h2>

        <div className="flex flex-col gap-4">
          {!jobs?.length && (
            <div className="text-center text-gray-500">
              No jobs found
            </div>
          )}

          {jobs?.map((job) => (
            <JobRow key={job._id} jobDoc={job} />
          ))}
        </div>
      </div>
    </div>
  );
}