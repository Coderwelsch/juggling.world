import { Button } from "@/src/components/button/button"
import Dialog from "@/src/components/dialog/dialog"
import { DividerHorizontal } from "@/src/components/divider/divider-horizontal"
import { FormField } from "@/src/components/form/form-field/form-field"
import { Headline } from "@/src/components/headline/headline"
import IconChevronRight from "@/src/components/icons/chevron-right"
import { LoaderOverlay } from "@/src/components/loader-overlay/loader-overlay"
import { getStrapiUrl } from "@/src/lib/get-strapi-url"
import { useAllDisciplines } from "@/src/queries/all-disciplines"
import { UserDiscipline, UserDisciplineEntity } from "@/src/types/cms/graphql"
import Image from "next/image"
import { useMemo, useState } from "react"
import { useForm } from "react-hook-form"

interface UserDisciplinesFormProps {
	disciplines: Array<{
		id: UserDisciplineEntity["id"]
		startedAt: UserDiscipline["startedAt"]
		level: UserDiscipline["level"]
		isTeaching: UserDiscipline["isTeaching"]
	}>
}

export const SetUserDisciplines = () => {
	const [selectedDisciplines, setSelectedDisciplines] = useState<
		Array<number>
	>([])

	const [searchString, setSearchString] = useState("")

	const allDisciplines = useAllDisciplines()

	const form = useForm<UserDisciplinesFormProps>({
		defaultValues: {
			disciplines: [],
		},
	})

	const filteredDisciplines = useMemo(() => {
		if (!searchString) {
			return allDisciplines.data?.disciplines.data
		}

		return allDisciplines.data?.disciplines.data.filter((discipline) =>
			discipline.attributes.name
				.toLowerCase()
				.includes(searchString.toLowerCase()),
		)
	}, [allDisciplines.data?.disciplines.data, searchString])

	return (
		<>
			<Dialog.Body
				className={"flex h-full max-h-[30rem] max-w-3xl flex-row p-0"}
			>
				<LoaderOverlay shown={allDisciplines.loading} />

				<div
					className={
						"flex h-full w-1/2 flex-col gap-3 border-r border-slate-50/20 p-5 py-6 text-slate-50"
					}
				>
					<FormField>
						<FormField.SearchField
							value={searchString}
							onChange={(event) =>
								setSearchString(event.target.value)
							}
							placeholder={"Search for a discipline …"}
						></FormField.SearchField>
					</FormField>

					<DividerHorizontal>
						<p>
							<span className={"font-mono"}>
								{selectedDisciplines.length}
							</span>{" "}
							selected
						</p>
					</DividerHorizontal>

					{filteredDisciplines?.map((discipline) => {
						const isSelected = selectedDisciplines.includes(
							discipline.id,
						)

						return (
							<label
								htmlFor={`discipline-${discipline.id}`}
								key={discipline.id}
								className={`flex cursor-pointer flex-col items-start justify-start gap-4 rounded-lg border border-slate-50/20 px-4 py-3 transition-colors hover:bg-slate-100/10`}
							>
								<div
									className={
										"flex w-full flex-row items-center gap-2"
									}
								>
									<input
										id={`discipline-${discipline.id}`}
										type="checkbox"
										checked={isSelected}
										name="bordered-checkbox"
										className="h-5 w-5 cursor-pointer rounded border-slate-50/20 bg-slate-700 focus:ring-primary-500"
										onChange={() => {
											if (isSelected) {
												setSelectedDisciplines(
													selectedDisciplines.filter(
														(id) =>
															id !==
															discipline.id,
													),
												)
											} else {
												setSelectedDisciplines([
													...selectedDisciplines,
													discipline.id,
												])
											}
										}}
									/>

									<Headline size={6}>
										{discipline.attributes.name}
									</Headline>

									{discipline.attributes.icon?.data.attributes
										.url && (
										<Image
											src={getStrapiUrl(
												discipline.attributes.icon?.data
													.attributes.url,
											)}
											width={32}
											height={32}
											className={"h-4 w-4"}
											alt={discipline.attributes.name}
										/>
									)}
								</div>
							</label>
						)
					})}
				</div>

				<div className={"flex w-1/2 flex-col gap-1 p-6 text-slate-50"}>
					<Headline size={4}>Disciplines</Headline>

					<p className={"text-slate-100/60"}>
						Select the disciplines you are interested in or want to
						learn.
					</p>
				</div>
			</Dialog.Body>

			<div>
				<Button
					intent={"primary"}
					IconAfter={<IconChevronRight />}
				>
					Next
				</Button>
			</div>
		</>
	)
}
