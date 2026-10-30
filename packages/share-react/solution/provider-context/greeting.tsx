import { createContext, use } from 'react'

export type Customer = Readonly<{ name: string }>

export const CustomerContext = createContext<Customer | null>(null)

const assertProvided = (customer: Customer | null): Customer => {
  if (!customer) throw new Error('useCustomer needs a CustomerContext')
  return customer
}

export const useCustomer = (): Customer => assertProvided(use(CustomerContext))

export const Greeting = () => <p>Hello {useCustomer().name}</p>

export const CartNote = ({ show }: { show: boolean }) => {
  if (!show) return null
  return <p>Cart of {assertProvided(use(CustomerContext)).name}</p>
}

export const Header = ({ showCart }: { showCart: boolean }) => (
  <header>
    <Greeting />
    <CartNote show={showCart} />
  </header>
)

export const Shop = ({ customer }: { customer: Customer }) => (
  <CustomerContext value={customer}>
    <Header showCart />
  </CustomerContext>
)
