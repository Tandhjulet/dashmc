import { $Enums } from "@prisma/client";
import { memo } from "react";

export const InnerChip = memo(function RoleChip({ role }: { role?: $Enums.Role }) {
	switch (role) {
		case "ADMIN":
			return (
				<div className="bg-red-500/20 inline-flex items-center gap-2 text-red-500 px-2 py-1 rounded-lg">
					ADMIN
				</div>
			)
		case "HELPER":
			return (
				<div className="bg-blue-500/20 inline-flex items-center gap-2 text-blue-500 px-2 py-1 rounded-lg">
					HJÆLPER
				</div>
			)
		case "MOD":
			return (
				<div className="bg-purple-500/20 inline-flex items-center gap-2 text-purple-500 px-2 py-1 rounded-lg">
					MOD
				</div>
			)
		case "USER":
			return (
				<div className="bg-teal-500/30 text-teal-700 dark:bg-teal-500/20 inline-flex items-center gap-2 dark:text-teal-500 px-2 py-1 rounded-lg">
					BRUGER
				</div>
			)
	}
});

export const RoleChip = ({
	role,
	editable = false,
	callback = undefined,
}: {
	role: $Enums.Role,
	editable?: boolean,
	callback?: (newVal: $Enums.Role) => void,
}) => {
	if (!editable)
		return <InnerChip role={role} />

	return (
		<select onChange={(e) => callback?.(e.target.value as $Enums.Role)} defaultValue={role}>
			{Object.values($Enums.Role).map((role, i) => (
				<option key={i} className="inline-flex">
					{role}
				</option>
			))}
		</select>
	)
}