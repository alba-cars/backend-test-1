export class Blog {
  reference: string;
  title: string;
  description: string;
  main_image: string;
  additional_images: string[];
  date_time: number;

  constructor(data: Partial<Blog>) {
    this.reference = data.reference || '';
    this.title = data.title || '';
    this.description = data.description || '';
    this.main_image = data.main_image || '';
    this.additional_images = data.additional_images || [];
    this.date_time = data.date_time || Date.now();
  }
}
