export enum LocationType {
	Park = "park",
	Skatepark = "skatepark",
	GymHall = "gym-hall",
	BasketballCourt = "basketball-court",
	Other = "other",
}

export interface Member {
	id: number
	username: string,
	avatar?: {
		id: number
		url: string
	}
}

export interface GroupEvent {
	id: number
	name: string
	description: string
	start: Date
	admins: Array<Member>
	location: {
		id: number
		name: "Bassinplatz"
		type: LocationType
		location: {
			longitude: number
			latitude: number
		}
		image?: {
			id: number
			url: string
		}
	}
}

export interface Group {
	id: string
	name: string
	description?: string
	isPrivate: boolean
	isAdmin: boolean
	members: Array<Member>
	admins: Array<Member>
	avatar?: {
		url: string
	}
	location: {
		latitude: number
		longitude: number
	}
	events: GroupEvent[]
}

