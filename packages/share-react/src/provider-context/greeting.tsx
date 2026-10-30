import { createContext, useContext, type ReactNode } from 'react'

export type Customer = Readonly<{ name: string }>

export const CustomerContext = createContext<Customer>({ name: 'Guest' })

export const CustomerProvider = ({
  customer,
  children,
}: {
  customer: Customer
  children: ReactNode
}) => <CustomerContext.Provider value={customer}>{children}</CustomerContext.Provider>

export const Greeting = () => {
  const customer = useContext(CustomerContext)
  return <p>Hello {customer.name}</p>
}

export const CartNote = ({ show }: { show: boolean }) => {
  const customer = useContext(CustomerContext)
  return show ? <p>Cart of {customer.name}</p> : null
}

export const Header = ({ showCart }: { showCart: boolean }) => (
  <header>
    <Greeting />
    <CartNote show={showCart} />
  </header>
)

export const Shop = ({ customer }: { customer: Customer }) => (
  <CustomerProvider customer={customer}>
    <Header showCart />
  </CustomerProvider>
)
