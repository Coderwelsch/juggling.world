import { twMerge } from "tailwind-merge"

export const classNames = (...classes: unknown[]) =>
	twMerge(classes.filter(Boolean).join(" "))
