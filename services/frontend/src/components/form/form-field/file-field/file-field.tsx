import { Button } from "@/src/components/button/button"
import IconUpload from "@/src/components/icons/upload"
import { classNames } from "@/src/lib/class-names"
import React, { forwardRef } from "react"

interface FileInputFieldProps
	extends React.InputHTMLAttributes<HTMLInputElement> {
	id: string
	label?: string
}

// eslint-disable-next-line react/display-name
export const FileField = forwardRef(
	(
		{
			className,
			id,
			label = "Select …",
			children,
			...props
		}: FileInputFieldProps,
		ref: React.ForwardedRef<HTMLInputElement>,
	) => {
		return (
			<label
				htmlFor={id}
				className={classNames(
					"rounded-full flex flex-row items-center bg-neutral-100 bg-opacity-10 placeholder-space-100 hover:bg-opacity-20 focus:bg-opacity-20" +
						" transition-colors",
					className,
				)}
			>
				<Button
					className={"rounded-r-none"}
					IconBefore={<IconUpload />}
				>
					{label}
				</Button>

				<span className={"px-5 text-sm text-violet-100/80"}>
					No file selected
				</span>

				<input
					id={id}
					ref={ref}
					type={"file"}
					hidden
					{...props}
				/>
			</label>
		)
	},
)
