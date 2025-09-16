"use client";

import Link from "next/link";
import { parseDate } from "@/lib/helpers";
import { StatusChip } from "../view/[id]/StatusChip";
import { IoArrowUndoSharp } from "react-icons/io5";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { useSession } from "next-auth/react";
import { useCallback, useLayoutEffect, useState } from "react";
import { ISubmission, Submission } from "@/lib/forms/Submission";
import { $Enums } from "@prisma/client";

type APIResponse = {success: true, submissions: ISubmission[]} | {success: false}

// route is protected by middleware, so no need to check auth here aswell
export default function ApplicationAdmin() {
	const { data } = useSession();

	const [filter, setFilter] = useState<$Enums.SubmissionStatus[]>(["Accepted", "Rejected", "Waiting"]);

	const [firstCursor, setFirstCursor] = useState<string>();
	const [lastCursor, setLastCursor] = useState<string>();
	const [submissions, setSubmissions] = useState<ISubmission[]>([]);

	const fetchPage = useCallback((cursor?: string, backwards: boolean = false, filter?: $Enums.SubmissionStatus[], first?: string) => {
		async function fetchNext() {
			const body = {
				cursor,
				backwards,
				filter: {
					status: {
						in: filter
					}
				}
			}

			const next = await fetch("/api/form/admin/submission", {
				method: "POST",
				body: JSON.stringify(body),
			})

			return await next.json();
		}
		
		fetchNext().then((res: APIResponse) => {
			if(!res.success)
				return;
			// don't do anything if end has been reached
			if(res.submissions.length === 0) {
				setLastCursor(submissions.at(-1)?.id)
				return;
			}
			setSubmissions(res.submissions);
			if(!first) 
				setFirstCursor(res.submissions[0]?.id);
		})
	}, [submissions]);

	useLayoutEffect(() => {
		setLastCursor(undefined);
		setFirstCursor(undefined);
		setSubmissions([]);

		fetchPage(undefined, false, filter);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [filter])

	return (
		<div className="sm:px-10 md:px-20 pt-14 sm:py-14">
			<Link
				href="/dashboard"
				className="max-sm:mx-5 px-4 py-1 bg-gray-200 dark:bg-gray-800/30 rounded-xl inline-flex gap-2 items-center opacity-90 mb-2"
			>
				<IoArrowUndoSharp className="text-black dark:text-white" />
				<span className="text-black dark:text-white">Tilbage</span>
			</Link>

			<br />

			<span className="max-sm:px-5 text-xl text-gray-700 dark:text-gray-300">
				Velkommen
			</span>
			<h1 className="max-sm:px-5 text-4xl font-extrabold">
				{data?.user?.username}
			</h1>
			<span className="hidden sm:block text-gray-400 dark:text-gray-600">
				({data?.user?.uuid})
			</span>

			<div className="flex flex-col lg:grid grid-cols-3 mt-12 h-full gap-6 max-sm:px-5">
				<div className="h-fit sticky top-0 col-start-3 row-start-1 bg-gray-300/30 dark:bg-gray-800/25 rounded-lg p-4">
					<h3 className="font-semibold">
						Filtrer
					</h3>
					<hr className="my-3 border-black dark:border-white opacity-25" />

					<div className="flex flex-col items-start gap-2">
						{Object.values($Enums.SubmissionStatus).map((status, i) => (
							<div key={i}>
								<input
									type="checkbox"
									className="size-4 me-2"
									defaultChecked={true}

									onChange={(e) => {
										if(e.target.checked) {
											setFilter([...filter, status])
										} else {
											setFilter(
												filter.filter((el) => el !== status)
											)
										}
									}}
								/>
								<StatusChip
									status={status}
									isAdmin={false}
									submissionId=""
								/>
							</div>
						))}
					</div>
				</div>

				<div className="col-span-2 bg-gray-300/30 dark:bg-gray-800/25 p-4 rounded-lg">
					<h3 className="font-semibold">
						Spilleransøgninger kan ses nedenfor
					</h3>
					<hr className="my-3 border-black dark:border-white opacity-25" />

					<div className="flex flex-col gap-3 overflow-y-auto thin-scrollbar pr-2 h-max">
						{submissions.length === 0 ? (
							<div className="h-[225px] flex justify-center items-center">
								<span className="text-gray-700 dark:text-gray-400">
									Ingen ansøgninger
								</span>	
							</div>
						) : submissions.map((submission, i) => (
							<Link
								key={i}
								className="w-full"
								href={"/apply/view/" + submission.id}
							>
								<div className="py-4 pl-4 pr-2 sm:px-4 bg-gray-400/15 dark:bg-gray-800/15 rounded-lg flex flex-row md:grid grid-cols-3 w-full items-center justify-between">
									<div className="w-fit max-md:mr-2">
										<span className="text-blue-600 font-bold text-lg">
											{submission.user?.username}
										</span>
										<p className="line-clamp-2">
											{submission.name}
										</p>
									</div>

									<div className="hidden md:block text-center text-gray-500 dark:text-gray-600">
										{parseDate(new Date(submission.createdAt!))}
									</div>

									<div className="ml-auto w-min">
										<StatusChip
											isAdmin={false}
											status={submission.status}
											submissionId={submission.id!}
										/>
									</div>
								</div>
							</Link>
						))}
					</div>

					<div className="flex justify-end gap-2 flex-row h-min mt-2">
						<button
							className={`p-2 bg-gray-800/40 hover:bg-gray-800/60 rounded-md ${submissions[0]?.id === firstCursor && "opacity-40 pointer-events-none"}`}
							onClick={() => {
								// go to prev page
								fetchPage(submissions[0]?.id, true, filter, firstCursor)
							}}
						>
							<FaChevronLeft />
						</button>

						<button
							className={`p-2 bg-gray-800/40 hover:bg-gray-800/60 rounded-md ${submissions.at(-1)?.id === lastCursor || submissions.length < Submission.PAGE_SIZE && "opacity-40 pointer-events-none"}`}
							onClick={() => {
								// go to next page
								fetchPage(submissions.at(-1)?.id, false, filter, firstCursor)
							}}
						>
							<FaChevronRight />
						</button>
					</div>
				</div>
				
			</div>
		</div>
	)
}