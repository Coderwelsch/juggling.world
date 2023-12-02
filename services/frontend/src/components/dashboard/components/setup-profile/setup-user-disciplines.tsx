import { Button } from "@/src/components/button/button"
import Dialog from "@/src/components/dialog/dialog"
import { DividerHorizontal } from "@/src/components/divider/divider-horizontal"
import { FormField } from "@/src/components/form/form-field/form-field"
import { Headline } from "@/src/components/headline/headline"
import IconChevronRight from "@/src/components/icons/chevron-right"
import { LoaderOverlay } from "@/src/components/loader-overlay/loader-overlay"
import { useWizardContext } from "@/src/components/wizard/wizard"
import { useCreateDiscipline } from "@/src/hooks/data/user/use-create-discipline"
import { getStrapiUrl } from "@/src/lib/get-strapi-url"
import { useAllDisciplines } from "@/src/queries/all-disciplines"
import Image from "next/image"
import { useEffect, useMemo, useState } from "react"

export const SetUserDisciplines = () => {
	const [selectedDisciplines, setSelectedDisciplines] = useState<
		Array<number>
	>([])

	const [searchString, setSearchString] = useState("")

	const allDisciplines = useAllDisciplines()

	const createDiscipline = useCreateDiscipline()

	const handleSubmit = () => {
		if (selectedDisciplines.length === 0) {
			return
		}

		selectedDisciplines.forEach(async (discipline) => {
			await createDiscipline.mutateAsync(
				JSON.stringify({
					discipline: Number.parseInt(discipline.toString()),
				}),
			)
		})
	}

	const wizard = useWizardContext()
	useEffect(() => {
		if (createDiscipline.isSuccess) {
			wizard.nextStep?.()
		}
	}, [createDiscipline.isSuccess, wizard])

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
						"flex h-full w-1/2 flex-col gap-3 overflow-y-scroll border-r border-slate-50/20 text-slate-50"
					}
				>
					<div
						className={
							"sticky left-0 top-0 z-20 flex flex-col gap-2 bg-slate-800 p-5 py-6 pb-0"
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
					</div>

					<div className={"flex flex-col gap-4 px-5 pb-6"}>
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
									className={`flex cursor-pointer flex-col items-start justify-start gap-4 rounded-lg border border-slate-50/20 px-4 py-2 transition-colors hover:bg-slate-100/10`}
								>
									<div
										className={
											"relative flex w-full flex-row items-center gap-2"
										}
									>
										<div>
											<input
												id={`discipline-${discipline.id}`}
												type="checkbox"
												checked={isSelected}
												name="bordered-checkbox"
												className="h-4 w-4 cursor-pointer rounded border-slate-50/20 bg-slate-700 focus:ring-primary-500"
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
										</div>

										{discipline.attributes.icon?.data
											.attributes.url && (
											<Image
												src={getStrapiUrl(
													discipline.attributes.icon
														?.data.attributes.url,
												)}
												width={32}
												height={32}
												className={"h-8 w-8"}
												alt={discipline.attributes.name}
											/>
										)}

										<Headline size={6}>
											{discipline.attributes.name}
										</Headline>
									</div>
								</label>
							)
						})}
					</div>
				</div>

				<div className={"flex w-1/2 flex-col gap-1 p-6 text-slate-50"}>
					<Headline size={4}>Disciplines</Headline>

					<p className={"text-sm text-slate-400"}>
						Select the disciplines you are interested in or want to
						learn. You can add more later on, but you will need at
						least one to get started.
					</p>
				</div>
			</Dialog.Body>

			<div>
				<Button
					intent={"primary"}
					disabled={selectedDisciplines.length === 0}
					loading={createDiscipline.isLoading}
					onClick={handleSubmit}
					IconAfter={<IconChevronRight />}
				>
					Continue
				</Button>
			</div>
		</>
	)
}
