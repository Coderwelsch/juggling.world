import IconFileImage from "@/src/components/icons/file-image"
import { classNames } from "@/src/lib/class-names"
import React, { forwardRef, useEffect } from "react"

interface FileInputFieldProps
	extends React.InputHTMLAttributes<HTMLInputElement> {
	id: string
	label?: string
}

export const FileField = forwardRef(
	(
		{
			className,
			id,
			label = "Choose",
			children,
			onChange,
			...props
		}: FileInputFieldProps,
		ref: React.ForwardedRef<HTMLInputElement>,
	) => {
		const [selectedFileName, setSelectedFileName] = React.useState<string>()

		const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
			if (!e.target.files?.length) {
				onChange?.(e)
				return
			}

			setSelectedFileName(e.target.files[0].name)
			onChange?.(e)
		}

		return (
			<label
				htmlFor={id}
				className={classNames(
					`group rounded-full flex flex-row items-center bg-neutral-100 bg-opacity-10 placeholder-violet-100 hover:bg-opacity-20 focus:bg-opacity-20 transition-colors cursor-pointer w-full`,
					className,
				)}
			>
				<span
					className={
						"flex flex-row items-center gap-2 rounded-l-full bg-violet-100/20 px-5 py-2 text-sm font-semibold text-neutral-50"
					}
				>
					<IconFileImage />
					{label}
				</span>

				{selectedFileName ? (
					<span
						className={
							"inline-block max-w-[12rem] overflow-hidden truncate px-5 text-sm text-violet-100/80"
						}
					>
						{selectedFileName}
					</span>
				) : (
					<span className={"px-5 text-sm text-violet-100/80"}>
						No file selected
					</span>
				)}

				<input
					id={id}
					ref={ref}
					type={"file"}
					onChange={handleChange}
					hidden
					{...props}
				/>
			</label>
		)
	},
)
