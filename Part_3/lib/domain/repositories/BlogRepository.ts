import {Blog} from "../entities/Blog";
import { ID } from "../entities/Entity";
import User from "../entities/User";

export default interface BlogRepository  {
  create(blogPost: Blog): Promise<Blog>;
  findById(id: string): Promise<Blog | null>;
  findAll(): Promise<Blog[]>;
  update(id: string, blogPost: Partial<Blog>): Promise<Blog>;
  delete(id: string): Promise<void>;
  findLatest(): Promise<Blog | null>;
};
