import {
  Bookmark,
  LayoutGrid,
  LucideIcon
} from "lucide-react";

type Submenu = {
  href: string;
  label: string;
  active?: boolean;
};

type Menu = {
  href: string;
  label: string;
  active?: boolean;
  icon: LucideIcon;
  submenus?: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: "",
      menus: [
        {
          href: "/dashboard",
          label: "Dashboard",
          icon: LayoutGrid,
          submenus: []
        }
      ]
    },
    {
       groupLabel: "Setting",
       menus: [
         {
           href: "/settings/address-book",
           label: "Address Book",
           icon: Bookmark
         },
         {
           href: "/settings/address-book-resolver",
           label: "Address Book Resolver",
           icon: Bookmark
         }
       ]
     },
  ];
}
