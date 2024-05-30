/* eslint-disable no-async-promise-executor */
// components/RichTextEditor.tsx

import { BASE_URL } from '@/constants/urls';
import { UploadImagesApi } from '@/services/api/common';
import { allowedFormatsImage } from '@/utils/common';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { FileLoader, UploadAdapter } from '@ckeditor/ckeditor5-upload';
import React from 'react';

interface RichTextEditorProps {
  content: string;
  onContentChange: (content: string) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ content, onContentChange }) => {
  console.log('📢 [index.tsx:19]', content);
  const uploadAdapter = (loader: FileLoader): UploadAdapter => {
    return {
      upload: () => {
        return new Promise(async (resolve, reject) => {
          try {
            const file = await loader.file;
            if (file) {
              if (!allowedFormatsImage.includes(file.type)) {
                reject('You can only upload PNG, JPEG, or JPG file!');
                return;
              }
              if (file.size / 1024 / 1024 > 5) {
                reject('File cannot be larger than 5mb!');
                return;
              }
            }
            const reader = new FileReader();
            reader.onload = (event) => {
              const imageUrl = event.target?.result as string;
              resolve({ default: imageUrl });
            };
            reader.readAsDataURL(file as never);
          } catch (error) {
            reject('Reject');
          }
        });
      },
      abort: () => {},
    };
  };

  const uploadPlugin = (editor: any) => {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader: FileLoader) => {
      return uploadAdapter(loader);
    };
  };

  const handleBeforeSaveLoadImage = async (editorContent: string) => {
    const uploadedFiles: File[] = [];
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(editorContent, 'text/html');
    const imgElements = htmlDoc.getElementsByTagName('img');

    for (let i = 0; i < imgElements.length; i++) {
      const imgSrc = imgElements[i].getAttribute('src');
      if (imgSrc && imgSrc.startsWith('data:')) {
        const dataUrlParts = imgSrc.split(',');
        const mimeString = dataUrlParts[0].split(':')[1].split(';')[0];
        const byteString = atob(dataUrlParts[1]);
        const arrayBuffer = new ArrayBuffer(byteString.length);
        const intArray = new Uint8Array(arrayBuffer);
        for (let j = 0; j < byteString.length; j++) {
          intArray[j] = byteString.charCodeAt(j);
        }
        const blob = new Blob([arrayBuffer], { type: mimeString });
        const file = new File([blob], `image_${i}.png`, {
          lastModified: new Date().getTime(),
          type: mimeString,
        });

        uploadedFiles.push(file);
      }
    }

    return uploadedFiles;
  };

  const handleUploadImageList = async (editorContent: string) => {
    const listImageCKeditor = await handleBeforeSaveLoadImage(editorContent);
    const uploadPromises = listImageCKeditor.map((file) => UploadImagesApi(file));
    const uploadResults = await Promise.all(uploadPromises);
    const imageUrls = uploadResults.map((result) => `${BASE_URL}${result.imagePath}`);
    return imageUrls;
  };

  const updateEditorContent = async (uploadedImages: string[], editorContent: string) => {
    let updatedContent = editorContent;
    const parser = new DOMParser();
    const doc = parser.parseFromString(updatedContent, 'text/html');
    const images = doc.querySelectorAll('img');
    let uploadedIndex = 0;
    for (let index = 0; index < images.length; index++) {
      const img = images[index];
      const imgSrc = img.getAttribute('src');
      if (imgSrc && imgSrc.startsWith('data:')) {
        if (uploadedIndex < uploadedImages.length) {
          img.setAttribute('src', uploadedImages[uploadedIndex]);
          img.setAttribute('style', 'width: 100% !important; object-fit: contain; border-radius: 16px !important');
          img.setAttribute('width', 'auto');
          img.setAttribute('height', 'auto');
          uploadedIndex++;
        } else {
          img.setAttribute('src', imgSrc);
          img.setAttribute('style', 'width: 100% !important; object-fit: contain; border-radius: 16px !important');
          img.setAttribute('width', 'auto');
          img.setAttribute('height', 'auto');
        }
      }
    }
    updatedContent = doc.documentElement.innerHTML;
    return updatedContent;
  };

  return (
    <CKEditor
      editor={ClassicEditor}
      config={{
        extraPlugins: [uploadPlugin],
        mediaEmbed: {
          previewsInData: true,
        },
      }}
      data={content}
      onChange={async (event, editor) => {
        const data = editor.getData();
        const uploadedImages = await handleUploadImageList(data);
        const updatedContent = await updateEditorContent(uploadedImages, data);
        onContentChange(updatedContent);
      }}
    />
  );
};

export default RichTextEditor;
