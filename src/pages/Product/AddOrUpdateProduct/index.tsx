/* eslint-disable @typescript-eslint/no-unused-vars */
import { Breadcrumb, Container, InputUI, PlusIcon, PlusX2Icon, SelectUI } from '@/components';
import { DEFAULT_PAGE_NUMBER, DEFAULT_SIZE_PAGE_MAX } from '@/constants';
import { BASE_URL } from '@/constants/urls';
import useLoading from '@/hooks/useLoading';
import { IDataCommon } from '@/models/common.model';
import { IProduct } from '@/models/product.model';
import { getListCategoryAPI } from '@/services/api/category';
import { UploadImagesMultiplieApi } from '@/services/api/common';
import { createProductAPI, getDetailProductAPI, updateProductAPI } from '@/services/api/product';
import {
  allowedFormatsImage,
  checkKeyCode,
  handleBeforeSaveLoadImage,
  handleImageProcessing,
  onPreviewAllFile,
  removeImageUrls,
  updateEditorContent,
  updateImageUrls,
  uploadPlugin,
} from '@/utils/common';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import { history, useParams } from '@umijs/max';
import { Button, Col, Form, Row, Upload, UploadFile, message } from 'antd';
import { UploadProps } from 'antd/lib';
import React, { useEffect, useState } from 'react';

import { checkKeyCodeDiscount } from './../../../utils/common';
import './AddOrUpdateProduct.scss';

