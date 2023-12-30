import { InputField } from "@/src/components/form/form-field/input-field/input-field"
import IconSearch from "@/src/components/icons/search"
import { classNames } from "@/src/lib/class-names"
import React, { forwardRef } from "react"

interface FileInputFieldProps
	extends React.InputHTMLAttributes<HTMLInputElement> {}

export const SearchField = forwardRef(
	(
		{ className, ...props }: FileInputFieldProps,
		ref: React.ForwardedRef<HTMLInputElement>,
	) => {
		return (
			<div className={"relative"}>
				<IconSearch
					className={
						"absolute left-3 top-1/2 z-10 -translate-y-1/2 text-neutral-100/50"
					}
				/>

				<InputField
					type={"search"}
					placeholder={"Search for a city, country, …"}
					className={classNames(className, "pl-10")}
					{...props}
				/>
			</div>
		)
	},
)
