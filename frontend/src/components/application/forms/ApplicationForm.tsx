import type {FormProps} from "../../../types/form.ts";
import type {ApplicationData, ApplicationStatus} from "../../../types/application.ts";

export function ApplicationForm({
                                    data, setData, onClose, onSubmit
                                }:
                                FormProps) {

    function update<K extends keyof ApplicationData>(key: K, value: ApplicationData[K]) {
        setData({...data, [key]: value})
    }


    return <form className="space-y-4 p-4" onSubmit={(e) => {
        e.preventDefault();
        onSubmit(data);
        onClose();
    }}>

        <h2 className="text-xl font-semibold mb-2">Add Application</h2>

        {/* Job Title */}
        <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium">Job Title</label>
            <input
                type="text"
                value={data.jobTitle}
                onChange={e => update("jobTitle", e.target.value)}
                className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
            />
        </div>

        {/* Company Name */}
        <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium">Company Name</label>
            <input
                type="text"
                value={data.companyName}
                onChange={e => update("companyName", e.target.value)}
                className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
            />
        </div>

        {/* Description URL */}
        <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium">URL to Job Description (optional)</label>
            <input
                value={data.descriptionUrl}
                onChange={e => update("descriptionUrl", e.target.value)}
                type="url"
                className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </div>

        {/* Status */}
        <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium">Status</label>
            <select
                onChange={e => update("status", e.target.value as ApplicationStatus)}
                value={data.status}
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
                value={data.appliedDate}
                onChange={e => update("appliedDate", e.target.value)}
                className="border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
            />
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-3 pt-4">
            <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md"
            >
                Cancel
            </button>

            <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
                Save
            </button>
        </div>
    </form>
}