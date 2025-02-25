"use client"

import React from "react"
import Image from "next/image";
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Ad {
    id: number
    image: string
    link: string
    status: string
}

interface AdFormData {
    image: string
    link: string
}

interface AdFormProps {
    onSubmit: (ad: AdFormData) => void
}

export function AdsManagement() {
    const [ads, setAds] = React.useState<Ad[]>([
        { id: 1, image: "/placeholder.svg", link: "https://example.com/ad1", status: "Active" },
        { id: 2, image: "/placeholder.svg", link: "https://example.com/ad2", status: "Inactive" },
        { id: 3, image: "/placeholder.svg", link: "https://example.com/ad3", status: "Active" },
    ])

    const handleAddAd = (newAd: AdFormData) => {
        setAds([...ads, { id: ads.length + 1, ...newAd, status: "Active" }])
    }

    const handleDeleteAd = (id: number) => {
        setAds(ads.filter((ad) => ad.id !== id))
    }

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-bold">Manage Ads</h1>

            <Dialog>
                <DialogTrigger asChild>
                    <Button>Add New Ad</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Ad</DialogTitle>
                    </DialogHeader>
                    <AdForm onSubmit={handleAddAd} />
                </DialogContent>
            </Dialog>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Image</TableHead>
                        <TableHead>Link</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {ads.map((ad) => (
                        <TableRow key={ad.id}>
                            <TableCell>
                                <Image
                                    src={ad.image || "/placeholder.svg"}
                                    alt="Ad"
                                    width={64} // tương đương với w-16 (16 x 4px = 64px)
                                    height={64} // tương đương với h-16
                                    className="object-cover"
                                />
                            </TableCell>
                            <TableCell>{ad.link}</TableCell>
                            <TableCell>{ad.status}</TableCell>
                            <TableCell>
                                <Button variant="destructive" size="sm" onClick={() => handleDeleteAd(ad.id)}>
                                    Delete
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

function AdForm({ onSubmit }: AdFormProps) {
    const [formData, setFormData] = React.useState<AdFormData>({
        image: "",
        link: "",
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit(formData)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label htmlFor="image">Image URL</Label>
                <Input id="image" name="image" value={formData.image} onChange={handleChange} required />
            </div>
            <div>
                <Label htmlFor="link">Ad Link</Label>
                <Input id="link" name="link" value={formData.link} onChange={handleChange} required />
            </div>
            <Button type="submit">Add Ad</Button>
        </form>
    )
}

