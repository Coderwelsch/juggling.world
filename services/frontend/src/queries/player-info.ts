import { gql } from "@apollo/client"

export interface PlayerResponse {
	player: {
		data: {
			id: string
			attributes: {
				username: string
				city: string
				avatar?: {
					data: {
						attributes: {
							url: string
						}
					}
				}
				publicContact?: {
					email?: string
					facebook?: string
					instagram?: string
					reddit?: string
					signal?: string
					telegram?: string
					whatsapp?: string
				}
				disciplines: {
					data: {
						id: string
						attributes: {
							startedAt?: string
							isTeaching: boolean
							level: number
							discipline: {
								data: {
									id: string
									attributes: {
										name: string
										slug: string
										icon?: {
											data: {
												attributes: {
													url: string
												}
											}
										}
									}
								}
							}
						}
					}[]
				}
				groups: {
					data: {
						id: string
						attributes: {
							name: string
							description: string
							members: {
								data: {
									id: string
									attributes: {
										username: string
									}
								}
							}
						}
					}
				}
			}
		}
	}
}

export const playerInfoQuery = gql`
	query ($id: ID!) {
		player: usersPermissionsUser(id: $id) {
			data {
				id
				attributes {
					username
					city
					avatar {
						data {
							attributes {
								url
							}
						}
					}
					publicContact {
						email
						facebook
						instagram
						reddit
						signal
						telegram
						whatsapp
					}
					disciplines {
						data {
							id
							attributes {
								startedAt
								isTeaching
								level
								discipline {
									data {
										id
										attributes {
											name
											slug
											icon {
												data {
													attributes {
														url
													}
												}
											}
										}
									}
								}
							}
						}
					}
					groups {
						data {
							id
							attributes {
								name
								description
								members {
									data {
										id
										attributes {
											username
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}
`
