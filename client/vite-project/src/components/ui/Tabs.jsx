import React, { createContext, useContext, useState } from "react"
import { cn } from "../../utils/utils"

const TabsContext = createContext(null)

export const Tabs = ({ defaultValue, value, onValueChange, className, children, ...props }) => {
  const [activeTab, setActiveTab] = useState(defaultValue)
  const currentTab = value !== undefined ? value : activeTab
  const setTab = onValueChange !== undefined ? onValueChange : setActiveTab

  return (
    <TabsContext.Provider value={{ activeTab: currentTab, setActiveTab: setTab }}>
      <div className={cn("w-full", className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  )
}

export const TabsList = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground border border-border/50",
      className
    )}
    {...props}
  />
))
TabsList.displayName = "TabsList"

export const TabsTrigger = React.forwardRef(({ className, value, ...props }, ref) => {
  const { activeTab, setActiveTab } = useContext(TabsContext)
  const isActive = activeTab === value

  return (
    <button
      ref={ref}
      role="tab"
      aria-selected={isActive}
      onClick={() => setActiveTab(value)}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
        isActive
          ? "bg-card text-foreground shadow-sm font-semibold"
          : "hover:text-foreground/80",
        className
      )}
      {...props}
    />
  )
})
TabsTrigger.displayName = "TabsTrigger"

export const TabsContent = React.forwardRef(({ className, value, children, ...props }, ref) => {
  const { activeTab } = useContext(TabsContext)
  const isActive = activeTab === value

  if (!isActive) return null

  return (
    <div
      ref={ref}
      role="tabpanel"
      className={cn(
        "mt-2 focus-visible:outline-none",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})
TabsContent.displayName = "TabsContent"
