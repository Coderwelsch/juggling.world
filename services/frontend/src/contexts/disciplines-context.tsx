import { AllDisciplinesResponse } from "@/src/queries/all-disciplines"
import { createContext } from "react"

export const DisciplinesContext = createContext<
	AllDisciplinesResponse["disciplines"]["data"]
>([])
