import validator from "validator";
import { z } from "zod";

export const applicantSchema = z.object({
	first_name: z
		.string()
		.min(2, { message: "First Name must have 2 or more characters" })
		.max(75, { message: "First Name must have 75 or less characters" }),
	last_name: z
		.string()
		.min(2, { message: "Last Name must have 2 or more characters" })
		.max(75, { message: "Last Name must have 75 or less characters" }),
	email: z.string().email({ message: "Invalid email address" }),
	contact_number: z.string().refine((value) => validator.isMobilePhone(value, "en-PH"), {
		message: "Invalid mobile phone number",
	}),
	communication: z.enum(["email", "phone_number"]),
	position: z.enum(["teaching_staff", "non-teaching_staff"]),
	department_name: z.string().optional().nullable(),
	office_name: z.string().optional().nullable(),
	resume: z.string().min(2, { message: "Please upload a resume" }),
	cv_letter: z.string().min(5, { message: "Please upload a CV Lettter" }),
});

export const jobRequestSchema = z.object({
	requested_position: z
		.string()
		.min(2, { message: "Requested Position must have 2 or more characters" }),
	requested_category: z.enum(["teaching_staff", "non-teaching_staff"]),
	requested_department: z.string().optional().nullable(),
	requested_office: z.string().optional().nullable(),
	requested_type: z.enum(["full_time", "part_time"]),
	requested_description: z.string().min(2, { message: "Please add a job description" }),
	requested_qualification: z.string().min(2, { message: "Please add a job qualification" }),
});

export type JobRequest = z.infer<typeof jobRequestSchema>;

export const editJobRequestSchema = z.object({
	requested_position: z
		.string()
		.min(2, { message: "Requested Position must have 2 or more characters" }),
	requested_department: z.string().optional().nullable(),
	requested_office: z.string().optional().nullable(),
	requested_type: z.enum(["full_time", "part_time"]),
	requested_description: z.string().min(2, { message: "Please add a job description" }),
	requested_qualification: z.string().min(2, { message: "Please add a job qualification" }),
});

export type EditJobRequest = z.infer<typeof editJobRequestSchema>;

export const applicantFormSchema = z.object({
	first_name: z
		.string()
		.min(2, { message: "First Name must have 2 or more characters" })
		.max(75, { message: "First Name must have 75 or less characters" }),
	last_name: z
		.string()
		.min(2, { message: "Last Name must have 2 or more characters" })
		.max(75, { message: "Last Name must have 75 or less characters" }),
	email: z.string().email({ message: "Invalid email address" }),
	contact_number: z.string().refine((value) => validator.isMobilePhone(value, "en-PH"), {
		message: "Invalid mobile phone number",
	}),
	communication_type: z.enum(["email", "phone_number"]),
	positionType: z.enum(["teaching_staff", "non-teaching_staff"]),
	position_applied: z
		.string()
		.min(2, { message: "Position applied must have 2 or more characters" })
		.max(75, { message: "Position applied must have 75 or less characters" }),
	selected_department: z.string().optional().nullable(),
	selected_office: z.string().optional().nullable(),
	resume: z.string().min(5, { message: "Please upload a resume" }),
});

export type ApplicantForm = z.infer<typeof applicantFormSchema>;

export const usersSchema = z.object({
	selected_position: z
		.string()
		.min(2, { message: "Selected Position must have 2 or more characters" }),
	selected_option: z.enum(["teaching_staff", "non-teaching_staff"]),
	selected_department: z.string().optional().nullable(),
	selected_office: z.string().optional().nullable(),
});

export type Users = z.infer<typeof usersSchema>;

export const applicantStagesDateSchema = z.object({
	selected_date: z.string().refine((val) => !isNaN(Date.parse(val)), {
		message: "Invalid date",
	}),
});

export type ApplicantStagesDate = z.infer<typeof applicantStagesDateSchema>;

export const applicantStatusStatusSchema = z.object({
	applicant_status: z.enum(["passed", "failed"]),
});

export type ApplicantStagesStatus = z.infer<typeof applicantStatusStatusSchema>;
