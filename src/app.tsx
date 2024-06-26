/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
import CaretDown from '@/assets/icons/CaretDown.svg';
import {
  AccountActiveIcon,
  AccountInactiveIcon,
  AvatarDropdown,
  DashboardActiveIcon,
  DashboardInactiveIcon,
  HomeActiveIcon,
  HomeInactiveIcon,
  ListIcon,
  NewsActiveIcon,
  NewsInactiveIcon,
  NotificationActiveIcon,
  NotificationInactiveIcon,
  ProductActiveIcon,
  ProductIactiveIcon,
  SettingsActiveIcon,
  SettingsIactiveIcon,
} from '@/components';
import type { RunTimeLayoutConfig } from '@umijs/max';
import { history, useModel } from '@umijs/max';
import { Col, ConfigProvider, Layout, Row, Typography } from 'antd';
import { useState } from 'react';
import { Provider } from 'react-redux';
import defaultSettings from '../config/defaultSettings';
import './Global.scss';
import { ESidebarPath } from './constants/enum';
import { errorConfig } from './requestErrorConfig';
import store from './store';
const { Header } = Layout;

const loginPath = '/user/login';

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: any;
  loading?: boolean;
  currentUser?: string;
  fetchUserInfo?: () => Promise<API.CurrentUser | undefined>;
}> {
  if (localStorage.getItem('accessToken') && window.location.pathname === loginPath) {
    history.push('/');
  }
  if (window.location.pathname !== loginPath) {
    const currentUser = localStorage.getItem('accessToken') || undefined;
    return {
      currentUser: currentUser,
      settings: defaultSettings,
    };
  }

  return { settings: defaultSettings };
}

const renderSideBarIcon = (path: string, hasSubmenu = false, isCollapse: boolean) => {
  const currentPathName = window.location.pathname;

  switch (path) {
    case ESidebarPath.DASHBOARD:
      return currentPathName.includes(path) ? <DashboardActiveIcon /> : <DashboardInactiveIcon />;
    case ESidebarPath.MAINTENANCE:
      return currentPathName.includes(path) ? <SettingsActiveIcon /> : <SettingsIactiveIcon />;
    case ESidebarPath.PRODUCT:
      return currentPathName.includes(path) ? <ProductActiveIcon /> : <ProductIactiveIcon />;
    case ESidebarPath.NEW:
      return currentPathName.includes(path) ? <NewsActiveIcon /> : <NewsInactiveIcon />;
    case ESidebarPath.NOTIFICATION:
      return currentPathName.includes(path) ? <NotificationActiveIcon /> : <NotificationInactiveIcon />;
    case ESidebarPath.ACCOUNT:
      return currentPathName.includes(path) ? <AccountActiveIcon /> : <AccountInactiveIcon />;
    case ESidebarPath.SCHOOL:
      return currentPathName.includes(path) ? <HomeActiveIcon /> : <HomeInactiveIcon />;

    default:
      break;
  }
};

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }) => {
  const { initialState: initialModelState }: any = useModel('@@initialState');
  const [isCollapse, setIsCollapse] = useState<boolean>();
  const json_user = localStorage.getItem('auth');
  const auth = json_user ? JSON.parse(json_user) : undefined;
  const src = auth?.avatar || 'https://sport-stretching.s3.us-west-2.amazonaws.com/1702005408_4k-image.jpg';
  return {
    actionsRender: () => [],
    logo: () => {
      return <></>;
    },
    avatarProps: {
      src: src,
      title: '',
      render: (_, avatarChildren) => {
        return (
          <Provider store={store}>
            <AvatarDropdown>
              <div className="header-avatar__container">
                {avatarChildren}
                <div className="header-avatar__container">
                  <Typography.Title className="formTypo" level={5}>
                    {auth?.fullName || 'Admin'}
                  </Typography.Title>
                  <img src={CaretDown} alt={'CaretDown'} />
                </div>
              </div>
            </AvatarDropdown>
          </Provider>
        );
      },
    },

    onCollapse: (collapsed: boolean) => {
      setIsCollapse(collapsed);
    },
    // footerRender: () => <Footer />,
    menuDataRender: (menuList) =>
      menuList.map((item) => {
        const hasSubmenu = item.children && item.children.length > 0;
        const localItem = {
          ...item,
          icon: renderSideBarIcon(item.path as string, hasSubmenu, isCollapse as never),
        };
        return localItem;
      }),

    onPageChange: () => {
      const { location } = history;
      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.push(loginPath);
      }
    },
    menuHeaderRender: () => {
      return (
        <div className="header-logo__container">
          <Typography.Title className="fontTitle" level={5}>
            SKYT&D
          </Typography.Title>
          <Typography.Title className="fontText" level={5}>
            Nước sạch học đường
          </Typography.Title>
        </div>
      );
    },
    headerContentRender: () => {
      return (
        <Row className="layout-header__container" gutter={[8, 8]}>
          <Col className="mt-16">
            <ListIcon />
          </Col>
          <Col>
            <Typography.Title style={{ marginTop: -4 }} className="fontTitle" level={5}>
              {initialModelState?.data || '...'}
            </Typography.Title>
          </Col>
        </Row>
      );
    },

    childrenRender: (children) => {
      // if (initialState?.loading) return <PageLoading />;
      return (
        <Provider store={store}>
          <ConfigProvider
            theme={{
              token: {
                fontFamily: 'Nunito',
              },
            }}
          >
            {/* <ProLayout>
              <PageContainer fixedHeader > */}
            {children}
            {/* </PageContainer>
            </ProLayout> */}
          </ConfigProvider>
        </Provider>
      );
    },
    ...initialState?.settings,
  };
};

/**
 * @name request 配置，可以配置错误处理
 * 它基于 axios 和 ahooks 的 useRequest 提供了一套统一的网络请求和错误处理方案。
 * @doc https://umijs.org/docs/max/request#配置
 */
export const request = {
  ...errorConfig,
};
