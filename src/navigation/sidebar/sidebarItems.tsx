import { File, Inbox, Send, Receipt, LucideIcon, PanelsTopLeft } from "lucide-react"

export interface NavSubItem {
  title: string
  url: string
}

export interface NavMainItem {
  title: string
  url: string
  icon?: LucideIcon
  isActive?: boolean
  subItems?: NavSubItem[]
}

export interface NavGroup {
  id: number
  label: string
  items: NavMainItem[]
}

const basePath = "/dashboard"

export const sidebarItems: NavGroup[] = [
  {
    id: 1,
    label: "Overview",
    items: [
      {
        title: "Dashboard",
        url: basePath,
        icon: PanelsTopLeft,
        isActive: true,
      },
    ],
  },
  {
    id: 2,
    label: "Apps & Pages",
    items: [
      {
        title: "Inbox",
        url: `${basePath}/inbox`,
        icon: Inbox,
      },
      {
        title: "Invoice",
        url: "#",
        icon: Receipt,
        subItems: [
          { title: "List", url: `${basePath}/invoice/list-preview` },
          { title: "View", url: `${basePath}/invoice/view` },
          { title: "Add", url: `${basePath}/invoice/add` },
          { title: "Edit", url: `${basePath}/invoice/edit` },
        ],
      },
      {
        title: "Auth",
        url: "#",
        icon: Receipt,
        subItems: [{ title: "Unauthorized", url: `${basePath}/auth/unauthorized` }],
      },
      {
        title: "Drafts",
        url: `${basePath}/drafts`,
        icon: File,
      },
      {
        title: "Sent",
        url: `${basePath}/sent`,
        icon: Send,
      },
    ],
  },
  {
    id: 3,
    label: "Billing",
    items: [
      {
        title: "Billing",
        url: `${basePath}/billing`,
        icon: Receipt,
      },
    ],
  },
]
