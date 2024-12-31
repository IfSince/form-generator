enum Country {
  GERMANY,
  FOREIGN
}

interface Address {
  street: string
  houseNumber?: string
  country: Country
}

export class Person {
  firstName?: string
  lastName: string
  age: number
  readonly isVerified: boolean
  address: Address
}
