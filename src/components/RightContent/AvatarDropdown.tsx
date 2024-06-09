import { LogoutOutlined, SettingOutlined, UserOutlined, UserSwitchOutlined } from '@ant-design/icons';
// import { useEmotionCss } from '@ant-design/use-emotion-css';
import { history, useModel } from '@umijs/max';
// import { Spin } from 'antd';
import useModal from '@/hooks/useModal';
import ChangePassword from '@/pages/User/ChangePassword';
import { stringify } from 'querystring';
import type { MenuInfo } from 'rc-menu/lib/interface';
import React, { useCallback } from 'react';
import HeaderDropdown from '../HeaderDropdown';

export type GlobalHeaderRightProps = {
  menu?: boolean;
  children?: React.ReactNode;
};

export const AvatarName = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  return <span className="anticon">{currentUser?.name}</span>;
};

export const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({ menu, children }) => {
  const json_user = localStorage.getItem('auth');
  const auth = json_user ? JSON.parse(json_user) : undefined;
  const {
    stateModal: editOrChangePasswordState,
    toggleModal: toggleEditOrChangePasswordModal,
    offModal: offEditOrChangePasswordModal,
  } = useModal();

  const handleToggleModal = () => {
    toggleEditOrChangePasswordModal(true, 'add', auth)();
  };
  /**
   * 退出登录，并且将当前的 url 保存
   */
  const loginOut = async () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('auth');
    const { search, pathname } = history.location;
    if (history.location.search) {
      const urlParams = new URL(history.location.search).searchParams;
      /** 此方法会跳转到 redirect 参数所在的位置 */
      const redirect = urlParams.get('redirect');

      if (window.location.pathname !== '/user/login' && !redirect) {
        history.replace({
          pathname: '/user/login',
          search: stringify({
            redirect: pathname + search,
          }),
        });
      }
    } else {
      if (window.location.pathname !== '/user/login') {
        history.replace({
          pathname: '/user/login',
          search: stringify({
            redirect: pathname + search,
          }),
        });
      }
    }
  };
  // const actionClassName = useEmotionCss(({ token }) => {
  //   return {
  //     display: 'flex',
  //     height: '48px',
  //     marginLeft: 'auto',
  //     overflow: 'hidden',ư
  //     alignItems: 'center',
  //     padding: '0 8px',
  //     cursor: 'pointer',
  //     borderRadius: token.borderRadius,
  //     '&:hover': {
  //       backgroundColor: token.colorBgTextHover,
  //     },
  //   };
  // });
  const { initialState, setInitialState } = useModel('@@initialState');
  console.log('initialState', initialState);

  const onMenuClick = useCallback(
    (event: MenuInfo) => {
      const { key } = event;
      if (key === 'logout') {
        setInitialState((s) => ({ ...s, currentUser: undefined }));
        loginOut();
        return;
      } else if (key === 'changePassword') {
        handleToggleModal();
      }
      // history.push(`/account/${key}`);
    },
    [setInitialState],
  );

  // const loading = (
  //   <span className={actionClassName}>
  //     <Spin
  //       size="small"
  //       style={{
  //         marginLeft: 8,
  //         marginRight: 8,
  //       }}
  //     />
  //   </span>
  // );

  // if (!initialState) {
  //   return loading;
  // }

  // const { currentUser } = initialState;

  // if (!currentUser || !currentUser.name) {
  //   return loading;
  // }

  const menuItems = [
    ...(menu
      ? [
          {
            key: 'center',
            icon: <UserOutlined />,
            label: '个人中心',
          },
          {
            key: 'settings',
            icon: <SettingOutlined />,
            label: '个人设置',
          },
          {
            type: 'divider' as const,
          },
        ]
      : []),
    {
      key: 'changePassword',
      icon: <UserSwitchOutlined />,
      label: 'Thay đổi mật khẩu',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Đăng xuất',
    },
  ];

  return (
    <div>
      <HeaderDropdown
        menu={{
          selectedKeys: [],
          onClick: onMenuClick,
          items: menuItems,
        }}
      >
        {children}
      </HeaderDropdown>
      <ChangePassword
        onCancel={offEditOrChangePasswordModal}
        isActive={editOrChangePasswordState.open}
        data={editOrChangePasswordState?.data}
      />
    </div>
  );
};
