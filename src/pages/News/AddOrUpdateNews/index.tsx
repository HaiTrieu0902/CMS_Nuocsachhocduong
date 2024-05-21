/* eslint-disable @typescript-eslint/no-unused-vars */
import { Breadcrumb, Container, InputUI, PlusIcon } from '@/components';
import { allowedFormatsImage } from '@/utils/common';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Editor } from '@ckeditor/ckeditor5-core';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { FileLoader, UploadAdapter } from '@ckeditor/ckeditor5-upload';
import { Button, Checkbox, Col, Form, Input, Row, Typography, Upload, UploadFile, message } from 'antd';
import ImgCrop from 'antd-img-crop';
import { UploadProps } from 'antd/lib';
import React, { useRef, useState } from 'react';
import './AddOrUpdateNews.scss';
const { TextArea } = Input;
type DataRef = {
  id?: string;
  status?: string;
  thumbnail?: string;
  fileThumbnail?: UploadFile | any;
  count?: number;
};

const customLocale = {
  upload: 'Tải lên',
  remove: 'Hủy bỏ',
  error: 'Lỗi',
};

const AddOrUpdateNews = () => {
  const [form] = Form.useForm();
  const initialDataRef = useRef<DataRef>({ id: '', status: '', thumbnail: '', count: 0, fileThumbnail: '' });
  const [imageUrl, setImageUrl] = useState<string>();
  const [editorContent, setEditorContent] = useState<string>('');

  /* Props upload file list */
  const propsUploadListPhoto: UploadProps = {
    beforeUpload: (file: any) => {
      const isAllowed = allowedFormatsImage.includes(file.type);
      if (!isAllowed) {
        message.error('You can only upload PNG, JPEG, or JPG file!');
        setImageUrl(undefined);
      } else if (file?.size / 1024 / 1024 > 5) {
        message.error('File cannot be larger than 5mb!');
        setImageUrl(undefined);
      } else {
        setImageUrl(URL.createObjectURL(file));
        form.setFieldsValue({ thumbnail: file?.name });
        return isAllowed;
      }
    },
  };

  const handleSubmit = () => {};

  /* handle onChange upload file thumbnail */
  const onChangeThumbnail: UploadProps['onChange'] = ({ file: newFileList }) => {
    initialDataRef.current.fileThumbnail = newFileList;
  };

  /* handle upload file in Ckeditor */
  const uploadAdapter = (loader: FileLoader): UploadAdapter => {
    return {
      upload: () => {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise(async (resolve, reject) => {
          try {
            const file = await loader.file;
            if (file) {
              if (!allowedFormatsImage.includes(file.type)) {
                reject('You can only upload PNG, JPEG, or JPG file!');
                return;
              }
              if (file?.size / 1024 / 1024 > 5) {
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

  /* handle upload plugin */
  const uploadPlugin = (editor: Editor) => {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
      return uploadAdapter(loader);
    };
  };

  /* handle actions news */
  const handleAddNewsOrUpdate = async () => {
    await form.validateFields().then(async (formItem) => {
      console.log('formItem', formItem);
    });
  };

  return (
    <Row className="addOrUpdate-management_container">
      <div className="addOrUpdate-header-management">
        <Breadcrumb title="Thêm tin mới" />
        <Row>
          <Button onClick={handleAddNewsOrUpdate} icon={<PlusIcon />} className="btn btn-add">
            Thêm tin mới
          </Button>
        </Row>
      </div>
      <Container className="mt-16">
        <Form form={form} layout="vertical" className="addOrUpdate-management_form" onFinish={handleSubmit}>
          <Row gutter={[{ xs: 8, sm: 16, md: 36, lg: 120, xxl: 10 }, 16]}>
            <Col xxl={{ span: 5 }} lg={{ span: 5 }} sm={{ span: 8 }}>
              <Form.Item
                name="thumbnail"
                required={false}
                rules={[
                  {
                    required: !form?.getFieldValue('thumbnail'),
                    message: 'Vui lòng chọn hình ảnh',
                  },
                ]}
              >
                <ImgCrop
                  resetText="Hoàn lại"
                  modalOk="Tải lên"
                  modalCancel="Hủy"
                  showGrid
                  rotationSlider
                  aspectSlider
                  showReset
                >
                  <Upload
                    accept="image/png,image/jpeg"
                    listType="picture-card"
                    className="avatar-uploader"
                    showUploadList={false}
                    onChange={onChangeThumbnail}
                    {...propsUploadListPhoto}
                  >
                    {imageUrl ? (
                      <div className="img_preview-news">
                        <img src={imageUrl} alt="avatar" className="thumbnail_news" />
                      </div>
                    ) : (
                      '+ Chọn ảnh'
                    )}
                  </Upload>
                </ImgCrop>
              </Form.Item>
            </Col>
            <Col xxl={{ span: 19 }} lg={{ span: 19 }} sm={{ span: 12 }}>
              <div>
                <Form.Item
                  label="Tiêu đề tin tức:"
                  name="title"
                  required={true}
                  rules={[
                    {
                      required: true,
                      message: 'Tiêu đề tin tức không được để trống',
                    },
                  ]}
                >
                  <InputUI placeholder="Tiêu đề tin tức" />
                </Form.Item>
              </div>
              <div>
                <Form.Item name="checked" required={false}>
                  <Checkbox>
                    <Typography.Text>Tin tức nổi bật</Typography.Text>
                  </Checkbox>
                </Form.Item>
              </div>
            </Col>
          </Row>
          <div>
            <Form.Item
              label="Nội dung tóm tắt"
              name="summary"
              required={false}
              rules={
                [
                  // {
                  //   max: 300,
                  //   message: 'Tối đa 300 ký tự',
                  // },
                ]
              }
            >
              <TextArea
                // showCount
                // maxLength={300}
                placeholder="Nhập nội dung tóm tắt"
                style={{ height: 80, resize: 'none', width: '100%' }}
              />
            </Form.Item>
          </div>

          <div>
            <CKEditor
              config={{
                ckfinder: {},
                extraPlugins: [uploadPlugin],
                mediaEmbed: {
                  previewsInData: true,
                },
              }}
              editor={ClassicEditor}
              data={editorContent}
              onChange={(event: any, editor: any) => {
                const data = editor?.getData();
                setEditorContent(data);
              }}
            />
          </div>
        </Form>
      </Container>
    </Row>
  );
};

export default React.memo(AddOrUpdateNews);
