import BlogRepository from "../../../domain/repositories/BlogRepository";

export class DeleteBlogPost {
  constructor(private blogPostRepository: BlogRepository) {}

  async execute(id: string): Promise<void> {
    await this.blogPostRepository.delete(id);
  }
}
