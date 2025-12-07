import type {Application, ApplicationRequest} from "../../types/application.ts";
import {useState} from "react";

export function EditApplicationForm(props: {
    onClose: () => void,
    onSubmit: (id: number, request: ApplicationRequest) => void,
    application: Application
}) {
    const [jobTitle, setJobTitle] = useState(props.application.jobTitle);
    const [companyName, setCompanyName] = useState(props.application.companyName);
    const [descriptionUrl, setDescriptionUrl] = useState(props.application.descriptionUrl);
    const [status, setStatus] = useState(props.application.status);
    const [appliedDate, setAppliedDate] = useState(props.application.appliedDate);


    console.log("Job title", jobTitle)
    console.log("Company name", companyName)
    console.log(descriptionUrl)
    console.log("status", status)
    console.log("date", appliedDate)

    function submitApplication() {
        const request: ApplicationRequest = {
            jobTitle,
            companyName,
            descriptionUrl,
            status,
            appliedDate
        }
        props.onSubmit(props.application.id, request)
    }

    return (
        <form className="space-y-4 p-4">
            <h2 className="text-xl font-semibold mb-2">Add Application</h2>

            {/* Job Title */}
            <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium">Job Title</label>
                <input
                    type="text"
                    value={jobTitle}
                    onChange={e => setJobTitle(e.target.value)}
                    className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
            </div>

            {/* Company Name */}
            <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium">Company Name</label>
                <input
                    type="text"
                    value={companyName}
                    onChange={e => setCompanyName(e.target.value)}
                    className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
            </div>

            {/* Description URL */}
            <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium">URL to Job Description (optional)</label>
                <input
                    value={descriptionUrl}
                    onChange={e => setDescriptionUrl(e.target.value)}
                    type="url"
                    className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Status */}
            <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium">Status</label>
                <select
                    onChange={e => setStatus(e.target.value)}
                    value={status}
                    className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                >
                    <option value="APPLIED">Applied</option>
                    <option value="INTERVIEW">Interview</option>
                    <option value="OFFER">Offer</option>
                    <option value="REJECTED">Rejected</option>
                </select>
            </div>

            {/* Applied Date */}
            <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium">Applied Date</label>
                <input
                    type="date"
                    value={appliedDate}
                    onChange={e => setAppliedDate(e.target.value)}
                    className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-3 pt-4">
                <button
                    type="button"
                    onClick={props.onClose}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    onClick={submitApplication}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                    Save
                </button>
            </div>
        </form>
    );
}