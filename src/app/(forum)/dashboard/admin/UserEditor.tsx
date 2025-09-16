"use client";

import { parseDate } from "@/lib/helpers";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { useCallback, useEffect, useState } from "react";
import { $Enums, User } from "@prisma/client";
import { RoleChip } from "../RoleChip";

type APIResponse = { success: true, users: User[] } | { success: false }

// route is protected by middleware, so no need to check auth here aswell
export default function UserEditor() {
	const [filter, setFilter] = useState<$Enums.Role[]>(["ADMIN", "MOD", "HELPER", "USER"]);

	const [firstCursor, setFirstCursor] = useState<string>();
	const [lastCursor, setLastCursor] = useState<string>();
	const [users, setUsers] = useState<User[]>([]);

	const fetchPage = useCallback((cursor?: string, backwards: boolean = false, filter?: $Enums.Role[], first?: string) => {
		async function fetchNext() {
			const body = {
				cursor,
				backwards,
				filter: {
					role: {
						in: filter
					}
				}
			}

			const next = await fetch("/api/admin/users", {
				method: "POST",
				body: JSON.stringify(body),
			})

			return await next.json();
		}

		fetchNext().then((res: APIResponse) => {
			if (!res.success)
				return;
			// don't do anything if end has been reached
			if (res.users.length === 0) {
				setLastCursor(users.at(-1)?.id)
				return;
			}
			setUsers(res.users);
			if (!first)
				setFirstCursor(res.users[0]?.id);
		})
	}, [users]);

	useEffect(() => {
		setLastCursor(undefined);
		setFirstCursor(undefined);
		setUsers([]);

		fetchPage(undefined, false, filter);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [filter])

	return (
		<div className="flex flex-col lg:grid grid-cols-3 h-full gap-6 max-sm:px-5">
			<div className="h-fit sticky top-0 col-start-3 row-start-1 bg-gray-300/30 dark:bg-gray-800/25 rounded-lg p-4">
				<h3 className="font-semibold">
					Filtrer
				</h3>
				<hr className="my-3 border-black dark:border-white opacity-25" />

				<div className="flex flex-col items-start gap-2">
					{Object.values($Enums.Role).map((role, i) => (
						<div key={i} className="inline-flex">
							<input
								type="checkbox"
								className="size-4 me-2 my-auto"
								defaultChecked={true}

								onChange={(e) => {
									if (e.target.checked) {
										setFilter([...filter, role])
									} else {
										setFilter(
											filter.filter((el) => el !== role)
										)
									}
								}}
							/>
							<RoleChip role={role} />
						</div>
					))}
				</div>
			</div>

			<div className="col-span-2 bg-gray-300/30 dark:bg-gray-800/25 p-4 rounded-lg">
				<h3 className="font-semibold">
					Alle brugere
				</h3>
				<hr className="my-3 border-black dark:border-white opacity-25" />

				<div className="flex flex-col gap-3 overflow-y-auto thin-scrollbar pr-2 h-max">
					{users.length === 0 ? (
						<div className="h-[225px] flex justify-center items-center">
							<span className="text-gray-700 dark:text-gray-400">
								Ingen ansøgninger
							</span>
						</div>
					) : users.map((user, i) => (
						<div key={i} className="py-4 pl-4 pr-2 sm:px-4 bg-gray-400/15 dark:bg-gray-800/15 rounded-lg flex flex-row md:grid grid-cols-3 w-full items-center justify-between">
							<div className="w-fit max-md:mr-2">
								<span className="text-blue-600 font-bold text-lg">
									{user.username}
								</span>
								<p className="line-clamp-1 text-sm italic">
									{user.email}
								</p>
							</div>

							<div className="hidden md:block text-center text-gray-500 dark:text-gray-600">
								{parseDate(new Date(user.createdAt!))}
							</div>

							<div className="ml-auto w-min">
								<RoleChip
									role={user.role}
									editable={true}
									callback={(role) => {
										fetch('/api/admin/users/role', {
											method: "PUT",
											body: JSON.stringify({
												userId: user.id,
												role,
											})
										})
									}}
								/>
							</div>
						</div>
					))}
				</div>

				<div className="flex justify-end gap-2 flex-row h-min mt-2">
					<button
						className={`p-2 bg-gray-800/40 hover:bg-gray-800/60 rounded-md ${users[0]?.id === firstCursor && "opacity-40 pointer-events-none"}`}
						onClick={() => {
							// go to prev page
							fetchPage(users[0]?.id, true, filter, firstCursor)
						}}
					>
						<FaChevronLeft />
					</button>

					<button
						className={`p-2 bg-gray-800/40 hover:bg-gray-800/60 rounded-md ${users.at(-1)?.id === lastCursor || users.length < 20 && "opacity-40 pointer-events-none"}`}
						onClick={() => {
							// go to next page
							fetchPage(users.at(-1)?.id, false, filter, firstCursor)
						}}
					>
						<FaChevronRight />
					</button>
				</div>
			</div>

		</div>
	)
}