"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"

interface User {
    id: number
    email: string
    username: string
    registrationDate: string
    isAdmin: boolean
}

export function UsersManagement() {
    const [users, setUsers] = React.useState<User[]>([
        { id: 1, email: "john@example.com", username: "johndoe", registrationDate: "2023-01-01", isAdmin: false },
        { id: 2, email: "jane@example.com", username: "janesmith", registrationDate: "2023-02-15", isAdmin: false },
        { id: 3, email: "admin@example.com", username: "adminuser", registrationDate: "2022-12-01", isAdmin: true },
    ])

    const [searchTerm, setSearchTerm] = React.useState("")

    const handleDeleteUser = (id: number) => {
        setUsers(users.filter((user) => user.id !== id))
    }

    const handleToggleAdmin = (id: number) => {
        setUsers(users.map((user) => (user.id === id ? { ...user, isAdmin: !user.isAdmin } : user)))
    }

    const filteredUsers = users.filter(
        (user) =>
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.username.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-bold">Manage Users</h1>

            <Input
                type="text"
                placeholder="Search by email or username..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                className="max-w-sm"
            />

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Username</TableHead>
                        <TableHead>Registration Date</TableHead>
                        <TableHead>Admin Status</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell>{user.id}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.username}</TableCell>
                            <TableCell>{user.registrationDate}</TableCell>
                            <TableCell>{user.isAdmin ? "Admin" : "User"}</TableCell>
                            <TableCell>
                                <Button variant="outline" size="sm" onClick={() => handleToggleAdmin(user.id)}>
                                    {user.isAdmin ? "Remove Admin" : "Make Admin"}
                                </Button>
                                <Button variant="destructive" size="sm" className="ml-2" onClick={() => handleDeleteUser(user.id)}>
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

