import { Movie } from "../models/Movie";

export class MovieService {
  /**
   * Lấy thông tin 1 phim theo id
   * @param id - ID của phim
   * @returns Movie nếu tìm thấy, nếu không sẽ ném lỗi
   */
  static async getMovie(id: number) {
    const movie = await Movie.findByPk(id);
    if (!movie) throw new Error("Movie not found");
    return movie;
  }

  /**
   * Lấy danh sách tất cả phim
   */
  static async getAllMovies() {
    return await Movie.findAll();
  }

  /**
   * Tạo mới 1 phim
   * @param data - Dữ liệu của phim cần tạo
   */
  static async createMovie(data: {
    title: string;
    rating: number;
    views: number;
    genre: string;
    summary: string;
    duration: number;
    total_episodes: number;
    release_year: number;
    poster_url: string;
    trailer_url: string;
  }) {
    const newMovie = await Movie.create({
      ...data,
      created_at: new Date(),
      updated_at: new Date(),
    });
    return newMovie;
  }

  /**
   * Cập nhật thông tin của phim
   * @param id - ID của phim cần cập nhật
   * @param data - Dữ liệu cập nhật (các trường có thể update)
   */
  static async updateMovie(
    id: number,
    data: Partial<{
      title: string;
      rating: number;
      views: number;
      genre: string;
      summary: string;
      duration: number;
      total_episodes: number;
      release_year: number;
      poster_url: string;
      trailer_url: string;
    }>
  ) {
    const movie = await Movie.findByPk(id);
    if (!movie) throw new Error("Movie not found");

    // Gán các giá trị mới và cập nhật updated_at
    Object.assign(movie, data, { updated_at: new Date() });
    await movie.save();
    return movie;
  }

  /**
   * Xóa phim theo id
   * @param id - ID của phim cần xóa
   */
  static async deleteMovie(id: number) {
    const movie = await Movie.findByPk(id);
    if (!movie) throw new Error("Movie not found");

    await movie.destroy();
    return { message: "Movie deleted successfully" };
  }
}
