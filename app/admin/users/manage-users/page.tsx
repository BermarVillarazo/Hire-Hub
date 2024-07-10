import { getUsersByUserRole } from "~/controller/UsersController";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import TypographyH4 from "~/components/ui/typography-h4";

export default async function ManageUsersPage() {
	const users = await getUsersByUserRole();

	return (
		<>
			<TypographyH4 text="Users List" />
			<DataTable columns={columns} data={users} />
		</>
	);
}