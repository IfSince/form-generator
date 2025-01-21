enum Country {
  GERMANY = 'GERMANY',
  FOREIGN = 'FOREIGN'
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

class DateTestClass {
  dateField?: Date
  dateTimeField: string = '2023-01-02T10:00:00Z'
}
