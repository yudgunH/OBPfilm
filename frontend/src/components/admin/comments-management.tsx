"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"

interface Comment {
    id: number
    user: string
    movie: string
    comment: string
    date: string
}

export function CommentsManagement() {
    const [comments, setComments] = React.useState<Comment[]>([
        { id: 1, user: "John Doe", movie: "Inception", comment: "Mind-blowing!", date: "2023-06-01" },
        {
            id: 2,
            user: "Jane Smith",
            movie: "The Shawshank Redemption",
            comment: "A timeless classic.",
            date: "2023-06-02",
        },
        { id: 3, user: "Bob Johnson", movie: "The Dark Knight", comment: "Heath Ledger was amazing!", date: "2023-06-03" },
    ])

    const [searchTerm, setSearchTerm] = React.useState("")

    const handleDeleteComment = (id: number) => {
        setComments(comments.filter((comment) => comment.id !== id))
    }

    const handleApproveComment = (id: number) => {
        // In a real application, you would update the comment's status in the backend
        console.log(`Approved comment ${id}`)
    }

    const filteredComments = comments.filter((comment) => comment.movie.toLowerCase().includes(searchTerm.toLowerCase()))

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-bold">Manage Comments</h1>

            <Input
                type="text"
                placeholder="Search by movie title..."
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                className="max-w-sm"
            />

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Movie</TableHead>
                        <TableHead>Comment</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredComments.map((comment) => (
                        <TableRow key={comment.id}>
                            <TableCell>{comment.id}</TableCell>
                            <TableCell>{comment.user}</TableCell>
                            <TableCell>{comment.movie}</TableCell>
                            <TableCell>{comment.comment}</TableCell>
                            <TableCell>{comment.date}</TableCell>
                            <TableCell>
                                <Button variant="outline" size="sm" onClick={() => handleApproveComment(comment.id)}>
                                    Approve
                                </Button>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    className="ml-2"
                                    onClick={() => handleDeleteComment(comment.id)}
                                >
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

