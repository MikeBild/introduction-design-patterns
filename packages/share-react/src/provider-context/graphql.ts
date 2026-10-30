import { ApolloServer } from '@apollo/server'

const customers = new Map([
  ['c-1', { id: 'c-1', name: 'Ada' }],
  ['c-2', { id: 'c-2', name: 'Grace' }],
])

let currentCustomerId = ''

const typeDefs = /* GraphQL */ `
  type Customer {
    id: ID!
    name: String!
  }

  type Query {
    me: Customer
  }
`

const resolvers = {
  Query: {
    me: () => customers.get(currentCustomerId),
  },
}

const server = new ApolloServer({ typeDefs, resolvers })

export const whoAmI = async (customerId: string) => {
  currentCustomerId = customerId
  const response = await server.executeOperation({ query: 'query Me { me { name } }' })
  if (response.body.kind !== 'single') throw new Error('Expected a single result')
  return response.body.singleResult.data as { me: { name: string } | null }
}
