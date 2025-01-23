"use client"
import React, { createContext, useContext, useEffect, useState } from "react"
import { useMagic } from "@/context/MagicProvider"

type User = {
  address: string
}

type UserContextType = {
  user: User | null
  fetchUser: () => Promise<void>
}

const UserContext = createContext<UserContextType>({
  user: null,
  fetchUser: async () => {},
})

export const useUser = () => useContext(UserContext)

export const UserProvider = ({ children }: { children: React.ReactNode }) => {

  const { web3 } = useMagic()

  const [address, setAddress] = useState<string | null>(null)

  const fetchUserAccount = async () => {
    const accounts = await web3?.eth.getAccounts()
    setAddress(accounts ? accounts[0] : null)
  }

  useEffect(() => {
    fetchUserAccount()
  }, [web3])

  return (
    <UserContext.Provider
      value={{
        user: address ? { address: address } : null,
        fetchUser: fetchUserAccount,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}
