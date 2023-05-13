import { Blog } from "../../../domain/entities/Blog";
import BlogRepository from "../../../domain/repositories/BlogRepository";


export class GetAllBlogPosts {
  constructor(private blogPostRepository: BlogRepository) {}

  async execute(): Promise<Blog[]> {
    return await this.blogPostRepository.findAll();
  }
}
