"use client";

import useModal from "@/components/Modal";
import { Role } from "@prisma/client";
import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { BsTrash } from "react-icons/bs";
import { FaChevronDown } from "react-icons/fa6";
import { FiUser } from "react-icons/fi";
import { IconBaseProps } from "react-icons/lib";
import { PiStack } from "react-icons/pi";
import { RiExchange2Line } from "react-icons/ri";

const defaultButtons: ButtonProps[] = [
	{
		Icon: PiStack,
		redirectTo: "/dashboard",
		title: "Oversigt",
		isCategory: false,
	}
]

interface CategoryProps {
	title: string;
	Icon: React.FC<IconBaseProps>;
	isCategory: true;
	sub: ButtonProps[];
}

interface ButtonProps {
	cuid?: string;

	title: string;
	Icon: React.FC<IconBaseProps>;
	redirectTo: string,
	isCategory: false,
	isSelected?: boolean
}

function useNavButtons(props: {
	selected: ButtonProps,
	data: Session | null,
}) {
	const {
		selected,
		data
	} = props;

	const router = useRouter();
	const path = usePathname();

	const NavButton = useCallback(function NavButton(props: (CategoryProps | ButtonProps & {isAdmin: boolean})) {
		const {
			title,
			Icon,
			isCategory,
		} = props;
	
		if(!isCategory)
			return (
				<Link
					href={props.redirectTo}
					className={`inline-flex items-center p-4 bg-gray-700/20 rounded-lg gap-2 whitespace-nowrap w-full mt-2 hover:bg-gray-700/40 group relative`}
				>
					<Icon className={`size-6 shrink-0 ${props.isSelected ? "text-blue-600" : "text-gray-200"}`} />
					<span className={`${props.isSelected ? "text-blue-600 font-semibold" : "text-white"}`}>
						{title}
					</span>
	
					<div className="grow" />
	
					{props.isAdmin && (
						<button
							className="group-hover:opacity-100 opacity-0 size-6 absolute right-1"
							onClick={async (e) => {
								e.stopPropagation();
								e.preventDefault();
	
								const body = {
									id: props.cuid,
								};
	
								(await fetch("/api/form/admin", {
									method: "DELETE",
									body: JSON.stringify(body),
								})).json().then((res) => {
									if(res.success) {
										if("/apply/" + props.cuid === path) 
											router.push("/dashboard");
										
										router.refresh();
									}
								});
	
							}}
						>
							<BsTrash className="text-red-600" />
						</button>
					)}
				</Link>
			)

		return (
			<div
				className={`inline-flex items-center p-4 bg-gray-700/10 rounded-lg gap-2 whitespace-nowrap w-full mt-4 pointer-events-none select-none`}
			>
				<Icon className={`size-6 text-gray-200 shrink-0`} />
				<span className={`text-white`}>
					{title}
				</span>
	
				<div className="grow" />
				
				<FaChevronDown className={`text-gray-600 transition-transform ease-in-out`} />
			</div>
		)
	}, [router, path])

	const renderButtons = useCallback((buttons: (ButtonProps | CategoryProps)[]) => {
		return buttons.map((button, i) => {			
			if(button.isCategory) {
				return (
					<div key={i}>
						<NavButton
							{...button}
						/>
			
						{button.sub.length > 0 && (
							<div className={`w-[calc(100%-24px)] ml-auto relative`}>
								<div className="absolute h-[calc(100%-0.5rem)] -left-3 top-2 bg-gray-700/50 w-[1px]" />
		
								{renderButtons(button.sub)}
							</div>
						)}
					</div>
				);
			}
	
			return (
				<NavButton
					{...button}
					isSelected={selected === button}
					isAdmin={data?.user?.role === Role.ADMIN}
					key={i}
				/>
			)
		})
	}, [selected, data, NavButton]);

	return {
		renderButtons,
		NavButton,
	}
}



