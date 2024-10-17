"use client";

import useModal from "@/components/Modal";
import Popper from "@/components/popper/Popper";
import { Role } from "@prisma/client";
import { Session } from "next-auth";
import { signOut, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react";
import { BsTrash } from "react-icons/bs";
import { FaChevronDown } from "react-icons/fa6";
import { FiMoon, FiSun } from "react-icons/fi";
import { IoClose, IoHomeOutline } from "react-icons/io5";
import { IconBaseProps } from "react-icons/lib";
import { PiStack } from "react-icons/pi";
import { RiExchange2Line, RiMenu3Fill, RiUserForbidLine } from "react-icons/ri";
import CreateFormModal from "./CreateFormModal";
import { IForm } from "@/lib/forms/Form";
import { MdTrackChanges } from "react-icons/md";
import useIconPicker from "@/components/IconPicker/IconPicker";

const defaultButtons: ButtonProps[] = [
	{
		Icon: PiStack,
		redirectTo: "/dashboard",
		title: "Oversigt",
		isCategory: false,
	}
]

type CategoryProps = {
	title: string;
	isCategory: true;
	sub: ButtonProps[];
	Icon: React.FC<IconBaseProps>;
}

type ButtonProps = {
	cuid?: string;

	title: string;
	redirectTo: string;
	isCategory: false;
	isSelected?: boolean;
} & ({Icon: React.FC<IconBaseProps>} | {iconKey: string})


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

	const { Icon } = useIconPicker({});

	const NavButton = useCallback(function NavButton(props: (CategoryProps | ButtonProps & {isAdmin: boolean})) {
		const {
			title,
			isCategory,
		} = props;
	
		if(!isCategory) {
			const ButtonIcon = "iconKey" in props ? (
				<Icon
					className={`p-0 size-6 shrink-0 ${props.isSelected ? "text-blue-600" : "text-gray-700 dark:text-gray-200"}`}
					iconKey={props.iconKey}
				/>
			) : (
				<props.Icon
					className={`size-6 shrink-0 ${props.isSelected ? "text-blue-600" : "text-gray-700 dark:text-gray-200"}`}
				/>
			)

			return (
				<Link
					href={props.redirectTo}
					className={`overflow-clip inline-flex items-center p-4 bg-gray-300/50 hover:bg-gray-300/70 dark:bg-gray-700/20 rounded-lg gap-2 whitespace-nowrap w-full mt-2 dark:hover:bg-gray-700/40 group/button relative`}
				>
					{ButtonIcon}
					<span className={`${props.isSelected ? "text-blue-600 font-semibold" : "text-black dark:text-white"}`}>
						{title}
					</span>
	
					<div className="grow" />
	
					{props.isAdmin && (
						<button
							className="group-hover/button:opacity-100 opacity-0 size-6 absolute right-1"
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
		}

		return (
			<div
				className={`overflow-clip  inline-flex items-center p-4 bg-gray-300/30 dark:bg-gray-700/10 rounded-lg gap-2 whitespace-nowrap w-full mt-4 pointer-events-none select-none`}
			>
				<props.Icon
					className={`size-6 text-gray-700 dark:text-gray-200 shrink-0`}
				/>
				<span className={`text-black dark:text-white`}>
					{title}
				</span>
	
				<div className="grow" />
				
				<FaChevronDown className={`text-gray-500 dark:text-gray-600`} />
			</div>
		)
	}, [router, path, Icon])

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
								<div className="absolute h-[calc(100%-0.5rem)] -left-3 top-2 bg-gray-300 dark:bg-gray-700/50 w-[1px]" />
		
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
	forms: IForm[]
}) {
	const { data } = useSession();

	const {
		showModal,
		Modal,
		hideModal
	} = useModal();

	const path = usePathname();

	const [buttons, defaultSelected] = useMemo(() => {
		let selected: ButtonProps = defaultButtons[0];
		const categories: (string | null)[] = [];
		const buttons: (CategoryProps | ButtonProps)[] = [];
		
		forms.forEach((form) => {
			if(form.visible !== true && data?.user?.role !== "ADMIN") 
				return;

			const button: ButtonProps = {
				title: form.name,
				redirectTo: "/apply/" + form.id,
				iconKey: form.icon ?? "FaUser",
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
					Icon: MdTrackChanges,
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
	}, [forms, path, data]);

	const [selected, setSelected] = useState<ButtonProps>(defaultSelected);

	useEffect(() => {
		setSelected(defaultSelected);
	}, [defaultSelected]);

	const {
		renderButtons
	} = useNavButtons({
		data,
		selected,
	});

	const { setTheme, resolvedTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useLayoutEffect(() => {
		setMounted(true);
	}, []);

	const [ show, setShow ] = useState(false);

	return (
		<>
			{/* HORIZONTAL PHONE HEADER */}
			<div className="sm:hidden z-50 h-[100px] w-full fixed top-0 left-0 bg-white/70 dark:bg-[#121212]/70 backdrop-blur-md flex flex-row items-center justify-between">
				<Link href="/dashboard" className="ml-6 z-50">
					<Image
						src={"/image.png"}
						width={64}
						height={64}
						alt="DashMC Logo"

						className="select-none"
					/>
				</Link>

				<button
					className="mr-6"
					onClick={() => setShow(prev => !prev)}
					aria-hidden={!show}
				>
					<RiMenu3Fill className="size-6 text-gray-800 dark:text-gray-300 z-50" />
				</button>

				{show && (
					<div className="flex flex-col w-screen h-screen absolute top-0 left-0 z-40 bg-white dark:bg-[#121212]">
						<div className="h-[100px] w-full flex items-center justify-end">
							<button
								className="mr-6"
								onClick={() => setShow(prev => !prev)}
								aria-hidden={show}
							>
								<IoClose className="size-6 text-gray-800 dark:text-gray-300 z-50" />
							</button>
						</div>

						<ul className="font-semibold basis-0 grow overflow-y-auto px-5">
							{renderButtons(buttons)}
						</ul>

						<div className="mt-2 flex flex-col gap-2 px-4">
							{mounted && (
								<button onClick={() => {
									setTheme(resolvedTheme === "dark" ? "light" : "dark");
								}} className="inline-flex items-center p-4 bg-gray-300/30 dark:bg-gray-700/10 rounded-lg gap-2 whitespace-nowrap w-full">
									{resolvedTheme === "dark" ? (
										<FiMoon className="size-4 text-gray-200 mr-3" />
									) : (
										<FiSun className="size-4 text-gray-800 mr-3" />
									)}
									Skift tema
								</button>
							)}

							<Link href="/" className="inline-flex items-center p-4 bg-gray-300/30 dark:bg-gray-700/10 rounded-lg gap-2 whitespace-nowrap w-full">
								<IoHomeOutline className="inline-block mr-3 size-4 my-auto" />
								Forside
							</Link>

							<hr className="opacity-60 dark:border-t-gray-800 my-2" />

							<button
								onClick={() => {
									signOut({ redirectTo: "/" });
								}}
								className="inline-flex items-center p-4 bg-gray-300/30 dark:bg-gray-700/10 rounded-lg gap-2 whitespace-nowrap w-full text-red-600 dark:text-red-400"
							>
								<RiUserForbidLine className="inline-block mr-3 size-4 my-auto" />
								Log ud
							</button>
							
							<span className="py-2 text-gray-400 dark:text-gray-700 text-sm">
								<strong
									className="dark:text-gray-800"
								>
									DashMC
								</strong> &copy; 2024
							</span>
						</div>
					</div>
				)}
			</div>

			{/* LAPTOP / DESKTOP HEADER */}
			<div
				className="transition-all group hidden sm:max-xl:hover:max-w-[300px] sm:block h-screen w-screen max-w-[100px] xl:max-w-[300px] fixed top-0 left-0 bg-gray-200/50 border-gray-300/20 dark:bg-[#15171b] px-5 z-50 border-r dark:border-gray-700/20"
			>
				<nav className="flex flex-col py-2 items-center h-full">
					<Link
						href={"/dashboard"}
						className="select-none bg-[radial-gradient(#2563eb69_0%,transparent_75%)] dark:bg-[radial-gradient(#2563eb32_0%,transparent_75%)]"
					>
						<Image
							src={"/image.png"}
							width={256}
							height={256}
							alt="DashMC Logo"

							className="max-w-[220px] mx-auto size-[80px] group-hover:size-[220px] xl:size-[220px] xl:p-4 sm:max-xl:group-hover:p-4 transition-all"
							priority
						/>
					</Link>
					
					<div className="flex flex-col gap-2 py-2 h-full w-full opacity-100 sm:max-xl:opacity-0 group-hover:opacity-100 transition-opacity duration-0 group-hover:duration-300 group-hover:delay-75">
						<hr className="border-gray-300 dark:border-gray-700" />
						
						<div className="basis-0 grow overflow-y-auto h-full extra-thin-scrollbar pr-1">
							{renderButtons(buttons)}
						</div>

						{data?.user?.role === Role.ADMIN && (
							<button
								className={`inline-flex items-center p-4 rounded-lg gap-2 whitespace-nowrap w-full mb-2 hover:bg-red-800/5 border border-red-600/85 dark:border-red-600/70`}
								onClick={showModal}
							>
								<RiExchange2Line className={`size-6 text-red-600 dark:text-red-600/70`} />
								<span className={`font-semibold text-red-600 dark:text-red-600`}>
									Opret ny
								</span>
							</button>
						)}

						<Popper
							popover={(
								<div className="w-[257px] flex flex-col gap-1 px-2 py-2 text-nowrap text-[0.975rem]">
									{mounted && (
										<button onClick={() => {
											setTheme(resolvedTheme === "dark" ? "light" : "dark");
										}} className="hover:bg-gray-100 p-2 rounded-md pr-5 dark:hover:bg-gray-800/50 inline-flex items-center">
											{resolvedTheme === "dark" ? (
												<FiMoon className="size-4 text-gray-200 mr-3" />
											) : (
												<FiSun className="size-4 text-gray-800 mr-3" />
											)}
											Skift tema
										</button>
									)}

									<Link href="/" className="hover:bg-gray-100 p-2 rounded-md pr-5 dark:hover:bg-gray-800/50 inline-flex items-center">
										<IoHomeOutline className="inline-block mr-3 size-4 my-auto" />
										Forside
									</Link>

									<hr className="opacity-40 dark:border-t-gray-800" />

									<button
										onClick={() => {
											signOut({ redirectTo: "/" });
										}}
										className="hover:bg-gray-100 p-2 rounded-md pr-5 dark:hover:bg-gray-800/50 inline-flex items-center text-red-600 dark:text-red-400"
									>
										<RiUserForbidLine className="inline-block mr-3 size-4 my-auto" />
										Log ud
									</button>
								</div>
							)}
							direction="up"
						>
							<button
								className={`inline-flex border-gray-400/70 items-center p-4 rounded-lg gap-2 whitespace-nowrap w-full hover:bg-gray-700/5 border dark:border-gray-700/70`}
							>
								<Image
									src={`https://minotar.net/helm/${data?.user?.uuid}/24.png`}
									width={24}
									height={24}
									alt="Profile"
									priority

									className="cursor-pointer"
								/>
								<span className={`font-semibold text-gray-900 dark:text-gray-300`}>
									{data?.user?.username}
								</span>
							</button>
						</Popper>

						<span className="text-gray-400 dark:text-gray-700 text-sm">
							DashMC &copy; 2024
						</span>
					</div>
				</nav>

				{data?.user?.role === Role.ADMIN && (
					<Modal className="w-[500px]">
						<CreateFormModal
							hideModal={hideModal}
							type="CREATE"
						/>
					</Modal>
				)}
			</div>
		</>
	)
}