import { EditJobRequest, JobRequest } from "~/lib/zod";

export class DataExtractor {
	static extractJobRequestData(formData: FormData): JobRequest {
		return {
			requested_position: formData.get("requested_position") as string,
			requested_category: formData.get("requested_category") as
				| "teaching_staff"
				| "non-teaching_staff",
			requested_department: formData.get("requested_department") as string | null,
			requested_office: formData.get("requested_office") as string | null,
			requested_type: formData.get("requested_type") as "full_time" | "part_time",
			requested_description: formData.get("requested_description") as string,
			requested_qualification: formData.get("requested_qualification") as string,
		};
	}

	static extractEditJobRequestData(formData: FormData): EditJobRequest {
		return {
			requested_position: formData.get("requested_position") as string,
			requested_department: formData.get("requested_department") as string | null,
			requested_office: formData.get("requested_office") as string | null,
			requested_type: formData.get("requested_type") as "full_time" | "part_time",
			requested_description: formData.get("requested_description") as string,
			requested_qualification: formData.get("requested_qualification") as string,
		};
	}
}