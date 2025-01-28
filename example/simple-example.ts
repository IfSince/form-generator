enum Country {
  GERMANY = 'GERMANY',
  FOREIGN = 'FOREIGN'
}

class Address {
  street: string
  houseNumber?: string
  country: Country
}

export interface Person {
  firstName?: string
  lastName: string
  dateOfBirth: Date
  readonly isVerified: boolean
  address: Address
}
