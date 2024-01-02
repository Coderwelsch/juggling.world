export const mapEntityIds = (entities: Array<unknown & { id: number | string | null }>) => {
	const filtered = entities.filter(e => Boolean(e.id))

	return filtered.map((entity) => {
		return entity.id
	})
}
