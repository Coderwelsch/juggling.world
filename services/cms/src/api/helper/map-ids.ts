export const mapEntityIds = (entities: Array<unknown & { id: number }>) => {
	return entities.map((entity) => {
		return entity.id
	})
}
