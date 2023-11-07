import { FileField } from "@/src/components/form/form-field/file-field/file-field"
import { FormLabel } from "@/src/components/form/form-field/form-label/form-label"
import { InputField } from "@/src/components/form/form-field/input-field/input-field"
import { ReactNode } from "react"

interface FormFieldProps {
	children: ReactNode
}

export const FormField = ({ children }: FormFieldProps) => {
	return <div className={"flex flex-col gap-1"}>{children}</div>
}

FormField.Label = FormLabel
FormField.InputField = InputField
FormField.FileField = FileField