export default function VerticalNavbar({
	forms,
}: {
	forms: {id: string, name: string, category: string}[]
}) {
	const { data } = useSession();

	const {
		showModal,
		Modal,
		hideModal
	} = useModal();

	const router = useRouter();
	const path = usePathname();

	const [buttons, defaultSelected] = useMemo(() => {
		let selected: ButtonProps = defaultButtons[0];
		const categories: (string | null)[] = [];
		const buttons: (CategoryProps | ButtonProps)[] = [];
		
		forms.forEach((form) => {
			const button: ButtonProps = {
				title: form.name,
				redirectTo: "/apply/" + form.id,
				Icon: FiUser,
				cuid: form.id,

				isCategory: false
			}
			
			if("/apply/" + form.id === path)
				selected = button;

			const categoryIndex = categories.findIndex((category) => category == form.category);
			if(categoryIndex === -1) {
				categories.push(form.category);
				buttons.push({
					title: form.category,
					Icon: FiUser,
					sub: [button],
					isCategory: true
				});
			} else {
				if(buttons[categoryIndex].isCategory)
					buttons[categoryIndex]!.sub!.push(button);
				else {
					categories.push(null);
					buttons.push(button);
				}
			}
		})

		for(const button of defaultButtons) {
			if(button.redirectTo === path) {
				selected = button;
				break;
			}
		}

		return [[...defaultButtons, ...buttons], selected];
	}, [forms, path]);

	const [selected, setSelected] = useState<ButtonProps>(defaultSelected);

	useEffect(() => {
		setSelected(defaultSelected);
	}, [defaultSelected]);

	const createForm = useCallback(async (e: FormData) => {
		const category = e.get("category"),
			  name = e.get("name"),
			  subtitle = e.get("subtitle"),
			  visible = e.get("visibility") === "on";

		if(!category || !name || !subtitle)
			return;

		const body = {
			category,
			name,
			subtitle,
			visible
		};

		(await fetch("/api/form/admin", {
			method: "POST",
			body: JSON.stringify(body),
		})).json()
			.then((res) => {
				if(res.success) {
					hideModal();
					router.refresh();
				}
			}
		)
	}, [hideModal, router]);

	const {
		renderButtons
	} = useNavButtons({
		data,
		selected,
	});

	return (
		<div className="h-screen w-[300px] fixed top-0 left-0 bg-gray-800/30 px-5 z-50">
			<nav className="flex flex-col gap-2 py-2 h-full">
				<Link
					href={"/dashboard"}
					className="select-none bg-[radial-gradient(#2563eb39_0%,transparent_75%)]"
				>
					<Image
						src={"/image.png"}
						width={256}
						height={256}
						alt="DashMC Logo"

						className="p-4 max-w-[220px] mx-auto"
						priority
					/>
				</Link>

				<hr className="border-gray-700" />
				
				<div>
					{renderButtons(buttons)}
				</div>

				<div className="grow" />

				{data?.user?.role === Role.ADMIN && (
					<button
						className={`inline-flex items-center p-4 rounded-lg gap-2 whitespace-nowrap w-full mt-2 hover:bg-red-800/5 border border-red-600/70`}
						onClick={showModal}
					>
						<RiExchange2Line className={`size-6 text-red-600/70`} />
						<span className={`font-semibold text-red-600`}>
							Opret ny
						</span>
					</button>
				)}

				<span className="text-gray-700 text-sm">
					DashMC &copy; 2024
				</span>
			</nav>

			{data?.user?.role === Role.ADMIN && (
				<Modal className="w-[500px]">
					<form
						className="group"
						noValidate
						action={createForm}
					>
						<h1 className="text-xl font-semibold">Opret ny form</h1>
						<span className="text-gray-400">
							Du er ved at oprette en ny form.
							Definer den venligst nedenfor.
						</span>

						<div className="mt-6 grid grid-cols-2 gap-5">
							<input
								autoComplete="one-time-code"
								id="name"
								name="name"
								placeholder="Navn"
								type="text"
								className="p-4 h-min bg-gray-200 dark:bg-gray-700/40 dark:placeholder:text-gray-500 rounded-lg outline-blue-600 placeholder:text-gray-600 basis-0 border-transparent border-2 focus-visible:outline outline-2"

								required
								autoFocus
								pattern=".{3,}"
							/>

							<input
								autoComplete="one-time-code"
								id="category"
								name="category"
								placeholder="Kategori"
								type="text"
								className="p-4 h-min bg-gray-200 dark:bg-gray-700/40 dark:placeholder:text-gray-500 rounded-lg outline-blue-600 placeholder:text-gray-600 basis-0 border-transparent border-2 focus-visible:outline outline-2"

								required
								pattern=".{3,}"
								enterKeyHint="next"
							/>

							<textarea
								placeholder="Beskrivelse"
								rows={3}
								
								id="subtitle"
								name="subtitle"
								
								className="col-span-2 p-4 h-min bg-gray-200 dark:bg-gray-700/40 dark:placeholder:text-gray-500 rounded-lg outline-blue-600 placeholder:text-gray-600 basis-0 border-transparent border-2 focus-visible:outline outline-2"

								required
							/>


							<div className="flex items-start mb-6">
								<input
									id="visibility"
									name="visibility"
									type="checkbox"
									className="size-5"
								/>
								<label htmlFor="visibility" className="ms-2 text-sm font-medium text-gray-300">
									Gør denne form synlig for brugere
								</label>
							</div>
						</div>

						<button
							type="submit"
							className="px-4 py-2 bg-blue-600 rounded-lg float-right group-invalid:opacity-70 group-invalid:pointer-events-none"
						>
							Gem
						</button>
					</form>
				</Modal>
			)}
		</div>
	)
}