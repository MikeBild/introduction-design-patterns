import { ApolloServer } from '@apollo/server'

export type Context = Readonly<{ customerId: string }>

const customers = new Map([
  ['c-1', { id: 'c-1', name: 'Ada' }],
  ['c-2', { id: 'c-2', name: 'Grace' }],
])

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
    me: (_parent: unknown, _args: unknown, { customerId }: Context) => customers.get(customerId),
  },
}

const server = new ApolloServer<Context>({ typeDefs, resolvers })

export const whoAmI = async (customerId: string) => {
  const response = await server.executeOperation(
    { query: 'query Me { me { name } }' },
    { contextValue: { customerId } },
  )
  if (response.body.kind !== 'single') throw new Error('Expected a single result')
  return response.body.singleResult.data as { me: { name: string } | null }
}
