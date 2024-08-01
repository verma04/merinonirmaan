import React from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Circle } from "lucide-react"
import initials from "initials"
import { sidebarItems, SidebarItem, NavItem, NavHeader } from "@/navigation/sidebar-items/sidebarItems"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import useVariantBasedOnRoute from "@/hooks/useVariantBasedOnRoute"

type GetVariantFunction = (route: string) => "default" | "ghost"

function SidebarHeading({ heading, isMobileSidebar = false }: { heading: string; isMobileSidebar: boolean }) {
  return (
    <h4 className={cn("px-3 text-zinc-500 text-sm mt-2 mb-1 uppercase text-left", isMobileSidebar && "px-1")}>
      {heading}
    </h4>
  )
}

function SidebarItemWithChildren({
  item,
  isCollapsed = false,
  getVariant,
}: {
  item: NavItem
  isCollapsed?: boolean
  getVariant: GetVariantFunction
}) {
  const childRoutes = item.children?.map((child) => child.route || "") || []
  const currentPath = usePathname()
  const isActive = childRoutes.some((route) => currentPath.includes(route))

  return (
    <AccordionItem value={item.title} className="border-none">
      <AccordionTrigger
        className={cn(
          buttonVariants({ variant: "ghost", size: isCollapsed ? "icon" : "sm" }),
          isCollapsed && "hide-accordion-icon",
          "flex items-center justify-between hover:no-underline py-0 w-9 h-9",
          isActive && "bg-accent",
        )}
      >
        {isCollapsed ? (
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <div className="flex size-9 items-center justify-center">
                <item.icon className="size-4" />
                <span className="sr-only">{item.title}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="right" className="flex items-center gap-4">
              {item.title}
              {item.label && <span className="ml-auto text-muted-foreground">{item.label}</span>}
            </TooltipContent>
          </Tooltip>
        ) : (
          <div className="flex items-center">
            <item.icon className="mr-2 size-4" />
            {item.title}
            {item.label && (
              <span className={cn("ml-auto", item.variant === "default" && "text-background")}>{item.label}</span>
            )}
          </div>
        )}
      </AccordionTrigger>
      <AccordionContent className="mt-1 flex flex-col gap-1 pb-0">
        {item.children?.map((child) =>
          isCollapsed ? (
            <Tooltip key={child.title} delayDuration={0}>
              <TooltipTrigger asChild>
                <Link
                  href={child.route || "#"}
                  className={cn(buttonVariants({ variant: getVariant(child.route), size: "icon" }), "h-9 w-9")}
                >
                  <span className="text-sm">{initials(child.title)}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right" className="flex items-center gap-4">
                {child.title}
                {child.label && <span className="ml-auto text-muted-foreground">{child.label}</span>}
              </TooltipContent>
            </Tooltip>
          ) : (
            <Link
              key={child.title}
              href={child.route || "#"}
              className={cn(
                buttonVariants({ variant: getVariant(child.route), size: "sm" }),
                "flex items-center justify-start py-0 px-4",
              )}
            >
              <Circle className={cn("mr-2 h-3 w-3")} />
              <div className={cn("text-sm duration-200")}>{child.title}</div>
            </Link>
          ),
        )}
      </AccordionContent>
    </AccordionItem>
  )
}

function CollapsedSidebar({ item, getVariant }: { item: NavItem; getVariant: GetVariantFunction }) {
  if (item.children) {
    return <SidebarItemWithChildren item={item} isCollapsed getVariant={getVariant} />
  }

  const variant = getVariant(item.route || "")

  return (
    <Tooltip delayDuration={0}>
      <TooltipTrigger asChild>
        <Link href={item.route || "#"} className={cn(buttonVariants({ variant, size: "icon" }), "h-9 w-9")}>
          <item.icon className="size-4" />
          <span className="sr-only">{item.title}</span>
        </Link>
      </TooltipTrigger>
      <TooltipContent side="right" className="flex items-center gap-4">
        {item.title}
        {item.label && <span className="ml-auto text-muted-foreground">{item.label}</span>}
      </TooltipContent>
    </Tooltip>
  )
}

function ExpandedSidebar({ item, getVariant }: { item: NavItem; getVariant: GetVariantFunction }) {
  if (item.children) {
    return <SidebarItemWithChildren item={item} getVariant={getVariant} />
  }

  const variant = getVariant(item.route || "")

  return (
    <Link
      href={item.route || "#"}
      className={cn(buttonVariants({ variant, size: "sm" }), "flex justify-start items-center")}
    >
      <item.icon className="mr-2 size-4" />
      {item.title}
      {item.label && (
        <span className={cn("ml-auto", item.variant === "default" && "text-background")}>{item.label}</span>
      )}
    </Link>
  )
}

interface NavProps {
  isCollapsed: boolean
  isMobileSidebar?: boolean
}

function isNavItem(item: SidebarItem): item is NavItem {
  return (item as NavItem).title !== undefined
}

export default function Sidebar({ isCollapsed, isMobileSidebar = false }: NavProps) {
  const getVariant = useVariantBasedOnRoute()
  return (
    <TooltipProvider delayDuration={0}>
      <Accordion type="single" collapsible>
        <div data-collapsed={isCollapsed} className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2">
          <nav
            className={cn(
              "grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2",
              isMobileSidebar && "p-0",
            )}
          >
            {sidebarItems.map((item: SidebarItem) => {
              if (isCollapsed) {
                if (isNavItem(item)) {
                  return <CollapsedSidebar key={item.title} item={item} getVariant={getVariant} />
                }
                return <Separator key={(item as NavHeader).heading} />
              }
              if (isNavItem(item)) {
                return <ExpandedSidebar key={item.title} item={item} getVariant={getVariant} />
              }
              return (
                <SidebarHeading
                  isMobileSidebar={isMobileSidebar}
                  key={(item as NavHeader).heading}
                  heading={(item as NavHeader).heading}
                />
              )
            })}
          </nav>
        </div>
      </Accordion>
    </TooltipProvider>
  )
}