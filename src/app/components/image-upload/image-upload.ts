import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-image-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-upload.html',
  styleUrl: './image-upload.css',
})
export class ImageUploadComponent {
  @Input() currentUrl: string = '';
  @Input() multiple: boolean = false;
  @Input() currentUrls: string[] = [];
  @Input() label: string = 'Image';

  @Output() imageSelected = new EventEmitter<File>();
  @Output() imageRemoved = new EventEmitter<void>();
  @Output() multipleImagesSelected = new EventEmitter<File[]>();
  @Output() multipleImageRemoved = new EventEmitter<number>();

  previewUrl: string | null = null;
  previewUrls: string[] = [];
  isDragging = false;
  errorMessage = '';

  private readonly MAX_SIZE = 5 * 1024 * 1024; // 5MB
  private readonly ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    const files = event.dataTransfer?.files;
    if (!files || files.length === 0) return;

    if (this.multiple) {
      this.handleMultipleFiles(Array.from(files));
    } else {
      this.handleFile(files[0]);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    if (this.multiple) {
      this.handleMultipleFiles(Array.from(input.files));
    } else {
      this.handleFile(input.files[0]);
    }

    // Reset so the same file can be re-selected
    input.value = '';
  }

  private handleFile(file: File): void {
    this.errorMessage = '';

    if (!this.ALLOWED_TYPES.includes(file.type)) {
      this.errorMessage = 'Please select a valid image (JPG, PNG, WebP, GIF).';
      return;
    }

    if (file.size > this.MAX_SIZE) {
      this.errorMessage = 'Image must be smaller than 5 MB.';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl = reader.result as string;
    };
    reader.readAsDataURL(file);

    this.imageSelected.emit(file);
  }

  private handleMultipleFiles(files: File[]): void {
    this.errorMessage = '';
    const validFiles: File[] = [];

    for (const file of files) {
      if (!this.ALLOWED_TYPES.includes(file.type)) {
        this.errorMessage = `${file.name}: Invalid format. Use JPG, PNG, WebP, or GIF.`;
        continue;
      }
      if (file.size > this.MAX_SIZE) {
        this.errorMessage = `${file.name}: File too large (max 5 MB).`;
        continue;
      }

      validFiles.push(file);

      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrls.push(reader.result as string);
      };
      reader.readAsDataURL(file);
    }

    if (validFiles.length > 0) {
      this.multipleImagesSelected.emit(validFiles);
    }
  }

  removeImage(): void {
    this.previewUrl = null;
    this.imageRemoved.emit();
  }

  removeMultipleImage(index: number): void {
    this.previewUrls.splice(index, 1);
    this.multipleImageRemoved.emit(index);
  }

  get displayUrl(): string | null {
    return this.previewUrl || this.currentUrl || null;
  }

  get displayUrls(): string[] {
    return [...this.currentUrls, ...this.previewUrls];
  }
}
