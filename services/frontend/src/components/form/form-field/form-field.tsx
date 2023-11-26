import { FileField } from "@/src/components/form/form-field/file-field/file-field"
import { FormLabel } from "@/src/components/form/form-field/form-label/form-label"
import { InputField } from "@/src/components/form/form-field/input-field/input-field"
import { SearchField } from "@/src/components/form/form-field/search-field/search-field"
import { SearchFieldResult } from "@/src/components/form/form-field/search-field/search-field-result"
import { SearchFieldResultContainer } from "@/src/components/form/form-field/search-field/search-field-result-container"
import { SelectLocationField } from "@/src/components/form/form-field/select-location-field/select-location-field"
import { classNames } from "@/src/lib/class-names"
import { ReactNode } from "react"

interface FormFieldProps {
	children: ReactNode
	className?: string
}

export const FormField = ({ children, className }: FormFieldProps) => {
	return (
		<div className={classNames("relative flex flex-col gap-1", className)}>
			{children}
		</div>
	)
}

FormField.Label = FormLabel
FormField.InputField = InputField
FormField.FileField = FileField
FormField.LocationField = SelectLocationField
FormField.SearchField = SearchField
FormField.SearchFieldResultContainer = SearchFieldResultContainer
FormField.SearchFieldResult = SearchFieldResult
