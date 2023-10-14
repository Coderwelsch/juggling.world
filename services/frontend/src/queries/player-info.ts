import { gql } from "@apollo/client"

export interface PlayerResponse {
	player: {
		data: {
			id: string
			attributes: {
				username: string
				city: string
				aboutMe?: string
				location: {
					longitude: number
					latitude: number
				}
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
				userPlayLocations: {
					data: {
						id: string
						attributes: {
							name: string
							location: {
								longitude: number
								latitude: number
							}
							image?: {
								data: {
									attributes: {
										url: string
									}
								}
							}
						}
					}[]
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
					aboutMe
					location {
						longitude
						latitude
					}
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
					userPlayLocations {
						data {
							id
							attributes {
								name
								location {
									longitude
									latitude
								}
								image {
									data {
										attributes {
											url
										}
									}
								}
							}
						}
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
