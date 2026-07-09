import {JobModel} from "@/app/models/Job";
import {faEnvelope, faLocationDot, faPhone} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import mongoose from "mongoose";
import Image from "next/image";

type PageProps = {
  params: Promise<{
    jobId: string;
  }>;
};

export default async function SingleJobPage(props:PageProps) {
  const {jobId} = await props.params;
  await mongoose.connect(process.env.MONGODB_URI as string);
  const jobDoc = await JobModel.findById(jobId);

  if (!jobDoc) {
    return <div className="container mt-8">Job not found</div>;
  }

  return (
    <div className="container mt-10 mb-16 max-w-3xl">
      <div className="bg-white border rounded-2xl shadow-sm p-8">
        <div className="sm:flex sm:items-start sm:justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">{jobDoc.title}</h1>
            <div className="flex flex-wrap gap-2 mb-2">
              <span className="capitalize bg-blue-50 text-blue-700 text-xs font-medium px-3 py-1 rounded-full">
                {jobDoc.remote}
              </span>
              <span className="capitalize bg-gray-100 text-gray-700 text-xs font-medium px-3 py-1 rounded-full">
                {jobDoc.type}-time
              </span>
              {jobDoc.salary && (
                <span className="bg-green-50 text-green-700 text-xs font-medium px-3 py-1 rounded-full">
                  ${jobDoc.salary}k/year
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-sm text-gray-500">
              <FontAwesomeIcon icon={faLocationDot} className="size-3.5" />
              {jobDoc.city}, {jobDoc.country}
            </div>
          </div>
          {jobDoc?.jobIcon && (
            <Image
              src={jobDoc.jobIcon} alt={'job icon'}
              width={500} height={500}
              className="w-16 h-16 rounded-lg object-cover mt-4 sm:mt-0 shrink-0"
            />
          )}
        </div>

        <hr className="my-6 border-gray-100" />

        <div className="whitespace-pre-line text-sm leading-relaxed text-gray-600">
          {jobDoc.description}
        </div>
      </div>

      <div className="mt-6 bg-gray-50 border rounded-2xl p-8">
        <h3 className="font-semibold text-gray-900 mb-4">Apply by contacting us</h3>
        <div className="flex items-center gap-4">
          {jobDoc?.contactPhoto && (
            <Image
              src={jobDoc.contactPhoto}
              alt={'contact person'}
              width={500} height={500}
              className="w-16 h-16 rounded-full object-cover shrink-0"
            />
          )}
          <div className="flex flex-col gap-1 text-sm">
            <div className="font-medium text-gray-900">{jobDoc.contactName}</div>
            <div className="flex items-center gap-2 text-gray-600">
              <FontAwesomeIcon icon={faEnvelope} className="size-3.5 text-gray-400" />
              {jobDoc.contactEmail}
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <FontAwesomeIcon icon={faPhone} className="size-3.5 text-gray-400" />
              {jobDoc.contactPhone}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}