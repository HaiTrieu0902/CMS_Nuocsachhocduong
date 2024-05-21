/* eslint-disable @typescript-eslint/no-unused-vars */
import { Breadcrumb, Container, InputUI, PlusIcon, PlusX2Icon, SelectUI } from '@/components';
import { allowedFormatsImage } from '@/utils/common';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Editor } from '@ckeditor/ckeditor5-core';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { FileLoader, UploadAdapter } from '@ckeditor/ckeditor5-upload';
import { Button, Col, Form, Input, Row, Upload, UploadFile, message } from 'antd';
import { RcFile } from 'antd/es/upload';
import { UploadProps } from 'antd/lib';
import React, { useRef, useState } from 'react';
import './AddOrUpdateProduct.scss';
const { TextArea } = Input;
type DataRef = {
  id?: string;
  status?: string;
  thumbnail?: string;
  fileThumbnail?: UploadFile | any;
  count?: number;
};

type typeUpload = {
  file: any;
  name: any;
};

const AddOrUpdateProduct = () => {
  const [form] = Form.useForm();
  const initialDataRef = useRef<DataRef>({ id: '', status: '', thumbnail: '', count: 0, fileThumbnail: '' });
  const [imageUrl, setImageUrl] = useState<string>();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [listPhoto, setListPhoto] = useState<typeUpload[]>([]);
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
      console.log('fileList', fileList);
    });
  };

  /* Changed file list */
  const onChangeFileList: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    const result = newFileList.map((item) => ({ file: item, name: item?.name }));
    setListPhoto(result);
    form.setFieldValue('image', result);
  };

  /* PreView All File Upload */
  const onPreviewAllFile = async (file: UploadFile) => {
    let src = file.url as string;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as RcFile);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  return (
    <Row className="product_action-management_container">
      <div className="product_action-header-management">
        <Breadcrumb title="Thêm sản phẩm mới" />
        <Row>
          <Button onClick={handleAddNewsOrUpdate} icon={<PlusIcon />} className="btn btn-add">
            Thêm sản phẩm
          </Button>
        </Row>
      </div>

      <Form
        style={{ width: '100%' }}
        form={form}
        layout="vertical"
        className="product_action-management_form mt-16 "
        onFinish={handleSubmit}
      >
        <Container>
          <Row gutter={[16, 0]} justify={'start'}>
            <Col span={6}>
              <Form.Item
                className="mb-0"
                label="Mã sản phẩm: "
                name="code"
                required={true}
                rules={[
                  {
                    required: true,
                    message: 'Mã sản phẩm không được để trống',
                  },
                ]}
              >
                <InputUI placeholder="Nhập mã sản phẩm" />
              </Form.Item>
            </Col>
            <Col span={18}>
              <Form.Item
                label="Tên sản phẩm: "
                name="name"
                required={true}
                rules={[
                  {
                    required: true,
                    message: 'Tên sản phẩm không được để trống',
                  },
                ]}
              >
                <InputUI placeholder="Nhập tên sản phẩm" />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item
                label="Giá tiền gốc: "
                name="code"
                required={true}
                rules={[
                  {
                    required: true,
                    message: 'Giá tiền không được để trống',
                  },
                ]}
              >
                <InputUI placeholder="Số tiền sản phẩm" />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item
                className="mb-0"
                label="% Giảm giá"
                name="code"
                required={false}
                rules={[
                  {
                    required: true,
                    message: 'Giá tiền không được để trống',
                  },
                ]}
              >
                <InputUI placeholder="" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                className="mb-0"
                label="Loại sản phẩm: "
                name="code"
                required={true}
                rules={[
                  {
                    required: true,
                    message: 'Loại sản phẩm không được để trống',
                  },
                ]}
              >
                <SelectUI placeholder="Số tiền sản phẩm" />
              </Form.Item>
            </Col>
          </Row>
        </Container>

        <Container className="mt-24">
          <Row className="session-body-image_container">
            <Col span={24}>
              {/* <Typography.Text className="title-img-product__upload">Hình ảnh sản phẩm: *</Typography.Text> */}
              <Form.Item
                className="mb-0 title-img-product__upload"
                label="Hình ảnh sản phẩm:"
                name="image"
                required={true}
                rules={[
                  {
                    required: true,
                    message: 'Hình ảnh không được để trống',
                  },
                ]}
              >
                <Col style={{ marginTop: 10 }} span={24}>
                  <Upload
                    accept="image/png, image/jpeg"
                    listType="picture-card"
                    fileList={fileList}
                    onChange={onChangeFileList}
                    onPreview={onPreviewAllFile}
                    {...propsUploadListPhoto}
                  >
                    {fileList?.length < 20 && <PlusX2Icon />}
                  </Upload>

                  {/* {fileList?.length === 0 && isHasImage && (
                    <Typography.Text className="title-img-product_error">Hình ảnh không được để trống</Typography.Text>
                  )} */}
                </Col>
              </Form.Item>
            </Col>
          </Row>
        </Container>

        <Container className="mt-24">
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
        </Container>
      </Form>
    </Row>
  );
};

export default React.memo(AddOrUpdateProduct);
