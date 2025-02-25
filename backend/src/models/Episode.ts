import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from "sequelize-typescript";
import { Movie } from "./Movie";

@Table({
  tableName: "Episodes",
  timestamps: true,
})
export class Episode extends Model {
  @ForeignKey(() => Movie)
  @Column({ type: DataType.INTEGER, allowNull: false })
  movieId!: number;

  @Column({ type: DataType.INTEGER, allowNull: false })
  episodeNumber!: number;

  // @Column({ type: DataType.INTEGER, allowNull: false })
  // episodeViews!: number;

  @Column({ type: DataType.STRING, allowNull: false })
  videoUrl!: string;

  @BelongsTo(() => Movie)
  movie!: Movie;
}