const AddOrUpdateProduct = () => {
  const [form] = Form.useForm();
  const { isLoading, withLoading } = useLoading();
  const { id } = useParams<{ id: string }>();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [editorContent, setEditorContent] = useState<string>('');
  const [listCategory, setListCategory] = useState<IDataCommon[]>();

  /* Props upload file list */
  const propsUploadListPhoto: UploadProps = {
    beforeUpload: (file: any) => {
      const isAllowed = allowedFormatsImage.includes(file.type);
      if (!isAllowed) {
        message.error('Bạn chỉ upload được file PNG, JPEG, or JPG file!');
      } else if (file?.size / 1024 / 1024 > 5) {
        message.error('Ảnh không lớn quá 5mb!');
      } else {
        form.setFieldsValue({ thumbnail: file?.name });
        return false;
      }
    },
  };

  /* handle upload image list in Ckeditor */
  const handleUploadImageList = async (editorContent: string) => {
    const listImageCKeditor = await handleBeforeSaveLoadImage(editorContent);
    const uploadResults = await UploadImagesMultiplieApi(listImageCKeditor);
    const imageUrls = uploadResults?.data?.map((item: any) => `common/images/${item?.filename}`);
    return imageUrls;
  };

  /* handle actions news */
  const handleAddProductOrUpdate = async () => {
    await withLoading(async () => {
      try {
        await form.validateFields().then(async (formValues: IProduct) => {
          const imageUrls = await handleImageProcessing(fileList);
          /** CK editor content */
          const uploadedImagesCkeditor = await handleUploadImageList(editorContent);
          const content = await updateEditorContent(uploadedImagesCkeditor, editorContent, true);

          /** Param API */
          const params = {
            ...formValues,
            price: Number(formValues.price),
            discount: Number(formValues.discount) || 0,
            images: imageUrls,
            content: removeImageUrls(content),
          };

          /** Check Id  */
          if (id) {
            await updateProductAPI({ ...params, id: id });
            message.success('Cập nhật sản phẩm thành công');
          } else {
            await createProductAPI(params);
            message.success('Thêm sản phẩm thành công');
          }
          await history.push('/products');
        });
      } catch (error: any) {
        if (!error?.errorFields) {
          message.error(error?.message);
        }
      }
    });
  };

  /* Changed file list */
  const onChangeFileList: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    const result = newFileList.map((item) => ({ file: item, name: item?.name }));
    form.setFieldValue('images', result);
  };

  /** Use Effect */
  useEffect(() => {
    const handleGetListCategory = async () => {
      try {
        const res = await getListCategoryAPI({
          pageSize: DEFAULT_SIZE_PAGE_MAX,
          page: DEFAULT_PAGE_NUMBER,
        });
        setListCategory(res?.data);
      } catch (error: any) {
        message.error(error?.message);
      }
    };
    handleGetListCategory();
  }, []);

  useEffect(() => {
    if (id) {
      const handleGetProductDetail = async () => {
        try {
          const res = await getDetailProductAPI(id);
          const setInitialForm = {
            code: res?.data?.code,
            name: res?.data?.name,
            price: res?.data?.price,
            discount: res?.data?.discount,
            categoryProductId: res?.data?.categoryProduct?.id,
            content: '',
            images: res?.data?.images,
          };
          form?.setFieldsValue(setInitialForm);
          const fileListData = res?.data?.images.map((item: any) => ({
            uid: item,
            name: item.split('/').pop(),
            status: 'hasExits',
            url: `${BASE_URL}/${item}`,
          }));
          setFileList(fileListData);
          setEditorContent(updateImageUrls(res?.data?.content));
        } catch (error: any) {
          message.error(error?.message);
        }
      };
      handleGetProductDetail();
    }
  }, [id]);

  return (
    <Row className="product_action-management_container">
      <div className="product_action-header-management">
        <Breadcrumb title={id ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm mới'} />
        <Row>
          {/* <Button loading={isLoading} onClick={handleAddProductOrUpdate} icon={<PlusIcon />} className="btn btn-add">
            {id ? 'Lưu cập nhật' : ' Thêm sản phẩm'}
          </Button> */}
        </Row>
      </div>

      <Form style={{ width: '100%' }} form={form} layout="vertical" className="product_action-management_form mt-16 ">
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
                  { max: 255, message: 'Mã sản phẩm giới hạn 255 ký tự' },
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
                  { max: 255, message: 'Tên sản phẩm giới hạn 255 ký tự' },
                ]}
              >
                <InputUI placeholder="Nhập tên sản phẩm" />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item
                label="Giá tiền gốc: "
                name="price"
                required={true}
                rules={[
                  {
                    required: true,
                    message: 'Giá tiền không được để trống',
                  },
                ]}
              >
                <InputUI onKeyDown={(e: any) => checkKeyCode(e)} placeholder="Số tiền sản phẩm" />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item className="mb-0" label="% Giảm giá" name="discount" required={false}>
                <InputUI defaultValue={0} onKeyDown={(e: any) => checkKeyCodeDiscount(e)} />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                className="mb-0"
                label="Loại sản phẩm: "
                name="categoryProductId"
                required={true}
                rules={[
                  {
                    required: true,
                    message: 'Loại sản phẩm không được để trống',
                  },
                ]}
              >
                <SelectUI
                  showSearch
                  placeholder="Số tiền sản phẩm"
                  optionFilterProp="children"
                  filterOption={(input: any, option: any) =>
                    (option?.label?.toLowerCase() ?? '').includes(input.toLowerCase())
                  }
                  filterSort={(optionA: any, optionB: any) =>
                    (optionA?.label?.toLowerCase() ?? '').localeCompare(optionB?.label?.toLowerCase())
                  }
                  options={listCategory?.map((item) => {
                    return {
                      value: item?.id,
                      label: item.name,
                    };
                  })}
                />
              </Form.Item>
            </Col>
          </Row>
        </Container>

        <Container className="mt-24">
          <Row className="session-body-image_container">
            <Col span={24}>
              <Form.Item
                className="mb-0 title-img-product__upload"
                label="Hình ảnh sản phẩm:"
                name="images"
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
                    multiple={true}
                    fileList={fileList}
                    onChange={onChangeFileList}
                    onPreview={onPreviewAllFile}
                    {...propsUploadListPhoto}
                  >
                    {fileList?.length < 20 && <PlusX2Icon />}
                  </Upload>
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

          <Row className="mt-20" justify={'end'} gutter={[10, 10]}>
            <Col>
              <Button
                onClick={() => {
                  history.back();
                }}
                className="btn btn-cancel"
              >
                {'Hủy thao tác'}
              </Button>
            </Col>
            <Col>
              <Button
                onClick={handleAddProductOrUpdate}
                loading={isLoading}
                icon={<PlusIcon />}
                className="btn btn-add"
              >
                {id ? 'Cập nhật tin' : 'Thêm tin mới'}
              </Button>
            </Col>
          </Row>
        </Container>
      </Form>
    </Row>
  );
};

export default React.memo(AddOrUpdateProduct);
