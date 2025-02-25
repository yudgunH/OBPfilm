"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

interface Settings {
    moderateComments: boolean
    emailNotifications: boolean
    siteName: string
    contactEmail: string
}

export function Settings() {
    const [settings, setSettings] = React.useState<Settings>({
        moderateComments: true,
        emailNotifications: true,
        siteName: "My Movie Website",
        contactEmail: "contact@example.com",
    })

    const handleToggle = (setting: keyof Settings) => {
        setSettings((prev) => ({ ...prev, [setting]: !prev[setting] }))
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setSettings((prev) => ({ ...prev, [name]: value }))
    }

    const handleSave = () => {
        // In a real application, you would save these settings to your backend
        console.log("Saving settings:", settings)
    }

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-bold">Settings</h1>

            <Card>
                <CardHeader>
                    <CardTitle>General Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="moderate-comments">Moderate Comments</Label>
                        <Switch
                            id="moderate-comments"
                            checked={settings.moderateComments}
                            onCheckedChange={() => handleToggle("moderateComments")}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <Label htmlFor="email-notifications">Email Notifications</Label>
                        <Switch
                            id="email-notifications"
                            checked={settings.emailNotifications}
                            onCheckedChange={() => handleToggle("emailNotifications")}
                        />
                    </div>
                    <div>
                        <Label htmlFor="site-name">Site Name</Label>
                        <Input id="site-name" name="siteName" value={settings.siteName} onChange={handleInputChange} />
                    </div>
                    <div>
                        <Label htmlFor="contact-email">Contact Email</Label>
                        <Input
                            id="contact-email"
                            name="contactEmail"
                            type="email"
                            value={settings.contactEmail}
                            onChange={handleInputChange}
                        />
                    </div>
                    <Button onClick={handleSave}>Save Settings</Button>
                </CardContent>
            </Card>
        </div>
    )
}

