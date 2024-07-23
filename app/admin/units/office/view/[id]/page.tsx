import ViewResult from "~/components/pages/applicant/admin/ViewResult";
import { getOfficeById } from "~/Controller/OfficeController";

export default async function SuccessAddNewRequestPage({ params }: { params: { id: string } }) {
	const office = await getOfficeById(Number(params.id));

	return (
		<ViewResult
			href="/admin/units/office"
			title="Office Details"
			label="Office Name"
			unitName={office?.office_name as string}
		/>
	);
}
