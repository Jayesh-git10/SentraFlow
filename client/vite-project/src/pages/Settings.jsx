import React, { useState, useEffect } from "react"
import { useAuth } from "../context/AuthContext"
import { useTheme } from "../context/ThemeContext"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "../components/ui/Card"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { toast } from "sonner"
import { 
  User, 
  Settings as SettingsIcon, 
  Palette, 
  Sun, 
  Moon, 
  Monitor, 
  Save, 
  Sparkles,
  Lock,
  Mail
} from "lucide-react"

export default function Settings() {
  const { user } = useAuth()
  const { theme, setTheme } = useTheme()

  // Simulated Preference States (stored in localStorage)
  const [signature, setSignature] = useState(() => {
    return localStorage.getItem("setting_signature") || "Best regards,\nSupport Operations Team"
  })
  const [autoDraft, setAutoDraft] = useState(() => {
    const val = localStorage.getItem("setting_autodraft")
    return val !== "false"
  })
  const [notifyOnResolve, setNotifyOnResolve] = useState(() => {
    const val = localStorage.getItem("setting_notify")
    return val !== "false"
  })

  // Save configurations
  const handleSavePreferences = () => {
    localStorage.setItem("setting_signature", signature)
    localStorage.setItem("setting_autodraft", autoDraft.toString())
    localStorage.setItem("setting_notify", notifyOnResolve.toString())
    toast.success("Preferences saved successfully!")
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-3xl font-extrabold font-display tracking-tight">Application Settings</h2>
        <p className="text-muted-foreground text-sm">Configure your personal preferences, theme configurations, and API signatures.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Navigation / User Overview */}
        <div className="space-y-6">
          <Card className="text-center">
            <CardHeader className="pt-8">
              <div className="mx-auto h-20 w-20 rounded-full bg-primary/10 text-primary flex items-center justify-center border-2 border-primary/20">
                <span className="font-extrabold text-3xl uppercase font-display">{user?.name ? user.name[0] : <User className="h-10 w-10" />}</span>
              </div>
              <CardTitle className="mt-4">{user?.name || "User Name"}</CardTitle>
              <CardDescription className="text-xs font-mono">{user?.email}</CardDescription>
            </CardHeader>
            <CardContent className="pb-8">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary uppercase">
                <Sparkles className="h-3.5 w-3.5" /> SentraFlow Pro
              </div>
            </CardContent>
          </Card>

          {/* Theme Section */}
          <Card>
            <CardHeader className="p-4">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Palette className="h-4 w-4 text-muted-foreground" /> Theme Management
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant={theme === "light" ? "default" : "outline"}
                  className="h-14 flex flex-col items-center justify-center gap-1"
                  onClick={() => setTheme("light")}
                >
                  <Sun className="h-4 w-4" />
                  <span className="text-xs">Light Mode</span>
                </Button>
                <Button
                  variant={theme === "dark" ? "default" : "outline"}
                  className="h-14 flex flex-col items-center justify-center gap-1"
                  onClick={() => setTheme("dark")}
                >
                  <Moon className="h-4 w-4" />
                  <span className="text-xs">Dark Mode</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Configurations Forms */}
        <div className="md:col-span-2 space-y-6">
          {/* Support signature & auto draft preferences */}
          <Card>
            <CardHeader>
              <CardTitle>Draft Customization Preferences</CardTitle>
              <CardDescription>Configure how AI-generated draft responses are presented in reports.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              
              {/* Auto Draft Switch */}
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-0.5">
                  <label className="text-sm font-semibold text-foreground">Auto-resolve Priority Queue</label>
                  <p className="text-xs text-muted-foreground">
                    Automatically process feedback through Redis worker directly upon upload instead of asking for manual triggers.
                  </p>
                </div>
                <input 
                  type="checkbox" 
                  checked={autoDraft}
                  onChange={(e) => setAutoDraft(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer accent-primary" 
                />
              </div>

              {/* Toast Resolution notification */}
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-0.5">
                  <label className="text-sm font-semibold text-foreground">Worker Resolution Alerts</label>
                  <p className="text-xs text-muted-foreground">
                    Show green toast alerts in the corner of your screen as soon as the background worker completes processing.
                  </p>
                </div>
                <input 
                  type="checkbox" 
                  checked={notifyOnResolve}
                  onChange={(e) => setNotifyOnResolve(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer accent-primary" 
                />
              </div>

              {/* Text signature block */}
              <div className="space-y-2 border-t border-border/40 pt-4">
                <label className="text-xs font-semibold text-muted-foreground block">Automatic Signature Footer</label>
                <textarea
                  rows={3}
                  className="w-full text-sm border p-3 bg-muted/20 border-border/50 rounded-lg text-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none font-medium"
                  placeholder="Paste support email closing here..."
                  value={signature}
                  onChange={(e) => setSignature(e.target.value)}
                />
                <p className="text-[10px] text-muted-foreground">
                  This signature block is saved in your local workspace and appended automatically to generated ticket reports.
                </p>
              </div>

            </CardContent>
            <CardFooter className="flex justify-end border-t border-border/10 mt-4">
              <Button onClick={handleSavePreferences} className="font-semibold shadow-md">
                <Save className="mr-2 h-4 w-4" /> Save Preferences
              </Button>
            </CardFooter>
          </Card>

          {/* Account Details card */}
          <Card>
            <CardHeader>
              <CardTitle>Account Identification Details</CardTitle>
              <CardDescription>Overview of registered user metrics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] text-muted-foreground font-bold uppercase block">User Profile Identifier</span>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input readOnly className="pl-10 select-all font-semibold" value={user?.name || ""} />
                  </div>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-muted-foreground font-bold uppercase block">Registered Email address</span>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input readOnly className="pl-10 select-all text-muted-foreground font-medium" value={user?.email || ""} />
                  </div>
                </div>
              </div>

              <div className="border-t border-border/40 pt-4 text-xs text-muted-foreground">
                <p className="flex items-center gap-1.5 font-medium">
                  <Lock className="h-3.5 w-3.5 text-muted-foreground" /> Account credentials are managed and encrypted on the database server.
                </p>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  )
}
