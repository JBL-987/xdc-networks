import React, { useEffect } from 'react'
import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { PanelsTopLeft } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle";
import { useUser } from "@/context/UserContext"
import { Label } from '@radix-ui/react-label';
import { useAuth } from '@/context/AuthContext';

const NavbarComponents = () => {
  
  const { handleConnect, handleDisconnect, isLoading } = useAuth();
  const { user } = useUser()

  return (
    <header className="z-[50] sticky top-0 w-full bg-background/95 border-b backdrop-blur-sm dark:bg-black/[0.6] border-border/40">
    <div className="container h-14 flex items-center">
      <Link
        href="/dashboard"
        className="flex justify-start items-center hover:opacity-85 transition-opacity duration-300 text-lg sm:text-base xs:text-sm"
      >
        <PanelsTopLeft className="flex w-6 h-6 mr-3 xs:mr-2" />
        <span className="font-bold w-16 md:w-32 lg:w-48">XDC Verify</span>
        <span className="sr-only">Back to main page</span>
      </Link>
      <nav className="ml-auto flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full w-8 h-8 bg-background"
          asChild
        ></Button>
        <ModeToggle />

        {user ? (
          <div className="flex items-center gap-2">
            <Button
              onClick={handleDisconnect}
              disabled={isLoading}
            >
              Disconnect
            </Button>
            <Label
            className='text-xs'
            >
              {user?.address ? `${user.address.substring(0, 8)}...` : ''}
            </Label>
          </div>
        ) : (
          <Button
            onClick={handleConnect}
            disabled={isLoading}
          >
         Connect
          </Button>
        )}
      </nav>
    </div>
  </header>
  )
}

export default NavbarComponents
