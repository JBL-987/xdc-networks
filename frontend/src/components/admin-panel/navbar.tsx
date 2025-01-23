import { ModeToggle } from "@/components/mode-toggle";
import { SheetMenu } from "@/components/admin-panel/sheet-menu";
import { useAuth } from '@/context/AuthContext';
import { Button } from "../ui/button";
import { Label } from "@radix-ui/react-label";
import { useUser } from '@/context/UserContext';

interface NavbarProps {
  title: string;
}

export function Navbar({ title }: NavbarProps) {
  
  const { handleConnect, handleDisconnect, isLoading } = useAuth();
  const { user } = useUser()

  return (
    <header className="sticky top-0 z-10 w-full bg-background/95 shadow backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:shadow-secondary">
      <div className="mx-4 sm:mx-8 flex h-14 items-center">
        <div className="flex items-center space-x-4 lg:space-x-0">
          <SheetMenu />
          <h1 className="font-bold">{title}</h1>
        </div>
        <div className="flex flex-1 items-center justify-end">
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
        </div>
      </div>
    </header>
  );
}
