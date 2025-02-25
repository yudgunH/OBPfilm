"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

// Thêm dữ liệu giả cho biểu đồ
const chartData = [
    { name: "Jan", views: 4000 },
    { name: "Feb", views: 3000 },
    { name: "Mar", views: 5000 },
    { name: "Apr", views: 4500 },
    { name: "May", views: 6000 },
    { name: "Jun", views: 5500 },
]

export function DashboardHome() {
    // Cập nhật số liệu giả
    const stats = [
        { title: "Total Movies", value: 1234 },
        { title: "Total Users", value: 5678 },
        { title: "Total Views", value: "1.2M" },
        { title: "Active Ads", value: 15 },
    ]

    const recentMovies = [
        { title: "Inception", genre: "Sci-Fi", year: 2010, views: 120000 },
        { title: "The Shawshank Redemption", genre: "Drama", year: 1994, views: 95000 },
        { title: "The Dark Knight", genre: "Action", year: 2008, views: 150000 },
    ]

    const recentComments = [
        { user: "John Doe", movie: "Inception", comment: "Mind-blowing!", date: "2023-06-01" },
        { user: "Jane Smith", movie: "The Shawshank Redemption", comment: "A timeless classic.", date: "2023-06-02" },
        { user: "Bob Johnson", movie: "The Dark Knight", comment: "Heath Ledger was amazing!", date: "2023-06-03" },
    ]

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-bold">Dashboard Overview</h1>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat) => (
                    <Card key={stat.title}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Views Over Time</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="views" stroke="#8884d8" />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Recently Added Movies</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Genre</TableHead>
                                    <TableHead>Year</TableHead>
                                    <TableHead>Views</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recentMovies.map((movie) => (
                                    <TableRow key={movie.title}>
                                        <TableCell>{movie.title}</TableCell>
                                        <TableCell>{movie.genre}</TableCell>
                                        <TableCell>{movie.year}</TableCell>
                                        <TableCell>{movie.views.toLocaleString()}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Recent Comments</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>User</TableHead>
                                    <TableHead>Movie</TableHead>
                                    <TableHead>Comment</TableHead>
                                    <TableHead>Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recentComments.map((comment, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{comment.user}</TableCell>
                                        <TableCell>{comment.movie}</TableCell>
                                        <TableCell>{comment.comment}</TableCell>
                                        <TableCell>{comment.date}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

