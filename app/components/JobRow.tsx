'use client';
import {Job} from "@/app/models/Job";
import TimeAgo from "@/app/components/TimeAgo";
import {faHeart} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import axios from "axios";
import Link from "next/link";
import {useEffect, useState} from "react";

export default function JobRow({jobDoc}:{jobDoc:Job}) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    axios.get('/api/wishlist?jobId=' + jobDoc._id)
      .then(res => setIsWishlisted(res.data.wishlisted))
      .catch(() => {});
  }, [jobDoc._id]);

  async function toggleWishlist() {
    try {
      const res = await axios.post('/api/wishlist', {jobId: jobDoc._id});
      setIsWishlisted(res.data.wishlisted);
    } catch (err) {
      alert('Please log in to save jobs to your wishlist');
    }
  }

  return (
    <>
      <div className="bg-white p-4 rounded-lg shadow-sm relative">
        <div
          className="absolute cursor-pointer top-4 right-4"
          onClick={toggleWishlist}
        >
          <FontAwesomeIcon
            className={`size-4 transition-colors ${isWishlisted ? 'text-red-500' : 'text-gray-300 hover:text-red-300'}`}
            icon={faHeart}
          />
        </div>
        <div className="flex grow gap-4">
          <div className="content-center w-12 basis-12 shrink-0">
           {jobDoc?.jobIcon && (
              <img
                className="size-12"
                src={jobDoc.jobIcon}
                alt=""
              />
            )}
          </div>
          <div className="grow sm:flex">
            <div className="grow">
              <div>
                <Link href={`/jobs/${jobDoc.orgId}`} className="hover:underline text-gray-500 text-sm">{jobDoc.orgName || '?'}</Link>
              </div>
              <div className="font-bold text-lg mb-1">
                <Link className="hover:underline" href={'/show/'+jobDoc._id}>{jobDoc.title}</Link>
              </div>
              <div className="text-gray-400 text-sm capitalize">
                {jobDoc.remote}
                {' '}&middot;{' '}
                {jobDoc.city}, {jobDoc.country}
                {' '}&middot;{' '}
                {jobDoc.type}-time
                {jobDoc.salary && (
                  <>
                    {' '}&middot;{' '}
                    <span className="text-green-600 font-medium">${jobDoc.salary}k/year</span>
                  </>
                )}
                {jobDoc.isAdmin && (
                  <>
                    {' '}&middot;{' '}
                    <Link href={'/jobs/edit/'+jobDoc._id}>Edit</Link>
                    {' '}&middot;{' '}
                    <button
                    className="cursor-pointer hover:underline hover:text-red-700"
                      type="button"
                      onClick={async () => {
                        await axios.delete('/api/jobs?id='+jobDoc._id);
                        window.location.reload();

                      }}>
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
            {jobDoc.createdAt && (
              <div className="content-end text-gray-500 text-sm">
                <TimeAgo createdAt={jobDoc.createdAt} />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}