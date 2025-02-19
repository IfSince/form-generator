enum Country {
  Germany = 'Germany',
  Foreign = 'Foreign',
}

interface Other {
  field1: string;
  field2: string;
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
