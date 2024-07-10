import dynamic from "next/dynamic";
import CommentsAndDocuments from "~/components/pages/applicant/CommentsAndDocuments";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardSubContent,
	CardTitle,
	CardTopLeftSubContent,
} from "~/components/pages/authenticated/applicant/ApplicantIDCard";
import AssessedBy from "~/components/pages/authenticated/applicant/AssessedBy";
import Assessor from "~/components/pages/authenticated/applicant/Assessor";
import Waiting from "~/components/pages/authenticated/applicant/Card/waiting";
import CheckboxAssessedBy from "~/components/pages/authenticated/applicant/CheckboxAssessedBy";
import DownloadForm from "~/components/pages/authenticated/applicant/DownloadForm";
import UploadRatingForm from "~/components/pages/authenticated/applicant/UploadRatingForm";
import ApplicantIDUpdateInitialInterviewFooter from "~/components/pages/authenticated/applicant/initial-interview/ApplicantIDUpdateInitialInterviewFooter";
import SelectMode from "~/components/pages/authenticated/applicant/initial-interview/SelectMode";
import SubmitInitialInterviewForm from "~/components/pages/authenticated/applicant/initial-interview/SubmitInitialInterviewForm";
import { Button } from "~/components/ui/button";
import InformationSVG from "~/components/ui/information";
import { TypographySmall } from "~/components/ui/typography-small";
import { getApplicantFormByID } from "~/controller/ApplicantController";
import { getAllRatingFormsFilesById } from "~/controller/RatingFormsController";
import { validateRequest } from "~/lib/auth";
import { getUserRole, MatchingUser } from "~/lib/fetch";
import { User } from "~/lib/schema";
import { AssessedByUserDetails } from "~/types/types";
import { checkUserAndApplicantIfValid } from "~/util/check-user-and-applicant-validation";

const ApplicantIDDisplayDateNoSSR = dynamic(
	() =>
		import(
			"~/components/pages/authenticated/applicant/initial-interview/ApplicantIDDisplayDate"
		),
	{
		ssr: false,
	}
);

const currentStageName = "Teaching Demo";

