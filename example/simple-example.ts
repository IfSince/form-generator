enum Country {
  Germany = 'Germany',
  Foreign = 'Foreign',
}

class Address {
  street: string
  houseNumber?: number
  country: Country
}

export interface Person {
  firstName?: string
  lastName: string
  dateOfBirth: Date
  readonly isVerified: boolean
  address: Address
}
