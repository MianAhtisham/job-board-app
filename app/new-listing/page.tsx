import { createCompany, deleteCompany } from "@/app/actions/workosActions";
import { faArrowRight, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { withAuth } from "@workos-inc/authkit-nextjs";
import { WorkOS } from "@workos-inc/node";
import Link from "next/link";

export default async function NewListingPage() {
  const workos = new WorkOS(process.env.WORKOS_API_KEY!);

  const { user } = await withAuth();

  if (!user) {
    return (
      <div className="container gap">
        <div className="mt-6">
          You need to be logged in to post a job
        </div>
      </div>
    );
  }

  const organizationMemberships =
    await workos.userManagement.listOrganizationMemberships({
      userId: user.id,
    });

  const activeOrganizationMemberships =
    organizationMemberships.data.filter(
      (om) => om.status === "active"
    );

  const organizationsNames: { [key: string]: string } = {};

  for (const activeMembership of activeOrganizationMemberships) {
    const organization = await workos.organizations.getOrganization(
      activeMembership.organizationId
    );
    organizationsNames[organization.id] = organization.name;
  }

  const orgIds = Object.keys(organizationsNames);

  return (
    <div className="container">
      <div>
        <h2 className="mt-6 ml-6 text-lg font-semibold">
          Your companies
        </h2>

        <p className="mb-3 ml-6 text-sm text-gray-500">
          Select a company to create a job add for
        </p>

        <div className="ml-6 flex flex-col gap-3">
          {orgIds.map((orgId) => (
            <div
              key={orgId}
              className="flex items-center gap-3 max-w-md"
            >
              <Link
                href={`/new-listing/${orgId}`}
                className="flex items-center capitalize justify-between gap-6 px-4 py-3 rounded-md border bg-white hover:bg-gray-50 grow"
              >
                <span>{organizationsNames[orgId]}</span>
                <FontAwesomeIcon
                  className="h-4 w-4 text-gray-500"
                  icon={faArrowRight}
                />
              </Link>

              <form
                action={async () => {
                  'use server';
                  await deleteCompany(orgId);
                }}
              >
                <button
                  type="submit"
                  className="flex items-center justify-center px-3 py-3 rounded-md border bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
                  title="Delete company"
                >
                  <FontAwesomeIcon className="h-4 w-4" icon={faTrash} />
                </button>
              </form>
            </div>
          ))}
        </div>

        {organizationMemberships.data.length === 0 && (
          <div className="mt-4 ml-4 rounded-md border border-blue-200 bg-blue-50 p-4 text-sm">
            No companies found assigned to your user
          </div>
        )}

        <Link
          className="mt-6 inline-flex ml-6 items-center gap-2 rounded-md bg-gray-200 px-4 py-2 transition hover:bg-gray-300"
          href="/new-company"
        >
          Create a new company
          <FontAwesomeIcon className="h-4 w-4" icon={faArrowRight} />
        </Link>
      </div>
    </div>
  );
}