export default async function TeachingDemoPage({ params }: { params: { id: string } }) {
	const { user } = await validateRequest();
	// USAGE FOR THE + ADD EVALUATOR AND GETTING THE FINAL ASSESSOR
	const users = await getUserRole();
	// GETTING THE APPLICANT BY ID
	const applicant = await getApplicantFormByID(Number(params.id));
	// LOCATING THE CURRENT STAGE WHICH IS THE TEACHING DEMO STAGE
	const applicantStage = applicant?.stages && applicant?.stages.teaching_demo;
	// const matchingTheUser = await getUsersByRole(applicantStage?.assessed_by?.filter(user => user) );
	// GETTING ALL THE ASSESSED BY
	const assessedByIds = applicantStage?.assessed_by || [];
	// console.log("Initial assessed_by IDs:", assessedByIds);
	const assessors = await MatchingUser(assessedByIds);

	if (user?.role === "recruitment_officer") {
		return (
			<>
				<Card>
					<CardHeader>
						<CardTitle>{currentStageName}</CardTitle>
					</CardHeader>
					<CardContent>
						<CardSubContent>
							<CardTopLeftSubContent>
								<TypographySmall size={"md"}>{currentStageName}</TypographySmall>
								{applicantStage?.status === "in-progress" ? (
									<SelectMode />
								) : (
									<Button variant={"outline"} disabled className="text-[#039E38]">
										{applicantStage?.status}
									</Button>
								)}
							</CardTopLeftSubContent>
							<ApplicantIDDisplayDateNoSSR date={applicantStage?.date as Date} />
						</CardSubContent>
						<CardSubContent>
							<AssessedBy
								isThereAssessors={assessedByIds}
								assessors={assessors as AssessedByUserDetails[]}
							/>
						</CardSubContent>
					</CardContent>
					<CardFooter>
						{applicantStage?.status === "in-progress" ? (
							<>
								<ApplicantIDUpdateInitialInterviewFooter
									id={applicant?.id as number}
								/>
								<div className="flex-1">
									<CheckboxAssessedBy assessed_by={users as Partial<User>[]} />
								</div>
							</>
						) : (
							<div className="h-[40px]"></div>
						)}
					</CardFooter>
				</Card>
				<CommentsAndDocuments
					stage="teaching_demo"
					applicantId={params.id as string}
					evaluatorsId={user?.id as string}
				/>
			</>
		);
	}

	// CHECK IF THE BOTH USER AND APPLICANT HAS THE SAME VALUES WHETHER IT IS DEPARTMENT OR OFFICE
	const { isUserDepartmentAllowed, isUserOfficeAllowed } = checkUserAndApplicantIfValid(
		applicant,
		user as User
	);
	// CHECK IF THE USER IS ALLOWED TO ASSESSED THE APPLICANT WHETHER IT IS DEPARTMENT OR OFFICE
	const checkIfUserIsAllowedToAssess = isUserDepartmentAllowed || isUserOfficeAllowed;
	// THESE ARE THE USER's WHO CAN ASSESS TO THE APPLICANT
	const assessedByUsers = applicantStage?.assessed_by?.includes(user?.id as string);
	// GETTING ALL THE RATING FORMS FILES BY ID
	const ratingForm = await getAllRatingFormsFilesById(Number(params.id));
	// CHECK IF THE CURRENT USER HAS SUBMITTED THE RATING FORM
	// const hasUserPostedRating = ratingForm?.some((form) => form.user_id === user?.id);
	// console.log(applicantStage);
	// console.log(ratingForm.find((stage) => stage.recruitment_stage === currentStageName));
	// // CHECK THE CURRENT USER's ROLE
	// Check if the user has already posted a rating for the current stage
	const hasUserPostedRating = ratingForm.some(
		(stage) => stage.recruitment_stage === currentStageName && stage.user_id === user?.id
	);
	console.log(hasUserPostedRating); // true if the user has posted a rating, false otherwise

	const getAssessedBy = applicantStage?.assessed_by?.[0] ?? "";
	// GETTING THE FINAL ASSESSOR BASED ON THE USER ID
	const finalAssessor = users.find((user) => user.id === getAssessedBy);
	// THE CODE BELOW CAN BE USE TO UPDATE THE USER's STATUS WHETHER IT IS PASSED OR FAILED
	// const isCurrentUserTheAssessor = user?.id === finalAssessor?.id;

	return (
		<>
			<Card>
				<CardHeader>
					<CardTitle className="flex justify-between">
						{currentStageName}
						<DownloadForm
							file={"/files/teaching-demonstration-rating-scaling.docx"}
							downloadText="Teaching Demo Interview Rating Form"
						>
							Download Teaching Demo Rating Form
						</DownloadForm>
					</CardTitle>
				</CardHeader>
				{/* CHECKS IF THE USER's DEPARTMENT/OFFICE MATCHES THE APPLICANT's SELECTED_DEPARTMENT/SELECTED_OFFICE */}
				{applicantStage?.status === "in-progress" && !applicantStage.assessed_by?.length ? (
					<Waiting />
				) : assessedByUsers && checkIfUserIsAllowedToAssess && !hasUserPostedRating ? (
					<CardContent className="mt-0 flex h-auto flex-col p-5">
						<InformationSVG />
						<UploadRatingForm />
					</CardContent>
				) : hasUserPostedRating ? (
					<CardContent className="mt-0 h-52 flex-col items-center justify-center">
						<p className="text-xl font-medium">Success!</p>
						<div className="mt-2 flex flex-col items-center">
							<small className="text-[#4F4F4F]">
								Rating form has been submitted successfully, check
							</small>
							<small className="text-[#4F4F4F]">your documents to view file.</small>
						</div>
					</CardContent>
				) : (
					<CardContent className="mt-0 items-center justify-center">
						Not authorized to assess.
					</CardContent>
				)}
				{applicantStage?.status === "in-progress" && (
					<CardFooter className="p-5">
						{/* SHOWS WHAT DEPARTMENT/OFFICE TYPE THE ASSESSOR IS */}
						<Assessor
							finalAssessorName={finalAssessor?.name as string}
							finalAssessorRole={finalAssessor?.role as string}
						/>
						{/* BELOW IS WHERE THE FORM IS LOCATED SO THAT THE APPLICANT STATUS WILL BE UPDATED */}
						{assessedByUsers &&
							checkIfUserIsAllowedToAssess &&
							!hasUserPostedRating && (
								<SubmitInitialInterviewForm
									id={params.id}
									evaluatorsId={user?.id as string}
									recruitment_stage={currentStageName as string}
								/>
							)}
					</CardFooter>
				)}
			</Card>
			<CommentsAndDocuments
				stage="teaching_demo"
				applicantId={params.id as string}
				evaluatorsId={user?.id as string}
			/>
		</>
	);
}

// Fetching and logging user details for each ID
// if (assessedByIds.length > 0) {
// 	for (const userId of assessedByIds) {
// 		const userDetails = await getUsersByRole(userId);
// 		// console.log("User details for ID", userId, ":", userDetails);
// 	}
// } else {
// 	console.log("No assessed_by IDs found");
// }
// const { applicant, applicantStage } = await GetApplicantById(
// 	Number(params.id),
// 	"teaching_demo"
// );
// IF MATCHING THE CURRENT STAGE, IT WILL RETURN THE UPDATED STAGE NAME
// before -> teaching_demo, after -> Teaching Demo

// const getUserWhoAssessed = await getUsersByUserID(applicantStage?.assessed_by?.[0] ?? "");
// const assessedBy = getUserWhoAssessed?.find((user) => ({
// 	name: user.name,
// 	role: user.role,
// }));
// PLEASE UPDATE FOR TOMORROW TODO:
// GET THE RATING FORM OF THE USER
// EX: ['AWDHAWD', 'AWDAWD']
// THEN COMPARE IT TO THE USER's ROLE BASICALLY TO DISPLAY BOTH USER's INFROMATION
// THEN DISPLAY IT TO THE RECRUIMENT OFFICER's POV FROM THE TEACHING DEMO
// const getAssessors = applicant?.stages?.teaching_demo;
// console.log(applicantStage?.assessed_by);

// const { stages } = await getApplicantData(Number(params.id));
// LOCATING THE CURRENT STAGE, IF THE STATUS DOES NOT MATCH
// THE CURRENT PAGE IT WILL DISPLAY "This applicant is not yet available."
// const findStatusInProgress = checkStatusInProgress(stages);
// console.log(applicantStage?.status)