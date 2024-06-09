/* eslint-disable @typescript-eslint/no-unused-vars */
import { Breadcrumb, Container, InputUI, PlusIcon } from '@/components';
import { BASE_URL } from '@/constants/urls';
import useLoading from '@/hooks/useLoading';
import { INews } from '@/models/news.model';
import { UploadImagesMultiplieApi } from '@/services/api/common';
import { createNewsAPI, getDetailNewsAPI, updateNewsAPI } from '@/services/api/new';
import {
  allowedFormatsImage,
  handleBeforeSaveLoadImage,
  handleImageProcessing,
  updateEditorContent,
  uploadPlugin,
} from '@/utils/common';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { history, useParams } from '@umijs/max';
import { Button, Checkbox, Col, Form, Input, Row, Typography, Upload, UploadFile, message } from 'antd';
import ImgCrop from 'antd-img-crop';
import { UploadProps } from 'antd/lib';
import React, { useEffect, useState } from 'react';
import './AddOrUpdateNews.scss';
const { TextArea } = Input;

const AddOrUpdateNews = () => {
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState<string>();
  const { isLoading, withLoading } = useLoading();
  const [fileList, setFileList] = useState<UploadFile>();
  const { id } = useParams<{ id: string }>();
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
        return false;
      }
    },
  };

  const handleSubmit = () => {};

  /* handle upload image list in Ckeditor */
  const handleUploadImageList = async (editorContent: string) => {
    const listImageCKeditor = await handleBeforeSaveLoadImage(editorContent);
    const uploadResults = await UploadImagesMultiplieApi(listImageCKeditor);
    const imageUrls = uploadResults.map((url: string) => `${BASE_URL}${url}`);
    return imageUrls;
  };

  /* handle onChange upload file thumbnail */
  const onChangeThumbnail: UploadProps['onChange'] = ({ file: newFileList }) => {
    setFileList(newFileList);
  };

  /* handle actions news */
  const handleAddNewsOrUpdate = async () => {
    await withLoading(async () => {
      try {
        await form.validateFields().then(async (formValues: INews) => {
          const imageUrls = await handleImageProcessing([fileList]);
          /** CK editor content */
          const uploadedImagesCkeditor = await handleUploadImageList(editorContent);
          const content = await updateEditorContent(uploadedImagesCkeditor, editorContent, true);

          /** Param API */
          const params = {
            ...formValues,
            content: content,
            position: formValues.position ? 1 : 0,
            thumbnail: imageUrls[0],
          };

          /** Check Id  */
          if (id) {
            await updateNewsAPI({ ...params }, id);
            message.success('Cập nhật bài viết thành công');
          } else {
            await createNewsAPI(params);
            message.success('Thêm bài viết thành công');
          }
          await history.push('/news');
        });
      } catch (error: any) {
        if (!error?.errorFields) {
          message.error(error?.message);
        }
      }
    });
  };

  /** Use Effect */
  useEffect(() => {
    if (id) {
      const handleGetNewsDetail = async () => {
        try {
          const res = await getDetailNewsAPI(id);
          const setInitialForm: INews = {
            title: res?.data?.title,
            summary: res?.data?.summary,
            position: res?.data?.position,
            content: '',
            thumbnail: res?.data?.thumbnail,
          };
          form?.setFieldsValue(setInitialForm);
          setFileList({
            uid: res?.data?.createdAt,
            name: res?.data?.thumbnail?.split('/').pop(),
            status: 'hasExits',
            url: `${BASE_URL}${res?.data?.thumbnail}`,
          } as any);
          setImageUrl(`${BASE_URL}${res?.data?.thumbnail}`);
          setEditorContent(res?.data?.content);
        } catch (error: any) {
          message.error(error?.message);
        }
      };
      handleGetNewsDetail();
    }
  }, [id]);

  return (
    <Row className="addOrUpdate-management_container">
      <div className="addOrUpdate-header-management">
        <Breadcrumb title="Thêm tin mới" />
        <Row>
          <Button onClick={handleAddNewsOrUpdate} icon={<PlusIcon />} className="btn btn-add">
            {id ? 'Cập nhật tin' : 'Thêm tin mới'}
          </Button>
        </Row>
      </div>
      <Container className="mt-16">
        <Form
          initialValues={{ position: false }}
          form={form}
          layout="vertical"
          className="addOrUpdate-management_form"
          onFinish={handleSubmit}
        >
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
                <Form.Item name="position" valuePropName="checked" required={false}>
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
